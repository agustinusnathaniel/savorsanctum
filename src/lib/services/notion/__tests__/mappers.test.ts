import { describe, expect, it } from 'vite-plus/test';

import { mapCulinariesPage } from '@/lib/services/notion/mappers/culinaries';
import { mapProductsPage } from '@/lib/services/notion/mappers/products';

describe('mapCulinariesPage', () => {
  it('maps all fields correctly', () => {
    const page = {
      id: 'culinary-1',
      properties: {
        Name: {
          type: 'title',
          title: [{ plain_text: 'Sushi Bar' }],
        },
        Link: {
          type: 'url',
          url: 'https://sushi.example.com',
        },
        Image: {
          type: 'files',
          files: [{ external: { url: 'https://example.com/sushi.jpg' } }],
        },
        Review: {
          type: 'multi_select',
          multi_select: [{ name: 'recommended' }, { name: 'great' }],
        },
        Tags: {
          type: 'multi_select',
          multi_select: [{ name: 'japanese' }, { name: 'seafood' }],
        },
        'Area / Location': {
          type: 'multi_select',
          multi_select: [{ name: 'Tokyo' }],
        },
        'Created time': {
          type: 'created_time',
          created_time: '2024-01-01T00:00:00.000Z',
        },
      },
    };

    // biome-ignore lint/suspicious/noExplicitAny: mock not matching NotionPage type exactly
    const result = mapCulinariesPage(page as any);

    expect(result.id).toBe('culinary-1');
    expect(result.category).toBe('food');
    expect(result.name).toBe('Sushi Bar');
    expect(result.link).toBe('https://sushi.example.com');
    expect(result.image).toBe('https://example.com/sushi.jpg');
    expect(result.reviews).toEqual([{ name: 'great' }]);
    expect(result.tags).toEqual([{ name: 'japanese' }, { name: 'seafood' }]);
    expect(result.location).toEqual([{ name: 'Tokyo' }]);
    expect(result.created_time).toBe('2024-01-01T00:00:00.000Z');
  });

  it('handles missing optional properties', () => {
    const page = {
      id: 'culinary-2',
      properties: {
        Name: {
          type: 'rich_text',
          rich_text: [{ plain_text: 'Fallback' }],
        },
        Link: {
          type: 'rich_text',
          rich_text: [{ plain_text: 'no-url' }],
        },
        Image: {
          type: 'rich_text',
          rich_text: [{ plain_text: 'no-image' }],
        },
        Review: {
          type: 'rich_text',
          rich_text: [{ plain_text: 'no-review' }],
        },
        Tags: {
          type: 'rich_text',
          rich_text: [{ plain_text: 'no-tags' }],
        },
        'Area / Location': {
          type: 'rich_text',
          rich_text: [{ plain_text: 'no-location' }],
        },
        'Created time': {
          type: 'rich_text',
          rich_text: [{ plain_text: 'no-time' }],
        },
      },
    };

    // biome-ignore lint/suspicious/noExplicitAny: mock not matching NotionPage type exactly
    const result = mapCulinariesPage(page as any);

    expect(result.name).toBe('');
    expect(result.link).toBe('');
    expect(result.image).toBe('');
    expect(result.reviews).toEqual([]);
    expect(result.tags).toEqual([]);
    expect(result.location).toEqual([]);
    expect(result.created_time).toBe('');
  });

  it('handles wrong property types', () => {
    const page = {
      id: 'culinary-3',
      properties: {
        Name: {
          type: 'title',
          title: [],
        },
        Link: {
          type: 'url',
          url: null,
        },
        Image: {
          type: 'files',
          files: [],
        },
        Review: {
          type: 'multi_select',
          multi_select: [],
        },
        Tags: {
          type: 'multi_select',
          multi_select: [],
        },
        'Area / Location': {
          type: 'multi_select',
          multi_select: [],
        },
        'Created time': {
          type: 'created_time',
          created_time: '',
        },
      },
    };

    // biome-ignore lint/suspicious/noExplicitAny: mock not matching NotionPage type exactly
    const result = mapCulinariesPage(page as any);

    expect(result.name).toBe('');
    expect(result.link).toBe('');
    expect(result.image).toBe('');
    expect(result.reviews).toEqual([]);
    expect(result.tags).toEqual([]);
    expect(result.location).toEqual([]);
    expect(result.created_time).toBe('');
  });
});

describe('mapProductsPage', () => {
  it('maps all fields correctly', () => {
    const page = {
      id: 'product-1',
      properties: {
        Name: {
          type: 'title',
          title: [{ plain_text: 'Cool Gadget' }],
        },
        Link: {
          type: 'url',
          url: 'https://gadget.example.com',
        },
        Image: {
          type: 'files',
          files: [{ external: { url: 'https://example.com/gadget.jpg' } }],
        },
        Tags: {
          type: 'multi_select',
          multi_select: [{ name: 'tech' }],
        },
        Location: {
          type: 'multi_select',
          multi_select: [{ name: 'Online' }],
        },
        'Created time': {
          type: 'created_time',
          created_time: '2024-03-01T00:00:00.000Z',
        },
      },
    };

    // biome-ignore lint/suspicious/noExplicitAny: mock not matching NotionPage type exactly
    const result = mapProductsPage(page as any);

    expect(result.id).toBe('product-1');
    expect(result.category).toBe('products');
    expect(result.name).toBe('Cool Gadget');
    expect(result.link).toBe('https://gadget.example.com');
    expect(result.image).toBe('https://example.com/gadget.jpg');
    expect(result.reviews).toEqual([]);
    expect(result.tags).toEqual([{ name: 'tech' }]);
    expect(result.location).toEqual([{ name: 'Online' }]);
    expect(result.created_time).toBe('2024-03-01T00:00:00.000Z');
  });

  it('handles missing optional properties', () => {
    const page = {
      id: 'product-2',
      properties: {
        Name: {
          type: 'rich_text',
          rich_text: [{ plain_text: 'No name' }],
        },
        Link: {
          type: 'rich_text',
          rich_text: [{ plain_text: 'no-url' }],
        },
        Image: {
          type: 'rich_text',
          rich_text: [{ plain_text: 'no-image' }],
        },
        Tags: {
          type: 'rich_text',
          rich_text: [{ plain_text: 'no-tags' }],
        },
        Location: {
          type: 'rich_text',
          rich_text: [{ plain_text: 'no-location' }],
        },
        'Created time': {
          type: 'rich_text',
          rich_text: [{ plain_text: 'no-time' }],
        },
      },
    };

    // biome-ignore lint/suspicious/noExplicitAny: mock not matching NotionPage type exactly
    const result = mapProductsPage(page as any);

    expect(result.name).toBe('');
    expect(result.link).toBe('');
    expect(result.image).toBe('');
    expect(result.tags).toEqual([]);
    expect(result.location).toEqual([]);
    expect(result.created_time).toBe('');
  });
});
