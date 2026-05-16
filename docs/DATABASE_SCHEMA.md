# Database Schema

> **Reasoning Preamble**
> The database is the source of truth, but it is not the read layer for searches. Therefore, the schema is optimized for write-heavy scraping workloads and robust data integrity. We denormalize metadata into JSONB columns because different educational resources (e.g., a PDF vs a GitHub repo) have entirely different metadata shapes. Attempting to strictly relate these via tables creates join hell. The trade-off: updating a single nested field in JSONB is slower than a direct column update, but we accept this because resources are written once and read many times.

## 1. Tables Overview

### 1.1 `sources`
Tracks the domains we scrape from. Used to manage rate limits and trust scores.
- `id` (UUID, Primary Key)
- `domain` (String, Unique) - e.g., "github.com", "vtu.ac.in"
- `trust_score` (Int) - 0 to 100. Higher scores rank better in search.
- `crawl_delay` (Int) - Seconds to wait between requests to this domain.
- `is_active` (Boolean) - Allows admins to kill scraping for a domain instantly.
- `created_at` (Timestamp)

### 1.2 `resources`
The core table. Stores the actual discovered educational material.
- `id` (UUID, Primary Key)
- `source_id` (UUID, Foreign Key -> `sources.id`)
- `url` (String, Unique) - The exact URL of the resource.
- `title` (String) - Cleaned title.
- `resource_type` (Enum) - `PDF`, `REPO`, `WEBPAGE`, `VIDEO`.
- `content_hash` (String, Unique) - SHA-256 of the extracted text. Prevents indexing duplicates from mirror sites.
- `metadata` (JSONB) - Flexible storage for type-specific data (e.g., page count for PDFs, star count for Repos).
- `is_indexed` (Boolean) - True if synced to Meilisearch.
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### 1.3 `scrape_logs`
Tracks the ingestion pipeline. High churn table.
- `id` (UUID, Primary Key)
- `url` (String) - The URL attempted.
- `source_id` (UUID, Foreign Key -> `sources.id`, Nullable)
- `status` (Enum) - `PENDING`, `PROCESSING`, `COMPLETED`, `FAILED`, `DUPLICATE`.
- `error_message` (Text, Nullable) - Stack trace or reason for failure.
- `retries` (Int) - Default 0.
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### 1.4 `admin_users`
MVP has no public users, only admins.
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `password_hash` (String)
- `role` (Enum) - `SUPERADMIN`, `MODERATOR`.
- `created_at` (Timestamp)

## 2. Indexing Strategy
- **`sources`**:
  - `B-Tree` on `domain` (for fast duplicate checks during URL discovery).
- **`resources`**:
  - `B-Tree` on `url` (for uniqueness constraint).
  - `B-Tree` on `content_hash` (for duplicate detection before insert).
  - `B-Tree` on `source_id` (for foreign key lookups and cascading deletes).
  - `GIN` on `metadata` (allows querying specific metadata fields if needed for analytics, though search is handled by Meilisearch).
- **`scrape_logs`**:
  - `B-Tree` on `status` (for worker queues to quickly find `PENDING` or `FAILED` jobs).

## 3. Scale Triggers
When `scrape_logs` exceeds 10M rows, query performance for the Celery beat scheduler will degrade.
**Migration:** Partition `scrape_logs` by month, and archive partitions older than 3 months to cold storage, as they are only needed for debugging.
