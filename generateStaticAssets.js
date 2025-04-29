const fs = require("fs");
const path = require("path");

// Define the folders to scan
const folders = ["assets", "css", "fonts", "js"];
const baseDir = __dirname; // Use __dirname directly
const staticAssets = [];

// Function to recursively scan directories
function scanDirectory(directory, basePath) {
  const files = fs.readdirSync(directory);
  files.forEach((file) => {
    const fullPath = path.join(directory, file);
    const relativePath = path.relative(basePath, fullPath).replace(/\\/g, "/");
    if (fs.statSync(fullPath).isDirectory()) {
      scanDirectory(fullPath, basePath);
    } else {
      staticAssets.push(`/${relativePath}`);
    }
  });
}

// Scan each folder
folders.forEach((folder) => {
  const folderPath = path.join(baseDir, folder);
  if (fs.existsSync(folderPath)) {
    scanDirectory(folderPath, baseDir);
  } else {
    console.warn(`Folder not found: ${folderPath}`);
  }
});

// Output the STATIC_ASSETS array
const output = `const STATIC_ASSETS = ${JSON.stringify(
  staticAssets,
  null,
  2
)};`;
console.log(output);

// Optionally, write the output to a file
fs.writeFileSync(path.join(baseDir, "staticAssets.js"), output);
