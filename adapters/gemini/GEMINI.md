# Gemini Configuration for Loom

## Skills

Loom provides 26 skills across engineering, design, productivity, devops, and
meta. Each skill's full instructions live in `skills/<category>/<name>/SKILL.md`
— reference the file directly (Gemini CLI reads plain Markdown instruction
files; there is no verified Loom-specific slash-command syntax for Gemini, so
point it at the file path rather than an invented command).

### Engineering
- **@loom-skills/tdd** — `skills/engineering/tdd/SKILL.md` — Red-green-refactor with test seams and vertical slicing
- **@loom-skills/review** — `skills/engineering/review/SKILL.md` — Five-axis review; parallel subagent delegation
- **@loom-skills/debug** — `skills/engineering/debug/SKILL.md` — Feedback-loop-first diagnosis
- **@loom-skills/security** — `skills/engineering/security/SKILL.md` — OWASP Top 10, prompt-injection defense
- **@loom-skills/api-design** — `skills/engineering/api-design/SKILL.md` — REST/GraphQL contract design
- **@loom-skills/adr** — `skills/engineering/adr/SKILL.md` — Architecture Decision Records
- **@loom-skills/implementation** — `skills/engineering/implementation/SKILL.md` — Spec-to-code decomposition
- **@loom-skills/refactoring** — `skills/engineering/refactoring/SKILL.md` — Behavior-preserving transformations
- **@loom-skills/git-worktrees** — `skills/engineering/git-worktrees/SKILL.md` — Parallel branches via worktrees
- **@loom-skills/subagent-development** — `skills/engineering/subagent-development/SKILL.md` — Multi-agent task splitting
- **@loom-skills/lifecycle** — `skills/engineering/lifecycle/SKILL.md` — Feature triage and approval gates
- **@loom-skills/migration** — `skills/engineering/migration/SKILL.md` — Incremental migration with rollback
- **@loom-skills/performance** — `skills/engineering/performance/SKILL.md` — Measure-first profiling
- **@loom-skills/documentation** — `skills/engineering/documentation/SKILL.md` — Accuracy and completeness for docs

### Design
- **@loom-skills/diagram-design** — `skills/design/diagram-design/SKILL.md` — Mermaid-based diagrams
- **@loom-skills/design-systems** — `skills/design/design-systems/SKILL.md` — Tokens, brand extraction
- **@loom-skills/accessibility** — `skills/design/accessibility/SKILL.md` — WCAG 2.1 AA
- **@loom-skills/ui-review** — `skills/design/ui-review/SKILL.md` — Responsiveness and consistency audits

### Productivity
- **@loom-skills/grill** — `skills/productivity/grill/SKILL.md` — Frontier-batched interview before building
- **@loom-skills/planning** — `skills/productivity/planning/SKILL.md` — Task scope and acceptance criteria
- **@loom-skills/handoff** — `skills/productivity/handoff/SKILL.md` — Context transfer between sessions
- **@loom-skills/brainstorming** — `skills/productivity/brainstorming/SKILL.md` — Divergent-then-convergent ideation
- **@loom-skills/issue-tracking** — `skills/productivity/issue-tracking/SKILL.md` — Falsifiable bug reports

### DevOps
- **@loom-skills/ci-cd** — `skills/devops/ci-cd/SKILL.md` — Pipeline stages, rollback plan
- **@loom-skills/monitoring** — `skills/devops/monitoring/SKILL.md` — Structured logging, error tracking

### Meta
- **@loom-skills/writing-skills** — `skills/meta/writing-skills/SKILL.md` — How to author a Loom skill

## Quality Gates

All skills enforce quality gates declared in their `SKILL.yaml`:
- **error**: Must be satisfied
- **warning**: Should be satisfied
- **info**: For reference only

`pnpm validate` checks structural and content gates automatically; behavioral
and performance gates are listed as requiring manual verification.

## Context

Skills adapt to your project's context automatically:
- Language detection
- Framework detection
- Test runner detection
