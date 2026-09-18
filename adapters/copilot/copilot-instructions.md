# GitHub Copilot Instructions for Loom

## Available Skills (26)

Loom provides the following skills for development. Each skill's full
instructions live in `skills/<category>/<name>/SKILL.md`.

### Engineering
- **tdd** — Red-green-refactor with test seams and vertical slicing
- **review** — Five-axis review; parallel subagent delegation
- **debug** — Feedback-loop-first diagnosis
- **security** — OWASP Top 10, prompt-injection defense
- **api-design** — REST/GraphQL contract design
- **adr** — Architecture Decision Records
- **implementation** — Spec-to-code decomposition
- **refactoring** — Behavior-preserving transformations
- **git-worktrees** — Parallel branches via worktrees
- **subagent-development** — Multi-agent task splitting
- **lifecycle** — Feature triage and approval gates
- **migration** — Incremental migration with rollback
- **performance** — Measure-first profiling
- **documentation** — Accuracy and completeness for docs

### Design
- **diagram-design** — Mermaid-based diagrams
- **design-systems** — Tokens, brand extraction
- **accessibility** — WCAG 2.1 AA
- **ui-review** — Responsiveness and consistency audits

### Productivity
- **grill** — Frontier-batched interview before building
- **planning** — Task scope and acceptance criteria
- **handoff** — Context transfer between sessions
- **brainstorming** — Divergent-then-convergent ideation
- **issue-tracking** — Falsifiable bug reports

### DevOps
- **ci-cd** — Pipeline stages, rollback plan
- **monitoring** — Structured logging, error tracking

### Meta
- **writing-skills** — How to author a Loom skill

## How to Use

1. Install Loom skills to your project
2. Reference skills when working on related tasks
3. Follow the quality gates defined in each skill

## Quality Gates

All Loom skills enforce quality gates declared in their `SKILL.yaml`, checked
by `loom validate`:
- **error**: Must be satisfied
- **warning**: Should be satisfied
- **info**: For reference only
