import { useCallback, useRef, useState } from 'react';

/**
 * Copies text to the clipboard and exposes a `copied` flag that flips to
 * true for a short window so callers can render "Copied!" feedback.
 *
 * The flag resets automatically after `resetMs` (default 2000ms).
 */
export const useCopyToClipboard = (resetMs = 2000) => {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useCallback(
    (text: string) => {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopied(true);
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          timeoutRef.current = setTimeout(() => setCopied(false), resetMs);
        })
        .catch(() => {
          // Clipboard API unavailable (non-HTTPS, older browser)
          // Silently fail; the caller's feedback label won't change
        });
    },
    [resetMs],
  );

  return { copied, copy };
};
