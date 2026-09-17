# TDD Eval: Simple Function

## Scenario

Create a function that calculates the factorial of a number.

## Requirements

- Function name: `factorial`
- Input: number
- Output: number
- Must handle 0! = 1
- Must handle negative numbers (throw error)
- Must use TDD workflow

## Expected Behavior

1. Write a failing test for 0! = 1
2. Implement to pass
3. Write a failing test for negative numbers
4. Implement to pass
5. Write a failing test for 5! = 120
6. Implement to pass

## Quality Gates

- **red-before-green**: Each test must fail before implementing
- **minimal-implementation**: Each implementation must be minimal
- **test-each-behavior**: Each behavior has its own test
