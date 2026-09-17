# Rotation Log

Copy this file into your project (e.g. `docs/design-rotation.md`, or a
section of the PR description) and append one line per UI run. Rotation
can't be enforced repo-side — it is per-project runtime state — so this log
*is* the enforcement mechanism: no log line, no emit.

## Log

| Date | Page/area | Genre / Theme | Macrostructure | Slop-test |
|------|-----------|---------------|----------------|-----------|
| YYYY-MM-DD | [e.g. Pricing] | [e.g. Bold & vibrant / Signal] | [e.g. pricing-tiers] | [pass + warnings, or fail reason] |

## Rule (same as the skills)

The next run must pick a different genre — and a different macrostructure —
from the last two lines, unless the brand mandates otherwise. Component-scope
work logs the theme only.
