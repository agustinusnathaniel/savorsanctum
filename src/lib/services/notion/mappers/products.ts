import { createMapper } from '@/lib/services/notion/mappers/create-mapper';
import type { QueryNotionDatabaseConfig } from '@/lib/services/notion/types';

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

export const { mapPage: mapProductsPage, fetchData: getProducts } =
  createMapper({
    category: 'products',
    dataSourceId: import.meta.env.VITE_NOTION_PRODUCTS_DATASOURCE_ID,
    filter: productsFilter,
    sorts: productsSorts,
    locationField: 'Location',
  });
