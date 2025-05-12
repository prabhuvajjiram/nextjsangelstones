/**
 * Script to set up the image directory structure for Angel Granites
 * This ensures we have the same structure as the original site for the "thumbnails-first" approach
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');

// Base directory for product images
const baseDir = path.join(process.cwd(), 'public', 'images');
const productsDir = path.join(baseDir, 'products');

// Create main image directories
const directories = [
  baseDir,
  productsDir,
  path.join(baseDir, 'hero'),
  path.join(baseDir, 'about'),
  path.join(baseDir, 'featured'),
  path.join(baseDir, 'projects'),
  path.join(baseDir, 'varieties')
];

// Product categories (based on the actual site)
const productCategories = [
  'Benches',
  'columbarium',
  'Designs',
  'MBNA_2025',
  'Monuments'
];

// Create all directories
directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  } else {
    console.log(`Directory already exists: ${dir}`);
  }
});

// Create product category directories
productCategories.forEach(category => {
  const categoryDir = path.join(productsDir, category);
  if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir, { recursive: true });
    console.log(`Created product category directory: ${categoryDir}`);
  } else {
    console.log(`Product category directory already exists: ${categoryDir}`);
  }
});

// Create a README file in the images directory with instructions
const readmeContent = `# Angel Granites Image Directory Structure

This directory contains all the images for the Angel Granites website.

## Directory Structure

- /images
  - /hero - Hero section images
  - /about - About section images
  - /featured - Featured products images
  - /projects - Project showcase images
  - /varieties - Granite variety images
  - /products - All product images organized by category
    - /Benches
    - /columbarium
    - /Designs
    - /MBNA_2025 (Special category with no cache busting)
    - /Monuments

## Image Handling

The site uses a "thumbnails-first" approach where thumbnails are loaded initially and full-size images are loaded when requested. This is handled by the API routes:

- /api/products - Lists all product categories
- /api/products/[category] - Lists all products in a category
- /api/image - Serves images with optional thumbnail generation

## Adding New Images

1. Place images in the appropriate category directory
2. Images will automatically be available through the API
3. For MBNA_2025 category, no cache busting is applied
4. Supported image formats: .jpg, .jpeg, .png, .gif

## Special Handling

The system will try alternative extensions if an image fails to load, in this order: .jpg, .jpeg, .png, .gif
`;

fs.writeFileSync(path.join(baseDir, 'README.md'), readmeContent);
console.log(`Created README file in ${baseDir}`);

console.log('\nImage directory structure setup complete!');
console.log('You can now add your product images to the respective category directories.');
