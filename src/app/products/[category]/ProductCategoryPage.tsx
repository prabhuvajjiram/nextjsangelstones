'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { handleImageError as handleImageErrorUtil, getImagePath, isImageValid } from '@/utils/imageUtils';
import dynamic from 'next/dynamic';
import Layout from '@/components/layout/Layout';

// Dynamically import the ProductModal component to avoid issues
const ProductModal = dynamic(() => import('@/components/modals/ProductModal'), {
  ssr: false, // Disable server-side rendering for this component
});

interface ProductImage {
  name: string;
  path: string;
}

interface ProductCategoryPageProps {
  category: string;
}

export default function ProductCategoryPage({ category }: ProductCategoryPageProps) {
  // Initialize states
  const [products, setProducts] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductImage | null>(null);
  const [selectedProductIndex, setSelectedProductIndex] = useState<number>(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Safely access params
  const categoryTitle = category ? category.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim() : '';
  const isMBNACategory = category === 'MBNA_2025';

  // Client-side mounting effect
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Data fetching effect with proper cleanup
  useEffect(() => {
    let isSubscribed = true;

    if (!category || !isMounted) {
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log(`Fetching products for category: ${category}`);

        const response = await fetch(`/api/products/${encodeURIComponent(category)}`);
        
        if (!response.ok) {
          console.error(`API Error: ${response.status} - ${await response.text()}`);
          throw new Error(`Failed to fetch products (Status: ${response.status})`);
        }

        const data = await response.json();
        console.log(`API Response for ${category}:`, data);

        if (data?.images && Array.isArray(data.images)) {
          const validProducts = data.images.filter(img => img && img.path);
          if (isSubscribed) {
            setProducts(validProducts);
          }
        } else {
          console.error('Invalid API response:', data);
          if (isSubscribed) {
            setError('No products found in this category');
          }
        }
      } catch (err) {
        console.error(`Error fetching ${category} products:`, err);
        if (isSubscribed) {
          setError(`Failed to load products. Please try again later.`);
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isSubscribed = false;
    };
  }, [category, isMounted, isMBNACategory]);

  // Event handlers using useCallback to maintain reference stability
  const openModal = useCallback((product: ProductImage) => {
    const index = products.findIndex(p => p.path === product.path);
    setSelectedProduct(product);
    setSelectedProductIndex(index);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  }, [products]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    document.body.style.overflow = '';
  }, []);

  const handlePreviousProduct = useCallback(() => {
    if (selectedProductIndex > 0) {
      const newIndex = selectedProductIndex - 1;
      setSelectedProduct(products[newIndex]);
      setSelectedProductIndex(newIndex);
    }
  }, [selectedProductIndex, products]);

  const handleNextProduct = useCallback(() => {
    if (selectedProductIndex < products.length - 1) {
      const newIndex = selectedProductIndex + 1;
      setSelectedProduct(products[newIndex]);
      setSelectedProductIndex(newIndex);
    }
  }, [selectedProductIndex, products]);

  // Render function with consistent structure
  const renderContent = () => {
    if (error) {
      return (
        <div className="text-center py-12">
          <div className="mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-12 w-12 mx-auto text-accent-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </div>
          <p className="text-accent-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn btn-outline px-8"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-700"></div>
        </div>
      );
    }

    if (!products || products.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-accent-600 mb-4">No products found in this category.</p>
          <Link 
            href="/products"
            className="btn btn-outline px-8"
          >
            Back to All Products
          </Link>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <div 
            key={`${product.name}-${index}`}
            className="product-card bg-white rounded-lg shadow-luxury overflow-hidden transition-transform hover:scale-105 cursor-pointer"
            onClick={() => openModal(product)}
          >
            <div className="relative h-64 w-full">
              <Image
                src={isImageValid(product.path) ? getImagePath(product.path) : '/images/placeholder.jpg'}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                quality={80}
                priority={index < 3}
                onError={(e) => handleImageErrorUtil(e, product.path)}
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold">{product.name.replace(/\.[^/.]+$/, "").replace(/-/g, " ")}</h3>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Main return
  return (
    <Layout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{categoryTitle} Products</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our collection of premium {categoryTitle.toLowerCase()} products crafted with precision and care.
            </p>
          </div>

          {renderContent()}
        </div>

        {/* Product Modal - only render on client side when needed */}
        {isMounted && isModalOpen && selectedProduct && (
          <ProductModal 
            product={selectedProduct}
            onClose={closeModal}
            onPrevious={handlePreviousProduct}
            onNext={handleNextProduct}
            hasPrevious={selectedProductIndex > 0}
            hasNext={selectedProductIndex < products.length - 1}
          />
        )}
      </div>
    </Layout>
  );
} 