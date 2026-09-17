# Skill Authoring Guide

## Overview

This guide explains how to create high-quality skills for the Loom system.

## Anatomy of a Skill

A skill consists of:

1. **SKILL.yaml** - Machine-readable definition
2. **SKILL.md** - Human-readable instructions
3. **references/** - Supporting documentation
4. **tests/** - Test files

## SKILL.yaml Structure

```yaml
# Required fields
name: "@scope/skill-name"
version: "1.0.0"
description: "What the skill does"
provides:
  - id: "capability-id"
    description: "What this capability does"

# Optional fields
license: "MIT"
authors:
  - name: "Your Name"
    email: "you@example.com"
requires:
  - id: "dependency-id"
    capabilities: ["required-capability"]
context:
  - type: "language"
    values: ["typescript", "javascript"]
    required: true
quality:
  - id: "gate-id"
    type: "behavioral"
    description: "What this gate checks"
    severity: "error"
references:
  - path: "./references/guide.md"
    when: "during-workflow"
tags: ["tag1", "tag2"]
category: "engineering"
difficulty: "intermediate"
```

## Capability Declarations

Capabilities define what your skill provides:

```yaml
provides:
  - id: "my-capability"
    description: "What this capability does"
    input:
      - name: "target"
        type: "string"
        description: "What to operate on"
        required: true
      - name: "options"
        type: "object"
        description: "Optional configuration"
        required: false
    output:
      - name: "result"
        type: "object"
        description: "The result"
```

### Parameter Types

| Type | Description |
|------|-------------|
| `string` | Text value |
| `number` | Numeric value |
| `boolean` | True/false |
| `file` | File path |
| `file[]` | Array of file paths |
| `object` | JSON object |
| `array` | JSON array |
| `enum` | One of predefined values |

## Context Requirements

Context requirements tell Loom what environment your skill needs:

```yaml
context:
  - type: "language"
    values: ["typescript", "javascript"]
    required: true
  - type: "framework"
    values: ["react", "vue"]
    required: false
  - type: "test-runner"
    values: ["jest", "vitest"]
    required: false
```

## Quality Gates

Quality gates enforce behavioral rules:

```yaml
quality:
  - id: "must-do-x"
    type: "behavioral"
    description: "Must do X before proceeding"
    severity: "error"
  - id: "should-do-y"
    type: "structural"
    description: "Should do Y for quality"
    severity: "warning"
```

### Gate Types

| Type | Description |
|------|-------------|
| `structural` | Schema or format requirements |
| `behavioral` | Workflow rules that must be followed |
| `content` | Documentation quality |
| `performance` | Performance requirements |

### Severities

| Severity | Description |
|----------|-------------|
| `error` | Must be satisfied |
| `warning` | Should be satisfied |
| `info` | For reference only |

## SKILL.md Guidelines

### Structure

```markdown
# Skill Name

## Overview

Brief description of what the skill does.

## When to Use

- Trigger condition 1
- Trigger condition 2

## Workflow

### Step 1: Name

Instructions for this step.

### Step 2: Name

Instructions for this step.

## Quality Gates

- **gate-id**: Description of the gate
```

### Best Practices

1. **Be specific** - Actionable steps, not vague advice
2. **Be verifiable** - Clear exit criteria
3. **Be minimal** - Only what's needed
4. **Be honest** - Don't invent facts

## References

References are supporting documents loaded on demand:

```yaml
references:
  - path: "./references/guide.md"
    when: "during-workflow"
  - path: "./references/advanced.md"
    when: "for-advanced-cases"
```

## Testing

Every skill should have tests:

```typescript
import { describe, it, expect } from 'vitest';

describe('my-skill', () => {
  it('should load successfully', async () => {
    // Test that the skill loads correctly
  });

  it('should follow quality gates', async () => {
    // Test that quality gates are enforced
  });
});
```

## Publishing

1. Validate your skill: `loom validate`
2. Test your skill: `loom test`
3. Publish: `loom publish`
