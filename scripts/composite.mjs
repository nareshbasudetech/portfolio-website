// Build the education-platforms cover by stitching ABS + NGI side-by-side.
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { unlink } from 'node:fs/promises';
import sharp from 'sharp';

const here = dirname(fileURLToPath(import.meta.url));
const dir = resolve(here, '..', 'public', 'covers');

const abs = await sharp(resolve(dir, 'education-platforms-abs.png'))
  .resize(720, 960, { fit: 'cover', position: 'top' })
  .toBuffer();

const ngi = await sharp(resolve(dir, 'education-platforms-ngi.png'))
  .resize(720, 960, { fit: 'cover', position: 'top' })
  .toBuffer();

// Thin divider — 2px orange line down the middle, anti-aliased
const divider = await sharp({
  create: { width: 2, height: 960, channels: 4, background: { r: 255, g: 91, b: 31, alpha: 0.6 } },
})
  .png()
  .toBuffer();

await sharp({
  create: { width: 1440, height: 960, channels: 4, background: { r: 5, g: 5, b: 5, alpha: 1 } },
})
  .composite([
    { input: abs, left: 0, top: 0 },
    { input: ngi, left: 720, top: 0 },
    { input: divider, left: 719, top: 0 },
  ])
  .png({ compressionLevel: 9 })
  .toFile(resolve(dir, 'education-platforms.png'));

// Cleanup intermediate files
for (const f of ['education-platforms-abs.png', 'education-platforms-ngi.png']) {
  try { await unlink(resolve(dir, f)); } catch {}
}

console.log('✓ Wrote education-platforms.png (split ABS|NGI)');
