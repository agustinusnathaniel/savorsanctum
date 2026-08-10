/**
 * Returns the visible count needed so that the item at `index` is rendered.
 * - If the index is already visible (< current), returns current unchanged.
 * - Otherwise rounds up to the next multiple of pageSize, capped at total.
 */
export function visibleCountForIndex(
  index: number,
  current: number,
  pageSize: number,
  total: number,
): number {
  if (index < current) {
    return current;
  }
  return Math.min(total, Math.ceil((index + 1) / pageSize) * pageSize);
}

/**
 * Scroll target that places the top of the highlighted item just below
 * the sticky filter header, with a small breathing gap.
 */
export function getHighlightScrollY(
  itemTop: number,
  scrollY: number,
  headerHeight: number,
  gap = 12,
): number {
  return Math.max(0, itemTop + scrollY - headerHeight - gap);
}
