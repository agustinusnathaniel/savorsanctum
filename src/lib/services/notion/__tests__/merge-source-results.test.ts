import { describe, expect, it } from 'vite-plus/test';

import type { DirectoryItem } from '@/lib/models/collection-data';
import { mergeSourceResults } from '@/lib/services/notion/get-items';
import type { DirectoryQueryResult } from '@/lib/services/notion/types';

function buildItem(overrides: Partial<DirectoryItem> = {}): DirectoryItem {
  return {
    id: 'item-1',
    name: 'Test Item',
    category: 'food',
    link: 'https://example.com',
    image: 'https://example.com/image.jpg',
    reviews: [],
    tags: [],
    location: [],
    created_time: '2024-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function result(
  items: Array<DirectoryItem>,
  error?: string,
): DirectoryQueryResult<DirectoryItem> {
  return error ? { items, error } : { items };
}

describe('mergeSourceResults', () => {
  it('merges items from both sources and sorts by created_time descending', () => {
    const culinaries = result([
      buildItem({ id: 'a', created_time: '2024-01-01T00:00:00.000Z' }),
    ]);
    const products = result([
      buildItem({ id: 'b', created_time: '2024-03-01T00:00:00.000Z' }),
    ]);

    const merged = mergeSourceResults(culinaries, products);

    expect(merged.items.map((item) => item.id)).toEqual(['b', 'a']);
    expect(merged.error).toBeUndefined();
  });

  it('keeps product items and carries the error when culinaries fails', () => {
    const culinaries = result([], 'Culinaries query failed');
    const products = result([
      buildItem({ id: 'b', created_time: '2024-03-01T00:00:00.000Z' }),
    ]);

    const merged = mergeSourceResults(culinaries, products);

    expect(merged.items.map((item) => item.id)).toEqual(['b']);
    expect(merged.error).toBe('Culinaries query failed');
  });

  it('keeps culinary items and carries the error when products fails', () => {
    const culinaries = result([
      buildItem({ id: 'a', created_time: '2024-01-01T00:00:00.000Z' }),
    ]);
    const products = result([], 'Products query failed');

    const merged = mergeSourceResults(culinaries, products);

    expect(merged.items.map((item) => item.id)).toEqual(['a']);
    expect(merged.error).toBe('Products query failed');
  });

  it('returns empty items and carries the first error when both fail', () => {
    const culinaries = result([], 'Culinaries query failed');
    const products = result([], 'Products query failed');

    const merged = mergeSourceResults(culinaries, products);

    expect(merged.items).toEqual([]);
    expect(merged.error).toBe('Culinaries query failed');
  });

  it('sorts merged items so the newer created_time comes first', () => {
    const culinaries = result([
      buildItem({ id: 'old', created_time: '2024-01-01T00:00:00.000Z' }),
    ]);
    const products = result([
      buildItem({ id: 'new', created_time: '2025-06-01T00:00:00.000Z' }),
    ]);

    const merged = mergeSourceResults(culinaries, products);

    expect(merged.items[0].id).toBe('new');
    expect(merged.items[1].id).toBe('old');
  });
});
