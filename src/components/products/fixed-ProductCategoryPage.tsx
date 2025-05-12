'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { handleImageError as handleImageErrorUtil } from '@/utils/imageUtils';

interface ProductImage {
  name: string;
  path: string;
}

interface ProductCategory {
  name: string;
  path: string;
  thumbnail: string;
  count: number;
}

// Extended type for search results that includes category
type SearchResult = ProductImage & { category?: string };

interface ProductCategoryPageProps {
  initialCategory?: string;
  onProductClick?: (product: ProductImage) => void;
  onBackToCategories?: () => void;
}

export default function ProductCategoryPage({ 
  initialCategory = 'Monuments', 
  onProductClick,
  onBackToCategories
}: ProductCategoryPageProps) {
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [products, setProducts] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(true); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFloatingNavVisible, setIsFloatingNavVisible] = useState(false); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [selectingCategory, setSelectingCategory] = useState(false); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [showFloatingSearch, setShowFloatingSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  // router is not currently used
  const pageRef = useRef<HTMLDivElement>(null);
  const categoryMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch all categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products when active category changes
  useEffect(() => {
    const fetchProducts = async () => {
      if (!activeCategory) return;
      
      setLoadingProducts(true);
      setError(null);
      
      try {
        console.log(`Fetching products for category: ${activeCategory}`);
        const response = await fetch(`/api/products/${activeCategory}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch products for ${activeCategory}`);
        }
        
        const data = await response.json();
        console.log('Products data:', data);
        
        if (data.images) {
          setProducts(data.images);
        } else {
          setProducts([]);
        }
        
        setLoadingProducts(false);
      } catch (err) {
        console.error(`Error fetching products for ${activeCategory}:`, err);
        setError(`Failed to load products for ${activeCategory}. Please try again later.`);
        setLoadingProducts(false);
      }
    };
    
    fetchProducts();
  }, [activeCategory]);

  // Add throttling to scroll event listener
  useEffect(() => {
    let lastScrollY = 0;
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Only update state if there's a meaningful change in scroll position
          if (Math.abs(currentScrollY - lastScrollY) > 20) {
            setIsFloatingNavVisible(currentScrollY > 300);
            lastScrollY = currentScrollY;
          }
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside to close category menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target as Node)) {
        setSelectingCategory(false);
      }
      if (searchResultsRef.current && !searchResultsRef.current.contains(event.target as Node)) {
        setShowFloatingSearch(false);
        setSearchResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when search is shown
  useEffect(() => {
    if (showFloatingSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showFloatingSearch]);

  // Memoize the search handler
  const handleSearch = useCallback(async (query: string) => {
    if (!query || query.trim().length < 2) return;
    
    setIsSearching(true);
    setSearchResults([]);
    
    try {
      console.log(`Searching for: ${query.trim()}`);
      const response = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
      
      if (!response.ok) {
        throw new Error(`Search request failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Search results:', data);
      
      if (data && Array.isArray(data.results)) {
        setSearchResults(data.results);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Handle search when query changes
  useEffect(() => {
    // Clear previous timeout if it exists
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Don't search if query is too short
    if (!searchQuery || searchQuery.length < 2) {
      return;
    }

    // Set a timeout to debounce the search (wait 300ms after typing stops)
    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    // Cleanup on unmount
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, handleSearch]);

  // Memoize the product click handler
  const handleProductClick = useCallback((product: ProductImage) => {
    if (onProductClick) {
      onProductClick(product);
    }
  }, [onProductClick]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCategorySelect = useCallback((category: ProductCategory) => {
    setActiveCategory(category.name);
    setSelectingCategory(false);
  }, []);

  // Handle search result click
  const handleSearchResultClick = useCallback((product: SearchResult) => {
    setShowFloatingSearch(false);
    setSearchResults([]);
    setSearchQuery('');
    if (onProductClick) {
      onProductClick(product);
    }
  }, [onProductClick]);

  // Get category-specific count
  const currentCount = useMemo(() => {
    const currentCategory = categories.find(cat => cat.name === activeCategory);
    return currentCategory?.count || 0;
  }, [categories, activeCategory]);

  // Handle go back to main products page
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleBackToCategories = useCallback(() => {
    if (onBackToCategories) {
      onBackToCategories();
    }
  }, [onBackToCategories]);
  
  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  return (
    <div className="product-category-page" ref={pageRef}>
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Category Header */}
        <div className="mb-12">
          <h2 className="section-title mb-2">{activeCategory} Collection</h2>
          {!loadingProducts && !error && (
            <p className="text-primary-600 mb-6">
              Explore our {activeCategory} collection featuring {currentCount} unique designs, perfect for honoring your loved ones.
            </p>
          )}
        </div>
        
        {/* Loading State */}
        {loadingProducts && (
          <div className="flex justify-center items-center h-60">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border-t-4 border-accent-600 border-solid rounded-full animate-spin"></div>
              <p className="mt-4 text-primary-600">Loading {activeCategory}...</p>
            </div>
          </div>
        )}
        
        {/* Error State */}
        {error && !loadingProducts && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-6 rounded-lg text-center mb-8">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-12 w-12 mx-auto text-red-500 mb-4" 
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
            <h3 className="text-lg font-medium mb-2">Unable to Load Products</h3>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-100 hover:bg-red-200 text-red-800 font-medium py-2 px-4 rounded transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
        
        {/* Products Grid */}
        {!loadingProducts && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {products.length > 0 ? (
                products.map((product) => (
                  <div 
                    key={product.name} 
                    className="product-card group cursor-pointer transition-all duration-300 h-full flex flex-col"
                    onClick={() => handleProductClick(product)}
                  >
                    <div className="relative h-64 bg-white overflow-hidden">
                      <Image
                        src={product.path}
                        alt={product.name.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '')}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => handleImageErrorUtil(e, product.path)}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                    </div>
                    <div className="bg-white p-4 border border-t-0 border-gray-100 flex-grow">
                      <h3 className="product-title text-primary-900">
                        {product.name.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '').replace(/-/g, ' ')}
                      </h3>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-primary-600">
                          {activeCategory}
                        </span>
                        <button 
                          className="text-accent-700 text-sm font-medium hover:text-accent-800 hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProductClick(product);
                          }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-16 w-16 mx-auto text-gray-300 mb-4" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" 
                    />
                  </svg>
                  <h3 className="text-xl font-medium text-gray-600 mb-2">No Products Found</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    We couldn&apos;t find any products in the {activeCategory} category. Please try another category or check back later.
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Search Results */}
        {showFloatingSearch && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 flex items-start justify-center pt-20 px-4"
            onClick={() => setShowFloatingSearch(false)}
          >
            <div 
              ref={searchResultsRef}
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[70vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b">
                <form onSubmit={handleSearchSubmit} className="flex">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search all products..."
                    className="flex-grow p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-accent-500"
                  />
                  <button 
                    type="submit"
                    className="bg-accent-700 text-white px-4 rounded-r hover:bg-accent-800"
                  >
                    Search
                  </button>
                </form>
              </div>
              
              {searchResults.length > 0 ? (
                <div className="divide-y">
                  {searchResults.map((result) => (
                    <div 
                      key={`${result.category}-${result.name}`}
                      className="p-4 hover:bg-gray-50 cursor-pointer flex items-center"
                      onClick={() => handleSearchResultClick(result)}
                    >
                      <div className="w-16 h-16 bg-gray-100 relative flex-shrink-0 mr-4 overflow-hidden rounded">
                        <Image
                          src={result.path}
                          alt={result.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                          onError={(e) => handleImageErrorUtil(e, result.path)}
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-primary-900">
                          {result.name.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '').replace(/-/g, ' ')}
                        </h4>
                        {result.category && (
                          <span className="text-sm text-primary-600">
                            {result.category}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchQuery.length > 1 && !isSearching ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No products found matching &quot;{searchQuery}&quot;</p>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Enter a search term to find products</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
