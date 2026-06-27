import Fuse, { type IFuseOptions } from 'fuse.js';

import type { DirectoryItem } from '@/lib/models/collection-data';

const WHITESPACE_REGEX = /\s+/;

export const FUSE_OPTIONS: IFuseOptions<DirectoryItem> = {
  includeMatches: true,
  ignoreDiacritics: true,
  threshold: 0.3,
  keys: ['name', ['tags', 'name'], ['reviews', 'name'], ['location', 'name']],
};

interface DirectoryFilterParams {
  items: Array<DirectoryItem>;
  keyword: string;
  category: string;
  sortBy: 'recent' | 'alphabetical';
  selectedTags: Array<string>;
  selectedLocations: Array<string>;
  fuseInstance?: Fuse<DirectoryItem>;
}

export function filterDirectoryItems(params: DirectoryFilterParams) {
  const {
    items,
    keyword,
    category,
    sortBy,
    selectedTags,
    selectedLocations,
    fuseInstance,
  } = params;

  const highlightTerms = keyword.trim().split(WHITESPACE_REGEX).filter(Boolean);

  let results = items;

  if (keyword.trim()) {
    const fuse = fuseInstance ?? new Fuse(items, FUSE_OPTIONS);
    results = fuse.search(keyword).map((result) => result.item);
  }

  if (category !== 'all') {
    results = results.filter((item) => item.category === category);
  }

  if (selectedTags.length > 0) {
    results = results.filter((item) =>
      item.tags.some((tag) => selectedTags.includes(tag.name)),
    );
  }

  if (selectedLocations.length > 0) {
    results = results.filter((item) =>
      item.location.some((loc) => selectedLocations.includes(loc.name)),
    );
  }

  if (sortBy === 'alphabetical') {
    results = [...results].sort((a, b) => a.name.localeCompare(b.name));
  }

  return { filteredItems: results, highlightTerms };
}
