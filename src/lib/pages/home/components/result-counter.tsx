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
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
          className={`px-3 py-1 rounded-full text-xs transition-colors ${
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
          className={`px-3 py-1 rounded-full text-xs transition-colors ${
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
          className="flex items-center gap-1 px-3 py-1 rounded-full text-xs transition-colors bg-secondary text-secondary-foreground hover:bg-muted"
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
