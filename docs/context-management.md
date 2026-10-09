# Context Management

## Overview

Loom's context system detects your project's environment and adapts skills accordingly. This means skills work correctly regardless of your language, framework, or tooling.

## What is Context?

Context is information about your project:

- **Language** - TypeScript, JavaScript, Python, Go, Rust, etc.
- **Framework** - React, Vue, Next.js, Express, FastAPI, etc.
- **Test Runner** - Jest, Vitest, Mocha, pytest, etc.
- **Package Manager** - npm, pnpm, yarn, bun
- **Project Structure** - Monorepo, single package, etc.

## How Context is Detected

Loom scans your project for:

1. **Config files** - `tsconfig.json`, `package.json`, `jest.config.ts`, etc.
2. **Dependencies** - What packages are installed
3. **File extensions** - What language files use
4. **Lock files** - Which package manager is used

## Context in Skills

Skills declare what context they need:

```yaml
context:
  - type: "language"
    values: ["typescript", "javascript"]
    required: true
  - type: "framework"
    values: ["react", "vue"]
    required: false
```

### Required vs Optional

- **required: true** - Skill won't run without this context
- **required: false** - Skill can run without, but behavior may differ

## Context-Aware Behavior

Skills can behave differently based on context:

### Example: TDD Skill

```yaml
context:
  - type: "test-runner"
    values: ["jest", "vitest"]
    required: false
```

The TDD skill adapts its test commands based on the detected test runner:
- Jest: `npm test`
- Vitest: `vitest run`
- pytest: `pytest`

### Example: Review Skill

```yaml
context:
  - type: "language"
    values: ["typescript", "javascript"]
    required: true
```

The Review skill checks language-specific issues:
- TypeScript: Type safety, proper typing
- JavaScript: Common pitfalls, async patterns

## Context in Composition

When composing skills, Loom checks context compatibility:

```yaml
# Skill A requires TypeScript
context:
  - type: "language"
    values: ["typescript"]

# Skill B requires Python
context:
  - type: "language"
    values: ["python"]
```

These skills cannot be composed together because they require different languages.
