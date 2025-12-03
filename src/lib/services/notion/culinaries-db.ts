import { isFullPageOrDataSource } from '@notionhq/client';

import { notion } from './core';

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: -
export const getCulinaries = async () => {
  let next_cursor: string | null | undefined;
  const results = [];

  do {
    const res = await notion.dataSources.query({
      data_source_id: import.meta.env.VITE_NOTION_CULINARIES_DATASOURCE_ID,
      sorts: [
        {
          property: 'Created time',
          direction: 'descending',
        },
      ],
      filter: {
        and: [
          {
            property: 'Review',
            type: 'multi_select',
            multi_select: {
              contains: 'recommended',
            },
          },
        ],
      },
      page_size: 100, // max allowed
      start_cursor: next_cursor || undefined,
    });
    results.push(...res.results);
    next_cursor = res.has_more ? res.next_cursor : undefined;
  } while (next_cursor);

  const entries = [];

  for (const page of results) {
    if (!isFullPageOrDataSource(page)) {
      continue;
    }

    const properties = page.properties;

    entries.push({
      id: page.id,
      category: 'food' as const,
      name:
        properties.Name.type === 'title'
          ? // @ts-ignore
            (properties.Name.title?.[0]?.plain_text as string)
          : '',
      link:
        properties.Link.type === 'url'
          ? // @ts-ignore
            properties.Link.url
          : '',
      image:
        properties.Image.type === 'files'
          ? // biome-ignore lint/suspicious/noExplicitAny: -
            (properties.Image.files as Array<any>)?.[0]?.file.url
          : '',
      reviews:
        properties.Review.type === 'multi_select'
          ? properties.Review.multi_select
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
    });
  }

  return entries;
};
