# Bad vs. Good Handoff — Same Work, Two Write-Ups

Scenario: you've spent a session migrating a service's auth from session
cookies to JWTs. You're handing off mid-migration.

## Bad Handoff

> Worked on the JWT migration today. Got most of it done, just need to
> finish up the refresh token stuff. Login and signup work. Check
> `auth.service.ts` for what I changed. Should be pretty close to done.

Run the cold-start test on this: cover it, then ask "could I do the next
step right now with zero extra questions?" No — it fails on every axis:

- **No current state**: "most of it done" isn't verifiable. Does login
  actually work in production config, or only against the local mock?
- **No blockers named**: "just need to finish up the refresh token stuff"
  hides whatever is actually stuck — is it a design question, a missing
  library, a failing test?
- **No decisions recorded**: why JWTs over the existing session store? Any
  rejected alternatives (e.g. keeping sessions, adding a JWT layer only
  for the mobile client)? The next person can't tell if a design choice
  was deliberate or provisional.
- **No next step, just a vibe**: "should be pretty close to done" is not
  an action. What's literally the next line of code or decision?
- **Reference that doesn't resolve for the reader**: "check `auth.service.ts`"
  assumes they know which of the ~40 changed lines matter.

## Good Handoff

```markdown
# Handoff: JWT Auth Migration

## Current State
- Login and signup issue JWTs correctly (verified against staging config,
  not just local mocks) — see auth.service.ts:112-140.
- Refresh token rotation is NOT implemented yet. Old session-based refresh
  endpoint (auth.controller.ts:88) still exists and is still called by the
  frontend — this is the live path in production right now.

## Key Decisions
- Chose JWTs over extending the session store because the mobile client
  needs stateless auth for offline retry (see thread in #eng-auth,
  2026-09-14). Rejected: dual-mode auth (sessions for web, JWT for
  mobile) — doubles the auth surface for marginal benefit.

## Blocked Items
- Refresh token rotation is blocked on a decision: should revoked refresh
  tokens be checked against a deny-list (Redis, adds infra) or rely on
  short expiry only (simpler, but a stolen token stays valid up to 15
  min)? Need a call before implementing — leaning deny-list, not decided.

## Next Steps
1. Get the deny-list-vs-short-expiry decision from @security-lead.
2. Implement refresh rotation in auth.service.ts (stub already at line 210).
3. Cut the frontend over from the old session refresh endpoint — DO NOT
   remove auth.controller.ts:88 until step 3 is confirmed working, it's
   still the live path.

## Context for Next Person
- Local dev auth still uses the old session cookies by default (feature
  flag `USE_JWT_AUTH=false` in .env.local) — flip it to test the new path.

## References
- auth.service.ts (JWT issuance + stubbed refresh)
- auth.controller.ts:88 (old refresh endpoint — still live, don't delete)
- #eng-auth Slack thread, 2026-09-14 (JWT vs. dual-mode decision)

## Questions to Answer
- Deny-list or short-expiry-only for refresh token revocation?
```

The difference isn't length for its own sake — every added sentence answers
a question the cold-start test would have caught: what's actually true
right now, why the design is what it is, what's blocking progress, and
what to do first.
