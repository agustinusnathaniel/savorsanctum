import type {
  QueryDataSourceParameters,
  QueryDataSourceResponse,
} from '@notionhq/client';

import { notion } from '@/lib/services/notion/core';
import type { NotionClientAdapter } from '@/lib/services/notion/types';

export const createNotionHttpAdapter = (): NotionClientAdapter => ({
  query: (
    params: Omit<QueryDataSourceParameters, 'auth'>,
  ): Promise<QueryDataSourceResponse> =>
    notion.dataSources.query(params as QueryDataSourceParameters),
});
