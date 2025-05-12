'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { handleImageError as handleImageErrorUtil } from '@/utils/imageUtils';

interface Product {
  name: string;
  path: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { category, productId } = params;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // State for active image index removed as it's not currently used
  
  // Refs for animation
  const imageRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const specsRef = useRef<HTMLDivElement>(null);
  const relatedRef = useRef<HTMLDivElement>(null);

  // Decode the product ID from the URL
  const decodedProductId = decodeURIComponent(productId as string);
  
  useEffect(() => {
    // Add intersection observer for animations
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

    // Store ref values that won't change during cleanup
    const imageElement = imageRef.current;
    const detailsElement = detailsRef.current;
    const specsElement = specsRef.current;
    const relatedElement = relatedRef.current;

    // Observe all refs
    if (imageElement) observer.observe(imageElement);
    if (detailsElement) observer.observe(detailsElement);
    if (specsElement) observer.observe(specsElement);
    if (relatedElement) observer.observe(relatedElement);

    return () => {
      // Cleanup observer using stored elements
      if (imageElement) observer.unobserve(imageElement);
      if (detailsElement) observer.unobserve(detailsElement);
      if (specsElement) observer.unobserve(specsElement);
      if (relatedElement) observer.unobserve(relatedElement);
    };
  }, []);

  // Fetch the product data and related products
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        
        // Fetch all products in this category
        const response = await fetch(`/api/products/${category}`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        
        // Find the specific product by name
        const foundProduct = data.images?.find((img: Product) => 
          img.name === decodedProductId
        );
        
        if (!foundProduct) {
          setError('Product not found');
          setLoading(false);
          return;
        }
        
        setProduct(foundProduct);
        
        // Set related products (excluding the current one)
        const related = data.images
          .filter((img: Product) => img.name !== decodedProductId)
          .slice(0, 4); // Limit to 4 related products
        
        setRelatedProducts(related);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details');
        setLoading(false);
      }
    };
    
    if (category && productId) {
      fetchProductData();
    }
  }, [category, productId, decodedProductId]);

  // Handle image loading error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    handleImageErrorUtil(e, product?.path);
    setError('Failed to load image');
  };

  // Handle go back
  const handleGoBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto py-32 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 border-t-4 border-accent-600 border-solid rounded-full animate-spin"></div>
            <p className="text-primary-700 font-medium">Loading product details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto py-32 px-4">
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-8 max-w-2xl mx-auto text-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 text-primary-400 mx-auto mb-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
            <h2 className="text-2xl font-serif mb-4 text-primary-900">Product Not Found</h2>
            <p className="text-primary-700 mb-6">
              {error || "We couldn't find the product you're looking for."}
            </p>
            <button 
              onClick={handleGoBack}
              className="btn btn-primary"
            >
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 mb-8">
          <div className="flex items-center text-sm text-primary-500">
            <Link href="/" className="hover:text-accent-700 transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:text-accent-700 transition-colors">
              Products
            </Link>
            <span className="mx-2">/</span>
            <Link 
              href={`/products/${category}`} 
              className="hover:text-accent-700 transition-colors"
            >
              {typeof category === 'string' ? category.replace(/_/g, ' ') : category}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-primary-700 font-medium">
              {product.name.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '')}
            </span>
          </div>
        </div>
        
        <div className="container mx-auto px-4">
          {/* Product details section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
            {/* Product image */}
            <div ref={imageRef} className="reveal">
              <div className="bg-white shadow-luxury">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={product.path}
                    alt={product.name.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '')}
                    fill
                    priority
                    className="object-cover hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    onError={handleImageError}
                  />
                </div>
              </div>
            </div>
            
            {/* Product details */}
            <div ref={detailsRef} className="reveal">
              <h3 className="font-serif text-sm tracking-widest uppercase text-accent-700 mb-2">
                Premium Stone Collection
              </h3>
              <div className="luxury-divider w-16 mb-6"></div>
              
              <h1 className="text-3xl md:text-4xl font-serif text-primary-900 mb-6">
                {product.name.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '')}
              </h1>
              
              <p className="text-primary-700 leading-relaxed mb-8">
                This exquisite {typeof category === 'string' ? category.replace(/_/g, ' ').toLowerCase() : ''} monument exemplifies the timeless elegance and superior craftsmanship that defines our collection. Each piece is meticulously crafted from the finest natural stone, selected for its exceptional quality and distinctive character.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider text-primary-400 mb-1">Origin</span>
                  <span className="text-primary-900">Premium Quality</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider text-primary-400 mb-1">Category</span>
                  <span className="text-primary-900">{typeof category === 'string' ? category.replace(/_/g, ' ') : category}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider text-primary-400 mb-1">Finish</span>
                  <span className="text-primary-900">Polished</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider text-primary-400 mb-1">Availability</span>
                  <span className="text-accent-700">In Stock</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <a 
                  href={`mailto:info@angelgranites.com?subject=Inquiry about ${product.name.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '')}`} 
                  className="btn btn-primary"
                >
                  Request Quote
                </a>
                <button 
                  onClick={handleGoBack}
                  className="btn btn-outline"
                >
                  View More Options
                </button>
              </div>
              
              <div className="border-t border-primary-100 pt-6">
                <h4 className="font-medium text-primary-900 mb-3">Product Features</h4>
                <ul className="list-disc list-inside space-y-2 text-primary-700">
                  <li>Premium quality natural stone</li>
                  <li>Elegant design and exceptional craftsmanship</li>
                  <li>Durable and weather-resistant</li>
                  <li>Customizable inscriptions and designs</li>
                  <li>Professional installation available</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Specifications section */}
          <div ref={specsRef} className="bg-primary-50 p-8 md:p-12 mb-16 reveal">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-serif text-primary-900 mb-8 text-center">
                Product Specifications
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium text-primary-900 mb-4 flex items-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 text-accent-700 mr-2" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
                      />
                    </svg>
                    Material & Durability
                  </h4>
                  <p className="text-primary-700 leading-relaxed">
                    Our monuments are crafted from high-grade granite, known for its exceptional durability and resistance to weather elements. This natural stone maintains its beauty for generations, making it the preferred choice for lasting memorials.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-primary-900 mb-4 flex items-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 text-accent-700 mr-2" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" 
                      />
                    </svg>
                    Customization Options
                  </h4>
                  <p className="text-primary-700 leading-relaxed">
                    Each monument can be personalized with custom engravings, designs, and finishes. We offer a variety of lettering styles, ornamental embellishments, and portrait options to create a truly unique memorial that honors your loved one.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-primary-900 mb-4 flex items-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 text-accent-700 mr-2" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" 
                      />
                    </svg>
                    Pricing & Value
                  </h4>
                  <p className="text-primary-700 leading-relaxed">
                    We offer competitive pricing without compromising on quality. The cost varies based on size, design complexity, and customization options. Contact us for a detailed quote tailored to your specific requirements.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-primary-900 mb-4 flex items-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 text-accent-700 mr-2" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                      />
                    </svg>
                    Production & Delivery
                  </h4>
                  <p className="text-primary-700 leading-relaxed">
                    Production time typically ranges from 4-8 weeks, depending on design complexity and customization requirements. We coordinate delivery and professional installation to ensure your memorial is perfectly placed and secured.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Related products section */}
          {relatedProducts.length > 0 && (
            <div ref={relatedRef} className="reveal">
              <h3 className="text-2xl font-serif text-primary-900 mb-8 text-center">
                You May Also Like
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((related, index) => (
                  <Link 
                    href={`/products/${category}/${encodeURIComponent(related.name)}`}
                    key={index} 
                    className="group"
                  >
                    <div className="bg-white shadow-luxury overflow-hidden">
                      <div className="relative aspect-square">
                        <Image
                          src={related.path}
                          alt={related.name.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '')}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="text-primary-900 font-medium truncate group-hover:text-accent-700 transition-colors">
                          {related.name.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '')}
                        </h4>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
