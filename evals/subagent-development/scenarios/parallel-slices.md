# Subagent Development Eval: Parallel Slices

## Scenario

Split "guest checkout" into parallel agent tasks: order persistence, card
charge, confirmation email. The email depends on the charge result.

## Requirements

- Tasks must be genuinely independent (no shared mutable state)
- Integration boundaries must be written before dispatch
- Conflicts must be resolved by correctness and covered by seam tests

## Expected Behavior

1. Persistence and charge-interface tasks parallel; email task sequenced
   after the charge interface is fixed (dependency honored, not parallelized)
2. Shared `Order` shape and state machine defined up front
3. Any conflict (e.g. two status enums) resolved by spec, not by recency
4. Integration test covers the persistence→charge→email seam

## Quality Gates

- **task-independence**: Tasks must be independent
- **result-integration**: Results must be integratable
- **conflict-resolution**: Conflicts must be resolved
