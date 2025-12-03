import { getCulinaries } from '@/lib/services/notion/culinaries-db';
import { getProducts } from '@/lib/services/notion/products-db';

export const getItems = async () => {
  const culinaries = await getCulinaries();
  const products = await getProducts();

  const items = [
    ...culinaries,
    ...products.map((item) => ({ ...item, reviews: [] })),
  ].sort((a, b) =>
    new Date(a.created_time as string).getTime() >
    new Date(b.created_time as string).getTime()
      ? 1
      : 0,
  );

  return { items };
};
