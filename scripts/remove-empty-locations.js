const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY);

async function removeEmptyLocations() {
  console.log('🧹 Removing locations with 0 studios...\n');

  // Find all locations with 0 studios
  const { data: emptyLocations, error: fetchError } = await supabase
    .from('public_locations')
    .select('*')
    .eq('butcher_count', 0)
    .order('county_slug')
    .order('name');

  if (fetchError) {
    console.error('❌ Error fetching locations:', fetchError);
    return;
  }

  if (!emptyLocations || emptyLocations.length === 0) {
    console.log('✅ No empty locations found!');
    return;
  }

  console.log(`Found ${emptyLocations.length} locations with 0 studios:\n`);

  // Group by county for better visibility
  const byCounty = {};
  emptyLocations.forEach(loc => {
    if (!byCounty[loc.county_slug]) {
      byCounty[loc.county_slug] = [];
    }
    byCounty[loc.county_slug].push(loc.name);
  });

  console.log('Locations to remove by county:');
  Object.entries(byCounty).forEach(([county, cities]) => {
    console.log(`\n${county}:`);
    cities.forEach(city => console.log(`  - ${city}`));
  });

  console.log('\n🗑️ Removing empty locations from database...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const location of emptyLocations) {
    const { error: deleteError } = await supabase
      .from('public_locations')
      .delete()
      .eq('id', location.id);

    if (deleteError) {
      errorCount++;
    } else {
      successCount++;
    }
  }

  console.log('\n📊 Summary:');
  console.log(`✅ Successfully removed: ${successCount} locations`);
  console.log(`❌ Failed to remove: ${errorCount} locations`);
  console.log(`📍 Total processed: ${emptyLocations.length} locations`);
}

removeEmptyLocations().catch(console.error);