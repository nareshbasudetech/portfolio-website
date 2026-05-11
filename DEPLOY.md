# Deploy to Hostinger

This site is a static Astro build (`dist/` after `npm run build`). Hostinger shared hosting is Apache-based — the `public/.htaccess` file already in this repo handles HTTPS, trailing-slash strip, security headers, caching, and the 404 page.

## One-time setup

1. **Domain**: point `nareshbasude.in` at your Hostinger plan in the Hostinger control panel → Domains. SSL is automatic via Let's Encrypt.
2. **GA4**: copy `.env.example` → `.env`, set `PUBLIC_GA_ID=G-XXXXXXXXXX` (your measurement ID). Leave blank to ship without analytics.
3. **Linked accounts**: edit `src/consts.ts` `CONTACT` block — fill in real `phone`, `whatsapp`, `linkedin` values.

## Deploying

### Option A — Hostinger File Manager / FTP (simplest)

```bash
npm run build
```

Then upload everything inside `dist/` (not the folder itself, the **contents**) to your `public_html/` directory on Hostinger via:
- **File Manager** in hPanel — drag-and-drop or zip-upload
- **FTP/SFTP** with FileZilla — credentials in hPanel → Files → FTP Accounts

### Option B — Hostinger Git (auto-deploy)

If you push this repo to GitHub and connect Hostinger's Git integration:

1. hPanel → Advanced → GIT → "Create Repository"
2. Set repository URL, branch (`main`), and install path (`/public_html/`)
3. Add a `.deploy.sh` (Hostinger runs this after pull) that runs `npm install && npm run build && cp -R dist/* /home/USERNAME/public_html/`

### Option C — Build locally, ship via rsync

```bash
npm run build
rsync -avz --delete dist/ USERNAME@nareshbasude.in:public_html/
```

## What lives in /public

These files copy through to `dist/` unchanged:

- `.htaccess` — Apache config (security headers, redirects, caching)
- `_headers` — backup config for Cloudflare/Netlify if you ever switch hosts
- `robots.txt`, `llms.txt`, `humans.txt`
- `favicon.svg`, `og.png`, `og.svg`, `manifest.webmanifest`
- `covers/*.svg` — case-study illustrations

The `_headers` file is a Cloudflare/Netlify convention; on Hostinger (Apache) it's inert. Keep it for portability.

## Sanity checks after deploy

- `https://nareshbasude.in/` → 200, returns the home page
- `https://nareshbasude.in/projects/` → returns the projects page (note: the `.htaccess` strips trailing slashes and rewrites `/projects` → `/projects/index.html`)
- `https://nareshbasude.in/sitemap-index.xml` → 200
- `https://nareshbasude.in/llms.txt` → 200
- `https://nareshbasude.in/robots.txt` → 200
- DevTools → Response headers should include `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`
