const fs = require('fs');
const path = require('path');

// Function to recursively traverse the directory and collect file paths
function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);

    // Add filters to exclude specific files, file types, and folders
    const excludeFiles = [
      'package-lock.json',
      'script.js',
      '.DS_Store'
    ];
    const excludeFileTypes = [
      '.ico',
      '.png',
      '.webp',
      '.woff'
    ];
    const excludeFolders = [
      'figma',
      'coverage',
      '.swc',
      '.next',
      'node_modules',
      '.git'
    ];

    // Check if the current file or folder should be excluded
    if (
      excludeFiles.includes(file) ||
      excludeFileTypes.includes(path.extname(file)) ||
      excludeFolders.includes(file)
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
  const fileArray = getAllFiles(dirPath);

  fileArray.forEach((file) => {
    const fileContents = fs.readFileSync(file, 'utf8');
    // Add the file path and name on top of the file content
    const contentToAdd = `File: ${file}\n${fileContents}\n\n`; // Add extra new line for separation
    fs.appendFileSync(outputPath, contentToAdd, 'utf8');
  });
}

// Define the directory to traverse and the output file path
const directoryPath = path.resolve(__dirname, '');
const outputFilePath = path.resolve(__dirname, 'text.txt');

 // Call the function to concatenate files
concatenateFiles(directoryPath, outputFilePath);

console.log(`All files concatenated into ${outputFilePath}`);
