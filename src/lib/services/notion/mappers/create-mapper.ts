import type {
  Category,
  DirectoryItem,
  NamedEntry,
} from '@/lib/models/collection-data';
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

export interface MapperConfig {
  category: Category;
  dataSourceId: string;
  filter?: QueryNotionDatabaseConfig['filter'];
  sorts?: QueryNotionDatabaseConfig['sorts'];
  locationField: string;
  mapReviews?: (reviews: Array<NamedEntry>) => Array<NamedEntry>;
}

export function createMapper(config: MapperConfig) {
  const { category, dataSourceId, filter, sorts, locationField, mapReviews } =
    config;

  function mapPage(page: NotionPage): DirectoryItem {
    const { properties } = page;

    return {
      id: page.id,
      category,
      name: getTitleText(properties, 'Name'),
      link: getUrl(properties, 'Link'),
      image: getFilesImage(properties, 'Image'),
      reviews: mapReviews
        ? mapReviews(getMultiSelectNames(properties, 'Review'))
        : [],
      tags: getMultiSelectNames(properties, 'Tags'),
      location: getMultiSelectNames(properties, locationField),
      created_time: getCreatedTime(properties, 'Created time'),
    };
  }

  function fetchData(adapter: NotionClientAdapter) {
    return queryNotionDatabase<DirectoryItem>(adapter, {
      dataSourceId,
      filter,
      sorts,
      mapPages: (pages) => pages.map(mapPage),
    });
  }

  return { mapPage, fetchData };
}
