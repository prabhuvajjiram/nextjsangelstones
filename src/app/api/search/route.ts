import { NextRequest, NextResponse } from 'next/server';
import { searchService, SearchAnalytics, type SearchOptions } from '@/lib/searchEnhancement';
import { withCache, cacheKeys } from '@/lib/cache';

/**
 * Search API endpoint
 * Searches for products across all categories using enhanced search service with filters and suggestions
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse search parameters
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || undefined;
    const featured = searchParams.get('featured') === 'true' ? true : undefined;
    const material = searchParams.get('material') || undefined;
    const sortBy = (searchParams.get('sortBy') || 'relevance') as 'relevance' | 'name' | 'featured' | 'displayOrder';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');

    // Build search options
    const searchOptions: SearchOptions = {
      query,
      filters: {
        category,
        featured,
        material,
      },
      sortBy,
      sortOrder,
      limit,
      page,
    };

    // Track search analytics
    if (query) {
      SearchAnalytics.trackSearch(query);
    }

    // Use cache for search results
    const cacheKey = `search-${JSON.stringify(searchOptions)}`;
    const searchResults = await withCache(
      cacheKey,
      async () => {
        return await searchService.search(searchOptions);
      },
      30000 // 30 second cache for search results
    );

    // Transform results for frontend compatibility
    const response = {
      products: searchResults.products.map(product => ({
        id: product.documentId,
        name: product.name,
        slug: product.slug,
        description: product.description ? 
          product.description.map(d => typeof d === 'object' && 'text' in d ? d.text : '').join(' ') 
          : '',
        images: product.images?.map(img => ({
          name: img.name,
          path: `/api/images/uploads/${img.url}`,
          category: 'products',
          width: img.width,
          height: img.height,
          alt: img.alternativeText || product.name,
        })) || [],
        categories: product.product_categories?.map(cat => cat.name) || [],
        material: product.material,
        featured: product.featured,
        specifications: product.specifications,
        dimensions: product.dimensions,
      })),
      categories: searchResults.categories.map(category => ({
        id: category.documentId,
        name: category.name,
        slug: category.slug,
        description: category.description ? 
          category.description.map(d => typeof d === 'object' && 'text' in d ? d.text : '').join(' ') 
          : '',
        featured: category.featured,
        path: `/products/${category.slug}`,
      })),
      pagination: searchResults.pagination,
      suggestions: searchResults.suggestions,
      filters: {
        availableCategories: searchResults.filters.availableCategories,
        availableMaterials: searchResults.filters.availableMaterials,
        priceRange: searchResults.filters.priceRange,
      },
      analytics: {
        totalResults: searchResults.totalResults,
        searchTime: Date.now(), // You could track actual search time
        popularSearches: SearchAnalytics.getPopularSearches(5),
        trending: SearchAnalytics.getTrendingSearches(),
      },
      meta: {
        query,
        page,
        limit,
        sortBy,
        sortOrder,
        hasNextPage: searchResults.pagination.page < searchResults.pagination.pageCount,
        hasPrevPage: searchResults.pagination.page > 1,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { 
        error: 'Search failed',
        products: [],
        categories: [],
        suggestions: [],
        pagination: { page: 1, pageSize: 20, pageCount: 0, total: 0 },
      },
      { status: 500 }
    );
  }
}

// Handle search suggestions endpoint
export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    
    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    const cacheKey = `suggestions-${query}`;
    const suggestions = await withCache(
      cacheKey,
      async () => {
        const searchResults = await searchService.search({ 
          query, 
          limit: 5 
        });
        return searchResults.suggestions;
      },
      60000 // 1 minute cache for suggestions
    );

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Search suggestions error:', error);
    return NextResponse.json({ suggestions: [] });
  }
}
