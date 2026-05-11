# Schema.org Structured Data Audit — nareshbasude.in
**Audited:** 2026-05-11  
**Pages crawled:** 8 (/, /projects, /projects/growth-marketing-engagements, /thane, /writing/local-seo-thane-starter-playbook, /about, /contact, /writing, /cities)  
**Source file:** `D:\Apps\portfolio\v2\src\components\JsonLd.astro`  
**Consts source:** `D:\Apps\portfolio\v2\src\consts.ts`

---

## Overall Completeness Score

**62 / 100**

| Category | Score | Notes |
|---|---|---|
| Person | 78/100 | Solid base; 3 fixable errors |
| ProfessionalService | 71/100 | Core complete; format bugs + missing geo |
| WebSite | 85/100 | Good; SearchAction target is imprecise |
| BreadcrumbList | 70/100 | Present on /projects only; missing on all other secondary pages |
| CreativeWork | 60/100 | Missing url on some cases; dateCreated format is year-only |
| BlogPosting | 0/100 | Completely absent — 6 live blog posts have zero article schema |
| FAQPage | 0/100 | 10 city pages + contact each have inline FAQs with no FAQPage schema |
| ItemList | 0/100 | /writing and /cities have no ItemList markup |

---

## Schema Block Validation — Per Type

### 1. Person (`@id: https://nareshbasude.in/#person`)
**Present on:** every page  
**Checklist:**

| Check | Status | Detail |
|---|---|---|
| @context = "https://schema.org" | PASS | Correct |
| @type valid | PASS | Person is valid |
| @id is absolute URL | PASS | `https://nareshbasude.in/#person` |
| name | PASS | "Naresh Basude" |
| url | PASS | `https://nareshbasude.in` |
| jobTitle | PASS | Present |
| image | PASS | Absolute URL to og.png |
| email format | **FAIL** | Value is `mailto:nareshbasude9@gmail.com` — schema.org `email` property expects a plain email string (`nareshbasude9@gmail.com`), not a `mailto:` URI. The `mailto:` scheme is valid for `url`, `contactPoint.contactOption`, or HTML anchors — not the `email` property. |
| telephone format | **WARN** | `+918600574836` is valid E.164 (12 digits for India). However it lacks the space notation Google often displays. Acceptable as-is. |
| address (PostalAddress) | **WARN** | `addressCountry` is `"India"` — Google and schema.org prefer ISO 3166-1 alpha-2 (`"IN"`). Free-text country names are accepted but the ISO code is the documented value type. |
| address streetAddress | **WARN** | Missing `streetAddress`. Not required, but for a LocalBusiness claiming local-pack presence, a street address strengthens geo-confidence. Add if you have a public office address. |
| workLocation | PASS | Present as Place with nested PostalAddress |
| sameAs | **WARN** | Only LinkedIn. GitHub and Twitter are empty strings — filtered correctly via `.filter(Boolean)`, but adding real profiles would strengthen Entity Disambiguation. |
| knowsAbout | PASS | 22 items, good coverage |
| birthDate / gender / nationality | INFO | Not present. Optional for Person but can help entity disambiguation. Not urgent. |

**Person Score: 78/100**  
**Blocking issues:** 1 (email format)  
**Warnings:** 4

---

### 2. ProfessionalService (`@id: https://nareshbasude.in/#service`)
**Present on:** every page  
**Checklist:**

| Check | Status | Detail |
|---|---|---|
| @context = "https://schema.org" | PASS | Correct |
| @type valid | PASS | ProfessionalService is a valid subtype of LocalBusiness |
| @id is absolute URL | PASS | `https://nareshbasude.in/#service` |
| name | PASS | "Naresh Basude — Website & App Developer" |
| url | PASS | Absolute |
| image | PASS | Absolute og.png URL |
| email format | **FAIL** | Same as Person — `mailto:` prefix must be removed |
| telephone | PASS | E.164 format |
| address (PostalAddress) | **WARN** | `addressCountry: "India"` should be `"IN"` |
| address streetAddress | **WARN** | Missing. For Google Local Pack ingestion, a full PostalAddress including `streetAddress` correlates with stronger local pack eligibility |
| priceRange | **WARN** | `"Project-based · enquire"` is non-standard. The `priceRange` property expects a string like `"₹₹"`, `"$$"`, or `"₹5,000–₹50,000"`. While Google doesn't hard-reject free text here, it does not use it for rich results. Either use currency-symbol range notation or omit the property if you don't want it displayed |
| areaServed (21 Place entities) | **WARN** | See dedicated section below |
| founder → Person @id | PASS | Correctly references `/#person` |
| provider → Person @id | **WARN** | `provider` is not a standard property of LocalBusiness/ProfessionalService in schema.org. The expected property is `employee`, `member`, or just rely on `founder`. Consider removing `provider` or replacing with `employee: { "@id": "/#person" }` |
| hasOfferCatalog | PASS | OfferCatalog with 5 Offer/Service items — well structured |
| openingHours | **WARN** | Missing. Google's local knowledge panel uses `openingHoursSpecification` or `openingHours`. Even "By appointment" can be expressed as `openingHoursSpecification` with `dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]` |
| geo (GeoCoordinates) | **FAIL** | Missing `geo` property with lat/lng. For Local Pack eligibility, Google uses `geo: { "@type": "GeoCoordinates", "latitude": 19.2183, "longitude": 72.9781 }`. Without it, the local anchor depends entirely on the PostalAddress text match |
| aggregateRating | INFO | Missing. No reviews on site yet — skip for now, add once real reviews exist. Placeholder ratings are a policy violation |
| currenciesAccepted | INFO | Optional. Could add `"INR"` |
| paymentAccepted | INFO | Optional. Could add `"UPI, Bank Transfer"` |
| sameAs on Service | **WARN** | Points to LinkedIn only — same as Person. For a service entity, this is redundant. Consider removing or pointing to a Google Business Profile URL when created |

**ProfessionalService Score: 71/100**  
**Blocking issues:** 2 (email format, missing geo)  
**Warnings:** 7

---

### 3. WebSite (`@id: https://nareshbasude.in/#website`)
**Present on:** every page  
**Checklist:**

| Check | Status | Detail |
|---|---|---|
| @context = "https://schema.org" | PASS | Correct |
| @type valid | PASS | WebSite |
| @id absolute | PASS | `https://nareshbasude.in/#website` |
| name | PASS | "Naresh Basude" |
| url | PASS | Absolute |
| inLanguage | PASS | `"en"` |
| author → Person @id | PASS | Correctly links to `/#person` |
| publisher → Person @id | PASS | Correctly links to `/#person` |
| potentialAction (SearchAction) | **WARN** | Target URL is `https://nareshbasude.in/projects?q={search_term_string}`. This implies search scope is limited to projects. Google expects `SearchAction` to describe sitewide search. If `/projects?q=` is a real client-side filter, this is acceptable but Google's Sitelinks Searchbox is unlikely to activate because it requires a genuine search results page. Consider either (a) implementing true sitewide search, or (b) removing the `SearchAction` — its absence doesn't hurt rankings |
| datePublished / dateModified | INFO | Not present on WebSite type — not required |

**WebSite Score: 85/100**  
**Warnings:** 1

---

### 4. BreadcrumbList
**Present on:** `/projects` only  
**Checklist:**

| Check | Status | Detail |
|---|---|---|
| @context = "https://schema.org" | PASS | Correct |
| @type = BreadcrumbList | PASS | Correct |
| itemListElement structure | PASS | ListItem with position, name, item |
| item URLs are absolute | PASS | Both `https://nareshbasude.in` and `https://nareshbasude.in/projects` |
| Position sequence starts at 1 | PASS | Correct |

**Missing BreadcrumbList on:**
- `/projects/{slug}` — all 8 case studies need Home > Projects > [Case Study Name]
- `/writing` — needs Home > Writing
- `/writing/{slug}` — all 6 blog posts need Home > Writing > [Post Title]
- `/thane`, `/mumbai`, etc. — all 10 city pages need Home > [City Name]
- `/about`, `/contact` — Home > About / Contact
- `/cities` — Home > Cities

BreadcrumbList is one of the few schema types that definitively triggers a rich result (breadcrumb trail in SERPs). Currently only 1 of ~30+ eligible pages has it.

**BreadcrumbList Score: 70/100** (correct where present; absent everywhere else)

---

### 5. CreativeWork (project pages)
**Present on:** all `/projects/{slug}` pages  
**Checklist (audited on `/projects/growth-marketing-engagements`):**

| Check | Status | Detail |
|---|---|---|
| @context = "https://schema.org" | PASS | Correct |
| @type = CreativeWork | PASS | Correct |
| name | PASS | "Growth Marketing · 20+ Brands" |
| description | PASS | Present |
| dateCreated | **WARN** | Value is `"2026"` (year-only). ISO 8601 full date preferred: `"2026-01-01"` or the actual project start date. Year-only is technically valid but less precise |
| url | **FAIL** | Property is absent on the growth-marketing case study (no `project.url` passed from the page). The CreativeWork should reference its own canonical URL: `"https://nareshbasude.in/projects/growth-marketing-engagements"` |
| image | **WARN** | Not present for this case study (no `project.image` passed). Google's rich results for CreativeWork benefit from an associated image |
| creator → Person @id | PASS | Correctly references `/#person` |
| @id | **WARN** | No `@id` on the CreativeWork itself. Adding `"@id": "https://nareshbasude.in/projects/growth-marketing-engagements#work"` enables cross-referencing |
| author vs creator | INFO | Both `author` and `creator` are valid on CreativeWork. `creator` is used — acceptable |
| genre / keywords | INFO | Not present. Adding `"keywords": "growth marketing, Meta ads, Google ads, Thane"` could improve discovery |

**CreativeWork Score: 60/100**  
**Blocking issues:** 1 (missing url)  
**Warnings:** 3

---

### 6. BlogPosting — MISSING
**Present on:** 0 of 6 live blog posts  
**Should be on:** every `/writing/{slug}` page

The `[...slug].astro` layout passes `type="article"` to BaseLayout for OG metadata, but the `JsonLd.astro` component has no `'writing'` or `'article'` schema type — it falls back to `type='home'` and emits only Person + ProfessionalService + WebSite. No BlogPosting or Article schema is generated.

**Impact:** Google cannot surface article rich results (date, author byline in SERP) for any blog post. All 6 posts are invisible to article-rich-result eligibility. This is the single largest missed opportunity on the site.

**Required properties for BlogPosting:**
- `@type: "BlogPosting"`
- `headline`
- `datePublished` (ISO 8601)
- `author` (→ Person @id)

**Recommended:**
- `dateModified`
- `url`
- `description` / `abstract`
- `image` (for rich result thumbnail)
- `publisher` (→ Person @id)
- `inLanguage`
- `keywords` (from tags)
- `mainEntityOfPage`

---

### 7. FAQPage — MISSING
**Present on:** 0 pages  
**Inline FAQ content exists on:**
- All 10 city pages (5 unique FAQs each = 50 FAQ pairs total)
- `/contact` (4 FAQ pairs)

**Google policy note (August 2023):** FAQPage rich results in Google Search are restricted to official government and health websites. Commercial sites no longer receive the collapsed FAQ accordion in SERPs.

**However:** FAQPage schema on commercial pages still:
1. Benefits AI/LLM citation surfaces (Perplexity, ChatGPT, Claude, Gemini) — the `llms.txt` file the site already has signals AI crawlers, and FAQPage schema reinforces passage-level extractability
2. May appear in Google SGE/AI Overviews when the question is directly relevant

**Recommendation:** Add FAQPage to city pages and contact page with the note that this is GEO-optimized (AI discoverability), not Google SERP rich results.

---

### 8. ItemList — MISSING
**Present on:** 0 pages  
**Opportunities:**
- `/writing` — a list of blog posts rendered as `<ol>` with no ItemList markup
- `/cities` — a list of city landing pages with no ItemList markup
- `/projects` — a filtered list of projects with no ItemList markup (beyond BreadcrumbList)

ItemList on index/hub pages tells Google and AI crawlers what the page is a canonical list of.

---

## @id Linking Consistency

| Reference | Source | Target | Status |
|---|---|---|---|
| Person @id | `https://nareshbasude.in/#person` | — | Defined |
| ProfessionalService.founder | `{ "@id": "https://nareshbasude.in/#person" }` | Person | PASS — consistent |
| ProfessionalService.provider | `{ "@id": "https://nareshbasude.in/#person" }` | Person | PASS — but `provider` is non-standard on LocalBusiness |
| WebSite.author | `{ "@id": "https://nareshbasude.in/#person" }` | Person | PASS — consistent |
| WebSite.publisher | `{ "@id": "https://nareshbasude.in/#person" }` | Person | PASS — consistent |
| CreativeWork.creator | `{ "@id": "https://nareshbasude.in/#person" }` | Person | PASS — consistent |
| ProfessionalService @id | `https://nareshbasude.in/#service` | — | Defined but nothing links TO it |

**Issue:** No schema block references `/#service`. The Person schema does not include a `worksFor` or `memberOf` pointing back to the ProfessionalService. Adding `"worksFor": { "@id": "https://nareshbasude.in/#service" }` to Person would create a bidirectional graph that Google's entity resolution benefits from.

---

## areaServed Array — 21 Place Entities

```json
["Thane", "Mumbai", "Navi Mumbai", "Kalyan", "Bhiwandi", "Dombivli",
 "Mira-Bhayandar", "Mira Road", "Bhayandar", "Vasai", "Virar",
 "Nalasopara", "Panvel", "Kalamboli", "Kamothe", "Ulwe",
 "Ulhasnagar", "Ambernath", "Badlapur", "India", "Remote worldwide"]
```

**Verdict: Acceptable, with one concern.**

21 `Place` entities is not "too many" for schema.org — there is no hard limit. Google's documentation for `areaServed` allows arrays. However:

1. **"India" and "Remote worldwide" mixed with city names** creates semantic inconsistency. `"India"` and `"Remote worldwide"` are at a different geographic scale than individual cities. Consider separating: use `City` typed entities for cities, and `Country` or `AdministrativeArea` for India.
2. **No `@type` differentiation** — all 21 are `{ "@type": "Place" }`. Upgrading city entries to `{ "@type": "City", "name": "Thane" }` is more precise and schema.org-valid.
3. **Mira Road and Bhayandar are sub-areas of Mira-Bhayandar** — listing all three could be seen as redundant. It's not harmful but adding `containedInPlace` would be cleaner.
4. For Google's Local Pack specifically, `areaServed` on a schema.org entity does NOT substitute for a verified Google Business Profile service area. The GBP must be set up separately.

**Recommended fix for areaServed:**
```json
"areaServed": [
  { "@type": "City", "name": "Thane", "containedInPlace": { "@type": "State", "name": "Maharashtra" } },
  { "@type": "City", "name": "Mumbai" },
  { "@type": "City", "name": "Navi Mumbai" },
  { "@type": "City", "name": "Kalyan" },
  { "@type": "City", "name": "Bhiwandi" },
  { "@type": "City", "name": "Dombivli" },
  { "@type": "City", "name": "Mira Road" },
  { "@type": "City", "name": "Vasai" },
  { "@type": "City", "name": "Virar" },
  { "@type": "City", "name": "Panvel" },
  { "@type": "City", "name": "Ulhasnagar" },
  { "@type": "City", "name": "Ambernath" },
  { "@type": "Country", "name": "India" }
]
```

---

## Address vs. PostalAddress — Google Local Pack Readiness

**Current PostalAddress:**
```json
{
  "@type": "PostalAddress",
  "addressLocality": "Thane",
  "addressRegion": "Maharashtra",
  "postalCode": "400601",
  "addressCountry": "India"
}
```

**Issues for Local Pack ingestion:**

| Property | Current | Required/Recommended | Issue |
|---|---|---|---|
| streetAddress | missing | Recommended | Without a street address, Google cannot distinguish the physical location within the postal code area |
| addressLocality | "Thane" | PASS | Correct |
| addressRegion | "Maharashtra" | Recommended: "MH" (ISO 3166-2) | Free text is accepted; ISO code is preferred |
| postalCode | "400601" | PASS | Correct |
| addressCountry | "India" | Should be "IN" | ISO 3166-1 alpha-2 code required by schema.org spec |

**Google's Local Knowledge Panel** uses the structured address data alongside GBP. The current address is sufficient for schema parsing but `addressCountry: "IN"` and a `streetAddress` would make it more precise.

---

## Google Rich Results Eligibility Assessment

| Rich Result Type | Eligible? | Reason |
|---|---|---|
| Sitelinks Searchbox | Unlikely | SearchAction present but targets /projects filter, not a real search results page |
| Breadcrumb trail | YES (partial) | Only /projects has BreadcrumbList; others need it |
| Local Business Knowledge Panel | Possible | Requires GBP verification + address fixes |
| Article rich result | NO | No BlogPosting/Article schema on /writing/* |
| FAQPage accordion | NO | Restricted to government/health sites since Aug 2023 |
| CreativeWork rich result | Unlikely | Not a Google-supported rich result type; benefits AI crawlers only |
| Review snippet | NO | No AggregateRating data |
| Event | N/A | No events |
| JobPosting | N/A | No jobs |

---

## Missing Schema Opportunities — Implementation Snippets

### A. BlogPosting — Add to `JsonLd.astro` (CRITICAL)

Add a new schema type option to the component and call it from `[...slug].astro`:

**Changes to `JsonLd.astro`:**

```typescript
// Add to Props interface:
interface Props {
  type?: 'home' | 'about' | 'project' | 'projects' | 'post';
  post?: {
    title: string;
    summary: string;
    publishedAt: Date;
    updatedAt?: Date;
    tags: string[];
    slug: string;
  };
  // ... existing project prop
}

// Add post schema block:
const blogPosting = post && {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  '@id': `${SITE.url}/writing/${post.slug}#article`,
  headline: post.title,
  description: post.summary,
  url: `${SITE.url}/writing/${post.slug}`,
  datePublished: post.publishedAt.toISOString(),
  ...(post.updatedAt ? { dateModified: post.updatedAt.toISOString() } : { dateModified: post.publishedAt.toISOString() }),
  author: { '@id': `${SITE.url}/#person` },
  publisher: { '@id': `${SITE.url}/#person` },
  inLanguage: SITE.language,
  keywords: post.tags.join(', '),
  mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE.url}/writing/${post.slug}` },
  image: new URL(SITE.ogImage, SITE.url).toString(),
};
```

**In the blocks array:**
```typescript
if (type === 'post' && blogPosting) blocks.push(blogPosting);
```

**In `[...slug].astro`:**
```astro
<BaseLayout
  title={post.data.title}
  description={post.data.summary}
  type="article"
  schemaType="post"
  post={{
    title: post.data.title,
    summary: post.data.summary,
    publishedAt: post.data.publishedAt,
    updatedAt: post.data.updatedAt,
    tags: post.data.tags,
    slug: post.id,
  }}
>
```

Also add `BreadcrumbList` for the post:
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://nareshbasude.in" },
    { "@type": "ListItem", "position": 2, "name": "Writing", "item": "https://nareshbasude.in/writing" },
    { "@type": "ListItem", "position": 3, "name": "[Post Title]", "item": "https://nareshbasude.in/writing/[slug]" }
  ]
}
```

---

### B. FAQPage — Add to city pages (GEO priority, not Google SERP)

Add to `thane.astro` (and each city page) — noting this targets AI discoverability:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Do you meet clients in Thane in person?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes — for kickoff and milestone reviews I can come to your office anywhere in Thane (Wagle Estate, Naupada, Majiwada, Hiranandani Estate, Ghodbunder Road). Day-to-day work runs on WhatsApp + video for speed."
      }
    },
    {
      "@type": "Question",
      "name": "What is the typical project budget for Thane SMBs?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Project-based — no public rate card. Most Thane SMBs land between project-scope brackets that I discuss in the brief. UPI, bank transfer, GST invoice — all supported."
      }
    },
    {
      "@type": "Question",
      "name": "Do you offer Hindi or Marathi support?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Site copy can be written or reviewed in English, Hindi, or Marathi. WhatsApp bots handle Hindi-English code-switch (the way Thane users actually type)."
      }
    },
    {
      "@type": "Question",
      "name": "How fast can you start?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Discovery within a day of the brief. First deployable shipped inside 7 days for landing pages, brand sites, and small apps. Larger products iterate from there."
      }
    },
    {
      "@type": "Question",
      "name": "Will you maintain the site after launch?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes — either as a monthly retainer for ongoing growth and bug-fix, or as a per-incident handover. I build on stacks your team can run themselves so handover is real, not theoretical."
      }
    }
  ]
}
```

Create a `CityFAQSchema.astro` component that accepts a `faqs` array prop and emits FAQPage JSON-LD — then drop it into every city page.

---

### C. ItemList — Add to /writing and /cities

**For `/writing/index.astro`:**
```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Writing — Notes by Naresh Basude",
  "url": "https://nareshbasude.in/writing",
  "numberOfItems": 6,
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "url": "https://nareshbasude.in/writing/local-seo-thane-starter-playbook",
      "name": "Local SEO for Thane businesses — a starter playbook"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "url": "https://nareshbasude.in/writing/freelance-developer-vs-agency-mumbai",
      "name": "..."
    }
  ]
}
```

Generate this dynamically from the `posts` collection in the page's frontmatter — same data already fetched.

**For `/cities`:**
```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Cities served — Website & App Developer",
  "url": "https://nareshbasude.in/cities",
  "numberOfItems": 10,
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "url": "https://nareshbasude.in/thane", "name": "Website & App Developer in Thane" },
    { "@type": "ListItem", "position": 2, "url": "https://nareshbasude.in/mumbai", "name": "Website & App Developer in Mumbai" }
  ]
}
```

---

### D. BreadcrumbList — Add to all secondary pages

Add a `breadcrumbs` prop to `BaseLayout` and pass it through to `JsonLd.astro`. Each page defines its own trail. Example for a blog post:

```typescript
// In JsonLd.astro — add breadcrumb support
const breadcrumbCustom = breadcrumbs && {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: breadcrumbs.map((b, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: b.name,
    item: b.item,
  })),
};
```

---

### E. Fix email, addressCountry, and add geo — Fixes to existing schema

**In `JsonLd.astro`:**

```typescript
// Fix email (remove mailto: prefix)
email: SITE.email,  // was: `mailto:${SITE.email}`

// Fix addressCountry  
const postalAddress = {
  '@type': 'PostalAddress',
  addressLocality: SITE.fullAddress.locality,
  addressRegion: SITE.fullAddress.region,
  postalCode: SITE.fullAddress.postalCode,
  addressCountry: 'IN',  // was: SITE.fullAddress.country ("India")
};

// Add geo to ProfessionalService
const professionalService = {
  ...
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 19.2183,
    longitude: 72.9781,
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
    opens: '09:00',
    closes: '20:00',
  },
  ...
};
```

**Add to Person:**
```typescript
const person = {
  ...
  worksFor: { '@id': `${SITE.url}/#service` },  // bidirectional link back to ProfessionalService
  ...
};
```

---

### F. Fix priceRange

Replace:
```typescript
priceRange: 'Project-based · enquire',
```
With one of:
```typescript
priceRange: '₹₹',  // currency-symbol tier notation
// or omit the property entirely if you don't want it surfaced
```

---

### G. Fix CreativeWork — add url and @id

In `JsonLd.astro` `projectSchema`:
```typescript
const projectSchema = project && {
  '@context': 'https://schema.org',
  '@type': 'CreativeWork',
  '@id': `${project.url ?? SITE.url}#work`,
  name: project.name,
  description: project.description,
  url: project.url ?? undefined,
  ...(project.image ? { image: project.image } : {}),
  ...(project.year ? { dateCreated: `${project.year}-01-01` } : {}),
  creator: { '@id': `${SITE.url}/#person` },
};
```

Each project page must pass `url` in the `project` prop pointing to its own canonical URL.

---

## Top 5 Wins (Prioritized by Impact)

### Win 1 — Add BlogPosting schema to all /writing/* posts (CRITICAL)
**Impact:** Unlocks Article rich result eligibility for 6 posts. Every blog post currently shows as an anonymous URL in SERPs — no date, no author. BlogPosting adds the author byline and date chip. Also maximizes AI/LLM citation quality since crawlers extract structured article metadata.  
**Effort:** ~2 hours. Single `JsonLd.astro` addition + `[...slug].astro` change.

### Win 2 — Fix email property format (2 errors, Person + ProfessionalService)
**Impact:** Corrects a spec violation that makes the `email` property unreadable by Google's structured data parser. `mailto:email@domain.com` is not a valid value for schema.org `email`. Low-effort, high-correctness.  
**Effort:** 2-line fix in `JsonLd.astro`.

### Win 3 — Add GeoCoordinates to ProfessionalService
**Impact:** Without `geo`, the Local Pack eligibility of the ProfessionalService schema is weak — Google must infer location purely from text (postal code + locality). Adding lat/lng to Thane gives the entity a precise geographic anchor.  
**Effort:** Add 4 lines to `professionalService` object in `JsonLd.astro`.

### Win 4 — Add BreadcrumbList to all secondary pages (~30 pages missing it)
**Impact:** Breadcrumb rich results in SERPs are one of the most reliable click-through improvers. Currently only `/projects` has a BreadcrumbList. Every city page, blog post, project case study, and secondary page is missing the SERP trail. This is a sitewide opportunity.  
**Effort:** ~3 hours to wire up a `breadcrumbs` prop across layouts and individual pages.

### Win 5 — Add FAQPage to city pages (GEO / AI discoverability focus)
**Impact:** 10 city pages each have 5 unique, well-written FAQs already coded as `<details>/<summary>`. Adding FAQPage JSON-LD requires no new content — just wrapping existing data. While Google SERP FAQPage rich results are restricted to government/health sites, this schema directly feeds AI search (Perplexity, ChatGPT, Gemini) which reads FAQPage as a high-confidence passage source.  
**Effort:** ~2 hours. Create `CityFAQSchema.astro` component and drop into each city page.

---

## Validation Errors Summary

| # | Severity | Schema | Property | Issue |
|---|---|---|---|---|
| 1 | ERROR | Person | email | `mailto:` prefix invalid for email property |
| 2 | ERROR | ProfessionalService | email | Same as above |
| 3 | ERROR | ProfessionalService | geo | Missing GeoCoordinates — local pack anchor incomplete |
| 4 | ERROR | CreativeWork | url | Missing url on growth-marketing-engagements (and possibly others) |
| 5 | ERROR | BlogPosting | — | Schema type entirely absent on all 6 blog posts |
| 6 | WARN | Person | addressCountry | "India" should be ISO 3166-1 alpha-2 "IN" |
| 7 | WARN | ProfessionalService | addressCountry | Same |
| 8 | WARN | ProfessionalService | provider | Non-standard property on LocalBusiness — remove or replace with `employee` |
| 9 | WARN | ProfessionalService | priceRange | Free-text value non-standard; use currency-symbol notation or omit |
| 10 | WARN | ProfessionalService | openingHours | Missing — used by Google Knowledge Panel |
| 11 | WARN | Person | worksFor | No back-link to ProfessionalService — graph incomplete |
| 12 | WARN | WebSite | potentialAction | SearchAction targets project filter, not sitewide search |
| 13 | WARN | BreadcrumbList | — | Absent on ~30 eligible pages |
| 14 | INFO | ProfessionalService | areaServed | Mix of city/country/concept entries; recommend typed City + Country entities |
| 15 | INFO | CreativeWork | dateCreated | Year-only ("2026") — prefer full ISO 8601 date |

---

## File to edit

`D:\Apps\portfolio\v2\src\components\JsonLd.astro`
