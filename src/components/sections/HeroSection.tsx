'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

export default function HeroSection() {
  // Using a state to track if video has loaded
  const [videoLoaded, setVideoLoaded] = useState(false);
  
  const heroContent = {
    title: 'TIMELESS ELEGANCE',
    subtitle: 'Premium Granite Monuments',
    branding: 'ANGEL GRANITES',
    tagline: 'A Venture of Angel Stones'
  };
  
  // Handle video loaded event
  const handleVideoLoaded = useCallback(() => {
    setVideoLoaded(true);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-primary-900">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/images/video-poster-optimized.jpg"
          className={`object-cover w-full h-full transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ objectPosition: 'center center' }}
          onLoadedData={handleVideoLoaded}
        >
          <source src="/images/as.webm" type="video/webm" />
        </video>
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-6">
            <div className="flex flex-col items-center space-y-2">
              <h3 className="font-serif text-sm tracking-widest uppercase text-accent-200 animate-slide-down">
                {heroContent.branding}
              </h3>
              <p className="text-xs tracking-wider text-accent-100 animate-slide-down">
                {heroContent.tagline}
              </p>
            </div>
            <div className="luxury-divider mx-auto w-24"></div>
            <h1 className="mt-4 font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-tight animate-fade-in">
              {heroContent.title}
            </h1>
            <p className="mt-6 text-xl text-accent-100 animate-slide-up">
              {heroContent.subtitle}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/products" 
                className="btn btn-primary px-8 py-4"
              >
                View Our Collection
              </Link>
              <Link 
                href="/contact" 
                className="btn btn-outline border border-white text-white hover:bg-white hover:bg-opacity-10 px-8 py-4"
              >
                Get In Touch
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center">
        <div className="animate-bounce text-white opacity-70">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-8"
          >
            <path d="M7 13l5 5 5-5" />
            <path d="M7 7l5 5 5-5" />
          </svg>
        </div>
      </div>
    </section>
  );
}
