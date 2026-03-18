import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    featured: z.boolean().optional().default(false),
    image: z.string().optional(),
  }),
});

const projectsCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['software', 'hardware', 'research', 'publication']),
    date: z.coerce.date(),
    featured: z.boolean().optional().default(false),
    image: z.string().optional(),
    link: z.string().optional(),
    github: z.string().optional(),
  }),
});

const speakingCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/speaking' }),
  schema: z.object({
    title: z.string(),
    type: z.enum(['talk', 'panel', 'podcast', 'award']),
    date: z.coerce.date(),
    venue: z.string().optional(),
    location: z.string().optional(),
    link: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const collections = {
  blog: blogCollection,
  projects: projectsCollection,
  speaking: speakingCollection,
};
