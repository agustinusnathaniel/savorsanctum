import { useCallback, useRef, useState } from 'react';

interface SharePayload {
  title: string;
  text: string;
  url: string;
}

/**
 * Shares through the Web Share API when available (native share sheet on
 * mobile) and falls back to copying `payload.url` to the clipboard
 * otherwise. `shared` flips true for a short window so callers can render
 * "Shared!" feedback regardless of which path succeeded.
 */
export const useShare = (resetMs = 2000) => {
  const [shared, setShared] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const markShared = useCallback(() => {
    setShared(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => setShared(false), resetMs);
  }, [resetMs]);

  const share = useCallback(
    async (payload: SharePayload) => {
      if (typeof navigator !== 'undefined' && navigator.share) {
        try {
          await navigator.share(payload);
          markShared();
          return;
        } catch (error) {
          const isUserDismissal =
            error instanceof DOMException && error.name === 'AbortError';
          if (isUserDismissal) {
            // User closed the share sheet — not an error, no feedback change.
            return;
          }
          // Any other failure (permission denied, unsupported payload) falls
          // through to the clipboard fallback below.
        }
      }

      try {
        await navigator.clipboard.writeText(payload.url);
        markShared();
      } catch {
        // Clipboard API unavailable (non-HTTPS, older browser).
        // Silently fail; the caller's feedback label won't change.
      }
    },
    [markShared],
  );

  return { shared, share };
};
