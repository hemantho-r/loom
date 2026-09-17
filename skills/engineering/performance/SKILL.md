# Performance Optimization

## Overview

Performance analysis and optimization workflow. Focus on measuring before optimizing and avoiding premature optimization.

## When to Use

- When code is slow
- When optimizing for scale
- When reducing bundle size
- When improving response times
- When profiling memory usage

## Workflow

### Step 1: Measure

Before optimizing, establish baseline metrics.

- Profile the current performance
- Identify where time is spent
- Set clear performance goals

### Step 2: Identify Bottlenecks

Find the actual constraints.

- CPU-bound vs I/O-bound
- Memory allocation patterns
- Network latency
- Database queries

### Step 3: Optimize

Apply targeted optimizations.

- Focus on the biggest bottleneck first
- Use algorithmic improvements over micro-optimizations
- Consider caching strategies
- Optimize data structures

### Step 4: Verify

Confirm improvements.

- Re-run the profiling
- Compare before/after metrics
- Ensure no regressions in functionality

### Step 5: Document

Record what was learned.

- Document the optimization
- Add benchmarks if appropriate
- Share learnings with the team

## Common Bottlenecks

| Type | Symptom | Solution |
|------|---------|----------|
| N+1 Queries | Many DB calls | Use joins or batching |
| Large Bundles | Slow page load | Code splitting, tree shaking |
| Memory Leaks | Growing memory | Fix references, use WeakRef |
| Blocking I/O | Slow responses | Use async/await |
| Inefficient Algorithms | High CPU | Better data structures |

## Quality Gates

- **measure-first**: Must measure before optimizing
- **no-premature-optimization**: Don't optimize without evidence
- **maintainability**: Optimizations must not hurt readability

## Anti-Rationalization

| Excuse | Reality |
|--------|---------|
| "It feels slow" | Measure. Feelings aren't metrics, and the part that *feels* slow is rarely the part that *is* slow. |
| "Premature optimization is the root of all evil" | So is premature pessimization — writing deliberately naive code and never measuring whether it matters. Measure first, either way. |
| "We'll optimize later" | Later means never, or means optimizing under production-incident pressure with no baseline to compare against. |
| "This micro-optimization helps" | Algorithmic wins (O(n²) → O(n log n)) beat micro-optimizations by orders of magnitude. Profile before assuming which kind of win is available. |
| "I'm sure this loop is the bottleneck" | Intuition about hot paths is wrong more often than engineers expect — profile it or you're optimizing based on a guess. |
| "The profiler output is confusing, I'll just optimize what looks slow" | "Looks slow" reading code is exactly the intuition profiling exists to replace. Spend the extra ten minutes reading the profile correctly. |
| "This optimization is small, I don't need to re-measure" | Small changes sometimes have zero effect or make things worse (e.g. defeating a JIT optimization, adding cache-invalidation overhead) — always verify. |
| "The benchmark environment is close enough to production" | Different hardware, different data volume, different concurrency — "close enough" benchmarks produce numbers that don't transfer. |
| "Caching will fix this" | Caching adds invalidation complexity and can mask a real algorithmic problem. Measure whether the bottleneck is actually repeated computation before reaching for a cache. |

## Red Flags — STOP and Measure

- You're about to change code before running a profiler
- You can't name the specific metric this optimization is supposed to move
- The "before" numbers were never actually recorded
- You're optimizing the function you find most interesting, not the one the profile flagged
- A benchmark exists but was run on different hardware/data than production
- You're about to ship an optimization that makes the code harder to read with no measured benefit to justify it
- "It should be faster now" without a re-run to confirm it

## Worked Example: Measure, Don't Guess

**Symptom:** API endpoint `/orders/:id/summary` takes ~800ms p50.

**Step 1 — Measure (before touching code):**
```
$ node --prof server.js  # under representative load
$ node --prof-process isolate-0x...-v8.log > profile.txt

   ticks  total  nonlib   name
   41823  61.2%  63.4%    pg_query (fetchOrderItems, N+1 per line item)
    9021  13.2%  13.7%    JSON.stringify (response serialization)
    3011   4.4%   4.5%    calculateTax
```
The profile says the database layer is 61% of total time — not the tax
calculation an engineer might have guessed at from reading the code.

**Step 2 — Identify the bottleneck:** `fetchOrderItems` runs one query per
line item (N+1) instead of one batched query.

**Step 3 — Optimize the actual bottleneck:**
```typescript
// Before: N+1 — one query per item
for (const item of order.items) {
  item.product = await db.products.findById(item.productId);
}

// After: one batched query
const products = await db.products.findByIds(order.items.map(i => i.productId));
```

**Step 4 — Verify, same workload:**
```
p50: 800ms → 95ms   (8.4x)
p99: 2100ms → 210ms (10x)
Functional tests: 47/47 passing, no regressions
```

Note what didn't happen: `calculateTax` (4.4% of time) was never touched,
even though it's easy to imagine "optimizing" it first — the profile is
what redirected effort to the 61% instead of the 4%.

## Profiling Tools

- **Node.js**: `--prof`, `clinic.js`, `0x`
- **Browser**: Chrome DevTools, Lighthouse
- **Python**: `cProfile`, `py-spy`
- **Go**: `pprof`

## Self-Critique Scoring

Before submitting the optimization, score yourself (1-5):

| Axis | Question | Score |
|------|----------|-------|
| **Baseline** | Did I record before-metrics with the same workload? | 1-5 |
| **Bottleneck** | Did I optimize the biggest bottleneck, not the easiest? | 1-5 |
| **Evidence** | Do after-metrics show improvement on the same workload? | 1-5 |
| **No regression** | Do all functionality tests still pass? | 1-5 |
| **Readability** | Is the optimized code still reviewable? | 1-5 |
| **Documentation** | Is the optimization and its rationale recorded? | 1-5 |

**Minimum passing score:** 30/30
