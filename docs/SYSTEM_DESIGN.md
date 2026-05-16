# Complete System Design

> **Reasoning Preamble**
> The most common failure mode in search-focused data platforms is data quality degradation. Garbage in, garbage out. The indexing pipeline is where quality is won or lost. The trade-off is between system complexity (adding more parsing and validation steps) and operational resilience (keeping the pipeline simple so it doesn't break). The constraint "must work reliably for students during peak exam season" imposes a design where the read path (search) is completely isolated from the write path (scraping). If the entire ingestion pipeline goes offline, search must remain at 100% availability. Every diagram below enforces this isolation.

## 1. Full Architecture Overview
**Design Philosophy:** Asynchronous ingestion buffering and isolated synchronous serving. 
The unifying principle is that the `FastAPI` serving layer only ever talks to `Meilisearch` and `PostgreSQL` read-replicas. It never waits for a scraper, never parses a PDF, and never talks to an external website directly. The `Celery` worker layer does all the dirty work, communicating its progress via `PostgreSQL` state updates.

## 2. Infrastructure Topology
- **Edge:** Cloudflare (WAF, CDN, DNS).
- **Proxy:** NGINX (TLS termination, static file serving, rate limiting).
- **Compute:** 
  - `web` container (FastAPI)
  - `worker-scrape` container (Celery + Playwright)
  - `worker-parse` container (Celery + PyPDF2/BS4)
  - `worker-beat` container (Celery scheduler)
- **Data Stores:**
  - `db` container (PostgreSQL) -> Primary Failure Domain: Data persistence.
  - `cache` container (Redis) -> Primary Failure Domain: Queue and session loss.
  - `search` container (Meilisearch) -> Primary Failure Domain: Search availability.
  - `storage` container (MinIO) -> Primary Failure Domain: File availability.

## 3. Service-to-Service Relationships
- `FastAPI` -> `PostgreSQL` (TCP/5432, Synchronous, Critical for writes/auth).
- `FastAPI` -> `Meilisearch` (HTTP/7700, Synchronous, Critical for search).
- `FastAPI` -> `Redis` (TCP/6379, Synchronous, Critical for caching/rate limiting).
- `Celery` -> `Redis` (TCP/6379, Async, Message Broker).
- `Celery` -> `PostgreSQL` (TCP/5432, Sync, State updates).
- `Celery` -> `MinIO` (HTTP/9000, Sync, File storage).

## 4. Request Lifecycle (Search Query Traversal)
1. **Student types "OS notes":** Client sends GET `/api/v1/search?q=OS+notes`.
2. **Cloudflare:** Checks WAF rules. Cache Miss (dynamic route). Passes to Origin.
3. **NGINX:** Rate limits by IP. Proxies to FastAPI on port 8000.
4. **FastAPI (Middleware):** Checks Redis for rate limit state. 
5. **FastAPI (Route):** Validates query schema via Pydantic.
6. **FastAPI (Cache Check):** Checks Redis for key `search:os_notes`. Miss.
7. **FastAPI -> Meilisearch:** Executes search query via Meilisearch HTTP client.
8. **Meilisearch:** Returns JSON hits in 20ms.
9. **FastAPI -> Redis:** Stores JSON in Redis with 1hr TTL.
10. **FastAPI -> Client:** Returns HTTP 200 with JSON payload.

## 5. Scraper Traversal Pipeline (Ingestion Flow)
1. **Scheduler:** Celery Beat pushes URL to `scrape_queue` in Redis.
2. **Worker Picks Up:** `worker-scrape` pulls URL. Updates Postgres `scrape_logs` to `PROCESSING`.
3. **Fetch:** Worker uses `Playwright` to fetch HTML. *Failure:* Timeout -> Retry 3 times -> Update DB to `FAILED`.
4. **HTML validation:** Worker checks if content is empty.
5. **Pass to Parser:** Worker pushes HTML payload (or file path) to `parse_queue`.
6. **Parser Worker:** `worker-parse` extracts text using `BeautifulSoup`.
7. **Metadata Extraction:** Extracts Title, Length, Links.
8. **Storage:** If PDF, uploads to MinIO.
9. **DB Sync:** Updates `resources` table in Postgres with extracted text and metadata.
10. **Trigger Index:** Pushes ID to `index_queue`.
11. **Index Worker:** Fetches from DB, pushes to Meilisearch. Updates status to `COMPLETED`.

## 6. Queue Traversal Flow
Producer (FastAPI/Beat) -> Redis (List) -> Consumer (Celery Worker) -> Acknowledge (Remove from list) -> If exception, send to `dead_letter` queue.

## 7. File Parsing Flow
- **Decision Logic:** Worker checks HTTP `Content-Type`.
  - If `application/pdf`: Route to `parse_pdf` task (Uses `pdfplumber`/`PyPDF2`).
  - If `text/html`: Route to `parse_html` task (Uses `Readability` algo + `BS4`).
- **Failure:** If PDF is encrypted or scanned image, task fails gracefully, logs `UNSUPPORTED_FORMAT`, saves URL but marks as unsearchable content.

## 8. Duplicate Detection Flow
1. Text extracted from new resource.
2. Worker computes SHA-256 hash of the cleaned text.
3. Worker queries Postgres: `SELECT id FROM resources WHERE content_hash = ?`.
4. If exists: Mark current scrape job as `DUPLICATE`, discard text.
5. If not exists: Proceed to insert.

## 9. Rate Limiting Traversal
1. Request hits FastAPI middleware.
2. Middleware extracts Client IP.
3. Middleware calls Redis: `INCR limit:{IP}` and `EXPIRE limit:{IP} 60` if new.
4. If value > 30, return `429 Too Many Requests`.

## 10. AI Reranking Flow (Phase 2)
1. Meilisearch returns Top 50 keyword matches.
2. FastAPI sends Top 50 snippets + User Query to local `Reranker` microservice (gRPC).
3. Reranker runs cross-encoder inference (e.g., MS-MARCO model).
4. Reranker returns re-ordered array.
5. FastAPI returns Top 10 to user.
*Fallback:* If Reranker takes >200ms, FastAPI aborts gRPC call and returns the original Meilisearch top 10.

## 11. Security Boundaries
- **Public Internet <-> NGINX:** Untrusted. HTTPS only.
- **NGINX <-> FastAPI:** Semi-trusted. HTTP.
- **FastAPI <-> PostgreSQL/Redis:** Trusted. Internal Docker network only.
- **Celery <-> External Web:** Untrusted. Workers must run in isolated containers with limited privileges to prevent RCE from malicious PDFs/HTML.

## 12. End-to-End Infrastructure Design
(See ARCHITECTURE_DIAGRAMS.md for visual representation)
The system is a classic three-tier architecture augmented with an asynchronous worker tier. 
The bottleneck at scale is PostgreSQL writes during mass scraping, and Meilisearch memory consumption. 
Migration path: 
1. Separate worker containers to different VMs.
2. Move PostgreSQL to a managed cluster.
3. Replace Meilisearch with Elasticsearch cluster.
