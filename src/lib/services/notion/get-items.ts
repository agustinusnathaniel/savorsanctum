import type { DirectoryItem } from '@/lib/models/collection-data';
import { getCulinaries } from '@/lib/services/notion/culinaries-db';
import { getProducts } from '@/lib/services/notion/products-db';

export const getItems = async () => {
  const [culinaries, products] = await Promise.all([
    getCulinaries(),
    getProducts(),
  ]);

  const items = [
    ...culinaries,
    ...products.map((item) => ({ ...item, reviews: [] })),
  ].sort((a, b) =>
    b.created_time > a.created_time ? 1 : -1,
  ) as Array<DirectoryItem>;

  return { items };
};
