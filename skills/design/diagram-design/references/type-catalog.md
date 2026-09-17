# Type Catalog: Beyond the Big Five

SKILL.md Step 1 covers architecture, flow, sequence, ER, and network. This
file covers the next twelve types you'll actually reach for. Each entry gives
the Mermaid construct, the budget that applies, and the pitfall that ruins it.
All snippets are valid Mermaid — run `scripts/self_check.py` on outputs
(flowchart/sequence rules apply; other types are budget-checked by hand).

## Swimlane (flowchart + subgraphs)

Parallel tracks owned by different actors. Same budgets as flow (15 nodes,
20 edges, 4 decisions).

```mermaid
flowchart TD
    subgraph Client
        A([Submit order])
    end
    subgraph API
        B[Validate]
        C{Valid?}
    end
    subgraph Payments
        D[Charge card]
    end
    A --> B --> C
    C -->|Yes| D
    C -->|No| E[Return 400]
```

Pitfall: lanes that never interact — that's two diagrams sharing a canvas.

## State diagram (stateDiagram-v2)

Object lifecycle, not process flow. Budget: 10 states, 15 transitions.

```mermaid
stateDiagram-v2
    [*] --> Pending
    Pending --> Paid: charge succeeds
    Pending --> Failed: charge fails
    Failed --> Pending: retry
    Paid --> Refunded: refund
    Paid --> [*]
    Refunded --> [*]
```

Pitfall: missing terminal states — every path must reach `[*]` or loop
explicitly; a state with no outgoing edge that isn't terminal is a bug.

## Gantt (gantt)

Timelines with dependencies. Budget: 15 tasks; split by milestone beyond that.

```mermaid
gantt
    title Checkout rollout
    dateFormat YYYY-MM-DD
    section Build
    Persistence     :a1, 2026-01-05, 3d
    Charge          :a2, after a1, 3d
    section Release
    Email           :a3, after a2, 2d
    Rollout         :milestone, after a3, 0d
```

Pitfall: tasks without dependencies listed in date order only — the moment a
date slips, the whole chart lies. Prefer `after <id>` over fixed dates.

## Timeline (timeline)

Date-ordered narrative, no dependencies. Budget: 12 entries.

```mermaid
timeline
    title Auth history
    2024 : Passwords only
    2025 : Google OAuth added
    2026 : Passkeys pilot : GitHub OAuth added
```

Pitfall: stuffing causal explanation into entries — timelines show *when*,
pair with a flowchart for *why*.

## Class diagram (classDiagram)

Static structure of code, not data (that's ER). Budget: 10 classes.

```mermaid
classDiagram
    Order o-- LineItem : contains
    Order --> Payment : charged by
    class Order {
        +String id
        +Money total
        +pay() bool
    }
```

Pitfall: modeling every private field — show the shape a *caller* needs,
not the full implementation.

## C4 context (flowchart)

System in its world: users + external systems, no internals. Budget: 8 boxes.

```mermaid
flowchart LR
    User([Shopper]) --> Shop[Shop System]
    Shop --> Pay[Payment Provider]
    Shop --> Mail[Email Service]
    Admin([Admin]) --> Shop
```

Pitfall: leaking containers inside (that's the container diagram, next).

## C4 container (flowchart + subgraphs)

Runnables inside one system + their protocols. Budget: 10 boxes, label every
edge with protocol.

```mermaid
flowchart LR
    subgraph Shop["Shop System"]
        Web[Web App]
        API[API Service]
        DB[(Orders DB)]
    end
    Web -->|HTTPS| API
    API -->|SQL| DB
```

Pitfall: mixing code-level classes into a container view — one zoom level
per diagram.

## Mind map (mindmap)

Radiant exploration for brainstorming output. Budget: 20 nodes, 3 levels deep.

```mermaid
mindmap
    root((Rate limiting))
        Quotas
            Per-key buckets
            Tiered plans
        Reactive
            Anomaly throttling
            Proof-of-work
        Passive
            Long CDN TTLs
```

Pitfall: using it for decisions — mind maps diverge; end with a written
brief, never a mind map, per the `brainstorming` skill.

## Git graph (gitGraph)

Branch history for migration/release narratives. Budget: 12 commits shown.

```mermaid
gitGraph
    commit id: "v2 baseline"
    branch strangler
    commit id: "auth routes on v3"
    commit id: "billing routes on v3"
    checkout main
    merge strangler tag: "v3 complete"
```

Pitfall: showing every commit — curate to the migration story, link the full
log instead.

## User journey (journey)

Experience over time with satisfaction scores. Budget: 10 steps.

```mermaid
journey
    title Guest checkout
    section Buy
        Add to cart: 4: Shopper
        Enter card: 2: Shopper
        Confirmation email: 5: Shopper
```

Pitfall: scores without evidence — each score needs a cited source (survey,
session, support tickets), or it's fiction.

## Quadrant chart (quadrantChart)

2×2 positioning (e.g. triage: reversibility × blast radius). Budget: 12 points.

```mermaid
quadrantChart
    title Change triage
    x-axis Low blast radius --> High blast radius
    y-axis Easy to reverse --> Hard to reverse
    quadrant-1 Architectural review
    quadrant-2 Spike first
    quadrant-3 Just do it
    quadrant-4 Bounded + ADR
    "Add index": [0.2, 0.2]
    "Auth overhaul": [0.8, 0.9]
```

Pitfall: unlabeled quadrants — a 2×2 without named quadrants is decoration.

## Pie (pie)

Composition snapshots only. Budget: 6 slices; more means a table.

```mermaid
pie title Checkout latency budget
    "DB queries" : 62
    "Serialization" : 21
    "Network" : 12
    "Other" : 5
```

Pitfall: time-series data as pie — pies show one moment; trends need a line
chart (which Mermaid lacks — use a table or link out).
