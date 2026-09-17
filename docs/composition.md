# Skill Composition

## Overview

Loom allows you to compose multiple skills into a combined workflow. This is useful when you need the capabilities of multiple skills working together.

## Basic Composition

```bash
loom compose @loom/tdd @loom/review
```

This creates a workflow that combines TDD and code review capabilities.

## How Composition Works

1. **Load Skills** - All specified skills are loaded
2. **Merge Capabilities** - Capabilities from all skills are combined
3. **Detect Conflicts** - Check for conflicting capabilities
4. **Merge Quality Gates** - Quality gates from all skills are combined
5. **Generate Output** - Create a combined workflow document

## Conflict Detection

Loom detects three types of conflicts:

### Capability Conflicts

Multiple skills providing the same capability:

```yaml
# Skill A
provides:
  - id: "same-capability"

# Skill B
provides:
  - id: "same-capability"  # Conflict!
```

### Version Conflicts

Skills requiring different versions of the same dependency:

```yaml
# Skill A
requires:
  - id: "dep"
    version: ">=1.0.0"

# Skill B
requires:
  - id: "dep"
    version: ">=2.0.0"  # May conflict
```

### Context Conflicts

Skills requiring incompatible contexts:

```yaml
# Skill A
context:
  - type: "language"
    values: ["typescript"]

# Skill B
context:
  - type: "language"
    values: ["python"]  # Conflict!
```

## Resolution Strategies

### Manual Resolution

When conflicts are detected, resolve them manually:

1. Review the conflicts
2. Choose which skill's capability to use
3. Modify skills if needed

### Automatic Resolution

For some conflicts, Loom can automatically resolve:

- **Capability conflicts**: First skill wins
- **Version conflicts**: Highest version wins
- **Context conflicts**: Manual resolution required

## Composition Output

The composed workflow includes:

- List of skills
- Combined capabilities
- Merged quality gates
- Context requirements

## Example

```bash
loom compose @loom/tdd @loom/review @loom/debug
```

Output:

```markdown
# Loom Composed Workflow

Generated: 2026-09-15

## Skills

- **@loom/tdd**@1.0.0: Test-driven development
- **@loom/review**@1.0.0: Code review
- **@loom/debug**@1.0.0: Debugging workflow

## Capabilities

- **tdd-workflow**: Red-green-refactor cycle
- **review-gate**: Multi-axis code review
- **debug-workflow**: Systematic debugging

## Quality Gates

- **red-before-green**: Must watch test fail before implementing
- **minimal-implementation**: Implementation must be minimal
- **five-axis-review**: Review covers 5 dimensions
- **reproduce-first**: Must reproduce bug before fixing
```
