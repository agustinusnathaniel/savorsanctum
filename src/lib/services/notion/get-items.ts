import { getCulinaries } from '@/lib/services/notion/culinaries-db';
import { getProducts } from '@/lib/services/notion/products-db';

export const getItems = async () => {
  const culinaries = await getCulinaries();
  const products = await getProducts();

  const items = [
    ...culinaries,
    ...products.map((item) => ({ ...item, reviews: [] })),
  ];

  return { items };
};
