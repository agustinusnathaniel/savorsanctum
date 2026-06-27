import { debounce } from '@tanstack/react-pacer';
import { createFileRoute, stripSearchParams } from '@tanstack/react-router';
import Fuse from 'fuse.js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import z from 'zod';

import { FUSE_OPTIONS, filterDirectoryItems } from '@/lib/filters/directory';
import { DIR_CATEGORIES } from '@/lib/models/collection-data';
import { CategoryFilters } from '@/lib/pages/home/components/category-filter';
import { EmptyState } from '@/lib/pages/home/components/empty-state';
import { EndOfList } from '@/lib/pages/home/components/end-of-list';
import { Header } from '@/lib/pages/home/components/header';
import { ItemGrid } from '@/lib/pages/home/components/item-grid';
import { ResultCounter } from '@/lib/pages/home/components/result-counter';
import { ScrollToTop } from '@/lib/pages/home/components/scroll-to-top';
import { SearchBar } from '@/lib/pages/home/components/search-bar';
import { SkeletonCard } from '@/lib/pages/home/components/skeleton-card';
import { SurpriseMe } from '@/lib/pages/home/components/surprise-me';
import { TagLocationFilters } from '@/lib/pages/home/components/tag-location-filters';
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
});

type SearchSchema = z.infer<typeof searchSchema>;

const defaultSearchParams: SearchSchema = {
  keyword: '',
  category: 'all',
  sortBy: 'recent',
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
});

const ITEMS_PER_PAGE = 12;

function RouteComponent() {
  const { items } = Route.useLoaderData();
  const { keyword, category, sortBy, tags, location } = Route.useSearch();
  const selectedTags = useMemo(
    () => (tags ? tags.split(',').filter(Boolean) : []),
    [tags],
  );
  const selectedLocations = useMemo(
    () => (location ? location.split(',').filter(Boolean) : []),
    [location],
  );
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);
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
        fuseInstance,
      }),
    [
      keyword,
      category,
      items,
      sortBy,
      selectedTags,
      selectedLocations,
      fuseInstance,
    ],
  );

  const filteredRef = useRef(filteredItems);
  filteredRef.current = filteredItems;

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
        (prev) =>
          prev +
          (currentItems.length - prev < ITEMS_PER_PAGE &&
          (currentItems.length - prev) % ITEMS_PER_PAGE !== 0
            ? currentItems.length - prev
            : ITEMS_PER_PAGE),
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

  return (
    <>
      <div className="sticky top-0 z-10 -mx-4 bg-background px-4 md:-mx-6 md:px-6">
        <Header items={items} />
        <div className="pb-4 pt-2 border-b">
          <SearchBar initialValue={keyword} onChange={handleChangeKeyword} />
          <CategoryFilters
            selected={category}
            onSelect={handleChangeCategory}
          />
          <TagLocationFilters
            items={items}
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

      {filteredItems.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <ItemGrid items={visibleItems} highlightTerms={highlightTerms} />

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

      <SurpriseMe items={filteredItems} />
      <ScrollToTop />
    </>
  );
}
