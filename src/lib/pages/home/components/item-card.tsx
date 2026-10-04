import {
  Bookmark,
  BookmarkCheck,
  Check,
  ExternalLink,
  Link,
  MapPin,
  MoreVertical,
} from 'lucide-react';
import { type ReactNode, useCallback, useMemo } from 'react';

import { ImageWithLoader } from '@/lib/components/image-with-loader';
import { Badge } from '@/lib/components/ui/badge';
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
} from '@/lib/components/ui/menu';
import { useShare } from '@/lib/hooks/use-share';
import type { Category, DirectoryItem } from '@/lib/models/collection-data';
import { buildItemShareUrl } from '@/lib/pages/home/highlight';
import { cn } from '@/lib/styles/utils';

interface ItemCardProps {
  item: DirectoryItem;
  highlightTerms?: Array<string>;
  highlightId?: string;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
}

type HighlightText = (text: string) => ReactNode;

const categoryColors: Partial<Record<Category, string>> = {
  food: 'bg-[var(--color-category-food)] text-[var(--color-category-food-foreground)]',
  products:
    'bg-[var(--color-category-products)] text-[var(--color-category-products-foreground)]',
};

const FLOATING_BUTTON_CLASS =
  'hidden pointer-fine:flex absolute top-2 z-10 items-center justify-center rounded-full bg-background/90 p-1.5 shadow-sm border border-border opacity-0 transition-opacity pointer-fine:group-hover:opacity-100 focus-visible:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 active:scale-95';

function useHighlightText(highlightTerms?: Array<string>): HighlightText {
  // Memoize regex to avoid recreating it multiple times per card render
  const highlightRegex = useMemo(() => {
    if (!highlightTerms || highlightTerms.length === 0) {
      return null;
    }
    const escapedTerms = highlightTerms.map((term) =>
      term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
    );
    return new RegExp(`(${escapedTerms.join('|')})`, 'gi');
  }, [highlightTerms]);

  return useCallback(
    (text: string) => {
      if (!highlightRegex) {
        return text;
      }
      const parts = text.split(highlightRegex);
      return (
        <>
          {parts.map((part, i) =>
            i % 2 === 1 ? (
              // biome-ignore lint/suspicious/noArrayIndexKey: i
              <mark key={i} className="bg-yellow-200 dark:bg-yellow-800">
                {part}
              </mark>
            ) : (
              part
            ),
          )}
        </>
      );
    },
    [highlightRegex],
  );
}

function useItemShare(item: DirectoryItem) {
  const { shared, share } = useShare();
  const handleCopyLink = useCallback(() => {
    share({
      title: item.name,
      text: item.name,
      url: buildItemShareUrl(window.location.href, item.id),
    });
  }, [share, item.id, item.name]);
  return { shared, handleCopyLink };
}

function CardBadges({
  item,
  highlightText,
}: {
  item: DirectoryItem;
  highlightText: HighlightText;
}) {
  return (
    <>
      {item.location.length > 0 ? (
        <div className="mt-1.5 flex items-start gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.75" />
          <span className="flex gap-2 flex-wrap">
            {item.location.map((location) => (
              <Badge variant="outline" key={location.name}>
                {highlightText(location.name)}
              </Badge>
            ))}
          </span>
        </div>
      ) : null}

      <div className="mt-3 mb-2 flex flex-wrap items-center gap-2">
        <span
          className={cn(
            'rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize shadow-sm',
            categoryColors[item.category],
          )}
        >
          {highlightText(item.category)}
        </span>
        {item.reviews.map((review) => (
          <span
            key={review.name}
            className="rounded-full bg-muted/50 px-2.5 py-0.5 text-xs text-muted-foreground hover:bg-muted transition-colors"
          >
            {highlightText(review.name)}
          </span>
        ))}
        {item.tags.map((tag) => (
          <span
            key={tag.name}
            className="rounded-full bg-muted/50 px-2.5 py-0.5 text-xs text-muted-foreground hover:bg-muted transition-colors"
          >
            {highlightText(tag.name)}
          </span>
        ))}
      </div>
    </>
  );
}

function CardBody({
  item,
  highlightText,
}: {
  item: DirectoryItem;
  highlightText: HighlightText;
}) {
  return (
    <>
      {item.image && (
        <ImageWithLoader
          ratio="4/3"
          containerClassName="mb-4 overflow-hidden rounded-md bg-muted"
          className="object-cover duration-150 group-hover:scale-[1.02]"
          src={item.image}
          alt={item.name}
        />
      )}

      <div>
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold leading-tight text-foreground text-balance group-hover:text-primary transition-colors">
            {highlightText(item.name)}
          </h3>
          <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </div>

        <CardBadges item={item} highlightText={highlightText} />
      </div>
    </>
  );
}

interface CardAction {
  icon: ReactNode;
  menuLabel: string;
  umamiEvent: string;
  onSelect: () => void;
}

interface CardActionProps {
  item: DirectoryItem;
  isSaved: boolean;
  shared: boolean;
  onToggleSave: (id: string) => void;
  onCopyLink: () => void;
}

/** Single source for the save/share pair so both card surfaces stay in sync. */
function useCardActions({
  item,
  isSaved,
  shared,
  onToggleSave,
  onCopyLink,
}: CardActionProps): Array<CardAction> {
  return useMemo(
    () => [
      {
        icon: isSaved ? <BookmarkCheck /> : <Bookmark />,
        menuLabel: isSaved ? 'Remove from saved' : 'Save item',
        umamiEvent: isSaved ? 'unsave-item' : 'save-item',
        onSelect: () => onToggleSave(item.id),
      },
      {
        icon: shared ? <Check /> : <Link />,
        menuLabel: shared ? 'Link shared' : 'Share',
        umamiEvent: 'item-share',
        onSelect: onCopyLink,
      },
    ],
    [isSaved, shared, item.id, onToggleSave, onCopyLink],
  );
}

function CardIconButtons({
  item,
  isSaved,
  actions,
}: {
  item: DirectoryItem;
  isSaved: boolean;
  actions: Array<CardAction>;
}) {
  const [saveAction, shareAction] = actions;
  return (
    <>
      <button
        type="button"
        onClick={saveAction.onSelect}
        data-umami-event={saveAction.umamiEvent}
        data-umami-event-itemname={item.name}
        aria-label={
          isSaved ? `Remove ${item.name} from saved` : `Save ${item.name}`
        }
        aria-pressed={isSaved}
        className={cn(
          FLOATING_BUTTON_CLASS,
          'left-2 [&_svg]:h-3.5 [&_svg]:w-3.5',
        )}
      >
        {saveAction.icon}
      </button>

      <button
        type="button"
        onClick={shareAction.onSelect}
        data-umami-event={shareAction.umamiEvent}
        data-umami-event-itemname={item.name}
        aria-label={`Share ${item.name}`}
        className={cn(
          FLOATING_BUTTON_CLASS,
          'right-2 [&_svg]:h-3.5 [&_svg]:w-3.5',
        )}
      >
        {shareAction.icon}
      </button>
    </>
  );
}

function CardMenu({
  item,
  actions,
}: {
  item: DirectoryItem;
  actions: Array<CardAction>;
}) {
  return (
    <Menu>
      <MenuTrigger
        type="button"
        aria-label={`Actions for ${item.name}`}
        data-umami-event="item-menu"
        data-umami-event-itemname={item.name}
        className="absolute top-2 right-2 z-10 flex size-11 items-center justify-center rounded-full bg-background/90 p-2.5 shadow-sm border border-border opacity-100 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 active:scale-95 pointer-fine:hidden"
      >
        <MoreVertical className="h-4 w-4" />
      </MenuTrigger>
      <MenuContent>
        {actions.map((action) => (
          <MenuItem
            key={action.menuLabel}
            onClick={action.onSelect}
            data-umami-event={action.umamiEvent}
            data-umami-event-itemname={item.name}
          >
            {action.icon}
            {action.menuLabel}
          </MenuItem>
        ))}
      </MenuContent>
    </Menu>
  );
}

export function ItemCard({
  item,
  highlightTerms,
  highlightId,
  isSaved,
  onToggleSave,
}: ItemCardProps) {
  const isHighlighted = item.id === highlightId;
  const highlightText = useHighlightText(highlightTerms);
  const { shared, handleCopyLink } = useItemShare(item);
  const actions = useCardActions({
    item,
    isSaved,
    shared,
    onToggleSave,
    onCopyLink: handleCopyLink,
  });
  const cardContent = <CardBody item={item} highlightText={highlightText} />;

  return (
    <div id={`item-${item.id}`} className="relative group">
      {item.link ? (
        <a
          href={item.link}
          data-umami-event="item-click"
          data-umami-event-category={item.category}
          data-umami-event-itemname={item.name}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'block rounded-lg bg-card p-3 border border-border transition-colors duration-150 hover:border-primary/50 hover:shadow-sm active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2',
            isHighlighted && 'ring-2 ring-primary/70 shadow-md',
          )}
          tabIndex={0}
        >
          {cardContent}
        </a>
      ) : (
        <div
          className={cn(
            'block rounded-lg bg-card p-3 border border-border',
            isHighlighted && 'ring-2 ring-primary/70 shadow-md',
          )}
        >
          {cardContent}
        </div>
      )}

      <CardIconButtons item={item} isSaved={isSaved} actions={actions} />
      <CardMenu item={item} actions={actions} />
    </div>
  );
}
