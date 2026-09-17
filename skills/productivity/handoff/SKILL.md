# Handoff

## Overview

Structured context handoff between agents, sessions, or team members.

## When to Use

- Switching between agents
- Starting a new session
- Transferring work to another person
- Creating context for code review

## Workflow

### Step 1: Gather Context

Collect relevant context:

- What was done
- What was discovered
- What's pending
- What's blocked

### Step 2: Structure Handoff

Organize into sections:

- Current state
- Key decisions made
- Issues encountered
- Next steps

### Step 3: Add References

Include references:

- Relevant files
- Related issues
- External docs

### Step 4: Validate

Run the cold-start test before sending:

1. Cover the "Next Steps" and read only the handoff (not your memory).
2. Ask: could I do step 1 right now with zero extra questions?
3. If no, the handoff fails — add whatever you reached for (a file path, a
   credential location, a decision reason) and repeat.

Ensure the handoff is:

- Complete
- Clear
- Actionable

### Step 5: Pick the Tier

- **Quick handoff** (the condensed variant in `references/handoff-template.md`):
  low-stakes transfers only — nothing blocked, no open decisions, next steps
  under a day. Done/Next/Blocked/Context, four lines.
- **Standard handoff**: everything else. If you're unsure which tier, it's
  Standard — the cost of an over-thorough handoff is minutes, the cost of an
  under-thorough one is a lost day.

## Handoff Template

Skeleton — see `references/handoff-template.md` for the full "Standard
Handoff" template (with Blocked Items, Context for Next Person, and
Questions to Answer sections) plus a condensed "Quick Handoff" variant for
low-stakes transfers:

```markdown
# Handoff: [Project/Feature]

## Current State
## Key Decisions
## Issues Encountered
## Pending Work
## Blocked Items
## Next Steps
## Context for Next Person
## References
## Questions to Answer
```

## References

- `references/handoff-template.md` — full "Standard Handoff" and "Quick Handoff" templates
- `references/bad-vs-good-example.md` — the same piece of work handed off badly and well, side by side

## Quality Gates

- **completeness**: Handoff includes all necessary context
- **clarity**: Handoff is clear and unambiguous
- **actionable**: Handoff includes next steps

## Self-Critique Scoring

Before sending the handoff, score yourself (1-5):

| Axis | Question | Score |
|------|----------|-------|
| **State** | Does "current state" match reality, not optimism? | 1-5 |
| **Decisions** | Is every key decision recorded with its why? | 1-5 |
| **Blocked** | Are blocked items named with their blocker? | 1-5 |
| **Next steps** | Are next steps sequenced, not a flat pile? | 1-5 |
| **References** | Do all file/issue/doc pointers resolve? | 1-5 |
| **Cold start** | Could a stranger begin work without asking me anything? | 1-5 |

**Minimum passing score:** 30/30

## Anti-Rationalization

| Excuse | Reality |
|--------|---------|
| "It's all in my head, just ask me" | You won't be there at 3am when they need it, or you'll be on three other things by then and won't remember either. |
| "The code speaks for itself" | Code doesn't record decisions, blockers, or next steps — it shows what happened, not why, or what's left. |
| "Quick handoff is fine for this" | Quick handoffs are for low-stakes transfers — confirm the stakes first, not after the next person gets stuck. |
| "They can just ask me if something's unclear" | That's a support ticket disguised as a handoff. If they need to ask, the handoff failed the cold-start test. |
| "I'll just paste the chat log / commit history" | A log is a record of the journey, not the destination — the reader has to re-derive the current state and decisions from raw material you already distilled once. |
| "Everything's in the PR description" | A PR description covers the change; it rarely covers what's blocked, what was tried and rejected, or what to do next. Those are handoff-specific. |
| "This is obviously the next step, no need to write it" | Obvious to you, with full context, five minutes ago. Not obvious to someone starting cold. |
| "I don't have time for the full template right now" | Then it's a Quick Handoff, explicitly — pick the tier, don't silently skip sections from the Standard one. |

## Red Flags — STOP and Reconsider

- You're writing "Current State" from memory of what you intended to do, not what you verified is actually true right now.
- A blocked item is described without naming what it's blocked by, or who/what can unblock it.
- "Next Steps" is a flat bullet list with no first action — the reader has to guess what to do first.
- You skipped the cold-start test (Step 4) because you were confident the handoff was already clear.
- A file path, ticket ID, or credential location is mentioned by name in your head but not written into "References."
- The handoff describes what you did in the past tense but never states what state the system/code is in right now.

## Common Pitfalls

- **Writing the handoff from memory right before leaving** — details decay
  fast; capture "what was discovered" incrementally during the work, not
  as a reconstruction exercise at the end.
- **Omitting blocked items because they're someone else's problem now** —
  the next person needs to know what's blocked and by what, or they'll
  waste time rediscovering it.
- **Next steps without priority or sequencing** — a flat list of "things
  to do" forces the reader to re-derive what you already knew: what to do
  first.
