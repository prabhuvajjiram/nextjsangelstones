import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

// Simple path sanitization function
function sanitizePath(path: string | null): string | null {
  if (!path) return null;
  
  // Remove any directory traversal sequences
  const sanitized = path
    .replace(/\.\.\//g, '') // Remove "../"
    .replace(/\.\.\\/g, '') // Remove "..\"
    .replace(/\/\.\.\//g, '/') // Remove "/../"
    .replace(/\\\.\.\\/g, '\\') // Remove "\..\"
    .replace(/^\/+/, '') // Remove leading slashes
    .replace(/^\\+/, ''); // Remove leading backslashes
  
  // Ensure the path doesn't start with a drive letter (Windows)
  if (/^[a-zA-Z]:/.test(sanitized)) {
    return null;
  }
  
  return sanitized;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imagePath = searchParams.get('path');
    const width = searchParams.get('width') ? parseInt(searchParams.get('width') as string, 10) : undefined;
    const height = searchParams.get('height') ? parseInt(searchParams.get('height') as string, 10) : undefined;
    const format = searchParams.get('format') || '';

    if (!imagePath) {
      return NextResponse.json({ error: 'Missing path parameter' }, { status: 400 });
    }

    // Sanitize the path to prevent directory traversal
    const sanitizedPath = sanitizePath(imagePath);
    if (!sanitizedPath) {
      return NextResponse.json({ error: 'Invalid path parameter' }, { status: 400 });
    }

    // Convert backslashes to forward slashes for consistency
    const normalizedPath = sanitizedPath.replace(/\\/g, '/');
    
    // Construct the full path to the image
    const fullPath = path.join(process.cwd(), 'public', 'images', normalizedPath);

    // Check if the file exists
    if (!fs.existsSync(fullPath)) {
      console.error(`Image not found: ${fullPath}`);
      
      // Try with products/ prefix if not found directly
      const productsPath = path.join(process.cwd(), 'public', 'images', 'products', normalizedPath);
      if (fs.existsSync(productsPath)) {
        console.log(`Found image in products directory: ${productsPath}`);
        return serveImage(productsPath, width, height, format);
      }
      
      // Return a placeholder image if available
      const placeholderPath = path.join(process.cwd(), 'public', 'images', 'placeholder.jpg');
      if (fs.existsSync(placeholderPath)) {
        console.log(`Using placeholder image for: ${imagePath}`);
        return serveImage(placeholderPath, width, height, format);
      }
      
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    return serveImage(fullPath, width, height, format);
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json({ error: 'Error processing image' }, { status: 500 });
  }
}

// Helper function to serve an image with optional processing
async function serveImage(
  filePath: string, 
  width?: number, 
  height?: number, 
  format?: string
) {
  // Read the file
  const imageBuffer = fs.readFileSync(filePath);

  // Determine content type based on file extension
  const ext = path.extname(filePath).toLowerCase();
  let contentType = 'image/jpeg'; // Default content type
  
  switch (ext) {
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
    case '.jpeg':
      contentType = 'image/jpeg';
      break;
    case '.gif':
      contentType = 'image/gif';
      break;
    case '.webp':
      contentType = 'image/webp';
      break;
    case '.svg':
      contentType = 'image/svg+xml';
      break;
  }

  // Process the image if width or height is specified, or format conversion is requested
  if (width || height || format) {
    let sharpInstance = sharp(imageBuffer);
    
    // Resize if width or height is specified
    if (width || height) {
      sharpInstance = sharpInstance.resize({
        width,
        height,
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      });
    }

    // Convert format if requested
    let outputBuffer;
    if (format === 'webp') {
      outputBuffer = await sharpInstance.webp({ quality: 80 }).toBuffer();
      contentType = 'image/webp';
    } else if (format === 'jpeg' || format === 'jpg') {
      outputBuffer = await sharpInstance.jpeg({ quality: 80 }).toBuffer();
      contentType = 'image/jpeg';
    } else if (format === 'png') {
      outputBuffer = await sharpInstance.png().toBuffer();
      contentType = 'image/png';
    } else {
      // If no specific format conversion is requested, just process with current format
      outputBuffer = await sharpInstance.toBuffer();
    }

    return new NextResponse(outputBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  }

  // Return the original image if no processing is needed
  return new NextResponse(imageBuffer, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  });
}
