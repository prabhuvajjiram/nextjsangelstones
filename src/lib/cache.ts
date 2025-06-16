// In-memory cache implementation for API routes
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>();

  set<T>(key: string, data: T, ttlMs: number = 300000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Cleanup expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Global cache instance
export const apiCache = new MemoryCache();

// Cache wrapper function for API routes
export function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs: number = 300000 // 5 minutes default
): Promise<T> {
  return new Promise(async (resolve, reject) => {
    try {
      // Try to get from cache first
      const cached = apiCache.get<T>(key);
      if (cached) {
        resolve(cached);
        return;
      }

      // Fetch fresh data
      const data = await fetcher();
      
      // Cache the result
      apiCache.set(key, data, ttlMs);
      
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
}

// Cache key generators
export const cacheKeys = {
  productCategories: () => 'product-categories',
  productsByCategory: (category: string) => `products-${category}`,
  colorVarieties: () => 'color-varieties',
  productSearch: (query: string) => `search-${query}`,
  strapiProducts: (category?: string) => `strapi-products-${category || 'all'}`,
};

// Background cleanup - run every 10 minutes
setInterval(() => {
  apiCache.cleanup();
}, 10 * 60 * 1000);

// Cache invalidation helpers
export const invalidateCache = {
  products: () => {
    apiCache.delete(cacheKeys.productCategories());
    // Also clear category-specific caches
    // Note: In production, you'd want a more sophisticated pattern matching
  },
  
  category: (category: string) => {
    apiCache.delete(cacheKeys.productsByCategory(category));
  },
  
  colors: () => {
    apiCache.delete(cacheKeys.colorVarieties());
  },
  
  all: () => {
    apiCache.clear();
  },
};
