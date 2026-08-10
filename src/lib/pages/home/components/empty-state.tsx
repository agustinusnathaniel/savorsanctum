interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({
  title = 'No items found',
  description = "Try adjusting your search or category filters to find what you're looking for.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="mb-4 text-5xl">✨</div>
      <h2 className="text-lg font-semibold text-foreground mb-2">{title}</h2>
      <p className="text-muted-foreground text-center mb-4">{description}</p>
    </div>
  );
}
