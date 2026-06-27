const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
const pendingPromises = new Map<string, Promise<unknown>>();

function getCacheKey(query: unknown): string {
  return JSON.stringify(query);
}

export function getFromCache<T>(
  query: unknown,
): { data: T; isStale: boolean } | null {
  const key = getCacheKey(query);
  const entry = cache.get(key);
  if (!entry) {
    return null;
  }

  const isStale = Date.now() - entry.timestamp > CACHE_TTL;
  return { data: entry.data as T, isStale };
}

export function setInCache<T>(query: unknown, data: T): void {
  const key = getCacheKey(query);
  cache.set(key, { data, timestamp: Date.now() });
}

export function clearCache(): void {
  cache.clear();
  pendingPromises.clear();
}

export async function cachedQuery<T>(
  query: unknown,
  executor: () => Promise<T>,
): Promise<T> {
  const key = getCacheKey(query);

  // Deduplicate concurrent requests per key
  const pending = pendingPromises.get(key);
  if (pending) {
    return pending as Promise<T>;
  }

  // Check cache
  const cached = getFromCache<T>(query);
  if (cached) {
    if (!cached.isStale) {
      // Cache hit (fresh) — return immediately
      return cached.data;
    }
    // Cache hit (stale) — trigger background refresh, return stale data
    const promise = executor()
      .then((data) => {
        setInCache(query, data);
        return data;
      })
      .finally(() => {
        pendingPromises.delete(key);
      });
    pendingPromises.set(key, promise);
    return cached.data;
  }

  // Cache miss — execute and cache
  const promise = executor()
    .then((data) => {
      setInCache(query, data);
      return data;
    })
    .finally(() => {
      pendingPromises.delete(key);
    });
  pendingPromises.set(key, promise);
  return await promise;
}
