# Technical Requirements Document (TRD)

> **Reasoning Preamble**
> The central tension in building a scraping-powered search platform is that scraping is inherently brittle, but search requires freshness. Freshness requires constant re-scraping, turning a data problem into a reliability problem. The trade-off is between index freshness and infrastructure cost; we accept slight staleness (e.g., 1-week old index for static notes) to avoid burning money on constant recrawls. For a startup team with limited ops bandwidth, the architecture must be simple, queue-driven, and highly resilient to partial failures. If a scraper fails, the queue must catch it, the search engine must serve the old result, and the user must never know.

## 1. High-Level Architecture
**Philosophy:** Asynchronous ingestion, synchronous delivery. The user-facing search path must be completely decoupled from the messy, slow, and error-prone scraping path. 

- **Frontend (Next.js):** Handles UI and SSR.
- **API Gateway/Backend (FastAPI):** Serves search queries and manages ingestion triggers.
- **Search Engine (Meilisearch):** The fast read layer.
- **Source of Truth (PostgreSQL):** The durable write layer.
- **Worker Tier (Celery/Redis):** The heavy lifting (scraping, parsing).

## 2. Backend Module Breakdown
1. **Search API Module:** 
   - *Responsibility:* Route user queries to Meilisearch, format results.
   - *MUST NEVER:* Block on a database write or file download.
2. **Ingestion API Module:** 
   - *Responsibility:* Accept URLs for scraping, push jobs to Redis.
   - *MUST NEVER:* Process the scrape synchronously.
3. **Scraper Worker Module:**
   - *Responsibility:* Fetch HTML/PDFs, handle rate limits.
   - *MUST NEVER:* Update the search index directly (writes to Postgres instead).
4. **Parser Worker Module:**
   - *Responsibility:* Extract text and metadata from files.
   - *MUST NEVER:* Crash the main worker process if a PDF is corrupted.

## 3. Service Responsibilities
- **PostgreSQL:** *Prevents* data loss. *Introduces* read bottleneck if queried directly for search.
- **Meilisearch:** *Prevents* slow search queries. *Introduces* data duplication and sync overhead.
- **Redis:** *Prevents* scraper surges from crushing the DB (queue). *Introduces* memory limits.
- **Celery:** *Prevents* blocking the API. *Introduces* operational complexity (monitoring workers).

## 4. API Architecture
- **Contract Philosophy:** RESTful, strict JSON schemas via Pydantic.
- **Versioning:** URI versioning (`/api/v1/search`). Breaking changes require a `v2` endpoint; `v1` is maintained for 6 months minimum.
- **Stability Guarantees:** Search endpoint guarantees <500ms response. Ingestion endpoint guarantees 202 Accepted, not immediate processing.

## 5. Database Architecture & Schema Planning
- **Normalization Decision:** We normalize source domains and categories to save space. We *denormalize* search metadata into a JSONB column (`metadata`) in the `resources` table to avoid complex joins when syncing to Meilisearch. Write penalty: updating metadata requires replacing the JSON object. Read gain: single table select for indexing.

**Key Tables:**
- `resources`: id, url, title, description, resource_type, source_id, metadata (JSONB), created_at.
  - *Index:* B-Tree on `url` (unique constraint), GIN on `metadata`.
- `sources`: id, domain, trust_score, crawl_delay.
- `scrape_logs`: id, resource_id, status, error_message, timestamp.

## 6. Search Indexing Strategy
- **What gets indexed:** Cleaned title, parsed content snippet, resource type, trust score.
- **When:** Async post-save hook on the `resources` table pushes an ID to an `index_sync_queue`.
- **Staleness Window:** Up to 5 minutes between a resource being saved in DB and appearing in search.

## 7. Scraper Architecture
- **JS Rendering:** We route domains requiring JS to Playwright.
- **Rate Limiting:** Redis-backed leaky bucket per domain.
- **Bans/Structure Changes:** If extraction yields < 50 chars of text, we flag for manual review and do not index.
- **Retry:** Exponential backoff. 3 retries max.

## 8. Queue Architecture
- **Topology:**
  - `high_priority`: User-submitted URLs for indexing.
  - `default`: Scheduled recrawls.
  - `heavy_processing`: PDF parsing (runs on CPU-optimized nodes).
- **Dead-Letter:** Failed jobs go to `dead_letter` queue after 3 retries. Reviewed weekly.

## 9. Worker Communication Model
Workers communicate via state updates in PostgreSQL. They pull a job, update status to `PROCESSING`, and on success update to `COMPLETED` and trigger the next queue step (e.g., Scrape -> Parse -> Index). Failures update status to `FAILED` with a traceback.

## 10. File Ingestion Pipeline
URL Discovered -> Scraper Worker (Downloads to /tmp) -> Parser Worker (Extracts text) -> Storage Worker (Uploads to MinIO, generates URL) -> DB Sync -> Meilisearch Sync.

## 11. Metadata Extraction Pipeline
Raw Content -> BS4/PyPDF2 -> Extract Title (h1 or PDF metadata) -> Determine Type (Content-Type header) -> Quality Check (Length > 200 words? Has keywords?) -> JSON output.

## 12. Duplicate Detection System
- **Hashing Strategy:** Compute SHA-256 of the *extracted text*, not the binary file (prevents minor metadata changes from bypassing dup checks).
- **Logic:** If SHA matches an existing DB record, discard the new scrape, log as duplicate.

## 13. AI Reranking Architecture (Phase 2)
- **Input:** Top 50 results from Meilisearch + User Query.
- **Model:** Lightweight local cross-encoder (e.g., MiniLM) running as a separate microservice.
- **Fallback:** If AI service > 200ms or down, API returns the base Meilisearch ranking immediately.

## 14. Search Ranking Logic
1. **Keyword Match (Meilisearch default):** Weight 50%.
2. **Source Trust Score:** Weight 30%. (e.g., .edu > github.com > random blog).
3. **Resource Density:** Weight 20%. (Higher text-to-HTML ratio wins).

## 15. Caching Strategy
- **Search Queries:** Redis cache for exact match query strings. TTL: 1 hour.
- **Cache Stampede Prevention:** Return slightly stale data while async worker updates the cache.

## 16. Authentication/Authorization
- **Admin Only (MVP):** JWT tokens stored in HttpOnly cookies. No public user accounts.
- **Authorization:** Middleware checks JWT role. Failure fast-paths to 401.

## 17. Rate Limiting Strategy
- **Public API:** 30 req/min per IP.
- **DDoS Mode:** Cloudflare 'Under Attack' mode handles L7. API drops to 10 req/min.

## 18. Bot Protection System
- **Googlebot/Academic:** Allowed via User-Agent and Reverse DNS validation.
- **Bad Bots:** Blocked via Cloudflare WAF rules and excessive request heuristics in Redis.

## 19. Cloudflare Integration
- **Enabled:** Proxy (Orange Cloud), Bot Fight Mode, Browser Integrity Check, Cache Everything for static assets.
- **Protects against:** Volumetric DDoS, basic scraping, bandwidth theft.

## 20. Logging & Monitoring
- **Logging:** Structured JSON logs. Not logged: User IP in DB (privacy).
- **Monitoring:** Prometheus/Grafana. Key metrics: Search latency p99, Queue depth, Scrape success rate.

## 21. Error Handling Strategy
- **User Errors (4xx):** Invalid query. Logged at INFO.
- **Service Errors (5xx):** DB down. Logged at ERROR, triggers PagerDuty.
- **Infrastructure (Timeouts):** Handled by NGINX/FastAPI limits.

## 22. Async Processing Strategy
- **Sync:** Search queries, fetching a document by ID.
- **Async:** Scraping, PDF parsing, indexing. (User experience dictates search must be instant).

## 23. Deployment Architecture & CI/CD
- **Topology:** Single DigitalOcean droplet (MVP) running Docker Compose. NGINX reverse proxy.
- **CI/CD:** GitHub Actions -> Run tests -> Build Docker images -> SSH & `docker-compose pull && docker-compose up -d`. Rollback via `docker-compose up -d <previous_tag>`.

## 24. Infrastructure Planning
- **Sizing:** 4 CPU / 8GB RAM node.
- **Workload driver:** Celery workers running Playwright are memory hungry. Postgres needs RAM for caching.

## 25. Storage Optimization
- **Hot:** DB and Redis.
- **Cold:** MinIO for PDFs. We don't store raw HTML after parsing.

## 26. Failure Recovery Strategy
- **DB Crash:** Restore from daily backup. RTO: 1 hour. Data loss tolerance: 24 hours (scraping can be redone).

## 27. Performance Optimization
- **What is slow:** Parsing PDFs.
- **Make it fast:** Offload to separate queue, don't block DB transactions while parsing.

## 28. Cost Optimization
- **Control Levers:** Crawl frequency, log retention. MVP cost target < $50/mo.

## 29. Future Microservices Migration
- **Trigger:** When scraper memory usage disrupts the API.
- **First migration:** Separate Scraper Worker into its own deployable unit.

## 30. Suggested Folder Structure
```
backend/
├── main.py          # Entrypoint
├── api/             # Routers
├── core/            # Config
├── db/              # Session, models
├── scrapers/        # Logic for fetching
├── workers/         # Celery tasks
└── search/          # Meilisearch client
```

## 31. Environment Variables
- `DATABASE_URL` (Secret)
- `MEILI_MASTER_KEY` (Secret)
- `REDIS_URL` (Secret)
- `ENVIRONMENT` (Server-side string: dev/prod)

## 32. Data Lifecycle Management
- **Retention:** Failed scrape logs deleted after 30 days. PDFs retained indefinitely unless 404 on re-crawl.
