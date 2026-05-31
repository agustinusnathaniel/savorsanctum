declare global {
  interface Window {
    umami?: {
      track: (eventOrPayload: string | object, data?: object) => void;
    };
  }
}

export function trackEvent(
  name: string,
  data?: Record<string, string | number>,
) {
  if (typeof window !== 'undefined' && window.umami) {
    window.umami.track(name, data);
  }
}
