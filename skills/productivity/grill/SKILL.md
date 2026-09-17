# Grill

## Overview

A Socratic interview that forces clarity *before* building. The agent asks
short, open questions — one at a time — until the problem, constraints, and
success criteria are explicit enough to write a brief the user confirms. This
skill is **user-invoked only** (`invocation: user`): it never auto-fires, the
user explicitly asks to be grilled.

Distinct from [brainstorming](../brainstorming) (divergent ideation) and
[implementation](../../engineering/implementation) (executing a spec): grilling
produces the shared understanding those skills consume.

## When to Use

- User says "grill me on X", "interview me about X", "help me think through X"
- A spec is vague and building now would mean guessing
- An ADR needs its context/alternatives filled in honestly
- A plan keeps slipping because success was never defined

## Workflow

### Step 1: Frame the Topic

State back what you heard in one sentence and ask for correction:
"So the topic is ___. Right, or what am I missing?" Do not proceed on an
uncorrected frame.

### Step 2: Frontier-Based Interviewing (Design-Tree Model)

Rules (see `references/grill-techniques.md`):

- **Frontier Batching:** Maintain a mental design-tree of the problem. Identify the "frontier of unknowns" (unblocked branches of constraints, target users, and trade-offs). Batch all unblocked questions for the current frontier into a single clear interview round rather than slow single-question trickles. Recompute the frontier from the user's answers and repeat until the frontier shrinks to zero.
- **Open & Unbiased:** Keep questions open and non-leading: "What breaks if this ships late?" not "This isn't urgent, right?"
- **Follow the Frontier:** Probe the answer given to resolve branch dependencies before moving to unrelated leaves.
- **Coverage Areas:** Cover problem statement, affected users, technical constraints, explicit non-goals, and success metrics.

### Step 3: Challenge One Assumption

Name one load-bearing assumption out loud and test it:
"You seem to assume ___. What if the opposite were true?" Only one per
interview unless the user invites more — this is a stress test, not an
interrogation.

### Step 4: Write the Brief

Produce a short brief and ask for explicit confirmation:

```markdown
## Brief: [Topic]
- Problem:
- Who is affected:
- Constraints:
- Success criteria:
- Non-goals:
- Open assumptions:
```

### Step 5: Hand Off

Point at the next skill: confirmed brief → `planning` (break down),
`adr` (record a decision), or `implementation` (build). Never start building
inside the grill.

## Quality Gates

- **no-leading-questions**: Questions must be open, one at a time — never stacked or leading
- **written-brief**: Must end with a written brief the user confirms
- **assumptions-flagged**: Every unresolved assumption must be flagged, never silently resolved

## Anti-Rationalization

| Excuse | Reality |
|--------|---------|
| "I already know what they want" | Then the brief will take 2 minutes. Write it. |
| "Asking questions is slow" | Building the wrong thing is slower. |
| "I'll fold the questions into the build" | Questions asked mid-build get answered by the code, not the user. |

## References

- [grill-techniques.md](references/grill-techniques.md) — question bank, follow-up ladder, stop rules

## Self-Critique Scoring

After the interview, score yourself (1-5):

| Axis | Question | Score |
|------|----------|-------|
| **Framing** | Did I state the topic back and get correction first? | 1-5 |
| **One question** | Was every message exactly one open, non-leading question? | 1-5 |
| **Coverage** | Did I cover problem, users, constraints, success, non-goals? | 1-5 |
| **Challenge** | Did I test one load-bearing assumption out loud? | 1-5 |
| **Brief** | Did the user explicitly confirm the written brief? | 1-5 |
| **Handoff** | Did I point at the next skill instead of starting to build? | 1-5 |

**Minimum passing score:** 30/30
