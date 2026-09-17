# Refactoring Eval: Extract Method

## Scenario

A 60-line `processOrder()` function mixes validation, total calculation, and
persistence. Tests exist and pass. Refactor it without changing behavior.

## Requirements

- Tests must pass before and after
- Refactor in small, committed steps (one transformation at a time)
- No behavior change — observable outputs identical

## Expected Behavior

1. Confirm green baseline before touching code
2. Extract `validateOrder`, `calculateTotal`, `saveOrder` in separate steps
3. Run tests after each extraction
4. Final code has no duplication introduced by the split

## Quality Gates

- **tests-pass**: Tests pass before and after
- **small-steps**: Refactor in small steps
- **no-behavior-change**: No behavior change
