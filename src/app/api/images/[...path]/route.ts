import { NextRequest, NextResponse } from 'next/server';
import { optimizeImage, parseImageParams, getImageCacheHeaders, IMAGE_CONFIG } from '@/lib/imageOptimization';
import { withCache } from '@/lib/cache';
import fs from 'fs/promises';
import path from 'path';

interface RouteParams {
  params: {
    path: string[];
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const imagePath = params.path.join('/');
    const { width, height, format, quality } = parseImageParams(request);

    // Generate cache key based on path and optimization params
    const cacheKey = `image-${imagePath}-${width || 'auto'}-${height || 'auto'}-${format}-${quality || 'default'}`;

    const optimizedBuffer = await withCache(
      cacheKey,
      async () => {
        // Try to read from public directory first
        let buffer: Buffer;
        
        try {
          const publicPath = path.join(process.cwd(), 'public', imagePath);
          buffer = await fs.readFile(publicPath);
        } catch (error) {
          // If not found in public, try Strapi uploads
          const strapiUrl = process.env.STRAPI_URL || 'http://localhost:1337';
          const strapiResponse = await fetch(`${strapiUrl}/uploads/${imagePath}`);
          
          if (!strapiResponse.ok) {
            throw new Error(`Image not found: ${imagePath}`);
          }
          
          buffer = Buffer.from(await strapiResponse.arrayBuffer());
        }

        // Optimize the image
        return await optimizeImage(buffer, {
          width,
          height,
          format,
          quality,
        });
      },
      IMAGE_CONFIG.maxAge * 1000 // Cache for the same duration as browser cache
    );

    // Determine content type
    const contentType = `image/${format}`;

    // Return optimized image with cache headers
    return new NextResponse(optimizedBuffer, {
      headers: {
        'Content-Type': contentType,
        ...getImageCacheHeaders(),
      },
    });

  } catch (error) {
    console.error('Image optimization error:', error);
    
    // Return 404 for missing images
    return new NextResponse('Image not found', { 
      status: 404,
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
  }
}

// Support for different HTTP methods with same logic
export const POST = GET;
export const PUT = GET;
