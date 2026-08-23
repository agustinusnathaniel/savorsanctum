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

import { useShare } from '@/lib/hooks/use-share';

describe('useShare', () => {
  let writeText: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });
    // Ensure navigator.share is undefined by default
    if ('share' in navigator) {
      // biome-ignore lint/suspicious/noExplicitAny: test setup
      delete (navigator as any).share;
    }
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      configurable: true,
    });
    if ('share' in navigator) {
      // biome-ignore lint/suspicious/noExplicitAny: test cleanup
      delete (navigator as any).share;
    }
  });

  it('falls back to clipboard when navigator.share is undefined', async () => {
    const { result } = renderHook(() => useShare());

    const payload = {
      title: 'Test',
      text: 'Test',
      url: 'https://example.com/item',
    };

    await act(async () => {
      await result.current.share(payload);
    });

    expect(writeText).toHaveBeenCalledWith(payload.url);
    expect(result.current.shared).toBe(true);
  });

  it('uses native share when available', async () => {
    const shareMock = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', {
      ...navigator,
      share: shareMock,
      clipboard: { writeText },
    });

    const { result } = renderHook(() => useShare());

    const payload = {
      title: 'Test',
      text: 'Test',
      url: 'https://example.com/item',
    };

    await act(async () => {
      await result.current.share(payload);
    });

    expect(shareMock).toHaveBeenCalledWith(payload);
    expect(writeText).not.toHaveBeenCalled();
    expect(result.current.shared).toBe(true);
  });

  it('does nothing when user dismisses the share sheet', async () => {
    const shareMock = vi
      .fn()
      .mockRejectedValue(new DOMException('aborted', 'AbortError'));
    vi.stubGlobal('navigator', {
      ...navigator,
      share: shareMock,
      clipboard: { writeText },
    });

    const { result } = renderHook(() => useShare());

    const payload = {
      title: 'Test',
      text: 'Test',
      url: 'https://example.com/item',
    };

    await act(async () => {
      await result.current.share(payload);
    });

    expect(writeText).not.toHaveBeenCalled();
    expect(result.current.shared).toBe(false);
  });

  it('falls back to clipboard when native share fails with a non-abort error', async () => {
    const shareMock = vi
      .fn()
      .mockRejectedValue(new DOMException('denied', 'NotAllowedError'));
    vi.stubGlobal('navigator', {
      ...navigator,
      share: shareMock,
      clipboard: { writeText },
    });

    const { result } = renderHook(() => useShare());

    const payload = {
      title: 'Test',
      text: 'Test',
      url: 'https://example.com/item',
    };

    await act(async () => {
      await result.current.share(payload);
    });

    expect(writeText).toHaveBeenCalledWith(payload.url);
    expect(result.current.shared).toBe(true);
  });
});
