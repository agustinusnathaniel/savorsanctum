import { useState } from 'react';

const trackStatuses = ['ENABLED', 'DISABLED'] as const;
type TrackStatus = (typeof trackStatuses)[number];

const UMAMI_DISABLED_STORAGE_KEY = 'umami.disabled';

export const useUmamiDoNotTrack = () => {
  const [trackStatus, setTrackStatus] = useState<TrackStatus>(
    localStorage.getItem(UMAMI_DISABLED_STORAGE_KEY) === 'true'
      ? 'DISABLED'
      : 'ENABLED',
  );

  const toggleTrackStatus = () => {
    if (trackStatus === 'ENABLED') {
      localStorage.setItem(UMAMI_DISABLED_STORAGE_KEY, 'true');
    } else {
      localStorage.removeItem(UMAMI_DISABLED_STORAGE_KEY);
    }
    setTrackStatus((prev) => (prev === 'ENABLED' ? 'DISABLED' : 'ENABLED'));
  };

  return {
    trackStatus,
    toggleTrackStatus,
  };
};
