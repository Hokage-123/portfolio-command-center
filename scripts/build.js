const fs = require('fs');
const path = require('path');

// Ensure dist directory exists
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// Read the source HTML file
const srcHtml = fs.readFileSync('src/index.html', 'utf8');

// Replace the Tailwind CDN with our built CSS
const distHtml = srcHtml
  .replace(
    /<script src="https:\/\/cdn\.tailwindcss\.com"><\/script>/g,
    '<link rel="stylesheet" href="styles.css">'
  )
  .replace(
    /<script>\s*\/\/ Suppress Tailwind CDN warning for this single-file app[\s\S]*?<\/script>/g,
    ''
  );

// Write the processed HTML to dist
fs.writeFileSync('dist/index.html', distHtml);

console.log('✅ Build completed successfully!');
console.log('📁 Files generated:');
console.log('   - dist/index.html');
console.log('   - dist/styles.css');
console.log('🚀 Ready for production deployment!');
