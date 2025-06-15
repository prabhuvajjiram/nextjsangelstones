import { NextResponse } from 'next/server';
import { strapi } from '@/lib/strapi';

export async function GET() {
  try {
    // Fetch product categories from Strapi
    const categories = await strapi.getProductCategories();
    
    // Transform to match the expected format for your frontend
    const formattedCategories = categories.map(category => ({
      name: category.name,
      slug: category.slug,
      description: strapi.richTextToPlainText(category.description),
      featured: category.featured,
      displayOrder: category.displayOrder,
      thumbnail: category.thumbnail ? strapi.getMediaUrl(category.thumbnail.url) : null,
      id: category.documentId,
      // Frontend compatibility - provide the path for navigation
      path: `/products/${category.slug}`,
      // Legacy format compatibility
      files: [], // Will be populated when we integrate products
      directories: [],
    }));

    return NextResponse.json(formattedCategories);
  } catch (error) {
    console.error('Error fetching product categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product categories' },
      { status: 500 }
    );
  }
}
