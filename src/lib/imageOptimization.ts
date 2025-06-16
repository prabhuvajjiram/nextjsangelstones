import sharp from 'sharp';
import { NextRequest } from 'next/server';

// Image optimization configuration
export const IMAGE_CONFIG = {
  formats: ['webp', 'avif', 'jpeg'] as const,
  quality: {
    webp: 80,
    avif: 75,
    jpeg: 85,
  },
  sizes: {
    thumbnail: 150,
    small: 300,
    medium: 600,
    large: 1200,
    xlarge: 1920,
  },
  // Cache settings
  maxAge: 60 * 60 * 24 * 30, // 30 days
  staleWhileRevalidate: 60 * 60 * 24 * 7, // 7 days
};

export type ImageFormat = typeof IMAGE_CONFIG.formats[number];
export type ImageSize = keyof typeof IMAGE_CONFIG.sizes;

interface OptimizeImageOptions {
  width?: number;
  height?: number;
  format?: ImageFormat;
  quality?: number;
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
}

export async function optimizeImage(
  buffer: Buffer,
  options: OptimizeImageOptions = {}
): Promise<Buffer> {
  const {
    width,
    height,
    format = 'webp',
    quality = IMAGE_CONFIG.quality[format],
    fit = 'cover',
  } = options;

  let pipeline = sharp(buffer);

  // Resize if dimensions provided
  if (width || height) {
    pipeline = pipeline.resize(width, height, { fit });
  }

  // Apply format and quality
  switch (format) {
    case 'webp':
      pipeline = pipeline.webp({ quality });
      break;
    case 'avif':
      pipeline = pipeline.avif({ quality });
      break;
    case 'jpeg':
      pipeline = pipeline.jpeg({ quality, progressive: true });
      break;
  }

  return pipeline.toBuffer();
}

// Generate responsive image srcSet
export function generateSrcSet(baseUrl: string, sizes: ImageSize[]): string {
  return sizes
    .map(size => `${baseUrl}?w=${IMAGE_CONFIG.sizes[size]} ${IMAGE_CONFIG.sizes[size]}w`)
    .join(', ');
}

// Get optimal image format based on Accept header
export function getOptimalFormat(acceptHeader?: string): ImageFormat {
  if (!acceptHeader) return 'webp';

  if (acceptHeader.includes('image/avif')) return 'avif';
  if (acceptHeader.includes('image/webp')) return 'webp';
  return 'jpeg';
}

// Parse image optimization query parameters
export function parseImageParams(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const width = searchParams.get('w') ? parseInt(searchParams.get('w')!) : undefined;
  const height = searchParams.get('h') ? parseInt(searchParams.get('h')!) : undefined;
  const format = searchParams.get('f') as ImageFormat || getOptimalFormat(request.headers.get('accept') || '');
  const quality = searchParams.get('q') ? parseInt(searchParams.get('q')!) : undefined;

  return { width, height, format, quality };
}

// Cache headers for optimized images
export function getImageCacheHeaders(): Record<string, string> {
  return {
    'Cache-Control': `public, max-age=${IMAGE_CONFIG.maxAge}, s-maxage=${IMAGE_CONFIG.maxAge}, stale-while-revalidate=${IMAGE_CONFIG.staleWhileRevalidate}`,
    'Vary': 'Accept',
  };
}

// Generate responsive image component props
export interface ResponsiveImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  className?: string;
}

export function generateResponsiveImageProps(
  src: string,
  alt: string,
  options: Partial<ResponsiveImageProps> = {}
): ResponsiveImageProps {
  const defaultSizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
  
  return {
    src,
    alt,
    sizes: options.sizes || defaultSizes,
    ...options,
  };
}

// Lazy loading intersection observer config
export const LAZY_LOADING_CONFIG = {
  rootMargin: '50px',
  threshold: 0.1,
};

// Preload critical images
export function preloadImage(src: string, as: 'image' = 'image'): void {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = as;
    link.href = src;
    document.head.appendChild(link);
  }
}
