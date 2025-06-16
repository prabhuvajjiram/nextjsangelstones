'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
  generateSrcSet, 
  generateResponsiveImageProps, 
  LAZY_LOADING_CONFIG,
  IMAGE_CONFIG,
  type ImageSize 
} from '@/lib/imageOptimization';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  className?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg';
  responsiveSizes?: ImageSize[];
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  sizes,
  className = '',
  objectFit = 'cover',
  quality = 80,
  format = 'webp',
  responsiveSizes = ['small', 'medium', 'large'],
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  onError,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      LAZY_LOADING_CONFIG
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  // Generate optimized src URL
  const getOptimizedSrc = (w?: number, h?: number, f = format) => {
    const params = new URLSearchParams();
    if (w) params.set('w', w.toString());
    if (h) params.set('h', h.toString());
    if (f !== 'jpeg') params.set('f', f);
    if (quality !== 80) params.set('q', quality.toString());

    const paramString = params.toString();
    return `/api/images/${src.replace(/^\//, '')}${paramString ? `?${paramString}` : ''}`;
  };

  // Generate srcSet for responsive images
  const srcSet = responsiveSizes && responsiveSizes.length > 0
    ? responsiveSizes
        .map(size => {
          const w = IMAGE_CONFIG.sizes[size];
          return `${getOptimizedSrc(w)} ${w}w`;
        })
        .join(', ')
    : undefined;

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Error fallback
  if (hasError) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-500 text-sm">Failed to load image</span>
      </div>
    );
  }

  // Placeholder while not in view
  if (!isInView && !priority) {
    return (
      <div 
        ref={imgRef}
        className={`bg-gray-100 ${className}`}
        style={{ width, height }}
      />
    );
  }

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      <Image
        src={getOptimizedSrc(width, height)}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
        className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ objectFit }}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onLoad={handleLoad}
        onError={handleError}
        {...(srcSet && { 
          srcSet,
          sizes: sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        })}
        {...props}
      />
      
      {/* Loading spinner */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
}

// Higher-order component for automatic optimization
export function withImageOptimization<P extends { src: string }>(
  Component: React.ComponentType<P>
) {
  return function OptimizedComponent(props: P) {
    const optimizedProps = {
      ...props,
      src: `/api/images/${props.src.replace(/^\//, '')}`,
    };

    return <Component {...optimizedProps} />;
  };
}

// Utility component for hero images with multiple formats
export function HeroImage({ 
  src, 
  alt, 
  className = '' 
}: { 
  src: string; 
  alt: string; 
  className?: string; 
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={1920}
      height={800}
      priority={true}
      format="avif"
      quality={85}
      responsiveSizes={['medium', 'large', 'xlarge']}
      className={className}
      objectFit="cover"
    />
  );
}

// Utility component for product thumbnails
export function ProductThumbnail({ 
  src, 
  alt, 
  className = '' 
}: { 
  src: string; 
  alt: string; 
  className?: string; 
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={300}
      height={300}
      format="webp"
      quality={80}
      responsiveSizes={['thumbnail', 'small', 'medium']}
      className={className}
      objectFit="cover"
    />
  );
}
