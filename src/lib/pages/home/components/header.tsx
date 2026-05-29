import { useEffect, useMemo, useRef } from 'react';

import type { DirectoryItem } from '@/lib/models/collection-data';

interface HeaderProps {
  items: Array<DirectoryItem>;
}

export function Header({ items }: HeaderProps) {
  const headerRef = useRef<HTMLElement>(null);

  const stats = useMemo(() => {
    const foodCount = items.filter((item) => item.category === 'food').length;
    const productCount = items.filter(
      (item) => item.category === 'products',
    ).length;

    const parts = [];
    if (foodCount > 0) {
      parts.push(`${foodCount} ${foodCount === 1 ? 'place' : 'places'}`);
    }
    if (productCount > 0) {
      parts.push(
        `${productCount} ${productCount === 1 ? 'product' : 'products'}`,
      );
    }

    return parts.join(' & ');
  }, [items]);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.scrollY > 20;
          header.setAttribute('data-scrolled', scrolled ? 'true' : 'false');
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header ref={headerRef} data-scrolled="false" className="group">
      <div className="h-full flex flex-col justify-center origin-top-left transition-transform duration-300 ease-out will-change-transform group-data-[scrolled=true]:scale-[0.75] group-data-[scrolled=true]:pt-6 motion-reduce:transform-none motion-reduce:transition-none">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          SavorSanctum
        </h1>
        <p className="text-sm text-muted-foreground md:text-base mt-1 transition-colors duration-300 ease-out origin-top opacity-100 translate-y-0 group-data-[scrolled=true]:opacity-0 group-data-[scrolled=true]:-translate-y-2 group-data-[scrolled=true]:h-0">
          A curated collection of {stats}.
        </p>
      </div>
    </header>
  );
}
