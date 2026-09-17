# Code Smells: Recognition Guide

How to *recognize* each smell before choosing a fix. For the refactoring techniques themselves, see [refactoring-catalog.md](./refactoring-catalog.md).

## Bloaters

**Long Method** — Recognize: the method scrolls off one screen, or you need a comment to explain what a block of it does (the comment is a hint the block should be its own named function).
→ Fix: Extract Method (refactoring-catalog.md)

**Large Class** — Recognize: the class has fields that are only used by a subset of its methods, or its name would need "and" to describe what it does ("UserAndBillingManager").
→ Fix: Extract Class (refactoring-catalog.md)

**Long Parameter List** — Recognize: more than 3-4 parameters, or callers frequently pass the same group of values together.
→ Fix: Introduce Parameter Object — group the related parameters into a single struct/object.

**Data Clumps** — Recognize: the same 2-3 fields (e.g. `startDate`, `endDate`) keep appearing together as parameters or fields across multiple places. If you'd delete one, you'd have to delete them all — they're really one concept.
→ Fix: Extract Class to make the group its own type.

## Object-Orientation Abusers

**Switch/if-else Statements** — Recognize: the same `switch (type)` or `if (type === ...)` structure is duplicated in multiple methods, and adding a new `type` means finding and editing every one.
→ Fix: replace with polymorphism — one subclass/handler per type instead of a shared switch.

**Parallel Inheritance Hierarchies** — Recognize: creating a subclass of A always requires creating a matching subclass of B.
→ Fix: Move Method/Field to collapse the two hierarchies into one, or use composition instead of the parallel structure.

**Lazy Class** — Recognize: a class with one field and one trivial method, or a class kept "for future flexibility" that nothing currently uses meaningfully.
→ Fix: Inline Method/Class — fold it into its caller.

## Dispensables

**Comments Explaining Bad Code** — Recognize: a comment restates *what* the code does rather than *why* — that's a signal the code isn't self-explanatory and should be renamed/extracted instead of annotated.
→ Fix: Extract Method with a name that makes the comment unnecessary.

**Duplicate Code** — Recognize: the same logic (not just similar-looking code) appears in 2+ places, so a bug fix in one place needs to be repeated in the others.
→ Fix: Extract Method, then have both call sites use it.

**Dead Code** — Recognize: a function/branch/flag with no remaining callers, or a feature flag that's been at 100% rollout for months.
→ Fix: delete it. Don't comment it out — that's what version control is for.

**Speculative Generality** — Recognize: an abstract base class with one concrete subclass, a config option nothing sets, a parameter every caller passes the same value for.
→ Fix: Inline Method/Class to remove the unused flexibility. Add it back if and when a second real use case appears.

## Couplers

**Feature Envy** — Recognize: a method calls more getters on another object than it uses its own class's data — it's more interested in the other class than its own.
→ Fix: Move Method to the class whose data it actually uses.

**Inappropriate Intimacy** — Recognize: two classes reach into each other's internals/private fields regularly, rather than talking through public methods.
→ Fix: Move Method/Field to reduce the cross-class dependency, or merge the classes if they're really one concept.

**Message Chains** — Recognize: `a.getB().getC().getD().doSomething()` — the caller depends on the entire chain's structure, so any link changing breaks it.
→ Fix: Extract Method / delegate — add a method that hides the chain.

**Middle Man** — Recognize: over half a class's methods just delegate to another object with no added logic.
→ Fix: Remove Middle Man — have callers talk to the real object directly. (Opposite failure mode from Message Chains — don't over-correct into this.)

## Using This Guide

1. Name the smell you're seeing using the recognition criteria above, not a vague "this feels messy."
2. Look up its fix in [refactoring-catalog.md](./refactoring-catalog.md).
3. Apply one refactoring at a time, per the main workflow's Step 4 — don't try to fix every smell in a class in one pass.
