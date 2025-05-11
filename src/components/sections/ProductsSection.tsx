'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { handleImageError as handleImageErrorUtil } from '@/utils/imageUtils';
import ColorsSection from './ColorsSection';

interface Product {
  id: string;
  name: string;
  slug: string;
  thumbnail: string;
  description: string;
  path: string;
}

const ProductsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const productRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        
        if (!response.ok) {
          throw new Error(`Error fetching products: ${response.status}`);
        }
        
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load product categories. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );

    productRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      productRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [products]);

  return (
    <section className="section bg-primary-50">
      <div className="container">
        <div className="text-center mb-16">
          <h3 className="font-serif text-sm tracking-widest uppercase text-accent-700 mb-2">
            Our Collection
          </h3>
          <div className="luxury-divider mx-auto w-24 mb-6"></div>
          <h2 className="section-title">Premium Granite Categories</h2>
          <p className="section-subtitle mx-auto">
            Discover our wide range of premium granite categories, each offering unique beauty and quality for your special monuments.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="rounded-full bg-primary-200 h-12 w-12 mb-4"></div>
              <div className="text-primary-400">Loading categories...</div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <div className="text-accent-700 mb-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-12 w-12 mx-auto" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <p className="text-accent-600">{error}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {products.map((product, index) => (
                <div
                  key={product.id || index}
                  ref={el => { productRefs.current[index] = el; }}
                  className="group relative overflow-hidden rounded-lg shadow-luxury transition-all duration-300 hover:scale-105"
                >
                  <Link href={product.path}>
                    <div className="relative h-64 w-full">
                      <Image
                        src={product.thumbnail || '/images/placeholder.jpg'}
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
                    <div className="p-6 bg-white">
                      <h3 className="text-lg font-semibold group-hover:text-accent-700 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 mt-2 line-clamp-2">
                        {product.description}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            <div className="mt-16">
              <ColorsSection />
            </div>
          </>
        )}
      </div>
      <div className="mt-16">
        <ColorsSection />
      </div>
    </section>
  );
};

export default ProductsSection;
