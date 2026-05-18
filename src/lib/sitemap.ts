import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE } from '~/consts';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

export type Changefreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

export type SitemapEntry = {
  loc: string;
  lastmod: Date;
  changefreq: Changefreq;
  priority: number;
};

export const PLACE_URLS = [
  '/cities',
  '/mumbai',
  '/thane',
  '/navi-mumbai',
  '/kalyan-bhiwandi',
  '/dombivli',
  '/vasai-virar',
  '/panvel',
  '/ulhasnagar',
  '/ambernath-badlapur',
  '/mira-bhayandar',
] as const;

export const STATIC_PAGES: { loc: string; priority: number; changefreq: Changefreq }[] = [
  { loc: '/', priority: 1.0, changefreq: 'weekly' },
  { loc: '/about', priority: 0.7, changefreq: 'yearly' },
  { loc: '/contact', priority: 0.7, changefreq: 'yearly' },
  { loc: '/privacy', priority: 0.3, changefreq: 'yearly' },
  { loc: '/local-seo', priority: 0.8, changefreq: 'monthly' },
  { loc: '/whatsapp-bot-developer', priority: 0.8, changefreq: 'monthly' },
  { loc: '/wordpress-migration', priority: 0.8, changefreq: 'monthly' },
];

const escape = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export const buildSitemapXml = (entries: SitemapEntry[]) => {
  const urls = entries
    .map(
      (e) => `  <url>
    <loc>${escape(SITE.url + e.loc)}</loc>
    <lastmod>${e.lastmod.toISOString()}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority.toFixed(1)}</priority>
  </url>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
};

export const buildSitemapIndexXml = (children: { loc: string; lastmod: Date }[]) => {
  const items = children
    .map(
      (s) => `  <sitemap>
    <loc>${escape(SITE.url + s.loc)}</loc>
    <lastmod>${s.lastmod.toISOString()}</lastmod>
  </sitemap>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</sitemapindex>
`;
};

const safeMtime = (rel: string): Date | null => {
  try {
    return fs.statSync(path.join(ROOT, rel)).mtime;
  } catch {
    return null;
  }
};

export const pageMtime = (urlPath: string): Date => {
  const base = urlPath === '/' ? '/index' : urlPath;
  return (
    safeMtime(`src/pages${base}.astro`) ||
    safeMtime(`src/pages${base}/index.astro`) ||
    new Date()
  );
};

export const maxDate = (dates: (Date | null | undefined)[]): Date => {
  let max = new Date(0);
  for (const d of dates) {
    if (d && d > max) max = d;
  }
  return max.getTime() === 0 ? new Date() : max;
};

export const xmlResponse = (xml: string) =>
  new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=UTF-8' },
  });
