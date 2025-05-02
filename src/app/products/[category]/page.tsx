'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { handleImageError } from '@/utils/imageUtils';
import dynamic from 'next/dynamic';

// Dynamically import the ProductModal component to avoid issues
const ProductModal = dynamic(() => import('@/components/modals/ProductModal'), {
  ssr: false, // Disable server-side rendering for this component
});

interface ProductImage {
  name: string;
  path: string;
}

interface CategoryParams {
  category: string;
}

export default function ProductCategoryPage({ params }: { params: CategoryParams }) {
  const [products, setProducts] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductImage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Directly use the params in Next.js for server components
  // This approach avoids the need for the use() hook
  const category = params.category;
  
  const categoryTitle = category.replace(/([A-Z])/g, ' $1').trim();

  useEffect(() => {
    setIsClient(true);
    
    // Only fetch if we have a valid category
    if (category) {
      const fetchProducts = async () => {
        try {
          const response = await fetch(`/api/products/${category}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch ${category} products`);
          }
          
          const data = await response.json();
          
          if (data.images && Array.isArray(data.images)) {
            setProducts(data.images);
          } else {
            throw new Error('Invalid data format received from API');
          }
          
          setLoading(false);
        } catch (err) {
          console.error(`Error fetching ${category} products:`, err);
          setError(`Failed to load ${category} products. Please try again later.`);
          setLoading(false);
        }
      };

      fetchProducts();
    }
  }, [category]);

  const openModal = (product: ProductImage) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = '';
  };

  // Server-side rendering version to avoid hydration mismatch
  if (!isClient) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{categoryTitle} Products</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our collection of premium {categoryTitle.toLowerCase()} products crafted with precision and care.
            </p>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{categoryTitle} Products</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our collection of premium {categoryTitle.toLowerCase()} products crafted with precision and care.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : products.length === 0 ? (
          <div className="text-center py-8">
            <p>No products found in this category.</p>
            <Link href="/products" className="mt-4 inline-block bg-primary text-white px-6 py-2 rounded">
              Return to Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <div 
                key={index} 
                className="product-card bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 cursor-pointer"
                onClick={() => openModal(product)}
              >
                <div className="relative h-64 w-full">
                  <Image
                    src={product.path}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={(e) => handleImageError(e.currentTarget, product.path)}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{product.name.replace(/\.[^/.]+$/, "").replace(/-/g, " ")}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Modal */}
      {isModalOpen && selectedProduct && (
        <ProductModal 
          product={selectedProduct}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
