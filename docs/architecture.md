# Architecture

This document describes the technical architecture of the website: how it is structured, how content flows through it, and the principles that should guide future changes. It reflects the framework and libraries actually in use — see the root `README.md` for setup instructions.

## Stack summary

- **Framework:** Next.js (App Router), React Server Components by default.
- **Language:** TypeScript, strict mode.
- **Styling:** Tailwind CSS, configured via PostCSS with no separate JS config file.
- **Content:** MDX files with frontmatter, compiled at request/build time.
- **Package manager:** pnpm.
- **Hosting:** Vercel, deployed from `main`.

## Folder structure

```text
content/
  writing/            # MDX source files for the Writing section
src/
  app/                # App Router: routes, layouts, route handlers
  lib/                # Framework-agnostic helpers (content loading, site config)
public/               # Static assets served as-is
```

Principles for this structure going forward:

- **`src/app` owns routing only.** Route segments should stay thin — data loading and business logic live in `src/lib`, not inline in page components.
- **`content/` is the single source of truth for authored content.** Every top-level content section (writing, notes, etc.) gets its own subdirectory under `content/`, mirroring the URL structure it feeds.
- **`src/lib` is organized by concern, not by page.** A helper like content loading or site metadata belongs to one file with a clear responsibility, reusable across any route that needs it.
- **A `components/` directory should be introduced only when a component is used by more than one route.** Route-specific UI stays colocated with its route until reuse justifies extraction. This avoids a premature shared-component layer.

## Routing philosophy

The site uses the App Router's file-based conventions directly rather than a custom routing abstraction:

- Every URL corresponds to a real file path under `src/app`.
- Routes are **static by default.** Dynamic segments (e.g. an individual writing post) use `generateStaticParams` to pre-render every known path at build time rather than rendering on demand. New content should not silently become server-rendered on every request.
- Non-HTML outputs (sitemap, RSS) are implemented as their own route/file-convention entries (`sitemap.ts`, a `route.ts` handler) rather than bolted onto page components.
- Route groups and parallel/intercepting routes are tools of last resort — reach for them only when a URL structure genuinely requires them, not as a default organizational device.

## Content organization

Authored content lives outside the component tree, as data:

- Each content type gets a directory under `content/` (for example `content/writing/`).
- Each file is a single MDX document with YAML frontmatter describing its metadata.
- A single loader module per content type (in `src/lib`) is responsible for reading, parsing, validating, and sorting that content. Pages call the loader; they do not read the filesystem directly.
- Frontmatter is validated eagerly — a missing or malformed required field should fail the build, not fail silently at render time.
- Unpublished content is marked in frontmatter (a `draft` flag) rather than by moving files in and out of the content directory. Draft content is visible in development and excluded from production builds and feeds.

This keeps content portable: because it's plain files with a defined schema, it can later be migrated to a headless CMS or a content-collection library without changing how pages consume it, if that ever becomes necessary.

## MDX strategy

MDX is compiled from source at request/build time rather than through a static content-collection build step. This keeps the pipeline simple and dependency-light for the current scale of content:

- Frontmatter is parsed independently of MDX compilation, so metadata (titles, dates, descriptions) is available for lists and feeds without compiling the full document body.
- Code blocks are syntax-highlighted server-side at compile time, not shipped to the client as a highlighting library — the client receives pre-rendered markup, not a runtime dependency.
- Custom MDX components (callouts, embeds, etc.) should be introduced deliberately and documented in this file when they are. Every custom component adds a small amount of coupling between content authoring and the codebase; that tradeoff should be intentional, not incidental.
- If the content volume or authoring needs eventually outgrow a runtime-compile approach (e.g. needing full-text search across hundreds of posts, or incremental content builds), migrating to a build-time content-collection pipeline is the natural next step — the frontmatter schema and loader-module boundary described above are what make that migration low-risk.

## Component architecture

- **Server Components are the default.** A component only becomes a Client Component when it needs interactivity, browser-only APIs, or state — and that boundary should sit as low in the tree as possible, so the smallest possible subtree opts into client rendering.
- **Composition over configuration.** Components should be built to be combined, not built with an ever-growing list of boolean props to handle every case.
- **Colocation until reuse.** UI stays next to the route that uses it. It graduates to a shared location only once a second consumer exists.
- **No premature abstraction.** A pattern used once is not a component library. Shared components should be extracted from real, repeated usage — not designed speculatively ahead of need.

## Data flow

There is no database and no client-side data-fetching layer for content. The flow is linear and build/request-time only:

```text
MDX + frontmatter (content/)
        ↓
  loader module (src/lib)      — read, parse, validate, sort
        ↓
   route (src/app)             — calls loader, passes data to render
        ↓
  rendered HTML / feed output  — page, sitemap entry, RSS item
```

Site-wide constants (site name, canonical URL, description) live in a single dedicated module rather than being duplicated across metadata calls, so a change to the canonical domain or site name happens in one place.

## SEO architecture

SEO is treated as a structural concern, not an add-on:

- Every route defines its own metadata (title, description) using the framework's metadata APIs, composed against a shared site-wide default rather than repeating boilerplate per route.
- A machine-readable sitemap and an RSS feed are generated from the same content loader that powers the pages, so they can never drift out of sync with what's actually published.
- Canonical URLs are derived from a single site-wide base URL constant, never hardcoded per page.
- Structured metadata for link previews (Open Graph and social card data) and a `robots` policy are part of this architecture's intended scope — any route that is missing them should be treated as an incomplete implementation of this section, not an acceptable long-term gap.

## Future scalability considerations

- **New content sections** (e.g. a "Notes" section) should follow the exact same pattern as Writing: a `content/<section>/` directory, a dedicated loader in `src/lib`, and routes under `src/app/<section>/`. The pattern should not need to be reinvented per section.
- **Internationalization / RTL support** is not implemented today but should be treated as plausible future scope, not a hypothetical — layout and typography decisions (see `design-system.md`) should avoid choices that would need to be unwound to support a right-to-left locale later.
- **Caching and rendering strategy** should be revisited as the framework's caching model evolves; the guiding principle is that content that hasn't changed should never require re-computation, and that principle should be re-verified whenever the underlying framework's caching primitives change.
- **Search** is out of scope while content volume is small. If the Writing/Notes sections grow substantially, this document should be updated with a search strategy before one is implemented, so indexing stays consistent with the content schema above.
