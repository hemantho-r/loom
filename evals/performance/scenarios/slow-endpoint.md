# Performance Eval: Slow Endpoint

## Scenario

`GET /v1/users` takes 2.4s at P99 with 500 users. The handler issues one
query per user to fetch each profile (N+1), then serializes everything
synchronously.

## Requirements

- Measure and record the baseline before changing code
- Fix the actual bottleneck first (not micro-optimizations)
- Verify with the same workload and confirm no functional regressions

## Expected Behavior

1. Baseline: P99 2.4s, profile attributed to N+1 queries via profiler output
2. Fix: single batched query (join or `WHERE id IN (...)`)
3. After: re-measured P99 on the same workload with the delta stated
4. Full test suite green; readability preserved

## Quality Gates

- **measure-first**: Must measure before optimizing
- **no-premature-optimization**: Don't optimize without evidence
- **maintainability**: Optimizations must not hurt readability
