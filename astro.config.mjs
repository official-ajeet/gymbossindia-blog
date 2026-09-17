// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// This project is deployed as its own Vercel project and mounted at
// gymboss.in/blog via a path rewrite on the main app's vercel.json.
// `base` makes every generated link/asset path start with /blog so the
// rewrite lines up. `site` is required for the sitemap + RSS feed to emit
// absolute canonical URLs.
export default defineConfig({
  site: 'https://gymboss.in',
  base: '/blog',
  trailingSlash: 'never',
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
