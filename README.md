# GymBoss India Blog (gymboss.in/blog)

Static, content-only site built with Astro + Tailwind CSS v4. Deployed as
its own Vercel project and mounted at `gymboss.in/blog` via a rewrite on
the main app. Content lives as Markdown files in `src/content/blog/` and
is edited through Decap CMS at `/blog/admin` — no database, no backend.

Styling is ported directly from the main app's components where possible
(`SiteFooter.jsx` → `Footer.astro`) to match fonts (DM Sans / DM Serif
Display), colors (Tailwind slate/blue — no custom palette found in the
source), and spacing conventions.

## Ported components — now match the real thing

`Header.astro` and `FloatingWhatsApp.astro` are direct ports of
`SiteNav.jsx` and `WhatsAppButton.jsx`: same nav items/routes, same
scroll-triggered nav background, same mobile drawer (backdrop, Escape
to close, body scroll lock), same tooltip show/hide timing. React's
`useState`/`useEffect` become plain `<script>` blocks since there's no
client router on this static site. `Blog` was added to the nav (absent
in the source, since `SiteNav.jsx` only ever renders on the main app).

**One thing to double-check**: `WHATSAPP_NUMBER` in
`FloatingWhatsApp.astro` is `917838200150`, copied from your source —
your own code comments it as "REPLACE with real number," so confirm
that's actually final before deploying.

## Local dev

```bash
npm install
npm run dev
```

Astro serves the site at `http://localhost:4321/blog` (the `/blog` prefix
comes from `base` in `astro.config.mjs`, matching production).

## Writing a post directly (no CMS)

Add a `.md` file to `src/content/blog/`, matching the frontmatter shape
in `src/content.config.ts`. `gym-management-software-india-guide.md` is
a filled-out example — copy it as a starting point. Set `draft: true`
until it's ready to publish. `heroImage` paths must include the `/blog`
prefix (e.g. `/blog/blog-images/post-slug/cover.jpg`) since content
frontmatter isn't run through Astro's `base` rewriting automatically —
Decap's media picker (configured via `public_folder`) fills this in
correctly for you.

## Setting up Decap CMS auth (one-time)

`public/admin/config.yml` uses the `github` backend, which needs a small
OAuth proxy — GitHub doesn't support browser-based OAuth for third-party
apps like Decap directly. Two free options, either deployable as its own
tiny Vercel project in a few minutes:

- https://github.com/vencax/netlify-cms-github-oauth-provider
- https://github.com/BennyThink/decap-proxy (Vercel-ready)

Once deployed, update `config.yml`:
- `repo:` → your actual `org/repo`
- `base_url:` → the OAuth proxy's deployment URL

`local_backend: true` lets you run the CMS UI locally against your
filesystem (`npx decap-server` alongside `npm run dev`) so you can try
the editing experience before wiring up GitHub auth.

## Deploying (Vercel monorepo setup)

1. Push this project to its own GitHub repo (or a subfolder of a monorepo
   containing the main app).
2. In Vercel, add it as a **second project** pointing at this
   directory, framework preset "Astro".
3. In the **main app's** `vercel.json`, add a rewrite so requests to
   `/blog` and everything under it are routed to this deployment:

   ```json
   {
     "rewrites": [
       {
         "source": "/blog",
         "destination": "https://YOUR-BLOG-PROJECT.vercel.app/blog"
       },
       {
         "source": "/blog/:path*",
         "destination": "https://YOUR-BLOG-PROJECT.vercel.app/blog/:path*"
       }
     ]
   }
   ```

4. `astro.config.mjs` already has `site: 'https://gymboss.in'`, so the
   sitemap (`/blog/sitemap-index.xml`) and RSS feed (`/blog/rss.xml`)
   emit correct absolute URLs — submit the sitemap in Google Search
   Console once live.

## Notes

- The header is `fixed` (matching `SiteNav.jsx`), so `BaseLayout.astro`
  adds `pt-16` to `<main>` to offset it — don't remove that padding
  without also changing the header back to `sticky`/static flow.
- **`public/admin/config.yml`** — `repo:` and `base_url:` are still
  placeholders (see "Setting up Decap CMS auth" below).
- Logo images are pulled live from `gymboss.in` (`GymBoss India Logo-h.png`
  in the header, `GymBoss India Icon.png` in the footer) rather than
  duplicated into this repo, so they always stay in sync with the main
  site's actual files.
- Tailwind v4 is wired in via `@tailwindcss/vite` (the current official
  integration), not the older `@astrojs/tailwind` package, which targets
  Tailwind v3.
- `@tailwindcss/typography` styles the rendered Markdown/MDX body inside
  `PostLayout.astro` (the `prose` class).
- **Gotcha found while building this**: Tailwind v4's CSS parser can fail
  on parentheses inside CSS comments in `global.css` (throws "Missing
  opening ("). Keep comments in that file free of `(` `)` if you edit it.
