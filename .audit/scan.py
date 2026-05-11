#!/usr/bin/env python3
"""Offline SEO audit scanner for the dist/ build."""
import io
import json
import os
import re
import sys
from pathlib import Path
from collections import Counter, defaultdict

# Force UTF-8 stdout on Windows
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", line_buffering=True)
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", line_buffering=True)

DIST = Path(__file__).resolve().parent.parent / "dist"
OUT = Path(__file__).resolve().parent

if not DIST.exists():
    print("ERROR: dist/ not found. Run npm run build first.")
    sys.exit(1)

# ---------- helpers ----------
TITLE_RE = re.compile(r"<title[^>]*>([^<]*)</title>", re.I | re.S)
DESC_RE = re.compile(r'<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"\']*)["\']', re.I)
CANON_RE = re.compile(r'<link[^>]*rel=["\']canonical["\'][^>]*href=["\']([^"\']*)["\']', re.I)
OG_RE = re.compile(r'<meta[^>]*property=["\']og:([^"\']+)["\'][^>]*content=["\']([^"\']*)["\']', re.I)
TW_RE = re.compile(r'<meta[^>]*name=["\']twitter:([^"\']+)["\'][^>]*content=["\']([^"\']*)["\']', re.I)
H_RE = re.compile(r"<(h[1-6])[^>]*>(.*?)</\1>", re.I | re.S)
LDJSON_RE = re.compile(r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>', re.I | re.S)
IMG_RE = re.compile(r"<img\b([^>]*)>", re.I)
ALT_RE = re.compile(r'\balt=["\']([^"\']*)["\']', re.I)
HREF_RE = re.compile(r'<a\b[^>]*href=["\']([^"\']*)["\']', re.I)
TEXT_TAG_RE = re.compile(r"<[^>]+>")
HEAD_RE = re.compile(r"<head[^>]*>(.*?)</head>", re.I | re.S)
BODY_RE = re.compile(r"<body[^>]*>(.*?)</body>", re.I | re.S)
SCRIPT_STYLE_RE = re.compile(r"<(script|style)[^>]*>.*?</\1>", re.I | re.S)
NAV_FOOT_RE = re.compile(r"<(nav|footer|header)[^>]*>.*?</\1>", re.I | re.S)

# noindex / nofollow
NOINDEX_RE = re.compile(r'<meta[^>]*name=["\']robots["\'][^>]*content=["\']([^"\']*)["\']', re.I)
VIEWPORT_RE = re.compile(r'<meta[^>]*name=["\']viewport["\']', re.I)

def textify(html: str) -> str:
    h = SCRIPT_STYLE_RE.sub(" ", html)
    h = TEXT_TAG_RE.sub(" ", h)
    h = re.sub(r"&[#\w]+;", " ", h)
    return re.sub(r"\s+", " ", h).strip()

# ---------- scan ----------
pages = []
for p in sorted(DIST.rglob("*.html")):
    rel = p.relative_to(DIST).as_posix()
    html = p.read_text(encoding="utf-8", errors="ignore")
    url = "/" + rel.replace("index.html", "").rstrip("/")
    if url == "":
        url = "/"

    title_m = TITLE_RE.search(html)
    desc_m = DESC_RE.search(html)
    canon_m = CANON_RE.search(html)
    robots_m = NOINDEX_RE.search(html)
    viewport_m = VIEWPORT_RE.search(html)

    title = title_m.group(1).strip() if title_m else ""
    desc = desc_m.group(1).strip() if desc_m else ""
    canon = canon_m.group(1).strip() if canon_m else ""
    robots = robots_m.group(1).strip() if robots_m else ""
    viewport = bool(viewport_m)

    headings = defaultdict(list)
    for tag, content in H_RE.findall(html):
        txt = re.sub(r"\s+", " ", textify(content)).strip()
        if txt:
            headings[tag.lower()].append(txt)

    # OG / Twitter
    og = {k.lower(): v for k, v in OG_RE.findall(html)}
    tw = {k.lower(): v for k, v in TW_RE.findall(html)}

    # JSON-LD parsing
    ldjsons = []
    types = []
    for raw in LDJSON_RE.findall(html):
        try:
            data = json.loads(raw)
        except Exception as e:
            ldjsons.append({"_error": str(e)[:100], "_raw_head": raw[:80]})
            continue
        ldjsons.append(data)
        items = data if isinstance(data, list) else [data]
        for it in items:
            t = it.get("@type")
            if isinstance(t, list):
                types.extend(t)
            elif t:
                types.append(t)

    # Body content for word count (strip nav/header/footer to get unique content)
    body_m = BODY_RE.search(html)
    body_html = body_m.group(1) if body_m else html
    unique_html = NAV_FOOT_RE.sub(" ", body_html)
    unique_text = textify(unique_html)
    wc_total = len(textify(body_html).split())
    wc_unique = len(unique_text.split())

    # Images / alt
    imgs = IMG_RE.findall(html)
    missing_alt = 0
    empty_alt = 0
    total_imgs = len(imgs)
    for attrs in imgs:
        m = ALT_RE.search(attrs)
        if not m:
            missing_alt += 1
        elif m.group(1).strip() == "":
            empty_alt += 1

    # Internal links from body (exclude nav/footer/header)
    internal_links = []
    for href in HREF_RE.findall(unique_html):
        if href.startswith(("/", "https://nareshbasude.in", "http://nareshbasude.in")):
            internal_links.append(href)

    pages.append({
        "path": rel,
        "url": url,
        "title": title,
        "title_len": len(title),
        "desc": desc,
        "desc_len": len(desc),
        "canonical": canon,
        "robots_meta": robots,
        "viewport": viewport,
        "h1": headings.get("h1", []),
        "h_counts": {k: len(v) for k, v in headings.items()},
        "og_title": og.get("title", ""),
        "og_desc": og.get("description", ""),
        "og_image": og.get("image", ""),
        "twitter_card": tw.get("card", ""),
        "ld_count": len(ldjsons),
        "ld_types": types,
        "ld_errors": [j.get("_error") for j in ldjsons if isinstance(j, dict) and j.get("_error")],
        "wc_total": wc_total,
        "wc_unique": wc_unique,
        "img_total": total_imgs,
        "img_missing_alt": missing_alt,
        "img_empty_alt": empty_alt,
        "internal_link_count": len(internal_links),
    })

# Write JSON
(OUT / "pages.json").write_text(json.dumps(pages, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Scanned {len(pages)} pages → .audit/pages.json")

# ---------- summary ----------
print("\n=== TITLE LENGTH ISSUES ===")
for p in pages:
    if p["title_len"] == 0:
        print(f"  MISSING  {p['url']}")
    elif p["title_len"] > 60:
        print(f"  LONG  {p['title_len']:>3}  {p['url']}  | {p['title']}")
    elif p["title_len"] < 30:
        print(f"  SHORT {p['title_len']:>3}  {p['url']}  | {p['title']}")

print("\n=== DESCRIPTION LENGTH ISSUES ===")
for p in pages:
    if p["desc_len"] == 0:
        print(f"  MISSING  {p['url']}")
    elif p["desc_len"] > 160:
        print(f"  LONG  {p['desc_len']:>3}  {p['url']}")
    elif p["desc_len"] < 120:
        print(f"  SHORT {p['desc_len']:>3}  {p['url']}  | {p['desc'][:80]}")

print("\n=== H1 ISSUES ===")
for p in pages:
    n = len(p["h1"])
    if n == 0:
        print(f"  NO-H1     {p['url']}")
    elif n > 1:
        print(f"  MULTI-H1  {p['url']}  ({n})  | {p['h1'][:3]}")

print("\n=== CANONICAL ===")
no_canon = [p["url"] for p in pages if not p["canonical"]]
print(f"  Pages without canonical: {len(no_canon)}")
for u in no_canon[:10]:
    print(f"    {u}")

print("\n=== JSON-LD ===")
for p in pages:
    if p["ld_count"] == 0:
        print(f"  NO-LD     {p['url']}")
    if p["ld_errors"]:
        print(f"  LD-ERR    {p['url']}  | {p['ld_errors']}")
type_counter = Counter()
for p in pages:
    type_counter.update(p["ld_types"])
print(f"  @type frequency: {dict(type_counter)}")

print("\n=== IMAGE ALT ===")
total = sum(p["img_total"] for p in pages)
missing = sum(p["img_missing_alt"] for p in pages)
empty = sum(p["img_empty_alt"] for p in pages)
print(f"  Total imgs: {total}, missing alt: {missing}, empty alt: {empty}")
for p in pages:
    if p["img_missing_alt"] > 0:
        print(f"    {p['url']}  missing={p['img_missing_alt']}/{p['img_total']}")

print("\n=== THIN CONTENT (unique <300 words) ===")
for p in pages:
    if p["wc_unique"] < 300:
        print(f"  {p['wc_unique']:>4}  {p['url']}")

print("\n=== VIEWPORT META ===")
for p in pages:
    if not p["viewport"]:
        print(f"  NO-VIEWPORT  {p['url']}")

print("\n=== OG / TWITTER ===")
for p in pages:
    if not p["og_title"] or not p["og_image"]:
        print(f"  MISSING-OG  {p['url']}  (title={bool(p['og_title'])} img={bool(p['og_image'])})")
    if not p["twitter_card"]:
        print(f"  NO-TW-CARD  {p['url']}")

print("\n=== OK ===")
