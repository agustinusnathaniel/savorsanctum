import type {
  PageObjectResponse,
  QueryDataSourceParameters,
  QueryDataSourceResponse,
} from '@notionhq/client';
import { isFullPageOrDataSource } from '@notionhq/client';

import type {
  DirectoryQueryResult,
  NotionClientAdapter,
  NotionPage,
  QueryNotionDatabaseConfig,
} from '@/lib/services/notion/types';

function isPage(
  page: PageObjectResponse | { object: string },
): page is PageObjectResponse {
  return page.object === 'page';
}

async function fetchAllPages(
  adapter: NotionClientAdapter,
  params: Omit<QueryDataSourceParameters, 'auth'>,
): Promise<{ pages: Array<NotionPage>; error?: string }> {
  const pages: Array<NotionPage> = [];
  let nextCursor: string | null | undefined;

  do {
    try {
      const res: QueryDataSourceResponse = await adapter.query({
        ...params,
        start_cursor: nextCursor || undefined,
      });

      for (const page of res.results) {
        if (isFullPageOrDataSource(page) && isPage(page)) {
          pages.push(page);
        }
      }

      nextCursor = res.has_more ? res.next_cursor : undefined;
    } catch (error) {
      // Keep the pages fetched so far; carry the error so the UI can show
      // a warning banner instead of a full error state.
      return {
        pages,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  } while (nextCursor);

  return { pages };
}

export async function queryNotionDatabase<T>(
  adapter: NotionClientAdapter,
  config: QueryNotionDatabaseConfig,
): Promise<DirectoryQueryResult<T>> {
  const { pages, error } = await fetchAllPages(adapter, {
    data_source_id: config.dataSourceId,
    sorts: config.sorts,
    filter: config.filter,
    page_size: 100,
  });

  const items = config.mapPages(pages) as Array<T>;

  return error ? { items, error } : { items };
}
