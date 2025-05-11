'use client';

import { ReactNode, useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  // Using this pattern to safely handle client-only components in Next.js App Router
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Return a placeholder with the same structure to prevent layout shift
    return (
      <div className="flex flex-col min-h-screen">
        <div className="h-24 sm:h-32"></div> {/* Header placeholder */}
        <main className="flex-grow">{children}</main>
        <div className="h-96"></div> {/* Footer placeholder */}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
