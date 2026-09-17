# Subagent-Driven Development

## Overview

Coordinate multiple agents to work on independent tasks in parallel, then integrate results.

## When to Use

- Large features with independent components
- Multi-file refactoring
- Testing across multiple modules
- Documentation and implementation in parallel

## Workflow

### Step 1: Task Decomposition

Break work into independent tasks:

- Each task should be self-contained
- Minimize dependencies between tasks
- Define clear interfaces for integration

### Step 2: Agent Assignment

Assign tasks to agents:

- Match task to agent capabilities
- Provide complete context for each task
- Define expected output format

### Step 3: Parallel Execution

Agents work simultaneously:

- Each agent works independently
- No shared state during execution
- Agents report progress independently

### Step 4: Result Collection

Gather results from all agents:

- Collect all outputs
- Check for completion
- Identify any failures

### Step 5: Integration

Merge results:

- Resolve any conflicts
- Run integration tests
- Verify combined functionality

## Task Independence Criteria

Tasks are independent if:

- No shared mutable state
- Different files/modules
- No circular dependencies
- Clear interface boundaries

## Conflict Resolution

When conflicts occur:

1. Identify the conflict source
2. Determine which solution is correct
3. Apply the correct solution
4. Re-run affected tests

## References

- **[subagent-patterns.md](./references/subagent-patterns.md)** — concrete task-decomposition and coordination patterns beyond the summary above

## Quality Gates

- **task-independence**: Tasks must be independent
- **result-integration**: Results must be integratable
- **conflict-resolution**: Conflicts must be resolved

## Anti-Rationalization

| Excuse | Reality |
|--------|---------|
| "They can figure it out" | Ambiguous tasks produce wrong results. |
| "Just merge it and see" | Merge conflicts compound. Resolve first. |
| "It's faster to do it myself" | Parallel execution scales; solo work doesn't. |
| "These two subtasks probably don't touch the same files" | "Probably" isn't independence. List the exact files/modules each task writes before dispatch, not after. |
| "I'll figure out the integration boundary once both come back" | Undefined interfaces mean two agents guess the same contract differently. Define it before dispatch. |
| "One agent's output looks done, ship it" | "Looks done" isn't "verified done." A task that silently returned partial output looks identical to a complete one until you check. |
| "The conflict is small, I'll just pick one side" | Small conflicts are often symptoms of an interface both agents misread the same way. Check the root cause, not just the diff. |
| "I don't need to re-run tests after merging both agents' work" | Passing tests on task A and task B separately says nothing about the seam between them. |
| "I gave both agents the same context, that's enough" | Same context ≠ same interpretation. Two agents given identical ambiguous instructions can each make a different, individually-reasonable choice. |

## Red Flags — STOP and Reconsider

If you catch yourself thinking or seeing:
- "It probably doesn't matter which order they run in"
- Two tasks touch the same file "just a little"
- You're integrating without having defined the interface first
- A subagent's report describes what it *intended* to do, not what it verified
- You're resolving a merge conflict by keeping "whichever change looks newer"
- Integration tests weren't written until after both agents returned
- You're about to skip re-running the full suite because "both halves passed individually"

**All of these mean: stop, verify independence/interfaces explicitly, and re-run integration tests before calling it done.**

## Worked Example: Detecting and Resolving a Conflict

Two subagents are dispatched: Agent A refactors `formatCurrency()` in
`utils/money.ts` to accept a `locale` parameter; Agent B adds a new
`InvoiceTotal` component in `components/InvoiceTotal.tsx` that calls
`formatCurrency(amount)` (no locale) based on the *pre-refactor* signature
it read at dispatch time.

**Wrong way to integrate:** merge both diffs, see that `money.ts` compiles
and `InvoiceTotal.tsx` compiles, ship it. Both files pass type-check in
isolation if `locale` was added as optional — the conflict is silent.

**Right way:**
1. Before merging, diff the *public interface* Agent A changed
   (`formatCurrency(amount, locale?)`) against what Agent B's task brief
   said the interface was when B was dispatched (`formatCurrency(amount)`).
2. Because B was dispatched before A's interface change landed, B's call
   site is now using stale assumptions — even though it type-checks.
3. Root cause: the task brief for B should have said "don't assume
   `formatCurrency`'s signature; check `utils/money.ts` at integration
   time," or the two tasks should have been sequenced instead of
   parallelized since B's correctness depends on A's output shape.
4. Fix: update `InvoiceTotal.tsx` to pass the user's locale explicitly, add
   an integration test asserting `InvoiceTotal` renders correctly for two
   different locales, then re-run the full suite — not just the two
   modules' individual unit tests.

## Self-Critique Scoring

Before integrating, score yourself (1-5):

| Axis | Question | Score |
|------|----------|-------|
| **Independence** | Could each task run with zero shared mutable state? | 1-5 |
| **Interfaces** | Were integration boundaries written before dispatch? | 1-5 |
| **Context** | Did every agent get complete context + output format? | 1-5 |
| **Completion** | Is every task verifiably complete, none silently partial? | 1-5 |
| **Conflicts** | Is each conflict resolved by correctness, not recency? | 1-5 |
| **Integration** | Do integration tests cover the seams, not just units? | 1-5 |

**Minimum passing score:** 30/30
