import { ChevronDown, MapPin, Tag } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import type { DirectoryItem } from '@/lib/models/collection-data';
import { cn } from '@/lib/styles/utils';

interface TagLocationFiltersProps {
  items: Array<DirectoryItem>;
  selectedTags: Array<string>;
  selectedLocations: Array<string>;
  onTagsChange: (tags: Array<string>) => void;
  onLocationsChange: (locations: Array<string>) => void;
}

export function TagLocationFilters({
  items,
  selectedTags,
  selectedLocations,
  onTagsChange,
  onLocationsChange,
}: TagLocationFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    for (const item of items) {
      for (const tag of item.tags) {
        tagSet.add(tag.name);
      }
    }
    return [...tagSet].sort((a, b) => a.localeCompare(b));
  }, [items]);

  const availableLocations = useMemo(() => {
    const locationSet = new Set<string>();
    for (const item of items) {
      for (const loc of item.location) {
        locationSet.add(loc.name);
      }
    }
    return [...locationSet].sort((a, b) => a.localeCompare(b));
  }, [items]);

  const toggleTag = useCallback(
    (tag: string) => {
      const next = selectedTags.includes(tag)
        ? selectedTags.filter((t) => t !== tag)
        : [...selectedTags, tag];
      onTagsChange(next);
    },
    [selectedTags, onTagsChange],
  );

  const toggleLocation = useCallback(
    (location: string) => {
      const next = selectedLocations.includes(location)
        ? selectedLocations.filter((l) => l !== location)
        : [...selectedLocations, location];
      onLocationsChange(next);
    },
    [selectedLocations, onLocationsChange],
  );

  const hasActiveFilters =
    selectedTags.length > 0 || selectedLocations.length > 0;

  if (availableTags.length === 0 && availableLocations.length === 0) {
    return null;
  }

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 transition-transform',
            isExpanded && 'rotate-180',
          )}
        />
        Filters
        {hasActiveFilters && (
          <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] text-primary-foreground">
            {selectedTags.length + selectedLocations.length}
          </span>
        )}
      </button>

      {isExpanded && (
        <div className="mt-2 space-y-2">
          {availableTags.length > 0 && (
            <div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1.5">
                <Tag className="h-3 w-3" />
                <span>Tags</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {availableTags.map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={cn(
                      'rounded-full px-2.5 py-1 text-xs transition-colors active:scale-95',
                      selectedTags.includes(tag)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {availableLocations.length > 0 && (
            <div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1.5">
                <MapPin className="h-3 w-3" />
                <span>Location</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {availableLocations.map((location) => (
                  <button
                    type="button"
                    key={location}
                    onClick={() => toggleLocation(location)}
                    className={cn(
                      'rounded-full px-2.5 py-1 text-xs transition-colors active:scale-95',
                      selectedLocations.includes(location)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                    )}
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
