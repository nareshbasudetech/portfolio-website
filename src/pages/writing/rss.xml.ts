import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '~/consts';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return rss({
    title: `${SITE.name} · Writing`,
    description: `Notes from ${SITE.name} on building products, brands, and growth.`,
    site: context.site!,
    items: posts
      .sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime())
      .map((p) => ({
        title: p.data.title,
        description: p.data.summary,
        link: `/writing/${p.id}`,
        pubDate: p.data.publishedAt,
        categories: p.data.tags,
      })),
    customData: `<language>${SITE.language}</language>`,
  });
}
