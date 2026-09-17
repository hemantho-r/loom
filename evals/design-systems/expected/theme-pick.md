# Design systems golden: theme-pick

- Genre/theme: Bold & vibrant / Signal (launch page needs energy; previous
  was Modern minimal, so rotation is respected).
- Macrostructure: centered hero (single announcement CTA; visual below).
- Tokens: paper `#ffffff`, ink `#111111`, accent `#f0330f`; spacing unit
  `8px`, section rhythm `72px`; display `Archivo Black`, body `Inter`.
- slop-test: pass (Bold & vibrant/Signal + centered hero) — zero error
  failures; one warning logged (display face Archivo Black headlines only).
- Versioning: new accent-token set ships as v1.3.0 (minor) with a changelog entry.
- Component docs: hero component props table updated (variant, size, children).

Gates demonstrated: **token-coverage**, **slop-test**, **theme-rotation**, **versioning**, **component-documentation**.
