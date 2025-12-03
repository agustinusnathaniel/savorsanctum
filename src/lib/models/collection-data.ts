import type { getItems } from '@/lib/services/notion/get-items';

export const DIR_CATEGORIES = ['food', 'products', 'reading'] as const;

export type Category = (typeof DIR_CATEGORIES)[number];

export type DirectoryItem = Awaited<
  ReturnType<typeof getItems>
>['items'][number] & {
  image?: string;
  category: Category;
};
