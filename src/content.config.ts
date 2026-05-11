import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    role: z.string(),
    discipline: z.array(z.enum(['Dev', 'Design', 'Marketing'])),
    year: z.number(),
    client: z.string().optional(),
    url: z.string().url().optional(),
    links: z
      .array(
        z.object({
          label: z.string(),
          href: z.string().url(),
        }),
      )
      .optional(),
    cover: z.string().optional(),
    demos: z
      .array(
        z.object({
          slug: z.string(),
          title: z.string(),
          industry: z.string(),
          href: z.string(),
          thumb: z.string(),
        }),
      )
      .optional(),
    accent: z.string().default('#7b5cff'),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    publishedAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    readingTime: z.string().optional(),
  }),
});

export const collections = { projects, posts };
