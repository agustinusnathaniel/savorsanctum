'use client';

import { ExternalLink, MapPin } from 'lucide-react';

import { Badge } from '@/lib/components/ui/badge';
import type { DirectoryItem } from '@/lib/models/collection-data';
import { cn } from '@/lib/styles/utils';

interface ItemCardProps {
  item: DirectoryItem;
  highlightTerms?: Array<string>;
}

const categoryColors: Record<string, string> = {
  food: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-100',
  products: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100',
  reading: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100',
};

export function ItemCard({ item, highlightTerms }: ItemCardProps) {
  // Helper function to highlight search terms in text
  const highlightText = (text: string, terms: Array<string> | undefined) => {
    if (!terms || terms.length === 0) {
      return text;
    }

    const regex = new RegExp(`(${terms.join('|')})`, 'gi');
    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? (
            // biome-ignore lint/suspicious/noArrayIndexKey: i
            <mark key={i} className="bg-yellow-200 dark:bg-yellow-800">
              {part}
            </mark>
          ) : (
            part
          ),
        )}
      </>
    );
  };

  return (
    <a
      href={(item.link as string) ?? '#'}
      target={item.link ? '_blank' : undefined}
      rel="noopener noreferrer"
      className="group block rounded-[20px] bg-card p-3 shadow-sm border-2 border-transparent transition-all duration-200 hover:border-primary/30 hover:-translate-y-1 hover:shadow-lg active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
      tabIndex={0}
    >
      {item.image && (
        <div className="relative mb-3 aspect-4/3 overflow-hidden rounded-xl bg-muted">
          <img
            src={item.image || '/placeholder.svg'}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}

      <div>
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
            {highlightText(item.name, highlightTerms)}
          </h3>
          <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </div>

        {/* @ts-expect-error */}
        {item.location.length > 0 ? (
          <div className="mt-1.5 flex items-start gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.75" />
            <span className="flex gap-2 flex-wrap">
              {/* @ts-expect-error */}
              {item.location.map((location) => (
                <Badge variant="outline" key={location.name}>
                  {highlightText(location.name, highlightTerms)}
                </Badge>
              ))}
            </span>
          </div>
        ) : null}

        {/* <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {highlightText(item.description, highlightTerms)}
        </p> */}

        <div className="mt-3 mb-2 flex flex-wrap items-center gap-2">
          <span
            className={cn(
              'rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize shadow-sm',
              categoryColors[item.category],
            )}
          >
            {highlightText(item.category, highlightTerms)}
          </span>
          {/* @ts-expect-error */}
          {item.tags.map((tag) => (
            <span
              key={tag.name}
              className="rounded-full bg-muted/50 px-2.5 py-0.5 text-xs text-muted-foreground hover:bg-muted transition-colors"
            >
              {highlightText(tag.name, highlightTerms)}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}
