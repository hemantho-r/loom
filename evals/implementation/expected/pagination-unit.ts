// Implementation golden: pagination-unit
// Assumption (flagged, low-stakes): cursor is an opaque base64 string encoding
// the last seen id — spec does not define the format.

function clampPerPage(perPage?: number): number {
  if (perPage === undefined) return 20; // spec: default 20
  return Math.min(Math.max(perPage, 1), 100); // spec: max 100
}

function nextCursor(page: { id: string }[], perPage: number): string | null {
  if (page.length < perPage) return null; // spec: null on last page
  return Buffer.from(page[page.length - 1].id).toString('base64');
}

// Tests (each traces to the spec line above):
import { describe, it, expect } from 'vitest';

describe('clampPerPage', () => {
  it('defaults to 20 when perPage omitted', () => {
    expect(clampPerPage()).toBe(20);
  });

  it('clamps perPage above 100 to 100', () => {
    expect(clampPerPage(101)).toBe(100);
  });
});

describe('nextCursor', () => {
  it('returns null nextCursor when page is short (last page)', () => {
    expect(nextCursor([{ id: 'a' }], 20)).toBeNull();
  });
});
// Gates demonstrated: follow-spec, test-coverage, no-overengineering.
