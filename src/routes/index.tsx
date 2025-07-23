import { createFileRoute } from '@tanstack/react-router';

import Home from '@/lib/pages/home';
import { getPlaces } from '@/lib/services/notion/food-db';

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => {
    const foodPlaces = await getPlaces();
    return {
      foodPlaces,
    };
  },
});
