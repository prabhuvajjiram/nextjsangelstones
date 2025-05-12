'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SearchBar from '@/components/search/SearchBar';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close menu when route changes
    setIsMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // When opening the menu, ensure search is closed
    if (!isMenuOpen) {
      setSearchOpen(false);
    }
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    // When opening search, ensure menu is closed
    if (!searchOpen) {
      setIsMenuOpen(false);
    }
  };

  // Define navigation links in one place for consistency
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/#about', label: 'About' },
    { href: '/#products', label: 'Products' },
    { href: '/#projects', label: 'Projects' },
    { href: '/#contact', label: 'Contact' },
  ];

  // Helper function to check if a link is active
  const isLinkActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white bg-opacity-95 shadow-luxury text-primary-900' : 'bg-transparent text-white'}`}>
      <div className="container mx-auto py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative z-10 flex items-center">
            <span className="font-serif text-2xl tracking-wide">
              ANGEL
              <span className="font-light"> GRANITES</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className={`nav-link ${isLinkActive(link.href) ? 'nav-link-active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
            <button 
              onClick={toggleSearch}
              className="px-4 py-2 text-current hover:text-accent-700 transition-colors"
              aria-label="Search"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-5 h-5"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button 
              onClick={toggleSearch}
              className="relative z-10 p-2 text-current"
              aria-label="Search"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-5 h-5"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
            <button 
              onClick={toggleMenu} 
              className="relative z-10 p-2 text-current focus:outline-none" 
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-6 h-6"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-6 h-6"
                >
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar (Appears on both mobile and desktop) */}
        {searchOpen && (
          <div className="absolute inset-x-0 top-0 bg-white shadow-luxury z-20 py-4 px-4 md:px-8 animate-fadeDown">
            <div className="container mx-auto">
              <div className="flex items-center justify-between">
                <SearchBar onClose={() => setSearchOpen(false)} />
                <button 
                  onClick={() => setSearchOpen(false)}
                  className="ml-4 text-gray-500 hover:text-accent-700"
                  aria-label="Close search"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-6 w-6" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div
          className="mobile-nav fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md text-white"
          style={{ minHeight: '100vh' }}
          aria-modal="true"
          role="dialog"
        >
          {/* Logo at the top center */}
          <Link href="/" className="absolute left-1/2 top-8 -translate-x-1/2 flex flex-col items-center z-10" onClick={() => setIsMenuOpen(false)}>
            <Image src="/images/ag_logo.svg" alt="Angel Granites Logo" width={80} height={80} className="mb-4" priority />
          </Link>
          {/* Close button */}
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-accent-300 text-3xl z-20 focus:outline-none"
            aria-label="Close menu"
          >
            &times;
          </button>
          <nav className="flex flex-col items-center space-y-8 mt-36 mb-12 w-full">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`mobile-nav-link text-xl font-semibold tracking-wide py-2 px-6 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent-700 ${isLinkActive(link.href) ? 'mobile-nav-link-active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          {/* Call-to-action button at the bottom */}
          <div className="absolute bottom-10 left-0 w-full flex justify-center">
            <Link
              href="/contact"
              className="bg-accent-700 hover:bg-accent-800 text-white text-base font-semibold py-3 px-10 rounded-full shadow-xl border border-accent-200/30 transition-colors duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
