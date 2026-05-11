---
title: 'BookWithTeachers · E-learning + Bookstore'
summary: 'An online learning platform and study-material bookstore for pharmacy students — courses, materials, and bookings in one product.'
role: 'Full-stack · Product'
discipline: ['Dev', 'Design', 'Marketing']
year: 2026
accent: '#22c55e'
url: 'https://bookwithteachers.com'
featured: true
publishedAt: 2026-02-20
---

## Three products, one student

A pharmacy student doesn't think of "study material," "video courses," and "tutoring sessions" as three separate categories. To them it's one question — *how do I pass this exam* — with three answers.

The market was answering that one question with three different products. A YouTube channel. An Instagram-marketed PDF bundle. A Telegram group where someone might tutor you if you DM'd at the right time. Three logins, three payment systems, three apps to switch between when the syllabus crossed boundaries.

BookWithTeachers' brief was to fold those three answers into one product, and make it feel like one product, not a stitched dashboard.

## Information architecture is the product

When you have three logical surfaces — Learn, Materials, Tutors — the lazy way to design is to give each its own home page, its own filters, its own URLs, its own *opinions*. The student would open the app, see three doors, and have to pick.

That's wrong for this audience. Pharmacy students are not browsing — they're studying for a specific exam, on a specific date, with specific gaps. They don't want three doors. They want *one feed* that says "here's what's next."

So the homepage isn't three modules. It's one page, organized by the syllabus, that pulls in lessons (from Learn), recommended notes and books (from Materials), and available tutor slots (from Bookings) on the same scroll. The three "products" are still distinct in the database, but they show up to the student woven together by topic.

## The role layer

Every surface had to work for three roles:

- **Students** see the syllabus-driven feed, their progress, their cart, their bookings
- **Teachers** see their session calendar, their student roster, their content uploads
- **Admins** see the catalog, orders, payouts, and a flat view of everything

We didn't build three separate apps. We built one app with role-aware navigation. The same `/dashboard` route renders three completely different things based on who's logged in. The same component library underpins all three. When the brand updates, every role's surface inherits it.

This is the pattern I default to now: **one shell, role-scoped contents**. It's slightly more work upfront and dramatically less work in maintenance.

## What I shipped

- Learning surface with course playback, lesson notes, progress tracking, and a "continue where you left off" home card
- Bookstore for printed and digital study material — pharmacy-focused, with smart filters by subject and exam type
- Tutor booking flow with availability, session management, video-call handoff, and post-session notes
- Cart that spans courses, books, and tutor sessions in a single checkout — students don't pay three times
- Role-aware dashboard so students, teachers, and admins all use the same shell
- Admin layer for catalog management, content moderation, payouts, and order fulfillment
- Lifecycle messaging — exam reminders, abandoned-cart nudges, and tutor-session prep

## Tech notes

- Next.js App Router with React Server Components for fast first-paint on slow connections
- PostgreSQL for catalog, orders, and bookings; Redis for the cart session
- Razorpay for the Indian payments rail — cart spans physical books (with shipping) and digital products (instant access)
- Real-time tutor session signaling via WebSockets; Daily.co for the video room itself
- A small admin DSL for promo rules so marketing can run discounts without engineering
- Server-side rendered pages, with progressive enhancement for the cart and dashboard

## What was harder than it looked

Mixed-cart checkout. A student putting *one course + one printed book + one tutor session* into one cart is, on paper, a simple feature. In practice it's three different fulfillment models — instant access, physical shipping, scheduled session — that have to checkout together and unwind individually if any one fails. Refunding a partial cart, especially when the book has shipped but the session hasn't started, was the kind of problem that took two iterations to get right.

The other quiet problem was content moderation. Teachers upload their own material — videos, PDFs, sample tests. Some of it is great. Some of it is "I made this in 10 minutes between shifts." The platform needed a moderation queue and a clear quality bar without becoming gatekeepy enough that good teachers gave up. We landed on auto-publish + ratings, with the catalog ranking respecting both quality and recency.

## Outcome

<!-- TODO: replace with real metric — current numbers are illustrative -->

A single platform that pharmacy students treat as their study home — class to material to bookings without leaving the site. Teachers run their schedule from the same product instead of WhatsApp side-channels. Orders span all three surfaces without making the student notice they're spanning surfaces.

## What I'd do differently

I'd build the syllabus tagger sooner. Cross-surface recommendations — *"students studying this lesson also bought this book"* — only work if every piece of content is tagged to the same syllabus tree. We built the tagger in month four, after a thousand pieces of content had already been added without it. Backfilling tags is dull work. Doing it from day one would have been ten times cheaper.
