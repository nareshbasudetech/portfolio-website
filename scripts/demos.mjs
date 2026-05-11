// Copy each working template from D:\Apps\website into public/demos/{slug}/
// Patch absolute-path references in Vite-built dists to relative paths so they
// work when served from a sub-path on Hostinger.
import { cp, readFile, writeFile, readdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DEMOS = resolve(here, '..', 'public', 'demos');
const WEBSITE_ROOT = 'D:/Apps/website';

const demos = [
  // Static HTML — relative paths, no patching needed
  { slug: 'medicare',   src: 'medical/medical1',  patch: false, brand: 'MediCare', industry: 'Hospital' },
  { slug: 'healthplus', src: 'medical/medical2',  patch: false, brand: 'HealthPlus', industry: 'Healthcare' },
  { slug: 'aarogya',    src: 'college2',          patch: false, brand: 'Aarogya Medical College', industry: 'Medical College' },
  // Vite-built — patch index.html to use relative asset paths
  { slug: 'aurora',     src: 'college3/dist',     patch: true,  brand: 'Aurora International University', industry: 'University' },
  { slug: 'westbrook',  src: 'college4/dist',     patch: true,  brand: 'Westbrook University', industry: 'University' },
];

for (const d of demos) {
  const srcPath = join(WEBSITE_ROOT, d.src);
  const dstPath = join(PUBLIC_DEMOS, d.slug);
  console.log(`→ ${d.slug}: ${d.src}`);

  await cp(srcPath, dstPath, {
    recursive: true,
    force: true,
    filter: (s) => !/node_modules|\.git|package(-lock)?\.json|tsconfig|vite\.config|tailwind\.config|postcss|eslint|README/.test(s),
  });

  if (d.patch) {
    const idx = join(dstPath, 'index.html');
    let html = await readFile(idx, 'utf-8');
    // Convert absolute root references to relative paths
    html = html
      .replace(/(?:src|href)="(\/(?:assets|favicon|crest|vite)[^"]*)"/g, (m, p) => m.replace(p, '.' + p))
      .replace(/(<base[^>]*href=)"\/?"/, '$1"./"');
    // Vite often emits absolute /assets/ in CSS imports; patch just the entry
    await writeFile(idx, html, 'utf-8');
    console.log(`   ✓ patched ${d.slug}/index.html for relative paths`);
  }
  console.log(`   ✓ copied to public/demos/${d.slug}/`);
}

// Print a summary that we'll paste into the web-templates frontmatter
console.log('\n=== Frontmatter snippet ===');
console.log('demos:');
for (const d of demos) {
  console.log(`  - slug: ${d.slug}`);
  console.log(`    title: '${d.brand}'`);
  console.log(`    industry: ${d.industry}`);
  console.log(`    href: /demos/${d.slug}/`);
  console.log(`    thumb: /covers/demo-${d.slug}.png`);
}
