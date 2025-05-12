/**
 * Comprehensive script to copy all images from the original project to the Next.js project
 * This maintains the exact same directory structure and image names
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');

// Define source and destination paths
const sourceBase = path.join('c:', 'Users', 'prabh', 'newangelstones1123', 'newangelstones');
const destBase = path.join('c:', 'Users', 'prabh', 'newangelstones1123', 'angel-granites-nextjs', 'angelgranites', 'public');

// Define the mapping of source directories to destination directories
const directoryMapping = [
  // Main images directory (flat structure)
  { source: path.join(sourceBase, 'images'), dest: path.join(destBase, 'images') },
  
  // Product categories
  { source: path.join(sourceBase, 'images', 'products', 'Benches'), dest: path.join(destBase, 'images', 'products', 'Benches') },
  { source: path.join(sourceBase, 'images', 'products', 'columbarium'), dest: path.join(destBase, 'images', 'products', 'columbarium') },
  { source: path.join(sourceBase, 'images', 'products', 'Designs'), dest: path.join(destBase, 'images', 'products', 'Designs') },
  { source: path.join(sourceBase, 'images', 'products', 'MBNA_2025'), dest: path.join(destBase, 'images', 'products', 'MBNA_2025') },
  { source: path.join(sourceBase, 'images', 'products', 'Monuments'), dest: path.join(destBase, 'images', 'products', 'Monuments') },
  
  // Other image directories
  { source: path.join(sourceBase, 'images', 'colors'), dest: path.join(destBase, 'images', 'varieties') },
  { source: path.join(sourceBase, 'images', 'webp', 'colors'), dest: path.join(destBase, 'images', 'varieties') },
];

// Special files mapping (specific files that need to be copied with renamed paths)
const specialFilesMapping = [
  // Logo files
  { source: path.join(sourceBase, 'images', 'logo.png'), dest: path.join(destBase, 'images', 'logo.png') },
  { source: path.join(sourceBase, 'images', 'logo02.png'), dest: path.join(destBase, 'images', 'logo-white.png') },
  { source: path.join(sourceBase, 'images', 'favicon.png'), dest: path.join(destBase, 'favicon.png') },
  
  // Hero/slider images
  { source: path.join(sourceBase, 'images', 'main-slider01.jpg'), dest: path.join(destBase, 'images', 'slider-1.jpg') },
  { source: path.join(sourceBase, 'images', 'main-slider02.jpg'), dest: path.join(destBase, 'images', 'slider-2.jpg') },
  { source: path.join(sourceBase, 'images', 'main-slider03.jpg'), dest: path.join(destBase, 'images', 'slider-3.jpg') },
  { source: path.join(sourceBase, 'images', 'main-slider04.jpg'), dest: path.join(destBase, 'images', 'slider-4.jpg') },
  
  // About section images
  { source: path.join(sourceBase, 'images', 'as-welcome.jpg'), dest: path.join(destBase, 'images', 'about-img.jpg') },
  { source: path.join(sourceBase, 'images', 'Factory.png'), dest: path.join(destBase, 'images', 'about-img2.jpg') },
  
  // Signature
  { source: path.join(sourceBase, 'images', 'AG-396.png'), dest: path.join(destBase, 'images', 'signature.png') },
];

/**
 * Copy a file from source to destination
 */
function copyFile(source, dest) {
  try {
    if (!fs.existsSync(source)) {
      console.log(`Source file does not exist: ${source}`);
      return false;
    }
    
    // Create destination directory if it doesn't exist
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
      console.log(`Created destination directory: ${destDir}`);
    }
    
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
      // Skip specific directories we don't want to copy recursively
      if (['products', 'webp', 'optimized', 'visualizer', 'promotions'].includes(file)) {
        continue;
      }
      
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

// First copy special files
console.log('\nCopying special files:');
for (const mapping of specialFilesMapping) {
  if (copyFile(mapping.source, mapping.dest)) {
    totalCopied++;
  }
}

// Then copy directory mappings
for (const mapping of directoryMapping) {
  console.log(`\nCopying from ${mapping.source} to ${mapping.dest}`);
  const copied = copyImagesInDirectory(mapping.source, mapping.dest);
  totalCopied += copied;
  console.log(`Copied ${copied} images`);
}

console.log('\n--------------------------------');
console.log(`Total images copied: ${totalCopied}`);
console.log('Image copy process complete!');

// Create any missing variety images with placeholders
const varietyImages = [
  'blue-pearl.jpg',
  'absolute-black.jpg',
  'dakota-mahogany.jpg',
  'bahama-blue.jpg',
  'imperial-red.jpg',
  'emerald-pearl.jpg'
];

console.log('\nChecking for missing variety images...');
const varietiesDir = path.join(destBase, 'images', 'varieties');

for (const image of varietyImages) {
  const imagePath = path.join(varietiesDir, image);
  if (!fs.existsSync(imagePath)) {
    console.log(`Creating placeholder for missing variety image: ${image}`);
    
    // Try to find a matching image with a different case
    const files = fs.readdirSync(varietiesDir);
    let found = false;
    
    for (const file of files) {
      if (file.toLowerCase() === image.toLowerCase()) {
        console.log(`Found matching image with different case: ${file}`);
        copyFile(path.join(varietiesDir, file), imagePath);
        found = true;
        break;
      }
    }
    
    if (!found) {
      // Create a simple text file as placeholder
      fs.writeFileSync(imagePath, `Placeholder for ${image}`);
      console.log(`Created placeholder: ${imagePath}`);
    }
  }
}
