# Eval Grading

`pnpm eval` answers "is this scenario wired up?" This document +
`scripts/grade-eval.mjs` answer the harder question: "did the submission
actually satisfy the scenario?" Grading has two halves with an explicit
boundary between them.

## Half 1 — Coverage (mechanical, scripted)

```bash
node scripts/grade-eval.mjs evals/review/scenarios/pr-triage.md SUBMISSION.md
```

The script parses the scenario's `## Requirements` bullets and `## Quality
Gates` ids, then checks the submission for:

- every gate id mentioned (exact `**gate-id**` or plain `gate-id`),
- keyword overlap with every requirement (content words, stopwords removed —
  reports which keywords matched so a pass is auditable),
- non-trivial substance (not an empty or one-line file).

Exit code 0 with a score sheet, or 1 listing the missed items. A coverage
pass is necessary but not sufficient — it proves the submission *addresses*
everything, not that it does so *well*.

## Half 2 — Quality (human or LLM judge, rubric below)

Score each quality gate referenced by the scenario from 1–5:

| Score | Meaning |
|-------|---------|
| 5 | Exemplary — could be promoted to a golden file |
| 4 | Correct and complete, minor polish only |
| 3 | Correct approach, gaps a reviewer would send back |
| 2 | Wrong approach or major omissions |
| 1 | Ignores the gate / off-topic |

Record one line of evidence per score (file:line or quote). Pass threshold:
mean ≥ 4.0 with no gate below 3 — the same bar as the 30/30 self-critique
ethos (near-perfect to ship).

## Calibration

- New graders first grade two golden files in `expected/` — both should land
  at 5s. If they don't, the grader is miscalibrated, not the golden.
- Disagreements go to the gate's SKILL.md section, which is the source of
  truth for what the gate means.

## Second-judge protocol (grader independence)

A grade from the same party that wrote the submission is calibration, not
evidence. Promote a grade to evidence with a second judge:

1. The second judge must be a different party (different person, or a
   different model family — not the same model re-prompted).
2. Both judges grade blind: same scenario + submission, no access to each
   other's scores.
3. Agreement bar: same verdict (PASS/FAIL) and per-gate scores within 1
   point. On disagreement, the gate's SKILL.md section decides; if still
   split, the lower score stands and the disagreement is recorded in
   `evals/GRADES.md` next to the row.
4. Record both judges and the agreement outcome in the GRADES.md header for
   that run. A single-judge grade stays labeled "calibration" forever — it
   never silently becomes evidence.
