# VPS Deployment Setup — nareshbasude.in

End state: push to `main` → GitHub Actions builds → rsyncs `dist/` to VPS → Caddy/nginx serves it.

The existing site at `nareshbasude.in` (apex) gets **removed**. Portfolio takes the apex.
**`shruti.nareshbasude.in` stays untouched** — do not modify its config or files.

---

## Step 1 — DNS

No DNS changes needed. The apex `nareshbasude.in` A record already points at the VPS. `shruti.nareshbasude.in` is also already wired and stays as-is.

Verify the apex is correctly pointed before deploying:

```bash
dig +short nareshbasude.in        # → should return your VPS IP
dig +short shruti.nareshbasude.in # → should also return your VPS IP (or wherever shruti lives)
```

---

## Step 2 — SSH deploy user on VPS

Don't use root for deploys. Create a deploy user with write access to the portfolio web root.

```bash
# SSH into VPS as root (or your usual user)
ssh root@<VPS IP>

# Create the deploy user (or skip if you have one already)
sudo adduser --disabled-password --gecos "" deploy

# Create portfolio web root
sudo mkdir -p /var/www/portfolio
sudo chown -R deploy:deploy /var/www/portfolio
```

---

## Step 3 — Generate SSH deploy key

On your local machine (not the VPS):

```bash
ssh-keygen -t ed25519 -f ~/.ssh/nareshbasude_deploy -N "" -C "github-actions-deploy"
```

This creates two files:
- `~/.ssh/nareshbasude_deploy`        ← **private key, never share**, goes into GitHub Secrets
- `~/.ssh/nareshbasude_deploy.pub`    ← public key, goes on the VPS

Copy the public key to the VPS deploy user:

```bash
# Append public key to deploy user's authorized_keys
ssh-copy-id -i ~/.ssh/nareshbasude_deploy.pub deploy@<VPS IP>

# Or manually:
cat ~/.ssh/nareshbasude_deploy.pub | ssh root@<VPS IP> "mkdir -p /home/deploy/.ssh && cat >> /home/deploy/.ssh/authorized_keys && chown -R deploy:deploy /home/deploy/.ssh && chmod 700 /home/deploy/.ssh && chmod 600 /home/deploy/.ssh/authorized_keys"
```

Test it works:

```bash
ssh -i ~/.ssh/nareshbasude_deploy deploy@<VPS IP> "whoami && ls /var/www/portfolio"
```

Should print `deploy` and an empty listing.

---

## Step 4 — GitHub Actions secrets

Go to https://github.com/nareshbasudetech/portfolio-website/settings/secrets/actions and add:

| Secret name      | Value |
|---|---|
| `VPS_HOST`       | Your VPS IP or `nareshbasude.in` |
| `VPS_USER`       | `deploy` |
| `VPS_PORT`       | `22` (or your custom SSH port) |
| `VPS_PATH`       | `/var/www/portfolio` |
| `VPS_SSH_KEY`    | **Full contents** of `~/.ssh/nareshbasude_deploy` (private key, starts with `-----BEGIN OPENSSH PRIVATE KEY-----`) |
| `PUBLIC_GA_ID`   | Your GA4 measurement ID (e.g. `G-XXXXXXXXXX`), or leave unset to ship without analytics |

---

## Step 5 — Install Caddy on VPS (recommended)

Skip this step if your VPS already has nginx and you prefer to keep it (use [nginx-portfolio.conf.example](nginx-portfolio.conf.example) instead).

```bash
# As root on VPS
sudo apt update
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install -y caddy

# Open firewall ports if ufw is active
sudo ufw allow 80,443/tcp
```

Then copy [Caddyfile.example](Caddyfile.example) to `/etc/caddy/Caddyfile`, edit it (update the `whatsapp.nareshbasude.in` block's root path to match where your bot currently lives), and reload:

```bash
sudo nginx -t  # if you're keeping nginx — disable it first: sudo systemctl disable --now nginx
sudo cp Caddyfile.example /etc/caddy/Caddyfile  # then edit
sudo systemctl reload caddy
sudo systemctl status caddy
```

Caddy auto-fetches Let's Encrypt SSL certs on first request. Give it 30 seconds after reload.

---

## Step 6 — Remove the apex site, preserve shruti subdomain

The existing site at `nareshbasude.in` (apex) gets deleted entirely. `shruti.nareshbasude.in` stays running.

### 6a — Discover what's currently serving what

Before touching anything, find both configs and confirm which files are which.

```bash
# Find all configs that mention nareshbasude
grep -rln "nareshbasude" /etc/nginx /etc/caddy /etc/apache2 2>/dev/null

# Inspect each one — note the `root` path (where the site files live) and the
# `server_name` directive (which hostname it serves)
sudo cat /etc/nginx/sites-enabled/nareshbasude*   # if nginx
sudo cat /etc/caddy/Caddyfile                     # if caddy

# What's responding right now
curl -I https://nareshbasude.in
curl -I https://shruti.nareshbasude.in
```

Write down two things:

- **APEX_ROOT** = the document root for `nareshbasude.in` (the site you're removing)
- **SHRUTI_ROOT** = the document root for `shruti.nareshbasude.in` (preserve this)

### 6b — Remove the apex site

**If on nginx:**

```bash
# Disable the apex site server block (don't delete yet — easier to recover)
sudo rm /etc/nginx/sites-enabled/nareshbasude.in
# Keep /etc/nginx/sites-available/ copy in case you need to recover.

# Verify nothing breaks
sudo nginx -t

# Test that shruti still serves
curl -I https://shruti.nareshbasude.in
```

**If on Caddy:**

```bash
# Edit /etc/caddy/Caddyfile and DELETE only the block(s) starting with
#   nareshbasude.in {
#   www.nareshbasude.in {
# Leave any  shruti.nareshbasude.in {  block intact.
sudo nano /etc/caddy/Caddyfile

# Validate + reload
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy

# Test that shruti still serves
curl -I https://shruti.nareshbasude.in
```

### 6c — Remove the old apex files (after the portfolio is deployed and verified)

Don't delete files until after step 7 succeeds. Then:

```bash
# Move first, delete later — safer
sudo mv $APEX_ROOT /var/www/_old_apex_$(date +%Y%m%d)
# Wait a week, confirm nothing breaks, then:
# sudo rm -rf /var/www/_old_apex_*
```

### 6d — Install the new portfolio config

**If on Caddy:**

Copy [Caddyfile.example](Caddyfile.example) into `/etc/caddy/Caddyfile`. **Important**: if shruti is also being served by Caddy, copy its existing `shruti.nareshbasude.in { ... }` block into the new Caddyfile too — otherwise it'll stop serving when you reload.

```bash
# Back up the current Caddyfile
sudo cp /etc/caddy/Caddyfile /etc/caddy/Caddyfile.bak.$(date +%Y%m%d)

# Edit /etc/caddy/Caddyfile:
#   - Replace the old nareshbasude.in apex block with the one from deploy/Caddyfile.example
#   - KEEP the shruti.nareshbasude.in block intact (copy from the .bak file if needed)
sudo nano /etc/caddy/Caddyfile

sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

**If keeping nginx:**

```bash
# Install the new apex config
sudo cp deploy/nginx-portfolio.conf.example /etc/nginx/sites-available/nareshbasude.in
sudo nano /etc/nginx/sites-available/nareshbasude.in   # uncomment SSL lines
sudo ln -s /etc/nginx/sites-available/nareshbasude.in /etc/nginx/sites-enabled/

# Provision SSL
sudo certbot --nginx -d nareshbasude.in -d www.nareshbasude.in

# Reload
sudo nginx -t && sudo systemctl reload nginx
```

After this step:
- `nareshbasude.in` → 502/empty (until step 7 deploys portfolio files)
- `shruti.nareshbasude.in` → still serving normally
- `whatsapp.nareshbasude.in` → no longer exists (was never set up; we changed the plan)

---

## Step 7 — Trigger the first deploy

Easiest: push any change to `main`. Or trigger manually via GitHub:

```
https://github.com/nareshbasudetech/portfolio-website/actions/workflows/deploy.yml
→ "Run workflow" → main → Run
```

Watch the run live. The workflow:
1. Checks out the repo
2. `npm ci && npm run build`
3. Validates `dist/` has 50+ pages, sitemap, robots, llms.txt
4. SSHes into the VPS using the deploy key
5. `rsync --delete dist/ → /var/www/portfolio/`
6. Smoke-tests via curl on the live URL

Total time: ~90 seconds.

---

## Step 8 — Smoke checks

After the first successful deploy:

```bash
curl -I https://nareshbasude.in/
# Expect: HTTP/2 200, Strict-Transport-Security header, X-Content-Type-Options

curl -sf https://nareshbasude.in/sitemap-index.xml | head -3
# Expect: <?xml version="1.0" ...

curl -sf https://nareshbasude.in/llms.txt | head -3
# Expect: # Naresh Basude — Website & App Developer ...

curl -I https://shruti.nareshbasude.in/
# Expect: HTTP/2 200 (untouched — must still serve normally)

curl -I https://www.nareshbasude.in/
# Expect: HTTP/2 301, Location: https://nareshbasude.in/

curl -I https://nareshbasude.in/thane/
# Expect: HTTP/2 301, Location: https://nareshbasude.in/thane (trailing-slash strip)
```

---

## Step 9 — Post-deploy

Submit the sitemap to Search Console:

```
https://search.google.com/search-console
→ Add property → nareshbasude.in
→ Verify (TXT record or HTML file)
→ Sitemaps → submit https://nareshbasude.in/sitemap-index.xml
```

Same for Bing Webmaster Tools.

---

## Rolling back a bad deploy

GitHub Actions doesn't keep the previous `dist/` on the VPS (we use `rsync --delete`). To roll back:

```bash
# On the VPS
cd /var/www/portfolio
ls -la  # confirm timestamps
# rsync from a previous build, or:

# OR — locally, check out the prior commit and run the workflow manually
git checkout <previous-commit>
gh workflow run deploy.yml
```

For real production-grade rollback, add a step to the workflow that archives the prior `dist/` to `/var/www/portfolio.prev` before rsyncing. Skipped for now — keep it simple, redeploy if needed.

---

## What happens on every push to `main`

1. CI builds (~30s).
2. Sanity-checks the build (sitemap exists, 50+ pages, etc.).
3. SSHes in with the deploy key.
4. Rsyncs `dist/` → `/var/www/portfolio/` (only changed files transfer).
5. Smoke-tests via curl.

If any step fails, the deploy aborts and the previous version stays live. Caddy/nginx never reloads — only file contents change.
