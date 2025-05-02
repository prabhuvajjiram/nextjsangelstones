import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

/**
 * Search API endpoint
 * Searches for products across all categories that match the query
 */
export async function GET(request: NextRequest) {
  try {
    // Get search query from URL parameters
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    
    if (!query || query.trim().length < 2) {
      return NextResponse.json({ 
        error: 'Search query must be at least 2 characters' 
      }, { status: 400 });
    }
    
    // Base directory for products
    const productsDir = path.join(process.cwd(), 'public', 'images', 'products');
    
    // Check if the directory exists
    if (!fs.existsSync(productsDir)) {
      return NextResponse.json({ 
        error: 'Products directory not found' 
      }, { status: 404 });
    }
    
    // Get all category directories
    const categories = fs.readdirSync(productsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    // Search for matching files in each category
    const results = [];
    const normalizedQuery = query.toLowerCase();
    
    for (const category of categories) {
      const categoryDir = path.join(productsDir, category);
      const files = fs.readdirSync(categoryDir)
        .filter(file => {
          // Filter image files only
          const ext = path.extname(file).toLowerCase();
          return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
        })
        .filter(file => {
          // Match the query against filename (without extension)
          const fileNameWithoutExt = path.basename(file, path.extname(file)).toLowerCase();
          return fileNameWithoutExt.includes(normalizedQuery);
        })
        .map(file => {
          // Create result object for each match
          const relativePath = path.join('products', category, file).replace(/\\/g, '/');
          return {
            name: path.basename(file, path.extname(file)),
            path: `/images/${relativePath}`,
            category: category,
            // Add a timestamp to prevent caching (except for MBNA_2025 category)
            thumbnail: `/api/image?path=${encodeURIComponent(path.join(category, file))}&timestamp=${
              category === 'MBNA_2025' ? '' : Date.now()
            }`
          };
        });
      
      results.push(...files);
    }
    
    // Return search results
    return NextResponse.json({
      query: query,
      count: results.length,
      results: results
    });
    
  } catch (error) {
    console.error('Error searching products:', error);
    return NextResponse.json({ 
      error: 'Failed to search products' 
    }, { status: 500 });
  }
}
