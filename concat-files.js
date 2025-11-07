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
      '.env.production.local',
      '.config.js'
    ];
    
    const excludeFileTypes = [
      '.cjs',
      '.ico',
      '.png',
      '.webp',
      '.woff',
      '.jpg',
      '.svg',
      '.gif',
      '.mp4',
      '.mp3',
      '.wav',
      '.ogg',
      '.webm',
      '.css',
      '.txt',
      // '.md'
    ];
    
    // Simple folder names to exclude
    const excludeFolders = [
      'figma',
      'coverage',
      '.swc',
      '.next',
      'node_modules',
      '.git',
      '.husky',
      '.vscode'
      // 'misc',
      // 'components',
      // 'hooks',
      // 'lib',
      // 'services',
      // 'stores',
      // 'types'
    ];

    // Path patterns to exclude (can be specific paths like 'components/ui')
    const excludePaths = [
      // 'components/ui',
      'components/drupal',
      'components/alerts',
      'components/hooks',
      'components/forms',
      'components/common',
      'components/layout',
      'components/navigation',
      'components/user',
      // 'services/__tests__'
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

// Function to read the contents of all files and split into multiple output files
function concatenateFiles(dirPath, outputBasePath) {
  const fileArray = getAllFiles(dirPath);
  const filesPerOutput = 80;
  let currentFileIndex = 0;
  let currentOutputNumber = 1;

  fileArray.forEach((file, index) => {
    // Determine the current output file name
    const outputPath = outputBasePath.replace('.txt', `-${currentOutputNumber}.txt`);

    // Clear the output file if it's the first file for this output
    if (currentFileIndex === 0) {
      fs.writeFileSync(outputPath, '', 'utf8');
    }

    const fileContents = fs.readFileSync(file, 'utf8');
    // Add the file path and name on top of the file content
    const contentToAdd = `File: ${file}\n${fileContents}\n\n`; // Add extra new line for separation
    fs.appendFileSync(outputPath, contentToAdd, 'utf8');

    currentFileIndex++;

    // Check if we've reached the limit for the current output file
    if (currentFileIndex >= filesPerOutput && index < fileArray.length - 1) {
      console.log(`Created ${outputPath} with ${currentFileIndex} files`);
      currentFileIndex = 0;
      currentOutputNumber++;
    }
  });

  // Log the last file created
  const lastOutputPath = outputBasePath.replace('.txt', `-${currentOutputNumber}.txt`);
  console.log(`Created ${lastOutputPath} with ${currentFileIndex} files`);
  console.log(`Total files collected: ${fileArray.length}`);
  console.log(`Total output files created: ${currentOutputNumber}`);
}

// Define the directory to traverse and the output file path
const directoryPath = path.resolve(__dirname, '');
const outputFilePath = path.resolve(__dirname, 'files.txt');

// Call the function to concatenate files
concatenateFiles(directoryPath, outputFilePath);
console.log(`All files concatenated into multiple output files`);
