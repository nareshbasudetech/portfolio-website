# SEO Action Plan — nareshbasude.in (v2)

**Audit date:** 2026-05-12
**Health score:** 88/100 *(up from 70)*
**Status:** Pre-launch. v2 ready for Hostinger deploy.

---

## Done in this audit cycle ✅

| ID | Fix | Files touched |
|---|---|---|
| C1 | Title-duplication regression — every page was emitting `· Naresh Basude · Naresh Basude` | [src/components/SEO.astro](src/components/SEO.astro) |
| C2 | Tag-page meta-description overage (245+ chars) | [src/pages/writing/tag/[tag].astro](src/pages/writing/tag/[tag].astro) |
| H1 | Compress over-long descriptions on 10 city + 3 service + cities-hub + writing index pages | each `src/pages/*.astro` |
| H2 | Exclude `/demos/` from sitemap + robots | [astro.config.mjs](astro.config.mjs), [public/robots.txt](public/robots.txt) |
| H3 | Trim `/cities` + `/mira-bhayandar` over-length titles | respective pages |
| H4 | Add per-tag intros (22 tags) — bumped tag pages from 67 → 90–135 words | [src/pages/writing/tag/[tag].astro](src/pages/writing/tag/[tag].astro) |
| H5 | Shorten SITE.description from 192 → 156 chars | [src/consts.ts](src/consts.ts) |
| M1 | About + contact titles tightened | respective pages |

---

## Critical 🔴 — none remaining

All critical issues from the prior audit (70/100) plus the title-duplication regression discovered this cycle have been resolved.

---

## High 🟠 — fix within 1 week

### H6 — Lengthen 4 project case-study summaries to 130–160 chars
Currently 105–115 chars (from MDX frontmatter `summary`). Affects:
- [src/content/projects/naresh-crm-lead-management.md](src/content/projects/naresh-crm-lead-management.md) — 105
- [src/content/projects/nipcollege-rebuild.md](src/content/projects/nipcollege-rebuild.md) — 115
- [src/content/projects/nursingpathshala-app.md](src/content/projects/nursingpathshala-app.md) — 113
- [src/content/projects/web-templates.md](src/content/projects/web-templates.md) — 109

Action: extend each `summary:` field by 30–50 chars with a concrete result or named tech.

**Estimated effort:** 15 min. **Expected impact:** +1 point (descriptions).

### H7 — Add intro paragraph to `/projects` index
Currently 298 unique words (1 below the thin-content threshold). Action: add a 100–150-word intro above the project grid explaining the work mix (e.g., "20+ shipped products across SaaS, education, e-commerce, real estate, healthcare. Mix of dev, design, and growth — most projects landed in 1–3 weeks. The list below sorts by year, most recent first.").

**Estimated effort:** 15 min. **Expected impact:** +1 point (content).

### H8 — Add `width`/`height` to all `<img>` tags
Most images currently render without explicit dimensions. Risk: CLS shifts on slow networks. Action: switch to Astro's `<Image>` component, or set explicit width/height attrs.

**Estimated effort:** 1–2 h. **Expected impact:** +2 points (performance, images).

### H9 — Convert project covers to WebP/AVIF
Current covers are PNG/SVG. Action: use Astro `<Picture>` with WebP/AVIF + PNG fallback. Drop transfer size 40–60% on covers.

**Estimated effort:** 1 h. **Expected impact:** +1 point (performance, images).

### H10 — Pre-deploy `.htaccess` for Hostinger
Add security headers + redirect rules + cache headers before flipping DNS. Suggested headers: `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, and a basic CSP.

**Estimated effort:** 30 min. **Expected impact:** +1 point (technical).

---

## Medium 🟡 — fix within 1 month

### M1 — Strengthen tag pages with post-excerpt previews
Tag pages currently show post title + summary (90–135 unique words). Action: render the first paragraph of each post as an excerpt below the summary, capped at ~200 chars. Brings tag pages past the 300-word threshold.

**Estimated effort:** 1 h. **Expected impact:** +2 points (content).

### M2 — Tighten home description (163 chars)
Currently `SITE.description` is 156 chars but the home page rendering adds entities → 163. Trim by 5–10 chars.

**Estimated effort:** 5 min. **Expected impact:** +0.5 (descriptions).

### M3 — Tighten `/about` description (166 chars)
Currently 166 — 6 chars over the soft cap. Trim by 10–15 chars.

**Estimated effort:** 5 min. **Expected impact:** +0.5.

### M4 — Trim `/writing/freelance-developer-vs-agency-mumbai` summary (163 chars)
Source: post frontmatter `summary` field. Trim by 10–15 chars.

**Estimated effort:** 5 min. **Expected impact:** +0.5.

### M5 — Once 5+ client reviews exist, add `Review` + `aggregateRating` schema
Extend [src/components/JsonLd.astro](src/components/JsonLd.astro) `professionalService` block. Use real text + author names + dates. Drives review snippets in SERPs.

**Estimated effort:** 30 min after reviews are collected. **Expected impact:** +2 points (schema + trust).

### M6 — Surface 1–2 real testimonials on home page above the fold
Even before structured Reviews, a short quoted testimonial with named source on the home hero or directly below it lifts conversion + AI citability. Pull from existing client communications.

**Estimated effort:** 1 h (content + design). **Expected impact:** +1 point (content).

### M7 — Add CrUX field data check post-launch
Once the site has been live 4 weeks, query CrUX for LCP/INP/CLS field data. Replaces the lab estimate (80) with a real measurement.

**Estimated effort:** 15 min. **Expected impact:** unlocks accurate Performance score.

### M8 — Set up Google Search Console + submit sitemap
Standard post-launch step. Verify domain, submit `/sitemap-index.xml`, monitor URL coverage + Core Web Vitals report.

**Estimated effort:** 30 min. **Expected impact:** unlocks GSC indexation data for the next audit.

### M9 — Set up GA4 + server-side event measurement
Add via `PUBLIC_GA_ID` env var (already wired in [BaseLayout.astro](src/layouts/BaseLayout.astro) via Partytown). Track `wa.me` outbound, `mailto:` outbound, `tel:` outbound as goals.

**Estimated effort:** 30 min. **Expected impact:** unlocks GA4 traffic data for the next audit.

---

## Low 🟢 — backlog

### L1 — Google Business Profile claim + optimization
External (cannot do in code). Action: claim the GBP for "Naresh Basude — Website Developer in Thane". Set primary category, service area, hours, photos, posts. Run review acquisition system to land first 10 reviews.

**Estimated effort:** 2 h initial + ongoing. **Expected impact:** local-pack visibility unlock.

### L2 — Indian directory citations
Justdial, Sulekha, IndiaMart, IndiaBizclub, plus a handful of dev-specific directories (Clutch, GoodFirms, DesignRush). Aim for 15–20 citations matching exact NAP.

**Estimated effort:** 3–4 h. **Expected impact:** +0.5 local SEO score.

### L3 — Add `VideoObject` schema once a demo reel exists
Currently no video. If you ship a 60–90s portfolio reel, embed + add `VideoObject` schema.

**Estimated effort:** 30 min when ready. **Expected impact:** +0.5 schema.

### L4 — Programmatic city + service combo pages
Currently 10 city pages × 4 services. Could generate 40 `[service]-in-[city]` pages (e.g., `/whatsapp-bot-developer-in-thane`). Risk: doorway-page penalty if generic. Only do this with named local context per page — substantial work.

**Estimated effort:** 8–12 h. **Expected impact:** +3 points if done well, -2 if done poorly. Defer until first 6 months of GSC data informs which combos have real demand.

### L5 — Set up Plausible / Fathom / Umami as a lightweight analytics fallback
GA4 alone misses ~20% of traffic (cookie consent, blocking). A privacy-friendly fallback gives a more honest picture.

**Estimated effort:** 30 min. **Expected impact:** measurement accuracy.

### L6 — Backlink outreach
Reach out to Astro/Next.js community sites + Mumbai dev meetups + Indian SMB blogs for backlinks. Aim for 5–10 quality referring domains in the first 6 months post-launch.

**Estimated effort:** ongoing. **Expected impact:** +3 points authority over 6 months.

---

## Re-audit cadence

- **T+0 (now):** ship the v2 deploy. Implement H6–H10 before deploy.
- **T+7 days:** verify GSC indexation, set up GA4 conversions.
- **T+30 days:** re-run `/seo-audit` with first CrUX field data, GSC clicks/impressions, and any new content.
- **T+90 days:** full audit with backlink profile, ranking data, and the first 5 reviews live.

---

## Re-running the audit

```bash
cd /d/Apps/portfolio/v2
npm run build
python .audit/scan.py > .audit/scan-output.txt
```

The scanner ([.audit/scan.py](.audit/scan.py)) generates `pages.json` (62 pages × 22 metrics) and a text summary of all flagged issues. The full report ([FULL-AUDIT-REPORT.md](FULL-AUDIT-REPORT.md)) is the human-readable surface.
