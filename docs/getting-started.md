# Getting Started with Loom

## Installation

```bash
npm install -g @loom-skills/loom
```

That's it — no further command. A `postinstall` script drops all 26 bundled
skills into `~/.loom/skills/` automatically. There is no CLI to learn.

## Using a Skill

Once installed, point your agent host at the skill file directly —
`~/.loom/skills/<name>/SKILL.md` — or use one of the generated per-host
adapters in this repo (`adapters/`, `commands/`, `.claude-plugin/`). See the
main [README](../README.md#get-loom-install-the-offering) for the full list
of hosts and how each one consumes the skills.

## Creating Your First Skill

### 1. Create the directory

```bash
mkdir -p skills/engineering/my-skill/references
```

### 2. Write SKILL.yaml

```yaml
name: "@loom-skills/my-skill"
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
pnpm validate
```

See [skill-authoring.md](./skill-authoring.md) for the full authoring guide,
including the Anti-Rationalization/Red Flags sections every discipline skill
should have.

## Next Steps

- Read the [Skill Authoring Guide](./skill-authoring.md)
- Understand [Context Management](./context-management.md)
- Explore [Quality Gates](./quality-gates.md)
