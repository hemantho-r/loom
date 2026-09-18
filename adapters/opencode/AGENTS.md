# Loom Skills

Skills woven together — A skill operating system for AI coding agents.

## Available Skills (26)

### Engineering
- **@loom/tdd** - Red-green-refactor with test seams and vertical slicing
- **@loom/review** - Five-axis review; parallel subagent delegation
- **@loom/debug** - Feedback-loop-first diagnosis
- **@loom/security** - OWASP Top 10, prompt-injection defense
- **@loom/api-design** - REST/GraphQL contract design
- **@loom/adr** - Architecture Decision Records
- **@loom/implementation** - Spec-to-code decomposition
- **@loom/refactoring** - Behavior-preserving transformations
- **@loom/git-worktrees** - Parallel branches via worktrees
- **@loom/subagent-development** - Multi-agent task splitting
- **@loom/lifecycle** - Feature triage and approval gates
- **@loom/migration** - Incremental migration with rollback
- **@loom/performance** - Measure-first profiling
- **@loom/documentation** - Accuracy and completeness for docs

### Design
- **@loom/diagram-design** - Mermaid-based diagrams
- **@loom/design-systems** - Tokens, brand extraction
- **@loom/accessibility** - WCAG 2.1 AA
- **@loom/ui-review** - Responsiveness and consistency audits

### Productivity
- **@loom/grill** - Frontier-batched interview before building
- **@loom/planning** - Task scope and acceptance criteria
- **@loom/handoff** - Context transfer between sessions
- **@loom/brainstorming** - Divergent-then-convergent ideation
- **@loom/issue-tracking** - Falsifiable bug reports

### DevOps
- **@loom/ci-cd** - Pipeline stages, rollback plan
- **@loom/monitoring** - Structured logging, error tracking

### Meta
- **@loom/writing-skills** - How to author a Loom skill

## Installation

```bash
loom install @loom/tdd
loom install @loom/review
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
loom compose @loom/tdd @loom/review
```

This creates a combined workflow that applies both skills.
