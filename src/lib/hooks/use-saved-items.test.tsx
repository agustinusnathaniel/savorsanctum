// @vitest-environment jsdom

import { act, renderHook } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it } from 'vite-plus/test';

import { useSavedItems } from '@/lib/hooks/use-saved-items';

const STORAGE_KEY = 'savorsanctum.saved-items';

function SavedIdsProbe() {
  const { savedIds } = useSavedItems();
  return <div data-testid="saved-probe">{savedIds.join(',')}</div>;
}

/** Simulates a cross-tab storage write; jsdom never fires real storage events. */
function emitStorageEvent(key: string) {
  window.dispatchEvent(
    new StorageEvent('storage', { key, storageArea: window.localStorage }),
  );
}

describe('useSavedItems', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it('starts with an empty saved list when nothing is stored', () => {
    const { result } = renderHook(() => useSavedItems());
    expect(result.current.savedIds).toEqual([]);
  });

  it('toggleSaved adds an id to the list and persists it', () => {
    const { result } = renderHook(() => useSavedItems());

    act(() => {
      result.current.toggleSaved('item-1');
    });

    expect(result.current.savedIds).toEqual(['item-1']);
    expect(
      JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]'),
    ).toEqual(['item-1']);
  });
});

describe('useSavedItems', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it('toggleSaved removes an already-saved id and persists the removal', () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(['item-1', 'item-2']),
    );
    const { result } = renderHook(() => useSavedItems());

    expect(result.current.savedIds).toEqual(['item-1', 'item-2']);

    act(() => {
      result.current.toggleSaved('item-1');
    });

    expect(result.current.savedIds).toEqual(['item-2']);
    expect(
      JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]'),
    ).toEqual(['item-2']);
  });

  it('restores saved ids from localStorage on first render', () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(['item-9']));
    const { result } = renderHook(() => useSavedItems());

    expect(result.current.savedIds).toEqual(['item-9']);
  });

  it('tolerates corrupt stored JSON', () => {
    window.localStorage.setItem(STORAGE_KEY, 'not-json{{');
    const { result } = renderHook(() => useSavedItems());

    expect(result.current.savedIds).toEqual([]);
  });

  it('toggles multiple ids independently', () => {
    const { result } = renderHook(() => useSavedItems());

    act(() => {
      result.current.toggleSaved('a');
      result.current.toggleSaved('b');
    });
    expect(result.current.savedIds).toEqual(['a', 'b']);

    act(() => {
      result.current.toggleSaved('a');
    });
    expect(result.current.savedIds).toEqual(['b']);
  });
});

describe('useSavedItems', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it('renders empty on the server even when localStorage has saved ids', () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(['item-9']));

    const html = renderToString(<SavedIdsProbe />);

    expect(html).toContain('saved-probe');
    expect(html).not.toContain('item-9');
  });

  it('syncs saved ids from other tabs via the storage event', () => {
    const { result } = renderHook(() => useSavedItems());
    expect(result.current.savedIds).toEqual([]);

    act(() => {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(['tab-2-item']));
      emitStorageEvent(STORAGE_KEY);
    });

    expect(result.current.savedIds).toEqual(['tab-2-item']);
  });

  it('ignores storage events for other keys', () => {
    const { result } = renderHook(() => useSavedItems());

    act(() => {
      result.current.toggleSaved('item-1');
    });
    expect(result.current.savedIds).toEqual(['item-1']);

    act(() => {
      window.localStorage.setItem('some-other-key', 'x');
      emitStorageEvent('some-other-key');
    });

    expect(result.current.savedIds).toEqual(['item-1']);
  });
});
