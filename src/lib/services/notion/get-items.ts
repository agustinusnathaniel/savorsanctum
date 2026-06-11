import { createServerFn } from '@tanstack/react-start';
import {
  setResponseHeader,
  setResponseStatus,
} from '@tanstack/react-start/server';

import type { DirectoryItem } from '@/lib/models/collection-data';
import { getCulinaries } from '@/lib/services/notion/culinaries-db';
import { getProducts } from '@/lib/services/notion/products-db';

export const getItems = createServerFn({ method: 'GET' }).handler(async () => {
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

  setResponseHeader(
    'Cache-Control',
    'public, max-age=300, stale-while-revalidate=600',
  );
  setResponseStatus(200);
  return { items };
});
