export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="mb-4 text-5xl">✨</div>
      <h2 className="text-lg font-semibold text-foreground mb-2">
        No items found
      </h2>
      <p className="text-muted-foreground text-center mb-4">
        Try adjusting your search or category filters to find what you're
        looking for.
      </p>
    </div>
  );
}
