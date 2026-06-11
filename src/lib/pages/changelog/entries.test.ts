import { describe, expect, it } from 'vitest';

import { compareSemver } from './semver';

describe('compareSemver', () => {
  it('sorts major versions descending', () => {
    expect(compareSemver('2.0.0', '1.0.0')).toBeLessThan(0);
    expect(compareSemver('1.0.0', '2.0.0')).toBeGreaterThan(0);
  });

  it('sorts minor versions descending', () => {
    expect(compareSemver('1.2.0', '1.1.0')).toBeLessThan(0);
    expect(compareSemver('1.1.0', '1.2.0')).toBeGreaterThan(0);
  });

  it('sorts patch versions descending', () => {
    expect(compareSemver('1.0.2', '1.0.1')).toBeLessThan(0);
    expect(compareSemver('1.0.1', '1.0.2')).toBeGreaterThan(0);
  });

  it('returns 0 for equal versions', () => {
    expect(compareSemver('1.2.3', '1.2.3')).toBe(0);
  });

  it('handles versions with different segment counts', () => {
    expect(compareSemver('1.2.1', '1.2')).toBeLessThan(0);
  });
});
