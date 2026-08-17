import { debounce } from '@tanstack/react-pacer';
import {
  createFileRoute,
  stripSearchParams,
  useRouter,
} from '@tanstack/react-router';
import Fuse from 'fuse.js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import z from 'zod';

import { SITE_DESCRIPTION, SITE_TITLE } from '@/lib/constants/site';
import { FUSE_OPTIONS, filterDirectoryItems } from '@/lib/filters/directory';
import { useSavedItems } from '@/lib/hooks/use-saved-items';
import {
  DIR_CATEGORIES,
  type DirectoryItem,
} from '@/lib/models/collection-data';
import { buildItemListSchema } from '@/lib/models/structured-data';
import { CategoryFilters } from '@/lib/pages/home/components/category-filter';
import { EmptyState } from '@/lib/pages/home/components/empty-state';
import { EndOfList } from '@/lib/pages/home/components/end-of-list';
import { Header } from '@/lib/pages/home/components/header';
import { ItemGrid } from '@/lib/pages/home/components/item-grid';
import { LoadErrorState } from '@/lib/pages/home/components/load-error-state';
import { LoadWarningBanner } from '@/lib/pages/home/components/load-warning-banner';
import { ResultCounter } from '@/lib/pages/home/components/result-counter';
import { ScrollToTop } from '@/lib/pages/home/components/scroll-to-top';
import { SearchBar } from '@/lib/pages/home/components/search-bar';
import { SkeletonCard } from '@/lib/pages/home/components/skeleton-card';
import { SurpriseMe } from '@/lib/pages/home/components/surprise-me';
import { TagLocationFilters } from '@/lib/pages/home/components/tag-location-filters';
import {
  buildItemSocialMeta,
  getHighlightScrollY,
  visibleCountForIndex,
} from '@/lib/pages/home/highlight';
import { getItems } from '@/lib/services/notion/get-items';
import { trackEvent } from '@/lib/utils/umami';

const searchSchema = z.object({
  keyword: z.string().default('').catch(''),
  category: z
    .enum([...DIR_CATEGORIES, 'all'])
    .default('all')
    .catch('all'),
  sortBy: z.enum(['recent', 'alphabetical']).default('recent').catch('recent'),
  tags: z.string().optional().catch(undefined),
  location: z.string().optional().catch(undefined),
  highlight: z.string().optional().catch(undefined),
  saved: z
    .union([z.boolean(), z.enum(['true', 'false'])])
    .optional()
    .catch(undefined)
    .transform((v) =>
      v === undefined ? undefined : v === true || v === 'true',
    ),
});

type SearchSchema = z.infer<typeof searchSchema>;

const defaultSearchParams: SearchSchema = {
  keyword: '',
  category: 'all',
  sortBy: 'recent',
  saved: false,
  // pageSize: 20,
};

export const Route = createFileRoute('/')({
  component: RouteComponent,
  loader: async () => {
    const result = await getItems();

    if (result.error) {
      console.error('Failed to fetch directory items:', result.error);
    }

    return {
      items: result.items,
      error: result.error,
    };
  },
  headers: () => ({
    // Cache at CDN for 5 minutes, allow stale content for up to 10 minutes
    'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
  }),
  staleTime: 5 * 60_000,
  validateSearch: searchSchema,
  search: {
    middlewares: [stripSearchParams(defaultSearchParams)],
  },
  head: ({ loaderData, match }) => {
    const highlightId = match.search.highlight;
    const highlightedItem = highlightId
      ? loaderData?.items.find((item) => item.id === highlightId)
      : undefined;
    const socialMeta = highlightedItem
      ? buildItemSocialMeta(highlightedItem, {
          title: SITE_TITLE,
          description: SITE_DESCRIPTION,
        })
      : null;
    return {
      meta: socialMeta
        ? [
            { name: 'og:title', content: socialMeta.title },
            { name: 'og:description', content: socialMeta.description },
            ...(socialMeta.image
              ? [{ name: 'og:image', content: socialMeta.image }]
              : []),
            { name: 'twitter:title', content: socialMeta.title },
            { name: 'twitter:description', content: socialMeta.description },
            ...(socialMeta.image
              ? [{ name: 'twitter:image', content: socialMeta.image }]
              : []),
          ]
        : undefined,
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(
            buildItemListSchema(loaderData?.items ?? []),
          ),
        },
      ],
    };
  },
});

const ITEMS_PER_PAGE = 12;

function RouteComponent() {
  const router = useRouter();
  const { items, error } = Route.useLoaderData();
  const { keyword, category, sortBy, tags, location, highlight, saved } =
    Route.useSearch();
  const { savedIds, toggleSaved } = useSavedItems();
  const selectedTags = useMemo(
    () => (tags ? tags.split(',').filter(Boolean) : []),
    [tags],
  );
  const selectedLocations = useMemo(
    () => (location ? location.split(',').filter(Boolean) : []),
    [location],
  );
  const categoryItems = useMemo(
    () =>
      category === 'all'
        ? items
        : items.filter((item) => item.category === category),
    [items, category],
  );
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);
  const handledHighlightRef = useRef<string | null>(null);
  const navigate = Route.useNavigate();

  const fuseInstance = useMemo(() => new Fuse(items, FUSE_OPTIONS), [items]);

  const { filteredItems, highlightTerms } = useMemo(
    () =>
      filterDirectoryItems({
        items,
        keyword,
        category,
        sortBy,
        selectedTags,
        selectedLocations,
        savedOnly: saved ?? false,
        savedIds,
        fuseInstance,
      }),
    [
      keyword,
      category,
      items,
      sortBy,
      selectedTags,
      selectedLocations,
      saved,
      savedIds,
      fuseInstance,
    ],
  );

  const filteredRef = useRef(filteredItems);
  filteredRef.current = filteredItems;

  useEffect(() => {
    if (!highlight || handledHighlightRef.current === highlight) {
      return;
    }
    const index = filteredItems.findIndex((item) => item.id === highlight);
    if (index === -1) {
      // Item is filtered out by the current search/filters — leave the
      // highlight pending so it fires once the item becomes visible.
      return;
    }
    setVisibleCount((prev) =>
      visibleCountForIndex(index, prev, ITEMS_PER_PAGE, filteredItems.length),
    );
    let raf = 0;
    const tryScroll = () => {
      const el = document.getElementById(`item-${highlight}`);
      if (el) {
        handledHighlightRef.current = highlight;
        const headerEl = document.querySelector('[data-sticky-header]');
        const headerHeight = headerEl?.getBoundingClientRect().height ?? 0;
        const top = getHighlightScrollY(
          el.getBoundingClientRect().top,
          window.scrollY,
          headerHeight,
        );
        window.scrollTo({ top, behavior: 'smooth' });
      } else {
        raf = requestAnimationFrame(tryScroll);
      }
    };
    raf = requestAnimationFrame(tryScroll);
    return () => cancelAnimationFrame(raf);
  }, [highlight, filteredItems]);

  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) {
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      const currentItems = filteredRef.current;
      setVisibleCount(
        (prev) => prev + Math.min(currentItems.length - prev, ITEMS_PER_PAGE),
      );
      setIsLoading(false);
    }, 300);
  }, [isLoading, hasMore]);

  useEffect(() => {
    const loader = loaderRef.current;
    if (!loader) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: '100px' },
    );

    observer.observe(loader);
    return () => observer.disconnect();
  }, [hasMore, isLoading, loadMore]);

  useEffect(() => {
    if (keyword.trim() && filteredItems.length === 0) {
      trackEvent('empty-state', { query: keyword.trim() });
    }
  }, [keyword, filteredItems.length]);

  const handleChangeKeyword = useMemo(
    () =>
      debounce(
        (keyword: string) => {
          setVisibleCount(ITEMS_PER_PAGE);
          navigate({
            to: '/',
            search: (prev) => ({ ...prev, keyword }),
          });
          if (keyword.trim()) {
            trackEvent('search', { query: keyword.trim() });
          }
        },
        {
          wait: 500,
        },
      ),
    [navigate],
  );

  const handleChangeCategory = useCallback(
    (category: SearchSchema['category']) => {
      setVisibleCount(ITEMS_PER_PAGE);
      navigate({
        to: '/',
        search: (prev) => ({ ...prev, category }),
      });
    },
    [navigate],
  );

  const handleChangeSortBy = useCallback(
    (sortBy: SearchSchema['sortBy']) => {
      setVisibleCount(ITEMS_PER_PAGE);
      navigate({
        to: '/',
        search: (prev) => ({ ...prev, sortBy }),
      });
    },
    [navigate],
  );

  const handleChangeTags = useCallback(
    (newTags: Array<string>) => {
      setVisibleCount(ITEMS_PER_PAGE);
      navigate({
        to: '/',
        search: (prev) => ({
          ...prev,
          category: 'all',
          tags: newTags.length > 0 ? newTags.join(',') : undefined,
        }),
      });
      if (newTags.length > 0) {
        trackEvent('filter-tags', { tags: newTags.join(',') });
      }
    },
    [navigate],
  );

  const handleChangeLocations = useCallback(
    (newLocations: Array<string>) => {
      setVisibleCount(ITEMS_PER_PAGE);
      navigate({
        to: '/',
        search: (prev) => ({
          ...prev,
          category: 'all',
          location:
            newLocations.length > 0 ? newLocations.join(',') : undefined,
        }),
      });
      if (newLocations.length > 0) {
        trackEvent('filter-locations', { locations: newLocations.join(',') });
      }
    },
    [navigate],
  );

  const handleToggleSaved = useCallback(() => {
    setVisibleCount(ITEMS_PER_PAGE);
    navigate({
      to: '/',
      search: (prev) => ({
        ...prev,
        category: 'all',
        saved: !prev.saved,
      }),
    });
  }, [navigate]);

  const handleSurprisePick = useCallback(
    (item: DirectoryItem) => {
      handledHighlightRef.current = null;
      navigate({
        to: '/',
        search: (prev) => ({ ...prev, highlight: item.id }),
        resetScroll: false,
      });
    },
    [navigate],
  );

  return (
    <>
      <div
        className="sticky top-0 z-20 -mx-4 bg-background px-4 md:-mx-6 md:px-6"
        data-sticky-header
      >
        <Header items={items} />
        <div className="pb-4 pt-2 border-b">
          <SearchBar initialValue={keyword} onChange={handleChangeKeyword} />
          <CategoryFilters
            selected={category}
            onSelect={handleChangeCategory}
            saved={saved ?? false}
            onToggleSaved={handleToggleSaved}
          />
          <TagLocationFilters
            items={categoryItems}
            selectedTags={selectedTags}
            selectedLocations={selectedLocations}
            onTagsChange={handleChangeTags}
            onLocationsChange={handleChangeLocations}
          />
        </div>
      </div>

      {filteredItems.length > 0 && (
        <ResultCounter
          current={visibleCount}
          total={filteredItems.length}
          sortBy={sortBy}
          onSortChange={handleChangeSortBy}
        />
      )}

      {error && items.length === 0 ? (
        <LoadErrorState onRetry={() => router.invalidate()} />
      ) : (
        <>
          {error && items.length > 0 && (
            <LoadWarningBanner onRetry={() => router.invalidate()} />
          )}

          {filteredItems.length === 0 ? (
            saved ? (
              <EmptyState
                title="No saved items yet"
                description="Tap the ⋯ button on any item to save it for later."
              />
            ) : (
              <EmptyState />
            )
          ) : (
            <>
              <ItemGrid
                items={visibleItems}
                highlightTerms={highlightTerms}
                highlightId={highlight}
                savedIds={savedIds}
                onToggleSave={toggleSaved}
              />

              {isLoading && (
                <div className="mt-8 columns-1 gap-4 md:columns-2 lg:columns-3">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: -
                    <div key={idx} className="mb-4 break-inside-avoid">
                      <SkeletonCard />
                    </div>
                  ))}
                </div>
              )}

              {!hasMore && filteredItems.length > 0 && <EndOfList />}

              {hasMore && <div ref={loaderRef} className="mt-8 h-12" />}
            </>
          )}
        </>
      )}

      <SurpriseMe items={filteredItems} onPick={handleSurprisePick} />
      <ScrollToTop />
    </>
  );
}
