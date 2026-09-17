# Slop Test

Run this checklist before emitting any UI. Every item is pass/fail. One fail
on an `error` item blocks the emit; fix it first. `warning` items must be
logged with a reason if skipped.

## Typography (error)

- [ ] Exactly one display face and one body face — no third font for "accents".
- [ ] Headline sizes follow the type scale (no arbitrary `font-size: 27px`).
- [ ] Line length under ~75 characters for body copy.
- [ ] No system-default fallback stack visible (Arial/Helvetica as final render).
- [ ] No all-caps paragraphs — all-caps reserved for short labels/eyebrows.
- [ ] Tabular numerals in data contexts (tables, prices, dashboards) so columns align.

## Color (error)

- [ ] Accent used in fewer than ~20% of visible pixels — if everything is the accent, nothing is.
- [ ] Body text contrast at least 4.5:1 against its background.
- [ ] No pure `#000` on pure `#fff` large surfaces (use ink/paper from the theme).
- [ ] Theme choice recorded — "default" styling with no explicit theme fails.
- [ ] Dark-mode surfaces checked as a pair (no light-only contrast assumptions) where supported.
- [ ] Focus-ring color distinct from every background it can appear on.

## Spacing & rhythm (error)

- [ ] All spacing is a multiple of the spacing unit (default `8px`).
- [ ] Section rhythm matches the theme (e.g. `96px`), not ad-hoc per section.
- [ ] No double margins (parent padding + first-child margin-top both pushing).
- [ ] Icon-to-text gaps use spacing tokens, not magic numbers.

## Components (error)

- [ ] Buttons: filled / outlined / ghost used consistently — one variant per action level.
- [ ] Cards of the same list share one elevation treatment.
- [ ] Form inputs share one style (underlined / outlined / filled), labels associated.
- [ ] Touch targets at least 44px on interactive elements.
- [ ] Empty, loading, and error states designed — no blank regions or raw spinners unexplained.
- [ ] Destructive actions visually distinct and confirmed before executing.

## Layout (warning)

- [ ] Macrostructure recorded and different from the previous page in this project.
- [ ] No more than one primary CTA per viewport.
- [ ] Mobile (360px) checked: no horizontal scroll, no fixed-width overflow.
- [ ] Visual order matches DOM order (no CSS-reordered content confusing keyboard/screen-reader users).
- [ ] Sticky headers/rails never cover focused elements or form errors.

## Accessibility (error)

- [ ] Semantic landmarks present (`header`, `main`, `nav`, `footer` as applicable).
- [ ] All icon-only buttons have accessible names.
- [ ] Focus order matches visual order; focus indicator visible.
- [ ] Images have alt text; decorative images hidden from assistive tech.
- [ ] Motion respects `prefers-reduced-motion` (no essential animation without a static path).
- [ ] Form errors associated with their fields and announced (not color-only).

## Motion (warning)

- [ ] Every animation has a purpose (feedback, orientation, continuity) — decorative motion removed.
- [ ] Durations under ~300ms for feedback, under ~500ms for transitions; nothing loops indefinitely.

## Anti-slop sniff test (warning)

- [ ] The page could not be mistaken for an unstyled component-library demo.
- [ ] Removing the logo would still leave a recognizable point of view (theme + macro + voice).
- [ ] No lorem ipsum, no "Lorem", no placeholder copy shipped as final.
- [ ] No generic hero headline ("Welcome to…", "Lorem ipsum dolor") — the headline says what this page does.
- [ ] Dates, numbers, and currencies formatted for humans, not raw ISO/epoch strings.

## Scoring

Count failures. Zero `error` failures required to emit. Log the pass with the
theme + macrostructure pair, e.g. `slop-test: pass (Editorial/Ink & Paper + editorial-stack)`.
