import { describe, expect, it } from 'vite-plus/test';

import type { DirectoryItem } from '@/lib/models/collection-data';
import {
  buildItemShareUrl,
  buildItemSocialMeta,
  getHighlightScrollY,
  visibleCountForIndex,
} from '@/lib/pages/home/highlight';

function makeItem(overrides: Partial<DirectoryItem> = {}): DirectoryItem {
  return {
    id: '1',
    name: 'Sushi Bar',
    category: 'food',
    link: 'https://sushi.example.com',
    image: 'sushi.jpg',
    reviews: [{ name: 'great' }],
    tags: [{ name: 'japanese' }],
    location: [{ name: 'Tokyo' }],
    created_time: '2024-01-01',
    ...overrides,
  };
}

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

describe('buildItemShareUrl', () => {
  it('sets the highlight param', () => {
    expect(buildItemShareUrl('https://example.com/', 'item-1')).toBe(
      'https://example.com/?highlight=item-1',
    );
  });

  it('strips the saved filter so the item is visible to any recipient', () => {
    expect(
      buildItemShareUrl(
        'https://example.com/?saved=true&category=food',
        'item-1',
      ),
    ).toBe('https://example.com/?category=food&highlight=item-1');
  });

  it('preserves other search params', () => {
    expect(
      buildItemShareUrl(
        'https://example.com/?keyword=ramen&sortBy=recent&tags=a%2Cb',
        'item-1',
      ),
    ).toBe(
      'https://example.com/?keyword=ramen&sortBy=recent&tags=a%2Cb&highlight=item-1',
    );
  });

  it('overwrites an existing highlight param', () => {
    expect(
      buildItemShareUrl('https://example.com/?highlight=old', 'item-2'),
    ).toBe('https://example.com/?highlight=item-2');
  });
});

describe('buildItemSocialMeta', () => {
  const fallback = {
    title: 'Site Title',
    description: 'Site description',
    image: 'fallback.jpg',
  };

  it('uses item.name as title', () => {
    const meta = buildItemSocialMeta(
      makeItem({ name: 'Ramen Shop' }),
      fallback,
    );
    expect(meta.title).toBe('Ramen Shop');
  });

  it('joins location names and tag names with the " · " separator', () => {
    const meta = buildItemSocialMeta(
      makeItem({
        location: [{ name: 'Kyoto' }, { name: 'Osaka' }],
        tags: [{ name: 'ramen' }, { name: 'trending' }],
      }),
      fallback,
    );
    expect(meta.description).toBe('Kyoto, Osaka · ramen, trending');
  });

  it('falls back to fallback.description when the item has no locations or tags', () => {
    const meta = buildItemSocialMeta(
      makeItem({ location: [], tags: [] }),
      fallback,
    );
    expect(meta.description).toBe('Site description');
  });

  it('uses item.image when present', () => {
    const meta = buildItemSocialMeta(
      makeItem({ image: 'ramen.jpg' }),
      fallback,
    );
    expect(meta.image).toBe('ramen.jpg');
  });

  it('uses fallback.image when item.image is absent', () => {
    const meta = buildItemSocialMeta(makeItem({ image: '' }), fallback);
    expect(meta.image).toBe('fallback.jpg');
  });
});
