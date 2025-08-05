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
  loaderDeps: ({ search: { keyword } }) => ({ keyword }),
  loader: async ({ deps }) => {
    const foodPlaces = await getPlaces();
    const filtered = foodPlaces.filter((item) =>
      (item.name as string).toLowerCase().includes(deps.keyword),
    );

    return {
      foodPlaces: filtered,
    };
  },
  validateSearch: zodValidator(placeSearchSchema),
  search: {
    middlewares: [stripSearchParams(defaultSearchParams)],
  },
});
