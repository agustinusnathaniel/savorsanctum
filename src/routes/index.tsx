import { debounce } from '@tanstack/react-pacer';
import { createFileRoute, stripSearchParams } from '@tanstack/react-router';
import Fuse from 'fuse.js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import z from 'zod';

import { DIR_CATEGORIES } from '@/lib/models/collection-data';
import { CategoryFilters } from '@/lib/pages/home/components/category-filter';
import { EmptyState } from '@/lib/pages/home/components/empty-state';
import { EndOfList } from '@/lib/pages/home/components/end-of-list';
import { Header } from '@/lib/pages/home/components/header';
import { ItemGrid } from '@/lib/pages/home/components/item-grid';
import { ResultCounter } from '@/lib/pages/home/components/result-counter';
import { SearchBar } from '@/lib/pages/home/components/search-bar';
import { SkeletonCard } from '@/lib/pages/home/components/skeleton-card';
import { getItems } from '@/lib/services/notion/get-items';

const searchSchema = z.object({
  keyword: z.string().default('').catch(''),
  // page: z.number().min(1).default(1).catch(1),
  category: z
    .enum([...DIR_CATEGORIES, 'all'])
    .default('all')
    .catch('all'),
  sortBy: z.enum(['recent', 'alphabetical']).default('recent').catch('recent'),
  // pageSize: z.number().default(20).catch(20),
});

type SearchSchema = z.infer<typeof searchSchema>;

const defaultSearchParams: SearchSchema = {
  keyword: '',
  // page: 1,
  category: 'all',
  sortBy: 'recent',
  // pageSize: 20,
};

export const Route = createFileRoute('/')({
  component: RouteComponent,
  loader: async () => {
    const { items } = await getItems();

    return {
      items,
    };
  },
  headers: () => ({
    // Cache at CDN for 5 minutes, allow stale content for up to 10 minutes
    'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
  }),
  validateSearch: searchSchema,
  search: {
    middlewares: [stripSearchParams(defaultSearchParams)],
  },
  /**
   * prevent running loader again
   * https://tanstack.com/router/v1/docs/framework/react/guide/data-loading#using-shouldreload-and-gctime-to-opt-out-of-caching
   * for this to work we also need to disable or not use loaderDeps
   */
  shouldReload: false,
});

const ITEMS_PER_PAGE = 12;

function RouteComponent() {
  const { items } = Route.useLoaderData();
  const { keyword, category, sortBy } = Route.useSearch();
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);
  const navigate = Route.useNavigate();

  const fused = useMemo(
    () =>
      new Fuse(items, {
        includeMatches: true,
        ignoreDiacritics: true,
        threshold: 0.3,
        keys: [
          'name',
          ['tags', 'name'],
          ['reviews', 'name'],
          ['location', 'name'],
        ],
      }),
    [items],
  );

  const highlightTerms = useMemo(() => {
    // biome-ignore lint/performance/useTopLevelRegex: -
    return keyword.trim().split(/\s+/).filter(Boolean);
  }, [keyword]);

  const filteredItems = useMemo(() => {
    let results = items;

    if (keyword.trim()) {
      results = fused.search(keyword).map((result) => result.item);
    }

    if (category !== 'all') {
      results = results.filter((item) => item.category === category);
    }

    if (sortBy === 'alphabetical') {
      results = [...results].sort((a, b) => a.name.localeCompare(b.name));
    }

    return results;
  }, [keyword, category, fused, items, sortBy]);

  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) {
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount(
        (prev) =>
          prev +
          (filteredItems.length - prev < ITEMS_PER_PAGE &&
          (filteredItems.length - prev) % ITEMS_PER_PAGE !== 0
            ? filteredItems.length - prev
            : ITEMS_PER_PAGE),
      );
      setIsLoading(false);
    }, 300);
  }, [isLoading, hasMore, filteredItems]);

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

  const handleChangeKeyword = debounce(
    (keyword: string) => {
      setVisibleCount(ITEMS_PER_PAGE);
      navigate({
        to: '/',
        search: (prev) => ({ ...prev, keyword }),
      });
    },
    {
      wait: 500,
    },
  );

  const handleChangeCategory = (category: SearchSchema['category']) => {
    setVisibleCount(ITEMS_PER_PAGE);
    navigate({
      to: '/',
      search: (prev) => ({ ...prev, category }),
    });
  };

  const handleChangeSortBy = (sortBy: SearchSchema['sortBy']) => {
    setVisibleCount(ITEMS_PER_PAGE);
    navigate({
      to: '/',
      search: (prev) => ({ ...prev, sortBy }),
    });
  };

  return (
    <>
      <div className="sticky top-0 z-10 -mx-4 bg-background px-4 md:-mx-6 md:px-6">
        <Header />
        <div className="pb-4 pt-2 border-b">
          <SearchBar initialValue={keyword} onChange={handleChangeKeyword} />
          <CategoryFilters
            selected={category}
            onSelect={handleChangeCategory}
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
    </>
  );
}
