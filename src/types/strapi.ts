// Strapi TypeScript Types for Angel Granites

export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiSingleResponse<T> {
  data: T;
  meta: {};
}

export interface StrapiMedia {
  id: number;
  documentId: string;
  name: string;
  alternativeText?: string;
  caption?: string;
  width: number;
  height: number;
  formats?: {
    thumbnail?: StrapiMediaFormat;
    small?: StrapiMediaFormat;
    medium?: StrapiMediaFormat;
    large?: StrapiMediaFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
  provider: string;
  createdAt: string;
  updatedAt: string;
}

export interface StrapiMediaFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  url: string;
}

export interface StrapiRichText {
  type: string;
  children: Array<{
    type: string;
    text: string;
  }>;
}

// Content Types
export interface ProductCategory {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: StrapiRichText[];
  thumbnail?: StrapiMedia;
  featured: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface ColorVariety {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  hexCode?: string;
  thumbnail?: StrapiMedia;
  description?: StrapiRichText[];
  available: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Product {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description?: StrapiRichText[];
  product_categories: ProductCategory[];
  images: StrapiMedia[];
  specifications?: Record<string, any>;
  dimensions?: string;
  material?: string;
  featured: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Project {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: StrapiRichText[];
  category: 'monuments' | 'memorials' | 'custom' | 'commercial';
  images: StrapiMedia[];
  location?: string;
  completionDate?: string;
  featured: boolean;
  tags?: Record<string, any>;
  clientName?: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface SiteContent {
  id: number;
  documentId: string;
  heroTitle: string;
  heroSubtitle?: string;
  heroImage?: StrapiMedia;
  aboutContent?: StrapiRichText[];
  contactEmail: string;
  contactPhone: string;
  contactAddress?: StrapiRichText[];
  businessHours?: StrapiRichText[];
  testimonials?: Record<string, any>;
  socialLinks?: Record<string, any>;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// API Error Response
export interface StrapiError {
  data: null;
  error: {
    status: number;
    name: string;
    message: string;
    details: Record<string, any>;
  };
}
