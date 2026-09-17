# Diagram Types

Deeper guidance per type — for concrete Mermaid syntax, see
`mermaid-patterns.md`. Each section below covers what SKILL.md's Step 1
doesn't have room for: when the type is the *wrong* choice, and the
mistake people actually make with it.

## Architecture Diagrams

Show system components and relationships.

### When to Use
- Documenting system design
- Onboarding new team members
- Planning architectural changes

### When Not to Use
If you're explaining a single request's lifecycle (what calls what, in
what order), use a **sequence diagram** instead — architecture diagrams
show static structure, not temporal flow, and forcing ordering into an
architecture diagram (e.g. numbering the arrows 1, 2, 3) is a sign you
want a different diagram type.

### Common Pitfall
Drawing every service at the same level of detail regardless of relevance
to the point being made. A diagram meant to explain "why does auth fail
under load" doesn't need the billing service on it. Scope the diagram to
the question, then link out to a fuller architecture diagram if one exists.

### Components
Services, databases, message queues, load balancers, external systems.

### Relationships
Synchronous calls, asynchronous messages, data flow, dependencies — label
the edge with the protocol or trigger (`HTTPS`, `publishes`, `polls every
30s`), not just an unlabeled arrow.

## Flow Diagrams

Show decision paths and processes.

### When to Use
- Documenting business processes
- Explaining algorithms
- Mapping user journeys

### When Not to Use
If the "flow" has no real branching (it's a straight sequence of steps),
a numbered list is more readable than a diagram. Flowcharts earn their
complexity when there are genuine decision points with different outcomes.

### Common Pitfall
Decision diamonds with only one outgoing edge, or edges leaving a decision
node with no label — the reader can't tell what condition sends flow down
which path. Every edge out of a `{...}` node needs a label.

### Elements
Start/end points, decision points, process steps, connectors.

## Sequence Diagrams

Show interactions over time.

### When to Use
- Documenting API interactions
- Explaining workflows
- Debugging timing issues

### When Not to Use
If there's no meaningful passage of time or ordering between the
participants (e.g. two services that don't actually call each other),
this isn't a sequence diagram — it's an architecture diagram.

### Common Pitfall
Flattening retries, timeouts, and error branches out of the diagram to
keep it "clean." A sequence diagram that only shows the happy path is
often the least useful one, because the happy path is rarely what someone
is debugging. Use `alt`/`else` and `loop` blocks (see `mermaid-patterns.md`)
to show the branches that actually matter.

### Elements
Actors, messages, loops, conditionals, notes.

## ER Diagrams

Show data models and relationships.

### When to Use
- Database design
- Data modeling
- Documentation

### When Not to Use
Don't use an ER diagram to document an in-memory object graph or a
request/response payload shape — those are better shown as a type
definition or a JSON example. ER diagrams are for persisted, relational
data with real cardinality constraints.

### Common Pitfall
Omitting cardinality (drawing a plain line instead of `||--o{`-style
markers). "User has orders" is not the same claim as "a user has zero or
more orders, an order belongs to exactly one user" — the second is what
an ER diagram is supposed to communicate; the first is just a graph.

### Elements
Entities, attributes, relationships, cardinality.

## Network Diagrams

Show infrastructure and connections.

### When to Use
- Infrastructure planning
- Security reviews
- Capacity planning

### When Not to Use
Don't reach for a network diagram to explain application-level call
structure (that's an architecture diagram) — network diagrams should be
scoped to physical/virtual infrastructure boundaries: subnets, VPCs,
availability zones, firewalls, and the traffic that crosses them.

### Common Pitfall
Omitting trust boundaries. A network diagram that doesn't distinguish
"public internet," "DMZ," and "private subnet" as visually distinct
regions (e.g. via `subgraph` grouping) fails at its main job for a
security review, which is showing what's exposed to what.

### Elements
Servers, networks, firewalls, load balancers.
