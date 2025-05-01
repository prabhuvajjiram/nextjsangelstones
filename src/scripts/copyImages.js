/**
 * Script to help copy images from the original project to the Next.js project
 * This will maintain the same directory structure and image names
 */

const fs = require('fs');
const path = require('path');

// Define source and destination paths
const sourceBase = path.join('c:', 'Users', 'prabh', 'newangelstones1123', 'newangelstones');
const destBase = path.join('c:', 'Users', 'prabh', 'newangelstones1123', 'angel-granites-nextjs', 'angelgranites', 'public', 'images');

// Define the mapping of source directories to destination directories
const directoryMapping = [
  // Main images
  { source: path.join(sourceBase, 'images'), dest: path.join(destBase) },
  
  // Product categories
  { source: path.join(sourceBase, 'images', 'Benches'), dest: path.join(destBase, 'products', 'Benches') },
  { source: path.join(sourceBase, 'images', 'columbarium'), dest: path.join(destBase, 'products', 'columbarium') },
  { source: path.join(sourceBase, 'images', 'Designs'), dest: path.join(destBase, 'products', 'Designs') },
  { source: path.join(sourceBase, 'images', 'MBNA_2025'), dest: path.join(destBase, 'products', 'MBNA_2025') },
  { source: path.join(sourceBase, 'images', 'Monuments'), dest: path.join(destBase, 'products', 'Monuments') },
  
  // Other image directories
  { source: path.join(sourceBase, 'images', 'hero'), dest: path.join(destBase, 'hero') },
  { source: path.join(sourceBase, 'images', 'about'), dest: path.join(destBase, 'about') },
  { source: path.join(sourceBase, 'images', 'featured'), dest: path.join(destBase, 'featured') },
  { source: path.join(sourceBase, 'images', 'projects'), dest: path.join(destBase, 'projects') },
  { source: path.join(sourceBase, 'images', 'varieties'), dest: path.join(destBase, 'varieties') },
];

/**
 * Copy a file from source to destination
 */
function copyFile(source, dest) {
  try {
    fs.copyFileSync(source, dest);
    console.log(`Copied: ${source} -> ${dest}`);
    return true;
  } catch (err) {
    console.error(`Error copying ${source}: ${err.message}`);
    return false;
  }
}

/**
 * Copy all image files from source directory to destination directory
 */
function copyImagesInDirectory(sourceDir, destDir) {
  if (!fs.existsSync(sourceDir)) {
    console.log(`Source directory does not exist: ${sourceDir}`);
    return 0;
  }
  
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
    console.log(`Created destination directory: ${destDir}`);
  }
  
  const files = fs.readdirSync(sourceDir);
  let copiedCount = 0;
  
  for (const file of files) {
    const sourcePath = path.join(sourceDir, file);
    const destPath = path.join(destDir, file);
    
    const stats = fs.statSync(sourcePath);
    
    if (stats.isDirectory()) {
      // Recursively copy subdirectories
      const subDirCopiedCount = copyImagesInDirectory(sourcePath, destPath);
      copiedCount += subDirCopiedCount;
    } else {
      // Check if it's an image file
      const ext = path.extname(file).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'].includes(ext)) {
        if (copyFile(sourcePath, destPath)) {
          copiedCount++;
        }
      }
    }
  }
  
  return copiedCount;
}

// Execute the copy operation for each mapping
let totalCopied = 0;

console.log('Starting image copy process...');
console.log('--------------------------------');

for (const mapping of directoryMapping) {
  console.log(`\nCopying from ${mapping.source} to ${mapping.dest}`);
  const copied = copyImagesInDirectory(mapping.source, mapping.dest);
  totalCopied += copied;
  console.log(`Copied ${copied} images`);
}

console.log('\n--------------------------------');
console.log(`Total images copied: ${totalCopied}`);
console.log('Image copy process complete!');
