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

const sharePayload = {
  title: 'Test',
  text: 'Test',
  url: 'https://example.com/item',
};

function setupShareTestEnv() {
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText },
    configurable: true,
  });
  // Ensure navigator.share is undefined by default
  if ('share' in navigator) {
    // biome-ignore lint/suspicious/noExplicitAny: test setup
    delete (navigator as any).share;
  }
  return writeText;
}

function teardownShareTestEnv() {
  Object.defineProperty(navigator, 'clipboard', {
    value: undefined,
    configurable: true,
  });
  if ('share' in navigator) {
    // biome-ignore lint/suspicious/noExplicitAny: test cleanup
    delete (navigator as any).share;
  }
}

describe('useShare', () => {
  let writeText: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    writeText = setupShareTestEnv();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    teardownShareTestEnv();
  });

  it('falls back to clipboard when navigator.share is undefined', async () => {
    const { result } = renderHook(() => useShare());

    await act(async () => {
      await result.current.share(sharePayload);
    });

    expect(writeText).toHaveBeenCalledWith(sharePayload.url);
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

    await act(async () => {
      await result.current.share(sharePayload);
    });

    expect(shareMock).toHaveBeenCalledWith(sharePayload);
    expect(writeText).not.toHaveBeenCalled();
    expect(result.current.shared).toBe(true);
  });
});

describe('useShare', () => {
  let writeText: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    writeText = setupShareTestEnv();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    teardownShareTestEnv();
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

    await act(async () => {
      await result.current.share(sharePayload);
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

    await act(async () => {
      await result.current.share(sharePayload);
    });

    expect(writeText).toHaveBeenCalledWith(sharePayload.url);
    expect(result.current.shared).toBe(true);
  });
});
