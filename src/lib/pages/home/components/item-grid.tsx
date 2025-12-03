import type { DirectoryItem } from '@/lib/models/collection-data';

import { ItemCard } from './item-card';

interface ItemGridProps {
  items: Array<DirectoryItem>;
  highlightTerms?: Array<string>;
}

export function ItemGrid({ items, highlightTerms }: ItemGridProps) {
  return (
    <div className="mt-6 columns-1 gap-4 md:columns-2 lg:columns-3">
      {items.map((item) => (
        <div key={item.id} className="mb-4 break-inside-avoid">
          <ItemCard item={item} highlightTerms={highlightTerms} />
        </div>
      ))}
    </div>
  );
}
