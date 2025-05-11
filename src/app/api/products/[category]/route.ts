import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface RouteContext {
  params: Promise<{ category: string }>;
}

async function getProductImages(category: string) {
  const categoryValue = category.trim();
  const publicDir = path.join(process.cwd(), 'public');
  const imagesDir = path.join(publicDir, 'images');
  const categoryDir = path.join(imagesDir, 'products', categoryValue);
  
  console.log('API Route - Category directory path:', categoryDir);

  if (!fs.existsSync(categoryDir)) {
    console.error(`API Route - Category directory not found: ${categoryDir}`);
    return NextResponse.json({ 
      error: 'Category not found',
      searchedPath: categoryDir 
    }, { status: 404 });
  }

  const files = fs.readdirSync(categoryDir);
  console.log(`API Route - Found ${files.length} files in category ${categoryValue}`);
  
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const images = files
    .filter(file => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext);
    })
    .map(file => {
      const relativePath = path.join('products', categoryValue, file).replace(/\\/g, '/');
      return {
        name: file,
        path: `/images/${relativePath}`
      };
    });
  
  console.log(`API Route - Returning ${images.length} images for category ${categoryValue}`);
  return NextResponse.json({ images });
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { category } = await context.params;
    
    if (!category) {
      console.error('API Route - Category is required but was not provided');
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    return await getProductImages(category);
  } catch (error) {
    console.error('API Route - Error fetching product images:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch product images',
      message: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
