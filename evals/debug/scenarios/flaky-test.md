# Debug Eval: Flaky Test

## Scenario

A test suite passes locally but fails intermittently in CI on the checkout
flow. The failure message is a timeout waiting for an order-confirmation
element.

## Requirements

- Write a reproduction before proposing any fix
- Isolate to the smallest reproduction case
- Identify root cause (not symptom) with evidence
- Propose a minimal fix plus a regression test

## Expected Behavior

1. Reproduce with a failing test or script that triggers the timeout
2. Isolate: network timing vs. real logic bug (e.g. missing await on payment mock)
3. Fix the root cause only, no unrelated changes
4. Add a regression test that would have caught it

## Quality Gates

- **reproduce-first**: Must reproduce the bug before fixing
- **minimal-fix**: Fix should be minimal and targeted
- **add-regression-test**: Add a test that would have caught this bug
