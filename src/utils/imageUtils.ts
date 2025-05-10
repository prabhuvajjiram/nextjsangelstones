/**
 * Utility functions for handling images in the Angel Granites site
 * These functions help implement the "thumbnails-first" approach and handle image loading errors
 */

/**
 * Image optimization and handling utilities for better performance
 */

/**
 * Handle image errors by showing a fallback
 * - Supports both React event style and direct element style for backward compatibility
 */
import { SyntheticEvent } from 'react';

/**
 * Handle image errors by showing a fallback
 * @param e - The event object
 */
export const handleImageError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
  const img = e.currentTarget;
  img.src = '/images/placeholder.jpg';
  img.onerror = null;
};

/**
 * Get the image path with /images/ prefix if not already present
 * @param path - The image path
 * @returns The image path with /images/ prefix
 */
export const getImagePath = (path: string): string => {
  // Ensure path starts with /images/
  if (!path.startsWith('/images/')) {
    return `/images/${path}`;
  }
  return path;
};

/**
 * Validate if an image path is valid
 * @param path - The image path to validate
 * @returns True if the image path is valid, false otherwise
 */
export const isImageValid = (path: string): boolean => {
  // Basic validation for image paths
  if (!path) return false;
  const validExtensions = ['jpg', 'jpeg', 'png', 'webp', 'avif']; // Support all common image formats
  const extension = path.split('.').pop()?.toLowerCase();
  return validExtensions.includes(extension || '');
};

/**
 * Generates optimized image parameters for Next.js Image component
 * @param src - The image source URL
 * @param width - Desired width (optional)
 * @param height - Desired height (optional)
 * @param quality - Image quality percentage (1-100)
 * @returns Object with optimized image parameters
 */
export const getOptimizedImageProps = (
  src: string,
  width?: number,
  height?: number,
  quality = 80
) => {
  // Handle different image types more efficiently
  const isImportant = src.includes('featured') || src.includes('hero');
  
  return {
    src,
    width: width || undefined,
    height: height || undefined,
    quality: isImportant ? 85 : quality,
    loading: isImportant ? 'eager' : 'lazy',
    sizes: `(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw`,
    placeholder: 'blur',
    blurDataURL: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlZWVlZWUiLz48L3N2Zz4=',
  };
};

/**
 * Get responsive image sizes attribute
 * Supports both old and new parameter types for backward compatibility
 */
export const getResponsiveSizes = (
  type: 'product' | 'hero' | 'gallery' | 'featured' | 'thumbnail' | 'small' | 'medium' | 'large' = 'medium'
): string => {
  // Map for new style
  const sizes = {
    small: '(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw',
    medium: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    large: '(max-width: 768px) 100vw, 50vw',
  };
  
  // Map for old style
  const typeSizes = {
    product: '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw',
    hero: '100vw',
    gallery: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    featured: '(max-width: 768px) 100vw, 50vw',
    thumbnail: '(max-width: 640px) 25vw, 10vw',
  };
  
  // Check if it's a new style or old style parameter
  if (type in sizes) {
    return sizes[type as 'small' | 'medium' | 'large'];
  } else {
    return typeSizes[type as 'product' | 'hero' | 'gallery' | 'featured' | 'thumbnail'] || 
           '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'; // Default to medium
  }
};

/**
 * Check if an image should be prioritized for loading
 * Based on viewport visibility or content importance
 * @param imageSrc - Image source URL
 * @param imageType - Context of the image usage
 * @returns True if the image should be prioritized
 */
export const shouldPrioritizeImage = (
  imageSrc: string,
  imageType: 'product' | 'hero' | 'gallery' | 'featured' | 'thumbnail'
): boolean => {
  // Prioritize hero images, featured products and visible above-the-fold content
  if (imageType === 'hero' || imageType === 'featured') {
    return true;
  }
  
  // Prioritize important products (could be extended with more business logic)
  if (imageType === 'product' && imageSrc.includes('featured')) {
    return true;
  }
  
  return false;
};

/**
 * Generates a thumbnail URL for a product image
 * Implements cache busting except for MBNA_2025 category
 */
export const getThumbnailUrl = (category: string, filename: string): string => {
  const isMBNA = category === 'MBNA_2025';
  return `/api/image?path=${encodeURIComponent(`${category}/${filename}`)}&size=thumbnail${
    isMBNA ? '' : `&timestamp=${Date.now()}`
  }`;
};

/**
 * Generates a full-size image URL for a product image
 * Implements cache busting except for MBNA_2025 category
 */
export const getFullImageUrl = (category: string, filename: string): string => {
  const isMBNA = category === 'MBNA_2025';
  return `/api/image?path=${encodeURIComponent(`${category}/${filename}`)}${
    isMBNA ? '' : `&timestamp=${Date.now()}`
  }`;
};

/**
 * Creates a product object from a filename and category
 * Used for consistent product representation across the site
 */
export const createProductFromFile = (filename: string, category: string, index: number): any => {
  return {
    id: `${category.toLowerCase()}-${index}`,
    name: formatProductName(filename),
    thumbnail: getThumbnailUrl(category, filename),
    fullImage: getFullImageUrl(category, filename),
    category: formatCategoryName(category)
  };
};

/**
 * Formats a filename into a readable product name
 */
const formatProductName = (filename: string): string => {
  // Remove extension and replace hyphens/underscores with spaces
  const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.'));
  const nameWithSpaces = nameWithoutExt.replace(/[-_]/g, ' ');
  
  // Capitalize first letter of each word
  return nameWithSpaces
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Format a category name for display
 * Converts camelCase or snake_case to Title Case with spaces
 */
export function formatCategoryName(category: string): string {
  // Handle special case for MBNA_2025
  if (category === 'MBNA_2025') return 'MBNA 2025';
  
  // Replace underscores and hyphens with spaces
  let formatted = category.replace(/[_-]/g, ' ');
  
  // Convert to title case (capitalize first letter of each word)
  formatted = formatted
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  
  return formatted;
}
