// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vite-plus/test';

import { useSavedItems } from '@/lib/hooks/use-saved-items';

const STORAGE_KEY = 'savorsanctum.saved-items';

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
