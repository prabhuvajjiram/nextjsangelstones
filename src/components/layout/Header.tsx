'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPromotionVisible, setIsPromotionVisible] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Prevent body scrolling when menu is open
    document.body.style.overflow = !isMenuOpen ? 'hidden' : '';
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = '';
  };

  const minimizePromotion = () => {
    // Implement minimize functionality if needed
    console.log('Minimize promotion');
  };

  const closePromotion = () => {
    setIsPromotionVisible(false);
  };

  // Server-side rendering version to avoid hydration mismatch
  if (!isClient) {
    return (
      <>
        {/* Promotion Banner */}
        <div className="bg-secondary text-white text-center py-2 px-4 text-sm relative z-[1000]">
          <div className="container mx-auto">
            Special Offer: Free shipping on all orders over $1000. Call us!
          </div>
        </div>
        
        {/* Header */}
        <header className="fixed top-0 left-0 w-full py-4 bg-black/80 z-[999] backdrop-blur-md">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center">
                <Image 
                  src="/images/ag_logo.svg" 
                  alt="Angel Granites" 
                  width={200} 
                  height={80}
                  className="h-[45px] w-auto"
                />
              </Link>
            </div>
          </div>
        </header>
      </>
    );
  }

  return (
    <>
      {/* Promotion Banner */}
      {isPromotionVisible && (
        <div className="bg-secondary text-white text-center py-2 px-4 text-sm relative z-[1000]">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex-1"></div>
            <div className="flex-1">
              Special Offer: Free shipping on all orders over $1000. Call us!
            </div>
            <div className="flex-1 flex justify-end">
              <button 
                onClick={minimizePromotion}
                className="text-white mx-1 opacity-70 hover:opacity-100"
                aria-label="Minimize promotion banner"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button 
                onClick={closePromotion}
                className="text-white mx-1 opacity-70 hover:opacity-100"
                aria-label="Close promotion banner"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Header */}
      <header className={`fixed top-0 left-0 w-full py-4 bg-black/80 z-[999] backdrop-blur-md transition-all duration-300 ${isScrolled ? 'py-2 shadow-md' : ''}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <Image 
                src="/images/ag_logo.svg" 
                alt="Angel Granites" 
                width={200} 
                height={80}
                className="h-[45px] w-auto"
              />
            </Link>
            
            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden flex flex-col justify-center items-center w-10 h-10 relative z-50"
              onClick={toggleMenu}
              aria-label="Toggle navigation menu"
            >
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`}></span>
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`}></span>
            </button>
            
            {/* Phone Number */}
            <div className="hidden md:flex items-center">
              <a href="tel:1-800-123-4567" className="text-white hover:text-primary flex items-center space-x-2 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>1-800-123-4567</span>
              </a>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black/80 z-[998] transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={closeMenu}
      ></div>
      
      {/* Mobile Navigation Menu */}
      <nav className={`fixed top-0 right-0 h-screen w-[300px] bg-secondary z-[999] flex flex-col justify-center transform transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="px-8 py-4 border-b border-gray-700">
          <Link href="/" onClick={closeMenu}>
            <Image 
              src="/images/ag_logo.svg" 
              alt="Angel Granites" 
              width={150} 
              height={60}
              className="h-auto w-full max-w-[150px]"
            />
          </Link>
        </div>
        
        <ul className="flex flex-col items-start space-y-6 px-8 py-8">
          <li><Link href="#home" className="text-white text-xl py-3 hover:text-primary transition-colors" onClick={closeMenu}>Home</Link></li>
          <li><Link href="#our-product" className="text-white text-xl py-3 hover:text-primary transition-colors" onClick={closeMenu}>Our Products</Link></li>
          <li><Link href="#featured-products" className="text-white text-xl py-3 hover:text-primary transition-colors" onClick={closeMenu}>Featured Products</Link></li>
          <li><Link href="#projects" className="text-white text-xl py-3 hover:text-primary transition-colors" onClick={closeMenu}>Projects</Link></li>
          <li><Link href="#why-choose-us" className="text-white text-xl py-3 hover:text-primary transition-colors" onClick={closeMenu}>Why Choose Us</Link></li>
          <li><Link href="#get-in-touch" className="text-white text-xl py-3 hover:text-primary transition-colors" onClick={closeMenu}>Contact</Link></li>
        </ul>
        
        <div className="mt-auto px-8 py-4 border-t border-gray-700">
          <p className="text-gray-400 text-sm">
            &copy; 2024 <a href="https://www.theangelstones.com/" className="text-primary hover:text-primary-dark">Angel Stones</a>. All Rights Reserved
          </p>
        </div>
      </nav>
    </>
  );
}
