import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.2 }
    );

    // Store refs in variables to prevent issues in cleanup function
    const textElement = textRef.current;
    const imageElement = imageRef.current;
    
    if (textElement) observer.observe(textElement);
    if (imageElement) observer.observe(imageElement);

    return () => {
      // Use stored variables instead of current ref values
      if (textElement) observer.unobserve(textElement);
      if (imageElement) observer.unobserve(imageElement);
    };
  }, []);

  return (
    <section ref={sectionRef} className="section bg-white overflow-hidden relative">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-subtle-gradient opacity-50"></div>
      
      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text content */}
          <div ref={textRef} className="reveal">
            <h3 className="font-serif text-sm tracking-widest uppercase text-accent-700 mb-2">
              Welcome to
            </h3>
            <div className="luxury-divider w-24 mb-6"></div>
            <h2 className="section-title">
              Angel Granites
            </h2>
            <h3 className="font-serif text-sm tracking-widest uppercase text-accent-700 mb-4">
              A Venture of Angel Stones
            </h3>
            <p className="text-primary-700 mb-8 leading-relaxed">
              <strong className="text-accent-700">Introduction</strong><br />
              Angel Granites, established by Angel Stones, is a distinguished US-based company dedicated to crafting timeless granite products. Our extensive range includes meticulously designed monuments, slabs, and other exquisite items. With a commitment to quality, aesthetics, and customer satisfaction, we invite you to explore our offerings.
            </p>
            
            <div className="bg-accent-50 p-6 rounded-lg shadow-sm mb-8">
              <h3 className="text-lg font-serif text-primary-900 mb-2">Contact Info</h3>
              <div className="w-16 h-1 bg-accent-200 mb-4"></div>
              <div className="flex items-center gap-3 mb-3">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 text-accent-700" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
                  />
                </svg>
                <p className="text-primary-700">
                  <a href="tel:+18666825837" className="hover:text-accent-700 transition-colors">+1 866-682-5837</a>
                </p>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 text-accent-700" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                  />
                </svg>
                <p className="text-primary-700">
                  <a href="mailto:info@theangelstones.com" className="hover:text-accent-700 transition-colors">info@theangelstones.com</a>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 text-accent-700" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                  />
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                  />
                </svg>
                <p className="text-primary-700">Elberton, GA</p>
              </div>
            </div>
            
            <Link href="/about" className="btn btn-text mt-8 inline-flex items-center gap-2">
              Discover Our Story
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
          
          {/* Image grid */}
          <div ref={imageRef} className="reveal">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-square relative overflow-hidden shadow-luxury">
                  <Image
                    src="/images/about/craftsman.jpg"
                    alt="Master craftsman working on granite"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="aspect-[4/3] relative overflow-hidden shadow-luxury">
                  <Image
                    src="/images/about/workshop.jpg"
                    alt="Angel Granites workshop"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="aspect-[3/4] relative overflow-hidden shadow-luxury">
                  <Image
                    src="/images/about/monument.jpg"
                    alt="Finished granite monument"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="aspect-square relative overflow-hidden shadow-luxury">
                  <Image
                    src="/images/about/materials.jpg"
                    alt="Premium granite materials"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
