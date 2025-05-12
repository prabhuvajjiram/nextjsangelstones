import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

// Function to get directory files (similar to the PHP implementation)
function getDirectoryFiles(directory: string) {
  try {
    // Check if the directory exists
    if (!fs.existsSync(directory)) {
      return { error: 'Directory not found' };
    }

    // Get all files and directories
    const items = fs.readdirSync(directory, { withFileTypes: true });
    
    // Filter directories only
    const directories = items
      .filter(item => item.isDirectory())
      .map(dir => {
        const dirPath = path.join(directory, dir.name);
        const files = fs.readdirSync(dirPath)
          .filter(file => {
            // Filter image files only
            const ext = path.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext);
          });
        
        return {
          name: dir.name,
          path: `/products/${dir.name}`,
          count: files.length,
          thumbnail: files.length > 0 
            ? `/api/image?path=${encodeURIComponent(path.join(dir.name, files[0]))}&timestamp=${Date.now()}`
            : null
        };
      })
      .filter(dir => dir.count > 0); // Only include directories with images
    
    return { directories };
  } catch (error) {
    console.error('Error reading directory:', error);
    return { error: 'Failed to read directory' };
  }
}

export async function GET() {
  // Base directory for products (this will need to be adjusted based on your actual file structure)
  const baseDir = path.join(process.cwd(), 'public', 'images', 'products');
  
  const result = getDirectoryFiles(baseDir);
  
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 404 });
  }
  
  return NextResponse.json(result.directories);
}
