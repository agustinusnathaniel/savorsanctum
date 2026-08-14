import { describe, expect, it } from 'vite-plus/test';
import z from 'zod';

import {
  parseSearchParams,
  stringifySearchParams,
} from '@/lib/utils/search-params';

const searchSchema = z.object({
  keyword: z.string().default('').catch(''),
  category: z.enum(['food', 'products', 'all']).default('all').catch('all'),
  sortBy: z.enum(['recent', 'alphabetical']).default('recent').catch('recent'),
  tags: z.string().optional().catch(undefined),
  location: z.string().optional().catch(undefined),
  highlight: z.string().optional().catch(undefined),
  saved: z
    .union([z.boolean(), z.enum(['true', 'false'])])
    .optional()
    .catch(undefined)
    .transform((v) =>
      v === undefined ? undefined : v === true || v === 'true',
    ),
});

const ROUND_TRIP_CASES = [
  'keyword=123',
  'keyword=bakso',
  'keyword=7-eleven',
  'keyword=hello+world',
  'saved=true',
  'saved=false',
  'tags=foo%2Cbar',
  'location=jakarta',
  'highlight=abc-123',
  '',
];

describe('parseSearchParams', () => {
  it('keeps numeric-looking values as strings', () => {
    expect(parseSearchParams('keyword=123')).toEqual({ keyword: '123' });
    expect(parseSearchParams('saved=1')).toEqual({ saved: '1' });
  });

  it('handles an empty search string', () => {
    expect(parseSearchParams('')).toEqual({});
  });
});

describe('stringifySearchParams', () => {
  it('emits raw strings without JSON quoting', () => {
    expect(stringifySearchParams({ keyword: '123' })).toBe('?keyword=123');
    expect(stringifySearchParams({ keyword: 'bakso' })).toBe('?keyword=bakso');
  });

  it('skips undefined values', () => {
    expect(
      stringifySearchParams({ keyword: 'bakso', highlight: undefined }),
    ).toBe('?keyword=bakso');
  });

  it('serializes booleans as JSON literals', () => {
    expect(stringifySearchParams({ saved: true })).toBe('?saved=true');
    expect(stringifySearchParams({ saved: false })).toBe('?saved=false');
  });
});

describe('round-trip through the route schema', () => {
  for (const search of ROUND_TRIP_CASES) {
    it(`round-trips '${search}'`, () => {
      const parsed = parseSearchParams(search);
      const validated = searchSchema.parse(parsed);
      const stringified = stringifySearchParams(validated);
      const revalidated = searchSchema.parse(parseSearchParams(stringified));
      expect(revalidated).toEqual(validated);
    });
  }

  it('preserves numeric keyword through validation', () => {
    const validated = searchSchema.parse(parseSearchParams('keyword=123'));
    expect(validated.keyword).toBe('123');
  });

  it('preserves saved true/false through validation', () => {
    expect(searchSchema.parse(parseSearchParams('saved=true')).saved).toBe(
      true,
    );
    expect(searchSchema.parse(parseSearchParams('saved=false')).saved).toBe(
      false,
    );
  });
});
