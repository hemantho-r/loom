# Gallery

Rendered-source examples, one per file. Each demonstrates a semantic pattern
from `../references/semantic-patterns.md` inside its complexity budget.

| File | Pattern | Type | Dials |
|------|---------|------|-------|
| `checkout-flow.mmd` | request/response + saga compensation | flow | mermaid, standard, standard, engineer |
| `cache-aside.mmd` | cache-aside (hit/miss branches) | sequence | mermaid, standard, standard, engineer |
| `shop-containers.mmd` | hierarchical containment | C4 container | mermaid, compact, overview, newcomer |
| `dfd-threat.mmd` | data flow across trust boundaries | DFD | mermaid, standard, standard, engineer |
| `decision-tree.mmd` | exhaustive branching | decision tree | mermaid, compact, standard, engineer |
| `org-chart.mmd` | reporting structure | org chart | mermaid, compact, overview, newcomer |
| `roadmap.mmd` | commitment gradient | timeline | mermaid, compact, overview, exec |
| `release-calendar.mmd` | dependency-ordered rollout | Gantt | mermaid, standard, standard, engineer |
| `c4-deployment.mmd` | runtime placement | C4 deployment | mermaid, standard, standard, engineer |
| `context-map.mmd` | bounded-context relationships | DDD context map | mermaid, compact, standard, engineer |

All ten pass `../scripts/self_check.py`. Copy the closest one as a
starting point rather than drawing from a blank canvas.
