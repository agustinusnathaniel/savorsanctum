import { useCallback, useSyncExternalStore } from 'react';

const SAVED_ITEMS_STORAGE_KEY = 'savorsanctum.saved-items';

const EMPTY_SAVED_IDS: Array<string> = [];

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

type Listener = () => void;

let currentIds: Array<string> | null = null;
const listeners = new Set<Listener>();

function getSnapshot(): Array<string> {
  if (currentIds === null) {
    currentIds = readSavedIds();
  }
  return currentIds;
}

function getServerSnapshot(): Array<string> {
  // Server render and hydration must never read localStorage. The client
  // re-renders with the real value right after hydration via
  // useSyncExternalStore, so there is no server/client mismatch.
  return EMPTY_SAVED_IDS;
}

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function setSavedIds(next: Array<string>) {
  currentIds = next;
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(SAVED_ITEMS_STORAGE_KEY, JSON.stringify(next));
  }
  emitChange();
}

function updateSavedIds(updater: (prev: Array<string>) => Array<string>) {
  setSavedIds(updater(currentIds ?? readSavedIds()));
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

if (typeof window !== 'undefined') {
  // Cross-tab sync: other tabs write localStorage, this tab re-reads it.
  window.addEventListener('storage', (event) => {
    if (event.key !== SAVED_ITEMS_STORAGE_KEY) {
      return;
    }
    currentIds = readSavedIds();
    emitChange();
  });
}

export function useSavedItems() {
  const savedIds = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const toggleSaved = useCallback((id: string) => {
    updateSavedIds((prev) =>
      prev.includes(id)
        ? prev.filter((savedId) => savedId !== id)
        : [...prev, id],
    );
  }, []);

  return { savedIds, toggleSaved };
}

/** @internal Test-only reset of the module-level store. */
export function __resetSavedItemsStore() {
  currentIds = null;
  listeners.clear();
}
