import { useCallback } from 'react';
import useLocalStorageState from 'use-local-storage-state';

const SAVED_ITEMS_STORAGE_KEY = 'savorsanctum.saved-items';

/**
 * Saved-item ids persisted in localStorage. Cross-tab sync and SSR-safe
 * hydration are provided by use-local-storage-state (defaultValue is served
 * until the client reads the real stored value).
 */
export function useSavedItems() {
  const [savedIds, setSavedIds] = useLocalStorageState<Array<string>>(
    SAVED_ITEMS_STORAGE_KEY,
    { defaultValue: [] },
  );

  const toggleSaved = useCallback(
    (id: string) => {
      setSavedIds((prev = []) =>
        prev.includes(id)
          ? prev.filter((savedId) => savedId !== id)
          : [...prev, id],
      );
    },
    [setSavedIds],
  );

  return { savedIds, toggleSaved };
}
