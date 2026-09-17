# Characteristics of Good Tests

## Minimal

One thing. If "and" appears in the test name, split it.

**Good:**
```typescript
test('rejects empty email', () => { ... });
```

**Bad:**
```typescript
test('validates email and domain and whitespace', () => { ... });
```

## Clear

Name describes behavior, not implementation.

**Good:**
```typescript
test('calculates total with tax', () => { ... });
```

**Bad:**
```typescript
test('test1', () => { ... });
```

## Shows Intent

Demonstrates desired API, doesn't obscure what code should do.

**Good:**
```typescript
const result = calculateTotal(items);
expect(result).toBe(100);
```

**Bad:**
```typescript
const result = calculateTotal(items);
expect(typeof result).toBe('number');
```

## Independent

Tests don't depend on each other. Can run in any order.

## Fast

Tests run quickly. Slow tests get skipped.

## Deterministic

Same input always produces same output. No flaky tests.
