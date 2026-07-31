import { afterEach, describe, expect, it, vi } from 'vite-plus/test';

import { cachedQuery } from '@/lib/services/notion/cache';

const CACHE_TTL = 5 * 60 * 1000;

afterEach(() => {
  vi.useRealTimers();
});

describe('cachedQuery', () => {
  it('cache miss -> executor called once, returns fresh data', async () => {
    const executor = vi.fn().mockResolvedValue('fresh');
    const result = await cachedQuery({ type: 'miss' }, executor);

    expect(result).toBe('fresh');
    expect(executor).toHaveBeenCalledTimes(1);
  });

  it('fresh cache hit -> returns cached data, executor NOT called again', async () => {
    const executor = vi.fn().mockResolvedValue('fresh');
    await cachedQuery({ type: 'fresh-hit' }, executor);

    const secondExecutor = vi.fn().mockResolvedValue('should-not-run');
    const result = await cachedQuery({ type: 'fresh-hit' }, secondExecutor);

    expect(result).toBe('fresh');
    expect(secondExecutor).not.toHaveBeenCalled();
  });

  it('stale hit -> returns stale data immediately AND triggers background refresh', async () => {
    vi.useFakeTimers();
    const executor = vi.fn().mockResolvedValue('fresh');
    await cachedQuery({ type: 'stale-hit' }, executor);
    expect(executor).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(CACHE_TTL + 1);
    const staleResult = await cachedQuery({ type: 'stale-hit' }, executor);
    expect(staleResult).toBe('fresh');

    await vi.runAllTimersAsync();
    expect(executor).toHaveBeenCalledTimes(2);
  });

  it('stale hit with rejecting executor -> returns stale data, does NOT throw', async () => {
    vi.useFakeTimers();
    const executor = vi.fn().mockResolvedValue('fresh');
    await cachedQuery({ type: 'rejecting' }, executor);

    vi.advanceTimersByTime(CACHE_TTL + 1);
    executor.mockRejectedValueOnce(new Error('Notion API down'));

    const staleResult = await cachedQuery({ type: 'rejecting' }, executor);
    expect(staleResult).toBe('fresh');
    expect(executor).toHaveBeenCalledTimes(2);

    await vi.runAllTimersAsync();
  });
});
