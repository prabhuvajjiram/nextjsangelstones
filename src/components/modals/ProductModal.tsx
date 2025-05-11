import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { handleImageError as handleImageErrorUtil } from '@/utils/imageUtils';

interface ProductImage {
  name: string;
  path: string;
}

interface ProductModalProps {
  product: ProductImage;
  onClose: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

export default function ProductModal({ 
  product, 
  onClose, 
  onPrevious, 
  onNext,
  hasNext = false,
  hasPrevious = false
}: ProductModalProps) {
  // Add keyboard event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && hasPrevious && onPrevious) {
        onPrevious();
      } else if (e.key === 'ArrowRight' && hasNext && onNext) {
        onNext();
      }
    };

    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    
    // Lock body scroll
    document.body.style.overflow = 'hidden';
    
    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrevious, onNext, hasNext, hasPrevious]);

  // Handle modal click to avoid closing when clicking inside the modal content
  const handleModalClick = (e: React.MouseEvent) => {
    // Only close if directly clicking the overlay
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Format product name to be more readable
  const formattedName = product.name.replace(/\.[^/.]+$/, "").replace(/-/g, " ");

  return (
    <div 
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" 
      onClick={handleModalClick}
    >
      {/* New modal layout with navigation controls outside the main modal box */}
      <div className="flex items-center justify-center w-full max-w-7xl">
        {/* Previous button - now outside the modal for better visibility */}
        {hasPrevious && onPrevious && (
          <button 
            className="flex-shrink-0 bg-white rounded-full w-16 h-16 flex items-center justify-center mr-4 shadow-xl border-4 border-gray-200 hover:bg-gray-100 hover:border-primary transition-all z-50"
            onClick={(e) => {
              e.stopPropagation();
              onPrevious();
            }}
            aria-label="Previous product"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Main modal content */}
        <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col">
          {/* Close button - now more prominent */}
          <button 
            className="absolute top-3 right-3 z-50 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg text-red-600 hover:bg-red-600 hover:text-white transition-colors"
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Product image container */}
          <div className="p-6 flex-grow flex flex-col">
            <div className="relative h-[50vh] w-full mb-4 flex-grow">
              <Image
                src={product.path}
                alt={formattedName}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                onError={(e) => handleImageErrorUtil(e, product.path)}
                priority
                quality={85}
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOGY4Ii8+PC9zdmc+"
              />
            </div>
            
            <h2 className="text-2xl font-bold mb-2 text-center">
              {formattedName}
            </h2>
            
            <div className="mt-4 flex flex-wrap gap-3 justify-between">
              <button 
                className="bg-secondary text-white px-6 py-2 rounded hover:bg-secondary/90"
                onClick={onClose}
              >
                Close
              </button>
              <Link 
                href="/contact" 
                className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90"
              >
                Inquire About This Product
              </Link>
            </div>
          </div>
        </div>

        {/* Next button - now outside the modal for better visibility */}
        {hasNext && onNext && (
          <button 
            className="flex-shrink-0 bg-white rounded-full w-16 h-16 flex items-center justify-center ml-4 shadow-xl border-4 border-gray-200 hover:bg-gray-100 hover:border-primary transition-all z-50"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            aria-label="Next product"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Mobile navigation controls - for small screens */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center gap-8 md:hidden z-50">
        {hasPrevious && onPrevious && (
          <button 
            className="bg-white rounded-full w-14 h-14 flex items-center justify-center shadow-xl border-2 border-gray-300"
            onClick={(e) => {
              e.stopPropagation();
              onPrevious();
            }}
            aria-label="Previous product (mobile)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        
        {hasNext && onNext && (
          <button 
            className="bg-white rounded-full w-14 h-14 flex items-center justify-center shadow-xl border-2 border-gray-300"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            aria-label="Next product (mobile)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
