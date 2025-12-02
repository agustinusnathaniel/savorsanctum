import type { ReactNode } from 'react';

import { Footer } from './components/footer';
import { Header } from './components/header';

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen dark:bg-black dark:text-white">
      <div className="sticky top-0 z-10 -mx-4 bg-background px-4 md:-mx-6 md:px-6">
        <Header />
      </div>
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">{children}</main>
      <Footer />
    </div>
  );
};
