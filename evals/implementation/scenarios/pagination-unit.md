# Implementation Eval: Pagination Unit

## Scenario

Implement cursor pagination for `GET /v1/users` from this spec line: "Pages
of up to `perPage` users (default 20, max 100) with an opaque `cursor`;
response includes `nextCursor` (null on the last page)."

## Requirements

- Implement exactly what the spec says — no invented scope
- Flag ambiguity instead of guessing (e.g. what the cursor encodes)
- Tests trace back to specific spec requirements

## Expected Behavior

1. Units identified: default/max clamping, cursor encode/decode, nextCursor logic
2. Ambiguity flagged (cursor format unspecified → conventional opaque string, noted)
3. Per-unit tests referencing the spec line each covers
4. No extra features (no offset mode, no sorting)

## Quality Gates

- **follow-spec**: Implementation follows spec
- **test-coverage**: Tests cover requirements
- **no-overengineering**: No overengineering
