# Import and Redraw

Turn an existing diagram or website into first-class Loom inputs: extract the
structure, pull brand tokens where a site exists, and redraw in the target
tool. Also used by `@loom-skills/design-systems` brand onboarding.

Scripted extractors live in `scripts/` with fixtures under
`scripts/fixtures/` — run them before hand-transcribing anything:

- `node scripts/extract-drawio.mjs <file.drawio>` — vertices + edges to a
  Mermaid scaffold with structure counts.
- `node scripts/extract-excalidraw.mjs <file.excalidraw>` — bound labels +
  arrow bindings to a Mermaid scaffold with structure counts.
- `node scripts/extract-brand.mjs <url-or-html-file>` — dominant colors,
  fonts, spacing rhythm as a `brand.ts` skeleton (network use requires the
  consumer skill's `web-fetch` capability).

## From draw.io (.drawio / .xml)

1. Export the diagram as `.drawio` XML (Extras → Edit Diagram → copy XML).
2. Read the XML as text: `<mxCell>` elements are nodes/edges, `style=`
   attributes carry shapes, `value=` attributes carry labels.
3. Transcribe nodes → boxes and edges → labeled arrows into Mermaid (see
   `mermaid-patterns.md`), preserving every label verbatim — never
   "improve" a label during transcription.
4. Verify: node count and edge count match the source before restyling.

## From Mermaid

1. Paste the source block as-is; render it once to confirm it compiles.
2. Extract the semantic patterns (`semantic-patterns.md`) before touching
   layout — the redraw must preserve behavior, not pixels.
3. Re-emit in the target dial (`output-dials.md`); re-run
   `scripts/self_check.py` on the result.

## From Excalidraw (.excalidraw / .json)

1. Open the `.excalidraw` JSON: `elements` with `type: "text"` are labels,
   `arrow`/`line` elements are edges (`startBinding`/`endBinding` give
   endpoints).
2. Hand-drawn style does not survive translation — transcribe structure and
   labels only, then apply the target theme deliberately.
3. Note what was lost (informal grouping, sketch annotations) in one line so
   the redraw doesn't silently drop meaning.

## From a website URL (brand tokens)

Requires the `web-fetch` capability (declared optional in the consumer skill).

1. Fetch the homepage and one content page.
2. Extract: dominant background/text/accent hex values, heading and body
   font families, base spacing rhythm (measure repeated paddings — the mode,
   not the mean).
3. Emit a `brand.ts` in the shape shown in the design-systems skill, then
   derive tokens from it — never hardcode sampled hexes into components.
4. Record the source URL and fetch date; re-sample when the site redesigns.

## Verification (all imports)

- Structure counts match source (nodes/edges/entries).
- Every label transcribed verbatim or explicitly marked as rewritten.
- Output passes the relevant checks (`self_check.py` for Mermaid,
  slop-test for UI).
