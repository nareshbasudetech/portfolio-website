import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '~/consts';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const projects = await getCollection('projects', ({ data }) => !data.draft);
  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site!,
    items: projects
      .sort((a, b) => b.data.year - a.data.year)
      .map((p) => ({
        title: p.data.title,
        description: p.data.summary,
        link: `/projects/${p.id}`,
        pubDate: p.data.publishedAt ?? new Date(p.data.year, 0, 1),
        categories: p.data.discipline,
      })),
    customData: `<language>${SITE.language}</language>`,
  });
}
