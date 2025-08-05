import { Client, isFullPageOrDatabase } from '@notionhq/client';

const notion = new Client({
  auth: import.meta.env.VITE_NOTION_TOKEN,
});

export const getPlaces = async () => {
  const res = await notion.databases.query({
    database_id: import.meta.env.VITE_NOTION_DATABASE_ID,
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
    page_size: 20,
  });

  const entries = [];

  for (const page of res.results) {
    if (!isFullPageOrDatabase(page)) {
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
    });
  }

  return entries;
};
