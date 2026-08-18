import {
  createFileRoute,
  stripSearchParams,
  useRouter,
} from '@tanstack/react-router';
import z from 'zod';

import { SITE_DESCRIPTION, SITE_TITLE } from '@/lib/constants/site';
import { useDirectoryState } from '@/lib/hooks/use-directory-state';
import { DIR_CATEGORIES } from '@/lib/models/collection-data';
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
import { buildItemSocialMeta } from '@/lib/pages/home/highlight';
import { getItems } from '@/lib/services/notion/get-items';

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

function RouteComponent() {
  const router = useRouter();
  const { items, error } = Route.useLoaderData();
  const {
    keyword,
    category,
    sortBy,
    saved,
    highlight,
    savedIds,
    toggleSaved,
    selectedTags,
    selectedLocations,
    categoryItems,
    filteredItems,
    highlightTerms,
    visibleCount,
    visibleItems,
    hasMore,
    isLoading,
    loaderRef,
    handleChangeKeyword,
    handleChangeCategory,
    handleChangeSortBy,
    handleChangeTags,
    handleChangeLocations,
    handleToggleSaved,
    handleSurprisePick,
  } = useDirectoryState(items);

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
