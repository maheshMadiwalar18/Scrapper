# Product Requirements Document (PRD)

> **Reasoning Preamble**
> The central tension in building Scraper is balancing comprehensiveness with quality filtering. A search engine that indexes everything becomes Google; its value proposition is lost. However, filtering too aggressively might hide niche, valuable content. The trade-off is accepting a smaller, highly curated index over a massive, noisy one. This means we trade recall for precision. For an Indian engineering student on a 4G connection during exam season, the product must be brutally minimal, fast, and devoid of marketing fluff. The constraint of "low latency and high relevance under pressure" dictates a UI with zero onboarding, no popups, and a backend focused on surfacing PDFs and GitHub repos directly, bypassing SEO-optimized intermediary pages.

## 1. Product Vision
Scraper is a hyper-focused educational search engine that cuts through the noise of modern web search. It empowers engineering students to instantly find high-quality, free learning resources—like PDFs, handwritten notes, and code repositories—without wading through paid courses, affiliate blogs, or SEO spam. It is the librarian for the open educational web.

## 2. Problem Statement
When a computer science student in a Tier-2 Indian city searches for "Operating Systems VTU 5th sem notes pdf" at 2 AM the night before an exam, they are met with a barrage of obstacles. They click on a promising link, only to find a 2,000-word SEO article that eventually leads to a broken Google Drive link, a paywall, or a prompt to download a shady app. The failure is not a lack of content; it is the burying of actual educational material beneath engagement-farmed garbage. The student loses time, focus, and trust in the search experience.

## 3. Goals and Non-Goals
### Goals
- Surface direct links to educational resources (PDFs, repositories, academic sites) within top 3 results.
- Achieve sub-2-second search result rendering on standard 4G networks.
- Maintain a spam-free index through aggressive quality filtering and source whitelisting.
- Provide a clean, distraction-free interface focused purely on search and download.

### Non-Goals
- **General Web Search:** We do not index news, entertainment, or general queries. *Why: Dilutes the core value proposition and increases infrastructure costs exponentially.*
- **Hosting User Uploads (Initially):** We do not act as a primary file host for user-generated content. *Why: Introduces massive moderation, copyright, and storage cost burdens. We are an index, not a drive.*
- **Social Features/Forums:** No commenting, upvoting, or user profiles. *Why: Adds operational complexity and distracts from the core utility of fast retrieval.*
- **Paid Course Aggregation:** We explicitly filter out Udemy, Coursera, etc. *Why: Students already know how to find paid courses; our mission is discovering free, open resources.*

## 4. User Personas
1. **The Exam Crammer (Primary):**
   - *Context:* Tier-3 college, slow 4G, studying 12 hours before the exam.
   - *Intent:* Exact match for syllabus topics, previous year papers, concise handwritten notes.
   - *Pressure:* Extremely high; zero tolerance for slow pages or misleading links.
2. **The Self-Taught Developer:**
   - *Context:* Learning web development on a budget, using a shared Wi-Fi connection.
   - *Intent:* Discovering high-quality GitHub repos, structured roadmaps, and ad-free tutorials.
   - *Pressure:* Medium; values depth and code quality over immediate summaries.
3. **The Resource Hoarder:**
   - *Context:* Early semester, organizing study material for the upcoming months.
   - *Intent:* Finding comprehensive textbooks, lecture slides, and complete course materials.
   - *Pressure:* Low; values comprehensiveness and file format (clean PDFs).

## 5. User Pain Points & Feature Mapping
- **Pain Point:** Clicking a search result and getting a marketing page instead of notes.
  - *Feature:* **Direct Resource Surfacing.** We extract and link directly to the underlying PDF or repo, bypassing the fluff page where legally/technically feasible, or clearly labeling the destination type.
- **Pain Point:** Slow loading pages filled with ads on bad internet.
  - *Feature:* **Minimalist Search UI.** Text-only results, no images unless necessary, no client-side heavy frameworks for the core search path.
- **Pain Point:** Downloading a file only to realize it's a completely different subject or spam.
  - *Feature:* **AI-Assisted Relevance Badges.** We parse the first few pages of a PDF to verify subject match and display a "Verified Match" badge.

## 6. Product Philosophy
To remain true to our mission, Scraper will consistently sacrifice:
- **Visual Flashiness** for **Load Speed.** (No complex animations).
- **Index Size** for **Index Quality.** (We will drop 100 mediocre tutorials to keep 1 excellent one).
- **Engagement Metrics (Time on Site)** for **Utility.** (If a user finds a PDF and leaves in 5 seconds, that is a success, not a failure).
- **Broad Appeal** for **Niche Utility.** (We only serve engineering and tech students).

## 7. Core Platform Features
1. **The Core Search Engine:**
   - *What:* A blazing-fast search bar that accepts natural language or keyword queries.
   - *Why:* The entry point for all value.
   - *What breaks if removed:* The entire product.
2. **Resource Type Filters (PDF, Repo, Video, Paper):**
   - *What:* One-click filters to restrict results to specific formats.
   - *Why:* Students often know exactly what format they need (e.g., "I just want a PDF").
   - *What breaks if removed:* Search precision drops; users have to manually sift through mixed results.
3. **Direct File Preview/Download:**
   - *What:* Ability to see metadata (page count, size) and download directly.
   - *Why:* Saves the user from navigating to a slow third-party site if the file is cached/indexed safely.
   - *What breaks if removed:* Friction increases significantly.

## 8. Search Workflow
1. **Query Entry:** User types query on a minimal homepage (Google-style).
2. **Instant Suggest (Debounced):** Fast autocomplete for common engineering subjects/universities.
3. **Query Parsing:** System identifies intent (e.g., "vtu" -> university, "pdf" -> filetype, "os" -> subject).
4. **Result Rendering:** Results appear in <2s. Each card shows Title, File Type, Source Domain, Snippet, and Quality Score.
5. **Evaluation:** User scans snippets (which highlight the exact query match within the document).
6. **Action:** User clicks a result. If it's a direct file (PDF), it opens/downloads. If it's a repo, it links to GitHub.

## 9. Resource Ranking Philosophy
Signal hierarchy (What matters most to least):
1. **Exact Content Match (Un-gameable):** Does the text inside the actual PDF/Repo match the query?
2. **Domain Authority (Curated):** Is this from a known university (.edu), GitHub, or a whitelisted community site?
3. **Resource Density:** Does the document have a high ratio of informational text to boilerplate?
4. **Community Usage (Future):** Do students actually download this?
*What cannot be gamed:* We do not rank based on backlinks, meta keywords, or page length. We rank based on the extracted, parsed content of the educational resource itself.

## 10. Search Filtering System
From the student's perspective, filters must be functional:
- **Format:** PDF, GitHub Repo, Web Page, Slide Deck. (Because studying from a PDF is different from reading a repo).
- **Source Type:** University Official, Student Notes, Cheatsheet.
- **Year/Freshness:** Especially for syllabus-dependent material or previous year papers.

## 11. Download Experience
- **UX Reasoning:** Downloads must be frictionless but secure. We provide direct links when the source is highly trusted. If we proxy the download, it must stream efficiently.
- **Security Reasoning:** We must scan for basic malware signatures on indexed files. We do not execute files. PDFs and text only.

## 12. User Experience Principles
- **Rule 1:** The search bar must auto-focus on page load.
- **Rule 2:** No layout shifts (CLS = 0) while results load.
- **Rule 3:** Every result must clearly indicate its destination domain and file type before the user clicks.
- **Rule 4:** Zero pop-ups, modals, or sign-up walls to view results.

## 13. Functional Requirements
- The system MUST return search results for 95% of queries in under 500ms server response time.
- The system MUST parse and index text content from PDFs up to 50MB.
- The system MUST support boolean search operators (AND, OR, -).
- The system MUST automatically classify resources into predefined categories (Notes, Papers, Books, Code).

## 14. Non-Functional Requirements
- **Latency:** < 500ms p95 server response time for search queries. *Reasoning: Required for snappy feel on slow networks.*
- **Uptime:** 99.9% during peak exam months (Nov/Dec, April/May). *Reasoning: Downtime during exams destroys trust permanently.*
- **Throughput:** Capable of handling 1000 searches/minute during peaks.

## 15. Admin Capabilities
- **Trust & Safety:** Admins can instantly blacklist a domain or specific URL pattern if SEO spam sneaks in.
- **Curation:** Admins can manually boost specific high-quality resources for common queries (e.g., pinning a known excellent OS cheatsheet).
- **Monitoring:** View indexing pipeline health and failed parse jobs.

## 16. AI Usage Boundaries
- **Where AI IS used:** Reranking search results based on semantic relevance, extracting summaries from PDFs, classifying document types.
- **Where AI is NOT used:** Generating synthetic study material or answering questions directly (no chatbot).
- **Boundary Reasoning:** We are a discovery engine, not an oracle. AI hallucinating a fact in a study note could fail a student. AI is strictly used for *routing and ranking*, not *authoring*.

## 17. Security Expectations
- **Threat Model 1: The Competitor Scraper.** Malicious actors scraping our index. *Mitigation:* Strict rate limiting and Cloudflare bot protection.
- **Threat Model 2: The SEO Spammer.** Bad actors submitting URLs or tricking our crawlers. *Mitigation:* Domain whitelisting, content density analysis, avoiding open URL submission forms.
- **Threat Model 3: Malicious Files.** Indexing PDFs with payloads. *Mitigation:* Sandboxed parsing, serving files with `Content-Disposition: attachment` and strict MIME types.

## 18. Bot Protection Expectations
- **Good Bots:** Googlebot, Bingbot. We want them to index our curated category pages.
- **Bad Bots:** Aggressive scrapers, vulnerability scanners.
- **Cost-Benefit:** We use Cloudflare free/pro tier. We accept that some determined scrapers will get through, as building bespoke DRM for public data is a waste of engineering time.

## 19. Scalability Expectations
- **Launch:** 1,000 queries/day. Single database, synchronous search.
- **6 Months:** 50,000 queries/day. Introduce Redis caching for top 1000 queries.
- **2 Years:** 500,000 queries/day. Elasticsearch cluster, read replicas for Postgres.

## 20. API Interaction Expectations
- **Internal Only:** The API is primarily consumed by our Next.js frontend.
- **Trust Level:** Frontend requests are treated as untrusted. Rate limiting is applied by IP.

## 21. Monetization Opportunities
- **Mission-Destroying Models:** Ads injected into results, paying to rank higher, charging students for access.
- **Viable Models:** Sponsorships from tech companies hiring engineers (e.g., "Sponsored by GitHub" tasteful banner), API access for institutional researchers, affiliate links for hardware/books (clearly marked and separated from notes).

## 22. Risks and Constraints
| Risk | Probability | Impact | Detection | Mitigation |
|---|---|---|---|---|
| Indexing Pipeline blocks | High | High | Queue monitoring | Fallback to older index, auto-restart workers |
| Cloud costs explode due to scraping | Medium | High | Billing alerts | Strict timeouts, restrict crawl depth, block large files |
| Copyright takedowns (DMCA) | Medium | Medium | Abuse email inbox | Prompt removal, automated blocklist, we don't host the files (mostly link) |

## 23. MVP Scope
**IN Scope:**
- Search bar with Meilisearch backend.
- Scraper pipeline for 5 high-yield whitelisted domains (e.g., specific GitHub orgs, university open courseware).
- PDF text extraction for ranking.
- Basic filtering (Notes vs Papers).

**OUT of Scope:**
- AI Semantic Reranking (adds latency and cost; keyword search is fine for MVP).
- User accounts and saved lists (unnecessary friction).
- Image/OCR parsing for scanned handwritten notes (too computationally expensive for MVP).

## 24. Post-MVP Roadmap
1. **Phase 1 (Value Delivery):** OCR for handwritten notes (massive value unlock for Indian context).
2. **Phase 2 (Relevance):** Lightweight AI reranking model for semantic queries.
3. **Phase 3 (Community):** Verified student curators who can suggest repositories.

## 25. Competitive Positioning
- **The Gap:** Google is too broad and easily gamed by SEO. Chegg/CourseHero are paywalled. University portals are fragmented.
- **The Defensibility:** Our moat is the *exclusion* list and the custom scraping pipeline that can parse messy educational PDFs better than generic crawlers. We win by being the fastest path to a free PDF.
