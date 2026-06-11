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

export const getItems = createServerFn({ method: 'GET' }).handler(
  async (): Promise<DirectoryQueryResult<DirectoryItem>> => {
    const adapter = createNotionHttpAdapter();

    const [culinaries, products] = await Promise.all([
      getCulinaries(adapter),
      getProducts(adapter),
    ]);

    if (culinaries.error || products.error) {
      const error = culinaries.error ?? products.error ?? 'Unknown query error';
      return { items: [], error };
    }

    const items = [...culinaries.items, ...products.items].sort((a, b) =>
      b.created_time > a.created_time ? 1 : -1,
    );

    setResponseHeader(
      'Cache-Control',
      'public, max-age=300, stale-while-revalidate=600',
    );
    setResponseStatus(200);

    return { items };
  },
);
