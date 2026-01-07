import { isFullPageOrDataSource } from '@notionhq/client';

import { notion } from './core';

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: -
export const getProducts = async () => {
  let next_cursor: string | null | undefined;
  const results = [];
  do {
    const res = await notion.dataSources.query({
      data_source_id: import.meta.env.VITE_NOTION_PRODUCTS_DATASOURCE_ID,
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
              does_not_contain: 'warning',
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

    const imageFile =
      properties.Image.type === 'files'
        ? // biome-ignore lint/suspicious/noExplicitAny: -
          (properties.Image.files as Array<any>)?.[0]
        : undefined;

    entries.push({
      id: page.id,
      category: 'products' as const,
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
      image: imageFile?.external?.url ?? imageFile?.file?.url ?? '',
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
    });
  }

  return entries;
};
