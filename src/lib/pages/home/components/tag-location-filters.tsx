import { MapPin, Tag } from 'lucide-react';
import { type ReactNode, useMemo } from 'react';

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

interface MultiSelectFilterProps {
  icon: ReactNode;
  placeholder: string;
  emptyLabel: string;
  items: Array<string>;
  value: Array<string>;
  onValueChange: (value: Array<string>) => void;
}

function MultiSelectFilter({
  icon,
  placeholder,
  emptyLabel,
  items,
  value,
  onValueChange,
}: MultiSelectFilterProps) {
  return (
    <div className="flex items-center gap-2 flex-1 min-w-0">
      {icon}
      <Combobox
        items={items}
        multiple
        value={value}
        onValueChange={onValueChange}
      >
        <ComboboxChips className="flex-1 min-w-0">
          <ComboboxValue>
            {value.map((item) => (
              <ComboboxChip key={item}>{item}</ComboboxChip>
            ))}
          </ComboboxValue>
          <ComboboxChipsInput placeholder={placeholder} />
        </ComboboxChips>
        <ComboboxContent>
          <ComboboxEmpty>{emptyLabel}</ComboboxEmpty>
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
  );
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
        <MultiSelectFilter
          icon={<Tag className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
          placeholder="Filter tags"
          emptyLabel="No tags found."
          items={availableTags}
          value={selectedTags}
          onValueChange={onTagsChange}
        />
      )}

      {availableLocations.length > 0 && (
        <MultiSelectFilter
          icon={
            <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          }
          placeholder="Filter locations"
          emptyLabel="No locations found."
          items={availableLocations}
          value={selectedLocations}
          onValueChange={onLocationsChange}
        />
      )}
    </div>
  );
}
