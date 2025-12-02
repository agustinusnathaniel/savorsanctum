'use client';

import { useEffect, useRef } from 'react';

export function Header() {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) {
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
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      ref={headerRef}
      data-scrolled="false"
      className="h-20 md:h-24 overflow-hidden group"
    >
      <div className="h-full flex flex-col justify-center origin-top-left transition-transform duration-300 ease-out will-change-transform data-[scrolled=true]:scale-[0.7] group-[[data-scrolled=true]]:scale-[0.7]">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          CuratedByNE
        </h1>
        <p className="text-sm text-muted-foreground md:text-base mt-1 transition-all duration-300 ease-out origin-top opacity-100 translate-y-0 max-h-8 group-[[data-scrolled=true]]:opacity-0 group-[[data-scrolled=true]]:-translate-y-2 group-[[data-scrolled=true]]:max-h-0">
          A personal collection of places, products, and reads I love.
        </p>
      </div>
    </header>
  );
}
