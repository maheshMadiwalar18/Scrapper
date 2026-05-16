# Folder Structure

> **Reasoning Preamble**
> The folder structure splits the frontend and backend completely. The backend is structured using Domain-Driven Design (DDD) principles because a monolithic `models.py` or `views.py` becomes unmaintainable when the scraping logic grows complex. By separating `api`, `services`, and `workers`, we ensure that the API layer never imports from the heavy worker layer.

```text
scrapper/
├── frontend/                  # Next.js Application
│   ├── src/
│   │   ├── app/               # App Router pages (page.tsx, layout.tsx)
│   │   ├── components/        # Reusable UI components
│   │   ├── lib/               # Utility functions, API clients
│   │   └── styles/            # Tailwind/CSS
│   ├── public/
│   ├── package.json
│   └── next.config.js
│
├── backend/                   # FastAPI Application
│   ├── app/
│   │   ├── api/               # API Routers (v1/search.py, v1/admin.py)
│   │   ├── core/              # Config, Security, DB initialization
│   │   ├── db/                # SQLAlchemy Models & Migrations (Alembic)
│   │   ├── schemas/           # Pydantic Models (Input/Output validation)
│   │   ├── services/          # Business logic (e.g., search_service.py)
│   │   ├── scrapers/          # Extraction logic (BS4/Playwright scripts)
│   │   ├── workers/           # Celery tasks (tasks.py, celery_app.py)
│   │   └── search/            # Meilisearch client wrapper
│   ├── requirements.txt
│   ├── Dockerfile
│   └── main.py                # FastAPI entrypoint
│
├── docs/                      # Engineering Blueprints
│   ├── PRD.md
│   ├── TRD.md
│   ├── SYSTEM_DESIGN.md
│   ├── DATABASE_SCHEMA.md
│   ├── API_SPECIFICATION.md
│   └── ARCHITECTURE_DIAGRAMS.md
│
├── infrastructure/            # Deployment Configurations
│   ├── nginx/
│   │   └── nginx.conf
│   └── prometheus/
│
├── scripts/                   # DB backups, manual sync scripts
├── .env.example
├── docker-compose.yml
├── .gitignore
└── README.md
```
