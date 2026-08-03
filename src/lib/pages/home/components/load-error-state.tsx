export function LoadErrorState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="mb-4 text-5xl">⚠️</div>
      <h2 className="text-lg font-semibold text-foreground mb-2">
        Couldn't load the collection
      </h2>
      <p className="text-muted-foreground text-center mb-4">
        Something went wrong while fetching the latest items. Please try again
        in a moment.
      </p>
    </div>
  );
}
