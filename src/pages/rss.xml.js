import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return rss({
    title: 'GymBoss India Blog',
    description: 'Guides for Indian gym owners on running, billing, and growing their gym.',
    site: context.site,
    // context.site already includes the configured `base`, so items just
    // need the path relative to it.
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}`,
    })),
    customData: `<language>en-in</language>`,
  });
}
