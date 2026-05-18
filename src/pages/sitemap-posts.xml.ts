import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { buildSitemapXml, maxDate, xmlResponse, type SitemapEntry } from '~/lib/sitemap';

export const GET: APIRoute = async () => {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  const sorted = [...posts].sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime(),
  );

  const latest = maxDate(sorted.map((p) => p.data.updatedAt ?? p.data.publishedAt));

  const tagSet = new Set<string>();
  for (const p of posts) for (const t of p.data.tags) tagSet.add(t);

  const entries: SitemapEntry[] = [
    {
      loc: '/writing',
      lastmod: latest,
      changefreq: 'weekly',
      priority: 0.9,
    },
    ...sorted.map<SitemapEntry>((p) => ({
      loc: `/writing/${p.id}`,
      lastmod: p.data.updatedAt ?? p.data.publishedAt,
      changefreq: 'monthly',
      priority: 0.8,
    })),
    ...[...tagSet].sort().map<SitemapEntry>((tag) => ({
      loc: `/writing/tag/${tag}`,
      lastmod: latest,
      changefreq: 'monthly',
      priority: 0.4,
    })),
  ];

  return xmlResponse(buildSitemapXml(entries));
};
