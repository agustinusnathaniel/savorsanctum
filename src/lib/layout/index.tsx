import type { ReactNode } from 'react';

import { Footer } from './components/footer';
import { Header } from './components/header';

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col dark:bg-black dark:text-white">
      <Header />
      <main className="wrapper">{children}</main>
      <Footer />
    </div>
  );
};
