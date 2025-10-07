const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function findAllDuplicates() {
  console.log('🔍 COMPREHENSIVE DUPLICATE SEARCH ACROSS ALL LOCATIONS\n');

  // Get ALL studios
  const { data: allStudios } = await supabase
    .from('pilates_studios')
    .select('id, name, address, full_url_path, google_rating, images')
    .order('name');

  console.log(`📊 Total studios in database: ${allStudios?.length || 0}\n`);

  // Function to normalize text for comparison
  const normalize = (text) => {
    return text
      .toLowerCase()
      .replace(/[.,\-'""]/g, '')
      .replace(/\s+/g, ' ')
      .replace(/&/g, 'and')
      .replace(/ltd|limited/g, '')
      .replace(/pilates/g, '')
      .trim();
  };

  // Group by normalized name
  const nameGroups = {};
  allStudios?.forEach(studio => {
    const normalizedName = normalize(studio.name);
    if (!nameGroups[normalizedName]) {
      nameGroups[normalizedName] = [];
    }
    nameGroups[normalizedName].push(studio);
  });

  const duplicateNames = Object.keys(nameGroups).filter(name => nameGroups[name].length > 1);

  console.log(`🚨 Found ${duplicateNames.length} studio names with multiple entries:\n`);

  const allDuplicates = [];

  duplicateNames.forEach((name, index) => {
    const studios = nameGroups[name];
    console.log(`${index + 1}. "${name}" (${studios.length} entries):`);

    studios.forEach(studio => {
      console.log(`   - ID: ${studio.id}`);
      console.log(`     Name: ${studio.name}`);
      console.log(`     Address: ${studio.address}`);
      console.log(`     Path: ${studio.full_url_path}`);
      console.log(`     Rating: ${studio.google_rating || 'N/A'}`);
      console.log(`     Images: ${studio.images?.length || 0}`);
      console.log('');
    });

    // Check if they're truly duplicates (same address too)
    const addressGroups = {};
    studios.forEach(studio => {
      const normalizedAddress = normalize(studio.address);
      if (!addressGroups[normalizedAddress]) {
        addressGroups[normalizedAddress] = [];
      }
      addressGroups[normalizedAddress].push(studio);
    });

    const trueDuplicates = Object.values(addressGroups).filter(group => group.length > 1);

    if (trueDuplicates.length > 0) {
      console.log(`   🎯 TRUE DUPLICATES (same name + address): ${trueDuplicates.length} groups`);
      trueDuplicates.forEach((group, groupIndex) => {
        console.log(`      Group ${groupIndex + 1}: ${group.length} duplicates`);
        group.forEach(studio => {
          console.log(`         - ${studio.full_url_path} (ID: ${studio.id})`);
        });
        allDuplicates.push(group);
      });
    } else {
      console.log(`   ✅ Different addresses - not true duplicates`);
    }
    console.log('');
  });

  // Group by similar addresses (same studios in different locations)
  console.log('🔍 CHECKING FOR SAME STUDIOS IN MULTIPLE LOCATIONS:\n');

  const addressGroups = {};
  allStudios?.forEach(studio => {
    const normalizedAddress = normalize(studio.address);
    if (!addressGroups[normalizedAddress]) {
      addressGroups[normalizedAddress] = [];
    }
    addressGroups[normalizedAddress].push(studio);
  });

  const duplicateAddresses = Object.keys(addressGroups).filter(addr => addressGroups[addr].length > 1);

  duplicateAddresses.forEach((addr, index) => {
    const studios = addressGroups[addr];
    console.log(`${index + 1}. Same address in multiple locations (${studios.length} entries):`);
    console.log(`   Address: "${addr}"`);

    studios.forEach(studio => {
      console.log(`   - ${studio.name} -> ${studio.full_url_path}`);
    });
    console.log('');
  });

  // Summary
  console.log('📈 SUMMARY:');
  console.log(`   📝 Studio names with multiple entries: ${duplicateNames.length}`);
  console.log(`   🎯 True duplicate groups found: ${allDuplicates.length}`);
  console.log(`   📍 Same addresses in multiple locations: ${duplicateAddresses.length}`);

  let totalDuplicateStudios = 0;
  allDuplicates.forEach(group => {
    totalDuplicateStudios += group.length - 1; // Subtract 1 to keep one original
  });

  console.log(`   🗑️  Studios that should be removed: ${totalDuplicateStudios}`);

  return {
    allDuplicates,
    duplicateAddresses: duplicateAddresses.map(addr => addressGroups[addr])
  };
}

// Run the script
findAllDuplicates()
  .then((results) => {
    console.log('\n✨ Duplicate search completed!');
    if (results.allDuplicates.length > 0 || results.duplicateAddresses.length > 0) {
      console.log('\n⚠️  Duplicates found! Run the cleanup script to remove them.');
    } else {
      console.log('\n✅ No duplicates found!');
    }
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Search failed:', error);
    process.exit(1);
  });