'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ProductCategory {
  name: string;
  path: string;
  thumbnail: string;
  count: number;
}

interface ProductCategoryNavigationProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  onCategorySelect?: (category: ProductCategory) => void;
  className?: string;
}

export default function ProductCategoryNavigation({
  activeCategory,
  setActiveCategory,
  onCategorySelect,
  className = ''
}: ProductCategoryNavigationProps) {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  // Router removed as it's not currently used

  // Get current category index
  const currentCategoryIndex = categories.findIndex(cat => cat.name === activeCategory);

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
        setError('Failed to load categories');
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

  const handleCategoryClick = (category: ProductCategory) => {
    setActiveCategory(category.name);
    if (onCategorySelect) {
      onCategorySelect(category);
    }
    setShowCategoryDropdown(false);
  };

  const navigateToPreviousCategory = () => {
    if (currentCategoryIndex > 0) {
      const prevCategory = categories[currentCategoryIndex - 1];
      handleCategoryClick(prevCategory);
    }
  };

  const navigateToNextCategory = () => {
    if (currentCategoryIndex < categories.length - 1) {
      const nextCategory = categories[currentCategoryIndex + 1];
      handleCategoryClick(nextCategory);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-4">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  if (error) {
    return <div className="text-red-500 p-2">{error}</div>;
  }

  return (
    <div className={`product-category-navigation ${className}`}>
      {/* Breadcrumb with dropdown for desktop */}
      <nav className="hidden md:flex items-center mb-6">
        <ol className="flex items-center text-sm">
          <li className="flex items-center">
            <Link href="/#our-product" className="text-primary hover:underline">
              Our Products
            </Link>
            <span className="mx-2">/</span>
          </li>
          <li>
            <div className="relative">
              <button 
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="flex items-center font-medium text-gray-800"
              >
                {activeCategory}
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown menu for quick category switching */}
              {showCategoryDropdown && (
                <div className="absolute z-10 mt-2 w-56 bg-white rounded-md shadow-lg">
                  <ul className="py-1">
                    {categories.map(category => (
                      <li key={category.name}>
                        <button
                          className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${activeCategory === category.name ? 'bg-gray-100 font-medium' : ''}`}
                          onClick={() => handleCategoryClick(category)}
                        >
                          {category.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </li>
        </ol>
        
        {/* Next/Previous Navigation */}
        <div className="ml-auto flex items-center space-x-2">
          <button 
            onClick={navigateToPreviousCategory}
            className={`p-2 rounded-full hover:bg-gray-100 ${currentCategoryIndex <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={currentCategoryIndex <= 0}
            aria-label="Previous category"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            onClick={navigateToNextCategory}
            className={`p-2 rounded-full hover:bg-gray-100 ${currentCategoryIndex >= categories.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={currentCategoryIndex >= categories.length - 1}
            aria-label="Next category"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </nav>
      
      {/* Horizontal scrollable tabs for mobile & tablet */}
      <div className="md:hidden mb-6">
        <div className="flex items-center mb-3">
          <Link href="/#our-product" className="flex items-center text-primary text-sm hover:underline">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            All Categories
          </Link>
        </div>
        
        <div className="category-tabs flex overflow-x-auto pb-2 -mx-2 px-2">
          {categories.map((category) => (
            <button
              key={category.name}
              className={`px-4 py-2 mx-1 whitespace-nowrap rounded-full flex-shrink-0 transition-colors ${
                activeCategory === category.name 
                  ? "bg-primary text-white" 
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Desktop sidebar (for larger screens in grid layout) - used in a different component */}
    </div>
  );
}
