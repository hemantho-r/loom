# UI review golden: button-review

- accessibility (error), Button.tsx:31 — focus ring removed (`outline: none`
  with no replacement); fix: visible `:focus-visible` ring.
- consistency (warning), Button.tsx:14 — raw `padding: 13px` instead of
  spacing tokens; fix: `spacing[3]`/`spacing[4]`.
- responsiveness (warning), Button.tsx:9 — fixed `width: 200px`; fix:
  intrinsic sizing with min/max widths.
- component quality (warning), Button.tsx:5 — props typed `any`; fix:
  explicit `variant`/`size` unions.

Gates demonstrated: **check-accessibility**, **check-consistency**, **check-responsiveness**.
