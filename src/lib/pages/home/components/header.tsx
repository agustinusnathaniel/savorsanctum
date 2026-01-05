'use client';

import { useRef } from 'react';

export function Header() {
  const headerRef = useRef<HTMLElement>(null);

  return (
    <header ref={headerRef} data-scrolled="false" className="group">
      <div className="h-full flex flex-col justify-center origin-top-left transition-transform duration-300 ease-out will-change-transform group-data-[scrolled=true]:scale-[0.75] group-data-[scrolled=true]:pt-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          SavorSanctum
        </h1>
        <p className="text-sm text-muted-foreground md:text-base mt-1 transition-all duration-300 ease-out origin-top opacity-100 translate-y-0 group-data-[scrolled=true]:opacity-0 group-data-[scrolled=true]:-translate-y-2 group-data-[scrolled=true]:h-0">
          A personal collection of places, products, and reads we love.
        </p>
      </div>
    </header>
  );
}
