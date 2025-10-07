const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function analyzeStudioLocations() {
  console.log('🔍 ANALYZING STUDIO LOCATIONS VS ADDRESSES\n');

  // Get all studios in Bedfordshire area first (since that's where the issues were)
  const { data: bedfordshireStudios } = await supabase
    .from('pilates_studios')
    .select('id, name, address, full_url_path')
    .like('full_url_path', 'bedfordshire/%')
    .order('full_url_path');

  console.log(`📊 Found ${bedfordshireStudios?.length || 0} studios in Bedfordshire\n`);

  // Group by URL city (second part of path)
  const locationGroups = {};
  bedfordshireStudios?.forEach(studio => {
    const pathParts = studio.full_url_path.split('/');
    const urlCity = pathParts[1]; // bedfordshire/[CITY]/studio

    if (!locationGroups[urlCity]) {
      locationGroups[urlCity] = [];
    }
    locationGroups[urlCity].push(studio);
  });

  console.log('=== STUDIOS BY URL LOCATION ===\n');

  const potentialMismatches = [];

  Object.keys(locationGroups).sort().forEach(city => {
    console.log(`📍 ${city.toUpperCase()} (${locationGroups[city].length} studios):`);

    locationGroups[city].forEach(studio => {
      const addressParts = studio.address.split(',').map(p => p.trim());

      console.log(`  - ${studio.name}`);
      console.log(`    Address: ${studio.address}`);
      console.log(`    URL city: ${city}`);

      // Check for potential mismatch
      const addressLower = studio.address.toLowerCase();
      const urlCityLower = city.toLowerCase();

      if (!addressLower.includes(urlCityLower)) {
        console.log(`    ⚠️  POTENTIAL MISMATCH: Address doesn't contain URL city '${city}'`);
        potentialMismatches.push({
          studio: studio.name,
          address: studio.address,
          urlCity: city,
          fullPath: studio.full_url_path
        });
      }
      console.log('');
    });
    console.log('');
  });

  // Check for duplicates by name
  console.log('=== CHECKING FOR DUPLICATES ===\n');
  const nameGroups = {};
  bedfordshireStudios?.forEach(studio => {
    const nameLower = studio.name.toLowerCase().trim();
    if (!nameGroups[nameLower]) {
      nameGroups[nameLower] = [];
    }
    nameGroups[nameLower].push(studio);
  });

  const duplicates = Object.keys(nameGroups).filter(name => nameGroups[name].length > 1);

  if (duplicates.length > 0) {
    console.log(`🚨 Found ${duplicates.length} potential duplicate names:\n`);
    duplicates.forEach(name => {
      console.log(`📝 "${name}" appears ${nameGroups[name].length} times:`);
      nameGroups[name].forEach(studio => {
        console.log(`  - ${studio.full_url_path} | ${studio.address}`);
      });
      console.log('');
    });
  } else {
    console.log('✅ No duplicate studio names found in Bedfordshire');
  }

  // Summary of potential issues
  console.log('=== SUMMARY OF POTENTIAL ISSUES ===\n');
  console.log(`🔍 Total studios analyzed: ${bedfordshireStudios?.length || 0}`);
  console.log(`⚠️  Potential location mismatches: ${potentialMismatches.length}`);
  console.log(`🚨 Duplicate names: ${duplicates.length}`);

  if (potentialMismatches.length > 0) {
    console.log('\n📋 Studios that may be in wrong location pages:');
    potentialMismatches.forEach((mismatch, index) => {
      console.log(`${index + 1}. ${mismatch.studio}`);
      console.log(`   Address: ${mismatch.address}`);
      console.log(`   Currently in: ${mismatch.urlCity} page`);
      console.log(`   Full path: ${mismatch.fullPath}\n`);
    });
  }
}

// Run the script
analyzeStudioLocations()
  .then(() => {
    console.log('\n✨ Analysis completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Analysis failed:', error);
    process.exit(1);
  });