import type { DirectoryItem } from '@/lib/models/collection-data';

import { ItemCard } from './item-card';

interface ItemGridProps {
  items: Array<DirectoryItem>;
  highlightTerms?: Array<string>;
  highlightId?: string;
  savedIds: Array<string>;
  onToggleSave: (id: string) => void;
}

export function ItemGrid({
  items,
  highlightTerms,
  highlightId,
  savedIds,
  onToggleSave,
}: ItemGridProps) {
  return (
    <div className="mt-6 grid md:grid-cols-2 xl:grid-cols-3 gap-4">
      {items.map((item) => (
        <div key={item.id} className="mb-4 break-inside-avoid">
          <ItemCard
            item={item}
            highlightTerms={highlightTerms}
            highlightId={highlightId}
            isSaved={savedIds.includes(item.id)}
            onToggleSave={onToggleSave}
          />
        </div>
      ))}
    </div>
  );
}
