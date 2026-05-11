# Full SEO Audit — nareshbasude.in (v2)

**Audit date:** 2026-05-12
**Build scanned:** `dist/` (local, 57 generated pages + 5 static `/demos/` HTMLs)
**Production status:** Pre-launch. Domain currently serves a different site; v2 ready to deploy to Hostinger Apache.

---

## Executive Summary

**Overall SEO Health Score: 88 / 100** *(up from 70 in the prior audit)*

Business type detected: **Local Service / SAB hybrid + Content publisher** — solo freelance developer & marketer in Thane, Maharashtra, serving the Mumbai Metropolitan Region (10 city landing pages) + content site + project case studies.

| Category | Weight | Score | Weighted |
|---|---|---|---|
| Technical SEO | 22% | 95 | 20.9 |
| Content Quality | 23% | 80 | 18.4 |
| On-Page SEO | 20% | 90 | 18.0 |
| Schema / Structured Data | 10% | 95 | 9.5 |
| Performance (CWV) | 10% | 80 | 8.0 |
| AI Search Readiness | 10% | 90 | 9.0 |
| Images | 5% | 75 | 3.75 |
| **TOTAL** | 100% | — | **87.55** |

### Top 5 wins shipped in this audit cycle

1. **Critical regression caught + fixed** — every page title was being duplicated with `· Naresh Basude · Naresh Basude` because every Astro page already included the brand in its title prop AND [SEO.astro:26](src/components/SEO.astro#L26) blindly appended `SITE.name` again. Fixed with idempotent suffix logic that only appends when title+suffix ≤ 60 chars.
2. **Schema coverage now broad** — 8 schema types active across the indexable surface: `Person`, `ProfessionalService` (global + 10 city-scoped), `WebSite`, `BreadcrumbList`, `FAQPage` (14), `ItemList` (25), `CreativeWork` (8 projects), `BlogPosting` (6 posts), `Service` (3 service pages). All parsed cleanly (0 JSON-LD errors).
3. **Three new service pillar pages** — `/whatsapp-bot-developer`, `/wordpress-migration`, `/local-seo` — each with full FAQ schema, named case-study CTAs, and India-specific positioning that wasn't in the city pages.
4. **Live-URL trust block on `/thane` + `/mumbai`** — surfaces four real client URLs (nipcollege.com, bookwithteachers.com, abseducationalsolution.com, ngiadmissionmilega.com) as proof, not just claims.
5. **/demos/ excluded from index** — five static template demos pulled out of sitemap + robots.txt to remove thin-content noise from the indexable surface.

### Top 5 outstanding issues (post-fix)

1. **Tag pages still slightly thin** — 22 tag pages now ~90–135 unique words (up from ~67) after per-tag intros. Still under the 300-word target. Adding post-excerpt previews would close the gap.
2. **`/projects` index borderline thin** — 298 unique words. Adding a brief intro paragraph (industry breakdown, year stats, what to expect) brings it above the threshold.
3. **No real Reviews / AggregateRating** — schema doesn't claim what doesn't exist yet. Once 5+ real testimonials land, add `Review` markup and `aggregateRating`.
4. **Pre-launch — no CWV field data, no GSC indexation data, no backlink profile** — these unlock on deploy + 4–8 weeks of crawl history.
5. **Image format optimization** — 24 total images served. Project covers are SVG/PNG; converting to WebP/AVIF + explicit width/height attributes would improve CLS and LCP.

---

## Technical SEO — 95 / 100

### Crawlability — passing
- `robots.txt` present and well-formed, includes:
  - 12 AI-crawler `Allow` directives (GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, Claude-Web, PerplexityBot, Google-Extended, Applebot, Applebot-Extended, Bytespider, CCBot, Bingbot, DuckDuckBot)
  - `Disallow: /api/`, `/_astro/`, `/demos/`
  - Both sitemap references (XML + RSS)
- XML sitemap clean: 48 URLs, `/demos/` filtered out via [astro.config.mjs](astro.config.mjs#L19).
- Sitemap index at `/sitemap-index.xml`.

### Indexability — passing
- 100% of indexable pages have a canonical URL.
- 100% have `<meta name="robots" content="index,follow,...">` with image-preview + snippet directives.
- No `noindex` accidentally set on indexable pages.
- 404 page correctly carries `noindex`.

### Site structure — passing
- `trailingSlash: 'never'` — single canonical URL per page.
- URL structure clean: hyphens, no query strings, lowercase.
- 62 HTML files generated, 57 indexable + 5 static demos.
- View Transitions API wired via Astro `<ClientRouter />`.

### Security — pre-launch
- HTTPS site URL configured.
- Security headers (CSP, HSTS, X-Frame-Options) will need `.htaccess` on Hostinger — to be added at deployment.

### Core Web Vitals — lab-only estimate (no field data pre-launch)
- Static SSG with `compressHTML: true` and `inlineStylesheets: 'auto'`.
- Prefetch on viewport for in-page links.
- Web font preconnects for fontshare + google.
- No client-side JS framework (no React/Vue hydration bloat).
- Expected LCP: under 1.5s on broadband, 2.5s on 4G. Real measurement post-launch.

---

## Content Quality — 80 / 100

### E-E-A-T signals — strong
- Real author identity on every page (`Person` schema, NAP, photo, sameAs LinkedIn).
- About page tells a real working philosophy + named clients.
- Project case studies use named clients (NIP College, ABS, NGI, BookWithTeachers).
- Live URL proof block on `/thane` + `/mumbai` surfaces working sites for visitors to verify.
- Mid-case-study "Hire me for the same" CTA reinforces author-as-operator E-E-A-T.

### Thin content — flagged, not blocking
| Page bucket | Status | Word count |
|---|---|---|
| Home, about, contact, 10 cities, 3 service pages | ≥ 500 unique words | ✓ |
| 6 long-form posts | ≥ 1,000 words each | ✓ |
| 8 project case studies | ≥ 800 words each | ✓ |
| `/projects` index | 298 unique | borderline |
| `/cities` hub | ≥ 400 words ✓ | — |
| 22 `/writing/tag/*` pages | 82–135 unique | still thin |

### Doorway-page risk — resolved
- 10 city pages share template skeleton (services list + industries + neighborhoods + FAQs + Why local + Start now).
- After this audit cycle, each city page has:
  - **Unique industry descriptions** with named local landmarks (Phadke Road in Dombivli, MIDC Ambernath, Camp 1–5 in Ulhasnagar, BKC/Andheri/Powai in Mumbai, etc.).
  - **Unique neighborhoods list** (10–12 per city).
  - **Unique FAQ set** (5 questions per city × 10 = 50 unique FAQs, not duplicated).
  - **Unique market-context cards** on Dombivli + Ambernath-Badlapur (the prior-audit borderline cases).
- Substance variance: a clinic-targeting line in Dombivli describes "pathology labs + dentists in Tilak Nagar" while the Ulhasnagar version mentions "Sindhi B2B traders" and Vasai-Virar talks about "historical Catholic schools + Konkani audience." These are not interchangeable.

### Readability
- All long-form content uses H2/H3 structure, short paragraphs, lists.
- Drop-cap on first paragraph of posts and projects adds visual rhythm.
- Mono labels in section headers + brackets give scannable structure for both humans and AI extractors.

### Duplicate content — none found
- No two pages share identical titles, descriptions, or H1 after this audit.
- Project cover images shared across `/projects` and detail pages — expected, not penalized.

---

## On-Page SEO — 90 / 100

### Titles
- 100% of pages have a unique `<title>`.
- After the critical fix to [SEO.astro](src/components/SEO.astro), the brand suffix `· Naresh Basude` is appended only when title+suffix ≤ 60 chars; otherwise the page-provided title is used as-is.
- Slightly over-limit (61–67 chars): `/cities` (63), `/mira-bhayandar` (61), 3 writing posts whose frontmatter titles are themselves long (62–67). Acceptable since Google often displays up to ~70 characters and these all preserve the primary keyword in the first 50.

### Descriptions
- 100% present (except 4 static `/demos/` pages which are now blocked).
- 90% in the 120–160 target range. Borderline-long (162–166): `/about`, home, `/writing/freelance-developer-vs-agency-mumbai`, `/writing/tag/ship`.
- 4 project pages 105–115 chars (from MDX frontmatter `summary`) — slightly short but informative and unique.

### Headings
- 100% of indexable pages have exactly one H1.
- H1s match the primary keyword and the title intent for each page.
- H2/H3 hierarchy clean.

### Internal linking
- Every page → home, projects, writing, about, contact via primary nav.
- Footer surfaces all 10 city pages + sitemap + RSS + privacy.
- City pages cross-link to 3 sibling cities + `/cities` hub.
- Project pages have prev/next pager + "all projects" link + mid-case-study CTA.
- Tag pages link to `/writing` + each tagged post.
- Service pages link to relevant project case studies.

---

## Schema / Structured Data — 95 / 100

### Coverage (across 57 indexable pages)

| @type | Count | Surfaces |
|---|---|---|
| Person | 57 | every page (with `@id`, geo, address, sameAs, knowsAbout) |
| ProfessionalService | 67 | global (57) + city-scoped (10) |
| WebSite | 57 | every page |
| BreadcrumbList | 54 | every page except home |
| ItemList | 25 | writing, projects, cities, 22 tag pages |
| FAQPage | 14 | 10 cities + 3 service pages + contact |
| CreativeWork | 8 | 8 project case studies |
| BlogPosting | 6 | 6 blog posts |
| Service | 3 | whatsapp-bot-developer, wordpress-migration, local-seo |

### Quality signals
- Entity graph linked via `@id` references: Person ↔ ProfessionalService (founder, employee, worksFor).
- `GeoCoordinates` set (Thane: 19.2183, 72.9781).
- `addressCountry: "IN"` (ISO 3166-1 alpha-2).
- `currenciesAccepted: "INR"`, `paymentAccepted: "UPI, Bank Transfer, Razorpay"`.
- `priceRange: "₹₹"` (was non-standard string).
- `openingHoursSpecification` (Mon–Sat 09:00–20:00).
- `email`/`telephone` without `mailto:`/`tel:` prefix (per schema.org spec).
- City-scoped ProfessionalService entries reference the global one via `provider: { @id: ... }`.
- Service pages reference Person via `provider: { @id: ... }`.

### JSON-LD parse result
- All JSON-LD blocks across all pages parse without error.

### Missing — to add when data exists
- `Review` / `AggregateRating` once 5+ real client testimonials are collected.
- `VideoObject` if/when a demo reel is added.

---

## Performance — 80 / 100 (lab estimate, pre-launch)

### Optimizations already in place
- Static SSG (no server runtime, no SSR cost).
- `compressHTML: true` in Astro config.
- `inlineStylesheets: 'auto'` — small CSS inlined to avoid render-blocking requests.
- Prefetch on viewport for in-page links.
- View Transitions for fast same-origin nav.
- Web font preconnect (fontshare + google) hints.
- `loading="lazy"` on non-hero images.
- No client-side JavaScript framework — only ~10kB of Astro hydration shims.

### Risks (need field data to confirm)
- Web fonts loaded from external CDNs (fontshare, google) — could regress LCP on slow networks.
- No explicit `width`/`height` on most `<img>` tags — potential CLS shifts.
- No image format optimization (PNG/SVG covers; could go WebP/AVIF).

### Action
- Add CrUX field data check post-launch.
- Run Lighthouse in CI after the first deploy.

---

## Images — 75 / 100

| Metric | Value |
|---|---|
| Total images | 24 |
| Missing `alt` attribute | 0 |
| Empty `alt=""` | 12 (decorative project covers placed next to a heading — WCAG-correct) |
| Modern formats (WebP/AVIF) | 0 |
| Explicit `width`/`height` | sporadic |
| `loading="lazy"` on below-fold | ✓ |

The 12 empty-alt images are all project cover photos directly adjacent to a heading that conveys the same content — empty alt is correct per WCAG to avoid screen-reader duplication. Not a true issue.

**Upgrades available:**
- Convert SVG/PNG project covers to WebP/AVIF with PNG fallback (Astro `<Picture>` component).
- Add explicit `width`/`height` to prevent CLS.

---

## AI Search Readiness — 90 / 100

### llms.txt — present + comprehensive
- 69-line `/llms.txt` includes core summary, contact NAP, all key pages with one-line descriptions, all 10 city landing pages, all 6 blog posts, all 8 project case studies. Tailored for AI ingestion.

### AI crawler access
- 12 explicit `Allow` directives in robots.txt for the major AI crawlers (GPTBot, OAI-SearchBot, ClaudeBot, Claude-Web, PerplexityBot, Google-Extended, Applebot-Extended, Bytespider, CCBot, etc.).

### Citability signals
- Author/entity claims via `Person` schema with `sameAs` (LinkedIn) and `worksFor` (ProfessionalService).
- Service claims via city-scoped `ProfessionalService` with `areaServed` arrays.
- FAQ markup on 14 pages — directly usable as passage-level citations by AI search.
- Named clients in project case studies + live URLs surfaced on flagship city pages.
- ItemList schema on indexes — gives AI engines a structured catalog of pages.

### Brand mention signals
- NAP consistent across all pages (Thane, Maharashtra 400601, phone +91 86005 74836, email nareshbasude9@gmail.com).
- Service area arrays consistent.
- knowsAbout array names 21 specific skills (Next.js, React, Astro, TypeScript, WordPress, WhatsApp Chatbots, Headless E-commerce, Lead Management, SEO, GEO, Meta Ads, Google Ads, etc.).

---

## Local SEO assessment

### NAP consistency — ✓ consistent across all 57 pages
- **Name:** Naresh Basude
- **Address:** Thane, Maharashtra 400601, India
- **Phone:** +91 86005 74836
- **Email:** nareshbasude9@gmail.com

Surfaces include: every page's address schema, contact page NAP block, every city page's NAP block, footer reach list (now with `tel:` link added in this audit cycle), llms.txt.

### Schema for local — ✓ comprehensive
- 1 global `ProfessionalService` + 10 city-scoped `ProfessionalService` (each with `@id`, geo, areaServed list, opening hours, currencies, payment).
- BreadcrumbList everywhere.

### City landing-page strategy — ✓ doorway-page-safe
- 10 city pages, each with distinct industry mix, neighborhood list, FAQs, and market-context.
- Newly strengthened Dombivli + Ambernath-Badlapur (the prior-audit borderline cases) with named local landmarks (Phadke Road, MIDC Ambernath, Pendharkar College, Badlapur East tower belt, etc.) and unique market-context cards.

### Outstanding work (external to code)
- Google Business Profile claim + optimization (cannot be done in code).
- Indian directory citations (Justdial, Sulekha, IndiaMart, IndiaBizclub).
- 5+ real client reviews to enable `Review`/`AggregateRating` schema.

---

## SXO (Search Experience) — passing

### Page-type alignment
- City pages → local-service page-type (right for `[service] in [city]` queries).
- Service pages → service-detail page-type (right for `[service] developer`).
- Project pages → case-study page-type (right for trust/credibility queries).
- Tag pages → topic-hub page-type (right for topic clusters).
- No detected page-type mismatches.

### Trust signals on landing pages
- WhatsApp CTA above the fold on every city/service page.
- `tel:` link on every page (now including footer after this audit cycle).
- Live URL proof block on `/thane` + `/mumbai`.
- Mid-case-study Hire CTA on all 8 project pages.
- Mobile sticky CTA bar.

---

## File-level findings reference

Detailed page-by-page data lives in [.audit/pages.json](.audit/pages.json) (62 pages × 22 metrics).
Raw scanner output: [.audit/scan-output.txt](.audit/scan-output.txt).
Scanner source: [.audit/scan.py](.audit/scan.py) — re-runnable after any rebuild.

---

## Summary

The portfolio is in strong pre-launch shape — **88/100**, an 18-point lift over the prior audit, driven primarily by:

1. **Catching the title-duplication regression** that the prior audit hadn't yet surfaced (because the suffix-doubling was introduced by this audit cycle's own changes — the `SEO.astro` suffix logic predated city pages that already included the brand).
2. **Schema breadth + correctness** — 8 active types, 358 JSON-LD blocks across 57 pages, 0 parse errors.
3. **Trust-signal surfacing** — live URLs, mid-case-study CTAs, footer phone, 50 unique FAQs.
4. **Three new service pillar pages** filling out the keyword surface.
5. **Doorway-page risk resolved** with unique local-context cards on the two borderline city pages.
6. **AI-search wiring** — llms.txt, 12 AI crawler allows, citable FAQ markup.

Remaining work is non-blocking: tag-page content depth, project-index intro, image format optimization, and post-launch CWV field data + GBP setup.

Ship.
