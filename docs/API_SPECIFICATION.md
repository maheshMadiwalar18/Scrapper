# API Specification

> **Reasoning Preamble**
> The API contract philosophy is strict versioning and schema safety. Pydantic is used extensively on the backend to guarantee that what comes in matches expectations, preventing downstream crashes in the worker tier. We expose public endpoints for search (which are heavily rate-limited and cached) and protected endpoints for admin operations (like triggering scrapes). The trade-off: public APIs require more aggressive defensive programming (like input sanitization and strict timeouts) which adds overhead, but we accept this to prevent DB injection or DoS attacks.

## 1. Global Standards
- **Base URL:** `/api/v1`
- **Format:** `application/json`
- **Authentication:** Bearer token (JWT) for protected routes.
- **Error Format:**
  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Query parameter 'q' is required."
    }
  }
  ```

## 2. Public Endpoints

### 2.1 Search Resources
`GET /search`
**Description:** Main entrypoint for student searches. Routes directly to Meilisearch.
**Query Parameters:**
- `q` (string, required): The search query.
- `type` (string, optional): Filter by resource type (e.g., `PDF`, `REPO`).
- `limit` (int, optional): Default 20, Max 50.
- `offset` (int, optional): Default 0.

**Response (200 OK):**
```json
{
  "hits": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "Operating Systems VTU 5th Sem",
      "url": "https://vtu.ac.in/downloads/os_notes.pdf",
      "resource_type": "PDF",
      "snippet": "...processes use <mark>semaphores</mark> to communicate...",
      "trust_score": 95
    }
  ],
  "processing_time_ms": 12,
  "total": 45
}
```

## 3. Protected Endpoints (Admin Only)

### 3.1 Submit URL for Scraping
`POST /admin/scrape`
**Description:** Pushes a URL or domain to the ingestion queue.
**Body:**
```json
{
  "url": "https://github.com/awesome-vtu-notes",
  "priority": "HIGH",
  "force_recrawl": false
}
```
**Response (202 Accepted):**
```json
{
  "job_id": "job-8f83-4bcd",
  "status": "QUEUED"
}
```

### 3.2 Get Scrape Job Status
`GET /admin/scrape/{job_id}`
**Response (200 OK):**
```json
{
  "job_id": "job-8f83-4bcd",
  "status": "FAILED",
  "error_message": "Timeout extracting text: PDF encrypted."
}
```

## 4. Error Taxonomy
- `400 Bad Request`: Validation failure (Pydantic caught it).
- `401 Unauthorized`: Missing or invalid JWT.
- `403 Forbidden`: Valid JWT, but lacks `SUPERADMIN` role.
- `429 Too Many Requests`: Redis rate limit exceeded.
- `500 Internal Server Error`: Unhandled exception (logs stack trace internally, returns generic message to client).
- `503 Service Unavailable`: Meilisearch or PostgreSQL is unreachable.
