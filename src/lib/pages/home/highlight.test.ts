import { describe, expect, it } from 'vite-plus/test';

import {
  getHighlightScrollY,
  visibleCountForIndex,
} from '@/lib/pages/home/highlight';

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

describe('getHighlightScrollY', () => {
  it('places the item top below the sticky header', () => {
    expect(getHighlightScrollY(600, 0, 300)).toBe(288);
  });

  it('accounts for current scroll position', () => {
    expect(getHighlightScrollY(600, 1200, 300)).toBe(1488);
  });

  it('clamps to 0 when the item is already above the target', () => {
    expect(getHighlightScrollY(100, 0, 300)).toBe(0);
  });

  it('uses the default 12px gap', () => {
    expect(getHighlightScrollY(312, 0, 300)).toBe(0);
    expect(getHighlightScrollY(313, 0, 300)).toBe(1);
  });

  it('accepts a custom gap', () => {
    expect(getHighlightScrollY(620, 0, 300, 20)).toBe(300);
  });
});
