import { NextRequest, NextResponse } from 'next/server';
import { strapi } from '@/lib/strapi';
import { withCache, cacheKeys } from '@/lib/cache';

export async function GET() {
  try {
    // Use cache wrapper with 5-minute TTL for product categories
    const categories = await withCache(
      cacheKeys.productCategories(),
      async () => {
        const strapiCategories = await strapi.getProductCategories();
        
        // Transform to frontend format
        return strapiCategories.map(category => ({
          name: category.name,
          slug: category.slug,
          description: strapi.richTextToPlainText(category.description),
          featured: category.featured,
          displayOrder: category.displayOrder,
          // Add path for navigation compatibility
          path: `/products/${category.slug}`,
          thumbnail: category.thumbnail ? strapi.getMediaUrl(category.thumbnail.url) : null,
          id: category.documentId,
          // Legacy format compatibility
          files: [], // Will be populated when we integrate products
          directories: [],
        }));
      },
      300000 // 5 minutes cache
    );

    return NextResponse.json({
      categories,
      // Legacy format
      success: true,
    });
  } catch (error) {
    console.error('Error fetching product categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product categories' },
      { status: 500 }
    );
  }
}
