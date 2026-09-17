# Debug golden: flaky-test

Reproduction: `checkout.test.ts` with payment mock unresolved races the
confirmation poll; fails ~1 in 5 runs under CI throttling.

Root cause: missing `await` on `mockPayment.authorize()` in
`checkout.test.ts:41` — the test proceeds before authorization settles.

Fix: await the mock; no production change needed.

Regression test: `checkout.test.ts` — "fails if authorize is not awaited"
(asserts confirmation only renders after the authorize promise resolves).

Gates demonstrated: **reproduce-first**, **minimal-fix**, **add-regression-test**.
