import { Check, Link } from 'lucide-react';
import { useCallback } from 'react';

import { useShare } from '@/lib/hooks/use-share';
import { buildViewShareUrl } from '@/lib/pages/home/highlight';
import { cn } from '@/lib/styles/utils';

type SortBy = 'recent' | 'alphabetical';

interface ResultCounterProps {
  current: number;
  total: number;
  sortBy: SortBy;
  onSortChange: (sort: SortBy) => void;
}

const SORT_OPTIONS: Array<{ id: SortBy; label: string }> = [
  { id: 'recent', label: 'Recent' },
  { id: 'alphabetical', label: 'A-Z' },
];

const SORT_BUTTON_CLASS =
  'px-3 py-2 rounded-full text-xs transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-none';

export function ResultCounter({
  current,
  total,
  sortBy,
  onSortChange,
}: ResultCounterProps) {
  const { shared, share } = useShare();

  const handleCopyLink = useCallback(() => {
    share({
      title: document.title,
      text: 'Found this curated list on SavorSanctum',
      url: buildViewShareUrl(window.location.href),
    });
  }, [share]);

  return (
    <div className="flex items-center justify-between py-3 text-sm">
      <p className="text-muted-foreground tabular-nums">
        Showing{' '}
        <span className="font-medium text-foreground tabular-nums">
          {current}
        </span>{' '}
        of{' '}
        <span className="font-medium text-foreground tabular-nums">
          {total}
        </span>{' '}
        items
      </p>
      <div className="flex items-center gap-1.5">
        {SORT_OPTIONS.map((option) => (
          <button
            type="button"
            key={option.id}
            onClick={() => onSortChange(option.id)}
            data-umami-event="sort-change"
            data-umami-event-sort={option.id}
            className={cn(
              SORT_BUTTON_CLASS,
              sortBy === option.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-muted',
            )}
          >
            {option.label}
          </button>
        ))}
        <button
          type="button"
          onClick={handleCopyLink}
          data-umami-event="share-link"
          className={cn(
            SORT_BUTTON_CLASS,
            'flex items-center gap-1 bg-secondary text-secondary-foreground hover:bg-muted',
          )}
          aria-label="Share the current view"
        >
          {shared ? (
            <>
              <Check className="h-3 w-3" />
              Shared!
            </>
          ) : (
            <>
              <Link className="h-3 w-3" />
              Share
            </>
          )}
        </button>
      </div>
    </div>
  );
}
