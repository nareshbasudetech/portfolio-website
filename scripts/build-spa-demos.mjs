// Rebuild Vite-React SPA templates with the right base path + Router basename
// so they work when served from /demos/{slug}/. Staged in .build-stage to keep
// the original D:\Apps\website source untouched.

import { spawnSync } from 'node:child_process';
import { readFile, writeFile, rm, cp, mkdir, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const portfolioRoot = resolve(here, '..');
const stagingDir = resolve(portfolioRoot, '.build-stage');
await mkdir(stagingDir, { recursive: true });

const targets = [
  {
    slug: 'westbrook',
    src: 'D:/Apps/website/college4',
    basename: '/demos/westbrook',
  },
  {
    slug: 'aurora',
    src: 'D:/Apps/website/college3',
    basename: '/demos/aurora',
  },
];

const exists = async (p) => {
  try { await access(p); return true; } catch { return false; }
};

for (const t of targets) {
  console.log(`\n══ ${t.slug} ══`);
  const stage = join(stagingDir, t.slug);
  await rm(stage, { recursive: true, force: true });

  console.log('• Copying source (excluding dist + node_modules — npm install will run fresh)…');
  await cp(t.src, stage, {
    recursive: true,
    filter: (s) => {
      const norm = s.replace(/\\/g, '/');
      return !/\/(node_modules|dist|\.git)(\/|$)/.test(norm);
    },
  });

  // ── Patch Router.tsx ────────────────────────────────────────────────
  const routerPath = join(stage, 'src/app/Router.tsx');
  if (await exists(routerPath)) {
    let r = await readFile(routerPath, 'utf-8');
    if (!r.includes('basename:')) {
      // Match createBrowserRouter([ … ]); — non-greedy, with optional whitespace
      r = r.replace(
        /createBrowserRouter\(([\s\S]*?)\);/,
        `createBrowserRouter($1, { basename: '${t.basename}' });`,
      );
      await writeFile(routerPath, r);
      console.log(`✓ Patched src/app/Router.tsx with basename: ${t.basename}`);
    }
  } else {
    console.warn(`⚠ Router.tsx not found at expected path; skipping basename patch`);
  }

  // ── Patch vite.config ────────────────────────────────────────────────
  let viteCfg = join(stage, 'vite.config.ts');
  if (!(await exists(viteCfg))) viteCfg = join(stage, 'vite.config.js');
  if (await exists(viteCfg)) {
    let v = await readFile(viteCfg, 'utf-8');
    if (!v.includes('base:')) {
      v = v.replace(
        /defineConfig\(\{/,
        `defineConfig({\n  base: '${t.basename}/',`,
      );
      await writeFile(viteCfg, v);
      console.log(`✓ Patched vite.config with base: ${t.basename}/`);
    }
  }

  // ── Install + build ─────────────────────────────────────────────────
  console.log('• npm install (this is the slow part)…');
  const inst = spawnSync('npm', ['install', '--no-fund', '--no-audit'], {
    cwd: stage, shell: true, stdio: 'inherit',
  });
  if (inst.status !== 0) {
    console.error(`✕ npm install failed for ${t.slug}; skipping`);
    continue;
  }

  console.log('• npm run build…');
  const built = spawnSync('npm', ['run', 'build'], {
    cwd: stage, shell: true, stdio: 'inherit',
  });
  if (built.status !== 0) {
    console.error(`✕ build failed for ${t.slug}; skipping`);
    continue;
  }

  // ── Patch dist/index.html to rewrite URL before React Router boots ─
  // When deep-linked at /demos/{slug}/index.html, strip the .html so
  // React Router sees the home route.
  const distIndex = join(stage, 'dist/index.html');
  if (await exists(distIndex)) {
    let html = await readFile(distIndex, 'utf-8');
    const inject = `    <script>(function(){try{var p=location.pathname;if(p.endsWith('/index.html')){history.replaceState(null,'',p.slice(0,-10)+location.search+location.hash);}}catch(e){}})();</script>\n`;
    if (!html.includes('history.replaceState')) {
      html = html.replace(/<head>\s*\n/, (m) => m + inject);
      await writeFile(distIndex, html, 'utf-8');
      console.log('✓ Injected pre-boot URL rewrite into dist/index.html');
    }
  }

  // ── Copy dist out ───────────────────────────────────────────────────
  const distDir = join(stage, 'dist');
  const dest = join(portfolioRoot, 'public/demos', t.slug);
  await rm(dest, { recursive: true, force: true });
  await cp(distDir, dest, { recursive: true });
  console.log(`✓ Deployed to public/demos/${t.slug}/`);

  // Clean up the stage to reclaim disk
  await rm(stage, { recursive: true, force: true });
}

// Final cleanup
await rm(stagingDir, { recursive: true, force: true });
console.log('\nDone.');
