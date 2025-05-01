'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
  const [isClient, setIsClient] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setIsClient(true);
    
    // Play video when component mounts
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Video autoplay failed:", error);
      });
    }
  }, []);

  // Only render interactive elements on the client to avoid hydration mismatch
  if (!isClient) {
    return (
      <section id="home" className="relative h-screen min-h-[480px] bg-secondary overflow-hidden">
        {/* Poster image for server-side rendering */}
        <div className="absolute inset-0">
          <div className="relative h-full w-full">
            <picture className="absolute inset-0">
              <source 
                srcSet="/images/video-poster-mobile.webp 768w, /images/video-poster.webp 1920w"
                sizes="(max-width: 768px) 100vw, 1920px"
                type="image/webp"
              />
              <source 
                srcSet="/images/video-poster-mobile.jpg 768w, /images/video-poster.jpg 1920w"
                sizes="(max-width: 768px) 100vw, 1920px"
                type="image/jpeg"
              />
              <Image 
                src="/images/video-poster.jpg"
                alt="Angel Granites Welcome"
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
            </picture>
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          </div>
        </div>
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4 z-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">ANGEL GRANITES</h1>
          <div className="text-xl md:text-2xl mb-2">Established by Angel Stones</div>
          <div className="text-lg mb-4">Elevating granite, preserving memories</div>
          <div className="text-base mb-8">Exquisite Granite Monuments and others</div>
          <Link 
            href="#our-product" 
            className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md font-medium transition-colors"
          >
            VIEW ALL PRODUCTS
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section id="home" className="relative h-screen min-h-[480px] bg-secondary overflow-hidden">
      <div className="absolute inset-0">
        {/* Video container */}
        <div className="relative h-full w-full">
          {/* Poster image that shows while video loads */}
          <picture className="absolute inset-0">
            <source 
              srcSet="/images/video-poster-mobile.webp 768w, /images/video-poster.webp 1920w"
              sizes="(max-width: 768px) 100vw, 1920px"
              type="image/webp"
            />
            <source 
              srcSet="/images/video-poster-mobile.jpg 768w, /images/video-poster.jpg 1920w"
              sizes="(max-width: 768px) 100vw, 1920px"
              type="image/jpeg"
            />
            <Image 
              src="/images/video-poster.jpg"
              alt="Angel Granites Welcome"
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </picture>
          
          {/* Video background */}
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster="/images/video-poster.jpg"
            style={{ opacity: 1, objectFit: 'cover', width: '100%', height: '100%', display: 'block' }}
          >
            <source src="/images/as.webm" type="video/webm" />
            <source src="/images/as.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
      </div>
      
      {/* Content - using the exact class names from the original site */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4 z-20 callout">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">ANGEL GRANITES</h1>
        <div className="text-xl md:text-2xl mb-2 established-by">Established by Angel Stones</div>
        <div className="text-lg mb-4 tagline">Elevating granite, preserving memories</div>
        <div className="text-base mb-8 desc">Exquisite Granite Monuments and others</div>
        <Link 
          href="#our-product" 
          className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md font-medium transition-colors button"
        >
          VIEW ALL PRODUCTS
        </Link>
      </div>
      
      {/* Scroll Down Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 animate-bounce hidden md:block">
        <Link 
          href="/#who-we-are" 
          className="text-white flex flex-col items-center opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Scroll down"
        >
          <span className="text-sm mb-2">Scroll Down</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
