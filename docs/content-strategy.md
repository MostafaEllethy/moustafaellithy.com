# Content Strategy

This document defines what belongs on the site, section by section, and how content within each section should be structured and maintained.

## Sections

### About

**Purpose:** Answer "who is this and why should I keep reading" in under a minute.

Content: a concise professional summary, areas of focus and interest, and enough personal voice to make the writing elsewhere feel like it's coming from a specific person rather than a template. This section should stay short — it's an entry point, not a biography. It links out to Experience, Projects, and Writing rather than duplicating their content.

### Experience

**Purpose:** Provide a clear, chronological record of professional roles and the scope of responsibility in each.

Content: roles listed in reverse-chronological order, each with organization, title, dates, and a small number of specific, outcome-oriented highlights — what was built, what changed as a result, at what scale. Highlights should be concrete and verifiable in spirit (specific systems, specific technologies, specific impact) rather than generic responsibility statements. This section prioritizes precision over exhaustiveness; not every task ever performed needs to be listed, only what best demonstrates scope and judgment.

### Projects

**Purpose:** Show real, shippable work in more depth than Experience allows.

Content: a curated set of projects the author is free to disclose in technical depth — independent, personal, open-source, and freelance client work — each with what problem it solved, the stack and key technical decisions, and the author's specific role and contribution. Projects should be selected for what they demonstrate about engineering judgment — architecture decisions, tradeoffs made, problems solved — not merely for being the most recent. Each project entry should be substantial enough to stand as a short case study, not a one-line bullet.

**Confidentiality boundary:** Work performed under an employer or client confidentiality agreement (NDA) is never written up as a Projects case study, regardless of how technically interesting it was. That work is represented only in the Experience section, and only at the level of detail already safe for public, resume-equivalent disclosure — outcomes and scope, never internal architecture, code, screenshots, proprietary systems, or client-identifying detail beyond what the author has independently confirmed is acceptable to share. When in doubt about whether a detail is disclosable, it is left out. This boundary should never be worked around by generalizing or lightly disguising confidential specifics — a detail that isn't disclosable stays out entirely, not disguised.

### Writing

**Purpose:** The site's primary long-form content — in-depth articles that demonstrate how the author thinks about frontend architecture and engineering practice.

See **Content pillars** and **Article structure** below for full detail. Writing entries are indexed by date, are all considered permanent once published, and are organized around the content pillars rather than loose, unstructured tags.

### Notes

**Purpose:** Shorter, lower-ceremony posts — observations, small technical findings, "today I learned"-style entries that don't warrant a full article.

Notes are distinct from Writing in scope and effort, not in quality: they can be a paragraph or two, published more frequently, and don't need the full structure defined for Writing below. They still get a title and a date, and should still be genuinely useful to a reader who lands on one directly from search — never a placeholder or a link with no content of its own.

### Resume

**Purpose:** A single, current, canonical, and easily exportable summary of professional experience.

Content: a web-native rendering of the same information that appears in Experience, formatted for quick scanning and for printing/exporting to PDF. This section should always match Experience in substance — Experience is the narrative form, Resume is the condensed reference form of the same facts. It should never fall out of sync with Experience; when one changes, check the other.

### Contact

**Purpose:** A clear, low-friction way for a reader to start a conversation.

Content: the preferred channel(s) for professional contact (e.g. email, LinkedIn), stated plainly. No contact form that obscures the actual reply-to address, no unnecessary friction, no unrelated calls to action bundled in. This is the smallest section on the site and should stay that way.

## Writing: content pillars

Writing is organized around a fixed set of pillars. Every article should map clearly to at least one pillar; a pillar is a lens for browsing and self-editing, not a rigid category a piece must be forced into.

- **Architecture** — system design, structuring large frontend codebases, monorepos, platform thinking.
- **Angular** — framework-specific patterns, upgrades, and deep dives.
- **React** — framework-specific patterns, ecosystem tools, and deep dives.
- **TypeScript** — type-system techniques, patterns for safer and more maintainable code.
- **Performance** — measurement, optimization techniques, real before/after tradeoffs.
- **Developer Experience** — tooling, workflows, internal platforms, what makes teams faster.
- **Career** — reflections on growth, decision-making, and the non-technical side of engineering work.
- **Building Products** — the product-thinking side of engineering: scoping, prioritization, shipping.
- **Lessons Learned** — retrospective, specific accounts of what went wrong (or right) and why.

New pillars should be added deliberately and rarely — a proliferation of pillars defeats their purpose as a navigational structure. A pillar earns its place once there are multiple articles that genuinely belong to it.

## Recommended article structure

A consistent shape makes articles easier to write, easier to edit, and easier for a reader to navigate:

1. **Title** — specific and literal. Prefer a title that states the claim or the problem over one that's merely intriguing.
2. **Hook** — one or two sentences establishing why this is worth reading right now, or what problem it resolves.
3. **Context** — the situation, constraints, or background a reader needs before the main content makes sense. Kept as short as the topic allows.
4. **Body** — the substantive content, broken into clearly headed sections. Code examples, diagrams, or concrete before/after comparisons belong here, not in the intro.
5. **Takeaways** — a short closing section making the practical conclusion explicit: what should a reader actually do differently, or what should they remember. Not every article needs a bulleted summary, but every article should leave the reader with a clear, statable conclusion.

Articles should be edited for length after drafting — the goal is the shortest version that fully makes the point, not the longest version that could be written.

## Metadata format

Every Writing (and Notes) entry is a single MDX file with YAML frontmatter. The required fields are:

| Field         | Type     | Purpose                                                                                                                                                             |
| ------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`       | string   | The article's title, as displayed and used in `<title>`/Open Graph metadata. Required, non-empty.                                                                   |
| `description` | string   | A one- to two-sentence summary used in listings, meta descriptions, and social previews. Required, non-empty — should stand on its own without reading the article. |
| `date`        | date     | Publication date. Used for sorting and display; treated as the single source of truth for "when was this published."                                                |
| `tags`        | string[] | Free-form labels for cross-cutting topics within a pillar (e.g. a specific library or technique). Supplementary to the content pillars, not a replacement for them. |
| `draft`       | boolean  | Marks an entry as unpublished. Draft entries are visible during local development and excluded from production builds, the sitemap, and the RSS feed.               |

Guidance for filling these in:

- **`title`** should be legible on its own in a list of ten other titles — avoid vague titles that only make sense in context.
- **`description`** is not filler; write it as if it's the only sentence a reader will see before deciding whether to click.
- **`date`** should reflect genuine publication, not last-edited time — silent backdating or forward-dating undermines the archive's honesty.
- **`tags`** should be short, reused consistently across articles (check existing tags before inventing a new one), and kept to a small number per article.
- **`draft`** should be the only mechanism used to hide unfinished work — never half-write a piece and publish it "temporarily," and never delete a draft file to hide it when marking it as a draft will do.
