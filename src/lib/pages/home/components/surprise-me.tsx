import { Shuffle } from 'lucide-react';
import { useCallback } from 'react';

import type { DirectoryItem } from '@/lib/models/collection-data';

interface SurpriseMeProps {
  items: Array<DirectoryItem>;
  onPick: (item: DirectoryItem) => void;
}

export function SurpriseMe({ items, onPick }: SurpriseMeProps) {
  const pickRandom = useCallback(() => {
    if (items.length === 0) {
      return;
    }
    const randomItem = items[Math.floor(Math.random() * items.length)];
    onPick(randomItem);
  }, [items, onPick]);

  if (items.length === 0) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={pickRandom}
      data-umami-event="surprise-me"
      className="fixed z-20 bottom-8 left-6 rounded-full bg-primary text-primary-foreground p-3 shadow-lg hover:shadow-xl hover:scale-110 transition-colors duration-200 active:scale-95 motion-safe:animate-bounce-in motion-reduce:opacity-100"
      aria-label="Surprise me — reveal a random item"
    >
      <Shuffle className="h-5 w-5" />
    </button>
  );
}
