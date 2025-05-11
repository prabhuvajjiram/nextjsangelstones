'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      image: '/images/hero/hero1.jpg',
      title: 'TIMELESS ELEGANCE',
      subtitle: 'Premium Granite Monuments',
    },
    {
      image: '/images/hero/hero2.jpg',
      title: 'CRAFTED PERFECTION',
      subtitle: 'Exquisite Memorial Stones',
    },
    {
      image: '/images/hero/hero3.jpg',
      title: 'ENDURING LEGACY',
      subtitle: 'Bespoke Headstone Designs',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handlePrev = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-primary-900">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            currentSlide === index ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority
            quality={90}
            sizes="100vw"
            className="object-cover"
            style={{ 
              objectPosition: 'center 30%',
              transform: currentSlide === index ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 8s ease-in-out'
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>
      ))}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-6">
            <h3 className="font-serif text-sm tracking-widest uppercase text-accent-200 animate-slide-down">
              ANGEL GRANITES
            </h3>
            <div className="luxury-divider mx-auto w-24"></div>
            <h1 className="mt-4 font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-tight animate-fade-in">
              {slides[currentSlide].title}
            </h1>
            <p className="mt-6 text-xl text-accent-100 animate-slide-up">
              {slides[currentSlide].subtitle}
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

      {/* Navigation */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center space-x-8">
        <button
          onClick={handlePrev}
          className="group p-2 text-white transition-colors hover:text-accent-300"
          aria-label="Previous slide"
        >
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
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="flex items-center space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 w-2 rounded-full ${
                currentSlide === index ? 'bg-accent-300 w-4' : 'bg-white bg-opacity-50'
              } transition-all duration-300`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        <button
          onClick={handleNext}
          className="group p-2 text-white transition-colors hover:text-accent-300"
          aria-label="Next slide"
        >
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
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </section>
  );
}
