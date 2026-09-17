# Mermaid Patterns

Concrete, valid Mermaid syntax for each diagram type in this skill. SKILL.md
shows two starter examples (architecture, sequence) — this file covers the
remaining types plus the patterns you'll need once a diagram gets bigger
than a toy example.

## Flow Diagrams

Use `flowchart` (the modern alias for `graph`) with a direction: `TD`
(top-down) or `LR` (left-right, better for wide pipelines).

```mermaid
flowchart TD
    Start([Start]) --> Input[/Receive request/]
    Input --> Valid{Valid input?}
    Valid -->|No| Reject[Return 400]
    Valid -->|Yes| Process[Process request]
    Process --> Saved{Save succeeded?}
    Saved -->|No| Retry[Retry with backoff]
    Retry --> Process
    Saved -->|Yes| Done([Return 200])
    Reject --> End([End])
    Done --> End
```

Node shapes carry meaning — use them consistently:
- `([...])` rounded = start/end
- `[...]` rectangle = process step
- `{...}` diamond = decision
- `[/.../]` parallelogram = input/output

## Sequence Diagrams

Beyond the basic request/response chain, use `loop`, `alt`, and `Note` to
show real control flow instead of flattening it into a linear list:

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant Cache
    participant DB

    Client->>API: GET /users/42
    API->>Cache: lookup(42)
    alt cache hit
        Cache-->>API: user data
    else cache miss
        API->>DB: SELECT * FROM users WHERE id=42
        DB-->>API: row
        API->>Cache: set(42, row)
    end
    API-->>Client: 200 OK

    Note over Client,API: Client retries on timeout
    loop up to 3 attempts
        Client->>API: retry if no response within 2s
    end
```

## ER Diagrams

Use `erDiagram` with explicit cardinality markers (`||`, `o|`, `}o`, `}|`)
— don't just draw boxes and unlabeled lines, the cardinality is the point.

```mermaid
erDiagram
    USER ||--o{ ORDER : places
    ORDER ||--|{ LINE_ITEM : contains
    PRODUCT ||--o{ LINE_ITEM : "ordered in"
    USER {
        int id PK
        string email
        string name
    }
    ORDER {
        int id PK
        int user_id FK
        datetime created_at
        string status
    }
```

## Network / Infrastructure Diagrams

Mermaid has no dedicated network-diagram type — model it as a `flowchart`
with `subgraph` to group by network boundary (VPC, availability zone,
on-prem vs. cloud):

```mermaid
flowchart LR
    subgraph Internet
        User[User]
    end
    subgraph "VPC (10.0.0.0/16)"
        LB[Load Balancer]
        subgraph "Private Subnet"
            App1[App Server 1]
            App2[App Server 2]
        end
        subgraph "Data Subnet"
            DB[(Primary DB)]
        end
    end
    User -->|HTTPS 443| LB
    LB --> App1
    LB --> App2
    App1 --> DB
    App2 --> DB
```

## Styling for Emphasis

Use `classDef` sparingly to highlight the one or two things that matter
(a bottleneck, a failure point) — don't color every node, that defeats the
purpose:

```mermaid
flowchart LR
    A[Client] --> B[API Gateway]
    B --> C[Service A]
    C --> D[(Database)]
    class D bottleneck
    classDef bottleneck fill:#f88,stroke:#900,stroke-width:2px
```

## Common Mistakes

- **Missing direction on flowcharts** — `flowchart` alone defaults to `TD`
  implicitly in some renderers but not others; always write it explicitly.
- **Unlabeled edges on decision diamonds** — every edge leaving a `{...}`
  decision node needs a label (`-->|Yes|`, `-->|No|`); an unlabeled edge
  out of a decision is a diagram bug, not a style choice.
- **Overloading one diagram with every actor** — if a sequence diagram
  needs more than 5-6 participants to tell its story, split it into two
  diagrams instead of shrinking the text to fit.
