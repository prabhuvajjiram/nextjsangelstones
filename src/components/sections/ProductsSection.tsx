'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { handleImageError } from '@/utils/imageUtils';
import ProductCategoryPage from '../products/ProductCategoryPage';
import dynamic from 'next/dynamic';

// Dynamically import the ProductModal component
const ProductModal = dynamic(() => import('@/components/modals/ProductModal'), {
  ssr: false,
});

interface ProductCategory {
  name: string;
  path: string;
  thumbnail: string;
  count: number;
}

interface ProductImage {
  name: string;
  path: string;
}

const ProductsSection = () => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New state variables for product viewing
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductImage | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Call the API to get product categories
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch product categories');
        }
        const data = await response.json();
        
        setCategories(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product categories:', err);
        setError('Failed to load product categories. Please try again later.');
        setLoading(false);
        
        // Fallback to sample data if API fails
        const sampleData: ProductCategory[] = [
          {
            name: 'Benches',
            path: '/products/Benches',
            thumbnail: '/images/products/Benches/thumbnail.jpg',
            count: 8
          },
          {
            name: 'Columbarium',
            path: '/products/columbarium',
            thumbnail: '/images/products/columbarium/thumbnail.jpg',
            count: 12
          },
          {
            name: 'Designs',
            path: '/products/Designs',
            thumbnail: '/images/products/Designs/thumbnail.jpg',
            count: 24
          },
          {
            name: 'MBNA 2025',
            path: '/products/MBNA_2025',
            thumbnail: '/images/products/MBNA_2025/thumbnail.jpg',
            count: 15
          },
          {
            name: 'Monuments',
            path: '/products/Monuments',
            thumbnail: '/images/products/Monuments/thumbnail.jpg',
            count: 18
          }
        ];
        
        setTimeout(() => {
          setCategories(sampleData);
          setLoading(false);
        }, 500);
      }
    };

    fetchCategories();
  }, []);

  // Function to handle opening a category
  const handleCategoryClick = (category: ProductCategory) => {
    setSelectedCategory(category.name);
  };

  // Function to handle product click
  const handleProductClick = (product: ProductImage) => {
    setSelectedProduct(product);
    setShowModal(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  // Function to close the product modal
  const closeProductModal = () => {
    setShowModal(false);
    document.body.style.overflow = ''; // Re-enable scrolling
  };

  // Go back to categories view
  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  return (
    <section id="our-product" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {!selectedCategory ? (
          // Category selection view
          <>
            <div className="text-center mb-16">
              <span className="text-primary font-medium uppercase tracking-widest">Our Products</span>
              <h2 className="text-3xl md:text-4xl font-playfair mt-2 mb-6">
                Explore Our Granite Collections
              </h2>
              <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover our extensive range of premium granite products, each crafted with precision and care to create lasting memorials for your loved ones.
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 p-8 bg-red-50 rounded-lg">
                <p>{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((category, index) => (
                  <div 
                    key={index}
                    className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                    onClick={() => handleCategoryClick(category)}
                  >
                    <div className="relative h-80 w-full overflow-hidden">
                      <Image
                        src={category.thumbnail}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        onError={(e) => handleImageError(e.currentTarget as HTMLImageElement, category.thumbnail)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                      <div className="flex justify-between items-center">
                        <span className="text-sm opacity-80">{category.count} Products</span>
                        <span className="text-primary group-hover:translate-x-2 transition-transform duration-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          // Product category view with improved navigation
          <ProductCategoryPage 
            initialCategory={selectedCategory} 
            onProductClick={handleProductClick}
            onBackToCategories={handleBackToCategories}
          />
        )}
      </div>

      {/* Product Modal */}
      {showModal && selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={closeProductModal}
        />
      )}
    </section>
  );
};

export default ProductsSection;
