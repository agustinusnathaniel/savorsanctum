import { useCallback, useState } from 'react';

const SAVED_ITEMS_STORAGE_KEY = 'savorsanctum.saved-items';

function readSavedIds(): Array<string> {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(SAVED_ITEMS_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === 'string')
      : [];
  } catch {
    return [];
  }
}

export function useSavedItems() {
  const [savedIds, setSavedIds] = useState<Array<string>>(readSavedIds);

  const toggleSaved = useCallback((id: string) => {
    setSavedIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((savedId) => savedId !== id)
        : [...prev, id];
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(
          SAVED_ITEMS_STORAGE_KEY,
          JSON.stringify(next),
        );
      }
      return next;
    });
  }, []);

  return { savedIds, toggleSaved };
}
