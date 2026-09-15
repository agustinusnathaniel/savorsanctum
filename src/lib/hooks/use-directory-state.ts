import { useDebouncedCallback } from '@tanstack/react-pacer';
import Fuse from 'fuse.js';
import {
  type Dispatch,
  type RefObject,
  type SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { FUSE_OPTIONS, filterDirectoryItems } from '@/lib/filters/directory';
import { useSavedItems } from '@/lib/hooks/use-saved-items';
import type {
  DIR_CATEGORIES,
  DirectoryItem,
} from '@/lib/models/collection-data';
import {
  getHighlightScrollY,
  visibleCountForIndex,
} from '@/lib/pages/home/highlight';
import { trackEvent } from '@/lib/utils/umami';
import { Route, type SearchSchema } from '@/routes/index';

const ITEMS_PER_PAGE = 12;

type CategoryFilter = (typeof DIR_CATEGORIES)[number] | 'all';
type SortByFilter = 'recent' | 'alphabetical';
type Navigate = ReturnType<typeof Route.useNavigate>;
type UpdateFilter = (patch: Partial<SearchSchema>) => void;

function useSearchSelections(tags?: string, location?: string) {
  const selectedTags = useMemo(
    () => (tags ? tags.split(',').filter(Boolean) : []),
    [tags],
  );
  const selectedLocations = useMemo(
    () => (location ? location.split(',').filter(Boolean) : []),
    [location],
  );
  return { selectedTags, selectedLocations };
}

function useUpdateFilter(
  navigate: Navigate,
  setVisibleCount: Dispatch<SetStateAction<number>>,
): UpdateFilter {
  return useCallback(
    (patch: Partial<SearchSchema>) => {
      setVisibleCount(ITEMS_PER_PAGE);
      navigate({ to: '/', search: (prev) => ({ ...prev, ...patch }) });
    },
    [navigate, setVisibleCount],
  );
}

interface FilteredDirectoryParams {
  items: Array<DirectoryItem>;
  keyword: string;
  category: string;
  sortBy: SortByFilter;
  selectedTags: Array<string>;
  selectedLocations: Array<string>;
  saved: boolean;
  savedIds: Array<string>;
}

function useFilteredDirectory({
  items,
  keyword,
  category,
  sortBy,
  selectedTags,
  selectedLocations,
  saved,
  savedIds,
}: FilteredDirectoryParams) {
  const categoryItems = useMemo(
    () =>
      category === 'all'
        ? items
        : items.filter((item) => item.category === category),
    [items, category],
  );
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
        savedOnly: saved,
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
  useEffect(() => {
    if (keyword.trim() && filteredItems.length === 0) {
      trackEvent('empty-state', { query: keyword.trim() });
    }
  }, [keyword, filteredItems.length]);
  return { categoryItems, filteredItems, highlightTerms, fuseInstance };
}

function useHighlightNavigation(
  highlight: string | undefined,
  filteredItems: Array<DirectoryItem>,
  setVisibleCount: Dispatch<SetStateAction<number>>,
  handledHighlightRef: RefObject<string | null>,
) {
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
        scrollToHighlight(el);
      } else {
        raf = requestAnimationFrame(tryScroll);
      }
    };
    raf = requestAnimationFrame(tryScroll);
    return () => cancelAnimationFrame(raf);
  }, [highlight, filteredItems, setVisibleCount, handledHighlightRef]);
}

function scrollToHighlight(el: HTMLElement) {
  const headerEl = document.querySelector('[data-sticky-header]');
  const headerHeight = headerEl?.getBoundingClientRect().height ?? 0;
  const top = getHighlightScrollY(
    el.getBoundingClientRect().top,
    window.scrollY,
    headerHeight,
  );
  window.scrollTo({ top, behavior: 'smooth' });
}

function useInfiniteLoader(
  filteredItems: Array<DirectoryItem>,
  visibleCount: number,
  setVisibleCount: Dispatch<SetStateAction<number>>,
) {
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);
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
        (prev) => prev + Math.min(currentItems.length - prev, ITEMS_PER_PAGE),
      );
      setIsLoading(false);
    }, 300);
  }, [isLoading, hasMore, setVisibleCount]);
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
  return { visibleItems, hasMore, isLoading, loadMore, loaderRef };
}

function useSearchFilterActions(updateFilter: UpdateFilter) {
  const handleChangeKeyword = useDebouncedCallback(
    (keyword: string) => {
      updateFilter({ keyword });
      if (keyword.trim()) {
        trackEvent('search', { query: keyword.trim() });
      }
    },
    { wait: 500 },
  );
  const handleChangeCategory = useCallback(
    (category: CategoryFilter) => updateFilter({ category }),
    [updateFilter],
  );
  const handleChangeSortBy = useCallback(
    (sortBy: SortByFilter) => updateFilter({ sortBy }),
    [updateFilter],
  );
  return { handleChangeKeyword, handleChangeCategory, handleChangeSortBy };
}

function useCollectionFilterActions(
  updateFilter: UpdateFilter,
  saved: boolean | undefined,
  navigate: Navigate,
  handledHighlightRef: RefObject<string | null>,
) {
  const handleChangeTags = useCallback(
    (newTags: Array<string>) => {
      updateFilter({
        category: 'all',
        tags: newTags.length > 0 ? newTags.join(',') : undefined,
      });
      if (newTags.length > 0) {
        trackEvent('filter-tags', { tags: newTags.join(',') });
      }
    },
    [updateFilter],
  );
  const handleChangeLocations = useCallback(
    (newLocations: Array<string>) => {
      updateFilter({
        category: 'all',
        location: newLocations.length > 0 ? newLocations.join(',') : undefined,
      });
      if (newLocations.length > 0) {
        trackEvent('filter-locations', { locations: newLocations.join(',') });
      }
    },
    [updateFilter],
  );
  const handleToggleSaved = useCallback(
    () => updateFilter({ category: 'all', saved: !saved }),
    [updateFilter, saved],
  );
  const handleSurprisePick = useCallback(
    (item: DirectoryItem) => {
      handledHighlightRef.current = null;
      navigate({
        to: '/',
        search: (prev) => ({ ...prev, highlight: item.id }),
        resetScroll: false,
      });
    },
    [navigate, handledHighlightRef],
  );
  return {
    handleChangeTags,
    handleChangeLocations,
    handleToggleSaved,
    handleSurprisePick,
  };
}

export function useDirectoryState(items: Array<DirectoryItem>) {
  const { keyword, category, sortBy, tags, location, highlight, saved } =
    Route.useSearch();
  const { savedIds, toggleSaved } = useSavedItems();
  const { selectedTags, selectedLocations } = useSearchSelections(
    tags,
    location,
  );
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const handledHighlightRef = useRef<string | null>(null);
  const navigate = Route.useNavigate();
  const updateFilter = useUpdateFilter(navigate, setVisibleCount);
  const filtered = useFilteredDirectory({
    items,
    keyword,
    category,
    sortBy,
    selectedTags,
    selectedLocations,
    saved: saved ?? false,
    savedIds,
  });
  useHighlightNavigation(
    highlight,
    filtered.filteredItems,
    setVisibleCount,
    handledHighlightRef,
  );
  const infinite = useInfiniteLoader(
    filtered.filteredItems,
    visibleCount,
    setVisibleCount,
  );
  const searchActions = useSearchFilterActions(updateFilter);
  const collectionActions = useCollectionFilterActions(
    updateFilter,
    saved,
    navigate,
    handledHighlightRef,
  );
  return {
    keyword,
    category,
    sortBy,
    tags,
    location,
    highlight,
    saved,
    savedIds,
    toggleSaved,
    selectedTags,
    selectedLocations,
    visibleCount,
    ...filtered,
    ...infinite,
    ...searchActions,
    ...collectionActions,
  };
}
