# Loom Skills

Skills woven together — A skill operating system for AI coding agents.

## Available Skills (26)

### Engineering
- **@loom-skills/tdd** - Red-green-refactor with test seams and vertical slicing
- **@loom-skills/review** - Five-axis review; parallel subagent delegation
- **@loom-skills/debug** - Feedback-loop-first diagnosis
- **@loom-skills/security** - OWASP Top 10, prompt-injection defense
- **@loom-skills/api-design** - REST/GraphQL contract design
- **@loom-skills/adr** - Architecture Decision Records
- **@loom-skills/implementation** - Spec-to-code decomposition
- **@loom-skills/refactoring** - Behavior-preserving transformations
- **@loom-skills/git-worktrees** - Parallel branches via worktrees
- **@loom-skills/subagent-development** - Multi-agent task splitting
- **@loom-skills/lifecycle** - Feature triage and approval gates
- **@loom-skills/migration** - Incremental migration with rollback
- **@loom-skills/performance** - Measure-first profiling
- **@loom-skills/documentation** - Accuracy and completeness for docs

### Design
- **@loom-skills/diagram-design** - Mermaid-based diagrams
- **@loom-skills/design-systems** - Tokens, brand extraction
- **@loom-skills/accessibility** - WCAG 2.1 AA
- **@loom-skills/ui-review** - Responsiveness and consistency audits

### Productivity
- **@loom-skills/grill** - Frontier-batched interview before building
- **@loom-skills/planning** - Task scope and acceptance criteria
- **@loom-skills/handoff** - Context transfer between sessions
- **@loom-skills/brainstorming** - Divergent-then-convergent ideation
- **@loom-skills/issue-tracking** - Falsifiable bug reports

### DevOps
- **@loom-skills/ci-cd** - Pipeline stages, rollback plan
- **@loom-skills/monitoring** - Structured logging, error tracking

### Meta
- **@loom-skills/writing-skills** - How to author a Loom skill

## Installation

```bash
loom install @loom-skills/tdd
loom install @loom-skills/review
```

## Usage

Skills are automatically loaded when available in the project. Each skill's
full instructions live in `skills/<category>/<name>/SKILL.md`.

### Quality Gates

Each skill defines quality gates in its `SKILL.yaml`, enforced by `loom validate`:

- **error**: Must be satisfied before proceeding
- **warning**: Should be satisfied, warnings shown
- **info**: For reference only

## Context Adaptation

Skills adapt to your project's context:
- Language (TypeScript, JavaScript, Python, etc.)
- Framework (React, Vue, Node, etc.)
- Test runner (Jest, Vitest, etc.)

## Composing Skills

```bash
loom compose @loom-skills/tdd @loom-skills/review
```

This creates a combined workflow that applies both skills.
