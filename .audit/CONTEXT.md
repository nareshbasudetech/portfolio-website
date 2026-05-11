# SEO Audit Context — Naresh Basude Portfolio (v2)

## Site under audit
- **URL (dev)**: http://localhost:4321/
- **Production target**: https://nareshbasude.in/ (not yet deployed)
- **Build path**: D:\Apps\portfolio\v2\dist (after `npm run build`)
- **Stack**: Astro 5 (static SSG), Tailwind v4, MDX content collections
- **Hosting target**: Hostinger (Apache); .htaccess in public/
- **Page count**: 54 pages

## Owner / business
- **Name**: Naresh Basude
- **Role**: Freelance website + app developer + digital marketer + designer
- **Based**: Thane, Maharashtra, India (400601)
- **Service area**: Mumbai Metropolitan Region (10 cities) + India + Remote worldwide
- **Business type**: LOCAL SERVICE BUSINESS (hybrid — physical city base + service delivery, in-person + remote)
- **Email**: nareshbasude9@gmail.com
- **Phone**: +91 86005 74836
- **LinkedIn**: https://in.linkedin.com/in/website-developer-in-thane
- **Availability**: Available now
- **Delivery promise**: Projects delivered within 7 days

## Page inventory (54 pages)

**Core (6):**
- `/` — home with FlipBoard hero + 7-day pledge + capabilities + featured project
- `/about` — One brain, three disciplines
- `/contact` — Email, WhatsApp, phone, LinkedIn channels + availability + FAQs
- `/privacy` — DPDP/GDPR-compliant policy
- `/404` — Off the map
- `/cities` — Hub indexing all 10 city pages

**Projects (9):**
- `/projects` — Index with discipline filter (Dev/Design/Marketing/All), counts: 8/7/7/7
- `/projects/growth-marketing-engagements` — 20+ brands across education, real estate, e-commerce, healthcare, B2B
- `/projects/naresh-crm-lead-management` — Multi-platform CRM
- `/projects/whatsapp-leadbot` — WhatsApp lead qualification bot
- `/projects/nursingpathshala-app` — GNM/nursing study app
- `/projects/education-platforms` — ABS Educational Solutions + NGI Admission Milega
- `/projects/bookwithteachers` — Pharmacy e-learning + bookstore
- `/projects/nipcollege-rebuild` — PHP → WordPress migration
- `/projects/web-templates` — Industry templates with 5 live demos

**Writing (blog) (10):**
- `/writing` — Notes, not posts (index)
- `/writing/portfolio-as-departures-board`
- `/writing/local-seo-thane-starter-playbook`
- `/writing/freelance-developer-vs-agency-mumbai`
- `/writing/whatsapp-chatbots-indian-smbs`
- `/writing/seven-day-delivery-playbook`
- `/writing/wordpress-vs-nextjs-vs-astro`
- Plus ~19 tag pages auto-generated at `/writing/tag/{tag}`
- `/writing/rss.xml`

**City landing pages (11):**
- `/thane` (Wagle Estate, Naupada, Ghodbunder Road, Hiranandani Estate, etc.)
- `/mumbai` (Andheri, BKC, Powai, Lower Parel, etc.)
- `/navi-mumbai` (Vashi, Belapur, Kharghar, Airoli, etc.)
- `/kalyan-bhiwandi` (Bhiwandi-Nizampur, Kalyan W/E, Kalher, etc.)
- `/dombivli` (Marathi-first SMB focus)
- `/mira-bhayandar` (jewelry + multilingual)
- `/vasai-virar` (schools + affordable RE)
- `/panvel` (NMIA growth zone)
- `/ulhasnagar` (denim + Sindhi B2B)
- `/ambernath-badlapur` (SMB belt)

Each city page has:
- H1 with exact-match "Website & app developer in [city]"
- Custom marquee
- §01 Services (4 cards, all titled "in [city]")
- §02 Industries (6 unique to that city)
- §03 Neighborhoods (12 area pills, unique)
- §04 Why local (4 cards, mixed shared + unique)
- §05 FAQs (5 unique per city)
- §06 NAP block + cross-city nav

**Static assets:**
- `/robots.txt` — explicitly allows GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Google-Extended, Applebot, Bytespider, CCBot, etc.
- `/llms.txt` — comprehensive AI-search citation guide
- `/humans.txt`
- `/manifest.webmanifest`
- `/og.png` (rendered 1200×630)
- `/og.svg`
- `/favicon.svg`
- `/_headers` (Cloudflare/Netlify fallback)
- `/.htaccess` (Apache config for Hostinger — HSTS, nosniff, Referrer-Policy, caching)
- `/sitemap-index.xml` + `/sitemap-0.xml` (only after `npm run build`)
- `/rss.xml` (projects feed)
- `/writing/rss.xml` (blog feed)

## Schema in place (JSON-LD per page)

On every page:
1. **Person** — `@id: /#person`, name, jobTitle, knowsAbout (22 items including Local SEO Thane/Bhiwandi/Mumbai), telephone, email, address (PostalAddress with Thane MH 400601), workLocation, sameAs (LinkedIn)
2. **ProfessionalService** — `@id: /#service`, name, address, areaServed (21 Place entities), telephone, email, hasOfferCatalog (5 services: Website / Web App / Mobile App / WhatsApp Bot / Growth Marketing), founder + provider pointing to Person
3. **WebSite** — `@id: /#website`, author + publisher → Person, SearchAction

Project pages add:
4. **CreativeWork** (with creator → Person, dateCreated, image, url)

Projects index adds:
5. **BreadcrumbList**

## Known design / content decisions

- **No portrait photo** of Naresh on the site (deliberate — branded as faceless editorial)
- **Real screenshots**: 3 of 8 case studies (ABS, NGI, NIP College). Rest are clearly-marked SVG illustrations with `[ ILLUSTRATIVE ]` tag in corner
- **8 TODO markers** for "real metric" in case studies (HTML comments, not visible to readers)
- **3 placeholder testimonials** on home page (anonymized: "Founder · SaaS · 2026" etc.)
- **No public rate card** (pricing discussed per-brief)
- **5 live demo templates** at `/demos/{slug}/index.html` — Westbrook, Aurora, Aarogya (static), MediCare, HealthPlus

## What we want flagged (be brutal)

1. **Doorway page risk** — 10 city pages with 60–70% template + 30–40% unique content. Are they substantive enough to avoid Google's doorway penalty?
2. **7-day delivery claim** — credible given case-study evidence? Or contradictory?
3. **Internal linking** — sufficient cross-linking between cities ↔ projects ↔ blog?
4. **Title/meta lengths** — any too long (>60 / >160) or duplicate?
5. **Heading hierarchy** — proper H1/H2/H3 cascade, especially on home (which has multiple sections)
6. **Schema validation** — does the Person + ProfessionalService + offerCatalog combo validate cleanly in schema.org? Does it have all properties Google's rich-result tester wants?
7. **AI search citability** — is llms.txt rich enough, are passage-level chunks scannable, are entities (cities, services, people) named consistently?
8. **Local SEO** — what's needed beyond on-page (GBP, citations, reviews)?
9. **E-E-A-T** — Experience signals weak (no photo, anonymized testimonials, no client logos). What to add?

## Audit limitations

- DEV not PROD: no CrUX field data, no GSC, no live Lighthouse representative of CDN
- Pre-launch: zero backlinks, no organic traffic
- `/sitemap-index.xml` returns 404 in dev mode (works after `npm run build`)
- Dev server perf is misleading vs production
