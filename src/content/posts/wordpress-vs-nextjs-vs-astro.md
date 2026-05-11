---
title: 'WordPress vs. Next.js vs. Astro — a no-religion guide for SMBs'
summary: 'Three questions that actually determine which stack fits your business — and why the wrong answer costs you years of maintenance pain.'
tags: ['dev', 'wordpress', 'nextjs', 'astro', 'decisions']
publishedAt: 2026-04-28
readingTime: '8 min'
---

The internet is full of "WordPress vs. Next.js" posts written by people who have a religious answer locked in before they start typing. Most of them recommend whatever the author personally builds in. Ignore those.

The honest answer is that the right stack depends on *your business*, not on what's currently popular on Twitter. Three questions narrow it down. Get them right and the choice is obvious.

## Question 1 — Who will edit content after launch?

This is the question that matters most and that most "tech stack" guides ignore.

**If your team will edit content** — a marketing manager updating courses, a comms team posting news, a counsellor adding admissions deadlines — the right answer is almost always **WordPress**. Not because WordPress is the prettiest stack but because *your team already knows how it works*. There's nothing to learn. Five hundred million sites run on WordPress; everyone has seen its admin layer once.

The cost of "we built it on the cool new stack" is a Notion doc explaining how to publish a new course page. Six steps. The marketing manager files an engineering ticket instead. The site updates twice a year, not twice a week.

**If your team will not edit content** — most marketing decisions go through engineering anyway, or content velocity isn't a goal — then WordPress's admin layer becomes overhead you're paying for and not using. **Next.js or Astro** wins here. Faster sites, cleaner code, no plugin-hell maintenance.

This single question correctly answers 70% of stack decisions. The rest of this article is for the remaining 30%.

## Question 2 — How fast does the site need to be?

WordPress can be fast. Most of the time it isn't.

A default WordPress site with the cheapest hosting and 12 plugins loads in 4–6 seconds. A well-tuned WordPress site with a custom theme, no page builder, and proper caching loads in 1–2 seconds. A static Astro or Next.js site loads in under a second.

For most SMB marketing sites, 1–2 seconds is fine. The difference between 1s and 0.4s is invisible to humans. So WordPress being slower than Astro is *not a tiebreaker* unless one of these applies:

- **You're optimizing for Core Web Vitals** because Google ranking matters and your competitors are also under 2s. In which case Astro/Next.js give you a head start
- **You're serving very slow networks** — rural India, 3G mobile, low-end Android phones. Sub-1s page loads matter. Static wins
- **You're paying for ads to land on the site** — every 100ms of load time costs you 1% of conversions. With a ₹5L/month ad budget, performance becomes a money question
- **You're indexing for AI search engines** (Perplexity, ChatGPT, AI Overviews) — they reward fast, schema-clean, structured-content sites

If none of those apply, WordPress at 1.5–2 seconds is fine and the maintainability win is worth it.

## Question 3 — Is there a backend, or just content?

This is the cleanest tiebreaker.

**Pure content** — pages, news, faculty profiles, courses, blog. No accounts, no transactions, no real-time anything. Either WordPress or Astro is the right answer. WordPress if the team will edit; Astro if engineering will.

**Dynamic logic** — accounts, payments, dashboards, real-time chat, role-based access, lead-management. Now you need a real backend stack. WordPress can sort-of do this with plugins, but those plugins compound into a maintenance nightmare. **Next.js with a real database and edge functions** is the right answer. Astro can do it too, but Next.js has the broader ecosystem here.

**Hybrid** — marketing site + a dashboard or admin tool behind login. The right pattern is usually *separate them*: marketing site on Astro or WordPress (whichever fits the content question), dashboard on Next.js, both on the same brand. Don't try to make one stack do both.

## The decision tree

```
Will your team edit content after launch?
├── Yes → WordPress (almost always)
│         (faster admin onboarding, plugin ecosystem, your team knows it)
└── No → How fast does it need to be?
         ├── 1–2s is fine, content is mostly static
         │   └── Astro (best DX, smallest output, easiest to maintain)
         └── < 1s required AND dynamic logic / accounts / payments
             └── Next.js (broadest ecosystem, server components, edge)
```

Three questions, one answer. Most "stack debates" are people skipping these and arguing about what's cool.

## The four anti-patterns

### Anti-pattern 1 — "Let's use Next.js because we might need it later"

You won't. 90% of "we might need a dashboard" projects never build the dashboard. You just paid 2× the cost and 2× the build time for an option you'll never exercise. Build for now; you can swap stacks in year 3 if you actually need to.

### Anti-pattern 2 — "Let's use WordPress because it's cheap"

WordPress is cheap to start. The bill arrives 18 months in, when 12 plugins have stopped getting updates, your hosting is rate-limited, and someone is asking why the site goes down on Tuesdays. WordPress is cheap *if you maintain it like an actual system*. If you don't have that discipline, the lifetime cost is higher than a static site that quietly works forever.

### Anti-pattern 3 — "Let's use Astro for everything because it's fast"

Astro is great at content. Astro is *not* great at apps with accounts, payments, and real-time state. Don't make Astro do something it isn't designed for. The right stack for an app is Next.js (or Remix, or T3, or any modern full-stack React framework). Astro is a content stack with island interactivity. Use it for what it's for.

### Anti-pattern 4 — "Let's use a page builder because the team isn't technical"

Page builders (Elementor, Divi, WPBakery) feel empowering at first. You can drag a hero around. The marketing manager loves it for two weeks. Then the bill arrives: the site is twice as heavy, three times slower, and the "easy to edit" pages produce HTML that's allergic to mobile. Two years later you can't migrate off it because everything is locked into the builder's proprietary block format.

If your team isn't technical, the right answer is *custom WordPress theme + ACF for structured fields* — your team gets a guided editing experience for the things you've decided are editable, without the rest of the page-builder lock-in. The [NIP College rebuild](/projects/nipcollege-rebuild) is built exactly this way.

## What I actually use

For the projects I shipped in 2026:

- [NIP College](/projects/nipcollege-rebuild) — WordPress. Team-edited, content-led, no dynamic logic. Right answer.
- [Education Platforms (ABS + NGI)](/projects/education-platforms) — WordPress + custom admin panel. Same reason.
- [BookWithTeachers](/projects/bookwithteachers) — Next.js. Has accounts, role-aware dashboards, mixed-cart checkout, real-time tutor sessions. Right answer.
- [Naresh-CRM](/projects/naresh-crm-lead-management) — Next.js. Multi-role app, integrations, dashboards.
- [NursingPathshala](/projects/nursingpathshala-app) — Next.js (PWA). Offline-aware, push, role-aware.
- This portfolio — Astro. Content-led, no logic, performance-tuned, occasionally edited by engineering.

The pattern: WordPress when the team edits, Next.js for apps, Astro for editorial. Each one chosen by the three questions, not by religion.

## The stack you choose for someone else

If you're making this decision for a client or a team that isn't you — the question changes. It's no longer "what's the technically best stack." It's "what's the best stack *for the people who will own this in year three*."

That answer is almost never the newest, coolest, most technically interesting choice. It's the stack that the team can run themselves, hire for cheaply, and not regret in two years. For most SMBs that's WordPress. For most product teams it's Next.js. For most editorial sites it's Astro.

Pick by who maintains it. The rest is religion.
