import { Button } from '@/lib/components/ui/button';
import { cn } from '@/lib/styles/utils';

export function LoadWarningBanner({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-muted-foreground/40 bg-muted/40 px-4 py-4 text-center">
      <div className="mb-0 text-2xl">⚠️</div>
      <h2 className="text-base font-semibold text-foreground">
        Some items couldn't be loaded
      </h2>
      <p className="text-sm text-muted-foreground">
        We're showing what's available. Try again in a moment for the rest.
      </p>
      {onRetry && (
        <Button onClick={onRetry} className={cn('cursor-pointer')}>
          Try again
        </Button>
      )}
    </div>
  );
}
