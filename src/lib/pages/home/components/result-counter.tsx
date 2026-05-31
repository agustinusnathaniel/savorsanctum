import { Check, Link } from 'lucide-react';
import { useCallback, useState } from 'react';

interface ResultCounterProps {
  current: number;
  total: number;
  sortBy: 'recent' | 'alphabetical';
  onSortChange: (sort: 'recent' | 'alphabetical') => void;
}

export function ResultCounter({
  current,
  total,
  sortBy,
  onSortChange,
}: ResultCounterProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        // Clipboard API unavailable (non-HTTPS, older browser)
        // Silently fail; the share button label won't change
      });
  }, []);

  return (
    <div className="flex items-center justify-between py-3 text-sm">
      <p className="text-muted-foreground">
        Showing <span className="font-medium text-foreground">{current}</span>{' '}
        of <span className="font-medium text-foreground">{total}</span> items
      </p>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onSortChange('recent')}
          data-umami-event="sort-change"
          data-umami-event-sort="recent"
          className={`px-3 py-2 rounded-full text-xs transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-none ${
            sortBy === 'recent'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-muted'
          }`}
        >
          Recent
        </button>
        <button
          type="button"
          onClick={() => onSortChange('alphabetical')}
          data-umami-event="sort-change"
          data-umami-event-sort="alphabetical"
          className={`px-3 py-2 rounded-full text-xs transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-none ${
            sortBy === 'alphabetical'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-muted'
          }`}
        >
          A-Z
        </button>
        <button
          type="button"
          onClick={handleCopyLink}
          data-umami-event="share-link"
          className="flex items-center gap-1 px-3 py-2 rounded-full text-xs transition-colors bg-secondary text-secondary-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-none"
          aria-label="Copy link to current view"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" />
              Copied!
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
