# Lifecycle

## Overview

The delivery orchestrator. A unit of work moves through six phases —
DEFINE → PLAN → BUILD → VERIFY → REVIEW → SHIP — with a triage decision up
front, an approval gate at the end of every phase, and a specialist persona
wearing the hat for each phase. Individual skills (`grill`, `planning`,
`tdd`, `review`, `ci-cd`) do the work *inside* phases; this skill runs the
relay between them.

## When to Use

- Any feature, fix, or migration bigger than a one-line change
- Work that touches more than one skill (spec + code + tests + review)
- Anything heading for production

## Workflow

### Step 0: Triage

Read `references/triage.md` and classify the work as **Spike**, **Bounded**,
or **Architectural** *before* planning. The class sets the ceremony level:
Spikes skip PLAN review, Architectural work requires an ADR plus a second
reviewer. Record the class — advancing without it fails `triage-first`.

### Step 1-6: Run the phases

Follow `references/phases.md`. Each phase names its persona (from
`references/personas.md`), its exit criteria, and its approval gate. The gate
rule is absolute: no advancing on a failed gate. A failed gate sends the work
back to the named earlier phase, not forward with a TODO.

### Step 7: Ship with evidence

SHIP is a record, not a feeling. Attach: test evidence (what ran, green),
review evidence (who approved, which axes), and rollout evidence (versioned
deploy target + rollback path). Missing any of the three fails
`ship-evidence`.

## Quality Gates

- **triage-first**: Must triage as Spike, Bounded, or Architectural before planning
- **approval-gates**: Must pass the approval gate at the end of each phase before advancing
- **ship-evidence**: SHIP requires linked tests, review, and rollout/rollback evidence

## Anti-Rationalization

| Excuse | Reality |
|--------|---------|
| "This is too small for the lifecycle" | Then triage it as a Spike in one line — skipping triage is how small changes cause big outages. |
| "The gate is bureaucracy, the code is obviously fine" | Gates exist for obviously-fine code; that's what review is for. |
| "We'll backfill the ship evidence" | Unshipped evidence is undeployed confidence. |

## References

- [phases.md](references/phases.md) — the six phases with exit criteria and gates
- [triage.md](references/triage.md) — Spike / Bounded / Architectural classifier
- [personas.md](references/personas.md) — the four specialist hats and when each reviews

## Self-Critique Scoring

Before declaring SHIP, score yourself (1-5):

| Axis | Question | Score |
|------|----------|-------|
| **Triage** | Was the class recorded before planning, with justification? | 1-5 |
| **Gates** | Was every phase gate asked verbatim with no skips? | 1-5 |
| **Personas** | Did the Reviewer hat reject anything, or was it a rubber stamp? | 1-5 |
| **Evidence** | Is ship evidence recorded (tests, review, rollout) — not asserted? | 1-5 |
| **Rollback** | Is the 3am rollback path concrete and proven? | 1-5 |
| **Ceremony fit** | Did the ceremony match the triage class (no Spike theater, no Bounded shortcuts on Architectural)? | 1-5 |

**Minimum passing score:** 30/30
