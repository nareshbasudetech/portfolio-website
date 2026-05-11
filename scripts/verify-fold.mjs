import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
const page = await ctx.newPage();

console.log('=== HOME FOLD ===');
await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);

const homeData = await page.evaluate(() => {
  const els = {
    kicker: document.querySelector('.hero__kicker'),
    h1: document.querySelector('.hero__h1'),
    cta: document.querySelector('.hero__cta'),
    lede: document.querySelector('.hero__lede'),
    pledge: document.querySelector('.hero__pledge'),
  };
  const out = {};
  for (const [k, el] of Object.entries(els)) {
    if (!el) { out[k] = 'MISSING'; continue; }
    const r = el.getBoundingClientRect();
    out[k] = { top: Math.round(r.top), bottom: Math.round(r.bottom), in_view: r.bottom < window.innerHeight };
  }
  return { vh: window.innerHeight, ...out };
});
console.log(JSON.stringify(homeData, null, 2));
await page.screenshot({ path: '.walkthrough/home-fold-v2.png', fullPage: false });
await browser.close();
