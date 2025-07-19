const fs = require('fs');
const path = require('path');

const esmTempDir = path.join(process.cwd(), 'dist', 'esm-temp');
const distDir = path.join(process.cwd(), 'dist');

console.log(`Starting ES module rename from ${esmTempDir} to ${distDir}`);

if (!fs.existsSync(esmTempDir)) {
  console.log(`No ES module temporary directory found at ${esmTempDir}. Skipping rename.`);
  process.exit(0);
}

function processDirectory(currentSourceDir) {
  const items = fs.readdirSync(currentSourceDir);

  for (const item of items) {
    const sourcePath = path.join(currentSourceDir, item);
    const stat = fs.statSync(sourcePath);

    if (stat.isDirectory()) {
      processDirectory(sourcePath); // Recurse into subdirectories
    } else if (stat.isFile() && item.endsWith('.js')) {
      const relativePathFromTemp = path.relative(esmTempDir, sourcePath);
      const newFileName = relativePathFromTemp.replace(/\.js$/, '.mjs');
      const targetPath = path.join(distDir, newFileName);

      // Ensure the target directory exists
      const targetDir = path.dirname(targetPath);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      fs.renameSync(sourcePath, targetPath);
      console.log(`Moved and renamed: ${path.relative(process.cwd(), sourcePath)} -> ${path.relative(process.cwd(), targetPath)}`);
    }
  }
}

try {
  processDirectory(esmTempDir);
  console.log('ES module renaming complete.');
} catch (error) {
  console.error('Error during ES module renaming:', error);
  process.exit(1);
}