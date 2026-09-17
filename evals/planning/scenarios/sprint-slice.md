# Planning Eval: Sprint Slice

## Scenario

Break "guest checkout" into an executable sprint slice for one engineer:
email-only purchase, card payment via the existing provider, confirmation
email. No accounts, no gift cards, no international tax.

## Requirements

- Tasks small enough to finish in 1-2 days each
- Dependencies stated per task (what blocks what)
- Every task has falsifiable acceptance criteria

## Expected Behavior

1. 3-5 tasks, each independently testable
2. Dependency chain explicit (e.g. confirmation email blocked by order persistence)
3. Non-goals listed (accounts, gift cards, international tax)
4. Each task has Given/When/Then-style criteria

## Quality Gates

- **task-scope**: Tasks are properly scoped
- **dependencies**: Dependencies identified
- **acceptance-criteria**: Acceptance criteria defined
