import { debounce } from '@tanstack/react-pacer';
import Fuse from 'fuse.js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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
import { Route } from '@/routes/index';

const ITEMS_PER_PAGE = 12;

type CategoryFilter = (typeof DIR_CATEGORIES)[number] | 'all';
type SortByFilter = 'recent' | 'alphabetical';

export function useDirectoryState(items: Array<DirectoryItem>) {
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
    (category: CategoryFilter) => {
      setVisibleCount(ITEMS_PER_PAGE);
      navigate({
        to: '/',
        search: (prev) => ({ ...prev, category }),
      });
    },
    [navigate],
  );

  const handleChangeSortBy = useCallback(
    (sortBy: SortByFilter) => {
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
    categoryItems,
    filteredItems,
    highlightTerms,
    visibleCount,
    visibleItems,
    hasMore,
    isLoading,
    fuseInstance,
    handleChangeKeyword,
    handleChangeCategory,
    handleChangeSortBy,
    handleChangeTags,
    handleChangeLocations,
    handleToggleSaved,
    handleSurprisePick,
    loadMore,
    loaderRef,
  };
}
