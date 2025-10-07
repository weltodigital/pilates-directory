const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function verifyBedfordshireCleanup() {
  console.log('✅ VERIFYING BEDFORDSHIRE CLEANUP\n');

  // Check current Bedfordshire structure
  const { data: locations, error: locationsError } = await supabase
    .from('public_locations')
    .select('*')
    .or('slug.eq.bedfordshire,county_slug.eq.bedfordshire')
    .order('type', { ascending: true })
    .order('butcher_count', { ascending: false });

  if (locationsError) {
    console.error('❌ Error fetching locations:', locationsError);
    return;
  }

  console.log('📊 CURRENT BEDFORDSHIRE STRUCTURE:\n');

  const county = locations?.find(l => l.type === 'county');
  const cities = locations?.filter(l => l.type === 'city' || l.type === 'town') || [];

  if (county) {
    console.log(`🏛️ ${county.name} (County)`);
    console.log(`   Total Studios: ${county.butcher_count}`);
    console.log(`   Cities/Towns: ${cities.length}`);
    console.log('');
  }

  console.log('🏘️ CITIES/TOWNS WITH STUDIOS:');
  cities.forEach((city, index) => {
    console.log(`   ${index + 1}. ${city.name}: ${city.butcher_count} studios`);
    console.log(`      Slug: ${city.slug}`);
    console.log(`      Full Path: ${city.full_path}`);
    console.log('');
  });

  // Verify that removed locations are indeed gone
  const removedSlugs = ['potton', 'sandy', 'shefford'];
  console.log('🔍 VERIFYING REMOVED LOCATIONS:');

  for (const slug of removedSlugs) {
    const { data: removedLocation, error } = await supabase
      .from('public_locations')
      .select('*')
      .eq('slug', slug)
      .eq('county_slug', 'bedfordshire');

    if (removedLocation && removedLocation.length > 0) {
      console.log(`   ❌ ${slug}: Still exists (removal failed)`);
    } else {
      console.log(`   ✅ ${slug}: Successfully removed`);
    }
  }

  // Check if there are any other counties with empty locations to clean up
  console.log('\\n🔍 CHECKING OTHER COUNTIES FOR EMPTY LOCATIONS:');

  const { data: allEmptyLocations, error: emptyError } = await supabase
    .from('public_locations')
    .select('name, slug, county_slug, type, butcher_count')
    .in('type', ['city', 'town'])
    .or('butcher_count.eq.0,butcher_count.is.null')
    .order('county_slug')
    .order('name');

  if (emptyError) {
    console.log('   ❌ Error checking empty locations');
  } else if (allEmptyLocations && allEmptyLocations.length > 0) {
    const countiesByEmpty = {};
    allEmptyLocations.forEach(loc => {
      if (!countiesByEmpty[loc.county_slug]) {
        countiesByEmpty[loc.county_slug] = [];
      }
      countiesByEmpty[loc.county_slug].push(loc);
    });

    Object.entries(countiesByEmpty).forEach(([county, locs]) => {
      console.log(`   📍 ${county}: ${locs.length} empty locations`);
      locs.slice(0, 3).forEach(loc => {
        console.log(`      - ${loc.name}`);
      });
      if (locs.length > 3) {
        console.log(`      ... and ${locs.length - 3} more`);
      }
    });
  } else {
    console.log('   ✅ No empty locations found in other counties');
  }

  console.log('\\n📈 SUMMARY:');
  console.log(`   Bedfordshire County: ${county?.butcher_count || 0} total studios`);
  console.log(`   Active Cities/Towns: ${cities.length}`);
  console.log(`   Removed Empty Locations: ${removedSlugs.length}`);
  console.log('\\n🎉 Bedfordshire cleanup verification completed!');
}

// Run the verification
verifyBedfordshireCleanup()
  .then(() => {
    console.log('\\n✨ Verification completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Verification failed:', error);
    process.exit(1);
  });