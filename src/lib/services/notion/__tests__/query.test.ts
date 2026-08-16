import { describe, expect, it, vi } from 'vite-plus/test';

import { queryNotionDatabase } from '@/lib/services/notion/query';
import type { NotionClientAdapter } from '@/lib/services/notion/types';

function makePage(id: string) {
  return {
    object: 'page',
    id,
    url: `https://www.notion.so/${id}`,
    properties: {},
  };
}

function makeAdapter(
  calls: Array<() => Promise<unknown>>,
): NotionClientAdapter {
  const fn = vi.fn(async () => calls.shift()?.());
  // biome-ignore lint/suspicious/noExplicitAny: mock not matching NotionClientAdapter type exactly
  return { query: fn as any };
}

function mapPages(pages: Array<{ id: string }>): Array<{ id: string }> {
  return pages.map((page) => ({ id: page.id }));
}

describe('queryNotionDatabase pagination', () => {
  it('returns all pages when pagination succeeds across multiple pages', async () => {
    const adapter = makeAdapter([
      async () => ({
        results: [makePage('page-1a'), makePage('page-1b')],
        has_more: true,
        next_cursor: 'cursor-2',
      }),
      async () => ({
        results: [makePage('page-2a')],
        has_more: false,
        next_cursor: undefined,
      }),
    ]);

    const result = await queryNotionDatabase(adapter, {
      dataSourceId: 'ds-1',
      mapPages,
    });

    expect(result.items).toEqual([
      { id: 'page-1a' },
      { id: 'page-1b' },
      { id: 'page-2a' },
    ]);
    expect(result.error).toBeUndefined();
  });

  it('keeps already-fetched pages and carries the error when a later page fails', async () => {
    const adapter = makeAdapter([
      async () => ({
        results: [makePage('page-1a')],
        has_more: true,
        next_cursor: 'cursor-2',
      }),
      () => {
        throw new Error('Notion API failure on page 2');
      },
    ]);

    const result = await queryNotionDatabase(adapter, {
      dataSourceId: 'ds-1',
      mapPages,
    });

    expect(result.items).toEqual([{ id: 'page-1a' }]);
    expect(result.error).toBe('Notion API failure on page 2');
  });

  it('returns empty items plus error when the first page request fails', async () => {
    const adapter = makeAdapter([
      () => {
        throw new Error('Notion API failure on page 1');
      },
    ]);

    const result = await queryNotionDatabase(adapter, {
      dataSourceId: 'ds-1',
      mapPages,
    });

    expect(result.items).toEqual([]);
    expect(result.error).toBe('Notion API failure on page 1');
  });

  it('stops paginating when has_more is false', async () => {
    const query = vi.fn(async () => ({
      results: [makePage('page-1a')],
      has_more: false,
      next_cursor: undefined,
    }));
    // biome-ignore lint/suspicious/noExplicitAny: mock not matching NotionClientAdapter type exactly
    const adapter = { query } as any;

    const result = await queryNotionDatabase(adapter, {
      dataSourceId: 'ds-1',
      mapPages,
    });

    expect(result.items).toEqual([{ id: 'page-1a' }]);
    expect(query).toHaveBeenCalledTimes(1);
  });
});
