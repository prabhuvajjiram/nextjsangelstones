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

    if (textRef.current) observer.observe(textRef.current);
    if (imageRef.current) observer.observe(imageRef.current);

    return () => {
      if (textRef.current) observer.unobserve(textRef.current);
      if (imageRef.current) observer.unobserve(imageRef.current);
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
              Our Legacy
            </h3>
            <div className="luxury-divider w-24 mb-6"></div>
            <h2 className="section-title">
              Crafting Memories in Stone Since 1995
            </h2>
            <p className="text-primary-700 mb-6 leading-relaxed">
              At Angel Granites, we believe that every memorial should be as unique as the life it commemorates. For over 25 years, our master artisans have been transforming the finest granite into lasting tributes that honor cherished memories.
            </p>
            <p className="text-primary-700 mb-8 leading-relaxed">
              From traditional headstones to custom monuments, each piece we create reflects our commitment to exceptional craftsmanship and attention to detail. Our dedication to quality and personalized service has made us a trusted partner for families seeking to create meaningful memorials for their loved ones.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-accent-50 flex items-center justify-center flex-shrink-0">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-8 w-8 text-accent-700" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" 
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-serif text-primary-900">Premium Materials</h3>
                  <p className="text-sm text-primary-600">Sourced from world-class quarries</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-accent-50 flex items-center justify-center flex-shrink-0">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-8 w-8 text-accent-700" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-serif text-primary-900">Custom Designs</h3>
                  <p className="text-sm text-primary-600">Personalized for each family</p>
                </div>
              </div>
            </div>
            
            <Link href="/about" className="btn btn-text mt-8 inline-flex items-center gap-2">
              Discover Our Story
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M14 5l7 7m0 0l-7 7m7-7H3" 
                />
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
