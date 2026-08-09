import { describe, expect, it } from 'vite-plus/test';

import { visibleCountForIndex } from '@/lib/pages/home/highlight';

describe('visibleCountForIndex', () => {
  it('returns current unchanged when index is already visible', () => {
    expect(visibleCountForIndex(5, 12, 12, 100)).toBe(12);
  });

  it('rounds up to the next pageSize multiple when index is past current', () => {
    expect(visibleCountForIndex(13, 12, 12, 100)).toBe(24);
  });

  it('returns total when index is at the end of the list', () => {
    expect(visibleCountForIndex(99, 12, 12, 100)).toBe(100);
  });

  it('caps at total when index is beyond total', () => {
    expect(visibleCountForIndex(150, 12, 12, 100)).toBe(100);
  });

  it('returns current unchanged when current is already a larger multiple', () => {
    expect(visibleCountForIndex(3, 24, 12, 100)).toBe(24);
  });
});
