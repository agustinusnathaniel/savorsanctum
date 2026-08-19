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
  const [error, setError] = useState(false);

  return (
    <div
      className={cn('relative w-full h-full', containerClassName)}
      style={ratio ? { aspectRatio: ratio } : undefined}
    >
      {error ? (
        <div
          className="flex items-center justify-center w-full h-full bg-muted rounded-md"
          aria-label={alt ?? 'Image not available'}
          role="img"
        >
          <span className="text-muted-foreground text-sm">
            Image not available
          </span>
        </div>
      ) : (
        <>
          {!loaded && <Skeleton className="absolute inset-0 rounded-md" />}

          <img
            src={src}
            alt={alt}
            width={800}
            height={600}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
            className={cn(
              'w-full h-full object-cover transition-opacity duration-300',
              loaded ? 'opacity-100' : 'opacity-0',
              className,
            )}
          />
        </>
      )}
    </div>
  );
};
