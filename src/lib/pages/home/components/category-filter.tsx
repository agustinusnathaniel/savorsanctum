'use client';

import { Gift, LayoutGrid, Utensils } from 'lucide-react';
import type React from 'react';

import type { Category } from '@/lib/models/collection-data';
import { cn } from '@/lib/styles/utils';

interface CategoryFiltersProps {
  selected: Category | 'all';
  onSelect: (category: Category | 'all') => void;
}

const categories: Array<{
  id: Category | 'all';
  label: string;
  icon: React.ReactNode;
}> = [
  { id: 'all', label: 'All', icon: <LayoutGrid className="h-4 w-4" /> },
  { id: 'food', label: 'Food', icon: <Utensils className="h-4 w-4" /> },
  { id: 'products', label: 'Products', icon: <Gift className="h-4 w-4" /> },
  // { id: 'reading', label: 'Reading', icon: <BookOpen className="h-4 w-4" /> },
];

export function CategoryFilters({ selected, onSelect }: CategoryFiltersProps) {
  return (
    <div className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {categories.map((category) => (
        <button
          type="button"
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={cn(
            'flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors active:scale-95',
            selected === category.id
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
          )}
        >
          {category.icon}
          {category.label}
        </button>
      ))}
    </div>
  );
}
