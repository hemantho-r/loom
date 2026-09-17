# Estimation

## Relative Sizing vs. Time-Based Estimates

**Relative sizing** (story points, T-shirt sizes) asks "how big is this
compared to that other task we already agreed on?" instead of "how many
hours will this take?" It's more reliable because:

- Humans are bad at absolute time estimates but decent at comparisons.
- It survives interruptions and context-switching without needing rework.
- It doesn't imply false precision ("3.5 days" reads as more certain than
  it usually is).

**Time-based estimates** are still useful for short-horizon commitments
(this sprint, this week) where stakeholders need a date. Use relative
sizing for backlog grooming and roadmap-level planning; convert to a time
estimate only for the next 1-2 sprints of committed work, and always pair
the time estimate with a confidence level (see below).

## Planning Poker

For team estimation, use planning poker to surface disagreement instead of
anchoring on the first number said aloud:

1. Everyone privately picks a size (Fibonacci-like scale: 1, 2, 3, 5, 8,
   13, 20, ?) for the task being discussed.
2. Reveal simultaneously.
3. If estimates converge (adjacent values), take the higher one and move
   on — don't over-discuss small gaps.
4. If estimates diverge widely (e.g. 2 vs 13), the outliers explain their
   reasoning — this usually surfaces a hidden assumption ("I assumed we'd
   need a migration" / "I didn't think this touched the database") rather
   than a genuine sizing disagreement. Re-vote after discussion.

A "?" vote means "I don't have enough information to estimate this" — that
is itself useful signal that the task needs to be broken down further or
researched before it can be scheduled.

## Breaking Down Large Tasks to Reduce Estimation Error

Estimation error grows roughly with task size, not linearly — a task
estimated at "3 weeks" has much higher variance than three tasks each
estimated at "1 week." When a task is larger than ~2-3 days:

1. Decompose it along natural seams (see `planning/SKILL.md` Step 2) until
   each piece is independently estimable and testable.
2. Estimate each piece separately, then sum — the sum of small estimates
   is almost always more accurate than one estimate for the whole, because
   averaging errors across pieces cancels out some of the variance.
3. If you can't decompose a task because you don't understand it well
   enough yet, that's a sign the task needs a research/spike step before
   it can be estimated at all — estimate the spike, not the unknown work.

## Handling Uncertainty Explicitly

Don't let a single number hide how confident you actually are. Pair every
time-based estimate with a confidence level:

- **High confidence**: done this exact thing before, few unknowns. Narrow
  range (e.g. "2-3 days").
- **Medium confidence**: familiar territory, some unknowns (new library,
  unclear edge cases). Wider range (e.g. "3-6 days").
- **Low confidence**: genuinely new territory, external dependencies, or
  the task touches code nobody currently understands well. State it as a
  range with a wide spread (e.g. "1-3 weeks") or flag it as needing a
  spike/research task first rather than guessing.

When an estimate turns out to be wrong, the useful question isn't "why did
we miss it" in a blame sense — it's "which category of unknown did we miss
(scope, technical, external dependency)" so the next estimate in that
category gets appropriately wider.
