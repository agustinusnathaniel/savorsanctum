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

type FilterParams = Parameters<typeof filterDirectoryItems>[0];

function filterDirectory(overrides: Partial<FilterParams> = {}) {
  return filterDirectoryItems({
    items: mockItems,
    keyword: '',
    category: 'all',
    sortBy: 'recent',
    selectedTags: [],
    selectedLocations: [],
    ...overrides,
  });
}

const namesOf = (items: Array<DirectoryItem>) => items.map((item) => item.name);

describe('filterDirectoryItems', () => {
  it('returns all items with no filters', () => {
    const result = filterDirectory();
    expect(result.filteredItems).toHaveLength(3);
    expect(result.highlightTerms).toEqual([]);
  });

  it('filters by category', () => {
    expect(
      namesOf(filterDirectory({ category: 'food' }).filteredItems).sort(),
    ).toEqual(['Pasta Place', 'Sushi Bar']);
    expect(filterDirectory({ category: 'products' }).filteredItems).toEqual([
      coolGadget,
    ]);
  });

  it('filters by keyword, case-insensitively', () => {
    const result = filterDirectory({ keyword: 'SUSHI' });
    expect(result.filteredItems).toEqual([sushiBar]);
  });

  it('returns empty results for a non-existent keyword', () => {
    expect(filterDirectory({ keyword: 'nonexistent' }).filteredItems).toEqual(
      [],
    );
  });

  it('whitespace-only keyword returns all items', () => {
    expect(filterDirectory({ keyword: '   ' }).filteredItems).toHaveLength(3);
  });

  it('splits the keyword into highlight terms', () => {
    const result = filterDirectory({ keyword: '  sushi   bar  ' });
    expect(result.highlightTerms).toEqual(['sushi', 'bar']);
  });

  it('filters by tag', () => {
    expect(
      filterDirectory({ selectedTags: ['japanese'] }).filteredItems,
    ).toEqual([sushiBar]);
  });
});

describe('filterDirectoryItems', () => {
  it('filters by multiple tags', () => {
    expect(
      namesOf(
        filterDirectory({ selectedTags: ['japanese', 'italian'] })
          .filteredItems,
      ).sort(),
    ).toEqual(['Pasta Place', 'Sushi Bar']);
  });

  it('filters by location', () => {
    expect(
      filterDirectory({ selectedLocations: ['Rome'] }).filteredItems,
    ).toEqual([pastaPlace]);
  });

  it('combines category and keyword filters', () => {
    const result = filterDirectory({ keyword: 'sushi', category: 'food' });
    expect(result.filteredItems).toEqual([sushiBar]);
  });

  it('sorts alphabetically', () => {
    expect(
      namesOf(filterDirectory({ sortBy: 'alphabetical' }).filteredItems),
    ).toEqual(['Cool Gadget', 'Pasta Place', 'Sushi Bar']);
  });

  it('handles empty items array', () => {
    expect(filterDirectory({ items: [] }).filteredItems).toEqual([]);
  });

  it('filters to saved items only when savedOnly is true', () => {
    const result = filterDirectory({ savedOnly: true, savedIds: ['1', '3'] });
    expect(namesOf(result.filteredItems).sort()).toEqual([
      'Cool Gadget',
      'Sushi Bar',
    ]);
  });

  it('returns empty when savedOnly is true and savedIds is empty', () => {
    expect(
      filterDirectory({ savedOnly: true, savedIds: [] }).filteredItems,
    ).toEqual([]);
  });

  it('ignores savedIds when savedOnly is false', () => {
    expect(
      filterDirectory({ savedOnly: false, savedIds: ['1'] }).filteredItems,
    ).toHaveLength(3);
  });

  it('combines savedOnly with a category filter', () => {
    const result = filterDirectory({
      category: 'food',
      savedOnly: true,
      savedIds: ['1', '3'],
    });
    expect(result.filteredItems).toEqual([sushiBar]);
  });
});
