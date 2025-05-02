import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * GET handler for /api/products/[category]
 * Returns all images in a specific product category
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    // Await the params Promise to get the actual category value
    const { category } = await params;
    
    if (!category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    const categoryValue = category.trim();
    const publicDir = path.join(process.cwd(), 'public');
    const imagesDir = path.join(publicDir, 'images');
    
    // The correct path is in products/{category}
    const categoryDir = path.join(imagesDir, 'products', categoryValue);

    // Check if the directory exists
    if (!fs.existsSync(categoryDir)) {
      console.error(`Category directory not found: ${categoryDir}`);
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Read the directory and get all image files
    const files = fs.readdirSync(categoryDir);
    
    // Filter for image files and create response objects
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const images = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return imageExtensions.includes(ext);
      })
      .map(file => {
        // Use forward slashes for web paths
        const relativePath = path.join('products', categoryValue, file).replace(/\\/g, '/');
        return {
          name: file,
          // Ensure the path uses forward slashes for web URLs
          path: `/images/${relativePath}`
        };
      });

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error fetching product images:', error);
    return NextResponse.json({ error: 'Failed to fetch product images' }, { status: 500 });
  }
}
