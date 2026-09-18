# Code Review

## Overview

Multi-dimensional code review with quality gates. Every change gets reviewed before merge — no exceptions.

**The approval standard:** Approve a change when it definitely improves overall code health, even if it isn't perfect.

## When to Use

- Before merging any PR or change
- After completing a feature implementation
- When another agent or model produced code you need to evaluate
- When refactoring existing code

## The Five-Axis Review

Every review evaluates code across these dimensions:

### 1. Correctness

Does the code do what it claims to do?

- Does it match the spec or task requirements?
- Are edge cases handled?
- Are error paths handled?
- Does it pass all tests?

### 2. Readability & Simplicity

Can another engineer understand this code without the author explaining it?

- Are names descriptive and consistent?
- Is the control flow straightforward?
- Is the code organized logically?
- Could this be done in fewer lines?

### 3. Architecture

Does the change fit the system's design?

- Does it follow existing patterns?
- Does it maintain clean module boundaries?
- Is there code duplication that should be shared?
- Are dependencies flowing in the right direction?

### 4. Security

Does the change introduce vulnerabilities?

- Is user input validated and sanitized?
- Are secrets kept out of code?
- Are SQL queries parameterized?
- Are outputs encoded to prevent XSS?

### 5. Performance

Does the change introduce performance problems?

- Any N+1 query patterns?
- Any unbounded loops?
- Any synchronous operations that should be async?

## Severity Labels

| Label | Meaning | Author Action |
|-------|---------|---------------|
| (no prefix) | Required change | Must address before merge |
| **Critical:** | Blocks merge | Security vulnerability, data loss |
| **Nit:** | Minor, optional | Author may ignore |
| **Optional:** | Suggestion | Worth considering |
| **FYI:** | Informational | No action needed, context for future reference |

## Parallel Sub-Agent Review Delegation

For non-trivial reviews (>100 lines or multi-component changes), do not run all five axes in a single linear pass where one finding biases another. Invoke two independent subagents in parallel (`invoke_subagent`):

- **Subagent A (Standards & Security Axis):** Focuses strictly on correctness, missing tests, edge cases, input validation, and security vulnerabilities (OWASP).
- **Subagent B (Spec & Architecture Axis):** Focuses strictly on requirement compliance, module boundaries, readability, and performance bounds.

Consolidate findings into the final review report only after both subagents complete their independent checks.

## Change Sizing

Flag the change size itself before reviewing the content:

| Lines changed | Guidance |
|---|---|
| < 100 | Normal review depth |
| 100–300 | Ask: could this split into independent, separately-reviewable commits? |
| 300–1000 | Should split unless it's a single mechanical change (rename, codemod, generated file) — say so explicitly if you're waiving the split |
| > 1000 | Don't do a deep line-by-line review of a diff this size — it produces false confidence. Ask for a split, or review architecture/risk only and say that's what you did |

A review that rubber-stamps a 1500-line diff in the same depth as a 50-line one is not actually reviewing it.

## Dependency Review

New or changed dependencies get a distinct check, separate from the five axes:

**Adding a dependency:**
- Is there already an equivalent in the codebase? (don't add a second date library)
- What's its maintenance status — last release, open critical issues?
- What does it pull in transitively — does it 10x the install size for one function?
- License compatible with this project?

**Upgrading a dependency:**
- Read the changelog for the version range being crossed, not just the target version
- Major version bump → check for the project's own usage of removed/changed APIs
- Security-motivated upgrade → confirm the CVE is actually reachable from this codebase's usage, don't just bump-and-hope

## Disagreement Resolution

Reviewer and author don't always agree. Resolve in this order:

1. **Check the spec/requirements first** — if the task defined the behavior, that settles it, not preference.
2. **Reviewer's technical objection stands** if it's about correctness, security, or an architecture pattern already established elsewhere in the codebase — these aren't matters of taste.
3. **Author's call stands** on genuine style/taste disagreements that don't affect correctness — don't block a merge over a preference the codebase has no established convention for.
4. **Escalate to a third opinion** (another reviewer, or the human partner) when the disagreement is about an architecture decision neither side can point to precedent for — don't let it become a two-person stalemate on the PR.

## Quality Gates

- **five-axis-review**: Review covers correctness, readability, architecture, security, performance
- **severity-labels**: Issues must have severity labels
- **actionable-feedback**: Feedback must be actionable

## Self-Critique Scoring

Before submitting review, score yourself (1-5):

| Axis | Question | Score |
|------|----------|-------|
| **Completeness** | Did I review all dimensions? | 1-5 |
| **Specificity** | Are my comments specific? | 1-5 |
| **Actionability** | Can the author act on my feedback? | 1-5 |
| **Tone** | Is my tone constructive? | 1-5 |
| **Priority** | Did I prioritize issues correctly? | 1-5 |
| **Evidence** | Do I provide evidence for claims? | 1-5 |

**Minimum passing score:** 30/30

## Anti-Rationalization

| Excuse | Reality |
|--------|---------|
| "Ship now, review later" | Debt compounds. Review now or debug later, with less context. |
| "It's just a small change" | Small changes cause big outages — size doesn't correlate with blast radius. |
| "I trust the author" | Trust but verify. Bugs don't care about trust, and neither does production. |
| "Tests pass so it's fine" | Tests verify what the author thought to test, not what's actually broken. |
| "This diff is huge, I'll skim it" | A skim on a 1000-line diff is worse than saying so — see [Change Sizing](#change-sizing) and ask for a split or scope the review honestly. |
| "The author is senior, they know what they're doing" | Seniority reduces the base rate of bugs, it doesn't reduce it to zero. Review the code, not the author's résumé. |
| "It's generated/boilerplate code, no need to review closely" | Generated code still runs in production — a bad codegen template ships the same bug N times. |
| "This is a hotfix, review can be lighter" | Hotfixes under pressure are exactly where unreviewed changes cause the second incident. |
| "The dependency bump is minor version, should be safe" | Minor-version bumps still break things — check the changelog, don't assume semver is honored. |

## Red Flags — STOP and Reconsider

- You're about to approve without reading every changed file
- You caught yourself thinking "probably fine" instead of checking
- The diff is >1000 lines and you're reviewing it at normal depth instead of flagging the size
- A security- or correctness-relevant comment got downgraded to "Nit:" to avoid conflict
- You're approving because the author is waiting, not because the change is ready
- A new dependency was added and you didn't check what it pulls in transitively

## References

- [checklist.md](references/checklist.md) - Review checklist
- [severity-guide.md](references/severity-guide.md) - How to categorize issues
