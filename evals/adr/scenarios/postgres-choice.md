# ADR Eval: Database Choice

## Scenario

The team must choose between PostgreSQL and MongoDB for an orders service
with relational order/line-item data, strict consistency needs, and a team
that already operates Postgres.

## Requirements

- State the context (problem, constraints, requirements)
- Record at least two alternatives with reasons for rejection
- Document positive consequences, negative trade-offs, and risks

## Expected Behavior

1. Context names relational data + consistency + team experience
2. Decision: PostgreSQL, stated plainly
3. Alternatives: MongoDB (rejected: consistency/relational fit), plus one more
4. Consequences list benefits, costs, and at least one risk

## Quality Gates

- **has-context**: ADR includes context
- **has-alternatives**: ADR considers alternatives
- **has-consequences**: ADR includes consequences
