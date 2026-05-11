import { chromium, devices } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices['iPhone 13'], reducedMotion: 'reduce' });
const page = await ctx.newPage();
await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
await page.screenshot({ path: '.walkthrough/home-mobile.png', fullPage: false });
// Scroll to bottom to confirm bar still floats
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(400);
await page.screenshot({ path: '.walkthrough/home-mobile-bottom.png', fullPage: false });
await browser.close();
console.log('done');
