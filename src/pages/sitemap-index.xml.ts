import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import {
  PLACE_URLS,
  STATIC_PAGES,
  buildSitemapIndexXml,
  maxDate,
  pageMtime,
  xmlResponse,
} from '~/lib/sitemap';

export const GET: APIRoute = async () => {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  const projects = await getCollection('projects', ({ data }) => !data.draft);

  const postsLatest = maxDate(posts.map((p) => p.data.updatedAt ?? p.data.publishedAt));
  const projectsLatest = maxDate(
    projects.map((p) => p.data.updatedAt ?? p.data.publishedAt ?? new Date(p.data.year, 0, 1)),
  );
  const placesLatest = maxDate(PLACE_URLS.map((loc) => pageMtime(loc)));
  const pagesLatest = maxDate(STATIC_PAGES.map((p) => pageMtime(p.loc)));

  const xml = buildSitemapIndexXml([
    { loc: '/sitemap-posts.xml', lastmod: postsLatest },
    { loc: '/sitemap-projects.xml', lastmod: projectsLatest },
    { loc: '/sitemap-places.xml', lastmod: placesLatest },
    { loc: '/sitemap-pages.xml', lastmod: pagesLatest },
  ]);

  return xmlResponse(xml);
};
