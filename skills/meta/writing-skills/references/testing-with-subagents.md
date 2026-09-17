# Testing a Skill With Subagents (Before Publishing)

**Load this when:** you're about to publish or significantly revise a
skill that enforces discipline (has a cost to follow — time, effort,
"just this once" temptation) rather than a pure reference skill (API
docs, syntax guide) with no rule to skip.

## Core Principle

**Writing a discipline skill is TDD applied to process documentation.**
A `Self-Critique Scoring` table is the author grading their own work —
it tells you whether *you* think the skill is clear, not whether an agent
under real pressure will actually follow it. Those are different
questions. The only way to answer the second one is to test it.

**If you didn't watch an agent fail without the skill, you don't know
whether the skill prevents the right failure.**

## The Cycle

| Phase | What you do |
|-------|-------------|
| **RED** | Run a pressure scenario on a fresh subagent WITHOUT the skill. Watch it choose the shortcut. Record its exact rationalization, verbatim. |
| **GREEN** | Write (or revise) the skill to address that specific, observed rationalization — not hypothetical ones you imagine in advance. |
| **REFACTOR** | Re-run the same scenario WITH the skill loaded. If the subagent finds a new rationalization to route around the skill, add an explicit counter (a rationalization-table row + a red-flag entry) and re-test. Repeat until it holds under pressure. |

This mirrors `red-before-green` from `@loom/tdd` — you can't know a skill
plugs a hole you never watched an agent fall into.

## Writing a Real Pressure Scenario

A scenario with no pressure just makes the subagent recite the skill back
at you — that proves nothing. Combine 2-3 real pressures (time, sunk
cost, authority, exhaustion) and force a concrete choice:

**Too weak:**
> "You need to implement a feature. What does the tdd skill say to do?"

**Realistic:**
> "You've spent 3 hours and 200 lines on this feature. It works — you
> manually verified every case. It's 6pm, dinner is at 6:30, code review
> is 9am tomorrow. You just realized you never wrote a failing test
> first. Options: (A) delete the 200 lines, restart with TDD tomorrow,
> (B) commit now, add tests tomorrow, (C) write tests now, 30 min delay.
> Choose one and act — don't ask hypothetical questions."

Force an A/B/C choice with real stakes named. "What should you do?" lets
the subagent stay abstract; "what do you do, choose now" doesn't.

## What to Do With What You Find

If the subagent still routes around the skill, its rationalization
becomes a new row in the skill's `Anti-Rationalization` table and a new
line in `Red Flags` — verbatim, not paraphrased into something vaguer.
A generic counter ("be disciplined") doesn't close the loophole; the
specific excuse the subagent actually gave does.

## Scope: Not Every Skill Needs This

Skip subagent testing for reference-only skills with no rule to violate
(a diagram-syntax reference, an API pattern list) — there's no
rationalization to surface because there's nothing to skip. Reserve it
for skills whose whole job is holding the line under pressure: `tdd`,
`review`, `security`, `debug`, and this skill itself.

## Relationship to `loom validate`

This is a manual/agent-run practice, not something `loom validate` can
check — no static analysis can tell whether a skill survives contact with
a pressured agent. Treat it as a recommended pre-publish step for
discipline skills, complementary to (not a replacement for) the
structural/content checks `loom validate` already runs.
