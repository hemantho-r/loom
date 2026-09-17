# Lifecycle Phases

Each phase lists its persona, its exit criteria, and its approval gate. The
gate is asked verbatim; a "no" returns the work to the phase in parentheses.

## DEFINE (Scope Keeper)

- Consume: raw request, ticket, or `grill` brief.
- If the project has a `CONTEXT.md` (starter: `templates/CONTEXT.md`), read
  it first and use its terms — terminology drift caught here saves a
  mis-scoped plan. If terms are missing or contradictory, fix CONTEXT.md in
  the same pass.
- Produce: problem statement, success criteria, non-goals.
- Exit: all three written down and confirmed.
- Gate: "Is success falsifiable?" No → back to DEFINE.

## PLAN (Scope Keeper → Architect)

- Consume: DEFINE output plus triage class.
- Produce: task breakdown with acceptance criteria per task (`planning` skill).
- Exit: every task has an owner-phase and a test strategy.
- Gate: "Could a second engineer execute this plan without asking me questions?" No → back to PLAN. (Spikes: plan may be three bullets; the gate still applies.)

## BUILD (Builder)

- Consume: plan tasks.
- Produce: code + tests per task (`tdd` / `implementation`).
- Exit: all task tests green on a clean checkout.
- Gate: "Do the tests trace back to the plan's acceptance criteria?" No → back to BUILD.

## VERIFY (Builder → Adversarial Reviewer)

- Consume: built code.
- Produce: full suite green, security/performance spot-checks, `self_check.py` for diagrams if changed.
- Exit: evidence recorded (commands + results), not asserted.
- Gate: "Is there recorded evidence, not just 'it works'?" No → back to VERIFY.

## REVIEW (Adversarial Reviewer)

- Consume: code + evidence.
- Produce: five-axis review (`review` skill) with severity labels.
- Exit: zero unaddressed `error`/`Critical` findings; warnings logged or fixed.
- Gate: "Would I approve this for production under my own name?" No → back to BUILD.

## SHIP (Release Captain)

- Consume: reviewed code.
- Produce: versioned deploy + rollback path (`ci-cd` rollback-plan), monitoring
  deltas (`monitoring`), linked issues closed.
- Exit: deploy succeeded, rollback path tested or previously proven, ship record written.
- Gate: "If this breaks at 3am, does the on-call know exactly what to do?" No → back to SHIP prep, do not deploy.
