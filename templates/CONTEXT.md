# Project Context (CONTEXT.md starter)

Copy this file to `CONTEXT.md` at your project root and fill it in. It is
the shared domain language for your project (see `docs/context-pattern.md`).
The `lifecycle` DEFINE phase reads it before scoping; `grill` uses it to
challenge terminology drift.

## Domain Terms

### [Term 1]

**Definition:** [What it means in this project — one sentence.]
**Example:** [A real usage, e.g. "A Seat is assigned to exactly one User."]
**Related:** [Other terms below.]

### [Term 2]

**Definition:** [What it means.]
**Example:** [Real usage.]
**Related:** [Other terms.]

## Ubiquitous Language

| Term | Definition | Synonyms (accept) | Avoid (do not use) |
|------|------------|-------------------|--------------------|
| User | [Definition] | [e.g. account] | [e.g. client, customer] |
| Order | [Definition] | [e.g. purchase] | [e.g. cart, transaction] |

## Invariants

- [Rule that must always be true, e.g. "An Order belongs to exactly one User."]
- [Rule 2.]

## Bounded Contexts

### [Context 1, e.g. Billing]

**Scope:** [What it covers.]
**Terms:** [Terms that mean something specific here.]

### [Context 2, e.g. Shipping]

**Scope:** [What it covers.]
**Terms:** [Terms that mean something specific here.]

## Maintenance

- Owner: [name/team]. Review date: [YYYY-MM-DD, at least quarterly].
- A term used three times with a different meaning is a signal to split or
  redefine — update this file in the same PR that introduces the new usage.
