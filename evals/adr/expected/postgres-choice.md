# ADR 0007: Use PostgreSQL for the Orders Service

## Status

Accepted

## Context

Orders and line items are relational with strict consistency requirements;
the team already operates PostgreSQL in production.

## Decision

Use PostgreSQL for order storage.

## Alternatives

- MongoDB — rejected: weaker fit for relational consistency needs.
- SQLite — rejected: insufficient for concurrent production workloads.

## Consequences

### Positive

- ACID guarantees for order writes.
- Existing team operational experience.

### Negative

- Schema migrations required for model changes.

### Risks

- Write throughput ceiling under flash sales; mitigate with read replicas
  and load testing before launch.

Gates demonstrated: **has-context**, **has-alternatives**, **has-consequences**.
