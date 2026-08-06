import { SITE_DESCRIPTION, SITE_TITLE } from '@/lib/constants/site';
import type { DirectoryItem } from '@/lib/models/collection-data';

interface ItemListElement {
  '@type': 'ListItem';
  position: number;
  item: {
    '@type': 'FoodEstablishment' | 'Product';
    name: string;
    url?: string;
    image?: string;
  };
}

export function buildItemListSchema(items: Array<DirectoryItem>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: SITE_TITLE,
    description: SITE_DESCRIPTION,
    itemListElement: items.map<ItemListElement>((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': item.category === 'food' ? 'FoodEstablishment' : 'Product',
        name: item.name,
        ...(item.link ? { url: item.link } : {}),
        ...(item.image ? { image: item.image } : {}),
      },
    })),
  };
}
