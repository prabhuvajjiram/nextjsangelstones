'use client';

import Image from 'next/image';
import Link from 'next/link';

const AboutSection = () => {
  return (
    <section id="who-we-are" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Image Column */}
          <div className="md:w-1/2 relative">
            <div className="relative z-10">
              <Image
                src="/images/about-img.jpg"
                alt="Angel Granites Workshop"
                width={600}
                height={450}
                className="rounded-lg shadow-xl object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-2/3 h-2/3 z-0">
              <Image
                src="/images/about-img2.jpg"
                alt="Granite Detail"
                width={400}
                height={300}
                className="rounded-lg shadow-xl object-cover"
              />
            </div>
            <div className="absolute -top-6 -left-6 bg-primary w-20 h-20 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-playfair text-xl">25+</span>
            </div>
            <div className="absolute -top-6 -left-6 bg-primary/20 w-20 h-20 rounded-full animate-ping"></div>
          </div>
          
          {/* Content Column */}
          <div className="md:w-1/2">
            <div className="mb-4">
              <span className="text-primary font-medium uppercase tracking-widest">Who We Are</span>
              <h2 className="text-3xl md:text-4xl font-playfair mt-2 mb-6">
                Crafting Timeless Memorials Since 1998
              </h2>
              <div className="w-20 h-1 bg-primary mb-6"></div>
            </div>
            
            <p className="text-gray-700 mb-6">
              Angel Granites, a venture of Angel Stones, is a premier manufacturer of granite monuments, headstones, and memorial stones. With over 25 years of experience, we have established ourselves as a trusted name in the memorial industry.
            </p>
            
            <p className="text-gray-700 mb-6">
              Our dedication to quality craftsmanship and attention to detail has made us the preferred choice for families seeking to honor their loved ones with dignified and lasting memorials. We combine traditional stoneworking techniques with modern technology to create monuments that stand the test of time.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start">
                <div className="bg-primary/10 p-3 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Premium Quality</h3>
                  <p className="text-gray-600">Finest granite sourced globally</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-primary/10 p-3 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Timely Delivery</h3>
                  <p className="text-gray-600">Nationwide shipping services</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-primary/10 p-3 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Expert Consultation</h3>
                  <p className="text-gray-600">Personalized design assistance</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-primary/10 p-3 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Flexible Payment</h3>
                  <p className="text-gray-600">Multiple payment options</p>
                </div>
              </div>
            </div>
            
            <Link 
              href="/#get-in-touch" 
              className="inline-block bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-md transition-colors duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
