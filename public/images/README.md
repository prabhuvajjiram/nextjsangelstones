# Angel Granites Image Directory Structure

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
