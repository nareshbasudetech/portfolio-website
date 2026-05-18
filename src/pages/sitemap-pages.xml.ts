import type { APIRoute } from 'astro';
import {
  STATIC_PAGES,
  buildSitemapXml,
  pageMtime,
  xmlResponse,
  type SitemapEntry,
} from '~/lib/sitemap';

export const GET: APIRoute = async () => {
  const entries: SitemapEntry[] = STATIC_PAGES.map((p) => ({
    loc: p.loc,
    lastmod: pageMtime(p.loc),
    changefreq: p.changefreq,
    priority: p.priority,
  }));
  return xmlResponse(buildSitemapXml(entries));
};
