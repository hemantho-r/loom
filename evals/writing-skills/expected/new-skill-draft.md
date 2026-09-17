# Writing-skills golden: new-skill-draft

```yaml
name: "@loom/query-review"
version: "0.1.0"
description: "Review database queries for N+1, missing indexes, and unsafe patterns"
invocation: "model"
provides:
  - id: "query-review"
    description: "Review one query with its EXPLAIN plan"
quality:
  - id: "explain-first"
    type: "behavioral"
    description: "Must read the EXPLAIN plan before judging the query"
    severity: "error"
references:
  - path: "./references/explain-patterns.md"
    when: "when-reading-query-plans"
```

Body teaches `explain-first` (Step 2), carries a 3-row anti-rationalization
table, and names `explain-patterns.md` in that step. Self-score: 30/30.

Gates demonstrated: **has-quality-gates**, **has-anti-rationalization**, **has-references**.
