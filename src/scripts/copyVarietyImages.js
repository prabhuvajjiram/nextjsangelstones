/**
 * Script to specifically copy variety images from the original project
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');

// Define source and destination paths
const sourceBase = path.join('c:', 'Users', 'prabh', 'newangelstones1123', 'newangelstones', 'images');
const destBase = path.join('c:', 'Users', 'prabh', 'newangelstones1123', 'angel-granites-nextjs', 'angelgranites', 'public', 'images');

// Ensure the varieties directory exists
const varietiesDir = path.join(destBase, 'varieties');
if (!fs.existsSync(varietiesDir)) {
  fs.mkdirSync(varietiesDir, { recursive: true });
  console.log(`Created varieties directory: ${varietiesDir}`);
}

// List of variety images to copy
const varietyImages = [
  'blue-pearl.jpg',
  'absolute-black.jpg',
  'dakota-mahogany.jpg',
  'bahama-blue.jpg',
  'imperial-red.jpg',
  'emerald-pearl.jpg'
];

// Copy each variety image
let copiedCount = 0;

console.log('Starting variety image copy process...');
console.log('-------------------------------------');

// First try to copy from the original varieties directory
varietyImages.forEach(image => {
  const sourcePath = path.join(sourceBase, 'varieties', image);
  const destPath = path.join(varietiesDir, image);
  
  // Check if source file exists
  if (fs.existsSync(sourcePath)) {
    try {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`Copied: ${sourcePath} -> ${destPath}`);
      copiedCount++;
    } catch (err) {
      console.error(`Error copying ${sourcePath}: ${err.message}`);
    }
  } else {
    console.log(`Source file not found: ${sourcePath}`);
    
    // Try to find the image in other directories
    console.log(`Searching for ${image} in other directories...`);
    
    // Check in the main images directory
    const mainSourcePath = path.join(sourceBase, image);
    if (fs.existsSync(mainSourcePath)) {
      try {
        fs.copyFileSync(mainSourcePath, destPath);
        console.log(`Copied from main directory: ${mainSourcePath} -> ${destPath}`);
        copiedCount++;
      } catch (err) {
        console.error(`Error copying ${mainSourcePath}: ${err.message}`);
      }
    } else {
      // If not found, create a placeholder file
      console.log(`Image not found in any directory. Creating placeholder for: ${image}`);
      
      // Create a simple text file as placeholder
      fs.writeFileSync(destPath, `Placeholder for ${image}`);
      console.log(`Created placeholder: ${destPath}`);
    }
  }
});

console.log('\n-------------------------------------');
console.log(`Total variety images copied/created: ${copiedCount}`);
console.log('Variety image copy process complete!');
