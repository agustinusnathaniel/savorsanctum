import { createServerFn } from '@tanstack/react-start';
import {
  setResponseHeader,
  setResponseStatus,
} from '@tanstack/react-start/server';

import type { DirectoryItem } from '@/lib/models/collection-data';
import { getCulinaries } from '@/lib/services/notion/mappers/culinaries';
import { getProducts } from '@/lib/services/notion/mappers/products';
import { createNotionHttpAdapter } from '@/lib/services/notion/notion-http';
import type { DirectoryQueryResult } from '@/lib/services/notion/types';

/**
 * Merges both sources, keeping whatever succeeded. If either source failed,
 * the error is carried alongside the partial items so the UI can show a
 * warning banner instead of blanking the whole directory.
 */
export function mergeSourceResults(
  culinaries: DirectoryQueryResult<DirectoryItem>,
  products: DirectoryQueryResult<DirectoryItem>,
): DirectoryQueryResult<DirectoryItem> {
  const items = [...culinaries.items, ...products.items].sort((a, b) =>
    b.created_time > a.created_time ? 1 : -1,
  );

  const error = culinaries.error ?? products.error;

  return error ? { items, error } : { items };
}

export const getItems = createServerFn({ method: 'GET' }).handler(
  async (): Promise<DirectoryQueryResult<DirectoryItem>> => {
    const adapter = createNotionHttpAdapter();

    const [culinaries, products] = await Promise.all([
      getCulinaries(adapter),
      getProducts(adapter),
    ]);

    const result = mergeSourceResults(culinaries, products);

    setResponseHeader(
      'Cache-Control',
      'public, max-age=300, stale-while-revalidate=600',
    );
    setResponseStatus(200);

    return result;
  },
);
