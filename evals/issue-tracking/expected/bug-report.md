# Issue Tracking golden: bug-report

Title: Login redirect lands on 404 after password reset (staging)

Description: After completing password reset and logging in with the new
password, the redirect goes to `/dashboard` which 404s in staging; expected
is the dashboard or home. Repro: 1) reset password via email link, 2) log in,
3) observe 404.

Acceptance criteria:
- Given a reset password, When logging in, Then the user lands on the dashboard (200)
- Given an expired reset token, When logging in, Then a clear error is shown (not 404)
- No regression: normal login still lands on dashboard

Labels: priority high, type bug, status todo
Links: `auth/login.ts:42`, issue #47

Gates demonstrated: **has-description**, **has-acceptance-criteria**, **has-labels**.
