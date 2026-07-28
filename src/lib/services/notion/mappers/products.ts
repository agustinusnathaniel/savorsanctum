import type { DirectoryItem } from '@/lib/models/collection-data';
import {
  getCreatedTime,
  getFilesImage,
  getMultiSelectNames,
  getTitleText,
  getUrl,
} from '@/lib/services/notion/mappers/extractors';
import { queryNotionDatabase } from '@/lib/services/notion/query';
import type {
  NotionClientAdapter,
  NotionPage,
  QueryNotionDatabaseConfig,
} from '@/lib/services/notion/types';

const productsFilter: QueryNotionDatabaseConfig['filter'] = {
  and: [
    {
      property: 'Review',
      type: 'multi_select',
      multi_select: {
        does_not_contain: 'warning',
      },
    },
  ],
};

const productsSorts: QueryNotionDatabaseConfig['sorts'] = [
  { property: 'Created time', direction: 'descending' },
];

export function mapProductsPage(page: NotionPage): DirectoryItem {
  const { properties } = page;

  return {
    id: page.id,
    category: 'products',
    name: getTitleText(properties, 'Name'),
    link: getUrl(properties, 'Link'),
    image: getFilesImage(properties, 'Image'),
    reviews: [],
    tags: getMultiSelectNames(properties, 'Tags'),
    location: getMultiSelectNames(properties, 'Location'),
    created_time: getCreatedTime(properties, 'Created time'),
  };
}

export function getProducts(adapter: NotionClientAdapter) {
  return queryNotionDatabase<DirectoryItem>(adapter, {
    dataSourceId: import.meta.env.VITE_NOTION_PRODUCTS_DATASOURCE_ID,
    filter: productsFilter,
    sorts: productsSorts,
    mapPages: (pages) => pages.map(mapProductsPage),
  });
}
