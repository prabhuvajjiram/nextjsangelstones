# Angel Granites - Next.js Migration

This project is a Next.js migration of the Angel Granites website (angelgranites.com). The migration converts the original PHP/HTML implementation to a modern React-based Next.js application while maintaining the same look and functionality.

## Project Overview

Angel Granites is a leading granite monument manufacturer offering custom headstones, memorial stones, and cemetery monuments nationwide. This Next.js implementation provides a modern, performant, and maintainable codebase while preserving the user experience of the original site.

### Key Features

- **Product Showcase**: Displays granite products with a thumbnails-first approach
- **Search Functionality**: Allows users to search for products across categories
- **Responsive Design**: Optimized for all device sizes
- **Performance Optimization**: Fast loading with optimized images and code splitting
- **SEO Friendly**: Proper metadata and structured data for search engines

## Technology Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React hooks and context
- **Data Fetching**: SWR for client-side data fetching
- **Image Optimization**: Next.js Image component with Sharp.js
- **Form Handling**: React Hook Form with Zod validation
- **Email**: Nodemailer with SMTP authentication

##Future Plan,
## Try with STAPI 

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/angel-granites-nextjs.git
cd angel-granites-nextjs
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
├── public/               # Static assets
├── src/
│   ├── app/              # App router pages
│   │   ├── api/          # API routes
│   │   ├── products/     # Product pages
│   │   └── page.tsx      # Homepage
│   ├── components/       # React components
│   │   ├── layout/       # Layout components
│   │   ├── sections/     # Page sections
│   │   ├── ui/           # UI components
│   │   └── products/     # Product-related components
│   ├── lib/              # Utility functions
│   │   ├── hooks/        # Custom React hooks
│   │   └── utils/        # Helper functions
│   └── styles/           # Global styles
└── tailwind.config.js    # Tailwind CSS configuration
```

## API Endpoints

The application includes the following API endpoints:

1. **Products API**:
   - GET `/api/products` - Get all product categories
   - GET `/api/products/[category]` - Get products in a specific category

2. **Search API**:
   - GET `/api/search?query=[search_term]` - Search for products

3. **Image API**:
   - GET `/api/image?path=[image_path]` - Serve optimized images with caching

## Deployment

The application can be deployed to Netlify or Vercel for production use.

```bash
npm run build
npm run start
```

## Migration Notes

This project is a migration of the original Angel Granites website. The migration process is documented in the `MIGRATION-PLAN.md` file. The CRM functionality is not included in this migration and will be handled separately.

## Thumbnails-First Approach

The website implements a "thumbnails first" approach where:
- When a category is opened, only thumbnails are initially shown
- Clicking on a thumbnail displays the main carousel view
- Search functionality follows this pattern with thumbnails shown first

This approach reduces initial loading time and provides a better user experience by showing a grid of products before focusing on individual items.
