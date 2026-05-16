# Architecture Diagrams

> **Reasoning Preamble**
> Visualizing the architecture forces us to acknowledge failure domains. Every arrow in these diagrams represents a potential point of failure. If an arrow points from the API to the Scraper, the API is vulnerable to Scraper latency. By explicitly drawing queues (Redis) between them, we visually confirm the isolation of concerns. 

## 1. High-Level Architecture (C4 Container Level)

```mermaid
graph TD
    Student[Student on 4G] -->|HTTPS / JSON| CF[Cloudflare CDN/WAF]
    CF -->|HTTPS| NGINX[NGINX Reverse Proxy]
    NGINX -->|HTTP| NextJS[Next.js Frontend]
    NGINX -->|HTTP| FastAPI[FastAPI Backend]
    
    FastAPI -->|TCP| RedisCache[(Redis Cache)]
    FastAPI -->|HTTP| Meili[(Meilisearch)]
    FastAPI -->|TCP| Postgres[(PostgreSQL)]
    
    FastAPI -.->|Push Job| RedisQueue[(Redis Queue)]
    
    RedisQueue -.->|Pop Job| WorkerScrape[Celery Scraper]
    WorkerScrape -->|TCP State Update| Postgres
    WorkerScrape -.->|Push Content| RedisQueue
    
    RedisQueue -.->|Pop Content| WorkerParse[Celery Parser]
    WorkerParse -->|TCP State Update| Postgres
    WorkerParse -->|Upload File| MinIO[(MinIO Storage)]
    WorkerParse -.->|Push Index Job| RedisQueue
    
    RedisQueue -.->|Pop Index Job| WorkerIndex[Celery Indexer]
    WorkerIndex -->|HTTP| Meili
    WorkerIndex -->|TCP State Update| Postgres

    classDef db fill:#f9f,stroke:#333,stroke-width:2px;
    class Postgres,RedisCache,RedisQueue,Meili,MinIO db;
```

## 2. Ingestion Pipeline Traversal

```mermaid
sequenceDiagram
    participant Beat as Celery Beat
    participant Redis as Redis Queue
    participant Scraper as Scraper Worker
    participant Parser as Parser Worker
    participant DB as PostgreSQL
    participant Search as Meilisearch

    Beat->>Redis: 1. Push URL to scrape_queue
    Scraper->>Redis: 2. Pop URL
    Scraper->>DB: 3. UPDATE scrape_logs SET status='PROCESSING'
    Scraper->>Scraper: 4. Playwright fetch & extract raw HTML
    alt Fetch Fails
        Scraper->>DB: UPDATE status='FAILED', retry_count++
    else Fetch Succeeds
        Scraper->>Redis: 5. Push raw HTML/PDF to parse_queue
        Scraper->>DB: 6. UPDATE status='PARSING'
    end
    
    Parser->>Redis: 7. Pop Payload
    Parser->>Parser: 8. Extract Text & Metadata
    Parser->>DB: 9. INSERT INTO resources
    Parser->>Redis: 10. Push DB ID to index_queue
    
    Parser->>Search: 11. Async Index Document
    Parser->>DB: 12. UPDATE is_indexed=true, status='COMPLETED'
```
