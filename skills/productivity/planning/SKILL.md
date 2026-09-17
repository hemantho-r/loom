# Planning

## Overview

Break down work into properly scoped tasks with clear acceptance criteria.

## When to Use

- Starting a new feature
- Estimating work effort
- Creating sprint plans
- Defining project scope

## Workflow

### Step 1: Scope Definition

Define what's in scope:

- Goals (what we want to achieve)
- Non-goals (what we're explicitly not doing)
- Constraints (time, resources, dependencies)

### Step 2: Task Decomposition

Break work into tasks using vertical slices — each task delivers a thin,
testable increment through the stack, not a horizontal layer:

- ✅ "Guest can pay by card and get a confirmation email" (slice)
- ❌ "Build the payment schema", "Build the email template" (layers — neither is testable alone)

Decomposition patterns when stuck:

- **Spike-first**: time-boxed investigation task ("2h: can the provider do
  pre-auth?") that converts unknowns into estimates for the real tasks.
- **Walking skeleton**: first task is the smallest end-to-end path (fake
  data allowed), later tasks replace fakes with real implementations.
- **Split by rule**: business rules that differ (guest vs. member, card vs.
  invoice) become separate tasks, not branches inside one task.

Break work into tasks:

- Small enough to complete in 1-2 days
- Large enough to be meaningful
- Independent where possible
- Testable

### Step 3: Dependency Mapping

Identify dependencies:

- Blocked by (what must come first)
- Blocks (what depends on this)
- External dependencies

### Step 4: Estimation

Estimate effort:

- T-shirt sizes (S, M, L, XL)
- Story points
- Time estimates (with confidence level)

Calibrate with explicit uncertainty — an estimate without a confidence range
is a commitment wearing a guess's clothes:

- **S (hours)**: done this exact thing before.
- **M (1-2 days)**: known shape, one unknown at most.
- **L (3-5 days)**: multiple unknowns — split it, or precede it with a spike.
- **XL**: not an estimate, a project. Decompose before committing to anything.

See `references/estimation.md` for relative sizing vs. time-based
estimates, planning poker, and handling uncertainty explicitly.

### Step 5: Acceptance Criteria

Define done:

- Functional requirements
- Non-functional requirements
- Testing requirements

## Task Template

```markdown
## Task: [Name]

**Description:** What needs to be done

**Acceptance Criteria:**
- [ ] Criterion 1
- [ ] Criterion 2

**Dependencies:**
- None / [Task name]

**Estimate:** S/M/L/XL

**Notes:**
- Additional context
```

## References

- `references/estimation.md` — relative sizing, planning poker, breaking down large tasks, handling uncertainty

## Quality Gates

- **task-scope**: Tasks are properly scoped
- **dependencies**: Dependencies identified
- **acceptance-criteria**: Acceptance criteria defined

## Common Pitfalls

- **Scoping a task around a solution instead of an outcome** — "add a
  cache" isn't a task, "reduce p99 latency on X below 200ms" is; the
  solution should fall out of investigation, not be assumed upfront.
- **Skipping non-goals** — an unscoped "not doing this" list is how scope
  creep sneaks back in mid-sprint.
- **Estimating without decomposing** — a single 3-week estimate for an
  undecomposed task is a guess wearing a number's clothing; break it down
  first (see `references/estimation.md`).
- **Treating dependencies as optional detail** — an unidentified blocking
  dependency discovered mid-task is the single most common cause of missed
  deadlines; map them in Step 3 before estimating in Step 4.

## Self-Critique Scoring

Before committing the plan, score yourself (1-5):

| Axis | Question | Score |
|------|----------|-------|
| **Scope** | Is every task finishable in 1-2 days and independently testable? | 1-5 |
| **Dependencies** | Is the blocking chain explicit for every task? | 1-5 |
| **Criteria** | Does every task have falsifiable acceptance criteria? | 1-5 |
| **Non-goals** | Are non-goals written down, not just implied? | 1-5 |
| **Estimates** | Is every estimate preceded by decomposition? | 1-5 |
| **Stranger test** | Could a second engineer execute this without asking questions? | 1-5 |

**Minimum passing score:** 30/30

## Anti-Rationalization

| Excuse | Reality |
|--------|---------|
| "Planning is overhead, let's just start" | Starting without a plan is how 2-day tasks become 2-week tasks — the planning cost doesn't disappear, it moves to mid-flight and gets paid with interest. |
| "Estimates are always wrong anyway" | Decomposed estimates are wrong within bounds; guesses are wrong without them, and you can't tell which kind you're looking at without decomposing first. |
| "We'll handle dependencies when we hit them" | Hitting a dependency mid-task is the most expensive time to discover it — everything downstream is already scheduled around a false assumption. |
| "We'll figure out timing as we go" | "As we go" means the first stakeholder question about timeline gets an answer invented on the spot, not one grounded in decomposition. |
| "This is basically the same as last time, reuse that estimate" | "Basically the same" is where the one differing unknown hides — confirm the shape actually matches before reusing the number. |
| "The non-goals are obvious, no need to write them down" | Obvious non-goals are exactly what quietly creeps back into scope mid-sprint when nobody wrote down that it was excluded. |
| "Let's add just this one more thing while we're planning" | Scope creep during planning is still scope creep — if it wasn't in the original goals, it needs its own scoping pass, not a rider on this one. |
| "XL is fine, we'll figure out the pieces as we implement" | XL isn't an estimate, it's an admission the task hasn't been decomposed. Figuring out the pieces during implementation is decomposition happening at the worst possible time — mid-execution, under schedule pressure. |

## Red Flags — STOP and Reconsider

- A task's estimate was given without first checking whether it decomposes into smaller vertical slices.
- "Dependencies: None" is written without anyone having actually checked what this task reads from, writes to, or blocks.
- The plan has a task described by its solution ("add a cache") rather than its outcome ("reduce p99 latency below 200ms").
- An estimate has no confidence qualifier — a bare "3 days" with no S/M/L/XL sizing or stated unknowns.
- Someone says "we'll sort out the details later" about a task that's about to be estimated right now.
- A dependency surfaces mid-implementation that wasn't on the Step 3 map — that's a signal the mapping step was rushed, not just bad luck.

## Worked Example: A Hidden Dependency Surfacing Late vs. Caught Early

**Caught late** (discovered mid-implementation): a task "Add CSV export for
orders" is estimated M and started. Two days in, it turns out the orders
table doesn't have a stable audit-log of price changes, so "export the
price at time of order" — an implicit requirement nobody stated — can't be
done without first building that audit log. The M task is now blocked on
an undiscovered L task, and everything scheduled after it slips.

**Caught early** (Step 3 dependency mapping, before estimating): while
mapping dependencies for the same task, someone asks "does the export
need historical price accuracy, or current price?" — surfacing the audit-log
gap before estimation. The plan splits into two tasks: "Add price
audit-log" (spike first — unknown whether the ORM supports it cleanly) and
"Add CSV export for orders" (blocked-by the audit-log task, sequenced
after it). No task starts work that turns out to be blocked mid-flight.
