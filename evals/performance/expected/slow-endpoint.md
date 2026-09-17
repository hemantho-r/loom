# Performance golden: slow-endpoint

- Baseline (clinic.js, 500-user fixture): P99 2.4s; 501 queries per request
  (1 list + 500 profile lookups).
- Fix: one batched query — `SELECT * FROM profiles WHERE user_id IN (...)`
  — no caching layer, no query-hint tuning (evidence pointed at N+1, so N+1
  is what got fixed).
- After (same fixture): P99 180ms; full suite green; handler reads the same
  as before, one query block swapped.
- Documented in the PR: before/after numbers, profiler screenshots, fixture.

Gates demonstrated: **measure-first**, **no-premature-optimization**, **maintainability**.
