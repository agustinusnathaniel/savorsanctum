import { useState } from 'react';

import { Skeleton } from '@/lib/components/ui/skeleton';
import { cn } from '@/lib/styles/utils';

type ImageWithLoaderProps = {
  src: string;
  alt?: string;
  containerClassName?: string;
  className?: string;
  ratio?: string;
};

export const ImageWithLoader = ({
  src,
  alt,
  ratio,
  containerClassName,
  className,
}: ImageWithLoaderProps) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={cn(
        'relative w-full h-full',
        `aspect-${ratio}`,
        containerClassName,
      )}
    >
      {!loaded && <Skeleton className="absolute inset-0 rounded-md" />}

      <img
        src={src}
        alt={alt}
        width={800}
        height={600}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-300',
          loaded ? 'opacity-100' : 'opacity-0',
          className,
        )}
      />
    </div>
  );
};
