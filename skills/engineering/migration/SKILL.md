# Migration

## Overview

Safe, incremental migration of code, data, or dependencies.

## When to Use

- Upgrading dependencies
- Migrating APIs
- Moving data between systems
- Changing frameworks

## Workflow

### Step 1: Assessment

Assess migration scope:

- What needs to change?
- What are the dependencies?
- What are the risks?

### Step 2: Planning

Create migration plan:

- Break into small steps
- Define rollback points
- Set up monitoring

### Step 3: Backup

Before migrating:

- Backup data
- Tag current version
- Document current state

### Step 4: Incremental Migration

Migrate in small steps:

- One change at a time
- Test after each step
- Commit after each success

### Step 5: Verification

Verify migration worked:

- All tests pass
- No regressions
- Performance acceptable

### Step 6: Cleanup

After migration:

- Remove old code
- Update documentation
- Close migration issues

## Migration Strategies

### Strangler Fig

Gradually replace old with new:

```
Old System → [New Feature 1] → [New Feature 2] → New System
```

### Branch by Abstraction

Introduce abstraction layer:

```
Code → Abstraction → Old Implementation
                  → New Implementation
```

### Parallel Run

Run both old and new:

```
Request → Old System → Response
       → New System → Response (compared)
```

## Anti-Rationalization

| Excuse | Reality |
|--------|---------|
| "We'll do it all at once" | Big-bang migrations fail atomically — when something breaks, you're debugging the whole system at once with no known-good intermediate state to fall back to. |
| "It's just a version bump" | Version bumps carry breaking changes in changelogs nobody reads until production breaks. Read the changelog, run the test suite, then call it "just." |
| "We don't need a plan" | The plan is what tells you where the rollback point is *before* you need one, not while production is down. |
| "We don't need a backup, we have version control" | Version control backs up code, not data. A migration that corrupts a database has nothing to `git revert`. |
| "Rollback won't be needed, this migration is simple" | Simple migrations fail too — a schema change on a table larger than expected, a data assumption that was wrong. Untested rollback plans are theoretical. |
| "We tested it in staging, it'll work in prod" | Staging rarely has production's data volume, concurrency, or edge-case data. Test the rollback in staging too, not just the forward path. |
| "Monitoring after the fact is enough" | By the time a dashboard shows the problem, users have already hit it. Set up monitoring *before* migrating, not as an afterthought. |
| "We can clean up the old code next sprint" | Old code and new code coexisting past the migration window means every future change has to consider both — "next sprint" cleanup is legacy debt from day one. |
| "This step is small enough to skip testing" | Small steps are exactly what makes incremental migration safe — skip testing one and you've reintroduced big-bang risk into one step. |

## Red Flags — STOP and Reconsider

- You're about to migrate without a tested rollback path
- The migration plan has one step, not several
- You haven't backed up data that the migration could corrupt
- You're migrating in production before verifying in staging with production-like data volume
- "We'll monitor it after" is the entire monitoring plan
- A rollback exists on paper but has never actually been executed once
- You're tempted to combine the migration with an unrelated feature change

## Worked Example: Incremental Migration With a Rollback Point

**Task:** migrate a `users.legacy_role` string column to a new `user_roles`
join table, without downtime.

1. **Add, don't replace** — create `user_roles` alongside the existing
   `legacy_role` column. Both exist; nothing reads the new table yet.
   *Rollback point: drop the new table, zero impact — nothing depends on it.*
2. **Backfill** — populate `user_roles` from `legacy_role` in batches, with
   a checksum comparing row counts after each batch.
   *Rollback point: truncate and re-run the backfill; `legacy_role` is
   still the source of truth, unaffected.*
3. **Dual-write** — application writes to both `legacy_role` and
   `user_roles` on every role change; reads still come from `legacy_role`.
   *Rollback point: revert the dual-write deploy; `legacy_role` was never
   stopped being updated, so no data loss.*
4. **Cut over reads** — switch reads to `user_roles`, keep dual-write
   running for one release cycle as a safety net.
   *Rollback point: flip the read flag back to `legacy_role` — it's still
   current because dual-write never stopped.*
5. **Remove the old column** — only after step 4 has run in production
   with no incidents for the agreed observation window.
   *No rollback point past this step — this is why it's last and why the
   observation window exists.*

Each step is independently safe to stop at. Compare this to a single
migration that renames the column and updates all call sites in one
deploy — one bug anywhere in that diff, and there is no partial state to
fall back to.

## Quality Gates

- **backup**: Backup before migrating
- **incremental**: Migrate incrementally
- **rollback-plan**: Have rollback plan

## Self-Critique Scoring

Before calling the migration done, score yourself (1-5):

| Axis | Question | Score |
|------|----------|-------|
| **Backup** | Can I restore the pre-migration state right now? | 1-5 |
| **Increment** | Was each step independently testable and committed? | 1-5 |
| **Rollback** | Is the rollback path concrete and proven, not "figure it out"? | 1-5 |
| **Verification** | Did tests run green after *each* step, not just at the end? | 1-5 |
| **Cleanup** | Is old code removed and docs updated? | 1-5 |
| **Strategy fit** | Does the chosen strategy (strangler/abstraction/parallel) match the risk? | 1-5 |

**Minimum passing score:** 30/30

## References

- [migration-strategies.md](references/migration-strategies.md) — strangler fig, branch by abstraction, parallel run, data migration
