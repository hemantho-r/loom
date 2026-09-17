# Macrostructures

A macrostructure is the page-level layout skeleton. Choose one before placing
components, and rotate it across runs so consecutive pages don't share a
silhouette. Pair each choice with a theme from `themes.md`.

## Catalog

### Hero split

- Shape: headline + CTA left, visual right, two-column at desktop.
- Use for: landing pages with one clear action.
- Avoid when: there are three or more competing CTAs.

### Centered hero

- Shape: stacked headline, subcopy, CTA, visual below.
- Use for: announcements, launches.
- Avoid when: the visual needs to do explanatory work beside the copy.

### Bento grid

- Shape: 2-4 cards of mixed sizes in a tight grid, one large anchor card.
- Use for: feature overviews, dashboards.
- Avoid when: content has a strict reading order — grids invite scanning, not sequence.

### Editorial stack

- Shape: single narrow column, large serif headlines, pull quotes, wide margins.
- Use for: docs, essays, case studies.
- Avoid when: the page is action-oriented (pricing, signup).

### Sidebar + content

- Shape: persistent left nav, content column right.
- Use for: docs, settings, admin.
- Avoid when: marketing pages — chrome competes with the message.

### Tabbed panels

- Shape: tab bar switching between dense content panels.
- Use for: settings groups, multi-view data.
- Avoid when: content needs to be compared side by side (use split instead).

### Timeline

- Shape: vertical spine with dated entries alternating sides (desktop) or stacked (mobile).
- Use for: changelogs, roadmaps, history.
- Avoid when: entries have no meaningful date ordering.

### Pricing tiers

- Shape: 3 columns, middle tier emphasized, feature comparison below.
- Use for: pricing, plan selection.
- Avoid when: fewer than 2 or more than 4 tiers.

### Gallery wall

- Shape: uniform cards in a wrapping grid, filter bar on top.
- Use for: templates, examples, team pages.
- Avoid when: items need rich per-item explanation (use list rows instead).

### List rows

- Shape: full-width rows with title, description, metadata, chevron.
- Use for: search results, issue lists, docs index.
- Avoid when: items are primarily visual (use gallery wall instead).

### Split form

- Shape: explainer left, form right, sticky on desktop.
- Use for: signup, contact, checkout-adjacent flows.
- Avoid when: the form is longer than ~8 fields (use stepped form instead).

### Stepped flow

- Shape: progress indicator + one step of content at a time.
- Use for: onboarding, multi-part configuration.
- Avoid when: users need to see everything at once to decide.

### FAQ accordion

- Shape: stacked question rows expanding to answers, search box on top for long lists.
- Use for: help centers, policy pages.
- Avoid when: answers need comparison across questions (use comparison table instead).

### Comparison table

- Shape: sticky first column of criteria, one column per option, highlighted recommended column.
- Use for: pricing details, plan comparison, tool selection.
- Avoid when: more than 5 options (narrow the set first) or criteria differ per option.

### Dashboard grid

- Shape: KPI strip on top, charts/tables in a 12-column grid below, time-range control global.
- Use for: metrics, admin overviews, status pages.
- Avoid when: the reader needs a narrative (use editorial stack with embedded figures instead).

### Chat thread

- Shape: message bubbles in a scrolling pane, composer pinned at the bottom, timestamps on hover.
- Use for: support chat, agent conversations, comments.
- Avoid when: messages need rich structure (use list rows with metadata instead).

### Kanban board

- Shape: columns as states, cards as work items, WIP counts on column headers.
- Use for: project tracking, pipelines, triage queues.
- Avoid when: more than ~6 columns (collapse states) or cards carry long-form content.

### Calendar view

- Shape: month/week grid with event chips, agenda list beside or below.
- Use for: scheduling, releases, events.
- Avoid when: the primary task is finding a free slot across people (use a dedicated picker pattern).

### Map + list split

- Shape: results list left, map right, selection synced both ways.
- Use for: locations, delivery zones, regional data.
- Avoid when: location is incidental metadata (a text label suffices).

### Stage + transcript

- Shape: video/stage panel with a synced transcript/Q&A rail beside it.
- Use for: demos, talks, tutorials.
- Avoid when: the content works as text alone (ship the transcript as an editorial page instead).

### Search + filter rail

- Shape: query bar on top, filter rail left, ranked results center.
- Use for: docs search, catalogs, marketplaces.
- Avoid when: fewer than ~20 items total (a plain grouped list is faster).

## Rotation rule

Log the last two macrostructures in the same rotation log
(`templates/rotation-log.md`). Do not reuse the same macrostructure twice
in a row within one project. Component-scope work (a single Button, a
single Card) is exempt — but the page it lands on must still satisfy
rotation.
