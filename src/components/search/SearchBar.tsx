'use client';

import { useState, useRef, useEffect, memo, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface SearchBarProps {
  onClose?: () => void;
  isExpandable?: boolean;
  className?: string;
  compact?: boolean;
}

export default memo(function SearchBar({ 
  onClose, 
  isExpandable = true, 
  className = '',
  compact = false 
}: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(!isExpandable || false);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setResults([]);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Auto search when query changes (debounced)
  useEffect(() => {
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Don't search if query is too short
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    // Debounce search (wait 300ms after typing stops)
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(query);
    }, 300);

    // Cleanup
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query]);

  // Memoize handlers to reduce function recreation
  const toggleSearch = useCallback(() => {
    if (isExpandable) {
      setIsOpen(prevState => !prevState);
      if (!isOpen) {
        setQuery('');
        setResults([]);
      }
    }
  }, [isExpandable, isOpen]);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.trim().length < 2) return;
    
    setIsLoading(true);
    setResults([]);
    
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery.trim())}`);
      
      if (!response.ok) {
        throw new Error(`Search request failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.results && Array.isArray(data.results)) {
        setResults(data.results);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  }, [performSearch, query]);

  const handleProductClick = useCallback((product: any) => {
    // Navigate to product or show in modal
    console.log('View product:', product);
    setIsOpen(false);
    setResults([]);
    
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  // Use useMemo for complex JSX sections
  const searchInput = useMemo(() => (
    <div className={`${isExpandable && !isOpen ? 'hidden' : 'block'} relative`}>
      <form onSubmit={handleSearch} className="flex items-center">
        <input
          ref={inputRef}
          type="search"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`${compact ? 'bg-white border-gray-300 text-gray-800 w-36 sm:w-44' : 'bg-gray-800 text-white border-gray-700 w-60'} border rounded-l py-2 px-4 focus:outline-none focus:ring-1 focus:ring-primary`}
        />
        <button 
          type="submit"
          className="bg-primary text-white py-2 px-4 rounded-r hover:bg-primary-dark transition-colors"
          disabled={isLoading}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </button>
        
        {isExpandable && (
          <button 
            type="button"
            onClick={toggleSearch}
            className={`ml-2 w-8 h-8 flex items-center justify-center ${compact ? 'text-gray-700' : 'text-white'} hover:text-primary`}
            aria-label="Close search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </form>
      
      {/* Search results */}
      {results.length > 0 && (
        <div className={`absolute top-full left-0 right-0 mt-2 ${compact ? 'bg-white border-gray-300 text-gray-800' : 'bg-gray-800 border-gray-700 text-white'} border rounded shadow-lg z-50 max-h-96 overflow-y-auto`}>
          <div className="p-4">
            <h3 className={`${compact ? 'text-gray-800' : 'text-white'} text-sm font-semibold mb-2`}>Found {results.length} results for "{query}"</h3>
            <div className="space-y-3">
              {results.map((product, index) => (
                <div 
                  key={index}
                  onClick={() => handleProductClick(product)}
                  className={`flex items-center p-2 rounded cursor-pointer ${compact ? 'hover:bg-gray-100' : 'hover:bg-gray-700'}`}
                >
                  <div className="relative w-12 h-12 mr-3 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={product.path}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                      onError={(e) => {
                        // Simple fallback for missing images
                        (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{product.name}</p>
                    <p className={`text-xs ${compact ? 'text-gray-600' : 'text-gray-400'}`}>{product.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  ), [compact, handleProductClick, handleSearch, isExpandable, isLoading, isOpen, query, results, toggleSearch]);

  return (
    <div 
      ref={searchRef}
      className={`relative ${className}`}
    >
      {/* Search icon (visible when collapsed) */}
      {isExpandable && (
        <button 
          onClick={toggleSearch}
          className={`${compact ? 'w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200' : 'w-10 h-10'} flex items-center justify-center ${compact ? 'text-gray-700' : 'text-white'} hover:text-primary transition-colors ${isOpen ? 'hidden' : 'block'}`}
          aria-label="Open search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      )}
      
      {/* Search input (visible when expanded) */}
      {searchInput}
    </div>
  );
}); // Close memo
