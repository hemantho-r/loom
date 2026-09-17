# Review golden: pr-triage

- correctness (Required), signup.ts:18 — no test for invalid email; add a
  case asserting 400 for `not-an-email`.
- security (Critical), signup.ts:24 — logs raw email on failure; log a hash
  or user id instead.
- readability (Nit), signup.ts:12 — inline regex; extract `isValidEmail()`.
- architecture (Optional) — reuse the shared validator in `lib/validate`
  instead of a local regex.
- performance — no issue found.

Verdict: reject until the Critical logging finding is fixed.

Gates demonstrated: **five-axis-review**, **severity-labels**, **actionable-feedback**.
