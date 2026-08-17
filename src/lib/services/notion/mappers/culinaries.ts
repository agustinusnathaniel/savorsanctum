import { createMapper } from '@/lib/services/notion/mappers/create-mapper';
import type { QueryNotionDatabaseConfig } from '@/lib/services/notion/types';

const culinariesFilter: QueryNotionDatabaseConfig['filter'] = {
  and: [
    {
      property: 'Review',
      type: 'multi_select',
      multi_select: {
        contains: 'recommended',
        does_not_contain: 'closed',
      },
    },
  ],
};

const culinariesSorts: QueryNotionDatabaseConfig['sorts'] = [
  { property: 'Created time', direction: 'descending' },
];

export const { mapPage: mapCulinariesPage, fetchData: getCulinaries } =
  createMapper({
    category: 'food',
    dataSourceId: import.meta.env.VITE_NOTION_CULINARIES_DATASOURCE_ID,
    filter: culinariesFilter,
    sorts: culinariesSorts,
    locationField: 'Area / Location',
    mapReviews: (reviews) =>
      reviews.filter(
        (review) =>
          !['recommended', 'Duo Parents Approvable'].includes(review.name),
      ),
  });
