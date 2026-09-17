# Migration Eval: Dependency Upgrade

## Scenario

Upgrade the web framework from v2 to v3 across a service with 40 routes.
The v3 router changes middleware signatures; everything else is compatible.

## Requirements

- Back up (tag) the pre-migration state before changing anything
- Migrate incrementally — one route group at a time, tests green after each
- State a concrete rollback plan, not "revert the commit"

## Expected Behavior

1. Tag `pre-v3-migration` before starting
2. Strategy named (strangler fig over route groups, or branch by abstraction
   on the middleware adapter) with a reason
3. Per-group verification (route tests green after each group)
4. Rollback: redeploy the tagged build via the standard pipeline

## Quality Gates

- **backup**: Backup before migrating
- **incremental**: Migrate incrementally
- **rollback-plan**: Have rollback plan
