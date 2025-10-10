const fs = require('fs');
const path = require('path');

// Files to update
const filesToUpdate = [
  'generate-extended-recipe-images.js',
  'generate-apricot-recipe-images.js'
];

function updateImageScript(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace all 'easy-' prefixes in the slug keys
    content = content.replace(/'easy-([a-z-]+)':/g, "'$1':");

    // Update any references to easy- slugs in comments
    content = content.replace(/easy-([a-z-]+)/g, '$1');

    fs.writeFileSync(filePath, content);
    console.log(`✅ Updated ${path.basename(filePath)}`);

  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
}

function updateImageScripts() {
  console.log('🔄 Updating image generation scripts to remove "easy-" prefixes...\n');

  filesToUpdate.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      updateImageScript(filePath);
    } else {
      console.log(`⚠️ File not found: ${file}`);
    }
  });

  console.log('\n✅ All image generation scripts updated!');
}

updateImageScripts();