---
title: 'A portfolio as a departures board'
summary: 'Why I built my 2026 site like an airport flight indicator — and what it taught me about how portfolios should signal availability.'
tags: ['design', 'web', 'portfolio']
publishedAt: 2026-05-10
readingTime: '4 min'
---

Most portfolios show projects as a grid. Mine shows them as a departures board — `BOARDING`, `DEPLOYED`, `IN-FLIGHT`. The metaphor isn't novelty for novelty's sake. A portfolio's job is to communicate three things at once: what I've shipped, what I'm doing now, and what I'm available for. A grid covers the first. A board covers all three.

## The problem with the grid

Card grids force every project into the same visual weight. The site I built three years ago doesn't look meaningfully different from the project I shipped last month. To a hiring manager that's noise — they're trying to figure out *what is this person doing right now*, and a grid says *here are some things they did, in no particular order*.

A good portfolio answers the *now* question on first scroll.

## Why the board metaphor works

A flight board has a fixed grammar:

- **DESTINATION** — the project name
- **STATUS** — boarding (live), deployed (shipped), in-flight (active engagement)
- **GATE / DISCIPLINE** — what kind of work it is
- **TIME** — when it happened or when it leaves

That grammar is also the grammar of how a hiring manager evaluates a portfolio. The format doesn't add cognitive load — it removes it.

The "BOARDING" row is the trick. It signals availability without a cheesy "available for hire" banner. One row sits at the top, blinks gently, and points to /contact. Everything else points to past work. The hierarchy reads instantly.

## What I'd do differently

If I rebuild this in a year, I'd:

- Make the board re-flap on scroll-into-view, not just once on load
- Cut the discipline column on mobile entirely (already does, but I'd promote a discipline tag inline with the destination)
- Add a "next departure" countdown to a real calendar event, not a static "Q3 2026" string

The point isn't the metaphor — it's the question the metaphor answers. *What's leaving the gate next?* Every portfolio should answer that.
