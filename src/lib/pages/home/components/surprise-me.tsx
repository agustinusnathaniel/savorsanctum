import { Shuffle } from 'lucide-react';
import { useCallback, useState } from 'react';

import type { DirectoryItem } from '@/lib/models/collection-data';

interface SurpriseMeProps {
  items: Array<DirectoryItem>;
}

export function SurpriseMe({ items }: SurpriseMeProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleAnimationEnd = () => {
    if (!isVisible) {
      setIsVisible(true);
    }
  };

  const pickRandom = useCallback(() => {
    if (items.length === 0) {
      return;
    }
    const randomItem = items[Math.floor(Math.random() * items.length)];
    window.open(randomItem.link, '_blank', 'noopener,noreferrer');
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={pickRandom}
      onAnimationEnd={handleAnimationEnd}
      className={`fixed bottom-8 left-6 rounded-full bg-primary text-primary-foreground p-3 shadow-lg hover:shadow-xl hover:scale-110 transition-colors duration-200 active:scale-95 ${
        isVisible ? 'animate-bounce-in' : 'animate-bounce-out'
      }`}
      aria-label="Surprise me — open a random item"
    >
      <Shuffle className="h-5 w-5" />
    </button>
  );
}
