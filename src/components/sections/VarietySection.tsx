'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { handleImageError as handleImageErrorUtil } from '@/utils/imageUtils';

interface GraniteVariety {
  id: number;
  name: string;
  image: string;
  description: string;
  origin: string;
  hardness: string;
  features: string[];
}

const VarietySection = () => {
  // Sample data for granite varieties
  const varieties: GraniteVariety[] = [
    {
      id: 1,
      name: 'Blue Pearl',
      image: '/images/varieties/blue-pearl.jpg',
      description: 'A lustrous blue-grey granite with sparkling silver and blue mineral deposits. Ideal for elegant, contemporary monuments.',
      origin: 'Norway',
      hardness: '6-7 on Mohs scale',
      features: ['Consistent color', 'High durability', 'Frost resistant'],
    },
    {
      id: 2,
      name: 'Absolute Black',
      image: '/images/varieties/absolute-black.jpg',
      description: 'A deep, pure black granite with minimal veining. Perfect for creating striking, high-contrast engravings and designs.',
      origin: 'India',
      hardness: '6-7 on Mohs scale',
      features: ['Uniform color', 'High polish potential', 'Weather resistant'],
    },
    {
      id: 3,
      name: 'Dakota Mahogany',
      image: '/images/varieties/dakota-mahogany.jpg',
      description: 'A warm, reddish-brown granite with black and white speckles. Creates a timeless, natural appearance.',
      origin: 'United States',
      hardness: '6-7 on Mohs scale',
      features: ['Rich color', 'Excellent durability', 'Minimal maintenance'],
    },
    {
      id: 4,
      name: 'Bahama Blue',
      image: '/images/varieties/bahama-blue.jpg',
      description: 'A vibrant blue granite with black and grey patterns. Creates a distinctive, memorable monument.',
      origin: 'Brazil',
      hardness: '6-7 on Mohs scale',
      features: ['Unique patterns', 'Vibrant color', 'High resistance to weathering'],
    },
    {
      id: 5,
      name: 'Imperial Red',
      image: '/images/varieties/imperial-red.jpg',
      description: 'A rich, deep red granite with black mineral deposits. Symbolizes love and creates a bold statement.',
      origin: 'India',
      hardness: '6-7 on Mohs scale',
      features: ['Vibrant color', 'Excellent polish retention', 'Highly durable'],
    },
    {
      id: 6,
      name: 'Emerald Pearl',
      image: '/images/varieties/emerald-pearl.jpg',
      description: 'A dark green-black granite with iridescent crystals that shimmer like pearls. Creates an elegant, distinctive memorial.',
      origin: 'Norway',
      hardness: '6-7 on Mohs scale',
      features: ['Unique appearance', 'High durability', 'Excellent polish'],
    },
  ];

  const [selectedVariety, setSelectedVariety] = useState<GraniteVariety | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openVarietyModal = (variety: GraniteVariety) => {
    setSelectedVariety(variety);
    setIsModalOpen(true);
  };

  const closeVarietyModal = () => {
    setIsModalOpen(false);
  };

  // Handle image errors
  const onImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const originalSrc = img.src;
    handleImageErrorUtil(e, originalSrc);
  };

  return (
    <section id="granite-varieties" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-primary font-medium uppercase tracking-widest">Granite Varieties</span>
          <h2 className="text-3xl md:text-4xl font-playfair mt-2 mb-6">
            Our Selection of Premium Stones
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We offer a wide variety of high-quality granite stones from around the world. Each type has unique characteristics, colors, and patterns to create the perfect memorial.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {varieties.map((variety) => (
            <div
              key={variety.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => openVarietyModal(variety)}
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={variety.image}
                  alt={variety.name}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  onError={onImageError}
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{variety.name}</h3>
                <p className="text-sm text-gray-500 mb-2">Origin: {variety.origin}</p>
                <p className="text-gray-600 text-sm line-clamp-2">{variety.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link 
            href="/granite-varieties"
            className="inline-block bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-md transition-colors duration-300"
          >
            View All Varieties
          </Link>
        </div>
      </div>

      {/* Variety Detail Modal */}
      {isModalOpen && selectedVariety && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <button
              onClick={closeVarietyModal}
              className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative h-64 md:h-auto">
                <Image
                  src={selectedVariety.image}
                  alt={selectedVariety.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  onError={onImageError}
                />
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">{selectedVariety.name}</h3>
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center mb-2">
                    <span className="font-medium w-24">Origin:</span>
                    <span>{selectedVariety.origin}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium w-24">Hardness:</span>
                    <span>{selectedVariety.hardness}</span>
                  </div>
                </div>
                
                <h4 className="font-bold text-lg mb-2">Description</h4>
                <p className="text-gray-600 mb-6">{selectedVariety.description}</p>
                
                <h4 className="font-bold text-lg mb-2">Features</h4>
                <ul className="list-disc list-inside text-gray-600 mb-6">
                  {selectedVariety.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                
                <h4 className="font-bold text-lg mb-2">Ideal For</h4>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">Headstones</span>
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">Monuments</span>
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">Markers</span>
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">Memorial Benches</span>
                </div>
                
                <div className="mt-6">
                  <Link 
                    href="/contact"
                    className="inline-block bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-md transition-colors duration-300"
                  >
                    Request a Quote
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default VarietySection;
