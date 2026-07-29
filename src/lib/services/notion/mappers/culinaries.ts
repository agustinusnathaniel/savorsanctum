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

export function mapCulinariesPage(page: NotionPage): DirectoryItem {
  const { properties } = page;

  return {
    id: page.id,
    category: 'food',
    name: getTitleText(properties, 'Name'),
    link: getUrl(properties, 'Link'),
    image: getFilesImage(properties, 'Image'),
    reviews: getMultiSelectNames(properties, 'Review').filter(
      (review) =>
        !['recommended', 'Duo Parents Approvable'].includes(review.name),
    ),
    tags: getMultiSelectNames(properties, 'Tags'),
    location: getMultiSelectNames(properties, 'Area / Location'),
    created_time: getCreatedTime(properties, 'Created time'),
  };
}

export function getCulinaries(adapter: NotionClientAdapter) {
  return queryNotionDatabase<DirectoryItem>(adapter, {
    dataSourceId: import.meta.env.VITE_NOTION_CULINARIES_DATASOURCE_ID,
    filter: culinariesFilter,
    sorts: culinariesSorts,
    mapPages: (pages) => pages.map(mapCulinariesPage),
  });
}
