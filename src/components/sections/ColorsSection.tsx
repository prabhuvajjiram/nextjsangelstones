import Image from 'next/image';
import { useState, useEffect } from 'react';
import { formatCategoryName } from '@/utils/imageUtils';
import dynamic from 'next/dynamic';

// Dynamically import the modal to avoid SSR issues
const ProductModal = dynamic(() => import('@/components/modals/ProductModal'), {
  ssr: false,
});

interface ColorImage {
  name: string;
  path: string;
  category: string;
}

const colorImagesData: ColorImage[] = [
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
  const [selectedImage, setSelectedImage] = useState<ColorImage | null>(null);
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
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleImageError = (imagePath: string) => {
    console.error(`Error loading image: ${imagePath}`);
    setImageErrors(prev => ({
      ...prev,
      [imagePath]: true
    }));
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {colorImages.map((image, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
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
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  onError={() => handleImageError(image.path)}
                  style={{ display: imageErrors[image.path] ? 'none' : 'block' }}
                />
                {imageErrors[image.path] && (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500 text-sm">Image not available</p>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center">
                  <button
                    onClick={() => handleImageClick(image)}
                    className="px-6 py-3 bg-white text-gray-800 font-semibold rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-300"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedImage && (
        <ProductModal
          product={selectedImage}
          onClose={handleCloseModal}
        />
      )}
    </section>
  );
}
