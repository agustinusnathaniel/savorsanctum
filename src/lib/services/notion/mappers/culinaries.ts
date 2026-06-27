import type { DirectoryItem } from '@/lib/models/collection-data';
import { queryNotionDatabase } from '@/lib/services/notion/query';
import type {
  NotionClientAdapter,
  NotionPage,
  QueryNotionDatabaseConfig,
} from '@/lib/services/notion/types';
import { extractImage } from '@/lib/services/notion/types';

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
    name:
      properties.Name.type === 'title'
        ? (properties.Name.title?.[0]?.plain_text ?? '')
        : '',
    link: properties.Link.type === 'url' ? (properties.Link.url ?? '') : '',
    image: extractImage(properties, 'Image'),
    reviews:
      properties.Review.type === 'multi_select'
        ? properties.Review.multi_select.filter(
            (review) =>
              !['recommended', 'Duo Parents Approvable'].includes(review.name),
          )
        : [],
    tags:
      properties.Tags.type === 'multi_select'
        ? properties.Tags.multi_select
        : [],
    location:
      properties['Area / Location'].type === 'multi_select'
        ? properties['Area / Location'].multi_select
        : [],
    created_time:
      properties['Created time'].type === 'created_time'
        ? properties['Created time'].created_time
        : '',
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
