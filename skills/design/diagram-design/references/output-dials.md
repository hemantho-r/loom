# Output Dials and Complexity Budgets

Set these four dials before drawing. Defaults suit a PR description; turn them
explicitly for docs, exec reviews, or posters.

## The four dials

- **Format**: `mermaid` (version-controlled, default), `drawio` (visual polish), `html` (interactive/self-contained).
- **Size**: `compact` (fits one screen), `standard` (default), `poster` (print/large).
- **Detail**: `overview` (named boxes only), `standard` (key edges labeled), `deep` (protocols, cardinalities, error paths).
- **Audience**: `engineer` (default, jargon ok), `newcomer` (expand acronyms, add legend), `exec` (one message per diagram, hide internals).

Record the setting as one line, e.g.
`dials: format=mermaid, size=standard, detail=standard, audience=engineer`.

## Complexity budgets

A diagram that exceeds budget must be split, not shrunk.

| Diagram type | Max nodes/boxes | Max edges | Max participants/lanes | Split signal |
|---|---|---|---|---|
| Architecture | 12 | 18 | — | more than 2 trust boundaries crossed implicitly |
| Flow | 15 | 20 | — | more than 4 decision diamonds |
| Sequence | — | 20 messages | 6 participants | needs scrolling to follow one request |
| ER | 10 entities | 12 relationships | — | attributes listed per entity exceed 8 |
| Network | 15 | 20 | 4 subnets/zones | security reviewer asks "where is X?" |

Counting rules: subgraphs don't count as nodes; each `alt`/`loop` branch
counts its messages toward the edge total; legends and titles are free.

## When to escalate detail

- `overview` → `standard`: the reader asks "but how does A reach B?"
- `standard` → `deep`: the reader is debugging or reviewing security.
- Never jump `overview` → `deep` on the same canvas — produce the `standard`
  version first, then a linked deep-dive of the hot region.
