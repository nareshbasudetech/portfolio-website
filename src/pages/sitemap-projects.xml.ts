import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { buildSitemapXml, maxDate, xmlResponse, type SitemapEntry } from '~/lib/sitemap';

export const GET: APIRoute = async () => {
  const projects = await getCollection('projects', ({ data }) => !data.draft);
  const sorted = [...projects].sort((a, b) => b.data.year - a.data.year);

  const projectLastmod = (p: (typeof projects)[number]) =>
    p.data.updatedAt ?? p.data.publishedAt ?? new Date(p.data.year, 0, 1);

  const latest = maxDate(sorted.map(projectLastmod));

  const entries: SitemapEntry[] = [
    {
      loc: '/projects',
      lastmod: latest,
      changefreq: 'weekly',
      priority: 0.9,
    },
    ...sorted.map<SitemapEntry>((p) => ({
      loc: `/projects/${p.id}`,
      lastmod: projectLastmod(p),
      changefreq: 'monthly',
      priority: 0.8,
    })),
  ];

  return xmlResponse(buildSitemapXml(entries));
};
