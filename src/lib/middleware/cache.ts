import { createMiddleware } from '@tanstack/react-start';

export const cacheMiddleware = createMiddleware().server(async ({ next }) => {
  const result = await next();

  result.response.headers.set(
    'Cache-Control',
    'public, s-maxage=300, stale-while-revalidate=600',
  );

  return result;
});
