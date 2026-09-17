# Grill golden: auth-brief

## Brief: OAuth login

- Problem: password signups abandon at 40%; SSO should recover them.
- Who is affected: new users on web; mobile later (non-goal).
- Constraints: must reuse existing session cookies; ship in 2 weeks.
- Success criteria: 15% of new signups via OAuth within 30 days.
- Non-goals: account merging, SAML, mobile SDKs.
- Open assumptions: provider set (Google-only vs. Google+GitHub) — user to confirm.

Gates demonstrated: **no-leading-questions**, **written-brief**, **assumptions-flagged**.
