import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Every .md/.mdx file in src/content/blog/ becomes an entry.
// Decap CMS (public/admin) writes files here directly, matching this schema.
const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    // Used for <meta name="description">, OG description, and card previews.
    // Keep it 140-160 chars for SEO.
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    // Full site-absolute path INCLUDING the /blog prefix, e.g.
    // /blog/blog-images/post-slug/cover.jpg — this matches Decap CMS's
    // public_folder setting, so the CMS media picker fills it in correctly.
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    tags: z.array(z.string()).default([]),
    // Primary target keyword for this post — not rendered, just kept
    // alongside the content so it's easy to audit keyword coverage later.
    targetKeyword: z.string().optional(),
    author: z.string().default('GymBoss India Team'),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
