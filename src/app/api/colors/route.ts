import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

interface ColorImage {
  name: string;
  path: string;
  category: string;
}

export async function GET() {
  try {
    // Get the colors directory path
    const colorsDir = path.join(process.cwd(), 'public', 'images', 'colors');
    
    // Get all image files in the colors directory
    const files = fs.readdirSync(colorsDir);
    
    // Filter only image files
    const images = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext);
    });

    // Create color images data
    const colorImages: ColorImage[] = images.map(file => ({
      name: path.basename(file, path.extname(file)).replace(/-/g, ' '),
      path: file,
      category: 'colors'
    }));

    return NextResponse.json(colorImages);
  } catch (error) {
    console.error('Error fetching color images:', error);
    return NextResponse.json(
      { error: 'Failed to load color images. Please try again later.' },
      { status: 500 }
    );
  }
}
