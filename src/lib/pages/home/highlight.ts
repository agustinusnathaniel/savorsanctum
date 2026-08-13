import type { DirectoryItem } from '@/lib/models/collection-data';

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

/**
 * Builds a shareable URL for a single item that keeps the item visible to
 * any recipient. The `saved` filter is stripped because the recipient's
 * saved list differs from the sender's — leaving it in would hide the
 * shared item behind the "no saved items" empty state.
 */
export function buildItemShareUrl(href: string, itemId: string): string {
  const url = new URL(href);
  url.searchParams.delete('saved');
  url.searchParams.set('highlight', itemId);
  return url.toString();
}

export interface SocialMeta {
  title: string;
  description: string;
  image?: string;
}

export function buildItemSocialMeta(
  item: DirectoryItem,
  fallback: { title: string; description: string; image?: string },
): SocialMeta {
  const parts: Array<string> = [];
  if (item.location.length > 0) {
    parts.push(item.location.map((loc) => loc.name).join(', '));
  }
  if (item.tags.length > 0) {
    parts.push(item.tags.map((tag) => tag.name).join(', '));
  }
  return {
    title: item.name,
    description: parts.length > 0 ? parts.join(' · ') : fallback.description,
    ...(item.image
      ? { image: item.image }
      : fallback.image
        ? { image: fallback.image }
        : {}),
  };
}
