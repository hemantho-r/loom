# Documentation Eval: Quickstart Accuracy

## Scenario

Write a quickstart for the users SDK: install, authenticate, list users.
Every example must run verbatim.

## Requirements

- All code examples verified by execution, not by reading
- Cover install, auth, and at least one real call end to end
- A newcomer must complete it unaided; all links resolve

## Expected Behavior

1. Install command for the actual package manager
2. Auth example with key handling (env var, never hardcoded)
3. `users.list()` example with real expected output shape
4. Troubleshooting entry for the most common failure (bad key → 401)

## Quality Gates

- **accuracy**: Documentation is accurate
- **completeness**: Documentation covers all features
- **clarity**: Documentation is clear and concise
