import { describe, expect, it } from 'vite-plus/test';

import type { DirectoryItem } from '@/lib/models/collection-data';
import { buildItemListSchema } from '@/lib/models/structured-data';

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

describe('buildItemListSchema', () => {
  it('builds ItemList with one ListItem per item and 1-based positions', () => {
    const schema = buildItemListSchema([
      makeItem({ id: '1', name: 'A' }),
      makeItem({ id: '2', name: 'B' }),
      makeItem({ id: '3', name: 'C' }),
    ]);

    expect(schema.itemListElement).toHaveLength(3);
    expect(schema.itemListElement.map((element) => element.position)).toEqual([
      1, 2, 3,
    ]);
  });

  it('maps food category to FoodEstablishment and products to Product', () => {
    const schema = buildItemListSchema([
      makeItem({ category: 'food', name: 'Sushi Bar' }),
      makeItem({ category: 'products', name: 'Cool Gadget' }),
    ]);

    expect(schema.itemListElement[0].item['@type']).toBe('FoodEstablishment');
    expect(schema.itemListElement[1].item['@type']).toBe('Product');
  });

  it('includes url and image only when present', () => {
    const schema = buildItemListSchema([
      makeItem(),
      makeItem({ link: '', image: '' }),
    ]);

    const withLinks = schema.itemListElement[0].item;
    expect('url' in withLinks).toBe(true);
    expect('image' in withLinks).toBe(true);
    expect(withLinks.url).toBe('https://sushi.example.com');
    expect(withLinks.image).toBe('sushi.jpg');

    const withoutLinks = schema.itemListElement[1].item;
    expect('url' in withoutLinks).toBe(false);
    expect('image' in withoutLinks).toBe(false);
  });

  it('omits url and image keys when link/image are empty strings', () => {
    const schema = buildItemListSchema([makeItem({ link: '', image: '' })]);

    expect('url' in schema.itemListElement[0].item).toBe(false);
    expect('image' in schema.itemListElement[0].item).toBe(false);
  });

  it('returns empty itemListElement for empty input', () => {
    const schema = buildItemListSchema([]);

    expect(schema.itemListElement).toEqual([]);
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('ItemList');
  });
});
