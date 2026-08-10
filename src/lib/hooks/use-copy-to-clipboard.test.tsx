// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vite-plus/test';

import { useCopyToClipboard } from '@/lib/hooks/use-copy-to-clipboard';

function captureUnhandledRejections() {
  const unhandled: Array<unknown> = [];
  const onRejection = (reason: unknown) => {
    unhandled.push(reason);
  };
  process.on('unhandledRejection', onRejection);
  return {
    unhandled,
    stop() {
      process.off('unhandledRejection', onRejection);
    },
  };
}

describe('useCopyToClipboard', () => {
  let writeText: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      configurable: true,
    });
  });

  it('copy() calls navigator.clipboard.writeText with the given text', async () => {
    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => {
      result.current.copy('https://example.com/place');
      await Promise.resolve();
    });

    expect(writeText).toHaveBeenCalledWith('https://example.com/place');
  });

  it('flips copied to true after copying and back to false after the reset window', async () => {
    const { result } = renderHook(() => useCopyToClipboard());

    expect(result.current.copied).toBe(false);

    await act(async () => {
      result.current.copy('https://example.com/place');
      await Promise.resolve();
    });
    expect(result.current.copied).toBe(true);

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(result.current.copied).toBe(false);
  });

  it('keeps copied false when writeText rejects (silent failure)', async () => {
    const { unhandled, stop } = captureUnhandledRejections();
    writeText.mockRejectedValue(new Error('clipboard denied'));
    const { result } = renderHook(() => useCopyToClipboard());

    try {
      await act(async () => {
        result.current.copy('https://example.com/place');
        await Promise.resolve();
      });
    } finally {
      stop();
    }

    expect(result.current.copied).toBe(false);
    expect(unhandled).toEqual([]);
  });

  it('keeps copied true for the full window after rapid copies (no stale timer)', async () => {
    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => {
      result.current.copy('https://example.com/first');
      await Promise.resolve();
    });
    expect(result.current.copied).toBe(true);

    await act(async () => {
      vi.advanceTimersByTime(1000);
      result.current.copy('https://example.com/second');
      await Promise.resolve();
    });
    expect(result.current.copied).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.copied).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.copied).toBe(false);
  });
});
