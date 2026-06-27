import { describe, expect, it } from 'vite-plus/test';

import { filterDirectoryItems } from '@/lib/filters/directory';
import type { DirectoryItem } from '@/lib/models/collection-data';

const sushiBar: DirectoryItem = {
  id: '1',
  name: 'Sushi Bar',
  category: 'food',
  link: 'https://sushi.example.com',
  image: 'sushi.jpg',
  reviews: [{ name: 'great' }],
  tags: [{ name: 'japanese' }, { name: 'seafood' }],
  location: [{ name: 'Tokyo' }],
  created_time: '2024-01-01',
};

const pastaPlace: DirectoryItem = {
  id: '2',
  name: 'Pasta Place',
  category: 'food',
  link: 'https://pasta.example.com',
  image: 'pasta.jpg',
  reviews: [{ name: 'authentic' }],
  tags: [{ name: 'italian' }, { name: 'pasta' }],
  location: [{ name: 'Rome' }],
  created_time: '2024-02-01',
};

const coolGadget: DirectoryItem = {
  id: '3',
  name: 'Cool Gadget',
  category: 'products',
  link: 'https://gadget.example.com',
  image: 'gadget.jpg',
  reviews: [],
  tags: [{ name: 'tech' }],
  location: [{ name: 'Online' }],
  created_time: '2024-03-01',
};

const mockItems = [sushiBar, pastaPlace, coolGadget];

describe('filterDirectoryItems', () => {
  it('returns all items with no filters', () => {
    const result = filterDirectoryItems({
      items: mockItems,
      keyword: '',
      category: 'all',
      sortBy: 'recent',
      selectedTags: [],
      selectedLocations: [],
    });
    expect(result.filteredItems).toHaveLength(3);
    expect(result.highlightTerms).toEqual([]);
  });

  it('filters by category: food', () => {
    const result = filterDirectoryItems({
      items: mockItems,
      keyword: '',
      category: 'food',
      sortBy: 'recent',
      selectedTags: [],
      selectedLocations: [],
    });
    expect(result.filteredItems).toHaveLength(2);
    expect(result.filteredItems.map((item) => item.name).sort()).toEqual([
      'Pasta Place',
      'Sushi Bar',
    ]);
  });

  it('filters by category: products', () => {
    const result = filterDirectoryItems({
      items: mockItems,
      keyword: '',
      category: 'products',
      sortBy: 'recent',
      selectedTags: [],
      selectedLocations: [],
    });
    expect(result.filteredItems).toHaveLength(1);
    expect(result.filteredItems[0].name).toBe('Cool Gadget');
  });

  it('filters by category: all', () => {
    const result = filterDirectoryItems({
      items: mockItems,
      keyword: '',
      category: 'all',
      sortBy: 'recent',
      selectedTags: [],
      selectedLocations: [],
    });
    expect(result.filteredItems).toHaveLength(3);
  });

  it('filters by keyword', () => {
    const result = filterDirectoryItems({
      items: mockItems,
      keyword: 'sushi',
      category: 'all',
      sortBy: 'recent',
      selectedTags: [],
      selectedLocations: [],
    });
    expect(result.filteredItems).toHaveLength(1);
    expect(result.filteredItems[0].name).toBe('Sushi Bar');
  });

  it('filters by keyword (case insensitive)', () => {
    const result = filterDirectoryItems({
      items: mockItems,
      keyword: 'SUSHI',
      category: 'all',
      sortBy: 'recent',
      selectedTags: [],
      selectedLocations: [],
    });
    expect(result.filteredItems).toHaveLength(1);
    expect(result.filteredItems[0].name).toBe('Sushi Bar');
  });

  it('filters by tag', () => {
    const result = filterDirectoryItems({
      items: mockItems,
      keyword: '',
      category: 'all',
      sortBy: 'recent',
      selectedTags: ['japanese'],
      selectedLocations: [],
    });
    expect(result.filteredItems).toHaveLength(1);
    expect(result.filteredItems[0].name).toBe('Sushi Bar');
  });

  it('filters by location', () => {
    const result = filterDirectoryItems({
      items: mockItems,
      keyword: '',
      category: 'all',
      sortBy: 'recent',
      selectedTags: [],
      selectedLocations: ['Rome'],
    });
    expect(result.filteredItems).toHaveLength(1);
    expect(result.filteredItems[0].name).toBe('Pasta Place');
  });

  it('combines filters — category food + keyword sushi', () => {
    const result = filterDirectoryItems({
      items: mockItems,
      keyword: 'sushi',
      category: 'food',
      sortBy: 'recent',
      selectedTags: [],
      selectedLocations: [],
    });
    expect(result.filteredItems).toHaveLength(1);
    expect(result.filteredItems[0].name).toBe('Sushi Bar');
  });

  it('returns empty results for a non-existent keyword', () => {
    const result = filterDirectoryItems({
      items: mockItems,
      keyword: 'nonexistent',
      category: 'all',
      sortBy: 'recent',
      selectedTags: [],
      selectedLocations: [],
    });
    expect(result.filteredItems).toHaveLength(0);
  });

  it('sorts by name alphabetically', () => {
    const result = filterDirectoryItems({
      items: mockItems,
      keyword: '',
      category: 'all',
      sortBy: 'alphabetical',
      selectedTags: [],
      selectedLocations: [],
    });
    expect(result.filteredItems.map((item) => item.name)).toEqual([
      'Cool Gadget',
      'Pasta Place',
      'Sushi Bar',
    ]);
  });

  it('whitespace-only keyword returns all items', () => {
    const result = filterDirectoryItems({
      items: mockItems,
      keyword: '   ',
      category: 'all',
      sortBy: 'recent',
      selectedTags: [],
      selectedLocations: [],
    });
    expect(result.filteredItems).toHaveLength(3);
  });

  it('filters by multiple tags', () => {
    const result = filterDirectoryItems({
      items: mockItems,
      keyword: '',
      category: 'all',
      sortBy: 'recent',
      selectedTags: ['japanese', 'italian'],
      selectedLocations: [],
    });
    expect(result.filteredItems).toHaveLength(2);
    expect(result.filteredItems.map((item) => item.name).sort()).toEqual([
      'Pasta Place',
      'Sushi Bar',
    ]);
  });

  it('handles empty items array', () => {
    const result = filterDirectoryItems({
      items: [],
      keyword: '',
      category: 'all',
      sortBy: 'recent',
      selectedTags: [],
      selectedLocations: [],
    });
    expect(result.filteredItems).toHaveLength(0);
  });
});
