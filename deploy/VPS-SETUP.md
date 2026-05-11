# VPS Deployment Setup — nareshbasude.in

End state: push to `main` → GitHub Actions builds → rsyncs `dist/` to VPS → Caddy/nginx serves it.

The existing WhatsApp Bot site at `nareshbasude.in` moves to `whatsapp.nareshbasude.in`. Portfolio takes the apex.

---

## Step 1 — DNS

In Hostinger DNS panel (or wherever DNS is managed), add:

```
Type   Host        Value          TTL
A      whatsapp    <VPS IP>       14400
```

The apex `nareshbasude.in` A record already points at the VPS — no change needed.

Verify after ~5 min: `dig +short whatsapp.nareshbasude.in` should return the VPS IP.

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

## Step 6 — Migrate the bot site

You need to move the existing WhatsApp Bot site's nginx/Caddy config from `nareshbasude.in` → `whatsapp.nareshbasude.in`.

**If currently on nginx and you're switching to Caddy:**
1. Find the bot's files: `grep -rl nareshbasude /etc/nginx/sites-enabled/` (note the `root` path)
2. Add a `whatsapp.nareshbasude.in` block to the Caddyfile pointing at that root (see [Caddyfile.example](Caddyfile.example))
3. Disable nginx: `sudo systemctl disable --now nginx`
4. Reload Caddy: `sudo systemctl reload caddy`

**If keeping nginx:**
1. Edit the bot's existing server block: change `server_name nareshbasude.in` → `server_name whatsapp.nareshbasude.in`
2. Add the portfolio config from [nginx-portfolio.conf.example](nginx-portfolio.conf.example) for the apex
3. Run certbot for the new subdomain: `sudo certbot --nginx -d whatsapp.nareshbasude.in`
4. Reload: `sudo nginx -t && sudo systemctl reload nginx`

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

curl -I https://whatsapp.nareshbasude.in/
# Expect: HTTP/2 200 (bot site still serving)

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
