'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ColorsSection from '@/components/sections/ColorsSection';

export default function ProductsPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const categories = [
    { id: 'Monuments', name: 'Monuments' },
    { id: 'Designs', name: 'Designs' },
    { id: 'Slabs', name: 'Slabs' },
    { id: 'Columbarium', name: 'Columbarium' },
  ];

  // Server-side rendering version to avoid hydration mismatch
  if (!isClient) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Products</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our collection of premium granite products crafted with precision and care.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link 
                key={category.id}
                href={`/products/${category.id}`}
                className="block bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105"
              >
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                  <p className="text-gray-600">View {category.name} Collection</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Premium Stones Section */}
        <ColorsSection />
        
        <div className="mt-24">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Products</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our collection of premium granite products crafted with precision and care.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link 
                key={category.id}
                href={`/products/${category.id}`}
                className="block bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105"
              >
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                  <p className="text-gray-600">View {category.name} Collection</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
