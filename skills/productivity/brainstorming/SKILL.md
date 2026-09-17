# Brainstorming

## Overview

Structured brainstorming for technical problems using divergent and convergent thinking.

## When to Use

- Starting a new project
- Solving complex problems
- Evaluating architectural decisions
- Feature planning

## Workflow

### Step 1: Problem Definition

Clarify the problem:

- What are we trying to solve?
- Who is affected?
- What constraints exist?

### Step 2: Divergent Thinking

Generate many ideas without judgment:

- No bad ideas at this stage
- Build on others' ideas
- Quantity over quality
- Wild ideas welcome
- Map as you go with a mind map (`references/visual-maps.md`) once past ~10 ideas

### Step 3: Assumption Challenge

Challenge assumptions:

- Why do we think this is true?
- What if the opposite were true?
- What are we not considering?

### Step 4: Convergent Thinking

Evaluate and select ideas using the scoring rubric below — score first,
discuss second, so the loudest voice doesn't pick the winner:

| Criterion | 1 | 3 | 5 |
|-----------|---|---|---|
| Feasibility | Needs new infra / research | Fits current stack with stretch | Shippable with what exists |
| Impact | Nice-to-have | Moves one key metric | Unblocks the goal directly |
| Risk | Hard-to-reverse failure modes | Reversible with effort | Trivially reversible |
| Cost | Multi-sprint | One sprint | Days |

Drop anything scoring under 10/20. The top scorer is the default winner —
argue against the rubric, not for a favorite.

### Step 5: Decision Documentation

Document decisions:

- What was decided
- Why it was decided
- What alternatives were considered
- What trade-offs were made

## Brainstorming Techniques

Quick reference — see `references/brainstorming-techniques.md` for the full how-to on each:

- **Brain Dump** — write everything that comes to mind, unfiltered
- **5 Whys** — ask "why" repeatedly to reach root cause
- **Mind Map** — visual web of related ideas branching from a central concept
- **SCAMPER** — Substitute, Combine, Adapt, Modify, Put to other use, Eliminate, Reverse
- **Six Thinking Hats** — examine the problem from six distinct perspectives (facts, feelings, caution, optimism, creativity, process)

## Worked Mini-Example

Topic: "API scraping is overloading the service."

- Diverge (6 ideas): per-key token buckets; tiered quotas; proof-of-work on
  abuse signals; anomaly throttling; longer CDN TTLs; require API keys on
  public endpoints.
- Challenge: "All scrapers are hostile" — false, several are legitimate
  integrations; blanket bans would churn paying users.
- Converge: tiered quotas (4/5/3/4 = 16) beats IP bans (3/2/1/3 = 9).
- Brief: decision, why, rejected options, trade-off (Redis dependency).

## References

- `references/brainstorming-techniques.md` — step-by-step instructions for each technique above
- `references/visual-maps.md` — mind-map and affinity-map Mermaid templates for Steps 2 and 4
- `assets/affinity-board.html` — offline click-to-sort board (no network, no dependencies) for live sorting sessions

## Quality Gates

- **divergent-then-convergent**: Must diverge before converging
- **challenge-assumptions**: Must challenge assumptions
- **document-decisions**: Must document decisions

## Self-Critique Scoring

Before closing the session, score yourself (1-5):

| Axis | Question | Score |
|------|----------|-------|
| **Divergence** | Are there 4+ distinct ideas generated without judgment? | 1-5 |
| **Challenge** | Was at least one load-bearing assumption tested out loud? | 1-5 |
| **Convergence** | Was the winner chosen on feasibility/impact/risk, not vibes? | 1-5 |
| **Record** | Could a stranger execute the decision from the written brief? | 1-5 |
| **Alternatives** | Are rejected options recorded with reasons? | 1-5 |
| **Trade-offs** | Are costs named alongside benefits? | 1-5 |

**Minimum passing score:** 30/30

## Anti-Rationalization

| Excuse | Reality |
|--------|---------|
| "We already know the answer" | Then the brief writes itself in 5 minutes. Write it. If it takes longer, you didn't know the answer. |
| "Wild ideas waste time" | One wild idea that survives contact with constraints pays for the session. Cutting them early is how good options get missed. |
| "Documenting kills momentum" | Undocumented decisions get re-litigated forever — the 10 minutes now saves the 2-hour re-argument in 3 months. |
| "I already have a good idea" | A good idea found in 30 seconds hasn't been tested against alternatives. Diverge anyway — it either survives comparison or you find something better. |
| "Brainstorming takes too long" | Skipping Step 2 doesn't remove the divergence work — it moves it downstream, after code is written and switching costs are higher. |
| "This obviously won't work, skip it" | Judging during divergence is convergent thinking wearing a disguise. Write it down; kill it in Step 4 if it deserves it. |
| "The team already agrees, no need to challenge assumptions" | Consensus is a symptom of untested assumptions, not proof they're correct. Agreement isn't evidence. |
| "One more idea won't change the outcome" | The idea that flips the ranking is never the one you expected to matter — that's why you generate more than the obvious three. |
| "We can pick the favorite and score it after, to save time" | Scoring after picking is rationalizing a decision already made. Score first, argue against the rubric, not for a favorite. |

## Red Flags — STOP and Reconsider

- You're evaluating an idea ("that won't work because...") before Step 4 — you've collapsed into convergent thinking mid-divergence.
- The first idea generated is also the one everyone converges on — check whether anchoring happened, not genuine comparison.
- Nobody in the room can articulate what assumption Step 3 tested — the challenge step was skipped, not just brief.
- The written decision brief doesn't name a rejected alternative — if nothing was rejected, nothing was actually compared.
- Someone says "we all know what we're going with" before the scoring rubric has been filled in — that's a vibe decision, not a converged one.
- The session produced fewer than 4 distinct ideas — that's not divergence, that's confirmation of the first idea with extra steps.

## Common Pitfalls

- **Converging too early** — evaluating ideas while still generating them
  kills the wild ones before they can spark better ones; keep Steps 2 and
  4 strictly separate.
- **Confusing "we discussed it" with "we documented it"** — a decision
  that only lives in someone's memory of the meeting isn't done per Step
  5; write it down with the alternatives considered.
- **Skipping assumption challenge because the answer "feels obvious"** —
  the assumptions that most need challenging are the ones nobody thought
  to question.
