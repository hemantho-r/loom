# Brainstorming Eval: Rate Limits

## Scenario

The public API is being scraped. Brainstorm approaches to rate limiting that
protect the service without punishing legitimate power users.

## Requirements

- Generate multiple distinct ideas before judging any of them
- Challenge at least one load-bearing assumption out loud
- End with a written decision record (what, why, alternatives, trade-offs)

## Expected Behavior

1. At least 4 divergent ideas (token bucket, tiers, proof-of-work, etc.)
2. One assumption challenged (e.g. "all scrapers are hostile")
3. Converge to one recommendation with trade-offs
4. Written brief a stranger could act on

## Quality Gates

- **divergent-then-convergent**: Must diverge before converging
- **challenge-assumptions**: Must challenge assumptions
- **document-decisions**: Must document decisions
