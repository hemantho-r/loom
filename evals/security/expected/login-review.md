# Security golden: login-review

- A03 Injection (Critical), login.ts:22 — string-concatenated SQL;
  fix: parameterized query.
- A07 Auth Failures (Required), login.ts:31 — distinct "user not found" vs
  "wrong password" messages enable enumeration; fix: single generic message.
- A01 Broken Access Control (Critical), login.ts:40 — session token in URL
  leaks via history/logs; fix: HttpOnly Secure cookie.
- Input validation: username/password length-checked and escaped at the boundary.
- Secrets scan: no hardcoded credentials found.

Gates demonstrated: **owasp-check**, **input-validation**, **secrets-scan**.
