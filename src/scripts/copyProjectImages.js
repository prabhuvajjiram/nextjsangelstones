/**
 * Script to specifically copy project images from the original project
 */

const fs = require('fs');
const path = require('path');

// Define source and destination paths
const sourceBase = path.join('c:', 'Users', 'prabh', 'newangelstones1123', 'newangelstones', 'images');
const destBase = path.join('c:', 'Users', 'prabh', 'newangelstones1123', 'angel-granites-nextjs', 'angelgranites', 'public', 'images');

// Ensure the projects directory exists
const projectsDir = path.join(destBase, 'projects');
if (!fs.existsSync(projectsDir)) {
  fs.mkdirSync(projectsDir, { recursive: true });
  console.log(`Created projects directory: ${projectsDir}`);
}

// List of project images to copy
const projectImages = [
  // Granite monuments projects
  { source: path.join(sourceBase, 'granite-monuments-project01.png'), dest: path.join(destBase, 'granite-monuments-project01.png') },
  { source: path.join(sourceBase, 'granite-monuments-project02.png'), dest: path.join(destBase, 'granite-monuments-project02.png') },
  { source: path.join(sourceBase, 'granite-monuments-project03.png'), dest: path.join(destBase, 'granite-monuments-project03.png') },
  
  // Granite slabs projects
  { source: path.join(sourceBase, 'granite-slabs-project01.png'), dest: path.join(destBase, 'granite-slabs-project01.png') },
  { source: path.join(sourceBase, 'granite-slabs-project02.png'), dest: path.join(destBase, 'granite-slabs-project02.png') },
  { source: path.join(sourceBase, 'granite-slabs-project03.png'), dest: path.join(destBase, 'granite-slabs-project03.png') },
  
  // Customized designs projects
  { source: path.join(sourceBase, 'customized-designs-project01.png'), dest: path.join(destBase, 'customized-designs-project01.png') },
  { source: path.join(sourceBase, 'customized-designs-project02.png'), dest: path.join(destBase, 'customized-designs-project02.png') },
  { source: path.join(sourceBase, 'customized-designs-project03.png'), dest: path.join(destBase, 'customized-designs-project03.png') },
  
  // Also copy to projects directory for consistency
  { source: path.join(sourceBase, 'granite-monuments-project01.png'), dest: path.join(projectsDir, 'project1.jpg') },
  { source: path.join(sourceBase, 'granite-monuments-project02.png'), dest: path.join(projectsDir, 'project2.jpg') },
  { source: path.join(sourceBase, 'granite-monuments-project03.png'), dest: path.join(projectsDir, 'project3.jpg') },
  { source: path.join(sourceBase, 'granite-slabs-project01.png'), dest: path.join(projectsDir, 'project4.jpg') },
  { source: path.join(sourceBase, 'granite-slabs-project02.png'), dest: path.join(projectsDir, 'project5.jpg') },
  { source: path.join(sourceBase, 'granite-slabs-project03.png'), dest: path.join(projectsDir, 'project6.jpg') },
  
  // Workshop image
  { source: path.join(sourceBase, 'Factory.png'), dest: path.join(destBase, 'workshop.jpg') },
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

// Copy each project image
let copiedCount = 0;

console.log('Starting project image copy process...');
console.log('-------------------------------------');

for (const mapping of projectImages) {
  if (copyFile(mapping.source, mapping.dest)) {
    copiedCount++;
  }
}

console.log('\n-------------------------------------');
console.log(`Total project images copied: ${copiedCount}`);
console.log('Project image copy process complete!');
