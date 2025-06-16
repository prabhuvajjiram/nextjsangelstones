import { strapi } from '@/lib/strapi';
import { Product, ProductCategory } from '@/types/strapi';

// Enhanced search types
export interface SearchFilters {
  category?: string;
  featured?: boolean;
  material?: string;
  priceRange?: {
    min?: number;
    max?: number;
  };
  availability?: boolean;
}

export interface SearchOptions {
  query?: string;
  filters?: SearchFilters;
  sortBy?: 'relevance' | 'name' | 'featured' | 'displayOrder';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  page?: number;
}

export interface SearchResult {
  products: Product[];
  categories: ProductCategory[];
  totalResults: number;
  suggestions: string[];
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
  filters: {
    availableCategories: string[];
    availableMaterials: string[];
    priceRange: { min: number; max: number };
  };
}

// Search utility class
export class SearchService {
  private static instance: SearchService;
  private searchCache = new Map<string, { data: SearchResult; timestamp: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  static getInstance(): SearchService {
    if (!SearchService.instance) {
      SearchService.instance = new SearchService();
    }
    return SearchService.instance;
  }

  // Enhanced search with filters and faceted results
  async search(options: SearchOptions): Promise<SearchResult> {
    const cacheKey = JSON.stringify(options);
    
    // Check cache first
    const cached = this.searchCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    try {
      const { query = '', filters = {}, sortBy = 'relevance', sortOrder = 'desc', limit = 20, page = 1 } = options;

      // Build Strapi query parameters
      const strapiQuery = this.buildStrapiQuery(query, filters, sortBy, sortOrder, limit, page);

      // Fetch products
      const productsResponse = await strapi.getProducts(strapiQuery);
      
      // Fetch categories if searching for them
      let categories: ProductCategory[] = [];
      if (query) {
        const allCategories = await strapi.getProductCategories();
        categories = allCategories.filter(cat => 
          cat.name.toLowerCase().includes(query.toLowerCase()) ||
          cat.description?.some(desc => 
            typeof desc === 'object' && 'text' in desc && 
            typeof desc.text === 'string' &&
            desc.text.toLowerCase().includes(query.toLowerCase())
          )
        );
      }

      // Generate search suggestions
      const suggestions = await this.generateSuggestions(query);

      // Build filter options
      const filterOptions = await this.buildFilterOptions(productsResponse.products);

      const result: SearchResult = {
        products: productsResponse.products,
        categories,
        totalResults: productsResponse.pagination.total,
        suggestions,
        pagination: productsResponse.pagination,
        filters: filterOptions,
      };

      // Cache the result
      this.searchCache.set(cacheKey, { data: result, timestamp: Date.now() });

      return result;
    } catch (error) {
      console.error('Search error:', error);
      return {
        products: [],
        categories: [],
        totalResults: 0,
        suggestions: [],
        pagination: {
          page: 1,
          pageSize: options.limit || 20,
          pageCount: 0,
          total: 0,
        },
        filters: {
          availableCategories: [],
          availableMaterials: [],
          priceRange: { min: 0, max: 0 },
        },
      };
    }
  }

  // Build Strapi query from search options
  private buildStrapiQuery(
    query: string, 
    filters: SearchFilters, 
    sortBy: string, 
    sortOrder: string, 
    limit: number, 
    page: number
  ) {
    const strapiOptions: any = {
      limit,
      page,
    };

    // Add category filter
    if (filters.category) {
      strapiOptions.category = filters.category;
    }

    // Add featured filter
    if (filters.featured !== undefined) {
      strapiOptions.featured = filters.featured;
    }

    return strapiOptions;
  }

  // Generate search suggestions based on existing products
  private async generateSuggestions(query: string): Promise<string[]> {
    if (!query || query.length < 2) return [];

    try {
      // Get all products for suggestion generation
      const { products } = await strapi.getProducts({ limit: 100 });
      const categories = await strapi.getProductCategories();

      const suggestions = new Set<string>();

      // Add product name suggestions
      products.forEach(product => {
        const name = product.name.toLowerCase();
        if (name.includes(query.toLowerCase()) && name !== query.toLowerCase()) {
          suggestions.add(product.name);
        }
      });

      // Add category suggestions
      categories.forEach(category => {
        const name = category.name.toLowerCase();
        if (name.includes(query.toLowerCase()) && name !== query.toLowerCase()) {
          suggestions.add(category.name);
        }
      });

      // Add material suggestions
      products.forEach(product => {
        if (product.material && product.material.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(product.material);
        }
      });

      return Array.from(suggestions).slice(0, 6); // Limit to 6 suggestions
    } catch (error) {
      console.error('Error generating suggestions:', error);
      return [];
    }
  }

  // Build available filter options from products
  private async buildFilterOptions(products: Product[]) {
    const categories = new Set<string>();
    const materials = new Set<string>();
    let minPrice = Infinity;
    let maxPrice = -Infinity;

    products.forEach(product => {
      // Collect categories
      product.product_categories?.forEach(cat => {
        categories.add(cat.name);
      });

      // Collect materials
      if (product.material) {
        materials.add(product.material);
      }

      // Calculate price range (if you add pricing later)
      // For now, set default range
    });

    return {
      availableCategories: Array.from(categories),
      availableMaterials: Array.from(materials),
      priceRange: { 
        min: minPrice === Infinity ? 0 : minPrice, 
        max: maxPrice === -Infinity ? 1000 : maxPrice 
      },
    };
  }

  // Clear search cache
  clearCache(): void {
    this.searchCache.clear();
  }

  // Cleanup expired cache entries
  cleanupCache(): void {
    const now = Date.now();
    for (const [key, value] of this.searchCache.entries()) {
      if (now - value.timestamp > this.CACHE_TTL) {
        this.searchCache.delete(key);
      }
    }
  }
}

// Export singleton instance
export const searchService = SearchService.getInstance();

// Auto cleanup every 10 minutes
setInterval(() => {
  searchService.cleanupCache();
}, 10 * 60 * 1000);

// Popular/trending search terms (you can populate this from analytics)
export const POPULAR_SEARCHES = [
  'monuments',
  'granite',
  'black granite',
  'memorials',
  'benches',
  'custom designs',
  'columbarium',
];

// Search analytics (basic implementation)
export class SearchAnalytics {
  private static searches = new Map<string, number>();

  static trackSearch(query: string): void {
    if (query && query.length > 0) {
      const count = this.searches.get(query) || 0;
      this.searches.set(query, count + 1);
    }
  }

  static getPopularSearches(limit = 10): Array<{ query: string; count: number }> {
    return Array.from(this.searches.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([query, count]) => ({ query, count }));
  }

  static getTrendingSearches(): string[] {
    // This could be enhanced with time-based trending logic
    return this.getPopularSearches(5).map(s => s.query);
  }
}
