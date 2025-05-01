# Angel Granites - Next.js Migration Plan

This document outlines the step-by-step plan for migrating the Angel Granites website from its current PHP/HTML implementation to a modern Next.js application with Tailwind CSS.

## Migration Overview

The migration will convert the current PHP/HTML-based website to a modern React-based Next.js application while maintaining the same look, feel, and functionality. We'll use Tailwind CSS for styling and incorporate shadcn/ui for clean, ready-made components where appropriate.

## Phase 1: Project Setup and Configuration

- [x] Create a new Next.js project with TypeScript
- [x] Configure Tailwind CSS
- [x] Set up proper font loading with Next.js
- [x] Configure metadata and SEO settings
- [ ] Set up directory structure for components, pages, and API routes
- [ ] Install necessary dependencies

## Phase 2: Core Components and Layout

- [ ] Create reusable layout components (Header, Footer, Layout)
- [ ] Implement responsive navigation with mobile menu
- [ ] Create section components for the homepage
- [ ] Implement the hero section with video background
- [ ] Set up basic page routing

## Phase 3: API Implementation

- [ ] Create API routes to replace PHP endpoints:
  - [ ] `/api/products` - Get all product categories
  - [ ] `/api/products/[category]` - Get products in a specific category
  - [ ] `/api/search` - Search functionality
  - [ ] `/api/image` - Image serving with optimization
- [ ] Implement file system operations for product listings
- [ ] Set up proper error handling and response formatting

## Phase 4: Product Gallery Implementation

- [ ] Implement the "thumbnails first" approach for product galleries
- [ ] Create reusable product thumbnail and viewer components
- [ ] Implement fullscreen view with navigation
- [ ] Add special handling for the MBNA_2025 category (PNG files, no cache busting)
- [ ] Implement horizontally scrollable thumbnails layout

## Phase 5: Additional Features

- [ ] Implement search functionality with results display
- [ ] Create contact form with validation
- [ ] Set up email functionality with Nodemailer
- [ ] Implement animations and transitions
- [ ] Add back-to-top button functionality

## Phase 6: Third-party Integrations

- [ ] Integrate Tawk.to chat
- [ ] Set up Google Tag Manager
- [ ] Configure Osano for cookie consent
- [ ] Implement any other third-party services

## Phase 7: Testing and Optimization

- [ ] Test on various devices and browsers
- [ ] Implement performance optimizations
- [ ] Ensure proper responsive behavior
- [ ] Optimize images and assets
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
