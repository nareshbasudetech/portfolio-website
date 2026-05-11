// Screenshot local templates from D:\Apps\website. For each target, mount
// the template at the static server's root so React Router and absolute
// asset paths work correctly.
import { createServer } from 'node:http';
import { readFile, stat, mkdir, unlink } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join, extname } from 'node:path';
import { chromium } from 'playwright';
import sharp from 'sharp';

const here = dirname(fileURLToPath(import.meta.url));
const WEBSITE_ROOT = 'D:/Apps/website';
const outDir = resolve(here, '..', 'public', 'covers');
await mkdir(outDir, { recursive: true });

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
  '.mjs': 'application/javascript', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.gif': 'image/gif',
  '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2',
  '.ttf': 'font/ttf', '.eot': 'application/vnd.ms-fontobject',
  '.mp4': 'video/mp4', '.webm': 'video/webm',
};

const PORT = 8765;
let activeBase = ''; // template directory under WEBSITE_ROOT

const server = createServer(async (req, res) => {
  try {
    let urlPath = decodeURIComponent(req.url.split('?')[0]);
    if (urlPath === '/' || urlPath === '') urlPath = '/index.html';
    const filePath = join(WEBSITE_ROOT, activeBase, urlPath);
    const s = await stat(filePath);
    if (s.isDirectory()) {
      // Try index.html inside
      const idx = join(filePath, 'index.html');
      const data = await readFile(idx);
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
      return;
    }
    const data = await readFile(filePath);
    res.writeHead(200, {
      'Content-Type': MIME[extname(filePath).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(data);
  } catch {
    res.writeHead(404); res.end('not found');
  }
});
await new Promise((ok) => server.listen(PORT, ok));

// Mount each template at root, capture, save to public/covers/demo-*.png
const targets = [
  { slug: 'demo-aurora',     base: '/college3/dist' },
  { slug: 'demo-westbrook',  base: '/college4/dist' },
  { slug: 'demo-aarogya',    base: '/college2' },
  { slug: 'demo-medicare',   base: '/medical/medical1' },
  { slug: 'demo-healthplus', base: '/medical/medical2' },
];

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 960 },
  deviceScaleFactor: 2,
  reducedMotion: 'reduce',
});

const screenshotBufs = {};

for (const t of targets) {
  const page = await context.newPage();
  try {
    activeBase = t.base;
    const url = `http://localhost:${PORT}/`;
    console.log(`→ ${t.slug}  (mount=${t.base})`);
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2200);

    const buf = await page.screenshot({ fullPage: false, type: 'png' });
    screenshotBufs[t.slug] = buf;

    // Also save individual preview so we can pick the best
    await sharp(buf)
      .resize(720, 480, { fit: 'cover', position: 'top' })
      .png({ compressionLevel: 9 })
      .toFile(resolve(outDir, `${t.slug}.png`));
    console.log(`   ✓ ${t.slug}.png`);
  } catch (e) {
    console.error(`   ✕ ${t.slug}: ${e.message.split('\n')[0]}`);
  } finally {
    await page.close();
  }
}

await browser.close();
server.close();

console.log('\nIndividual previews are in public/covers/tpl-*.png — re-run with `--composite SLUG1,SLUG2,SLUG3,SLUG4` to build the final web-templates.png');

// If --composite a,b,c,d arg provided, build the 2x2 grid
const composeFlagIndex = process.argv.indexOf('--composite');
if (composeFlagIndex !== -1) {
  const slugList = (process.argv[composeFlagIndex + 1] || '').split(',').filter(Boolean);
  if (slugList.length !== 4) {
    console.error('--composite expects exactly 4 comma-separated slugs');
    process.exit(1);
  }
  const tiles = await Promise.all(
    slugList.map((s) =>
      sharp(screenshotBufs[s] ?? `${outDir}/${s}.png`)
        .resize(720, 480, { fit: 'cover', position: 'top' })
        .toBuffer(),
    ),
  );
  const positions = [
    { left: 0, top: 0 }, { left: 720, top: 0 },
    { left: 0, top: 480 }, { left: 720, top: 480 },
  ];
  const composites = tiles.map((t, i) => ({ input: t, ...positions[i] }));
  const hLine = await sharp({
    create: { width: 1440, height: 2, channels: 4, background: { r: 255, g: 91, b: 31, alpha: 0.5 } },
  }).png().toBuffer();
  const vLine = await sharp({
    create: { width: 2, height: 960, channels: 4, background: { r: 255, g: 91, b: 31, alpha: 0.5 } },
  }).png().toBuffer();

  await sharp({
    create: { width: 1440, height: 960, channels: 4, background: { r: 5, g: 5, b: 5, alpha: 1 } },
  })
    .composite([
      ...composites,
      { input: vLine, left: 719, top: 0 },
      { input: hLine, left: 0, top: 479 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(resolve(outDir, 'web-templates.png'));
  console.log(`✓ Wrote web-templates.png from: ${slugList.join(', ')}`);

  // Cleanup temp tiles
  for (const s of ['tpl-college3', 'tpl-college4', 'tpl-college2', 'tpl-medical1', 'tpl-medical2']) {
    try { await unlink(resolve(outDir, `${s}.png`)); } catch {}
  }
}
