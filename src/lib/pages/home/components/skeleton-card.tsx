export function SkeletonCard() {
  return (
    <div className="rounded-[20px] bg-card p-3 shadow-sm animate-pulse">
      <div className="relative mb-3 aspect-4/3 overflow-hidden rounded-xl bg-muted" />
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-full" />
        <div className="h-3 bg-muted rounded w-2/3" />
      </div>
      <div className="mt-3 flex gap-2">
        <div className="h-6 w-12 bg-muted rounded-full" />
        <div className="h-6 w-12 bg-muted rounded-full" />
      </div>
    </div>
  );
}
