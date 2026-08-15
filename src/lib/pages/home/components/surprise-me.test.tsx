// @vitest-environment jsdom

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vite-plus/test';

import type { DirectoryItem } from '@/lib/models/collection-data';
import { SurpriseMe } from '@/lib/pages/home/components/surprise-me';

function makeItem(id: string): DirectoryItem {
  return {
    id,
    name: `Item ${id}`,
    category: 'food',
    link: `https://example.com/${id}`,
    image: '',
    reviews: [],
    tags: [],
    location: [],
    created_time: '2026-01-01T00:00:00.000Z',
  };
}

describe('SurpriseMe', () => {
  it('renders nothing when items is empty', () => {
    render(<SurpriseMe items={[]} onPick={vi.fn()} />);

    expect(screen.queryByRole('button')).toBeNull();
  });

  it('calls onPick with a random item from the list when clicked', () => {
    const onPick = vi.fn();
    const items = [makeItem('a'), makeItem('b'), makeItem('c')];
    const random = vi.spyOn(Math, 'random').mockReturnValue(0);

    render(<SurpriseMe items={items} onPick={onPick} />);

    fireEvent.click(screen.getByRole('button'));

    expect(onPick).toHaveBeenCalledTimes(1);
    expect(onPick).toHaveBeenCalledWith(items[0]);

    random.mockRestore();
  });

  it('uses the "reveal" aria-label', () => {
    render(<SurpriseMe items={[makeItem('a')]} onPick={vi.fn()} />);

    expect(
      screen.getByLabelText('Surprise me — reveal a random item'),
    ).toBeTruthy();
  });
});
