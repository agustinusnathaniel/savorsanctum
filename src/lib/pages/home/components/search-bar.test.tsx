// @vitest-environment jsdom

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vite-plus/test';

import { SearchBar } from '@/lib/pages/home/components/search-bar';

const searchPlaceholder = /search places/i;

describe('SearchBar keyboard shortcuts', () => {
  it('focuses the input when "/" is pressed', () => {
    render(<SearchBar initialValue="" onChange={vi.fn()} />);
    const input = screen.getByPlaceholderText(searchPlaceholder);

    fireEvent.keyDown(document.body, { key: '/' });

    expect(document.activeElement).toBe(input);
  });

  it('clears and blurs when Escape is pressed while focused', () => {
    const onChange = vi.fn();
    render(<SearchBar initialValue="test" onChange={onChange} />);
    const input = screen.getByPlaceholderText(searchPlaceholder);

    input.focus();
    fireEvent.keyDown(input, { key: 'Escape' });

    expect(onChange).toHaveBeenCalledWith('');
    expect(document.activeElement).not.toBe(input);
  });

  it('does NOT focus search when "/" is pressed inside another input', () => {
    render(
      <div>
        <input data-testid="other" />
        <SearchBar initialValue="" onChange={vi.fn()} />
      </div>,
    );
    const other = screen.getByTestId('other');
    const searchInput = screen.getByPlaceholderText(searchPlaceholder);

    other.focus();
    fireEvent.keyDown(other, { key: '/' });

    expect(document.activeElement).toBe(other);
    expect(document.activeElement).not.toBe(searchInput);
  });

  it('does NOT focus search when other keys are pressed', () => {
    render(<SearchBar initialValue="" onChange={vi.fn()} />);
    const input = screen.getByPlaceholderText(searchPlaceholder);

    fireEvent.keyDown(document.body, { key: 'a' });

    expect(document.activeElement).not.toBe(input);
  });
});
