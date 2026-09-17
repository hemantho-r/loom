# Lifecycle Eval: Bounded Feature

## Scenario

Deliver "password reset via email": a Bounded change to one service with
stable interfaces and redeploy rollback.

## Requirements

- Triage the work (Spike, Bounded, Architectural) before planning
- Pass each phase approval gate before advancing — no skipping
- SHIP with linked tests, review evidence, and rollout/rollback evidence

## Expected Behavior

1. Triage: Bounded, one line of justification
2. Each phase gate asked and answered (DEFINE through SHIP)
3. Ship record names version, deploy target, and rollback command
4. No phase advanced on a failed gate

## Quality Gates

- **triage-first**: Must triage before planning
- **approval-gates**: Must pass each phase gate before advancing
- **ship-evidence**: SHIP requires tests, review, and rollout evidence
