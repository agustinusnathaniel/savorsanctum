import { createFileRoute, stripSearchParams } from '@tanstack/react-router';
import z from 'zod';

import Home from '@/lib/pages/home';
import { getPlaces } from '@/lib/services/notion/food-db';

const placeSearchSchema = z.object({
  keyword: z.string().default('').catch(''),
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
  validateSearch: placeSearchSchema,
  search: {
    middlewares: [stripSearchParams(defaultSearchParams)],
  },
  /**
   * prevent running loader again
   * https://tanstack.com/router/v1/docs/framework/react/guide/data-loading#using-shouldreload-and-gctime-to-opt-out-of-caching
   * for this to work we also need to disable or not use loaderDeps
   */
  shouldReload: false,
});
