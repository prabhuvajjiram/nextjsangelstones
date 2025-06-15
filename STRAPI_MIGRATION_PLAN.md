# Angel Granites: Strapi 5 Migration Plan

## Executive Summary
This document outlines the complete migration strategy for Angel Granites website from the current Next.js file-system approach to a Next.js + Strapi 5 headless CMS architecture.

## Current Architecture Analysis

### Current Tech Stack
- **Frontend**: Next.js 15.3.2 + React 19
- **Styling**: Tailwind CSS with custom components
- **Data Management**: File-system based (images in `/public/images/`)
- **API**: Custom Next.js API routes
- **Performance**: Optimized with Sharp, SWR, React.memo

### Current Data Structure
```
public/images/
├── products/
│   ├── Benches/
│   ├── Designs/
│   ├── MBNA_2025/
│   ├── Monuments/
│   └── columbarium/
├── varieties/ 
├── projects/
├── featured/
└── hero/
```

### Current API Endpoints
- `/api/products/[category]` - Product images by category
- `/api/search` - Product search
- `/api/colors` - Color varieties
- `/api/contact` - Contact form handling
- `/api/image` - Image serving utilities

---

## Migration Strategy

### Phase 1: Environment Setup (Days 1-3)

#### 1.1 Strapi Installation
```bash
# Create Strapi project alongside Next.js with TypeScript
# (Recommended since your Next.js project is already using TypeScript)
npx create-strapi-app@latest angel-granites-cms --quickstart --typescript

# Install additional plugins for enhanced functionality
npm install @strapi/plugin-upload
npm install @strapi/plugin-email
npm install @strapi/plugin-seo
npm install @strapi/plugin-graphql  # For GraphQL API (optional)
```

**Why TypeScript for Strapi?**
- Your Next.js 15.3.2 project already uses TypeScript
- Shared type definitions between frontend and backend
- Auto-generated types from Strapi content types
- Better IDE support and error catching
- Seamless integration with your existing codebase

#### 1.2 Development Environment
- **Frontend**: Keep on port 3000
- **Strapi Admin**: Run on port 1337
- **Database**: SQLite for initial development, MySQL for production (and optionally for development)

#### 1.3 MySQL Setup Options

##### Option A: Local MySQL (Recommended for Development)
```bash
# Install MySQL locally or use existing installation
# Create database for development
mysql -u root -p
CREATE DATABASE angel_granites_dev;
CREATE USER 'strapi_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON angel_granites_dev.* TO 'strapi_user'@'localhost';
FLUSH PRIVILEGES;
```

##### Option B: MySQL in Docker (Alternative)
```yaml
# docker-compose.dev.yml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: angel_granites_dev
      MYSQL_USER: strapi_user
      MYSQL_PASSWORD: strapi_password
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

##### Strapi Database Configuration
```javascript
// config/database.ts
export default ({ env }) => ({
  connection: {
    client: 'mysql',
    connection: {
      host: env('DATABASE_HOST', 'localhost'),
      port: env.int('DATABASE_PORT', 3306),
      database: env('DATABASE_NAME', 'angel_granites_dev'),
      user: env('DATABASE_USERNAME', 'strapi_user'),
      password: env('DATABASE_PASSWORD', 'strapi_password'),
      ssl: env.bool('DATABASE_SSL', false) && {
        key: env('DATABASE_SSL_KEY', undefined),
        cert: env('DATABASE_SSL_CERT', undefined),
        ca: env('DATABASE_SSL_CA', undefined),
        capath: env('DATABASE_SSL_CAPATH', undefined),
        cipher: env('DATABASE_SSL_CIPHER', undefined),
        rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
      },
    },
    pool: { min: env.int('DATABASE_POOL_MIN', 2), max: env.int('DATABASE_POOL_MAX', 10) },
    acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
  },
});
```

#### 1.3 Project Structure
```
angel-granites-nextjs/           # Existing Next.js frontend
angel-granites-cms/              # New Strapi backend
migration-scripts/               # Custom migration utilities
docs/                           # Migration documentation
```

---

### Phase 2: Content Type Modeling (Days 4-7)

#### 2.1 Core Content Types

##### Product Categories
```typescript
interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  thumbnail?: Media;
  seo?: SEO;
  featured: boolean;
  displayOrder: number;
  created_at: string;
  updated_at: string;
}
```

##### Products
```typescript
interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  category: ProductCategory;
  images: Media[];
  specifications?: JSON;
  dimensions?: string;
  material?: string;
  featured: boolean;
  displayOrder: number;
  seo?: SEO;
  created_at: string;
  updated_at: string;
}
```

##### Color Varieties
```typescript
interface ColorVariety {
  id: number;
  name: string;
  slug: string;
  hexCode?: string;
  thumbnail: Media;
  description?: string;
  available: boolean;
  displayOrder: number;
}
```

##### Projects (Portfolio)
```typescript
interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  category: ProjectCategory;
  images: Media[];
  location?: string;
  completionDate?: string;
  featured: boolean;
  tags?: string[];
  seo?: SEO;
}
```

##### Site Content (Global)
```typescript
interface SiteContent {
  id: number;
  section: 'hero' | 'about' | 'whyChooseUs' | 'contact';
  title?: string;
  content: JSON; // Rich text content
  media?: Media[];
  settings?: JSON;
}
```

#### 2.2 Advanced Content Types

##### SEO Component
```typescript
interface SEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  canonicalURL?: string;
  metaImage?: Media;
  metaRobots?: string;
}
```

##### Testimonials
```typescript
interface Testimonial {
  id: number;
  clientName: string;
  content: string;
  rating?: number;
  projectImage?: Media;
  location?: string;
  featured: boolean;
}
```

---

### Phase 3: Data Migration (Days 8-12)

#### 3.1 Image Migration Strategy

##### Current Image Organization
```
public/images/products/
├── Accessories/ (46 images)
├── Benches/ (1 subfolder)
├── Designs/ (multiple images)
├── MBNA_2025/ (special category)
├── Monuments/ (various sizes)
├── Vases/ (different styles)
└── columbarium/ (specialized products)
```

##### Migration Script Development
```typescript
// migration-scripts/migrate-images.ts
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';

interface ImageMigrationConfig {
  sourceDir: string;
  strapiUrl: string;
  apiToken: string;
  categoryMapping: Record<string, string>;
}

async function migrateImages(config: ImageMigrationConfig) {
  // 1. Scan source directories
  // 2. Upload to Strapi Media Library
  // 3. Create product entries
  // 4. Link images to products
  // 5. Generate migration report
}
```

#### 3.2 Content Migration Steps

1. **Category Migration**
   - Create product categories in Strapi
   - Map existing folder structure to categories
   - Set display order and featured status

2. **Image Upload**
   - Batch upload images to Strapi Media Library
   - Maintain folder organization with metadata
   - Generate alt text and descriptions

3. **Product Creation**
   - Create product entries for each image
   - Auto-generate names from filenames
   - Link to appropriate categories

4. **Color Varieties Migration**
   - Upload color sample images
   - Create color variety entries
   - Link to existing products where applicable

#### 3.3 Migration Validation
```typescript
// migration-scripts/validate-migration.ts
interface MigrationReport {
  totalImages: number;
  uploadedImages: number;
  failedUploads: string[];
  categoriesCreated: number;
  productsCreated: number;
  orphanedImages: string[];
}
```

---

### Phase 4: API Integration (Days 13-18)

#### 4.1 Strapi Configuration

##### API Permissions
```typescript
// config/permissions.ts
export const publicPermissions = {
  'product-category': ['find', 'findOne'],
  'product': ['find', 'findOne'],
  'color-variety': ['find', 'findOne'],
  'project': ['find', 'findOne'],
  'site-content': ['find', 'findOne'],
  'testimonial': ['find']
};
```

##### Custom API Routes
```typescript
// src/api/product/routes/custom.ts
export default {
  routes: [
    {
      method: 'GET',
      path: '/products/by-category/:slug',
      handler: 'custom.findByCategory',
    },
    {
      method: 'GET',
      path: '/products/search',
      handler: 'custom.search',
    },
    {
      method: 'GET',
      path: '/products/featured',
      handler: 'custom.findFeatured',
    }
  ]
};
```

#### 4.2 Next.js Integration

##### API Utilities
```typescript
// src/lib/strapi.ts
interface StrapiConfig {
  url: string;
  apiToken?: string;
}

class StrapiClient {
  constructor(private config: StrapiConfig) {}
  
  async getProducts(category?: string): Promise<Product[]> {
    const endpoint = category 
      ? `/api/products/by-category/${category}`
      : '/api/products';
    
    const response = await fetch(`${this.config.url}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${this.config.apiToken}`,
      },
    });
    
    return response.json();
  }
  
  async searchProducts(query: string): Promise<Product[]> {
    // Implementation
  }
  
  async getColorVarieties(): Promise<ColorVariety[]> {
    // Implementation
  }
}

export const strapi = new StrapiClient({
  url: process.env.STRAPI_URL || 'http://localhost:1337',
  apiToken: process.env.STRAPI_API_TOKEN,
});
```

##### Updated API Routes
```typescript
// src/app/api/products/[category]/route.ts (Updated)
import { strapi } from '@/lib/strapi';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ category: string }> }
) {
  const { category } = await context.params;
  
  try {
    const products = await strapi.getProducts(category);
    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
```

#### 4.3 Component Updates

##### Product Components
```typescript
// src/components/products/ProductGrid.tsx (Updated)
import { strapi } from '@/lib/strapi';
import useSWR from 'swr';

interface ProductGridProps {
  category?: string;
}

export function ProductGrid({ category }: ProductGridProps) {
  const { data, error, isLoading } = useSWR(
    category ? `products-${category}` : 'products-all',
    () => strapi.getProducts(category)
  );

  if (isLoading) return <ProductGridSkeleton />;
  if (error) return <ErrorMessage />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {data?.products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

#### 4.4 TypeScript Integration

##### Auto-Generated Types from Strapi
```typescript
// types/strapi.ts (Auto-generated from Strapi content types)
export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface Product {
  id: number;
  attributes: {
    name: string;
    slug: string;
    description?: string;
    category: {
      data: ProductCategory;
    };
    images: {
      data: Media[];
    };
    specifications?: any;
    dimensions?: string;
    material?: string;
    featured: boolean;
    displayOrder: number;
    seo?: SEO;
    createdAt: string;
    updatedAt: string;
  };
}

export interface ProductCategory {
  id: number;
  attributes: {
    name: string;
    slug: string;
    description?: string;
    thumbnail?: {
      data: Media;
    };
    featured: boolean;
    displayOrder: number;
    createdAt: string;
    updatedAt: string;
  };
}
```

##### Type-Safe API Client
```typescript
// src/lib/strapi.ts (Enhanced with full TypeScript support)
import { Product, ProductCategory, StrapiResponse } from '@/types/strapi';

interface StrapiConfig {
  url: string;
  apiToken?: string;
}

class StrapiClient {
  constructor(private config: StrapiConfig) {}
  
  async getProducts(category?: string): Promise<StrapiResponse<Product[]>> {
    const endpoint = category 
      ? `/api/products?filters[category][slug][$eq]=${category}&populate=*`
      : '/api/products?populate=*';
    
    const response = await fetch(`${this.config.url}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${this.config.apiToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  async getCategories(): Promise<StrapiResponse<ProductCategory[]>> {
    const response = await fetch(`${this.config.url}/api/product-categories?populate=*`, {
      headers: {
        'Authorization': `Bearer ${this.config.apiToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  async searchProducts(query: string): Promise<StrapiResponse<Product[]>> {
    const response = await fetch(
      `${this.config.url}/api/products?filters[$or][0][name][$containsi]=${query}&filters[$or][1][description][$containsi]=${query}&populate=*`,
      {
        headers: {
          'Authorization': `Bearer ${this.config.apiToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to search products: ${response.statusText}`);
    }
    
    return response.json();
  }
}

export const strapi = new StrapiClient({
  url: process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337',
  apiToken: process.env.STRAPI_API_TOKEN,
});
```

##### Type-Safe Hooks
```typescript
// src/hooks/useProducts.ts
import useSWR from 'swr';
import { strapi } from '@/lib/strapi';
import { Product, StrapiResponse } from '@/types/strapi';

export function useProducts(category?: string) {
  const { data, error, isLoading, mutate } = useSWR<StrapiResponse<Product[]>>(
    category ? `products-${category}` : 'products-all',
    () => strapi.getProducts(category),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    products: data?.data || [],
    pagination: data?.meta.pagination,
    isLoading,
    isError: error,
    refetch: mutate,
  };
}

export function useProductSearch(query: string) {
  const { data, error, isLoading } = useSWR<StrapiResponse<Product[]>>(
    query ? `search-${query}` : null,
    () => strapi.searchProducts(query),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    products: data?.data || [],
    isLoading,
    isError: error,
  };
}
```

---

### Phase 5: Advanced Features (Days 19-25)

#### 5.1 Search Enhancement
```typescript
// Strapi search with filters
interface SearchFilters {
  category?: string;
  colors?: string[];
  featured?: boolean;
  tags?: string[];
}

async function searchProducts(query: string, filters: SearchFilters) {
  // Advanced search implementation with Strapi
}
```

#### 5.2 Image Optimization
```typescript
// Strapi image transformations
interface ImageTransform {
  width?: number;
  height?: number;
  format?: 'webp' | 'jpg' | 'png';
  quality?: number;
}

function getStrapiImageUrl(image: Media, transform?: ImageTransform): string {
  const baseUrl = `${process.env.STRAPI_URL}${image.url}`;
  
  if (!transform) return baseUrl;
  
  const params = new URLSearchParams();
  if (transform.width) params.set('w', transform.width.toString());
  if (transform.height) params.set('h', transform.height.toString());
  if (transform.format) params.set('format', transform.format);
  if (transform.quality) params.set('quality', transform.quality.toString());
  
  return `${baseUrl}?${params.toString()}`;
}
```

#### 5.3 Caching Strategy
```typescript
// Enhanced caching with Strapi
export const revalidate = 3600; // 1 hour

export async function generateStaticParams() {
  const categories = await strapi.getCategories();
  return categories.map((category) => ({
    category: category.slug,
  }));
}
```

---

### Phase 6: Content Management (Days 26-30)

#### 6.1 Admin Panel Customization
```typescript
// config/admin.ts
export default {
  config: {
    locales: ['en'],
    translations: {
      en: {
        'app.components.HomePage.welcome': 'Welcome to Angel Granites CMS',
        'app.components.HomePage.welcome.again': 'Welcome back to Angel Granites CMS',
      },
    },
    theme: {
      light: {
        colors: {
          primary100: '#f0f4f8',
          primary200: '#d9e6f2',
          primary500: '#0066cc',
          primary600: '#004d99',
          primary700: '#003366',
        },
      },
    },
  },
};
```

#### 6.2 Custom Fields
```typescript
// Custom rich text field for product descriptions
// Custom image gallery field for product images
// Custom color picker for color varieties
```

#### 6.3 Workflow Setup
1. **Content Creation Workflow**
   - Draft → Review → Publish
   - Approval process for new products
   - Bulk operations for product management

2. **Media Management**
   - Image compression settings
   - Alt text requirements
   - Folder organization

---

### Phase 7: Testing & Optimization (Days 31-35)

#### 7.1 Performance Testing
```typescript
// Performance benchmarks
interface PerformanceBenchmark {
  endpoint: string;
  currentTime: number;
  strapiTime: number;
  improvement: number;
}

const benchmarks: PerformanceBenchmark[] = [
  {
    endpoint: '/api/products/monuments',
    currentTime: 150, // ms
    strapiTime: 75,   // ms (with caching)
    improvement: 50   // % faster
  }
];
```

#### 7.2 A/B Testing Plan
- Compare current system vs Strapi for 2 weeks
- Monitor Core Web Vitals
- Track admin user satisfaction
- Measure content update frequency

#### 7.3 Rollback Strategy
```typescript
// Maintain parallel systems during transition
// Database backup procedures
// Rollback scripts if needed
```

---

### Phase 8: Deployment & Go-Live (Days 36-40)

#### 8.1 Production Environment
```yaml
# docker-compose.yml
version: '3.8'
services:
  strapi:
    image: strapi/strapi:latest
    environment:
      DATABASE_CLIENT: mysql
      DATABASE_HOST: db
      DATABASE_PORT: 3306
      DATABASE_NAME: angel_granites
      DATABASE_USERNAME: strapi
      DATABASE_PASSWORD: ${DB_PASSWORD}
    ports:
      - "1337:1337"
    
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
      MYSQL_DATABASE: angel_granites
      MYSQL_USER: strapi
      MYSQL_PASSWORD: ${DB_PASSWORD}
```

#### 8.2 Environment Variables
```bash
# .env.production
NEXT_PUBLIC_STRAPI_URL=https://cms.angelgranites.com
STRAPI_API_TOKEN=your_production_token
DATABASE_URL=mysql://user:password@host:port/database
```

#### 8.3 Deployment Checklist
- [ ] Strapi production deployment
- [ ] Database migration
- [ ] Media files upload to cloud storage
- [ ] Environment variables configuration
- [ ] SSL certificates
- [ ] CDN setup for media files
- [ ] Performance monitoring setup
- [ ] Backup procedures

### Database Considerations
**Development:** SQLite (automatic) or MySQL (configurable)
**Production:** MySQL (recommended for your preference)

## 🔧 What You'll Need for Production

```bash
# Environment variables for production (MySQL)
DATABASE_HOST=your-mysql-host
DATABASE_PORT=3306
DATABASE_NAME=angel_granites
DATABASE_USERNAME=your-mysql-user
DATABASE_PASSWORD=your-mysql-password
JWT_SECRET=your-random-secret
API_TOKEN_SALT=your-random-salt
ADMIN_JWT_SECRET=your-admin-secret
```

## 💡 My Recommendation for MySQL

**Use PlanetScale or Railway for production** - here's why:

#### **PlanetScale** (MySQL Specialist)
- ✅ **FREE tier**: 1GB database, 1 billion row reads/month
- ✅ **Serverless MySQL**: No server management
- ✅ **Branching**: Database branching like Git
- ✅ **Global edge**: Fast worldwide

#### **Railway** (Full Stack)
- ✅ **FREE tier**: Includes MySQL database
- ✅ **Auto-deployment**: GitHub integration
- ✅ **Simple setup**: One-click MySQL addition

#### **DigitalOcean Managed MySQL**
- ✅ **$15/month**: Managed MySQL cluster
- ✅ **Automatic backups**: Daily backups included
- ✅ **High availability**: 99.95% uptime SLA

---

## Risk Mitigation

### Technical Risks
1. **Data Loss**: Complete backup before migration
2. **Downtime**: Maintain parallel systems during transition
3. **Performance Issues**: Load testing before go-live
4. **SEO Impact**: Maintain URL structure and redirects

### Business Risks
1. **Content Management Training**: Admin user training sessions
2. **Workflow Disruption**: Gradual transition with fallback options
3. **Cost Overrun**: Fixed timeline with defined scope

---

## Success Metrics

### Technical KPIs
- **Page Load Time**: < 2 seconds
- **API Response Time**: < 100ms
- **Image Load Time**: < 1 second
- **Lighthouse Score**: > 90

### Business KPIs
- **Content Update Frequency**: 2x increase
- **Admin User Satisfaction**: > 8/10
- **Time to Publish**: < 5 minutes
- **SEO Rankings**: Maintain or improve

---

## Timeline Summary

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| Setup | 3 days | Strapi installation, environment |
| Modeling | 4 days | Content types, relationships |
| Migration | 5 days | Data migration, validation |
| Integration | 6 days | API updates, component updates |
| Features | 7 days | Search, optimization, caching |
| CMS | 5 days | Admin customization, workflows |
| Testing | 5 days | Performance, A/B testing |
| Deployment | 5 days | Production deployment |

**Total Duration**: 40 days (8 weeks)

---

## Budget Estimate

### Development
- **Developer Time**: 200 hours @ $75/hour = $15,000
- **DevOps Setup**: 20 hours @ $100/hour = $2,000

### Infrastructure
- **Hosting**: $50/month (Strapi + Database)
- **CDN**: $20/month (Media files)
- **Monitoring**: $30/month

### Total First Year Cost
- **Development**: $17,000 (one-time)
- **Infrastructure**: $1,200/year

---

## Next Steps

1. **Approval**: Review and approve migration plan
2. **Environment Setup**: Create development environments
3. **Team Briefing**: Brief development team on plan
4. **Backup Creation**: Full backup of current system
5. **Phase 1 Kickoff**: Begin Strapi setup

---

## Conclusion

This migration to Strapi 5 will provide Angel Granites with:
- **Better Content Management**: User-friendly admin interface
- **Improved Performance**: Optimized API and caching
- **Enhanced Scalability**: Headless architecture for future growth
- **Better Developer Experience**: Modern tools and workflows

The phased approach ensures minimal disruption while delivering significant long-term benefits.
