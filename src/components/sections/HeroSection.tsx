'use client';

import { useState, useEffect, useRef, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { handleImageError } from '@/utils/imageUtils';

// Memoize the entire component to prevent unnecessary re-renders
export default memo(function HeroSection() {
  const [isClient, setIsClient] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Use a single effect for all client-side initializations
  useEffect(() => {
    // Mark as client-side rendered
    setIsClient(true);
    
    // Define video loading logic
    const loadVideo = () => {
      if (videoRef.current) {
        // Add event listeners to handle video loading state
        videoRef.current.addEventListener('loadeddata', () => {
          setVideoLoaded(true);
        });

        // Attempt to play the video
        videoRef.current.play().catch(error => {
          console.error("Video autoplay failed:", error);
          // Show the poster image as fallback
          setVideoLoaded(false);
        });
      }
    };

    // Load video with requestIdleCallback to avoid blocking main thread
    if ('requestIdleCallback' in window) {
      // @ts-ignore - TypeScript doesn't recognize requestIdleCallback
      window.requestIdleCallback(loadVideo, { timeout: 2000 });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(loadVideo, 100);
    }

    // Cleanup function
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.removeEventListener('loadeddata', () => {
          setVideoLoaded(true);
        });
      }
    };
  }, []);

  // Statically define the section's content part to avoid re-renders
  const heroContent = (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4 z-20 callout">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">ANGEL GRANITES</h1>
      <div className="text-xl md:text-2xl mb-2 established-by">Established by Angel Stones</div>
      <div className="text-lg mb-4 tagline">Elevating granite, preserving memories</div>
      <div className="text-base mb-8 desc">Exquisite Granite Monuments and others</div>
      <Link 
        href="#our-product" 
        className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md font-medium transition-colors button"
        aria-label="View all products"
      >
        VIEW ALL PRODUCTS
      </Link>
    </div>
  );

  // Statically define the scroll indicator to avoid re-renders
  const scrollIndicator = (
    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 animate-bounce hidden md:block">
      <Link 
        href="/#who-we-are" 
        className="text-white flex flex-col items-center opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Scroll down to Who We Are section"
      >
        <span className="text-sm mb-2">Scroll Down</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </Link>
    </div>
  );

  // Server-side render and client hydration optimization
  if (!isClient) {
    return (
      <section id="home" className="relative h-screen min-h-[480px] bg-secondary overflow-hidden hero-section">
        {/* Optimized poster image for LCP */}
        <div className="absolute inset-0">
          <div className="relative h-full w-full">
            <Image 
              src="/images/video-poster.jpg"
              alt="Angel Granites - Premium Monuments & Headstones"
              fill
              priority={true}
              className="object-cover hero-image"
              sizes="100vw"
              fetchPriority="high"
              onError={handleImageError}
            />
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          </div>
        </div>
        
        {/* Content */}
        {heroContent}
      </section>
    );
  }

  return (
    <section id="home" className="relative h-screen min-h-[480px] bg-secondary overflow-hidden hero-section">
      <div className="absolute inset-0">
        {/* Video container with conditional display */}
        <div className="relative h-full w-full">
          {/* Picture element for responsive images */}
          <div className={videoLoaded ? 'hidden' : 'block absolute inset-0'}>
            <Image 
              src="/images/video-poster.jpg"
              alt="Angel Granites - Premium Monuments & Headstones"
              fill
              priority={true}
              className="object-cover hero-image"
              sizes="100vw"
              fetchPriority="high"
              onError={handleImageError}
            />
          </div>
          
          {/* Video background loaded with lower priority than critical content */}
          <video
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-cover ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
            autoPlay
            muted
            loop
            playsInline
            poster="/images/video-poster.jpg"
            preload="metadata"
            aria-hidden="true"
          >
            <source src="/images/as.webm" type="video/webm" />
            <source src="/images/as.mp4" type="video/mp4" />
            {/* No text needed since we have the image fallback */}
          </video>
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
      </div>
      
      {/* Content */}
      {heroContent}
      
      {/* Scroll Down Indicator */}
      {scrollIndicator}
    </section>
  );
});
