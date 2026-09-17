# Writing-Skills Eval: New Skill Draft

## Scenario

Draft a new skill for database query review: name it, define one capability
with input/output, declare quality gates, and declare one reference file.

## Requirements

- The draft must declare quality gates (at least one error-severity gate)
- It must include an anti-rationalization table
- Every declared reference must be named in the body with a load condition

## Expected Behavior

1. Valid `SKILL.yaml` shape (name, version, description, provides)
2. At least one `error` gate that is taught in the body
3. Anti-rationalization table with the top excuses for skipping reviews
4. Reference declared in YAML and pointed to from the body

## Quality Gates

- **has-quality-gates**: Skill has quality gates
- **has-anti-rationalization**: Skill has anti-rationalization
- **has-references**: Skill has references
