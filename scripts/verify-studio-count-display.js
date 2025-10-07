const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function verifyStudioCountDisplay() {
  console.log('✅ VERIFYING STUDIO COUNT DISPLAY ON PAGES\n');

  // Sample counties and cities to test
  const testLocations = [
    { slug: 'bedfordshire', type: 'county', name: 'Bedfordshire' },
    { slug: 'bedford', type: 'city', name: 'Bedford', county_slug: 'bedfordshire' },
    { slug: 'luton', type: 'city', name: 'Luton', county_slug: 'bedfordshire' },
    { slug: 'greater-manchester', type: 'county', name: 'Greater Manchester' },
    { slug: 'manchester', type: 'city', name: 'Manchester', county_slug: 'greater-manchester' },
    { slug: 'greater-london', type: 'county', name: 'Greater London' },
    { slug: 'london', type: 'city', name: 'London', county_slug: 'greater-london' }
  ];

  console.log('🧪 Testing studio count accuracy on sample pages:\n');

  for (const location of testLocations) {
    console.log(`📍 Testing ${location.name} (${location.type})`);

    try {
      // Get the location data from public_locations (what pages will show)
      const { data: locationData, error: locationError } = await supabase
        .from('public_locations')
        .select('butcher_count')
        .eq('slug', location.slug)
        .eq('type', location.type)
        .single();

      if (locationError || !locationData) {
        console.log(`   ❌ Location not found: ${locationError?.message || 'No data'}`);
        continue;
      }

      // Count actual studios
      let actualCount = 0;
      if (location.type === 'county') {
        const { data: studios, error: studiosError } = await supabase
          .from('pilates_studios')
          .select('id')
          .eq('county_slug', location.slug)
          .eq('is_active', true);

        if (studiosError) {
          console.log(`   ❌ Error counting studios: ${studiosError.message}`);
          continue;
        }
        actualCount = studios?.length || 0;

      } else if (location.type === 'city') {
        const { data: studios, error: studiosError } = await supabase
          .from('pilates_studios')
          .select('id')
          .eq('city_slug', location.slug)
          .eq('county_slug', location.county_slug)
          .eq('is_active', true);

        if (studiosError) {
          console.log(`   ❌ Error counting studios: ${studiosError.message}`);
          continue;
        }
        actualCount = studios?.length || 0;
      }

      const displayedCount = locationData.butcher_count;

      if (actualCount === displayedCount) {
        console.log(`   ✅ CORRECT: Displaying ${displayedCount} studios (actual: ${actualCount})`);
      } else {
        console.log(`   ❌ MISMATCH: Displaying ${displayedCount} studios but actual is ${actualCount}`);
      }

      // For counties, also test a few of their cities
      if (location.type === 'county') {
        const { data: cities, error: citiesError } = await supabase
          .from('public_locations')
          .select('name, slug, butcher_count')
          .eq('county_slug', location.slug)
          .in('type', ['city', 'town'])
          .gt('butcher_count', 0)
          .limit(3);

        if (!citiesError && cities?.length > 0) {
          console.log(`   📋 Sample cities in ${location.name}:`);
          for (const city of cities) {
            console.log(`      ${city.name}: ${city.butcher_count} studios`);
          }
        }
      }

    } catch (err) {
      console.log(`   ❌ Error testing location: ${err.message}`);
    }

    console.log('');
  }

  // Summary stats
  const { data: allLocations } = await supabase
    .from('public_locations')
    .select('type, butcher_count');

  if (allLocations) {
    const counties = allLocations.filter(l => l.type === 'county');
    const cities = allLocations.filter(l => l.type === 'city' || l.type === 'town');

    const countiesWithStudios = counties.filter(l => l.butcher_count > 0);
    const citiesWithStudios = cities.filter(l => l.butcher_count > 0);

    console.log('📊 SUMMARY STATISTICS:');
    console.log(`   Counties total: ${counties.length}`);
    console.log(`   Counties with studios: ${countiesWithStudios.length}`);
    console.log(`   Cities/towns total: ${cities.length}`);
    console.log(`   Cities/towns with studios: ${citiesWithStudios.length}`);

    if (countiesWithStudios.length > 0) {
      const totalCountyStudios = countiesWithStudios.reduce((sum, c) => sum + (c.butcher_count || 0), 0);
      console.log(`   Total studios across counties: ${totalCountyStudios}`);
    }
  }
}

// Run the verification
verifyStudioCountDisplay()
  .then(() => {
    console.log('\n✨ Studio count verification completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Verification failed:', error);
    process.exit(1);
  });