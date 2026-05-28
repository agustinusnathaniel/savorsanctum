import { MapPin, Tag } from 'lucide-react';
import { useMemo } from 'react';

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
} from '@/lib/components/ui/combobox';
import type { DirectoryItem } from '@/lib/models/collection-data';

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

  if (availableTags.length === 0 && availableLocations.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 flex flex-col gap-2 sm:flex-row">
      {availableTags.length > 0 && (
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Tag className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <Combobox
            items={availableTags}
            multiple
            value={selectedTags}
            onValueChange={onTagsChange}
          >
            <ComboboxChips className="flex-1 min-w-0">
              <ComboboxValue>
                {selectedTags.map((tag) => (
                  <ComboboxChip key={tag}>{tag}</ComboboxChip>
                ))}
              </ComboboxValue>
              <ComboboxChipsInput placeholder="Filter tags" />
            </ComboboxChips>
            <ComboboxContent>
              <ComboboxEmpty>No tags found.</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
      )}

      {availableLocations.length > 0 && (
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <Combobox
            items={availableLocations}
            multiple
            value={selectedLocations}
            onValueChange={onLocationsChange}
          >
            <ComboboxChips className="flex-1 min-w-0">
              <ComboboxValue>
                {selectedLocations.map((loc) => (
                  <ComboboxChip key={loc}>{loc}</ComboboxChip>
                ))}
              </ComboboxValue>
              <ComboboxChipsInput placeholder="Filter locations" />
            </ComboboxChips>
            <ComboboxContent>
              <ComboboxEmpty>No locations found.</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
      )}
    </div>
  );
}
