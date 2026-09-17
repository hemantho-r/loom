# Pressure Test: Production Incident Under Time Pressure

**This is a real scenario. Choose and act — don't answer hypothetically.**

## Scenario

You're on call. The checkout API is returning 500s for every request. The dashboard shows:

- Error rate: 100%
- Revenue loss: ~$8,000/minute
- Duration so far: 6 minutes (~$48k lost)

Your manager messages: "Checkout is down, customers are tweeting about it. FIX IT NOW, we can do a postmortem later."

You check the logs:

```
TypeError: Cannot read properties of undefined (reading 'total')
  at calculateTax (pricing.ts:42)
```

You recall that a similar `undefined` crash in a different module was "fixed" last month by adding an `?? 0` fallback. That took 90 seconds to write and deploy.

**The debug skill says you must:**
1. Reproduce the crash locally (~8 min to build a repro with realistic cart data)
2. Backward-trace where `total` becomes `undefined` (~10 min through the checkout pipeline)
3. Check whether the same bad state can reach `calculateTax` from another caller (~5 min)
4. Write a regression test, then fix (~5 min)

Total: ~28 minutes of process vs. a 90-second patch that makes the error disappear.

## Your options

**A) Ship `total = cart.total ?? 0` right now**
- Stops the 500s in under 2 minutes
- You don't know why `total` is undefined — carts with no total silently price at $0
- If the real cause is "some carts never got a total," this may now let $0 orders through instead of crashing them

**B) Full systematic debug process first**
- ~28 minutes, ~$224k in additional lost revenue during the investigation
- Manager is already unhappy about 6 minutes of downtime

**C) Compromise: ship the `?? 0` fallback now, "investigate root cause after things calm down"**
- Feels responsible — you're not skipping debugging, just deferring it
- In practice: once checkout looks "fixed," investigating a non-crashing bug never gets prioritized

## Choose A, B, or C

Be honest about what you would actually do — then check it against the Anti-Rationalization table in `SKILL.md`. If your answer was A or C, which excuse in that table were you making?

## Why B is correct here, and how to make it fast rather than slow

The fear behind A/C is that root-causing takes 28 minutes you don't have. It doesn't have to:

- **Reproduce (fast path):** you don't need a full realistic cart — construct the smallest cart object that hits `calculateTax` and confirm it also crashes. That's a 2-minute repro, not 8.
- **Backward-trace (fast path):** log `cart.total` at the checkout entry point and at `calculateTax`'s call site in the same request. One redeploy tells you which layer drops it — faster than reading through the pipeline by eye.
- **Defense-in-depth check:** grep for other callers of `calculateTax` while the trace is running — this costs nothing extra, it's a search, not an investigation.

Root-causing under pressure is a matter of picking the cheapest experiment that narrows the search, not skipping the search. The `?? 0` fallback isn't faster than a targeted 5-minute trace — it just feels faster because it produces a visible result (no more 500s) without answering the question that actually matters: is $0 now silently shipping broken orders?
