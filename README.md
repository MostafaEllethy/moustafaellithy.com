# moustafaellithy.com

Personal site. Next.js (App Router, TypeScript) + Tailwind CSS. Posts are local MDX files; there is no CMS, database, or auth — publishing is `git push`.

## Stack

- Next.js 16 (App Router, TypeScript, Turbopack)
- Tailwind CSS 4
- MDX content compiled with `next-mdx-remote-client` (RSC), syntax highlighting via `@shikijs/rehype`
- pnpm

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Adding a post

Create a new file in `content/writing/your-slug.mdx`. The filename (minus `.mdx`) becomes the URL slug at `/writing/your-slug`.

Frontmatter schema (all fields required):

```yaml
---
title: "Post Title"
description: "One or two sentences for listings, RSS, and <meta description>."
date: "2026-01-15"
tags: ["tag-one", "tag-two"]
draft: false
---
```

- `title` — string, shown as the page `<h1>` and `<title>`.
- `description` — string, shown in listings and used as the meta description.
- `date` — ISO-parseable date string. Posts are sorted newest first.
- `tags` — array of strings. Not yet surfaced in the UI, but validated and available on the `Post` type.
- `draft` — boolean. See below.

Missing or wrong-typed frontmatter fields throw at build time (`src/lib/posts.ts`), so a broken post fails `pnpm build` rather than silently rendering blank.

Syntax highlighting supports `ts`, `tsx`, `html`, `css`, and `bash` code fences (`src/lib/highlighter.ts`). Reading time is computed automatically from word count.

### Drafts

Set `draft: true` to keep a post out of production while you're still writing it:

- **In development** (`pnpm dev`), draft posts appear everywhere — homepage, `/writing`, and their own page.
- **In production** (`pnpm build` / `pnpm start`, and on Vercel), draft posts are excluded from `/writing`, the homepage, `/rss.xml`, and `/sitemap.xml`, and their `/writing/[slug]` page 404s.

Flip `draft` to `false` (or remove it) and redeploy to publish.

## How Vercel deploys work

The Vercel project is connected to this repo's `main` branch. Every push to `main` triggers a production build (`pnpm build`); pushes to other branches or PRs get their own preview deployment. Since content lives in `content/writing/*.mdx`, adding or editing a post is just a normal commit — there's no separate publish step or external CMS to sync.

## Scripts

- `pnpm dev` — start the dev server
- `pnpm build` — production build (also generates the RSS feed and sitemap)
- `pnpm start` — serve the production build locally
- `pnpm lint` — ESLint
- `pnpm format` / `pnpm format:check` — Prettier
