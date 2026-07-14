# Roadmap

This roadmap sequences the work of building the site from its current state through to launch and ongoing maintenance. It is grounded in what actually exists in the codebase today, not just the intent described in the other foundational documents. Phases run roughly in order — each depends on decisions made in the ones before it — but later phases (particularly Continuous Improvement) are ongoing rather than one-time.

Each phase lists a **goal**, its **deliverables**, **concrete technical choices** (recommended, not mandated — override any of them if a better reason emerges), **key files**, and the **exit criteria** that mark it as done.

## How to use this doc

This document answers "what order do we build in, and what do we build next." For the "why," see [`vision.md`](./vision.md); for "what content," see [`content-strategy.md`](./content-strategy.md); for "how it should look and feel," see [`design-system.md`](./design-system.md); for "how it's technically built," see [`architecture.md`](./architecture.md). This roadmap assumes the principles in all four and does not restate them — it only sequences the work of realizing them.

## Cross-cutting principles

Every phase below must uphold these regardless of its specific scope:

- **Both themes, always.** No phase ships a feature that only looks correct in light mode.
- **WCAG 2.2 AA is a baseline**, not a follow-up pass.
- **Token-driven.** No new hardcoded color, spacing, or radius value bypassing the design system.
- **Server Components by default.** A component earns client-side rendering only when it needs interactivity, browser APIs, or state.
- **Content stays in version-controlled files.** No CMS, no database, per `vision.md`'s non-goals.

## Current state

A short, honest snapshot, so this roadmap starts from reality rather than a blank slate:

**Works today:**

- End-to-end MDX writing pipeline: `content/writing/*.mdx` → `src/lib/posts.ts` (eager frontmatter validation, reading time, draft visibility) → static article pages (`src/app/writing/[slug]/page.tsx`) with server-side Shiki highlighting → `sitemap.ts` and `rss.xml/route.ts`, both driven by the same loader so they can't drift.
- Centralized site constants (`src/lib/site.ts`), strict TypeScript throughout, Next.js 16 conventions used correctly (async `params`, flat ESLint config, Turbopack-default scripts).
- Clean lint/format setup (ESLint 9 flat config + Prettier), no lint-disable comments anywhere.
- CI pipeline (`.github/workflows/ci.yml`) gating install → lint → format check → type-check → build → tests; a Vitest unit suite (`src/lib/posts.test.ts`, `src/app/rss.xml/route.test.ts`) and a Playwright + `@axe-core/playwright` e2e/a11y suite (`e2e/`).
- A semantic design-token set (`surface`, `foreground`, `muted-foreground`, `border`, `accent`) implemented for both light and dark via Tailwind v4's `@theme inline`, with dark mode driven by `prefers-color-scheme` and dual-theme (light/dark) Shiki syntax highlighting.

**Missing or placeholder:**

- Homepage bio (`src/app/page.tsx`) is literal Lorem ipsum; both existing posts (`hello-world.mdx`, `notes-on-drafts.mdx`) are explicit dummy/test content.
- **No theme toggle yet.** Dark mode currently follows system preference only (`prefers-color-scheme`); a user-controlled override with `data-theme` and no flash-of-wrong-theme is Phase 2.
- **No shared chrome.** No header, nav, or footer — navigation is only inline `<Link>`s. No `src/components/` directory exists yet.
- **Only two routes exist:** Home and Writing (index + `[slug]`). About, Experience, Projects, Resume, Contact, and Notes are all documented in `content-strategy.md` but not built.
- No fonts loaded (`next/font` unused); `public/` is empty aside from the default favicon.
- SEO gaps: no `robots.ts`, no Open Graph/Twitter metadata, no OG preview images, no structured data (JSON-LD).
- `next.config.ts` is an empty scaffold.

## Phase 0: Delivery Foundation

**Status:** ✅ Complete

**Goal:** Put a safety net under every phase that follows, before adding more surface area to the site.

**Deliverables:**

- `docs/` tracked in git (currently untracked — these documents should be version-controlled like the code they govern).
- CI pipeline that gates every push/PR: install → lint → format check → type-check → build → tests.
- A minimal test setup, since none exists today.

**Concrete choices:**

- **CI:** GitHub Actions workflow running `pnpm install`, `pnpm lint`, `pnpm format:check`, `tsc --noEmit`, `pnpm build`, and the test script, in that order, failing fast.
- **Unit tests:** Vitest — covering `src/lib/posts.ts` frontmatter validation (missing/malformed fields should fail the build, so this behavior needs a regression test) and the RSS route's XML-escaping.
- **E2E/a11y tests:** Playwright with `@axe-core/playwright` for smoke tests and automated accessibility checks against real pages, expanded as new sections ship.

**Key files:** `.github/workflows/ci.yml`, `vitest.config.ts`, `playwright.config.ts`, new `test`/`test:e2e` scripts in `package.json`.

**Exit criteria:** A pull request with a broken build, a lint violation, or a failing test cannot merge without the failure being visible; `git log` shows `docs/` as tracked content.

## Phase 1: Design Tokens

**Status:** ✅ Complete

**Goal:** Define the visual and interaction language as concrete, implemented tokens — the values `design-system.md`'s principles require but doesn't specify.

**Deliverables:**

- A semantic token set — `surface`, `foreground`, `muted-foreground`, `border`, `accent`, plus code-block background/foreground — implemented for **both light and dark**, replacing the current bypassed `--background`/`--foreground` variables.
- A small, deliberate type scale and a single spacing scale, consistently used.
- Restrained, consistent border-radius values by element role.
- Verified WCAG AA contrast for every foreground/background pairing, in both themes.

**Concrete choices:**

- Implement via Tailwind v4's CSS-first `@theme` block in `globals.css` (no separate JS config file, consistent with the current setup) — semantic custom properties mapped into Tailwind's theme, not raw Tailwind palette classes.
- Replace every hardcoded `neutral-*`/`white` utility in `layout.tsx`, `page.tsx`, and the writing pages with token-driven classes.
- Dark mode ships now via `prefers-color-scheme`, ahead of the explicit theme-toggle mechanism (Phase 2); the token structure is written so Phase 2's `data-theme` override layers on without rework.
- Shiki dual-theme (light/dark) syntax highlighting was pulled forward from Phase 3 into this phase, so code blocks never ship in a light-only state once dark mode exists.

**Key files:** `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/writing/**`, `src/lib/highlighter.ts`.

**Exit criteria:** A token set exists that satisfies every principle in `design-system.md`, including verified AA contrast in both themes, and no component references a raw color value.

## Phase 2: Layout Foundation & Theming

**Goal:** Build the structural shell every page will share, on top of the tokens from Phase 1.

**Deliverables:**

- Self-hosted fonts with zero layout shift and no render-blocking.
- Shared chrome: header/nav, footer, page container, and a skip-link — the first components to justify introducing `src/components/`.
- A dark/light theme-switching mechanism with no flash of incorrect theme on load, defaulting to system preference and persisting a user override.

**Concrete choices:**

- **Fonts:** `next/font` — a neutral grotesque/geometric sans for UI and prose (Geist or Inter) plus a monospace for code (Geist Mono or JetBrains Mono). Optional: a serif (e.g. Newsreader) for long-form article body text if it reads better at length than the sans.
- **Theming mechanism:** a `data-theme` attribute on `<html>`, set by a tiny inline script (runs before hydration to avoid flash-of-wrong-theme) that reads `localStorage`, falling back to `prefers-color-scheme`.
- Introduce `src/components/` now, per `architecture.md`'s rule that shared components appear only once reuse justifies them — header/footer/container are the first genuine multi-route consumers.

**Key files:** `src/app/layout.tsx`, new `src/components/` (Header, Footer, PageContainer, ThemeToggle).

**Exit criteria:** A blank page rendered through the shared layout reflects the design system correctly in both themes, on mobile and desktop viewports, with no visible flash of the wrong theme.

## Phase 3: Writing Hardening

**Goal:** Finish the already-scaffolded writing system against the design system, and generalize its plumbing so later content sections don't reinvent it.

**Deliverables:**

- Writing index and article pages fully matching the design system, including dual-theme code blocks.
- Content-pillar navigation/filtering (pillars are already defined in `content-strategy.md`; the `tags` frontmatter field is parsed and validated but never surfaced in the UI today).
- `src/lib/posts.ts` generalized into a reusable multi-section content loader, since Notes and Projects will need the identical read/parse/validate/sort pipeline.
- At least one fully polished, non-placeholder article, replacing the two dummy posts.

**Concrete choices:**

- Shiki dual-theme highlighting shipped early, in Phase 1 — nothing left to do here on that front.
- Generalize the loader to accept a content directory + schema per section (`content/writing`, later `content/notes`, `content/projects`), rather than duplicating `posts.ts` per section.

**Key files:** `src/lib/posts.ts` → generalized loader, `src/lib/highlighter.ts`, `src/app/writing/**`, `content/writing/*.mdx`.

**Exit criteria:** The full authoring-to-publishing path works end to end and matches the design system in both themes, including code block styling; pillar filtering works from the Writing index.

## Phase 4: Home Page

**Goal:** Build the site's front door, replacing the current placeholder.

**Deliverables:**

- Real (non-Lorem-ipsum) homepage implementing the visitor journey and prioritized calls to action from `vision.md`.

**Exit criteria:** A first-time visitor can reach Writing, Experience/Projects, and Contact from the home page within one click; the page reflects the site's stated values (no clutter, no competing calls to action).

## Phase 5: About

**Goal:** Implement the About section per its definition in `content-strategy.md`.

**Deliverables:** About page with final (non-placeholder) content, linking to Experience, Projects, and Writing.

**Key files:** `src/app/about/page.tsx`.

**Exit criteria:** Content is final, links correctly to the three sections above, and matches the design system.

## Phase 6: Experience

**Goal:** Implement the professional experience record as a single source of truth that Resume can later reuse without duplication.

**Deliverables:**

- Experience page listing roles in reverse-chronological order with outcome-oriented highlights.
- A structured data source for role facts, separate from the page's presentation, so Resume (Phase 8) consumes the same data rather than a hand-copied duplicate.

**Concrete choices:** A typed data module (e.g. `content/experience.ts` or a validated JSON/YAML file loaded like the MDX content) rather than hardcoding role data directly in the page component.

**Key files:** `src/app/experience/page.tsx`, `content/experience.*`.

**Exit criteria:** Content is accurate and current, structurally ready to extend with future roles without a redesign, and backed by a data source Resume can reuse.

## Phase 7: Projects

**Goal:** Implement the project showcase, scoped to work disclosable per the confidentiality boundary in `content-strategy.md`.

**Deliverables:** Projects index and individual entries, each meeting the "short case study" bar (problem, stack, decisions, role).

**Concrete choices:** `content/projects/*.mdx`, reusing the generalized content loader from Phase 3.

**Key files:** `src/app/projects/**`, `content/projects/`.

**Exit criteria:** Each published project entry meets the case-study bar, and no entry discloses confidential detail beyond what's already safe for public, resume-equivalent disclosure.

## Phase 8: Resume

**Goal:** Implement a resume view that can never drift from Experience, because it's rendered from the same data.

**Deliverables:** A web-native, scannable resume page and an exportable/printable version, both sourced from the Phase 6 data module.

**Concrete choices:** A dedicated print stylesheet (`@media print`) rather than a separate PDF-generation dependency, unless print CSS proves insufficient for a clean export.

**Key files:** `src/app/resume/page.tsx`, print-specific styles.

**Exit criteria:** Resume content matches Experience in substance (by construction, since both read the same data source), and the export path produces a clean, correctly formatted result.

## Phase 9: Notes

**Goal:** Implement the shorter-form, lower-ceremony content section defined in `content-strategy.md`.

**Deliverables:** Notes index and individual entries, reusing the generalized content loader; included in RSS/sitemap alongside Writing.

**Key files:** `src/app/notes/**`, `content/notes/`.

**Exit criteria:** A Note published directly to a reader from search is genuinely useful on its own, never a placeholder.

## Phase 10: Contact

**Goal:** Implement a minimal, low-friction contact path.

**Deliverables:** Contact section stating the preferred channel(s) plainly — no obfuscated address, no form hiding the real reply-to.

**Key files:** `src/app/contact/page.tsx`.

**Exit criteria:** A visitor can identify and use the correct contact channel within seconds, with no dead ends.

## Phase 11: SEO Completion

**Goal:** Close the SEO gaps the current scaffold has left open, and treat any route missing them as an incomplete implementation of this section.

**Deliverables:**

- `robots` policy.
- Open Graph and Twitter card metadata for every route, especially individual Writing entries.
- Generated social preview images.
- Per-route canonical URLs via `alternates`.
- Structured data (JSON-LD) where it adds genuine value.
- Sitemap/RSS re-verified against the final content set.

**Concrete choices:**

- `src/app/robots.ts` alongside the existing `sitemap.ts`.
- OG images via Next's `opengraph-image` file convention using `ImageResponse` — note Next 16's async `params`/`id` signature for these functions.
- JSON-LD: `BlogPosting` schema for Writing/Notes entries, `Person` schema for Home/About.

**Key files:** `src/app/robots.ts`, `opengraph-image.tsx` per relevant route, per-route `generateMetadata`/`metadata` additions.

**Exit criteria:** Every public route has correct title, description, canonical URL, robots directives, and a valid social preview when shared on common platforms.

## Phase 12: Polish

**Goal:** Close the gap between "functionally complete" and "reflects the site's stated values."

**Deliverables:**

- Full accessibility pass (keyboard traversal, screen-reader spot checks, contrast verification in both themes, `prefers-reduced-motion` respected without exception).
- Performance pass (Core Web Vitals, bundle size, font-loading behavior).
- Cross-browser and cross-device visual QA.
- Content proofreading pass across all sections.

**Exit criteria:** No known accessibility violations at the AA level, strong Core Web Vitals on real content pages, no visual defects in either theme across major browsers and common viewport sizes.

## Phase 13: Launch

**Goal:** Make the site live at its permanent, canonical address, with privacy-respecting measurement in place.

**Deliverables:**

- Production deployment on the canonical domain (`https://www.moustafaellithy.com`).
- Final verification of sitemap/RSS/robots against the live domain, not a preview environment.
- A cookieless, no-consent-banner analytics setup.

**Concrete choices:** Vercel Web Analytics + Speed Insights, since the site is already hosted on Vercel and both are cookieless by default; Plausible or Umami are reasonable alternatives if self-hosted/independent analytics becomes preferable.

**Exit criteria:** The site is live, fully indexable, and every check from Phases 11–12 has been re-verified against the production deployment.

## Phase 14: Continuous Improvement

**Goal:** Keep the site current, correct, and worth returning to, indefinitely.

**Deliverables (ongoing, not one-time):**

- Regular new Writing/Notes content.
- Experience, Projects, and Resume kept current as work evolves.
- Periodic accessibility and performance re-checks as the framework and dependencies update.
- Periodic review of this roadmap and the other foundational documents, updating them when reality diverges from what they describe.

**Exit criteria:** This phase has no exit — it is the steady state the site lives in after launch. Its health is measured by the success metrics defined in `vision.md`, revisited periodically rather than treated as a finished checklist.
