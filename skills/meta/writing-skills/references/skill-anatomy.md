# Skill Anatomy

## Required Files

### SKILL.yaml

Machine-readable skill definition:

```yaml
name: "@scope/skill-name"
version: "1.0.0"
description: "What the skill does"
provides:
  - id: "capability"
    description: "What it provides"
```

### SKILL.md

Human-readable instructions:

```markdown
# Skill Name

## Overview
[What the skill does]

## When to Use
[Trigger conditions]

## Workflow
[Step-by-step instructions]
```

## Optional Files

### references/

Supporting documentation loaded on demand:

```
references/
├── guide.md
├── patterns.md
└── examples.md
```

### tests/

Test files:

```
tests/
├── skill.test.ts
└── fixtures/
```

## Quality Gates

Define in SKILL.yaml:

```yaml
quality:
  - id: "gate-id"
    type: "behavioral"
    description: "What to check"
    severity: "error"
```

## Anti-Rationalization

Common excuses and rebuttals:

| Excuse | Reality |
|--------|---------|
| [Common excuse] | [Rebuttal] |

## Progressive Disclosure

Load references only when needed:

- Core instructions in SKILL.md
- Detailed guides in references/
- Examples in references/

## Naming Conventions

- Use kebab-case for file names
- Use @scope prefix for package names
- Use semantic versioning
