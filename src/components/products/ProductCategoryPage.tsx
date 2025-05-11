'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { handleImageError as handleImageErrorUtil } from '@/utils/imageUtils';
import SearchBar from '@/components/search/SearchBar';

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
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFloatingNavVisible, setIsFloatingNavVisible] = useState(false);
  const [selectingCategory, setSelectingCategory] = useState(false);
  const [showFloatingSearch, setShowFloatingSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
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
  }, [searchQuery]);

  // Memoize the product click handler
  const handleProductClick = useCallback((product: ProductImage) => {
    if (onProductClick) {
      onProductClick(product);
    }
  }, [onProductClick]);

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
      
      if (data.results && Array.isArray(data.results)) {
        setSearchResults(data.results);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Memoize category change handler
  const handleCategoryChange = useCallback((categoryName: string) => {
    setActiveCategory(categoryName);
    setSelectingCategory(false);
  }, []);

  // Memoize the search result click handler
  const handleSearchResultClick = useCallback((product: any) => {
    if (onProductClick) {
      onProductClick(product);
    }
    setShowFloatingSearch(false);
    setSearchResults([]);
    setSearchQuery('');
  }, [onProductClick]);

  // Memoize value calculations that depend on current state
  const currentCategoryIndex = useMemo(() => 
    categories.findIndex(cat => cat.name === activeCategory),
  [categories, activeCategory]);
  
  const hasPrevCategory = useMemo(() => currentCategoryIndex > 0, [currentCategoryIndex]);
  const hasNextCategory = useMemo(() => 
    currentCategoryIndex < categories.length - 1 && currentCategoryIndex !== -1,
  [currentCategoryIndex, categories.length]);

  // Memoize navigation handlers
  const goToPrevCategory = useCallback(() => {
    if (hasPrevCategory) {
      handleCategoryChange(categories[currentCategoryIndex - 1].name);
    }
  }, [hasPrevCategory, handleCategoryChange, categories, currentCategoryIndex]);

  const goToNextCategory = useCallback(() => {
    if (hasNextCategory) {
      handleCategoryChange(categories[currentCategoryIndex + 1].name);
    }
  }, [hasNextCategory, handleCategoryChange, categories, currentCategoryIndex]);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  return (
    <div className="product-category-page" ref={pageRef}>
      {/* Top navigation */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBackToCategories}
          className="flex items-center text-primary hover:underline transition-colors"
        >
          <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Categories
        </button>
        
        <h2 className="text-2xl md:text-3xl font-playfair">{activeCategory}</h2>
        
        <div className="flex space-x-2">
          {hasPrevCategory && (
            <button
              onClick={goToPrevCategory}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Previous category"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          
          {hasNextCategory && (
            <button
              onClick={goToNextCategory}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Next category"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {/* Horizontal category tabs */}
      <div className="overflow-x-auto pb-4 mb-8">
        <div className="flex space-x-2">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => handleCategoryChange(category.name)}
              className={`px-4 py-2 rounded-md whitespace-nowrap transition-colors ${
                activeCategory === category.name 
                  ? "bg-primary text-white" 
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Products Display */}
      <div>
        {loadingProducts ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-8 bg-red-50 rounded-lg">
            <p>{error}</p>
            <button 
              onClick={() => setLoadingProducts(true)}
              className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors"
            >
              Retry
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-500 p-8 bg-gray-50 rounded-lg">
            <p>No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product, index) => (
              <div 
                key={index}
                className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => handleProductClick(product)}
              >
                <div className="relative h-64 w-full overflow-hidden bg-gray-100">
                  <Image
                    src={product.path}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    onError={(e) => handleImageErrorUtil(e, product.path)}
                  />
                </div>
                <div className="p-4 bg-white">
                  <h3 className="text-sm font-medium truncate">{product.name}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">{activeCategory}</span>
                    <span className="text-primary group-hover:translate-x-1 transition-transform duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Simple floating navigation bar - appears when scrolling down */}
      {isFloatingNavVisible && (
        <div className="fixed bottom-4 left-0 right-0 px-4 z-50">
          <div className="bg-white rounded-full shadow-xl p-2 mx-auto max-w-md flex items-center justify-between">
            {/* Back to categories */}
            <button
              onClick={onBackToCategories}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
              aria-label="Back to categories"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </button>
            
            {/* Category selector button */}
            <div className="relative" ref={categoryMenuRef}>
              <button
                onClick={() => setSelectingCategory(!selectingCategory)}
                className="px-4 py-2 bg-primary text-white rounded-full flex items-center"
              >
                <span className="truncate max-w-[120px] mr-1">{activeCategory}</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Category list */}
              {selectingCategory && (
                <div className="absolute bottom-full mb-2 left-0 right-0 bg-white rounded-lg shadow-xl max-h-60 overflow-y-auto">
                  <div className="p-1">
                    {categories.map((category) => (
                      <button
                        key={category.name}
                        onClick={() => handleCategoryChange(category.name)}
                        className={`w-full text-left px-3 py-2 rounded ${
                          activeCategory === category.name 
                            ? 'bg-primary text-white' 
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Search button - leads to floating search panel */}
            <div className="relative" ref={searchResultsRef}>
              <button
                onClick={() => setShowFloatingSearch(!showFloatingSearch)}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                aria-label="Search products"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
            
            {/* Prev/Next buttons */}
            <div className="flex space-x-1">
              <button
                onClick={goToPrevCategory}
                disabled={!hasPrevCategory}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  hasPrevCategory ? 'bg-gray-100 hover:bg-gray-200' : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
                aria-label="Previous category"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={goToNextCategory}
                disabled={!hasNextCategory}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  hasNextCategory ? 'bg-gray-100 hover:bg-gray-200' : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
                aria-label="Next category"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            {/* Scroll to top button - with label for clarity */}
            <button
              onClick={(e) => {
                e.preventDefault(); // Prevent default behavior
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 transition-colors rounded-full px-3 py-2"
              aria-label="Scroll to top"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span className="text-sm">Top</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Simple floating search panel */}
      {showFloatingSearch && (
        <div className="fixed inset-x-0 bottom-0 z-[60]">
          <div className="bg-white rounded-t-lg shadow-xl mx-auto w-full max-w-lg">
            <div className="p-4 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-800">Search Products</h3>
                <button 
                  onClick={() => {
                    setShowFloatingSearch(false);
                    setSearchResults([]);
                    setSearchQuery('');
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSearchSubmit} className="mt-3 flex">
                <input
                  ref={searchInputRef}
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-l-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button 
                  type="submit"
                  className="bg-primary text-white px-4 rounded-r-md hover:bg-primary-dark"
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                </button>
              </form>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {isSearching ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : searchResults.length > 0 ? (
                <div>
                  <div className="p-3 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Found {searchResults.length} results</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4">
                    {searchResults.map((product, index) => (
                      <div 
                        key={index}
                        onClick={() => handleSearchResultClick(product)}
                        className="group relative overflow-hidden rounded shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer bg-white"
                      >
                        <div className="relative h-28 w-full overflow-hidden bg-gray-100">
                          <Image
                            src={product.path}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            onError={(e) => handleImageErrorUtil(e, product.path)}
                          />
                        </div>
                        <div className="p-2">
                          <p className="font-medium text-xs truncate">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : searchQuery.length > 1 && !isSearching ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No products found matching "{searchQuery}"</p>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Enter a search term to find products</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
