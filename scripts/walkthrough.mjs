import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, '..', '.walkthrough');
await mkdir(out, { recursive: true });

const pages = [
  { slug: 'home',           url: 'http://localhost:4321/' },
  { slug: 'projects',       url: 'http://localhost:4321/projects' },
  { slug: 'project-detail', url: 'http://localhost:4321/projects/naresh-crm-lead-management' },
  { slug: 'project-templates', url: 'http://localhost:4321/projects/web-templates' },
  { slug: 'about',          url: 'http://localhost:4321/about' },
  { slug: 'contact',        url: 'http://localhost:4321/contact' },
  { slug: 'writing',        url: 'http://localhost:4321/writing' },
];

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  reducedMotion: 'reduce',
});

const findings = [];

for (const p of pages) {
  const page = await context.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));

  console.log(`\n=== ${p.slug}: ${p.url} ===`);
  await page.goto(p.url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(800);

  // Take fold-only screenshot
  await page.screenshot({ path: `${out}/${p.slug}-fold.png`, fullPage: false });

  // First-paint visible text + obvious interactive elements
  const data = await page.evaluate(() => {
    const main = document.querySelector('main') || document.body;
    const h1 = main.querySelector('h1')?.innerText?.trim() || '';
    const lede = main.querySelector('p')?.innerText?.trim()?.slice(0, 250) || '';
    const ctas = [...document.querySelectorAll('a.btn, .nav__cta, .feat__cta')]
      .map((el) => el.innerText.trim()).slice(0, 6);
    const links = [...document.querySelectorAll('a')].length;
    const interactiveAboveFold = [...document.querySelectorAll('a, button')].filter((el) => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight && r.top >= 0 && r.width > 0;
    }).length;
    const docTitle = document.title;
    return { docTitle, h1, lede, ctas, links, interactiveAboveFold };
  });

  findings.push({ ...p, ...data, errors });
  console.log(`  title: ${data.docTitle}`);
  console.log(`  h1   : ${data.h1.slice(0, 80)}`);
  console.log(`  lede : ${data.lede.slice(0, 120)}`);
  console.log(`  ctas : ${data.ctas.join(' | ')}`);
  console.log(`  links: ${data.links} (${data.interactiveAboveFold} above fold)`);
  if (errors.length) console.log(`  ERRS : ${errors.slice(0, 3).join(' | ')}`);

  await page.close();
}

await browser.close();
console.log('\n=== Done. Screenshots in .walkthrough/ ===');
console.log(JSON.stringify(findings, null, 2).slice(0, 500));
