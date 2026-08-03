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

function getFromCache<T>(query: unknown): { data: T; isStale: boolean } | null {
  const key = getCacheKey(query);
  const entry = cache.get(key);
  if (!entry) {
    return null;
  }

  const isStale = Date.now() - entry.timestamp > CACHE_TTL;
  return { data: entry.data as T, isStale };
}

function setInCache<T>(query: unknown, data: T): void {
  const key = getCacheKey(query);
  cache.set(key, { data, timestamp: Date.now() });
}

function executeAndCache<T>(
  query: unknown,
  executor: () => Promise<T>,
  key: string,
): Promise<T> {
  const promise = executor()
    .then((data) => {
      setInCache(query, data);
      return data;
    })
    .finally(() => {
      pendingPromises.delete(key);
    });
  pendingPromises.set(key, promise);
  return promise;
}

export async function cachedQuery<T>(
  query: unknown,
  executor: () => Promise<T>,
): Promise<T> {
  const key = getCacheKey(query);

  // Deduplicate concurrent requests per key
  const pending = pendingPromises.get(key);
  if (pending) {
    return pending.catch(() => {
      const cached = getFromCache<T>(query);
      if (cached) {
        return cached.data;
      }
      throw new Error('Query failed and no cached data available');
    }) as Promise<T>;
  }

  // Check cache
  const cached = getFromCache<T>(query);
  if (cached) {
    if (!cached.isStale) {
      // Cache hit (fresh) — return immediately
      return cached.data;
    }
    // Cache hit (stale) — trigger background refresh, return stale data
    executeAndCache(query, executor, key).catch(() => {
      // Background refresh failed — keep serving stale data; next request retries
    });
    return cached.data;
  }

  // Cache miss — execute, cache, and await result
  return await executeAndCache(query, executor, key);
}
