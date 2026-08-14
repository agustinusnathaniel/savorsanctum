// @vitest-environment jsdom

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vite-plus/test';

import { LoadWarningBanner } from '@/lib/pages/home/components/load-warning-banner';

const HEADING = /Some items couldn't be loaded/;
const MESSAGE =
  /We're showing what's available\. Try again in a moment for the rest\./;
const RETRY_BUTTON = /Try again/;

describe('LoadWarningBanner', () => {
  it('renders the heading and message without a button when no onRetry prop is passed', () => {
    render(<LoadWarningBanner />);

    expect(screen.getByText(HEADING)).toBeTruthy();
    expect(screen.getByText(MESSAGE)).toBeTruthy();
    expect(screen.queryByRole('button', { name: RETRY_BUTTON })).toBeNull();
  });

  it('renders a "Try again" button when onRetry is passed', () => {
    render(<LoadWarningBanner onRetry={vi.fn()} />);

    expect(screen.getByRole('button', { name: RETRY_BUTTON })).toBeTruthy();
  });

  it('calls onRetry exactly once when the button is clicked', () => {
    const onRetry = vi.fn();
    render(<LoadWarningBanner onRetry={onRetry} />);

    fireEvent.click(screen.getByRole('button', { name: RETRY_BUTTON }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
