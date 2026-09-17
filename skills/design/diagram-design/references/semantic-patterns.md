# Semantic Patterns

Describe *behavior* independently of *layout*. The same semantics can render
as Mermaid, draw.io, or HTML — the meaning must survive the translation.

## Pattern 1: Request / Response

- Semantics: a caller asks, a callee answers, possibly with retries.
- Must capture: caller, callee, request, response, timeout/retry policy.
- Must not capture: pixel positions, colors.
- Renders as: sequence diagram (temporal view) or architecture edge (static view).

## Pattern 2: Publish / Subscribe

- Semantics: a producer emits events, zero or more consumers react, delivery is at-least-once.
- Must capture: topic/channel, producer, consumers, ordering guarantees.
- Must not capture: queue implementation details (unless the diagram is about infrastructure).
- Renders as: architecture diagram with labeled async edges, or a flow showing consumer branching.

## Pattern 3: Fan-out / Fan-in

- Semantics: one input splits into N parallel tasks, results rejoin before proceeding.
- Must capture: split point, parallel branches, join condition (all succeed? first wins? quorum?).
- Renders as: flowchart with parallel tracks, or sequence with `par` blocks.

## Pattern 4: Saga (distributed transaction)

- Semantics: a multi-step workflow where each step has a compensating action on failure.
- Must capture: steps in order, compensation per step, what "done" means.
- Renders as: flowchart with failure edges, or sequence with `alt` failure branches.

## Pattern 5: Cache-aside

- Semantics: read-through cache with explicit miss path and invalidation trigger.
- Must capture: cache, source of truth, miss path, invalidation event.
- Renders as: sequence with `alt` hit/miss (see `mermaid-patterns.md`).

## Pattern 6: Hierarchical containment

- Semantics: X runs inside / belongs to Y (service in subnet, pod in node).
- Must capture: container, containee, trust boundary crossings.
- Renders as: `subgraph` grouping in flowcharts, nested boxes in draw.io.

## How to use

1. Name the patterns present *before* choosing a diagram type.
2. One diagram per pattern-group — if you need request/response *and* saga compensation on one canvas, split it.
3. Verify: cover the pattern name and ask "could a reader reconstruct the behavior?" If not, the diagram shows layout but not semantics.
