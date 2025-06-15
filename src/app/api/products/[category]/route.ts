import { NextRequest, NextResponse } from 'next/server';
import { strapi } from '@/lib/strapi';

interface RouteContext {
  params: Promise<{ category: string }>;
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { category } = await context.params;
    console.log(`Fetching products for category: ${category}`);

    // Fetch products from Strapi by category
    const { products } = await strapi.getProducts({ category });

    if (!products || products.length === 0) {
      return NextResponse.json({ 
        error: 'No products found in this category',
        category,
        images: []
      }, { status: 404 });
    }

    // Transform products to match frontend expectations
    const images = products.flatMap(product => 
      product.images.map(image => ({
        name: image.name,
        path: strapi.getMediaUrl(image.url),
        alt: image.alternativeText || product.name,
        productName: product.name,
        productId: product.documentId,
        productSlug: product.slug,
      }))
    );

    console.log(`Found ${images.length} images in ${products.length} products for category ${category}`);

    return NextResponse.json({
      category,
      images,
      totalProducts: products.length,
      totalImages: images.length
    });

  } catch (error) {
    console.error('Error fetching products by category:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch products',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
