# Quality Gates

## Overview

Quality gates are rules that skills declare to ensure quality. They can be structural (schema validation), behavioral (workflow rules), content (documentation), or performance requirements.

Gates come in two tiers — **checked** and **practice** — and the tier
matters more than the severity. A checked gate has a machine behind it; a
practice gate has a rubric and a checklist behind it. Both are real, but
only the first can block a command.

## The two tiers

| Tier | What backs it | Commands | Examples |
|------|---------------|----------|----------|
| **Checked** | Code that exits non-zero | `pnpm validate`, `pnpm check`, `self_check.py`, `grade-eval` coverage | `valid-schema`, `has-overview`, `has-references`, `complexity-budget`, slop-test error items |
| **Practice** | Rubric + self-critique + human/LLM grading | `pnpm eval:grade`, `docs/eval-grading.md` | `red-before-green`, `five-axis-review`, `divergent-then-convergent` |

Rule of thumb: if no script in this repo can fail it, it is a practice
gate — declare it, teach it in the body, grade it with the rubric, but do
not describe it as enforced. `pnpm validate` lists practice gates under
"requires manual verification" for exactly this reason.

## Types of Quality Gates

### Structural

Schema or format requirements:

```yaml
quality:
  - id: "valid-schema"
    type: "structural"
    description: "Skill definition follows schema"
    severity: "error"
```

### Behavioral

Workflow rules that must be followed:

```yaml
quality:
  - id: "red-before-green"
    type: "behavioral"
    description: "Must watch test fail before implementing"
    severity: "error"
```

### Content

Documentation quality:

```yaml
quality:
  - id: "has-overview"
    type: "content"
    description: "Skill has overview section"
    severity: "warning"
```

### Performance

Performance requirements:

```yaml
quality:
  - id: "fast-test"
    type: "performance"
    description: "Tests complete within 30 seconds"
    severity: "warning"
```

## Severity Levels

### Error

Must be satisfied before the skill validates:

```yaml
severity: "error"
```

If an error gate fails, `pnpm validate` reports the
skill as invalid and exits non-zero. This is a validation-time check, not a
runtime one — Loom has no execution engine that runs a skill and inspects
its output.

### Warning

Should be satisfied, but not blocking:

```yaml
severity: "warning"
```

If a warning gate fails, `pnpm validate` prints it but still reports the
skill as valid.

### Info

For reference only:

```yaml
severity: "info"
```

Info gates are informational and don't block or warn.

## What's Actually Automated vs. Manual

Loom's validator (`@loom-skills/core`'s `Validator.validateLoaded()`, used by both
`pnpm validate`) can only check things that are visible
in the skill package itself — the YAML definition and the SKILL.md text. It
cannot observe what an agent actually does while following a skill's
instructions. Gates fall into two buckets accordingly:

### Automatically checked

**Structural** — enforced by the base schema/format validation that always
runs, regardless of whether you declare the gate explicitly:

- **valid-schema**: Skill definition follows the JSON schema
- **valid-name**: Skill name follows the naming convention
- **valid-version**: Version is valid semver
- **has-quality-gates**: Skill defines at least one quality gate

**Content** — checked against SKILL.md's headings when declared with
`type: "content"` and a matching built-in `id`:

- **has-overview**: SKILL.md has an `## Overview` section
- **has-when-to-use**: SKILL.md has a `## When to Use` section
- **has-workflow**: SKILL.md has a `## Workflow` section

### Requires manual verification

Everything else — `type: "behavioral"` and `type: "performance"` gates
(e.g. `red-before-green`, `no-hallucination`, `progressive-disclosure`,
`fast-test`), plus any custom gate id the validator doesn't recognize —
describes runtime agent behavior that can't be statically verified from the
skill package. `pnpm validate` lists these under "requires manual
verification" rather than silently marking them as passed. Verifying them
means a human (or the agent itself, per its instructions) checking that the
behavior actually happened during a real session.

## Custom Gates

Define your own gates:

```yaml
quality:
  - id: "custom-gate"
    type: "behavioral"
    description: "Custom rule description"
    severity: "error"
```

Custom gates are always listed as requiring manual verification — there is
no `check:` function hook; nothing in Loom executes arbitrary validation
code.

## Gate Checking

Gates are checked at these points — match each gate to the strongest point
that can actually see it:

1. **`pnpm validate`** — schema, name, version, and
   content-heading checks against the skill package on disk. Behavioral
   and performance gates are surfaced as informational notes, not enforced.
2. **`pnpm check`** (`scripts/check-consistency.mjs`, CI-gated) — every
   declared reference exists and is named in the body, no undeclared files,
   every gate id taught in the body, house patterns present. This is what
   backs `has-references`-class gates.
3. **Skill-specific scripts** — `self_check.py` (diagram budgets and
   pitfalls), `extract-*.mjs` structure counts, the slop-test checklist.
4. **`pnpm eval:grade`** — coverage half is mechanical (gates mentioned,
   requirements addressed); quality half follows the rubric in
   `docs/eval-grading.md` with a human or LLM judge.

## Examples

### TDD Skill Gates

```yaml
quality:
  - id: "red-before-green"
    type: "behavioral"
    description: "Must watch test fail before implementing"
    severity: "error"
  - id: "minimal-implementation"
    type: "behavioral"
    description: "Implementation must be minimal"
    severity: "warning"
```

### Review Skill Gates

```yaml
quality:
  - id: "five-axis-review"
    type: "structural"
    description: "Review covers 5 dimensions"
    severity: "error"
  - id: "severity-labels"
    type: "behavioral"
    description: "Issues have severity labels"
    severity: "warning"
```

## Best Practices

1. **Be specific** - Clear description of what's checked
2. **Use appropriate severity** - Error for must-have, warning for should-have
3. **Keep it minimal** - Only enforce what's necessary
4. **Document exceptions** - When gates can be skipped
