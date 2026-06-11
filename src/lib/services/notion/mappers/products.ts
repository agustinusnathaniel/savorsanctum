import type { DirectoryItem } from '@/lib/models/collection-data';
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

function extractImage(
  files: Array<{ external?: { url: string }; file?: { url: string } }>,
): string {
  const first = files?.[0];
  return first?.external?.url ?? first?.file?.url ?? '';
}

function mapProductsPage(page: NotionPage): DirectoryItem {
  const { properties } = page;

  return {
    id: page.id,
    category: 'products',
    name:
      properties.Name.type === 'title'
        ? (properties.Name.title?.[0]?.plain_text ?? '')
        : '',
    link: properties.Link.type === 'url' ? (properties.Link.url ?? '') : '',
    image:
      properties.Image.type === 'files'
        ? extractImage(
            properties.Image.files as Array<{
              external?: { url: string };
              file?: { url: string };
            }>,
          )
        : '',
    reviews: [],
    tags:
      properties.Tags.type === 'multi_select'
        ? properties.Tags.multi_select
        : [],
    location:
      properties.Location.type === 'multi_select'
        ? properties.Location.multi_select
        : [],
    created_time:
      properties['Created time'].type === 'created_time'
        ? properties['Created time'].created_time
        : '',
  };
}

export function getProductsMapper() {
  return mapProductsPage;
}

export function getProducts(adapter: NotionClientAdapter) {
  return queryNotionDatabase<DirectoryItem>(adapter, {
    dataSourceId: import.meta.env.VITE_NOTION_PRODUCTS_DATASOURCE_ID,
    filter: productsFilter,
    sorts: productsSorts,
    mapPages: (pages) => pages.map(mapProductsPage),
  });
}
