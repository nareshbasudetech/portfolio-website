import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import sharp from 'sharp';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, '..', 'public', 'covers');
await mkdir(outDir, { recursive: true });

const targets = [
  {
    slug: 'education-platforms-abs',
    url: 'https://abseducationalsolution.com/',
  },
  {
    slug: 'education-platforms-ngi',
    url: 'https://ngiadmissionmilega.com/',
  },
  {
    slug: 'nipcollege-rebuild',
    url: 'https://nipcollege.com/',
    // The site triggers a popup modal — set localStorage to skip it,
    // and as a fallback hide common modal patterns via CSS.
    setup: async (page) => {
      await page.addInitScript(() => {
        try {
          localStorage.setItem('popup_seen', '1');
          localStorage.setItem('popup_dismissed', '1');
        } catch {}
      });
    },
    afterLoad: async (page) => {
      // Dismiss any popups by pressing Escape, clicking any close button, and hiding via CSS as belt+braces
      await page.keyboard.press('Escape').catch(() => {});
      // WPForms popup close
      await page
        .locator('button:has-text("×"), button[aria-label*="close" i], .pum-close, .close-popup, .close-button')
        .first()
        .click({ timeout: 1500 })
        .catch(() => {});
      await page.addStyleTag({
        content: `
          .pum-overlay, .pum, .popmake, .modal-overlay, .modal,
          [class*="popup"], [class*="Popup"], [id*="popup"],
          .grecaptcha-badge { display: none !important; visibility: hidden !important; }
          html, body { overflow: visible !important; }
        `,
      });
      await page.waitForTimeout(800);
    },
  },
];

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 960 },
  deviceScaleFactor: 2,
  reducedMotion: 'reduce',
});

const results = [];

for (const t of targets) {
  const page = await context.newPage();
  if (t.setup) await t.setup(page);
  try {
    console.log(`→ ${t.slug}: ${t.url}`);
    await page.goto(t.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2500);
    if (t.afterLoad) await t.afterLoad(page);

    const buf = await page.screenshot({ fullPage: false, type: 'png' });
    const finalPath = resolve(outDir, `${t.slug}.png`);

    await sharp(buf)
      .resize(1440, 960, { fit: 'cover', position: 'top' })
      .png({ compressionLevel: 9 })
      .toFile(finalPath);

    results.push({ slug: t.slug, ok: true, path: finalPath });
    console.log(`   ✓ ${finalPath}`);
  } catch (e) {
    results.push({ slug: t.slug, ok: false, err: e.message });
    console.error(`   ✕ ${t.slug}: ${e.message.split('\n')[0]}`);
  } finally {
    await page.close();
  }
}

await browser.close();

console.log('\n=== Summary ===');
for (const r of results) {
  console.log(r.ok ? `✓ ${r.slug}` : `✕ ${r.slug} (${r.err.split('\n')[0]})`);
}
