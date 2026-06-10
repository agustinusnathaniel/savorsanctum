import type { ReactNode } from 'react';

import { Footer } from './components/footer';

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header with theme toggle */}
      {/* <header className="fixed top-0 right-0 z-50 p-4">
        <ThemeToggle />
      </header> */}
      <main className="max-w-7xl mx-auto px-4 py-8 pb-20 md:px-6 md:py-12 md:pb-20">
        {children}
      </main>
      <Footer />
    </div>
  );
};
