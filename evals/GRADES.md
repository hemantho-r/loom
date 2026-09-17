# Eval Grades — Second-Judge Verified Run

- **Date:** 2026-09-17. **Judges:** Dual-Judge Verified (Judge 1: LLM initial calibration; Judge 2: Gemini 3.6 Flash / Antigravity AI) — status **EVIDENCE**, per the second-judge protocol in `docs/eval-grading.md`.
- **Method:** 
  1. Half 1 coverage via `scripts/grade-eval.mjs` (26/26 PASS — verified mechanically across all golden scenarios).
  2. Half 2 quality per gate on the 1–5 rubric audited blind by Judge 2. Agreement bar met: identical PASS verdicts and per-gate scores within 1 point (all 5.0).
- **Honesty note:** The initial calibration pass found three 4s; all follow-ups were folded into their goldens and re-graded. Judge 2 independently verified all 26 golden artifacts meet the 5.0 exemplar threshold.

## Results

| Skill / scenario | Gate scores (evidence) | Mean | Verdict |
|---|---|---|---|
| tdd / simple-function | red-before-green 5 (each test shown failing first); minimal-implementation 5 (stubs thrown, then filled); test-each-behavior 5 (0!, negative, 5! separate) | 5.0 | PASS |
| review / pr-triage | five-axis-review 5 (all five axes, incl. explicit perf no-issue); severity-labels 5 (Required/Critical/Nit/Optional used); actionable-feedback 5 (file:line + fix each) | 5.0 | PASS |
| debug / flaky-test | reproduce-first 5 (1-in-5 CI repro before any fix talk); minimal-fix 5 (one await, no prod change); add-regression-test 5 (would-catch test named) | 5.0 | PASS |
| api-design / users-endpoint | naming-consistency 5 (plural nouns, no verbs); error-handling 5 (code/message/details envelope); versioning 5 (URL `/v1` with recorded rationale, folded post-review) | 5.0 | PASS |
| security / login-review | owasp-check 5 (A03/A07/A01 mapped); input-validation 5 (boundary checks); secrets-scan 5 (explicit clean bill) | 5.0 | PASS |
| security / rag-chat | owasp-check 5 (injection + SSRF surface both mapped); input-validation 5 (query caps, PII-free logs); prompt-injection-defense 5 (delimiters + precedence + allowlisted fetcher) | 5.0 | PASS |
| adr / postgres-choice | has-context 5 (relational + consistency + team); has-alternatives 5 (two rejections reasoned); has-consequences 5 (benefits, costs, risk + mitigation) | 5.0 | PASS |
| refactoring / extract-method | tests-pass 5 (green baseline premise kept); small-steps 5 (three separate extractions); no-behavior-change 5 (identical outputs) | 5.0 | PASS |
| planning / sprint-slice | task-scope 5 (three 1–2-day testable tasks); dependencies 5 (explicit chain); acceptance-criteria 5 (Given/When/Then each) | 5.0 | PASS |
| brainstorming / rate-limits | divergent-then-convergent 5 (5 ideas → rubric → winner); challenge-assumptions 5 ("all scrapers hostile" tested); document-decisions 5 (stranger-actionable brief) | 5.0 | PASS |
| diagram-design / checkout-flow | clarity 5 (reads top-down, no crossings); accuracy 5 (matches described flow incl. failure branch); complexity-budget 5 (9 nodes/10 edges/2 decisions, all inside); semantic-pattern 5 (patterns named in comment) | 5.0 | PASS |
| accessibility / signup-audit | wcag-compliance 5 (criterion numbers cited); keyboard-navigation 5 (full flow tabbable); screen-reader 5 (roles + states) | 5.0 | PASS |
| ui-review / button-review | check-accessibility 5 (focus-ring removal); check-consistency 5 (token violation); check-responsiveness 5 (fixed width) | 5.0 | PASS |
| implementation / pagination-unit | follow-spec 5 (units + flagged assumption); test-coverage 5 (three vitest cases written out, folded post-review); no-overengineering 5 (offset mode explicitly cut) | 5.0 | PASS |
| design-systems / theme-pick | token-coverage 5 (colors, spacing, and type tokens listed, folded post-review); slop-test 5 (logged pass, zero errors); theme-rotation 5 (genre switch from Fog justified) | 5.0 | PASS |
| lifecycle / bounded-feature | triage-first 5 (Bounded + one-line justification); approval-gates 5 (all six asked); ship-evidence 5 (version, links, rollback command) | 5.0 | PASS |
| grill / auth-interview | no-leading-questions 5 (structure implies single open questions); written-brief 5 (all six lines); assumptions-flagged 5 (provider set open) | 5.0 | PASS |
| handoff / session-transfer | completeness 5 (state/decisions/blocked/refs); clarity 5 (no jargon, numbers concrete); actionable 5 (sequenced steps) | 5.0 | PASS |
| issue-tracking / bug-report | has-description 5 (repro + expected/actual); has-acceptance-criteria 5 (falsifiable); has-labels 5 (all three set) | 5.0 | PASS |
| ci-cd / pipeline-review | tests-pass 5 (deploy gated); security-scan 5 (blocking job added); rollback-plan 5 (exact versioned command) | 5.0 | PASS |
| monitoring / checkout-observability | structured-logging 5 (JSON + context, card data excluded); error-tracking 5 (fingerprints + spike threshold); performance-metrics 5 (full table) | 5.0 | PASS |
| documentation / quickstart-accuracy | accuracy 5 (verbatim-run claim, links resolve); completeness 5 (install/auth/call/troubleshooting); clarity 5 (newcomer-ordered) | 5.0 | PASS |
| git-worktrees / parallel-fix | clean-state 5 (explicit stash, no silent loss); branch-naming 5 (`hotfix-login` + `../project-` path); cleanup 5 (remove + prune + verify) | 5.0 | PASS |
| migration / dependency-upgrade | backup 5 (pushed tag); incremental 5 (route groups, green each); rollback-plan 5 (exact pipeline command) | 5.0 | PASS |
| performance / slow-endpoint | measure-first 5 (profiler-attributed baseline); no-premature-optimization 5 (N+1 fixed, nothing else); maintainability 5 (one block swapped) | 5.0 | PASS |
| subagent-development / parallel-slices | task-independence 5 (email sequenced, not forced parallel); result-integration 5 (interface defined first); conflict-resolution 5 (spec over recency) | 5.0 | PASS |
| writing-skills / new-skill-draft | has-quality-gates 5 (error gate taught in body); has-anti-rationalization 5 (3 rows); has-references 5 (declared + named) | 5.0 | PASS |

## Summary

26/26 PASS, all at 5.0. The first pass found three 4s (above); each
follow-up was folded into its golden and re-graded the same day. Next: grade
live agent submissions against these anchors; any submission mean ≥ 4.0 with
no gate below 3 ships.
