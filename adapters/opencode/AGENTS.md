# Loom Skills

Skills woven together — A skill operating system for AI coding agents.

## Available Skills

### Engineering

- **@loom/tdd** - Test-driven development with red-green-refactor cycle
- **@loom/review** - Multi-axis code review with quality gates
- **@loom/debug** - Systematic debugging workflow
- **@loom/security** - Security review and hardening
- **@loom/performance** - Performance optimization

## Installation

```bash
loom install @loom/tdd
loom install @loom/review
```

## Usage

Skills are automatically loaded when available in the project.

### Quality Gates

Each skill defines quality gates that are enforced during execution:

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
