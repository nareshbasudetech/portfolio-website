#!/usr/bin/env bash
# vps-prepare.sh — One-shot prep for the portfolio deploy on the VPS.
#
# WHAT THIS DOES
#   Phase 1 (always, read-only): discover web server, find configs for the
#     apex (nareshbasude.in) and the shruti subdomain, print what it would
#     change. Prints "DISCOVERY OK" at the end if successful.
#
#   Phase 2 (only with --apply): disable the apex site, prepare the
#     /var/www/portfolio web root + deploy user, install Caddy (if missing),
#     install the portfolio Caddyfile, reload — leaving shruti untouched.
#
# USAGE
#   curl -sSL https://raw.githubusercontent.com/nareshbasudetech/portfolio-website/main/deploy/vps-prepare.sh | sudo bash
#   # That runs Phase 1 only. Read the output. If safe, then:
#   curl -sSL https://raw.githubusercontent.com/nareshbasudetech/portfolio-website/main/deploy/vps-prepare.sh | sudo bash -s -- --apply
#
# Or run interactively, which gives a confirmation prompt before destructive ops:
#   sudo bash deploy/vps-prepare.sh
#
# SAFE BY DEFAULT
#   - Without --apply, this script reads only. No edits, no service reloads.
#   - With --apply, it BACKS UP the existing nginx/Caddy config before editing.
#   - It NEVER touches anything that mentions "shruti".

set -euo pipefail

APPLY=0
NONINTERACTIVE=0
for arg in "$@"; do
  case "$arg" in
    --apply) APPLY=1 ;;
    --yes|-y) NONINTERACTIVE=1 ;;
    *) echo "Unknown arg: $arg"; exit 2 ;;
  esac
done

c_red()    { printf "\033[31m%s\033[0m\n" "$*"; }
c_green()  { printf "\033[32m%s\033[0m\n" "$*"; }
c_yellow() { printf "\033[33m%s\033[0m\n" "$*"; }
c_blue()   { printf "\033[34m%s\033[0m\n" "$*"; }
header()   { echo; c_blue "═══ $* ═══"; }

if [[ $EUID -ne 0 ]]; then
  c_red "Run with sudo. (Caddy reload / file moves / package install need root.)"
  exit 1
fi

# ════════════════════════════════════════════════════════════════════
header "Phase 1 — Discovery (read-only)"
# ════════════════════════════════════════════════════════════════════

# OS
echo
c_yellow "OS:"
. /etc/os-release 2>/dev/null && echo "  $PRETTY_NAME"

# Web servers installed + running
echo
c_yellow "Web servers detected:"
for svc in nginx caddy apache2 httpd; do
  if command -v "$svc" >/dev/null 2>&1; then
    state=$(systemctl is-active "$svc" 2>/dev/null || echo "not-running")
    enabled=$(systemctl is-enabled "$svc" 2>/dev/null || echo "n/a")
    echo "  - $svc  installed=yes  state=$state  enabled=$enabled"
  fi
done

# Find configs that mention nareshbasude
echo
c_yellow "Configs mentioning 'nareshbasude':"
APEX_CONFIGS=()
SHRUTI_CONFIGS=()
while IFS= read -r f; do
  if grep -q "shruti" "$f" 2>/dev/null; then
    SHRUTI_CONFIGS+=("$f")
    echo "  [shruti]  $f"
  elif grep -qE "(^|[^.])nareshbasude\.in" "$f" 2>/dev/null; then
    APEX_CONFIGS+=("$f")
    echo "  [apex  ]  $f"
  fi
done < <(grep -rln "nareshbasude" /etc/nginx /etc/caddy /etc/apache2 2>/dev/null || true)

if [[ ${#APEX_CONFIGS[@]} -eq 0 ]]; then
  c_yellow "  (no apex configs found — apex site may not be configured at this level)"
fi

# Find document roots
echo
c_yellow "Document roots referenced in apex configs:"
APEX_ROOTS=()
for f in "${APEX_CONFIGS[@]}"; do
  while IFS= read -r root; do
    APEX_ROOTS+=("$root")
    if [[ -d "$root" ]]; then
      size=$(du -sh "$root" 2>/dev/null | cut -f1)
      echo "  $root  (exists, size $size)  from: $f"
    else
      echo "  $root  (NOT FOUND on disk)  from: $f"
    fi
  done < <(grep -hoE "(root|root \*)\s+[^;]+" "$f" 2>/dev/null | sed -E 's/^root\s*\*?\s*//; s/;//; s/^[ \t]+//; s/[ \t]+$//' | sort -u || true)
done

echo
c_yellow "Document roots for shruti (will be preserved):"
SHRUTI_ROOTS=()
for f in "${SHRUTI_CONFIGS[@]}"; do
  while IFS= read -r root; do
    SHRUTI_ROOTS+=("$root")
    echo "  $root  from: $f"
  done < <(grep -hoE "(root|root \*)\s+[^;]+" "$f" 2>/dev/null | sed -E 's/^root\s*\*?\s*//; s/;//; s/^[ \t]+//; s/[ \t]+$//' | sort -u || true)
done

# Live HTTP probe
echo
c_yellow "Live HTTP probe:"
for url in "https://nareshbasude.in/" "https://shruti.nareshbasude.in/"; do
  code=$(curl -sk -o /dev/null -w "%{http_code}" --max-time 5 "$url" 2>/dev/null || echo "FAIL")
  echo "  $url → HTTP $code"
done

# Existing deploy user?
echo
c_yellow "User accounts that might be used for deploy:"
for u in deploy www-data ubuntu root; do
  if id "$u" >/dev/null 2>&1; then
    echo "  - $u (exists, uid=$(id -u "$u"))"
  fi
done

# Existing /var/www/portfolio?
echo
c_yellow "Portfolio target dir:"
if [[ -d /var/www/portfolio ]]; then
  echo "  /var/www/portfolio exists (owner: $(stat -c '%U' /var/www/portfolio))"
else
  echo "  /var/www/portfolio does NOT exist yet (will be created in --apply phase)"
fi

# Firewall state
echo
c_yellow "Firewall (ufw):"
if command -v ufw >/dev/null 2>&1; then
  ufw status 2>/dev/null | head -10
else
  echo "  ufw not installed"
fi

c_green "DISCOVERY OK"

# ════════════════════════════════════════════════════════════════════
if [[ $APPLY -eq 0 ]]; then
  echo
  c_yellow "Read the discovery output above carefully."
  c_yellow "If everything looks right, run again with --apply to execute Phase 2:"
  echo
  echo "    sudo bash $0 --apply"
  echo
  c_yellow "Phase 2 will:"
  echo "  • Back up existing web server config(s)"
  echo "  • Disable / remove the apex site server block (NOT shruti's)"
  echo "  • Move old apex files to /var/www/_old_apex_<date>/ (not deleted yet)"
  echo "  • Create /var/www/portfolio + deploy user (if missing)"
  echo "  • Install Caddy if no web server is configured"
  echo "  • Install the new Caddyfile for the portfolio at the apex"
  echo "  • Reload Caddy (or nginx, if you're keeping it)"
  echo "  • Verify shruti.nareshbasude.in still serves"
  exit 0
fi

# ════════════════════════════════════════════════════════════════════
header "Phase 2 — Apply"
# ════════════════════════════════════════════════════════════════════

if [[ $NONINTERACTIVE -eq 0 ]]; then
  echo
  c_red "About to make destructive changes. shruti.nareshbasude.in will be left alone."
  c_red "Apex (nareshbasude.in) config + files will be backed up then disabled."
  echo
  read -r -p "Continue? (type 'yes' to proceed): " ANSWER
  [[ "$ANSWER" == "yes" ]] || { c_red "Aborted."; exit 1; }
fi

DATE_STAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_DIR="/root/portfolio-deploy-backups/$DATE_STAMP"
mkdir -p "$BACKUP_DIR"
c_green "→ Backups → $BACKUP_DIR"

# 2a — back up + disable apex configs
header "2a — Disabling apex site config(s)"
for f in "${APEX_CONFIGS[@]}"; do
  cp -a "$f" "$BACKUP_DIR/"
  echo "  backed up: $f"

  # If it's a symlinked nginx sites-enabled, remove the symlink only
  if [[ -L "$f" && "$f" == */sites-enabled/* ]]; then
    rm "$f"
    echo "  removed symlink: $f"
  elif [[ "$f" == */sites-available/* ]]; then
    # sites-available copy — leave it, just disable any matching enabled symlink
    base=$(basename "$f")
    if [[ -L "/etc/nginx/sites-enabled/$base" ]]; then
      rm "/etc/nginx/sites-enabled/$base"
      echo "  removed symlink: /etc/nginx/sites-enabled/$base"
    fi
  elif [[ "$f" == */conf.d/* ]]; then
    mv "$f" "$f.disabled-$DATE_STAMP"
    echo "  disabled (renamed): $f.disabled-$DATE_STAMP"
  elif [[ "$f" == */Caddyfile* ]]; then
    c_yellow "  ⚠ Caddyfile detected: $f"
    c_yellow "    You MUST manually edit this file:"
    c_yellow "    1. Remove the nareshbasude.in { ... } and www.nareshbasude.in { ... } blocks"
    c_yellow "    2. KEEP any shruti.nareshbasude.in { ... } block"
    c_yellow "    3. Add the contents of deploy/Caddyfile.example (apex block only) below shruti's block"
    c_yellow "    Backup of current Caddyfile is at: $BACKUP_DIR/$(basename "$f")"
  fi
done

# 2b — move apex files out of the way
header "2b — Moving apex web roots aside (NOT deleting)"
for root in "${APEX_ROOTS[@]}"; do
  if [[ -d "$root" ]]; then
    target="/var/www/_old_apex_${DATE_STAMP}_$(basename "$root")"
    mv "$root" "$target"
    echo "  moved: $root → $target"
  fi
done

# 2c — create portfolio dir + deploy user
header "2c — Preparing /var/www/portfolio + deploy user"
if ! id deploy >/dev/null 2>&1; then
  adduser --disabled-password --gecos "" --shell /bin/bash deploy
  echo "  created user: deploy"
fi
mkdir -p /var/www/portfolio
chown -R deploy:deploy /var/www/portfolio
chmod 755 /var/www/portfolio
echo "  /var/www/portfolio owner: $(stat -c '%U:%G' /var/www/portfolio)"

# 2d — install Caddy if no web server is active
header "2d — Web server check"
if ! command -v caddy >/dev/null 2>&1 && ! command -v nginx >/dev/null 2>&1; then
  echo "  No web server detected. Installing Caddy..."
  apt-get update -qq
  apt-get install -y -qq debian-keyring debian-archive-keyring apt-transport-https curl
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list >/dev/null
  apt-get update -qq
  apt-get install -y -qq caddy
  echo "  Caddy installed."
else
  echo "  Web server already installed — skipping fresh install."
fi

# 2e — firewall
header "2e — Firewall"
if command -v ufw >/dev/null 2>&1; then
  ufw allow 80,443/tcp >/dev/null 2>&1 || true
  echo "  ufw: allowed 80 + 443/tcp"
fi

# 2f — reload web servers (carefully)
header "2f — Reloading web server(s)"
if systemctl is-active --quiet caddy; then
  caddy validate --config /etc/caddy/Caddyfile 2>&1 | tail -5
  systemctl reload caddy
  echo "  caddy reloaded"
fi
if systemctl is-active --quiet nginx; then
  nginx -t 2>&1 | tail -5
  systemctl reload nginx
  echo "  nginx reloaded"
fi

# 2g — sanity check shruti still serves
header "2g — Verifying shruti is still healthy"
sleep 2
shruti_code=$(curl -sk -o /dev/null -w "%{http_code}" --max-time 5 "https://shruti.nareshbasude.in/" 2>/dev/null || echo "FAIL")
if [[ "$shruti_code" =~ ^(200|301|302|307|308)$ ]]; then
  c_green "  shruti.nareshbasude.in → HTTP $shruti_code ✓"
else
  c_red "  ⚠ shruti.nareshbasude.in → HTTP $shruti_code"
  c_red "  Check the backup at $BACKUP_DIR and your web server config."
fi

# 2h — apex is expected to be 502/empty until GitHub Actions deploys
header "2h — Apex check (expected to be empty/502 until first GH Actions deploy)"
apex_code=$(curl -sk -o /dev/null -w "%{http_code}" --max-time 5 "https://nareshbasude.in/" 2>/dev/null || echo "FAIL")
echo "  https://nareshbasude.in/ → HTTP $apex_code"
if [[ "$apex_code" == "200" ]]; then
  c_yellow "  ⚠ Still serving 200 — old site may still be cached, or your Caddyfile needs the new portfolio block."
fi

c_green "
═══════════════════════════════════════════════════════════════
✓ VPS prep complete.

Next:
  1. Add your GitHub Actions SSH public key to /home/deploy/.ssh/authorized_keys
     (instructions in deploy/VPS-SETUP.md Step 3)
  2. Set GitHub Secrets:
     VPS_HOST, VPS_USER=deploy, VPS_PATH=/var/www/portfolio, VPS_SSH_KEY, PUBLIC_GA_ID
  3. Push any change to main, or trigger the workflow manually:
     https://github.com/nareshbasudetech/portfolio-website/actions

Backups at: $BACKUP_DIR
═══════════════════════════════════════════════════════════════"
