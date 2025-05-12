'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { handleImageError as handleImageErrorUtil } from '@/utils/imageUtils';
import Link from 'next/link';

interface FeaturedProduct {
  id: string;
  name: string;
  thumbnail: string;
  fullImage: string;
  category: string;
}

interface FeaturedProductsSectionProps {
  onProductClick?: (product: FeaturedProduct) => void;
}

const FeaturedProductsSection = ({ onProductClick }: FeaturedProductsSectionProps) => {
  const [products, setProducts] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<FeaturedProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
    
    const fetchProducts = async () => {
      try {
        // Use Monuments category since Featured doesn't exist
        const response = await fetch('/api/products/Monuments');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch featured products: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Check if data has the expected structure
        if (data.images && Array.isArray(data.images)) {
          // Map API response to FeaturedProduct interface
          // Define the image structure from API
          interface ProductImageResponse {
            name: string;
            path: string;
          }
          
          const mappedProducts: FeaturedProduct[] = data.images.slice(0, 8).map((image: ProductImageResponse, index: number) => ({
            id: String(index + 1),
            name: image.name.replace(/\.[^/.]+$/, "").replace(/-/g, " "),
            thumbnail: image.path,
            fullImage: image.path,
            category: 'Monuments'
          }));
          
          setProducts(mappedProducts);
        } else {
          console.error('Invalid data format:', data);
          throw new Error('Invalid data format received from API');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setError('Failed to load featured products. Please try again later.');
        setLoading(false);
        
        // Set fallback products if fetch fails
        setProducts([
          {
            id: '1',
            name: 'Granite Monument',
            thumbnail: '/images/placeholder.jpg',
            fullImage: '/images/placeholder.jpg',
            category: 'Monuments'
          },
          {
            id: '2',
            name: 'Custom Headstone',
            thumbnail: '/images/placeholder.jpg',
            fullImage: '/images/placeholder.jpg',
            category: 'Monuments'
          },
          {
            id: '3',
            name: 'Memorial Stone',
            thumbnail: '/images/placeholder.jpg',
            fullImage: '/images/placeholder.jpg',
            category: 'Monuments'
          },
          {
            id: '4',
            name: 'Granite Slab',
            thumbnail: '/images/placeholder.jpg',
            fullImage: '/images/placeholder.jpg',
            category: 'Monuments'
          }
        ]);
      }
    };

    fetchProducts();
    
    // Add event listener for clicks outside modal
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModal();
      }
    };
    
    if (isClient) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      if (isClient) {
        document.removeEventListener('mousedown', handleClickOutside);
      }
    };
  }, [isClient]);

  const openModal = (product: FeaturedProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = '';
  };

  const handleProductClick = (product: FeaturedProduct) => {
    if (onProductClick) {
      onProductClick(product);
    } else {
      openModal(product);
    }
  };

  return (
    <section id="featured-products" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our exceptional collection of premium granite products crafted with precision and care.
          </p>
        </div>

        {loading && !products.length ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error && !products.length ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div 
                key={product.id}
                className="group cursor-pointer relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                onClick={() => handleProductClick(product)}
              >
                <div className="relative aspect-square">
                  <Image
                    src={product.thumbnail}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => handleImageErrorUtil(e, product.thumbnail)}
                    priority={parseInt(product.id) < 3} // Prioritize first two featured products
                    quality={85}
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmYWZjIi8+PC9zdmc+"
                    style={{
                      objectFit: 'cover',
                      objectPosition: 'center',
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-4 bg-white">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">Premium Quality</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/products" className="inline-block bg-primary text-white px-8 py-3 rounded-md hover:bg-primary/90 transition-colors">
            View All Products
          </Link>
        </div>

        {/* Product Modal */}
        {isModalOpen && selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
            <div ref={modalRef} className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
              <div className="relative">
                <button 
                  onClick={closeModal}
                  className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                  aria-label="Close modal"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                <div className="relative h-[50vh]">
                  <Image
                    src={selectedProduct.fullImage}
                    alt={selectedProduct.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                    onError={(e) => handleImageErrorUtil(e, selectedProduct.fullImage)}
                  />
                </div>
                
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2">{selectedProduct.name}</h2>
                  <p className="text-gray-600 mb-4">
                    Premium quality granite crafted with precision and attention to detail.
                  </p>
                  
                  <div className="flex justify-between items-center mt-6">
                    <button 
                      onClick={closeModal}
                      className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300 transition-colors"
                    >
                      Close
                    </button>
                    <Link 
                      href="/contact" 
                      className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90 transition-colors"
                    >
                      Inquire About This Product
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProductsSection;
