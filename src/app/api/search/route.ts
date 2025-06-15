import { NextRequest, NextResponse } from 'next/server';
import { strapi } from '@/lib/strapi';

/**
 * Search API endpoint
 * Searches for products across all categories using Strapi
 */
export async function GET(request: NextRequest) {
  try {
    // Get search query from URL parameters
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    
    if (!query || query.trim().length < 2) {
      return NextResponse.json({ 
        error: 'Search query must be at least 2 characters' 
      }, { status: 400 });
    }

    console.log(`Searching for: "${query}"`);

    // Search products using Strapi
    const products = await strapi.searchProducts(query.trim());

    if (!products || products.length === 0) {
      return NextResponse.json({
        query,
        results: [],
        total: 0,
        message: 'No products found matching your search.'
      });
    }

    // Transform products to match frontend expectations
    const searchResults = products.flatMap(product => {
      // Get all images for this product
      const productImages = product.images.map(image => ({
        name: image.name,
        path: strapi.getMediaUrl(image.url),
        alt: image.alternativeText || product.name,
        productName: product.name,
        productId: product.documentId,
        productSlug: product.slug,
        productDescription: strapi.richTextToPlainText(product.description || []),
        categories: product.product_categories.map(cat => cat.name).join(', '),
        categorySlug: product.product_categories[0]?.slug || 'uncategorized',
        featured: product.featured,
      }));

      return productImages;
    });

    console.log(`Found ${searchResults.length} images in ${products.length} products for query: "${query}"`);

    return NextResponse.json({
      query,
      results: searchResults,
      total: searchResults.length,
      productsFound: products.length,
      message: `Found ${products.length} product(s) with ${searchResults.length} image(s)`
    });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({
      error: 'Failed to perform search',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
