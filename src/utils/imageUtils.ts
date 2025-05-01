/**
 * Utility functions for handling images in the Angel Granites site
 * These functions help implement the "thumbnails-first" approach and handle image loading errors
 */

/**
 * Handles image loading errors by trying alternative paths and formats
 * @param img The image element that failed to load
 * @param originalSrc The original source URL that failed
 */
export const handleImageError = (img: HTMLImageElement, originalSrc: string): void => {
  console.log(`Image failed to load: ${originalSrc}`);
  
  // If the image already has a fallback src, don't try again to avoid infinite loops
  if (img.dataset.fallbackAttempted === 'true') {
    // Set a placeholder image as last resort
    img.src = '/images/placeholder.jpg';
    return;
  }
  
  // Mark this image as having attempted a fallback
  img.dataset.fallbackAttempted = 'true';
  
  // Try different strategies to find the image
  
  // 1. Try with a timestamp to bypass cache
  if (!originalSrc.includes('timestamp')) {
    const timestamp = Date.now();
    const separator = originalSrc.includes('?') ? '&' : '?';
    img.src = `${originalSrc}${separator}timestamp=${timestamp}`;
    return;
  }
  
  // 2. Try the API endpoint if it's a direct image path
  if (originalSrc.startsWith('/images/') && !originalSrc.includes('/api/image')) {
    const imagePath = originalSrc.replace('/images/', '');
    img.src = `/api/image?path=${encodeURIComponent(imagePath)}`;
    return;
  }
  
  // 3. Try alternative file extensions
  const extensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  const currentExt = originalSrc.substring(originalSrc.lastIndexOf('.'));
  
  if (extensions.includes(currentExt.toLowerCase())) {
    // Get base path without extension
    const basePath = originalSrc.substring(0, originalSrc.lastIndexOf('.'));
    
    // Try each alternative extension
    for (const ext of extensions) {
      if (ext.toLowerCase() !== currentExt.toLowerCase()) {
        img.src = `${basePath}${ext}`;
        return;
      }
    }
  }
  
  // 4. Last resort - use a placeholder
  img.src = '/images/placeholder.jpg';
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
