import useSWR from 'swr';
import { strapi } from '@/lib/strapi';
import { Product, ProductCategory, ColorVariety } from '@/types/strapi';

// Generic fetcher function
const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  return response.json();
};

// Custom hooks for Strapi data with caching

export function useProductCategories() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/products',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // Cache for 1 minute
    }
  );

  return {
    categories: data?.categories || [],
    isLoading,
    isError: error,
    mutate,
  };
}

export function useProductsByCategory(category: string) {
  const { data, error, isLoading, mutate } = useSWR(
    category ? `/api/products/${category}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 300000, // Cache for 5 minutes
    }
  );

  return {
    products: data?.products || [],
    isLoading,
    isError: error,
    mutate,
  };
}

export function useColorVarieties() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/colors',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 600000, // Cache for 10 minutes (colors change infrequently)
    }
  );

  return {
    colors: data?.colors || [],
    isLoading,
    isError: error,
    mutate,
  };
}

export function useProductSearch(query: string) {
  const { data, error, isLoading, mutate } = useSWR(
    query ? `/api/search?q=${encodeURIComponent(query)}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 30000, // Cache search results for 30 seconds
    }
  );

  return {
    results: data?.products || [],
    isLoading,
    isError: error,
    mutate,
  };
}

// Strapi-specific hooks that use the client directly
export function useStrapiProducts(category?: string) {
  const { data, error, isLoading, mutate } = useSWR(
    ['strapi-products', category],
    async () => {
      if (category) {
        const result = await strapi.getProducts({ category });
        return result.products;
      }
      return await strapi.getProductCategories();
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 300000, // 5 minutes
    }
  );

  return {
    data,
    isLoading,
    isError: error,
    mutate,
  };
}

// Preload function for prefetching data
export function preloadProductData(category?: string) {
  if (category) {
    // Preload specific category
    useSWR(`/api/products/${category}`, fetcher);
  } else {
    // Preload categories
    useSWR('/api/products', fetcher);
  }
}
