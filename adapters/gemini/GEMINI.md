# Gemini Configuration for Loom

## Skills

Loom provides 26 skills across engineering, design, productivity, devops, and
meta. Each skill's full instructions live in `skills/<category>/<name>/SKILL.md`
— reference the file directly (Gemini CLI reads plain Markdown instruction
files; there is no verified Loom-specific slash-command syntax for Gemini, so
point it at the file path rather than an invented command).

### Engineering
- **@loom/tdd** — `skills/engineering/tdd/SKILL.md` — Red-green-refactor with test seams and vertical slicing
- **@loom/review** — `skills/engineering/review/SKILL.md` — Five-axis review; parallel subagent delegation
- **@loom/debug** — `skills/engineering/debug/SKILL.md` — Feedback-loop-first diagnosis
- **@loom/security** — `skills/engineering/security/SKILL.md` — OWASP Top 10, prompt-injection defense
- **@loom/api-design** — `skills/engineering/api-design/SKILL.md` — REST/GraphQL contract design
- **@loom/adr** — `skills/engineering/adr/SKILL.md` — Architecture Decision Records
- **@loom/implementation** — `skills/engineering/implementation/SKILL.md` — Spec-to-code decomposition
- **@loom/refactoring** — `skills/engineering/refactoring/SKILL.md` — Behavior-preserving transformations
- **@loom/git-worktrees** — `skills/engineering/git-worktrees/SKILL.md` — Parallel branches via worktrees
- **@loom/subagent-development** — `skills/engineering/subagent-development/SKILL.md` — Multi-agent task splitting
- **@loom/lifecycle** — `skills/engineering/lifecycle/SKILL.md` — Feature triage and approval gates
- **@loom/migration** — `skills/engineering/migration/SKILL.md` — Incremental migration with rollback
- **@loom/performance** — `skills/engineering/performance/SKILL.md` — Measure-first profiling
- **@loom/documentation** — `skills/engineering/documentation/SKILL.md` — Accuracy and completeness for docs

### Design
- **@loom/diagram-design** — `skills/design/diagram-design/SKILL.md` — Mermaid-based diagrams
- **@loom/design-systems** — `skills/design/design-systems/SKILL.md` — Tokens, brand extraction
- **@loom/accessibility** — `skills/design/accessibility/SKILL.md` — WCAG 2.1 AA
- **@loom/ui-review** — `skills/design/ui-review/SKILL.md` — Responsiveness and consistency audits

### Productivity
- **@loom/grill** — `skills/productivity/grill/SKILL.md` — Frontier-batched interview before building
- **@loom/planning** — `skills/productivity/planning/SKILL.md` — Task scope and acceptance criteria
- **@loom/handoff** — `skills/productivity/handoff/SKILL.md` — Context transfer between sessions
- **@loom/brainstorming** — `skills/productivity/brainstorming/SKILL.md` — Divergent-then-convergent ideation
- **@loom/issue-tracking** — `skills/productivity/issue-tracking/SKILL.md` — Falsifiable bug reports

### DevOps
- **@loom/ci-cd** — `skills/devops/ci-cd/SKILL.md` — Pipeline stages, rollback plan
- **@loom/monitoring** — `skills/devops/monitoring/SKILL.md` — Structured logging, error tracking

### Meta
- **@loom/writing-skills** — `skills/meta/writing-skills/SKILL.md` — How to author a Loom skill

## Quality Gates

All skills enforce quality gates declared in their `SKILL.yaml`:
- **error**: Must be satisfied
- **warning**: Should be satisfied
- **info**: For reference only

`loom validate` checks structural and content gates automatically; behavioral
and performance gates are listed as requiring manual verification.

## Context

Skills adapt to your project's context automatically:
- Language detection
- Framework detection
- Test runner detection
