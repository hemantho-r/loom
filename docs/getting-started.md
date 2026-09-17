# Getting Started with Loom

## Installation

```bash
# Install globally
npm install -g @loom/cli

# Or use npx
npx @loom/cli --help
```

## Quick Start

### 1. Install a Skill

```bash
loom install @loom/tdd
```

### 2. Use the Skill

Once installed, the skill is available in your project. The skill adapts to your project's context (language, framework, test runner).

### 3. Compose Skills

```bash
loom compose @loom/tdd @loom/review
```

This creates a combined workflow that applies both skills.

## Creating Your First Skill

### 1. Initialize

```bash
loom init my-skill --category engineering
```

This creates:
- `skills/engineering/my-skill/SKILL.yaml` - Skill definition
- `skills/engineering/my-skill/SKILL.md` - Skill instructions
- `skills/engineering/my-skill/references/` - Supporting docs
- `skills/engineering/my-skill/tests/` - Test files

### 2. Edit SKILL.yaml

```yaml
name: "@loom/my-skill"
version: "1.0.0"
description: "What my skill does"
license: "MIT"

provides:
  - id: "my-capability"
    description: "What this capability does"
    input:
      - name: "target"
        type: "string"
        required: true
    output:
      - name: "result"
        type: "object"

context:
  - type: "language"
    values: ["typescript", "javascript"]
    required: true

quality:
  - id: "has-overview"
    type: "content"
    description: "Skill has overview section"
    severity: "warning"
```

### 3. Write SKILL.md

```markdown
# My Skill

## Overview

What this skill does and when to use it.

## When to Use

- Condition 1
- Condition 2

## Workflow

### Step 1: Do this

[Instructions]

## Quality Gates

- **has-overview**: Skill has overview section
```

### 4. Validate

```bash
loom validate my-skill
```

### 5. Test

```bash
loom test my-skill
```

## CLI Commands

| Command | Description |
|---------|-------------|
| `loom install <package>` | Install a skill package |
| `loom list` | List installed skills |
| `loom compose <skills...>` | Compose skills into a workflow |
| `loom test [skill]` | Run skill tests |
| `loom validate [skill]` | Validate skill definitions |
| `loom init <name>` | Initialize a new skill |
| `loom search <query>` | Search for skills |
| `loom publish` | Publish to registry |

## Next Steps

- Read the [Skill Authoring Guide](./skill-authoring.md)
- Learn about [Composition](./composition.md)
- Understand [Context Management](./context-management.md)
- Explore [Quality Gates](./quality-gates.md)
