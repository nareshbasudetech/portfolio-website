---
title: 'The 7-day delivery playbook — what gets done on each day'
summary: 'Day-by-day what actually happens when I promise a project delivered in 7 days — and the scope trades that make it possible.'
tags: ['process', 'freelance', 'ship', 'productivity']
publishedAt: 2026-05-04
readingTime: '6 min'
---

I tell clients projects are delivered in 7 days. Not "first deploy in 7 days, iteration thereafter" — *delivered*. Live URL, instrumentation, SEO, lifecycle, the whole thing.

The first question every client asks is "how is that possible?" The second is "what's the catch?" Both are fair. Here's the honest answer.

## Day 1 — Discovery (60 minutes, not 3 weeks)

Most agency engagements lose two weeks here. The discovery call becomes a workshop becomes a stakeholder review becomes a Notion doc.

What I do instead: one 60-minute call where we lock down three things.

1. **The number we'll move** — qualified leads per week, organic traffic, conversion rate, time-on-site, whatever. One metric. Everything else is in service of it.
2. **The shape** — marketing site, landing page suite, e-commerce, web app, mobile app. Decided in the call, not by the end of week 1.
3. **The constraints** — brand assets (have them or not), content (who writes), stack (any preferences), launch date (we work backwards from this)

After the call I send back a one-page scope document. You sign it or tell me what to change. Discovery is done.

## Day 2 — Design decisions, not design iterations

Most agency timelines burn here. Three rounds of mockups. Stakeholder feedback. Revisions. Two more rounds. By the time the design is "approved," week 3 is over.

What I do instead: I pick a design direction *on day 2*, not three. I work from the brand assets you have, pull in references from your competitors and from sites I respect in your space, and make decisions. The output is a working hero section and 2–3 reference page treatments inside a real browser, not Figma mockups.

The bargain we make: you give up the *committee approval* of design. You get the *speed* of decision. For most SMBs this is the right trade. Design-by-committee is a feature that costs you 3 weeks per project and doesn't actually produce better design.

## Days 3–4 — Build, content, copy, all at once

This is where 7-day projects diverge most from agency timelines. Agencies serialize: copy first, then design, then dev. I parallelize.

While the structural design is solidifying, I'm writing the actual sections in code. While the code is being written, I'm refining copy live in the browser. Brand decisions and UI components and content all flow together because *I'm the one doing all three*.

What you get on day 4: a working site, deployed to a staging URL, with real-looking content. Not Lorem Ipsum. Not Figma. Working code.

The scope trade: you don't get to review 12 Figma frames before code is written. You see the real thing first, give feedback against the real thing, and we adjust. Most clients prefer this. Some don't. Know which you are before you sign.

## Day 5 — Polish

This is where 7-day projects look like they shouldn't be possible. By end of day 4 the site works but it's rough — animations are stiff, type isn't quite right, copy needs a pass, some edge cases break.

Day 5 is for the things that turn "works" into "good." Hover states. Mobile composition. Image optimization. The accent color that pulls 4 sections together. Re-reading every paragraph and tightening it by 20%.

I don't add features on day 5. I subtract. The site at the end of day 5 has fewer ideas than the site at the end of day 4 — but each remaining idea is sharper.

## Day 6 — Test, instrument, harden

Now we cross from "works on my machine" to "ships."

- Lighthouse audit. Fix anything under 95
- Mobile pass on a real phone (not just Chrome's device emulator)
- Cross-browser pass — Chrome, Safari, Firefox, mobile Safari
- Forms tested end-to-end with real submissions
- Analytics installed and tested — GA4 events firing where they should
- SEO meta on every page — title, description, OG, canonical, schema
- Sitemap, robots.txt, llms.txt
- 404 page works, redirects from old URLs (if migrating) point right

Most agencies skip half of these or do them after launch. I do them before. The difference is whether a launch is "live and we'll fix things as we find them" or "live and we're done."

## Day 7 — Ship and handover

Deploy to production. DNS flip. SSL verify. Submit sitemap to Google Search Console and Bing Webmaster Tools. Send the client a short handover document: how to edit content, how to swap an image, what to call me about, what they can do themselves.

For about 80% of projects, day 7 ends with the site live and the client able to maintain it without me. For the other 20% (apps, larger products), day 7 is "first version live, here's what we'll iterate next."

## What 7 days *cannot* do

I'm honest about this on day 1.

- **A complete brand identity from zero**. If you don't have a logo, palette, type system, and one piece of brand-aligned photography or illustration — that's a brand sprint, separate engagement, separate week
- **Bespoke 3D / WebGL / video production**. Those need their own production timelines
- **Anything with multiple stakeholder approvals**. If 6 people need to approve the homepage hero, day 1 is the wrong time to find that out. The 7-day promise assumes one decision-maker
- **A full e-commerce store from zero with 200+ SKUs and integrations**. The platform setup, product photography, copy, and inventory integration take longer than 7 days. The marketing site around the store is 7 days. The store underneath needs more
- **A multi-month app build**. Apps with backend, accounts, payments, complex state — those are 4–12 weeks. The 7-day commitment is for the first deployable version, then iteration

What 7 days *can* do is most of what most SMBs and most startups actually need: a marketing site, a brand-led landing page suite, a small e-commerce build, a single-feature web app, a WhatsApp automation, or a growth-marketing campaign launch.

## The mental shift

7-day delivery isn't possible by working harder. It's possible by removing the things that consume time without producing output:

- Removing committee approval
- Removing serial handoffs between disciplines
- Removing the build-then-rebuild cycle that comes from Figma-first design
- Removing the project-management overhead that agencies bake in

You trade *control over each intermediate artifact* (Figma frames, brand guidelines docs, sitemap-as-spreadsheet) for *control over the final outcome*. For most SMBs this is the better trade. For some it isn't. Day-1 conversation is when we figure out which.

The promise reads aggressive on the home page. It's not — it's just the natural cadence of one person, one timeline, one decision-maker, working on something they can hold in their head end-to-end.
