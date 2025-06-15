// Strapi API Client for Angel Granites

import {
  StrapiResponse,
  StrapiSingleResponse,
  ProductCategory,
  ColorVariety,
  Product,
  Project,
  SiteContent,
  StrapiError
} from '@/types/strapi';

interface StrapiConfig {
  url: string;
  apiToken?: string;
}

class StrapiClient {
  private config: StrapiConfig;

  constructor(config: StrapiConfig) {
    this.config = config;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.config.url}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options?.headers,
    };

    if (this.config.apiToken) {
      headers['Authorization'] = `Bearer ${this.config.apiToken}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData: StrapiError = await response.json();
      throw new Error(`Strapi API Error: ${errorData.error?.message || 'Unknown error'}`);
    }

    return response.json();
  }

  // Product Categories
  async getProductCategories(): Promise<ProductCategory[]> {
    const response = await this.request<StrapiResponse<ProductCategory[]>>('/api/product-categories?sort=displayOrder:asc');
    return response.data;
  }

  async getProductCategory(slug: string): Promise<ProductCategory | null> {
    try {
      const response = await this.request<StrapiResponse<ProductCategory[]>>(`/api/product-categories?filters[slug][$eq]=${slug}`);
      return response.data[0] || null;
    } catch (error) {
      console.error('Error fetching product category:', error);
      return null;
    }
  }

  async getFeaturedCategories(): Promise<ProductCategory[]> {
    const response = await this.request<StrapiResponse<ProductCategory[]>>('/api/product-categories?filters[featured][$eq]=true&sort=displayOrder:asc');
    return response.data;
  }

  // Color Varieties
  async getColorVarieties(): Promise<ColorVariety[]> {
    const response = await this.request<StrapiResponse<ColorVariety[]>>('/api/color-varieties?sort=displayOrder:asc');
    return response.data;
  }

  async getAvailableColors(): Promise<ColorVariety[]> {
    const response = await this.request<StrapiResponse<ColorVariety[]>>('/api/color-varieties?filters[available][$eq]=true&sort=displayOrder:asc');
    return response.data;
  }

  // Products
  async getProducts(options?: {
    category?: string;
    featured?: boolean;
    limit?: number;
    page?: number;
  }): Promise<{ products: Product[]; pagination: any }> {
    let endpoint = '/api/products?populate=*&sort=displayOrder:asc';
    
    if (options?.category) {
      endpoint += `&filters[product_categories][slug][$eq]=${options.category}`;
    }
    
    if (options?.featured) {
      endpoint += `&filters[featured][$eq]=true`;
    }
    
    if (options?.limit) {
      endpoint += `&pagination[pageSize]=${options.limit}`;
    }
    
    if (options?.page) {
      endpoint += `&pagination[page]=${options.page}`;
    }

    const response = await this.request<StrapiResponse<Product[]>>(endpoint);
    return {
      products: response.data,
      pagination: response.meta.pagination
    };
  }

  async getProduct(slug: string): Promise<Product | null> {
    try {
      const response = await this.request<StrapiResponse<Product[]>>(`/api/products?filters[slug][$eq]=${slug}&populate=*`);
      return response.data[0] || null;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }

  async searchProducts(query: string): Promise<Product[]> {
    const response = await this.request<StrapiResponse<Product[]>>(
      `/api/products?filters[$or][0][name][$containsi]=${query}&filters[$or][1][description][$containsi]=${query}&populate=*`
    );
    return response.data;
  }

  // Projects
  async getProjects(options?: {
    featured?: boolean;
    category?: string;
    limit?: number;
  }): Promise<Project[]> {
    let endpoint = '/api/projects?populate=*&sort=displayOrder:asc';
    
    if (options?.featured) {
      endpoint += `&filters[featured][$eq]=true`;
    }
    
    if (options?.category) {
      endpoint += `&filters[category][$eq]=${options.category}`;
    }
    
    if (options?.limit) {
      endpoint += `&pagination[pageSize]=${options.limit}`;
    }

    const response = await this.request<StrapiResponse<Project[]>>(endpoint);
    return response.data;
  }

  async getProject(slug: string): Promise<Project | null> {
    try {
      const response = await this.request<StrapiResponse<Project[]>>(`/api/projects?filters[slug][$eq]=${slug}&populate=*`);
      return response.data[0] || null;
    } catch (error) {
      console.error('Error fetching project:', error);
      return null;
    }
  }

  // Site Content
  async getSiteContent(): Promise<SiteContent | null> {
    try {
      const response = await this.request<StrapiSingleResponse<SiteContent>>('/api/site-content?populate=*');
      return response.data;
    } catch (error) {
      console.error('Error fetching site content:', error);
      return null;
    }
  }

  // Utility method to get full media URL
  getMediaUrl(url: string): string {
    if (url.startsWith('http')) {
      return url;
    }
    return `${this.config.url}${url}`;
  }

  // Utility method to convert rich text to plain text
  richTextToPlainText(richText: any[]): string {
    if (!richText || !Array.isArray(richText)) return '';
    
    return richText
      .map(block => {
        if (block.type === 'paragraph' && block.children) {
          return block.children
            .filter((child: any) => child.type === 'text')
            .map((child: any) => child.text)
            .join('');
        }
        return '';
      })
      .join(' ');
  }
}

// Initialize Strapi client
export const strapi = new StrapiClient({
  url: process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337',
  apiToken: process.env.STRAPI_API_TOKEN,
});

export default strapi;
