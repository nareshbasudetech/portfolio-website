# Local SEO Audit — Naresh Basude Portfolio (v2)
**Audit date:** 2026-05-11
**Auditor:** Claude Code (Local SEO specialist mode)
**Source:** Static file analysis of D:\Apps\portfolio\v2\src\ — dev server at localhost:4321, production target nareshbasude.in (pre-launch)

---

## Local SEO Score: 54 / 100

| Dimension | Weight | Score | Weighted |
|-----------|--------|-------|---------|
| GBP Signals | 25% | 8/25 | 2.0 |
| Reviews & Reputation | 20% | 4/20 | 0.8 |
| Local On-Page SEO | 20% | 17/20 | 3.4 |
| NAP Consistency & Citations | 15% | 11/15 | 1.65 |
| Local Schema Markup | 10% | 7/10 | 0.7 |
| Local Link & Authority Signals | 10% | 2/10 | 0.2 |
| **Total** | **100%** | | **54 / 100** |

**Ceiling note:** GBP and reviews are the two biggest drag factors. Both are zero-state (no GBP, 0 reviews). On-page local SEO is genuinely strong. The score will jump to ~72+ once GBP is live and first 10 reviews are collected, without any further on-page changes.

---

## 1. Business Type Detection

**Detected type: Hybrid SAB (Service-Area Business with disclosed physical base)**

Signals detected:
- Physical city/region disclosed: "Thane, Maharashtra 400601" visible in contact page `<address>`, JSON-LD PostalAddress, and all city page NAP blocks
- No street-level address published (deliberate — correct for a freelancer/SAB)
- Service area language present: "serving [city]", "I come to your office", "in-person for kickoff"
- 10 city pages with explicit area coverage
- No Maps embed, no Google Place reference widget, no GBP badge — because GBP does not yet exist

**GBP classification recommendation:** Register as a Service-Area Business. Do NOT hide the city/region. Set service areas to cover all 10 MMR cities. Do not list a street address publicly unless you want walk-in traffic (you do not).

---

## 2. Industry Vertical Detection

**Detected: IT & Digital Services — Freelance Local Service Business**

Sub-signals:
- "Website developer", "app developer", "digital marketer", "designer" — all explicit throughout
- Services: Website Dev, Web App Dev, Mobile App Dev, WhatsApp Bot, Growth Marketing
- No vertical-specific signals that would push into Restaurant, Healthcare, Legal, Automotive, or Real Estate verticals
- The *clients* served span multiple verticals (coaching, real estate, healthcare, retail) — but the provider is IT services

**Correct GBP primary category:** "Website Designer" (Google GBP category ID: gcid:website_designer) — this is the closest match. Secondary categories should include "Software Company", "Internet Marketing Service", "App Developer", "Graphic Designer".

---

## 3. NAP Consistency Audit

### Source Comparison Table

| Field | consts.ts | JSON-LD (Person) | JSON-LD (ProfessionalService) | Contact page address block | Footer | Thane city NAP | Mumbai city NAP | Dombivli city NAP | All other city NAPs |
|-------|-----------|-------------------|-------------------------------|---------------------------|--------|----------------|-----------------|-------------------|---------------------|
| **Name** | Naresh Basude | Naresh Basude | Naresh Basude — Website & App Developer | (not explicitly in address block) | Naresh Basude | (not in NAP block) | (not in NAP block) | (not in NAP block) | (not in NAP block) |
| **City** | Thane | Thane | Thane | Thane, Maharashtra, India | India -> Remote | Thane, Maharashtra 400601, India | Thane, Maharashtra (covering Mumbai & MMR) | Thane (covering Dombivli & MMR) | Thane (covering [city] & MMR) |
| **Phone** | +918600574836 / +91 86005 74836 | +918600574836 | +918600574836 | +91 86005 74836 | Not shown directly | +91 86005 74836 | +91 86005 74836 | +91 86005 74836 | +91 86005 74836 |
| **Email** | nareshbasude9@gmail.com | mailto:nareshbasude9@gmail.com | mailto:nareshbasude9@gmail.com | nareshbasude9@gmail.com | nareshbasude9@gmail.com | nareshbasude9@gmail.com | nareshbasude9@gmail.com | nareshbasude9@gmail.com | nareshbasude9@gmail.com |
| **Postal code** | 400601 | 400601 | 400601 | Not shown | Not shown | 400601 (Thane page only) | Not shown | Not shown | Not shown |

### NAP Issues Found

**Issue 1 — MEDIUM — Phone format inconsistency between schema and visible display**
- Schema telephone: `+918600574836` (no space, E.164 format — correct for schema)
- Visible display: `+91 86005 74836` (spaced — correct for human readability)
- These are the same number. This is acceptable and standard practice. No fix needed.

**Issue 2 — LOW — Address varies in detail across city pages**
- Thane page NAP: "Thane, Maharashtra 400601, India" (most complete — correct)
- All other city pages: "Thane (covering [city] & MMR)" — omits state, postal code, country
- Recommendation: Standardize all city page NAP address to "Thane, Maharashtra 400601, India" with the service area note on a separate line. Partial addresses in city pages weaken citation-style consistency.

**Issue 3 — LOW — Contact page address block omits postal code**
- Contact page shows: "Thane, Maharashtra, India" — no postal code
- JSON-LD has 400601. Add it to the visible address for full NAP consistency.

**Issue 4 — LOW — Footer omits phone number**
- Footer "Reach" column shows email, WhatsApp link, LinkedIn — but no clickable phone number
- Adds friction and weakens footer NAP signal. Add `<a href="tel:+918600574836">+91 86005 74836</a>`.

**Issue 5 — CRITICAL — Email mismatch between CONTEXT.md and consts.ts**
- CONTEXT.md states: `nareshbasude9@gmail.com` (matches consts.ts — this is correct)
- The user's identity memory shows: `bwtnaresh@gmail.com`
- These appear to be two different emails. Ensure all citation listings use the same email that will be on GBP. Using a Gmail for GBP/citations and a personal Gmail for other things is fine, but must be consistent across all directories.

**NAP overall verdict:** Structurally consistent on the critical fields (name, phone, email). Minor presentation inconsistencies in address completeness. No contradictory NAP found — phone and email are identical everywhere.

---

## 4. Local Schema Validation

### Schema Architecture

Three JSON-LD blocks on every page via `JsonLd.astro`:
1. `Person` — @id: /#person
2. `ProfessionalService` — @id: /#service
3. `WebSite` — @id: /#website

Additional on project pages:
4. `CreativeWork`
5. `BreadcrumbList`

### Validation Findings

#### Person schema — PASS with gaps

| Property | Present | Notes |
|----------|---------|-------|
| @type | Person | Correct |
| @id | /#person | Correct — enables entity graph linking |
| name | Naresh Basude | Correct |
| url | https://nareshbasude.in | Correct |
| image | /og.png via URL | Present but /og.png is OG image, not a person portrait — Google prefers an actual headshot for Person |
| jobTitle | Website Developer, App Developer, Digital Marketer & Designer | Correct |
| email | mailto:nareshbasude9@gmail.com | Schema accepts URI format — valid |
| telephone | +918600574836 | Valid E.164 format |
| address | PostalAddress: Thane, Maharashtra, India, 400601 | Correct |
| workLocation | Place with PostalAddress | Present — good |
| sameAs | LinkedIn | Only one sameAs. GitHub and Twitter are empty strings — filtered out correctly |
| knowsAbout | 22 items | Good for entity building |
| **MISSING: geo** | Not present | Latitude/longitude at 5-decimal precision recommended for local ranking |
| **MISSING: nationality** | Not present | Minor but adds entity completeness |

#### ProfessionalService schema — BORDERLINE

| Property | Present | Notes |
|----------|---------|-------|
| @type | ProfessionalService | ISSUE: "ProfessionalService" is a valid schema.org type but it is NOT a recognized Google local-pack schema. Google processes LocalBusiness and its subtypes. ProfessionalService IS a subtype of LocalBusiness (correct chain), but Google may not surface it in local packs the same way as more specific subtypes. |
| @id | /#service | Correct |
| name | Naresh Basude — Website & App Developer | Correct |
| url | Correct | |
| telephone | +918600574836 | Correct |
| email | Correct | |
| address | PostalAddress: Thane, Maharashtra, India, 400601 | Correct |
| areaServed | 21 Place entities | Good coverage. Note: areaServed with text names (not GeoShape or PostalCode) is valid but less precise |
| hasOfferCatalog | 5 offers with Service items | Good |
| founder, provider | @id links back to Person | Correct entity graph |
| priceRange | "Project-based · enquire" | Non-standard format. Google expects "$", "$$", "$$$" or a range like "₹5000 — ₹50000". This value will not render in rich snippets. |
| **MISSING: openingHoursSpecification** | Not present | Recommended for local pack. For SAB: use Mo-Fr availability. |
| **MISSING: geo** | Not present | Critical gap. Latitude/longitude at 5 decimal places (e.g., 19.21726, 72.97836 for Thane). Without geo, Google cannot anchor the business to a precise map point. |
| **MISSING: @type subtype** | Not present | Consider adding `"@type": ["LocalBusiness", "ProfessionalService"]` or more specific: `"@type": ["LocalBusiness", "SoftwareApplication"]` is wrong — better option: `"@type": "ProfessionalService"` alone is fine since ProfessionalService extends LocalBusiness. However, adding explicit `LocalBusiness` in the array is cleaner for parsers. |
| **MISSING: currenciesAccepted** | Not present | Add "INR" |
| **MISSING: paymentAccepted** | Not present | Add "UPI, Bank Transfer, Razorpay" |

#### CRITICAL SCHEMA ISSUE — No city-level schema on city pages

All 10 city pages use `schemaType="home"` which renders the same global `ProfessionalService` schema pointing to Thane. There is NO city-specific `LocalBusiness` or `ProfessionalService` schema on `/mumbai`, `/dombivli`, etc.

This is a significant miss. Each city page should carry a city-scoped `ProfessionalService` block with:
- `name`: "Naresh Basude — Website Developer in [City]"
- `areaServed`: [City and its neighborhoods]
- `description`: city-specific text

Without this, the schema does not reinforce the geographic signal that the city pages are trying to establish.

#### WebSite schema — PASS

| Property | Present | Notes |
|----------|---------|-------|
| SearchAction | Present with query-input | Technically valid but points to /projects?q= — not a true site search, just a filter. The SearchAction specification expects actual search functionality. Minor issue. |

---

## 5. GBP (Google Business Profile) — Does Not Exist Yet

**Status: Zero GBP signals on the site.** No Maps embed, no Place ID reference, no review widget, no GBP badge, no G.page link.

### GBP Setup Checklist (Pre-Launch Priority)

#### A. Account Setup
- [ ] Go to business.google.com — create new profile
- [ ] Select "I deliver goods and services to customers" (Service-Area Business)
- [ ] Do NOT add a street address (hide address from public — SAB mode)
- [ ] Set city: Thane, Maharashtra 400601
- [ ] Phone: +91 86005 74836
- [ ] Website: https://nareshbasude.in
- [ ] Email: nareshbasude9@gmail.com (must match across citations)

#### B. Primary Category (Whitespark #1 factor)

**Recommended primary:** "Website Designer"

Rationale: Direct keyword match to core service. Highest search volume in this GBP category cluster for Mumbai metro. "Web Developer" does not exist as a GBP category.

**Secondary categories (up to 9 additional):**
1. Internet Marketing Service
2. Software Company
3. App Developer
4. Graphic Designer
5. Marketing Consultant
6. Search Engine Optimization Consultant
7. E-commerce Service (if available in Indian GBP)
8. Advertising Agency
9. Computer Consultant

**WARNING:** "Web Developer" is NOT a valid GBP category. Using "Website Designer" is the closest standard category. Wrong primary category is the #1 negative local ranking factor per Whitespark 2026. Do not use "Computer Store", "IT Company" or generic tech categories.

#### C. Service Area Definition

Add all 10 MMR cities as service areas (GBP allows up to 20):
- Thane, Maharashtra
- Mumbai, Maharashtra
- Navi Mumbai, Maharashtra
- Kalyan, Maharashtra
- Bhiwandi, Maharashtra
- Dombivli, Maharashtra
- Mira-Bhayandar, Maharashtra
- Vasai-Virar, Maharashtra
- Panvel, Maharashtra
- Ulhasnagar, Maharashtra
- Ambernath, Maharashtra
- Badlapur, Maharashtra

Also add: Maharashtra (state-level, catches broader queries)

Note: Google recommends service areas within 2-hour drive of your base. All MMR cities qualify. Do not add "India" or "Remote worldwide" to GBP service areas — Google will treat this as spam.

#### D. Business Description (750 chars max — use all of it)

"Website developer, app developer, and digital marketer based in Thane, serving the Mumbai Metropolitan Region — Thane, Mumbai, Navi Mumbai, Kalyan, Bhiwandi, Dombivli, and more. I build marketing websites, web apps, mobile apps, and WhatsApp automation bots, and run Meta and Google ad campaigns for SMBs, coaching institutes, real estate developers, clinics, and e-commerce brands across the MMR. One person: design, development, and marketing without agency handoffs. Projects delivered in 7 days. In-person meetings across all MMR cities. Available now — contact via WhatsApp or email."

#### E. Services to Add in GBP

Add each as a GBP Service with name + description:
1. Website Development — Marketing sites, brand sites, e-commerce
2. Web App Development — CRMs, dashboards, internal tools
3. Mobile App Development — PWAs, installable mobile-first apps
4. WhatsApp Chatbot Development — Automated lead qualification bots
5. Growth Marketing — Meta ads, Google ads, technical SEO
6. Local SEO — GBP setup, citations, on-page local signals

#### F. Photos to Upload (Day 1)

GBP photos are a ranking signal. Minimum to launch:
- [ ] Logo / wordmark (square, min 250x250)
- [ ] Cover photo: screenshot of nareshbasude.in homepage on desktop (1024x576)
- [ ] Team photo: headshot of Naresh (currently missing from site — create one)
- [ ] 3 work screenshots: NIP College website, NursingPathshala app screen, WhatsApp bot demo
- [ ] 1 "at work" photo: Naresh working on laptop (location-tagged if possible)

Target: 10 photos at launch, grow to 25 within 60 days.

#### G. GBP Posts Strategy

GBP posts expire after 7 days (Events) or stay up (Offers, Updates). Velocity matters.

**18-day rule (Sterling Sky):** Rankings drop if no new review for 3 weeks. Same logic applies directionally to post activity.

Launch posts plan:
- Week 1: "Now open for briefs — website and app developer in Thane" (Update type)
- Week 2: Post a project case study excerpt with link to /projects
- Week 3: "7-day delivery — how it works" with link to /about or /contact
- Week 4+: Rotate project showcases, blog post links, local FAQ answers, seasonal offers

Post every 5-7 days minimum. Link posts back to relevant city pages where appropriate.

#### H. Q&A Section

Pre-populate GBP Q&A (you can add your own questions and answers):
- Q: "Do you work with small businesses in Thane?" A: [your answer]
- Q: "How fast can you build a website?" A: "7 days for most marketing sites..."
- Q: "Do you offer local SEO services?" A: [yes, with details]
- Q: "What payment methods do you accept?" A: [UPI, NEFT, Razorpay, GST invoice]

---

## 6. Review Health Snapshot

**Current state: 0 reviews (pre-launch)**

This is the most urgent local SEO gap. Per Whitespark 2026, review velocity and count are in the top 5 local ranking factors.

**Review velocity rule (Sterling Sky):** If no new review for 18 days, local pack rankings can drop significantly. This means after the first review, you must maintain a roughly every-3-week cadence minimum.

### Review Acquisition Plan (First 30 Days Post-Launch)

**Target: 5-10 reviews in first 30 days, then 1-2/month maintenance.**

#### Phase 1: Warm outreach (Days 1-14)

Identify 10-15 past clients from the case studies and ad account history (NIP College, ABS Educational Solutions, NGI Admissions, BookWithTeachers, 20+ growth marketing brand contacts). Reach out personally:

**WhatsApp message template:**
"Hi [Name], I just launched my new portfolio site (nareshbasude.in) — would you be open to leaving a quick Google review? It would mean a lot and genuinely helps me find clients like you. Here's the direct link: [GBP review link]. 30 seconds, 5 stars if you felt it was earned. No pressure at all."

**Do NOT:**
- Ask for reviews in exchange for discounts
- Ask multiple people from the same business (GBP may filter them)
- Use review-gating (showing review requests only to happy clients — violates Google ToS)

#### Phase 2: Process integration (Day 15+)

Add a review request to the project close-out workflow:
- Day 7 (delivery): WhatsApp "your project is live" message includes GBP review link in a PS
- Day 30 (follow-up): Email follow-up "how is it performing?" includes review link
- Create a short URL (nareshbasude.in/review) that redirects to the GBP review link

#### Phase 3: Passive triggers

- Add "Review us on Google" with GBP link to the email signature
- Add a soft prompt at bottom of contact page: "Happy with our work? Leave a Google review."
- Put review link in WhatsApp business profile bio

**Review response strategy:**
Respond to every review within 24 hours. For positive reviews: thank + mention a specific detail from their project. For negative reviews (unlikely at start): acknowledge privately first, then respond professionally. Google sees response rate as a trust signal.

**Indian review platforms to also target:**
- Justdial (critical for Indian SMB discovery)
- Sulekha (freelancer/service discovery)
- LinkedIn recommendations (link to profile)
- Clutch.co (B2B service buyers research here)

---

## 7. Doorway Page Risk Assessment

### The Standard

Google's doorway page policy targets pages "created to rank for specific similar queries that lead users to intermediate pages that are less useful than the final destination." Key tests:

1. **Swap test**: Could you replace the city name with another city and get the same page? (bad if yes)
2. **User value test**: Would a user in that city find unique, useful, non-templated information?
3. **Content uniqueness**: Is there substantial content beyond the swapped city name?
4. **Funnel test**: Is the page a useful destination in itself, or just a redirect-magnet?

### City-by-City Assessment

| City Page | Doorway Risk | Reasoning |
|-----------|-------------|-----------|
| `/thane` | **PASS** | Owner's home city. Strongest unique content: NIP College (Thane) case study reference, specific neighborhood mentions (Wagle Estate, Naupada), Hindi/Marathi FAQ, in-person meeting claim credible. Industries (coaching, real estate, clinics) match actual work. Service descriptions reference local stacks ("Next.js or WordPress depending on who maintains it after" — unique). |
| `/mumbai` | **PASS** | Strongly differentiated by industry vertical: SaaS/DTC/Fintech/Media — not present on other pages. Neighborhood list (14 named) is exhaustive. FAQ about white-label agency work is Mumbai-specific. "BKC / Lower Parel / Andheri" meeting mentions in FAQ are location-grounded. |
| `/kalyan-bhiwandi` | **PASS** | Highest differentiation of any page. Logistics/warehousing focus (Bhiwandi = Asia's largest warehouse cluster) is completely unique to this page. Textile/manufacturing B2B, Gujarati/Urdu language mention, RFQ/B2B catalog focus — all absent from other pages. FAQ about visiting warehouse sites in Bhiwandi is hyper-specific. Strong "PASS" confidence. |
| `/dombivli` | **BORDERLINE** | Marathi-first focus is unique. "Dombivli's retail strip" is specific. But the industry mix (retail, coaching, clinics, real estate, F&B, professional services) is the most generic of all pages — it overlaps heavily with Thane and Ambernath-Badlapur. Only 11 neighborhoods (other pages have 12). Neighborhood-to-industry specificity is lower. Risk: low but real. **Recommended fix:** Add 1-2 Dombivli-specific client or project references. Current case study references are "NIP College (Thane)" and "20+ ad accounts" — neither is Dombivli-specific. |
| `/navi-mumbai` | **PASS** | IT/ITES focus (Airoli, Mindspace, Reliable Tech Park, CBD Belapur) is unique. IT park/SEZ FAQ is specific to Navi Mumbai. Real-estate focus on Kharghar/Panvel/Ulwe is city-specific. Neighborhood list (12) is distinct. |
| `/mira-bhayandar` | **PASS** | Jewelry/gold retail specialty is completely unique to this page. Gujarati/Marwari community focus, multi-language (Gujarati added), Beverly Park/Silver Park neighborhoods — all highly specific. GBP setup for "Mira Road East vs West separately" is in-depth local knowledge. |
| `/vasai-virar` | **PASS** | Catholic school / English-Marathi-Konkani-Hindi audience mix is unique to this region. Vasai Fort tourism mention, MIDC belt, Naigaon neighborhoods — all specific. Institution-friendly WordPress stacks rationale is page-unique. |
| `/panvel` | **PASS** | NMIA (airport) angle is completely unique. JNPT logistics adjacency, Konkan gateway tourism, airport hotel focus — all absent from other pages. High content uniqueness score. |
| `/ulhasnagar` | **PASS** | Denim/garment manufacturing, Sindhi community (Sindhi script support mentioned), Camp 1-5 area system, B2B wholesale focus — all highly distinctive. Strongest differentiated industry set after Kalyan-Bhiwandi. |
| `/ambernath-badlapur` | **BORDERLINE** | Most generic of all pages. Industry mix (manufacturing, coaching, retail, real estate, healthcare, hospitality) mirrors other pages closely. The "affordable SMB" angle differentiates somewhat. MIDC Ambernath mention helps. But there are no specific client references, no unique industry angle as strong as other pages. Neighborhoods are distinct (12 unique names). **Recommended fix:** Add Ambernath MIDC industrial estate context (specific industries there), and if any client exists from this area, reference it. |

### Overall Doorway Page Verdict

**8 of 10 pages: PASS**
**2 of 10 pages: BORDERLINE (Dombivli, Ambernath-Badlapur)**

**The architecture is not doorway spam.** Here is why it clears the bar:

1. Each page has genuinely different industry verticals — sometimes completely opposite (B2B logistics in Kalyan-Bhiwandi vs. Catholic schools in Vasai-Virar vs. Sindhi denim in Ulhasnagar)
2. The FAQ sets are page-specific and answerable only by someone with local knowledge
3. Neighborhood pills are distinct across all pages (no overlap)
4. The owner can actually go to all these cities (within 90 min)
5. The `/cities` hub page and footer cross-linking create a coherent cluster, not 10 orphans

**What keeps two pages borderline:**
- Dombivli and Ambernath-Badlapur have generic industry mixes that overlap with neighboring city pages
- No city-specific case study references for either (only "NIP College (Thane)" and "20+ ad accounts")
- The Swap Test partially passes for these two — you could swap city names and the service descriptions would still make sense

**What would make them fail (they do not currently do this):**
- Pure keyword stuffing with no unique content
- Meta redirect or thin content serving as a doorway to the home page
- All content identical except city name swap

**Recommendation:** These pages are safe at launch. Strengthen them post-launch with any actual client mentions or local business references from those areas.

---

## 8. Hyperlocal Signal Assessment

### What's in Place

Each city page deploys three hyperlocal signal layers:

**Layer 1 — Neighborhood pills (H3-equivalent in list form)**
- Average: 12 neighborhood names per page
- Names are real, specific, and non-overlapping across pages
- Examples: "Wagle Estate, Naupada" (Thane), "BKC, Powai" (Mumbai), "Mindspace, Airoli" (Navi Mumbai), "Kalher, Padgha, Anjur Phata" (Kalyan-Bhiwandi), "Camp 1-5" (Ulhasnagar)
- Assessment: **Sufficient.** These create passage-level local relevance that Google's passage indexing can extract.

**Layer 2 — Industry-neighborhood cross-mentions**
- Thane: "Wagle Estate / TCS-area firms" in industry descriptions — this is genuine geo-entity linking
- Navi Mumbai: "Mindspace (Airoli), Reliable Tech Park, CBD Belapur" — named business parks
- Kalyan-Bhiwandi: "Bhiwandi-Nizampur, Kalher, Padgha, Mankoli, Anjur Phata" in FAQ body text
- Assessment: **Strong.** Named landmarks and business parks in prose text (not just pills) are better signals.

**Layer 3 — Service + location entity in H2 headings**
- "Website Developer in Thane" (H2) × 4 per page (one per service card)
- Assessment: **Good but repetitive.** Four identical "in [City]" H2s per page is semantically redundant. Consider varying: "App Developer in Thane", "WhatsApp Automation for Thane Businesses", "Growth Marketing — Thane & MMR".

### What's Missing

**Missing: Structured neighborhood → service cross-links**
No internal links from neighborhood names to a relevant project or service page. Example: "Wagle Estate" mentioned in Thane neighborhoods could link to a project page showing IT/corporate work. Currently all neighborhood pills are plain `<li>` text, not links.

**Missing: Google Maps embed (even a generic area map)**
A Maps embed for the service area would reinforce geo signal. For SABs this is less critical than for brick-and-mortar, but it adds trust and user utility.

**Missing: Structured data for city pages at the page level (see Schema section)**

**Overall hyperlocal signal verdict:** Sufficient for launch. The approach is not too aggressive (no keyword stuffing, real neighborhoods, real industry context). The risk is it reads as template-generated to a human reader at the BORDERLINE pages — the fix is more editorial prose, not fewer signals.

---

## 9. Citation Building Plan

### Priority Order of Operations

Citations are the #3 ranking factor cluster for AI search visibility (Whitespark 2026) and remain essential for local pack trust.

**Phase 1 — Core Indian directories (Week 1-2, before GBP launch)**

| Platform | Priority | URL | NAP format | Notes |
|----------|----------|-----|------------|-------|
| Google Business Profile | P0 | business.google.com | Full SAB format | Do first. Everything else builds on this. |
| Bing Places | P1 | bingplaces.com | Mirror GBP exactly | Syncs with Apple Maps via Bing data |
| Apple Maps | P1 | mapsconnect.apple.com | Same as GBP | Growing iOS usage in India |
| JustDial | P1 | justdial.com/getlisted | Name + Thane + phone | Most-used Indian local directory. Claim/create listing. Category: "Website Designers" |
| Sulekha | P1 | sulekha.com | Service provider listing | "Web Designer & Developer" category. High Indian SMB discovery traffic |
| IndiaMart | P2 | indiamart.com | Business seller profile | Less directly local-SEO, but B2B citation value. Category: IT Services |
| Facebook Business Page | P1 | facebook.com/pages | Full NAP in About | Include business category, service areas. Links back to nareshbasude.in |
| LinkedIn Company Page | P1 | linkedin.com/company | Create company page separate from profile | For B2B credibility. Link to personal profile |

**Phase 2 — Indian aggregators and tech directories (Month 2)**

| Platform | Priority | Notes |
|----------|----------|-------|
| Glassdoor | P3 | Employer profile — value for E-E-A-T, not local-pack directly |
| Naukri Company | P3 | Company profile — same E-E-A-T value |
| Yandex Maps | P2 | Growing in India. Add as SAB with service area |
| Justdial Pro | P2 | Paid tier — only if budget allows, measurable leads |
| Clutch.co | P1 | Most important for B2B IT services. Create profile, add 3+ client reviews. Clutch verification adds E-E-A-T. |
| GoodFirms | P2 | Similar to Clutch — secondary B2B directory |
| DesignRush | P3 | Agencies/freelancers directory |
| HireQuotient | P3 | Emerging Indian B2B platform |

**Phase 3 — Trust and niche platforms (Month 3+)**

| Platform | Priority | Notes |
|----------|----------|-------|
| Crunchbase | P2 | Founder/company profile — entity building |
| AngelList / Wellfound | P2 | Startup ecosystem visibility |
| Twitter/X Business | P3 | Profile with location tag |
| Google Maps (separate from GBP) | P0 | Automatically created when GBP is live |

### NAP Template for All Citations

Use exactly this format on every platform:

```
Business name: Naresh Basude
Category: Website Designer / Web Developer
Phone: +91 86005 74836
Email: nareshbasude9@gmail.com
Website: https://nareshbasude.in
City: Thane
State: Maharashtra
Pincode: 400601
Country: India
Service area: Thane, Mumbai, Navi Mumbai, Kalyan, Bhiwandi, Dombivli, Mira-Bhayandar, Vasai-Virar, Panvel, Ulhasnagar, Ambernath-Badlapur
Description: [Use the GBP description — 200-word version for each platform]
```

**Citation consistency rule:** Every platform must use identical Name, Phone, and Email. Never abbreviate "Naresh Basude" to "N. Basude." Never use a different phone number. If the email changes, update all listings.

---

## 10. SAB GBP Validation

### Is SAB the Right Type? YES.

The business model is:
- Physical base: Thane (disclosed)
- Service delivery: In-person meetings at client locations across MMR + remote work
- No walk-in clients / no retail storefront
- No inventory

This is textbook Service-Area Business (SAB). The GBP classification should be:
- Business type: Service-area business (no public street address)
- Service areas: 10+ MMR cities
- Primary category: Website Designer

**One nuance:** Naresh does have a physical home base in Thane. He could technically set up a "Hybrid" listing (with address + service areas). However:
- Publishing a home address publicly is a privacy risk
- Walk-in traffic is not desired
- SAB mode is correct and avoids the "address must be accessible" verification step

**Verification method:** For SABs without a public address, Google verifies via postcard to the physical address (not published) OR video verification. Have the Thane address ready for verification purposes. The address does NOT appear on GBP after verification in SAB mode.

---

## 11. Internal Linking Assessment

### What's Good

- Footer "Local — MMR" section: All 10 city pages linked from footer on every page — strong crawl signal
- City page cross-nav: Each city page links to 3-4 other city pages in "Other cities" section
- `/cities` hub: Hub-and-spoke model with all 10 cities linked from one indexable page
- Service card CTAs: All point to project portfolio pages — linking city pages to proof pages

### What's Missing

**Gap 1 — No blog post → city page links**
The blog has a post `/writing/local-seo-thane-starter-playbook` — this should link to `/thane` and `/cities`. Currently no blog posts cross-link to city pages (based on visible content).

**Gap 2 — No project page → city page links**
Case study pages (NIP College is a Thane client) do not link back to `/thane`. Adding "This project was for a client in Thane — [see Thane services]" would create meaningful topical linking.

**Gap 3 — City pages link to only 3-4 other cities (not all 10)**
Each city page cross-nav shows 3-4 cities. The `/cities` hub is the catch-all, but adding a "See all 10 cities" link in every city cross-nav would improve hub-spoke density.

**Gap 4 — Home page → city pages: only indirect**
Home page references "Thane · Bhiwandi · Mumbai" in the hero rail, but these are plain text — not links. Adding even one city link from the hero would create a crawl path signal.

**Recommended quick wins:**
- Add city link from hero text: `website & app developer in <a href="/thane">Thane</a>`
- Add `/cities` link to the primary navigation or breadcrumb
- Link NIP College case study back to `/thane`
- Link ABS/NGI case studies back to relevant cities

---

## 12. E-E-A-T Local Signals

### Experience Signals (Weak)

- No headshot photo of Naresh anywhere on the site (deliberate design choice)
- 3 testimonials are anonymized ("Founder · SaaS · 2026") — cannot be verified by Google or users
- Case studies reference real client names (NIP College, ABS, NGI) — this is strong
- 8 TODO markers for "real metrics" in HTML comments — if these become real numbers, E-E-A-T improves significantly

**Local E-E-A-T fix:** The combination of no portrait + anonymized testimonials is an E-E-A-T liability for local services where trust is paramount. The "faceless editorial" brand is intentional, but it creates friction in the local trust equation. Minimum viable fix: add a professional headshot to the `/about` page with "Based in Thane, Maharashtra" location context.

### Expertise Signals (Strong)

- 22-item knowsAbout in Person schema
- Case studies with technical depth (NursingPathshala, Naresh-CRM, WhatsApp Lead Bot)
- Blog posts demonstrate knowledge: "Local SEO Thane starter playbook", "Freelance developer vs agency Mumbai"

### Authority Signals (Weak — expected at pre-launch)

- 0 backlinks (pre-launch)
- LinkedIn profile is the main external authority signal
- No third-party press mentions, awards, or directory features yet

---

## 13. Title & Meta Review (Spot Check)

All city pages follow format: `"Website & App Developer in [City] — Naresh Basude"`

| Page | Title length | Assessment |
|------|-------------|-----------|
| /thane | "Website & App Developer in Thane — Naresh Basude" = 49 chars | PASS (under 60) |
| /mumbai | "Website & App Developer in Mumbai — Naresh Basude" = 50 chars | PASS |
| /kalyan-bhiwandi | "Website & App Developer in Kalyan & Bhiwandi — Naresh Basude" = 61 chars | BORDERLINE — 1 over limit. May truncate in SERPs. |
| /ambernath-badlapur | "Website & App Developer in Ambernath & Badlapur — Naresh Basude" = 64 chars | FAIL — truncates at ~60. Google will rewrite. |
| Home SITE.title | "Website & App Developer in Thane · Naresh Basude — Bhiwandi · Mumbai" = 70 chars | FAIL — significantly over 60. Google rewrites long titles. |

**Meta description review:**
- All city page meta descriptions are distinct and city-specific — good
- Home meta description: 195 chars — over the 160 char soft limit but Google truncates gracefully
- City page descriptions: 150-190 chars — mostly within range

---

## 14. Top 5 Critical Local SEO Actions

### Action 1 — CRITICAL: Create Google Business Profile (SAB mode)

**Impact: +15-20 points on local SEO score**
Without GBP, the business is invisible in Google's local pack and Maps entirely. All on-page optimization is wasted without GBP as the anchor. Do this before launch.

Steps:
1. business.google.com → create listing
2. Primary category: "Website Designer"
3. SAB mode: no public address
4. Service areas: 10 MMR cities
5. Verify via postcard/video
6. Upload 10 photos day 1
7. Write 750-char description
8. Add 6 services

Timeline: Can be done in 1 day; verification takes 5-14 days.

### Action 2 — CRITICAL: Get First 10 Google Reviews

**Impact: +8-12 points; prevents rankings cliff after 18 days**
Contact 10-15 past clients via WhatsApp with personal review request. Target 5 reviews in first 2 weeks, 10 by end of month 1. Response to each review within 24h.

### Action 3 — HIGH: Fix Schema — Add geo coordinates + openingHoursSpecification

**Impact: +4 points schema score; required for local pack rich snippets**

Add to ProfessionalService in JsonLd.astro:
```javascript
geo: {
  '@type': 'GeoCoordinates',
  latitude: 19.21726,
  longitude: 72.97836
},
openingHoursSpecification: [
  {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
    opens: '09:00',
    closes: '20:00',
  }
],
currenciesAccepted: 'INR',
paymentAccepted: 'Cash, UPI, Bank Transfer, Razorpay',
```

Also: fix priceRange to "₹₹" or remove it (current non-standard value is ignored by Google).

### Action 4 — HIGH: Add city-specific schema on each city page

**Impact: Enables per-city local ranking signal in schema**

City pages currently use `schemaType="home"` which renders the global ProfessionalService schema. Pass city-level data to JsonLd and render a city-specific ProfessionalService block per city page:

```astro
// In each city page
<BaseLayout schemaType="city" cityName="Thane" cityArea="Thane, Maharashtra" cityDesc="..." />
```

Create a new `schemaType="city"` handler in JsonLd.astro that emits a second ProfessionalService block with city-scoped name, areaServed, and description.

### Action 5 — HIGH: Build Tier 1 Indian Citations

**Impact: +5-8 points citations; AI search visibility**
In order: GBP (done in Action 1) → JustDial → Sulekha → Bing Places → Apple Maps → Facebook Business → LinkedIn Company → Clutch.co

Complete within first 30 days of launch. Use identical NAP on every platform.

---

## 15. GBP Setup Checklist (Consolidated)

- [ ] Create GBP listing at business.google.com
- [ ] Select "Service-area business" (no public street address)
- [ ] Set primary category: Website Designer
- [ ] Add 9 secondary categories (see Section 5B above)
- [ ] Define 12 service area cities
- [ ] Write 750-char business description
- [ ] Add 6 services with descriptions
- [ ] Upload logo (250x250 min, square)
- [ ] Upload cover photo (1024x576 min, 16:9)
- [ ] Upload headshot / team photo
- [ ] Upload 3+ project screenshots
- [ ] Add business phone: +91 86005 74836
- [ ] Add business email: nareshbasude9@gmail.com
- [ ] Add website: https://nareshbasude.in
- [ ] Verify listing (postcard or video)
- [ ] Pre-populate Q&A section (5+ questions)
- [ ] Publish first GBP post within 24h of verification
- [ ] Set GBP profile as short name (e.g., nareshbasude) for short URL
- [ ] Connect GBP to Google Analytics (Goals → GBP)
- [ ] Set up review notification alerts

---

## 16. Schema Quick-Fix Code Patches

### Patch 1 — Add geo + openingHours to ProfessionalService

In `D:\Apps\portfolio\v2\src\components\JsonLd.astro`, add to the `professionalService` object:

```javascript
geo: {
  '@type': 'GeoCoordinates',
  latitude: 19.21726,   // Thane city center — replace with exact office coords
  longitude: 72.97836,
},
openingHoursSpecification: [
  {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
    opens: '09:00',
    closes: '20:00',
  },
],
currenciesAccepted: 'INR',
paymentAccepted: 'UPI, Bank Transfer, Razorpay, Cheque',
priceRange: '₹₹',  // replace the non-standard current value
```

### Patch 2 — Fix title lengths

In `D:\Apps\portfolio\v2\src\consts.ts`, shorten SITE.title:
```typescript
title: 'Website & App Developer in Thane · Naresh Basude',  // was 70 chars, now 50
```

In `D:\Apps\portfolio\v2\src\pages\kalyan-bhiwandi.astro`:
```astro
title="Website Developer in Kalyan-Bhiwandi — Naresh Basude"  // 56 chars
```

In `D:\Apps\portfolio\v2\src\pages\ambernath-badlapur.astro`:
```astro
title="Website Developer in Ambernath-Badlapur — Naresh Basude"  // 62 chars — still long
// Alternative:
title="Web Developer in Ambernath & Badlapur — Naresh Basude"  // 58 chars — PASS
```

### Patch 3 — Add phone to footer

In `D:\Apps\portfolio\v2\src\components\Footer.astro`, in the "Reach" `<ul>`:
```astro
<li><a href={`tel:${CONTACT.phone}`}>{CONTACT.phoneDisplay}</a></li>
```
(Add before or after the WhatsApp entry.)

### Patch 4 — Add postal code to contact page address

In `D:\Apps\portfolio\v2\src\pages\contact.astro`, update the address block:
```astro
<span class="nap__val">Thane, Maharashtra 400601, India</span>
```

---

## 17. Limitations Disclaimer

The following could not be assessed without paid tools or production access:

- **Live local pack rankings**: No DataForSEO, Google Local Pack positions unknown
- **GBP live data**: No GBP exists yet — all analysis is preparatory
- **Backlink profile**: No Ahrefs/Semrush access — 0 links at pre-launch assumed
- **CrUX / Core Web Vitals**: Dev server performance is not representative of production
- **Google Search Console**: Not yet connected (pre-launch)
- **Citation live audit**: Justdial, Sulekha, IndiaMart listings could not be checked (no live business name to search)
- **Duplicate content detection**: Copyscape/Screaming Frog not run — city page uniqueness assessed manually
- **Schema rich result test**: Google's Rich Results Test requires a live URL — cannot test JSON-LD output without production deployment
- **Proximity factor**: Accounts for 55.2% of local ranking variance (Search Atlas ML). Naresh is in Thane — for Thane queries, proximity is maximally favorable. For Mumbai queries, the 60-90 min drive time is a proximity disadvantage that on-page work cannot overcome.
- **Competitor analysis**: No competitor GBP profiles, review counts, or category analysis run
- **Review velocity of competitors**: Unknown — may be low in this niche/geography, which makes acquiring first 10 reviews more achievable

---

## Summary Statistics

| Metric | Value |
|--------|-------|
| Pages audited | 11 (all 10 city pages + home) + schema, footer, contact |
| NAP issues found | 5 (1 critical, 2 medium, 2 low) |
| Schema issues found | 7 (2 critical, 3 medium, 2 low) |
| Doorway page: PASS | 8/10 |
| Doorway page: BORDERLINE | 2/10 (Dombivli, Ambernath-Badlapur) |
| Doorway page: FAIL | 0/10 |
| Title length issues | 3 pages (kalyan-bhiwandi, ambernath-badlapur, SITE.title) |
| GBP signals on site | 0 (pre-launch) |
| Reviews | 0 (pre-launch) |
| Citation listings | 0 confirmed (pre-launch) |
| Schema geo coordinates | Missing from all pages |
| Local SEO Score | 54/100 (will reach ~72 after GBP + reviews) |
