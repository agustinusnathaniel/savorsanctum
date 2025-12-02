import { isFullPageOrDataSource } from '@notionhq/client';

import { notion } from './core';

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
      name:
        properties.Name.type === 'title'
          ? // @ts-ignore
            properties.Name.title?.[0]?.plain_text
          : '',
      tags:
        properties.Tags.type === 'multi_select'
          ? properties.Tags.multi_select
          : [],
      location:
        properties['Location'].type === 'multi_select'
          ? properties['Location'].multi_select
          : [],
    });
  }

  return entries;
};
