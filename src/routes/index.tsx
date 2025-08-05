import { createFileRoute, stripSearchParams } from '@tanstack/react-router';
import { fallback, zodValidator } from '@tanstack/zod-adapter';
import z from 'zod';

import Home from '@/lib/pages/home';
import { getPlaces } from '@/lib/services/notion/food-db';

const placeSearchSchema = z.object({
  keyword: fallback(z.string(), '').default(''),
});

const defaultSearchParams = {
  keyword: '',
};

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => {
    const foodPlaces = await getPlaces();

    return {
      foodPlaces,
    };
  },
  validateSearch: zodValidator(placeSearchSchema),
  search: {
    middlewares: [stripSearchParams(defaultSearchParams)],
  },
  /**
   * prevent running loader again
   * https://tanstack.com/router/v1/docs/framework/react/guide/data-loading#using-shouldreload-and-gctime-to-opt-out-of-caching
   */
  shouldReload: false,
});
