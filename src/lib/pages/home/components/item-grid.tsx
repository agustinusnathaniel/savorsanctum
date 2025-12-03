import type { DirectoryItem } from '@/lib/models/collection-data';

import { ItemCard } from './item-card';

interface ItemGridProps {
  items: Array<DirectoryItem>;
  highlightTerms?: Array<string>;
}

export function ItemGrid({ items, highlightTerms }: ItemGridProps) {
  return (
    <div className="mt-6 grid md:grid-cols-2 xl:grid-cols-3 gap-4">
      {items.map((item) => (
        <div key={item.id} className="mb-4 break-inside-avoid">
          <ItemCard item={item} highlightTerms={highlightTerms} />
        </div>
      ))}
    </div>
  );
}
