import type { APIRoute } from 'astro';
import {
  PLACE_URLS,
  buildSitemapXml,
  pageMtime,
  xmlResponse,
  type SitemapEntry,
} from '~/lib/sitemap';

export const GET: APIRoute = async () => {
  const entries: SitemapEntry[] = PLACE_URLS.map((loc) => ({
    loc,
    lastmod: pageMtime(loc),
    changefreq: 'monthly',
    priority: 0.8,
  }));
  return xmlResponse(buildSitemapXml(entries));
};
