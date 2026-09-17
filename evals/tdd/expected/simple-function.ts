// Expected output for TDD eval: simple-function

// Step 1: Red - Write failing test for 0! = 1 (handles the 0! = 1 case first).
describe('factorial', () => {
  it('returns 1 for 0', () => {
    expect(factorial(0)).toBe(1);
  });
});

// Step 2: Green - Minimal implementation
function factorial(n: number): number {
  if (n === 0) return 1;
  throw new Error('Not implemented');
}

// Step 3: Red - Write failing test for negative numbers
describe('factorial', () => {
  it('throws for negative numbers', () => {
    expect(() => factorial(-1)).toThrow();
  });
});

// Step 4: Green - Minimal implementation
function factorial(n: number): number {
  if (n < 0) throw new Error('Negative not supported');
  if (n === 0) return 1;
  throw new Error('Not implemented');
}

// Step 5: Red - Write failing test for 5! = 120
describe('factorial', () => {
  it('returns 120 for 5', () => {
    expect(factorial(5)).toBe(120);
  });
});

// Step 6: Green - Complete implementation
function factorial(n: number): number {
  if (n < 0) throw new Error('Negative not supported');
  if (n === 0) return 1;
  let result = 1;
  for (let i = 1; i <= n; i++) {
    result *= i;
  }
  return result;
}
// Gates demonstrated: red-before-green, minimal-implementation, test-each-behavior.
