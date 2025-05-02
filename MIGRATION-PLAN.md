# Angel Granites - Next.js Migration Plan

This document outlines the step-by-step plan for migrating the Angel Granites website from its current PHP/HTML implementation to a modern Next.js application with Tailwind CSS.

## Migration Overview

The migration will convert the current PHP/HTML-based website to a modern React-based Next.js application while maintaining the same look, feel, and functionality. We'll use Tailwind CSS for styling and incorporate shadcn/ui for clean, ready-made components where appropriate.

## Phase 1: Project Setup and Configuration

- [x] Create a new Next.js project with TypeScript
- [x] Configure Tailwind CSS
- [x] Set up proper font loading with Next.js
- [x] Configure metadata and SEO settings
- [x] Set up directory structure for components, pages, and API routes
- [x] Install necessary dependencies

## Phase 2: Core Components and Layout

- [x] Create reusable layout components (Header, Footer, Layout)
- [x] Implement responsive navigation with mobile menu
- [x] Create section components for the homepage
- [x] Implement the hero section with video background
- [x] Set up basic page routing
- [x] Implement desktop navigation menu

## Phase 3: API Implementation

- [ ] Create API routes to replace PHP endpoints:
  - [x] `/api/products` - Get all product categories
  - [x] `/api/products/[category]` - Get products in a specific category
  - [x] `/api/search` - Search functionality
  - [x] `/api/image` - Image serving with optimization
  - [x] `/api/contact` - Contact form submission with email
- [x] Implement file system operations for product listings
- [x] Set up proper error handling and response formatting

## Phase 4: Product Gallery Implementation

- [x] Implement the "thumbnails first" approach for product galleries
- [x] Create reusable product thumbnail and viewer components
- [x] Implement fullscreen view with navigation
- [ ] Add special handling for the MBNA_2025 category (PNG files, no cache busting)
- [x] Implement horizontally scrollable thumbnails layout

## Phase 5: Additional Features

- [x] Implement search functionality with results display
- [x] Create contact form with validation
- [x] Set up email functionality with Nodemailer
- [x] Implement animations and transitions
- [x] Add back-to-top button functionality

## Phase 6: Third-party Integrations

- [x] Integrate Tawk.to chat
- [x] Set up Google Tag Manager
- [x] Configure Osano for cookie consent
- [ ] Implement any other third-party services

## Phase 7: Testing and Optimization

- [x] Test on various devices and browsers
- [ ] Implement performance optimizations:
  - [ ] Implement critical CSS loading
  - [ ] Add responsive image optimization
  - [ ] Implement font loading strategies
  - [x] Add base64 URL encoding utilities
- [x] Ensure proper responsive behavior
- [x] Optimize images and assets
- [ ] Implement proper caching strategies

## Phase 8: Deployment

- [ ] Configure deployment to Netlify or Vercel
- [ ] Set up CI/CD pipeline
- [ ] Configure environment variables
- [ ] Set up proper redirects and headers

## Technical Decisions

1. **Styling Approach**: 
   - Use Tailwind CSS for utility-first styling
   - Incorporate shadcn/ui for clean, ready-made components where appropriate
   - Maintain the same visual design as the original site

2. **State Management**:
   - Use React hooks for local state management
   - Use SWR for data fetching and caching

3. **Image Handling**:
   - Use Next.js Image component for optimized images
   - Implement proper loading strategies (eager for above-the-fold, lazy for below)
   - Maintain the thumbnails-first approach

4. **API Strategy**:
   - Create API routes to replace PHP endpoints
   - Use server components for initial data loading
   - Use client components for interactive elements

## Special Considerations

1. **Thumbnails-First Approach**:
   - When a category is opened, only thumbnails are initially shown
   - Clicking on a thumbnail displays the main carousel view
   - Search functionality follows this pattern with thumbnails shown first

2. **MBNA_2025 Category Special Handling**:
   - Uses PNG files by default
   - Skips cache busting
   - Requires special conditions in the API routes

3. **Email Functionality**:
   - Implement reliable email service with Nodemailer
   - Use SMTP authentication for Gmail
   - Send payment confirmations to da@theangelstones.com
   - Implement proper error handling and logging

## Excluded Components

As requested, the CRM folder will be excluded from this migration and will be handled separately.

## Completed Features

1. **Core Structure**:
   - Layout components (Header, Footer)
   - All main sections (Hero, About, Products, Featured Products, Projects, Why Choose, Contact, Variety)
   - Responsive design with mobile adaptations

2. **Navigation**:
   - Desktop navigation menu with proper links
   - Mobile menu with slide-in animation
   - Smooth scrolling to sections

3. **Search Functionality**:
   - Implemented `/api/search` endpoint
   - Created SearchBar component with expandable design
   - Added search results display with product thumbnails
   - Integrated search in both desktop and mobile layouts

4. **Third-party Integrations**:
   - Tawk.to live chat with the proper widget ID from original site
   - Google Tag Manager with proper configuration
   - Osano cookie consent manager

5. **API Endpoints**:
   - Product categories listing
   - Products by category
   - Search functionality
   - Image delivery with optimization
   - Contact form submission with Nodemailer

6. **Features and Functionality**:
   - Homepage with all sections - Hero, About, Products, Featured Products, Projects, Why Choose Us, Contact, Variety
   - Product browsing
     - Category listing
     - Product listing by category
     - Product detail view (modal)
     - Enhanced navigation UX with floating navigation bar for mobile
     - Improved category switching without scrolling back to top

7. **Performance Optimizations**:
   - JavaScript optimization
     - Memoized components with React.memo to prevent unnecessary re-renders
     - useCallback for event handlers to reduce memory allocation
     - useMemo for expensive computations and complex JSX
     - Throttled scroll events using requestAnimationFrame
     - Improved state updates to minimize re-renders
   - Image optimization
     - Responsive image sizing with appropriate 'sizes' attributes
     - Prioritized loading for above-the-fold content
     - Lazy loading for below-the-fold images
     - WebP format support in next.config.js
     - Custom fallback handling for image loading errors
   - Resource delivery optimization
     - Configured proper cache headers for static assets
     - Split code into smaller chunks for faster loading
     - Optimized bundle sizes with better webpack configuration

## Performance Optimization Roadmap

Based on Lighthouse diagnostics, the following optimizations should be implemented to improve performance scores:

### 1. JavaScript Execution Time (6.9s)

- [ ] **Code Splitting Improvements**
  - [ ] Use `next/dynamic` for non-critical components
  - [ ] Implement dynamic imports with Suspense boundaries
  - [ ] Split large components into smaller, more focused ones

- [ ] **Main Thread Optimization**
  - [ ] Implement web workers for heavy data processing
  - [ ] Move complex calculations off main thread
  - [ ] Add LongTask performance monitoring

- [ ] **Event Handler Optimization**
  - [ ] Apply more aggressive throttling to scroll events
  - [ ] Use `passive: true` for all scroll listeners
  - [ ] Debounce resize handlers and other frequent events

- [ ] **Runtime Performance**
  - [ ] Analyze and refactor components with excessive re-renders
  - [ ] Use React DevTools Profiler to identify problematic components
  - [ ] Implement useMemo for expensive calculations

### 2. Reduce Unused JavaScript (389 KiB)

- [ ] **Bundle Optimization**
  - [ ] Add webpack-bundle-analyzer to identify large packages
  - [ ] Replace large libraries with smaller alternatives
  - [ ] Implement tree-shaking for all dependencies

- [ ] **Audit Dependencies**
  - [ ] Remove unused npm packages
  - [ ] Use partial imports for large libraries (e.g., lodash-es)
  - [ ] Consider replacing moment.js with date-fns or Temporal API

- [ ] **Route-Based Code Splitting**
  - [ ] Ensure proper Next.js page-level code splitting
  - [ ] Prefetch critical routes on hover
  - [ ] Implement module/nomodule pattern for browser compatibility

### 3. Server Optimizations (HTTP/2)

- [ ] **HTTP/2 Implementation**
  - [ ] Deploy with Vercel or Netlify (both support HTTP/2 by default)
  - [ ] If using custom server, ensure HTTP/2 is enabled
  - [ ] Update server response headers for optimal caching

- [ ] **API Optimization**
  - [ ] Consolidate multiple API requests into fewer calls
  - [ ] Implement request batching
  - [ ] Consider GraphQL for more efficient data loading

### 4. Render-Blocking Resources (150ms)

- [ ] **CSS Optimization**
  - [ ] Extract and inline critical CSS for above-the-fold content
  - [ ] Use media queries to load desktop/mobile specific styles
  - [ ] Defer non-critical CSS loading

- [ ] **Font Loading**
  - [ ] Optimize font loading with font-display: swap
  - [ ] Preload critical fonts
  - [ ] Consider variable fonts for fewer font assets

### 5. Third-Party Code Impact (1,130ms)

- [ ] **Third-Party Script Management**
  - [ ] Audit and remove unnecessary third-party scripts
  - [ ] Implement facades for heavy third-party components (chat, analytics)
  - [ ] Load third-party scripts after page becomes interactive

- [ ] **Self-Hosting**
  - [ ] Self-host critical fonts and common libraries
  - [ ] Use resource hints (preconnect, dns-prefetch) for third-parties
  - [ ] Implement privacy-focused analytics alternatives

### 6. DOM Size Optimization (863 elements)

- [ ] **DOM Reduction**
  - [ ] Review and reduce unnecessary DOM nesting
  - [ ] Use devtools to identify deeply nested structures
  - [ ] Simplify component markup and CSS

- [ ] **Virtualization**
  - [ ] Implement react-window or react-virtualized for long lists
  - [ ] Only render visible content for product galleries
  - [ ] Use pagination instead of infinite scroll where appropriate

### 7. Back/Forward Cache Optimization

- [ ] **Fix bfcache Issues**
  - [ ] Remove unload event listeners
  - [ ] Handle page lifecycle events properly
  - [ ] Test back/forward navigation in different browsers

### Implementation Priority

**High Impact (Implement First):**
1. Code splitting for JS execution time reduction
2. Extract critical CSS to eliminate render-blocking resources
3. Optimize third-party loading with facades

**Medium Impact:**
1. HTTP/2 configuration
2. DOM size reduction
3. Bundle optimization to reduce unused JavaScript

**Nice-to-have:**
1. Web workers for heavy processing
2. Advanced caching strategies
3. Deep dependency auditing

This roadmap should be implemented incrementally, with performance testing after each major change to measure improvement.

## Remaining High-Priority Tasks

1. Add special handling for the MBNA_2025 category
2. Continue WebP image optimization
