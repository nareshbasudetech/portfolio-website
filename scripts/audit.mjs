// Deep audit: crawl every page, capture screenshots at desktop+mobile,
// check console errors, validate links, surface TODOs and inconsistencies.
import { chromium, devices } from 'playwright';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { glob } from 'node:fs/promises';

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, '..', '.audit');
await mkdir(out, { recursive: true });
await mkdir(resolve(out, 'desktop'), { recursive: true });
await mkdir(resolve(out, 'mobile'), { recursive: true });

const ROUTES = [
  '/',
  '/projects',
  '/projects/growth-marketing-engagements',
  '/projects/naresh-crm-lead-management',
  '/projects/whatsapp-leadbot',
  '/projects/nursingpathshala-app',
  '/projects/education-platforms',
  '/projects/bookwithteachers',
  '/projects/nipcollege-rebuild',
  '/projects/web-templates',
  '/writing',
  '/writing/portfolio-as-departures-board',
  '/writing/tag/design',
  '/writing/tag/portfolio',
  '/writing/tag/web',
  '/about',
  '/contact',
  '/privacy',
  '/404',
];

const browser = await chromium.launch();

// ─── Desktop pass ──────────────────────────────────────────────────────
const dCtx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: 'reduce',
});

const desktopReport = [];
for (const route of ROUTES) {
  const page = await dCtx.newPage();
  const errors = [];
  const failedRequests = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`[error] ${m.text()}`);
  });
  page.on('pageerror', (e) => errors.push(`[pageerror] ${e.message}`));
  page.on('requestfailed', (req) =>
    failedRequests.push(`${req.method()} ${req.url()} → ${req.failure()?.errorText}`),
  );
  page.on('response', (resp) => {
    if (resp.status() >= 400) failedRequests.push(`${resp.status()} ${resp.url()}`);
  });

  const url = `http://localhost:4321${route}`;
  let status = 0;
  let title = '';
  let h1 = '';
  let metaDesc = '';
  let ogImage = '';
  let canonical = '';
  let h2s = [];
  let imgWithoutAlt = 0;
  let imgTotal = 0;
  let allLinks = [];
  let buttons = 0;

  try {
    const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    status = resp?.status() ?? 0;
    await page.waitForTimeout(700);

    const data = await page.evaluate(() => {
      const desc = document.querySelector('meta[name="description"]')?.content ?? '';
      const og = document.querySelector('meta[property="og:image"]')?.content ?? '';
      const canon = document.querySelector('link[rel="canonical"]')?.href ?? '';
      const h1Text = document.querySelector('h1')?.innerText?.trim() ?? '';
      const h2Texts = [...document.querySelectorAll('h2')].map((h) => h.innerText.trim()).slice(0, 12);
      const imgs = [...document.querySelectorAll('img')];
      const imgWithoutAltCount = imgs.filter((i) => !i.getAttribute('alt') && i.getAttribute('alt') !== '').length;
      const links = [...document.querySelectorAll('a[href]')].map((a) => ({
        href: a.getAttribute('href'),
        text: a.innerText.trim().slice(0, 40),
        target: a.target,
      }));
      return {
        desc, og, canon,
        h1Text, h2Texts,
        imgWithoutAltCount,
        imgTotal: imgs.length,
        allLinks: links,
        buttons: document.querySelectorAll('button').length,
      };
    });

    metaDesc = data.desc;
    ogImage = data.og;
    canonical = data.canon;
    title = await page.title();
    h1 = data.h1Text;
    h2s = data.h2Texts;
    imgWithoutAlt = data.imgWithoutAltCount;
    imgTotal = data.imgTotal;
    allLinks = data.allLinks;
    buttons = data.buttons;

    const slug = route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '_');
    await page.screenshot({ path: `${out}/desktop/${slug}.png`, fullPage: false });
  } catch (e) {
    errors.push(`[gotofailed] ${e.message}`);
  }

  desktopReport.push({
    route, status, title, h1, metaDesc, ogImage, canonical,
    h2s, imgTotal, imgWithoutAlt, buttons,
    linkCount: allLinks.length,
    links: allLinks,
    errors, failedRequests: [...new Set(failedRequests)],
  });
  await page.close();
}
await dCtx.close();

// ─── Mobile pass (just screenshots + errors) ─────────────────────────
const mCtx = await browser.newContext({ ...devices['iPhone 13'], reducedMotion: 'reduce' });
const mobileReport = [];
for (const route of ROUTES) {
  const page = await mCtx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  try {
    await page.goto(`http://localhost:4321${route}`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(500);
    const slug = route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '_');
    await page.screenshot({ path: `${out}/mobile/${slug}.png`, fullPage: false });
    mobileReport.push({ route, ok: true, errors });
  } catch (e) {
    mobileReport.push({ route, ok: false, error: e.message });
  }
  await page.close();
}
await mCtx.close();

// ─── Static asset checks (llms.txt, robots, sitemap, rss) ─────────
const STATIC = ['/llms.txt', '/robots.txt', '/humans.txt', '/sitemap-index.xml', '/rss.xml', '/writing/rss.xml', '/og.png', '/og.svg'];
const sCtx = await browser.newContext();
const staticReport = [];
for (const u of STATIC) {
  const page = await sCtx.newPage();
  const r = await page.goto(`http://localhost:4321${u}`, { waitUntil: 'load', timeout: 15000 }).catch((e) => null);
  staticReport.push({ url: u, status: r?.status() ?? 0 });
  await page.close();
}
await sCtx.close();
await browser.close();

// ─── Cross-page link validation ────────────────────────────────────
const allRoutes = new Set(ROUTES.map((r) => r.replace(/\/$/, '') || '/'));
const linkProblems = [];
for (const p of desktopReport) {
  for (const l of p.links) {
    const href = l.href;
    if (!href || href.startsWith('#')) continue;
    if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http://') || href.startsWith('https://')) continue;
    // Strip query/hash
    const clean = href.split('?')[0].split('#')[0].replace(/\/$/, '') || '/';
    // Allow /demos/* and /covers/* assets
    if (clean.startsWith('/demos/') || clean.startsWith('/covers/') || clean === '/rss.xml' || clean === '/sitemap-index.xml' || clean.endsWith('.html') || clean.endsWith('.xml') || clean.endsWith('.txt')) continue;
    if (!allRoutes.has(clean)) {
      linkProblems.push({ from: p.route, href, text: l.text });
    }
  }
}

// ─── TODO / placeholder scan in source ─────────────────────────────
const todoMatches = [];
async function scanFile(path) {
  try {
    const content = await readFile(path, 'utf-8');
    const lines = content.split('\n');
    lines.forEach((line, i) => {
      if (/TODO|FIXME|XXX|illustrative|placeholder/i.test(line)) {
        todoMatches.push({ file: path.replace(/.*v2[\\/]/, ''), line: i + 1, text: line.trim().slice(0, 140) });
      }
    });
  } catch {}
}

const sourceFiles = [];
for await (const f of glob('D:/Apps/portfolio/v2/src/**/*.{astro,md,mdx,ts,tsx,js}')) {
  sourceFiles.push(f);
}
for await (const f of glob('D:/Apps/portfolio/v2/public/{*.txt,*.svg}')) {
  sourceFiles.push(f);
}
for (const f of sourceFiles) await scanFile(f);

// ─── Report out ─────────────────────────────────────────────────────
const summary = {
  totalRoutes: ROUTES.length,
  routesOk: desktopReport.filter((r) => r.status === 200).length,
  routesError: desktopReport.filter((r) => r.status !== 200).length,
  totalConsoleErrors: desktopReport.reduce((a, r) => a + r.errors.length, 0),
  totalFailedRequests: desktopReport.reduce((a, r) => a + r.failedRequests.length, 0),
  imagesWithoutAlt: desktopReport.reduce((a, r) => a + r.imgWithoutAlt, 0),
  staticAssetIssues: staticReport.filter((s) => s.status !== 200),
  brokenInternalLinks: linkProblems,
  todoCount: todoMatches.length,
};

await writeFile(`${out}/summary.json`, JSON.stringify(summary, null, 2));
await writeFile(`${out}/desktop.json`, JSON.stringify(desktopReport, null, 2));
await writeFile(`${out}/mobile.json`, JSON.stringify(mobileReport, null, 2));
await writeFile(`${out}/static.json`, JSON.stringify(staticReport, null, 2));
await writeFile(`${out}/todos.json`, JSON.stringify(todoMatches, null, 2));
await writeFile(`${out}/broken-links.json`, JSON.stringify(linkProblems, null, 2));

console.log('=== AUDIT SUMMARY ===');
console.log(JSON.stringify(summary, null, 2));
console.log(`\nReports in ${out}/`);
