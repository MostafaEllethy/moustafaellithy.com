# Design System

This document defines the design language for the website as a set of principles, not a fixed set of values. It intentionally avoids naming specific colors, pixel values, or fonts — those are implementation details to be chosen when the design system is built (see `roadmap.md`), and they must be chosen in service of the principles below, not the other way around.

The site should feel **minimal, elegant, professional, fast, content-first, developer-focused, and timeless.** Every principle below exists to serve that feeling. When a future decision is ambiguous, resolve it toward restraint.

## Typography philosophy

Typography is the primary design material of this site — there is more text than any other kind of content, so type quality determines the site's quality.

- **Reading, not decorating.** Typographic choices are justified by legibility and rhythm, not visual flair. A typeface earns its place by reading well at length, in both body copy and code.
- **A deliberate, small type scale.** A limited number of sizes, chosen with a consistent ratio, used consistently — not an ad hoc size picked per component.
- **Measure over width.** Body text should sit at a line length that's comfortable to read (roughly 60–75 characters), regardless of viewport width. Content should never stretch edge-to-edge on wide screens.
- **Generous line height for prose, tighter for UI.** Long-form reading gets more vertical breathing room than interface chrome and labels.
- **A clear distinction between prose and code.** Monospace text (inline code, code blocks) should be visually and rhythmically distinct from body prose, and should get the same legibility care — code is read as often as prose on this site.
- **System-first or self-hosted, never render-blocking.** Fonts should never introduce a visible flash of unstyled or swapped text as a normal part of the experience.

## Color philosophy

Color is defined as a small set of **semantic tokens**, never as one-off values scattered through the codebase, and the token set must work in both a light and a dark appearance from day one.

- **Semantic naming, not literal naming.** Tokens describe role (`surface`, `foreground`, `muted-foreground`, `border`, `accent`) rather than appearance (`gray-100`, `blue-500`), so the same name resolves correctly in either theme.
- **Light and dark are peers, not an afterthought.** Every token must have a defined value in both modes before it ships. A component is not "done" if it only looks correct in one theme.
- **Neutral-dominant, accent-sparing.** The palette should be overwhelmingly neutral (background, text, borders); a single accent color is used deliberately for links, focus states, and emphasis — not spread across the interface as decoration.
- **Contrast is a requirement, not a check.** Every foreground/background pairing used in real content must meet accessibility contrast minimums (see Accessibility, below) in both themes before it's approved for use.
- **No color-only meaning.** Color may reinforce a distinction (a visited link, a draft label) but must never be the sole carrier of meaning.

## Spacing system

- **A single spacing scale, used everywhere.** One consistent step function (e.g. a linear or near-linear scale) governs padding, margin, and gaps across the entire site — no component invents its own one-off spacing values.
- **Rhythm over precision.** Vertical spacing between content blocks should feel like a consistent rhythm as a reader scrolls, not a series of independently-tuned gaps.
- **Whitespace is a feature, not empty space.** Generous whitespace around content is a deliberate tool for reducing cognitive load and signaling calm, unhurried design — it should be defended against being "filled in" later.

## Border radius

- **Restrained and consistent.** A small number of radius values (effectively: sharp, subtle, and round) applied consistently by element role — not a different radius chosen per component on aesthetic instinct.
- **Radius signals affordance, not decoration.** Interactive elements may use a small radius to read as tactile; structural containers should stay closer to sharp. Radius should never be large enough to draw attention to itself.

## Shadows

- **Elevation, used sparingly and meaningfully.** Shadow exists to indicate that one surface sits above another (a menu, a modal) — not as a default decorative treatment on cards or containers.
- **Soft and low-contrast.** When used, shadows should be diffuse and subtle rather than hard or dark, consistent with the site's minimal, quiet visual tone.
- **Prefer borders to shadows for flat separation.** A simple border or background-color shift is usually the right way to separate content at rest; shadows are reserved for genuine elevation.

## Motion principles

- **Motion clarifies, it doesn't entertain.** Animation exists to help a user understand a state change (something entering, leaving, or reordering) — never as a decorative flourish.
- **Fast and subtle by default.** Durations should be short and easings gentle; nothing on the site should feel like it's making the user wait on an animation to finish.
- **Respect reduced-motion preferences absolutely.** Any user who has requested reduced motion at the system level should see instant state changes, no exceptions.
- **No motion on load for its own sake.** Content should not animate into view purely to look polished on first paint — this delays perceived readiness and adds no value for a returning or task-focused reader.

## Icons

- **Icons support text, they don't replace it.** Every icon used for navigation or action should be paired with a text label unless its meaning is truly universal (e.g. an external-link indicator).
- **One consistent icon set and stroke weight.** Icons are drawn from a single family with a shared stroke width and corner style, so they read as one visual system rather than a mix of styles.
- **Used sparingly.** Icons are the exception on a text-first, content-first site, not a default decoration on every heading or link.

## Accessibility goals

Accessibility is a baseline requirement, not a stretch goal:

- Target **WCAG 2.2 Level AA** conformance across the site.
- All interactive elements are reachable and operable by keyboard alone, with a clearly visible focus state at all times.
- All color pairings meet AA contrast minimums in both light and dark themes.
- Semantic HTML is used as the first line of accessibility — proper headings, landmarks, and native interactive elements before any ARIA is added.
- All meaningful images and diagrams have appropriate text alternatives.
- Motion and animation respect the `prefers-reduced-motion` setting without exception.

## Responsive strategy

- **Mobile-first construction.** Layouts are built for the smallest viewport first, then enhanced for larger screens — not designed for desktop and compressed down.
- **Fluid over fixed, within the type and spacing scale.** Type size and spacing should adapt smoothly across viewport sizes using the defined scales, rather than jumping between a small number of fixed breakpoint-specific layouts.
- **Content dictates layout changes, not arbitrary breakpoints.** A layout shifts when the content genuinely needs more room (e.g. a table, a side-by-side comparison) — not at a device-based pixel width chosen without a content reason.
- **Touch and pointer parity.** Every interactive target must be comfortably usable with touch as well as a mouse, with adequate hit-target sizing on small screens.

## Component philosophy

- **Accessible by default, not by addition.** A component should be correct out of the box — keyboard support, focus management, semantics — not accessible only after a follow-up pass.
- **Token-driven, not value-driven.** Components consume the color, spacing, radius, and type tokens defined above; they never hardcode a raw value that bypasses the system.
- **Composable over configurable.** Favor small components that compose together over large components with many boolean or enum props trying to cover every case.
- **Consistency over novelty per component.** A new component should look and behave like it belongs to the same family as everything else on the site, not like an isolated design experiment.
