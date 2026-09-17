# Testing Anti-Patterns

## Implementation-Coupled Tests

Tests that mock internal collaborators, test private methods, or verify through a side channel.

**The tell:** The test breaks when you refactor but behavior hasn't changed.

**Fix:** Test through public interfaces only.

## Tautological Tests

The assertion recomputs the expected value the way the code does.

**Example:**
```typescript
expect(add(a, b)).toBe(a + b); // Always passes
```

**Fix:** Expected values must come from an independent source of truth.

## Horizontal Slicing

Writing all tests first, then all implementation.

**Problem:** Bulk tests verify imagined behavior. You test the shape of things rather than user-facing behavior.

**Fix:** Work in vertical slices: one test → one implementation → repeat.

## Over-Mocking

Mocking everything makes tests brittle and disconnected from reality.

**Fix:** Use real code when possible. Mock only external dependencies.

## Snapshot Abuse

Snapshot tests become too large to review and hide changes.

**Fix:** Use targeted assertions instead of snapshots.
