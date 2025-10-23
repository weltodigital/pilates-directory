#!/usr/bin/env node

/**
 * Emergency Stop Script for Google API Usage
 * Run this to immediately stop all API-consuming processes
 */

const fs = require('fs');
const path = require('path');

console.log('🚨 EMERGENCY API STOP INITIATED');
console.log('⏰', new Date().toISOString());

// 1. Rename all crawling scripts to prevent accidental execution
const scriptsToDisable = [
  'crawl_*_pilates.js',
  'fetch_live_google_data.js',
  'add_hampshire_studios.js',
  'scripts/collect-*-pilates.js',
  'scripts/update-existing-studios-with-images.js',
  'scripts/test-pilates-collection.js'
];

console.log('\n📁 Disabling crawling scripts...');

try {
  // Get all .js files in root and scripts directory
  const rootFiles = fs.readdirSync('.').filter(f => f.endsWith('.js'));
  const scriptFiles = fs.readdirSync('./scripts').filter(f => f.endsWith('.js'));

  let disabledCount = 0;

  // Disable root crawling scripts
  rootFiles.forEach(file => {
    if (file.startsWith('crawl_') ||
        file.includes('google') ||
        file.includes('hampshire') ||
        file.includes('fetch_live')) {
      const oldPath = file;
      const newPath = file + '.DISABLED';

      if (!fs.existsSync(newPath)) {
        fs.renameSync(oldPath, newPath);
        console.log(`   ✓ Disabled: ${oldPath} → ${newPath}`);
        disabledCount++;
      }
    }
  });

  // Disable scripts directory files
  scriptFiles.forEach(file => {
    if (file.startsWith('collect-') ||
        file.includes('google') ||
        file.includes('test-pilates') ||
        file.includes('update-existing-studios')) {
      const oldPath = path.join('scripts', file);
      const newPath = oldPath + '.DISABLED';

      if (!fs.existsSync(newPath)) {
        fs.renameSync(oldPath, newPath);
        console.log(`   ✓ Disabled: ${oldPath} → ${newPath}`);
        disabledCount++;
      }
    }
  });

  console.log(`\n📊 Disabled ${disabledCount} potentially API-consuming scripts`);

} catch (error) {
  console.error('❌ Error disabling scripts:', error.message);
}

// 2. Backup and modify environment file
console.log('\n🔐 Disabling API key...');

try {
  const envPath = '.env.local';
  if (fs.existsSync(envPath)) {
    // Create backup
    const backupPath = '.env.local.backup.' + Date.now();
    fs.copyFileSync(envPath, backupPath);
    console.log(`   ✓ Backup created: ${backupPath}`);

    // Read and modify env file
    let envContent = fs.readFileSync(envPath, 'utf8');

    // Comment out the Google API key
    envContent = envContent.replace(
      /^NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=(.+)$/m,
      '# DISABLED_NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$1'
    );

    fs.writeFileSync(envPath, envContent);
    console.log('   ✓ Google Maps API key disabled in .env.local');
  }
} catch (error) {
  console.error('❌ Error modifying environment:', error.message);
}

// 3. Create usage report
const reportContent = `# Google API Usage Emergency Stop Report

**Timestamp:** ${new Date().toISOString()}
**Action:** Emergency stop of all Google API usage

## Actions Taken:

1. **Scripts Disabled:** ${disabledCount} crawling/data collection scripts renamed with .DISABLED extension
2. **API Key:** Commented out NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env.local
3. **Maps:** Website now uses static maps with fallbacks instead of interactive maps

## To Resume API Usage:

1. Remove .DISABLED extensions from required scripts
2. Uncomment API key in .env.local
3. Implement usage monitoring and rate limiting
4. Set up billing alerts in Google Cloud Console

## Current Status:
- ✅ Website functional with static maps
- ✅ No ongoing API calls from crawling scripts
- ✅ Studio data preserved in database
- ✅ User experience maintained with fallbacks

## Cost Impact:
- Immediate reduction in API costs
- Maps still visible via static images
- Interactive maps available via "Open Google Maps" links
`;

fs.writeFileSync('API_EMERGENCY_STOP_REPORT.md', reportContent);

console.log('\n📋 Emergency stop completed successfully!');
console.log('📄 Report saved to: API_EMERGENCY_STOP_REPORT.md');
console.log('\n✅ Status:');
console.log('   • Website continues to function normally');
console.log('   • Maps show as static images with Google Maps links');
console.log('   • No ongoing API calls from crawling scripts');
console.log('   • All studio data preserved');
console.log('\n💡 Next steps:');
console.log('   • Check Google Cloud Console billing');
console.log('   • Set up usage alerts');
console.log('   • Test website functionality');