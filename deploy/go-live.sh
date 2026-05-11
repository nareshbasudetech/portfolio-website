#!/usr/bin/env bash
# go-live.sh — one-shot, run on the VPS as root. Does everything:
#
#   1. Discovers + backs up existing web-server config
#   2. Disables the apex site (preserves shruti.nareshbasude.in)
#   3. Creates deploy user + /var/www/portfolio
#   4. Installs Caddy if missing
#   5. Writes the portfolio Caddyfile (preserves shruti if it's also on Caddy)
#   6. Generates an SSH deploy key on the VPS
#   7. Installs the public key for the deploy user
#   8. Prints the exact 4 values to paste into GitHub Secrets
#
# USAGE
#   ssh root@<vps-ip>
#   curl -sSL https://raw.githubusercontent.com/nareshbasudetech/portfolio-website/main/deploy/go-live.sh | bash
#
# Or with the --yes flag to skip the destructive-action confirmation:
#   curl -sSL https://raw.githubusercontent.com/nareshbasudetech/portfolio-website/main/deploy/go-live.sh | bash -s -- --yes

set -euo pipefail

YES=0
for arg in "$@"; do
  case "$arg" in
    --yes|-y) YES=1 ;;
    *) echo "unknown flag: $arg"; exit 2 ;;
  esac
done

c_red()    { printf "\033[31m%s\033[0m\n" "$*"; }
c_green()  { printf "\033[32m%s\033[0m\n" "$*"; }
c_yellow() { printf "\033[33m%s\033[0m\n" "$*"; }
c_blue()   { printf "\033[1;34m%s\033[0m\n" "$*"; }
hr()       { c_blue "════════════════════════════════════════════════════════════════"; }
header()   { echo; hr; c_blue "  $*"; hr; }

[[ $EUID -eq 0 ]] || { c_red "Run as root (or via sudo)."; exit 1; }

DATE_STAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_DIR="/root/portfolio-deploy-backups/$DATE_STAMP"
mkdir -p "$BACKUP_DIR"

# ════════════════════════════════════════════════════════════════════
header "STEP 1/8 — Discovery"
# ════════════════════════════════════════════════════════════════════
. /etc/os-release && c_yellow "OS: $PRETTY_NAME"

# Detect active web servers
ACTIVE_WS=""
for svc in caddy nginx apache2; do
  if systemctl is-active --quiet "$svc" 2>/dev/null; then
    ACTIVE_WS="$svc"
    c_yellow "Active web server: $svc"
    break
  fi
done

# Find apex + shruti configs
mapfile -t APEX_CONFIGS < <(grep -rln "nareshbasude" /etc/nginx /etc/caddy /etc/apache2 2>/dev/null | xargs -r -I{} grep -L "shruti" {} 2>/dev/null || true)
mapfile -t SHRUTI_CONFIGS < <(grep -rln "shruti" /etc/nginx /etc/caddy /etc/apache2 2>/dev/null || true)

if [[ ${#APEX_CONFIGS[@]} -gt 0 ]]; then
  c_yellow "Apex configs found:"
  printf '  %s\n' "${APEX_CONFIGS[@]}"
fi
if [[ ${#SHRUTI_CONFIGS[@]} -gt 0 ]]; then
  c_green "Shruti configs found (will be preserved):"
  printf '  %s\n' "${SHRUTI_CONFIGS[@]}"
fi

# Find apex doc roots
APEX_ROOTS=()
for f in "${APEX_CONFIGS[@]:-}"; do
  [[ -z "$f" ]] && continue
  while IFS= read -r root; do
    [[ -n "$root" && -d "$root" ]] && APEX_ROOTS+=("$root")
  done < <(grep -hE "^\s*root\s+" "$f" 2>/dev/null | sed -E 's/^\s*root\s*\*?\s*//; s/;.*//; s/^[ \t]+//; s/[ \t]+$//' | sort -u)
done

# Confirm
if [[ $YES -eq 0 ]]; then
  echo
  c_red "About to:"
  c_red "  • Back up apex configs to $BACKUP_DIR"
  c_red "  • Disable the apex (nareshbasude.in) site"
  c_red "  • Leave shruti.nareshbasude.in untouched"
  c_red "  • Create deploy user + /var/www/portfolio"
  c_red "  • Install Caddy if missing, configure it for the apex"
  c_red "  • Generate an SSH deploy key (printed at the end)"
  echo
  read -r -p "Continue? (type 'yes'): " ANSWER </dev/tty
  [[ "$ANSWER" == "yes" ]] || { c_red "Aborted."; exit 1; }
fi

# ════════════════════════════════════════════════════════════════════
header "STEP 2/8 — Backing up + disabling apex configs"
# ════════════════════════════════════════════════════════════════════
for f in "${APEX_CONFIGS[@]:-}"; do
  [[ -z "$f" ]] && continue
  cp -a "$f" "$BACKUP_DIR/" && echo "  backed up: $f"
  if [[ -L "$f" && "$f" == */sites-enabled/* ]]; then
    rm "$f"; echo "  removed symlink: $f"
  elif [[ "$f" == */sites-available/* ]]; then
    base=$(basename "$f")
    [[ -L "/etc/nginx/sites-enabled/$base" ]] && rm "/etc/nginx/sites-enabled/$base" && echo "  removed symlink: /etc/nginx/sites-enabled/$base"
  elif [[ "$f" == */conf.d/* ]]; then
    mv "$f" "$f.disabled-$DATE_STAMP"; echo "  disabled: $f.disabled-$DATE_STAMP"
  elif [[ "$f" == */Caddyfile* ]]; then
    c_yellow "  Caddyfile detected — will rewrite preserving shruti block (Step 5)"
  fi
done

# Move old apex web roots aside
for root in "${APEX_ROOTS[@]:-}"; do
  [[ -z "$root" || ! -d "$root" ]] && continue
  target="/var/www/_old_apex_${DATE_STAMP}_$(basename "$root")"
  mv "$root" "$target"
  echo "  moved: $root -> $target"
done

# ════════════════════════════════════════════════════════════════════
header "STEP 3/8 — Creating deploy user + /var/www/portfolio"
# ════════════════════════════════════════════════════════════════════
if ! id deploy >/dev/null 2>&1; then
  adduser --disabled-password --gecos "" --shell /bin/bash deploy
  echo "  created user: deploy"
else
  echo "  user 'deploy' already exists"
fi
mkdir -p /var/www/portfolio
chown -R deploy:deploy /var/www/portfolio
chmod 755 /var/www/portfolio
echo "  /var/www/portfolio ready (owner: $(stat -c '%U:%G' /var/www/portfolio))"

# rsync must be installed for the GitHub Actions deploy
apt-get install -y -qq rsync >/dev/null

# ════════════════════════════════════════════════════════════════════
header "STEP 4/8 — Web server check + Caddy install"
# ════════════════════════════════════════════════════════════════════
if [[ "$ACTIVE_WS" == "nginx" ]] || [[ "$ACTIVE_WS" == "apache2" ]]; then
  c_yellow "Existing $ACTIVE_WS is active — stopping it so Caddy can bind 80/443"
  c_yellow "(shruti config from $ACTIVE_WS will be migrated to Caddy in Step 5)"
  systemctl stop "$ACTIVE_WS"
  systemctl disable "$ACTIVE_WS" 2>/dev/null || true
fi

if ! command -v caddy >/dev/null 2>&1; then
  echo "  Installing Caddy..."
  apt-get update -qq
  apt-get install -y -qq debian-keyring debian-archive-keyring apt-transport-https curl gpg >/dev/null
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list >/dev/null
  apt-get update -qq
  apt-get install -y -qq caddy >/dev/null
  echo "  Caddy installed."
else
  echo "  Caddy already installed."
fi

# Firewall
if command -v ufw >/dev/null 2>&1 && ufw status | grep -q "Status: active"; then
  ufw allow 80/tcp >/dev/null 2>&1 || true
  ufw allow 443/tcp >/dev/null 2>&1 || true
  echo "  ufw: 80/443 allowed"
fi

# ════════════════════════════════════════════════════════════════════
header "STEP 5/8 — Writing Caddyfile (preserving shruti)"
# ════════════════════════════════════════════════════════════════════

# Try to detect what shruti is — static dir or reverse proxy
SHRUTI_BLOCK=""
SHRUTI_ROOT=""
for f in "${SHRUTI_CONFIGS[@]:-}"; do
  [[ -z "$f" ]] && continue
  root_line=$(grep -hE "^\s*root\s+" "$f" 2>/dev/null | head -1 | sed -E 's/^\s*root\s*\*?\s*//; s/;.*//; s/[ \t]+$//')
  proxy_line=$(grep -hE "proxy_pass|reverse_proxy" "$f" 2>/dev/null | head -1)
  if [[ -n "$root_line" && -d "$root_line" ]]; then
    SHRUTI_ROOT="$root_line"
  fi
  if [[ -n "$proxy_line" ]]; then
    SHRUTI_PROXY=$(echo "$proxy_line" | grep -oE "(localhost|127\.0\.0\.1):[0-9]+" | head -1)
  fi
done

if [[ -n "${SHRUTI_PROXY:-}" ]]; then
  SHRUTI_BLOCK="shruti.nareshbasude.in {
    reverse_proxy $SHRUTI_PROXY
    encode zstd gzip
    header Strict-Transport-Security \"max-age=31536000; includeSubDomains\"
}"
  echo "  Shruti config detected: reverse proxy to $SHRUTI_PROXY"
elif [[ -n "$SHRUTI_ROOT" ]]; then
  SHRUTI_BLOCK="shruti.nareshbasude.in {
    root * $SHRUTI_ROOT
    encode zstd gzip
    file_server
    header Strict-Transport-Security \"max-age=31536000; includeSubDomains\"
    try_files {path} {path}/index.html /index.html
}"
  echo "  Shruti config detected: static files at $SHRUTI_ROOT"
else
  c_yellow "  No shruti config detected via grep. If shruti.nareshbasude.in is hosted elsewhere"
  c_yellow "  (different container, separate VPS, etc.), Caddy won't try to serve it — fine."
fi

# Backup current Caddyfile
[[ -f /etc/caddy/Caddyfile ]] && cp /etc/caddy/Caddyfile "$BACKUP_DIR/Caddyfile.original"

cat > /etc/caddy/Caddyfile <<EOF
# Auto-generated by go-live.sh on $(date)
# Backups: $BACKUP_DIR

# ─── PORTFOLIO (apex + www) ──────────────────────────────────────────
nareshbasude.in, www.nareshbasude.in {
    root * /var/www/portfolio
    encode zstd gzip

    header {
        Strict-Transport-Security      "max-age=31536000; includeSubDomains; preload"
        X-Content-Type-Options         nosniff
        X-Frame-Options                SAMEORIGIN
        Referrer-Policy                strict-origin-when-cross-origin
        Permissions-Policy             "camera=(), microphone=(), geolocation=()"
        -Server
    }

    @assets path *.css *.js *.svg *.png *.jpg *.jpeg *.webp *.avif *.ico *.woff *.woff2 *.ttf
    header @assets Cache-Control "public, max-age=31536000, immutable"
    @html path *.html
    header @html Cache-Control "public, max-age=300, must-revalidate"

    @trailing_slash path_regexp ts ^(/.+)/\$
    redir @trailing_slash {re.ts.1} 301

    @www host www.nareshbasude.in
    redir @www https://nareshbasude.in{uri} 301

    try_files {path} {path}/index.html {path}.html /404.html
    file_server

    handle_errors {
        @404 expression \`{err.status_code} == 404\`
        rewrite @404 /404.html
        file_server
    }
}

# ─── SHRUTI (preserved) ──────────────────────────────────────────────
$SHRUTI_BLOCK
EOF

caddy validate --config /etc/caddy/Caddyfile 2>&1 | tail -5
systemctl enable --now caddy >/dev/null 2>&1 || true
systemctl reload caddy
echo "  Caddyfile installed + Caddy reloaded"

# ════════════════════════════════════════════════════════════════════
header "STEP 6/8 — Generating SSH deploy key on VPS"
# ════════════════════════════════════════════════════════════════════
SSH_KEY=/home/deploy/.ssh/gh_actions_deploy
sudo -u deploy mkdir -p /home/deploy/.ssh
sudo -u deploy chmod 700 /home/deploy/.ssh

if [[ ! -f "$SSH_KEY" ]]; then
  sudo -u deploy ssh-keygen -t ed25519 -f "$SSH_KEY" -N "" -C "gh-actions-deploy-$DATE_STAMP"
  echo "  generated: $SSH_KEY"
else
  echo "  keypair already exists at $SSH_KEY (reusing)"
fi

# ════════════════════════════════════════════════════════════════════
header "STEP 7/8 — Installing public key in authorized_keys"
# ════════════════════════════════════════════════════════════════════
PUB_KEY=$(cat "$SSH_KEY.pub")
AUTH_KEYS=/home/deploy/.ssh/authorized_keys
sudo -u deploy touch "$AUTH_KEYS"
if ! grep -qF "$PUB_KEY" "$AUTH_KEYS"; then
  echo "$PUB_KEY" | sudo -u deploy tee -a "$AUTH_KEYS" >/dev/null
  echo "  public key added to $AUTH_KEYS"
else
  echo "  public key already in $AUTH_KEYS (skipping)"
fi
sudo -u deploy chmod 600 "$AUTH_KEYS"

# ════════════════════════════════════════════════════════════════════
header "STEP 8/8 — Verifying"
# ════════════════════════════════════════════════════════════════════
sleep 2
apex_code=$(curl -sk -o /dev/null -w "%{http_code}" --max-time 5 "https://nareshbasude.in/" 2>/dev/null || echo "FAIL")
shruti_code=$(curl -sk -o /dev/null -w "%{http_code}" --max-time 5 "https://shruti.nareshbasude.in/" 2>/dev/null || echo "FAIL")
echo "  https://nareshbasude.in/         -> HTTP $apex_code (expected: 404 or 502 until first deploy)"
echo "  https://shruti.nareshbasude.in/  -> HTTP $shruti_code (expected: same as before)"

VPS_IP=$(curl -s --max-time 5 https://api.ipify.org 2>/dev/null || ip -4 addr show scope global | grep -oP '(?<=inet\s)\d+(\.\d+){3}' | head -1)

echo
hr
c_green "✓ VPS IS READY. Paste these 4 values into GitHub Secrets:"
hr
echo
echo "   Go to: https://github.com/nareshbasudetech/portfolio-website/settings/secrets/actions"
echo "   Click 'New repository secret' four times."
echo
c_yellow "─ Secret 1 ─────────────────────────────────"
echo "Name:  VPS_HOST"
echo "Value: $VPS_IP"
echo
c_yellow "─ Secret 2 ─────────────────────────────────"
echo "Name:  VPS_USER"
echo "Value: deploy"
echo
c_yellow "─ Secret 3 ─────────────────────────────────"
echo "Name:  VPS_PATH"
echo "Value: /var/www/portfolio"
echo
c_yellow "─ Secret 4 ─────────────────────────────────"
echo "Name:  VPS_SSH_KEY"
echo "Value: (copy ALL of the block below, including the BEGIN/END lines)"
echo
cat "$SSH_KEY"
echo
hr
c_green "After pasting all 4 secrets, trigger the first deploy:"
echo "  https://github.com/nareshbasudetech/portfolio-website/actions/workflows/deploy.yml"
echo "  → Run workflow → main → Run"
echo
c_green "90 seconds later: https://nareshbasude.in is the portfolio."
c_green "Backups: $BACKUP_DIR"
hr
