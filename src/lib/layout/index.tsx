import type { ReactNode } from 'react';

import { Footer } from './components/footer';

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen  dark:bg-black dark:text-white">
      <main className="max-w-7xl mx-auto px-4 py-8 md:px-6 md:py-12">
        {children}
      </main>
      <Footer />
    </div>
  );
};
