# Subagent golden: parallel-slices

- Dispatch: Agent A (persistence) + Agent B (charge against a stubbed
  `OrderStore` interface) in parallel; Agent C (email) after the charge
  result contract is fixed.
- Interface first: `Order { id, status: pending|paid|failed, total }`
  shared before any agent starts.
- Conflict: A used `confirmed`, B used `paid` — resolved to `paid` per the
  payment provider's webhook vocabulary (correctness over recency).
- Seam test: persistence→charge→email integration test green; no shared
  mutable state during execution.

Gates demonstrated: **task-independence**, **result-integration**, **conflict-resolution**.
