// @vitest-environment jsdom

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vite-plus/test';

import { LoadErrorState } from '@/lib/pages/home/components/load-error-state';

const HEADING = /Couldn't load the collection/;
const MESSAGE =
  /Something went wrong while fetching the latest items\. Please try again in a moment\./;
const RETRY_BUTTON = /Try again/;

describe('LoadErrorState', () => {
  it('renders the heading and message without a button when no onRetry prop is passed', () => {
    render(<LoadErrorState />);

    expect(screen.getByText(HEADING)).toBeTruthy();
    expect(screen.getByText(MESSAGE)).toBeTruthy();
    expect(screen.queryByRole('button', { name: RETRY_BUTTON })).toBeNull();
  });

  it('renders a "Try again" button when onRetry is passed', () => {
    render(<LoadErrorState onRetry={vi.fn()} />);

    expect(screen.getByRole('button', { name: RETRY_BUTTON })).toBeTruthy();
  });

  it('calls onRetry exactly once when the button is clicked', () => {
    const onRetry = vi.fn();
    render(<LoadErrorState onRetry={onRetry} />);

    fireEvent.click(screen.getByRole('button', { name: RETRY_BUTTON }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
