export const DIR_CATEGORIES = ['food', 'products', 'reading'] as const;

export type Category = (typeof DIR_CATEGORIES)[number];

export interface NamedEntry {
  name: string;
}

export interface DirectoryItem {
  id: string;
  name: string;
  category: Category;
  link: string;
  image: string;
  reviews: Array<NamedEntry>;
  tags: Array<NamedEntry>;
  location: Array<NamedEntry>;
  created_time: string;
}
