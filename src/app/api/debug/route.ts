import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const publicDir = path.join(process.cwd(), 'public');
    const productsDir = path.join(publicDir, 'images', 'products');
    
    // Check if products directory exists
    if (!fs.existsSync(productsDir)) {
      return NextResponse.json({ 
        error: 'Products directory not found',
        checkedPath: productsDir
      }, { status: 404 });
    }
    
    // List all product categories
    const categories = fs.readdirSync(productsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => {
        const categoryPath = path.join(productsDir, dirent.name);
        const files = fs.readdirSync(categoryPath);
        const imageFiles = files.filter(file => {
          const ext = path.extname(file).toLowerCase();
          return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
        });
        
        return {
          name: dirent.name,
          path: categoryPath,
          imageCount: imageFiles.length,
          sampleImages: imageFiles.slice(0, 3)
        };
      });
    
    // Get the Next.js app structure
    const appDir = path.join(process.cwd(), 'src', 'app');
    const appStructure = fs.existsSync(appDir) ? fs.readdirSync(appDir) : [];
    
    // Return comprehensive debug info
    return NextResponse.json({
      success: true,
      environment: {
        cwd: process.cwd(),
        nodeEnv: process.env.NODE_ENV,
        nextVersion: process.env.NEXT_RUNTIME
      },
      productsDirectory: {
        path: productsDir,
        exists: fs.existsSync(productsDir)
      },
      categories,
      appStructure,
      apiRoutes: {
        productsApiExists: fs.existsSync(path.join(appDir, 'api', 'products')),
        categoryApiExists: fs.existsSync(path.join(appDir, 'api', 'products', '[category]'))
      }
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({ 
      error: 'Debug endpoint error',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
