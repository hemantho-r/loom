# Handoff golden: session-transfer

## Current State

Google OAuth works end to end (login → callback → session); GitHub not started.

## Key Decisions

- Google first because 80% of users have Google accounts (stated, not assumed).

## Blocked

- Blocker: GitHub client secret — owner: platform team, expected Thursday;
  it unblocks GitHub wiring once received, so nothing else can start before it.

## Next Steps

1. Collect secret, verify locally.
2. Wire GitHub provider mirroring the Google flow.
3. Resolve open question: auto-link accounts sharing an email? (see issue #48).

## References

- `auth/oauth.ts`, issue #48, `docs/auth-plan.md`.

Gates demonstrated: **completeness**, **clarity**, **actionable**.
