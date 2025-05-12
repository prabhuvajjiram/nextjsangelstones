'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
// import formatCategoryName removed as it's not used
import dynamic from 'next/dynamic';
import { handleImageError as handleImageErrorUtil } from '@/utils/imageUtils';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Dynamically import the modal to avoid SSR issues
const ProductModal = dynamic(() => import('@/components/modals/ProductModal'), {
  ssr: false,
});

interface ColorImage {
  name: string;
  path: string;
  category: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const colorSamples: ColorImage[] = [
  { name: 'Bahama Blue', path: 'Bahama-Blue.jpg', category: 'colors' },
  { name: 'Jet Black', path: 'Jet-Black.jpg', category: 'colors' },
  { name: 'NH Red', path: 'NH-Red.jpg', category: 'colors' },
  { name: 'Aurora', path: 'aurora.jpg', category: 'colors' },
  { name: 'Blue Pearl', path: 'bluepearl.jpg', category: 'colors' },
  { name: 'Galaxy', path: 'galaxy.jpg', category: 'colors' },
  { name: 'Green', path: 'green.jpg', category: 'colors' },
  { name: 'Himalayan Blue', path: 'himalayan-blue.jpg', category: 'colors' },
  { name: 'Indian Black', path: 'indian-black.jpg', category: 'colors' },
  { name: 'Paradiso', path: 'paradiso.jpg', category: 'colors' },
  { name: 'Vizag Blue', path: 'vizag-blue.jpg', category: 'colors' },
  { name: 'White & Red', path: 'white-and-red.jpg', category: 'colors' },
];

export default function ColorsSection() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [colorImages, setColorImages] = useState<ColorImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchColorImages = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/colors');
        if (!response.ok) {
          throw new Error(`Failed to fetch color images: ${response.status}`);
        }
        const data = await response.json();
        setColorImages(data);
      } catch (err) {
        console.error('Error fetching color images:', err);
        setError('Failed to load color images. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchColorImages();
  }, []);

  const handleImageClick = (image: ColorImage) => {
    const idx = colorImages.findIndex((img) => img.path === image.path);
    setSelectedIndex(idx);
  };

  const handleCloseModal = () => {
    setSelectedIndex(null);
  };

  const handlePrevious = () => {
    if (selectedIndex !== null && colorImages.length > 0) {
      setSelectedIndex((selectedIndex - 1 + colorImages.length) % colorImages.length);
    }
  };

  const handleNext = () => {
    if (selectedIndex !== null && colorImages.length > 0) {
      setSelectedIndex((selectedIndex + 1) % colorImages.length);
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">
          Our Selection of Premium Stones
        </h2>
        
        {loading ? (
          <div className="text-center">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <>
            {/* Swiper carousel for all devices */}
            <Swiper
              spaceBetween={16}
              slidesPerView={1.2}
              breakpoints={{
                480: { slidesPerView: 1.5 },
                640: { slidesPerView: 2 },
                768: { slidesPerView: 2.5 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 4 },
              }}
              autoplay={{ delay: 2500, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              }}
              modules={[Autoplay, Pagination, Navigation]}
              style={{ paddingBottom: '2.5rem' }}
            >
              {colorImages.map((image, index) => (
                <SwiperSlide key={index}>
                  <div
                    className="group relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                    onClick={() => handleImageClick(image)}
                  >
                    <Image
                      src={`/images/colors/${image.path}`}
                      alt={image.name}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-75"
                      priority={index < 2}
                      quality={85}
                      placeholder="blur"
                      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTVlN2ViIi8+PC9zdmc+"
                      sizes="(max-width: 1280px) 50vw, 25vw"
                      onError={(e) => {
                        handleImageErrorUtil(e, image.path);
                        setImageErrors(prev => ({
                          ...prev,
                          [image.path]: true
                        }));
                      }}
                      style={{ display: imageErrors[image.path] ? 'none' : 'block' }}
                    />
                    {imageErrors[image.path] && (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <p className="text-gray-500 text-sm">Image not available</p>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center">
                      <button
                        className="px-6 py-3 bg-white text-gray-800 font-semibold rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-300 pointer-events-none"
                      >
                        View Details
                      </button>
                    </div>
                    {/* Color name below image */}
                    <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white text-center py-2 text-sm font-semibold">
                      {image.name}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
              {/* Navigation arrows for desktop only */}
              <div className="swiper-button-prev hidden md:flex items-center justify-center bg-black/40 hover:bg-black/70 text-white rounded-full w-10 h-10 absolute top-1/2 -translate-y-1/2 left-2 z-10 transition-all duration-300 opacity-0 group-hover:opacity-100 cursor-pointer">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </div>
              <div className="swiper-button-next hidden md:flex items-center justify-center bg-black/40 hover:bg-black/70 text-white rounded-full w-10 h-10 absolute top-1/2 -translate-y-1/2 right-2 z-10 transition-all duration-300 opacity-0 group-hover:opacity-100 cursor-pointer">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </div>
            </Swiper>
          </>
        )}
      </div>

      {selectedIndex !== null && colorImages[selectedIndex] && (
        <ProductModal
          product={{
            name: colorImages[selectedIndex].name,
            path: `/images/colors/${colorImages[selectedIndex].path}`
          }}
          onClose={handleCloseModal}
          onPrevious={handlePrevious}
          onNext={handleNext}
          hasPrevious={true}
          hasNext={true}
        />
      )}
    </section>
  );
}
