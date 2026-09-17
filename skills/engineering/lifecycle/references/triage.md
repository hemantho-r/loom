# Triage: Spike / Bounded / Architectural

Classify once, up front. The class sets ceremony — it never excuses skipping
gates.

## Spike (learn, then throw away or promote)

- Signals: unknown feasibility, "can we even…?", no production impact yet.
- Ceremony: PLAN may be three bullets; REVIEW is one reader; SHIP means
  "learnings recorded", never a production deploy.
- Promote to Bounded the moment spike code is proposed for production.

## Bounded (one area, known shape)

- Signals: touches one service/module, interfaces stable, rollback is a redeploy.
- Ceremony: full six phases, single reviewer, ADR optional.
- This is the default — do not reach for Architectural to sound important.

## Architectural (cross-cutting or hard to reverse)

- Signals: changes a public API, data shape, auth model, or more than two services; rollback needs a plan, not just a redeploy.
- Ceremony: ADR required (`adr` skill), two reviewers, explicit rollout + rollback rehearsal in SHIP.
- Examples: framework migration, auth overhaul, schema redesign.

## Classifier (ask in order, first match wins)

1. "Will this be hard to reverse after Friday?" Yes → Architectural.
2. "Is the main unknown whether it's *possible*?" Yes → Spike.
3. Otherwise → Bounded. Write one line justifying the call.
