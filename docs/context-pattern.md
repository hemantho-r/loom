# CONTEXT.md Pattern

## Overview

CONTEXT.md is a shared domain language file inspired by Domain-Driven Design (DDD). It establishes a common vocabulary for your project.

Start from `templates/CONTEXT.md` — copy it to your project root and fill
in the bracketed sections. The `lifecycle` skill's DEFINE phase reads it
before scoping any work.

## When to Use

- Complex domains with specific terminology
- Multi-team projects
- Long-lived codebases
- Projects with domain experts

## Structure

```markdown
# Project Context

## Domain Terms

### [Term 1]
**Definition:** [What it means]
**Example:** [How to use it]
**Related:** [Related terms]

### [Term 2]
**Definition:** [What it means]
**Example:** [How to use it]
**Related:** [Related terms]

## Ubiquitous Language

| Term | Definition | Synonyms | Avoid |
|------|------------|----------|-------|
| User | [Definition] | [Synonyms] | [Don't use] |
| Order | [Definition] | [Synonyms] | [Don't use] |

## Invariants

- [Rule 1 that must always be true]
- [Rule 2 that must always be true]

## Bounded Contexts

### [Context 1]
**Scope:** [What it covers]
**Terms:** [Terms specific to this context]

### [Context 2]
**Scope:** [What it covers]
**Terms:** [Terms specific to this context]
```

## Benefits

1. **Shared vocabulary**: Everyone uses the same terms
2. **Reduced confusion**: Terms are well-defined
3. **Better communication**: Less ambiguity
4. **Easier onboarding**: New team members learn the language

## Usage in Skills

Skills can reference CONTEXT.md:

```yaml
context:
  - type: "project"
    file: "CONTEXT.md"
    required: true
```

## Anti-Rationalization

| Excuse | Reality |
|--------|---------|
| "Everyone knows what it means" | They don't. Document it. |
| "It's obvious from the code" | Code doesn't explain business rules. |
| "We don't have time" | Misunderstandings cost more time. |
