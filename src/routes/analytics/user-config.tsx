import { createFileRoute } from '@tanstack/react-router';

import { Button } from '@/lib/components/ui/button';
import { useUmamiDoNotTrack } from '@/lib/hooks/umami-do-not-track';
import { cn } from '@/lib/styles/utils';

export const Route = createFileRoute('/analytics/user-config')({
  component: RouteComponent,
  ssr: false,
});

function RouteComponent() {
  const { trackStatus, toggleTrackStatus } = useUmamiDoNotTrack();

  return (
    <div className="flex items-center flex-col gap-4 justify-center min-h-[60vh]">
      <p>Track Status: {trackStatus}</p>
      <Button
        onClick={toggleTrackStatus}
        className={cn('cursor-pointer')}
        variant={trackStatus === 'ENABLED' ? 'destructive' : 'default'}
      >
        {trackStatus === 'ENABLED' ? 'Disable' : 'Enable'}
      </Button>
    </div>
  );
}
