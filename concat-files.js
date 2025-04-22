const fs = require('fs');
const path = require('path');

// Function to recursively traverse the directory and collect file paths
function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const relativePath = path.relative(__dirname, filePath);

    // Add filters to exclude specific files, file types, and folders
    const excludeFiles = [
      'package-lock.json',
      'script.js',
      '.DS_Store',
      '.env.local',
      '.config.js'
    ];
    
    const excludeFileTypes = [
      '.cjs',
      '.ico',
      '.png',
      '.webp',
      '.woff',
      '.css',
      '.txt',
      '.md'
    ];
    
    // Simple folder names to exclude
    const excludeFolders = [
      'figma',
      'coverage',
      '.swc',
      '.next',
      'node_modules',
      '.git',
      'misc',
    ];

    // Path patterns to exclude (can be specific paths like 'components/ui')
    const excludePaths = [
      'components/ui',
      'components/drupal',
      'components/alerts',
      'components/nodes',
      'components/hooks',
    ];

    // Check if the current file or folder should be excluded
    if (
      excludeFiles.includes(file) || 
      excludeFileTypes.includes(path.extname(file)) || 
      excludeFolders.includes(file) ||
      excludePaths.some(excludePath => relativePath.includes(excludePath))
    ) {
      return;
    }

    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

// Function to read the contents of all files and append to a single output file
function concatenateFiles(dirPath, outputPath) {
  // Clear the output file if it already exists
  if (fs.existsSync(outputPath)) {
    fs.writeFileSync(outputPath, '', 'utf8');
  }

  const fileArray = getAllFiles(dirPath);
  
  fileArray.forEach((file) => {
    const fileContents = fs.readFileSync(file, 'utf8');
    // Add the file path and name on top of the file content
    const contentToAdd = `File: ${file}\n${fileContents}\n\n`; // Add extra new line for separation
    fs.appendFileSync(outputPath, contentToAdd, 'utf8');
  });

  console.log(`Total files collected: ${fileArray.length}`);
}

// Define the directory to traverse and the output file path
const directoryPath = path.resolve(__dirname, '');
const outputFilePath = path.resolve(__dirname, 'files.txt');

// Call the function to concatenate files
concatenateFiles(directoryPath, outputFilePath);
console.log(`All files concatenated into ${outputFilePath}`);
