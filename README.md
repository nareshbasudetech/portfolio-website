# Naresh Basude — Portfolio v2

Astro + TypeScript + Tailwind v4. Static SSG. Optimized for SEO and AI-search (GEO) — ships near-zero JS, has llms.txt, JSON-LD on every page, sitemap + RSS, and a strict CSP-friendly head.

## Stack

- **Astro 5** — content-driven, zero-JS by default
- **TypeScript** — strict mode
- **Tailwind v4** — via `@tailwindcss/vite`
- **MDX + Content Collections** — type-safe project case studies
- **@astrojs/sitemap** — auto-generated `sitemap-index.xml`
- **@astrojs/rss** — `/rss.xml`

## Scripts

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # outputs to ./dist
npm run preview
npm run check     # astro check (typecheck)
```

## Project shape

```
src/
  components/      Nav, Footer, SEO meta, JSON-LD
  content/
    projects/      .md case studies (front-matter typed in content.config.ts)
  layouts/         BaseLayout
  pages/           index · about · contact · projects/[...slug] · rss.xml · 404
  styles/          global.css (Tailwind v4 entry + tokens)
  consts.ts        Site identity, nav, brand
public/
  llms.txt         AI-search citation guide
  robots.txt       Crawler rules — explicitly welcomes AI search bots
  CNAME            nareshbasude.in
  favicon.svg, og.svg, manifest.webmanifest, _headers
```

## SEO / GEO setup

- **Per-page** `<SEO />` component sets canonical, OG, Twitter, robots.
- **JSON-LD** Person + WebSite schemas on every page; CreativeWork on project pages; BreadcrumbList on `/projects`.
- **`llms.txt`** at the root provides a structured site summary for AI crawlers and answer engines.
- **`robots.txt`** explicitly allows GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, etc.
- **Sitemap + RSS** are auto-generated and linked in `<head>` and `robots.txt`.

## Deploying

The `public/CNAME` and `public/_headers` files target Cloudflare Pages (or GitHub Pages with custom domain). Build command: `npm run build`. Output: `dist/`.

## Adding a project

Drop a new `.md` (or `.mdx`) into `src/content/projects/`:

```yaml
---
title: 'Project name'
summary: 'One-liner.'
role: 'Your role'
discipline: ['Dev', 'Design']  # any of Dev | Design | Marketing
year: 2026
accent: '#7b5cff'
featured: true
publishedAt: 2026-01-15
---

Body in Markdown / MDX.
```
