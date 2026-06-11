import type {
  PageObjectResponse,
  QueryDataSourceParameters,
  QueryDataSourceResponse,
} from '@notionhq/client';

export type NotionPage = PageObjectResponse;

export interface NotionClientAdapter {
  query(
    params: Omit<QueryDataSourceParameters, 'auth'>,
  ): Promise<QueryDataSourceResponse>;
}

export type NotionPropertyMap<T> = (pages: Array<NotionPage>) => Array<T>;

export interface QueryNotionDatabaseConfig {
  dataSourceId: string;
  filter?: QueryDataSourceParameters['filter'];
  sorts?: QueryDataSourceParameters['sorts'];
  mapPages: NotionPropertyMap<unknown>;
}

export type DirectoryQueryResult<T> = {
  items: Array<T>;
  error?: string;
};
