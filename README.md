<p align="center">
  <h1 align="center">🔍 Scraper</h1>
  <p align="center"><strong>The Digital Librarian for the Open Educational Web</strong></p>
  <p align="center">
    <em>Curated engineering resources. Zero spam. Built for Indian students.</em>
  </p>
</p>

---

## What is Scraper?

Scraper is a **curated educational search engine** purpose-built for engineering students. It discovers, indexes, and surfaces genuinely valuable learning resources — PDFs, handwritten notes, GitHub repositories, previous year papers, roadmaps, and community-curated study material — while aggressively filtering out the SEO spam, paid course landing pages, and engagement-farmed content that dominates general-purpose search engines.

**The problem it solves:** A student searching "Operating Systems notes VTU 5th sem" on Google gets 10 pages of affiliate links, paid course ads, and AI-generated filler. Scraper returns the actual PDF they need in under 2 seconds.

## Why Scraper Exists

| What Google Shows | What Scraper Shows |
|---|---|
| Paid course landing pages | Actual PDF notes and papers |
| SEO-optimized blog spam | Community-curated learning material |
| Affiliate-heavy "top 10" lists | GitHub repos with real content |
| AI-generated filler articles | Handwritten notes and cheatsheets |
| Engagement-farmed content | Structured free learning paths |

## Architecture Overview

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Next.js    │────▶│   FastAPI     │────▶│ PostgreSQL  │
│  Frontend    │     │   Backend     │     │  Database   │
└─────────────┘     └──────┬───────┘     └─────────────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │  Redis   │ │Meilisearch│ │  MinIO   │
        │  Cache   │ │  Search   │ │ Storage  │
        └──────────┘ └──────────┘ └──────────┘
              │
              ▼
        ┌──────────────────┐
        │  Celery Workers  │
        │  (Scrapers +     │
        │   Processors)    │
        └──────────────────┘
```

## Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Frontend | Next.js | SSR for SEO, ISR for caching, React ecosystem |
| Backend | FastAPI | Async-native for I/O-heavy scraping, Pydantic schemas |
| Database | PostgreSQL | ACID compliance, pg_trgm, JSONB for flexible metadata |
| Search | Meilisearch → Elasticsearch | Zero-ops MVP, production-grade at scale |
| Cache | Redis | Rate limiting, queues, pub/sub, session store |
| Scraping | Playwright + BeautifulSoup | JS rendering + static HTML parsing |
| Queue | Celery + Redis | Python-native, battle-tested task queue |
| Storage | MinIO (S3-compatible) | Object durability, CDN compatibility, signed URLs |
| Proxy | NGINX | Request routing, rate limiting, static serving |
| Protection | Cloudflare | DDoS protection, bot management, edge caching |
| Containers | Docker + Docker Compose | Reproducible environments, easy deployment |

## Project Structure

```
scraper/
├── frontend/              # Next.js application
├── backend/               # FastAPI application
│   ├── api/               # API routes and endpoints
│   ├── core/              # Configuration, security, dependencies
│   ├── models/            # SQLAlchemy ORM models
│   ├── schemas/           # Pydantic request/response schemas
│   ├── services/          # Business logic layer
│   ├── scrapers/          # Web scraping modules
│   ├── workers/           # Celery task definitions
│   └── utils/             # Shared utilities
├── docs/                  # Engineering documentation
│   ├── PRD.md             # Product Requirements Document
│   ├── TRD.md             # Technical Requirements Document
│   ├── SYSTEM_DESIGN.md   # Complete System Design
│   ├── DATABASE_SCHEMA.md # Schema with reasoning
│   ├── API_SPECIFICATION.md # API contracts
│   └── ARCHITECTURE_DIAGRAMS.md # All system diagrams
├── infrastructure/        # Docker, NGINX, deployment configs
├── scripts/               # Utility and migration scripts
├── tests/                 # Test suites
├── docker-compose.yml     # Development environment
├── .env.example           # Environment variable template
└── README.md              # This file
```

## Quick Start

```bash
# Clone the repository
git clone https://github.com/Sadiq-Kolakar/scraper.git
cd scraper

# Copy environment variables
cp .env.example .env

# Start all services with Docker Compose
docker-compose up -d

# Frontend runs on http://localhost:3000
# Backend API runs on http://localhost:8000
# Meilisearch dashboard on http://localhost:7700
# MinIO console on http://localhost:9001
```

## Documentation

| Document | Description |
|----------|-------------|
| [Product Requirements (PRD)](docs/PRD.md) | Product vision, features, user personas, MVP scope |
| [Technical Requirements (TRD)](docs/TRD.md) | Architecture decisions, schemas, APIs, infrastructure |
| [System Design](docs/SYSTEM_DESIGN.md) | FAANG-grade system design with traversal flows |
| [Database Schema](docs/DATABASE_SCHEMA.md) | Complete schema with indexing strategy |
| [API Specification](docs/API_SPECIFICATION.md) | Full API contracts and error taxonomy |
| [Architecture Diagrams](docs/ARCHITECTURE_DIAGRAMS.md) | All system diagrams (Mermaid) |

## Core Design Principles

1. **Curation over Coverage** — Index only valuable resources, not everything
2. **Speed over Polish** — Sub-2s results on 4G, minimal JS bundle
3. **Resilience over Features** — Degrade gracefully, never crash entirely
4. **Privacy over Analytics** — No tracking, no ads, no data selling
5. **Transparency over Magic** — Show students WHY a result is ranked where it is

## License

MIT License — See [LICENSE](LICENSE) for details.

---

<p align="center">
  <strong>Built for students, by students.</strong><br>
  <em>Because finding study material shouldn't require 47 browser tabs.</em>
</p>
