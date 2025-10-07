/**
 * Final Location Cleanup
 * Fixes remaining location issues including Luton → Bedfordshire
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function finalLocationCleanup() {
  console.log('🧹 Final location cleanup...\n');

  // Fix Luton → Bedfordshire (Luton is actually in Bedfordshire)
  console.log('🔧 Moving Luton studios to Bedfordshire...');
  const { error: updateLutonError } = await supabase
    .from('pilates_studios')
    .update({
      county: 'Bedfordshire',
      county_slug: 'bedfordshire'
    })
    .eq('county_slug', 'luton');

  if (updateLutonError) {
    console.error('❌ Error updating Luton studios:', updateLutonError);
    return;
  }
  console.log('✅ Moved Luton studios to Bedfordshire');

  // Recalculate all counts
  console.log('\n📊 Recalculating final counts...');

  // Get all studios
  const { data: studios, error: studiosError } = await supabase
    .from('pilates_studios')
    .select('county_slug, city_slug')
    .eq('is_active', true);

  if (studiosError) {
    console.error('❌ Error fetching studios:', studiosError);
    return;
  }

  // Count studios by location
  const studioCountsByCounty = {};
  const studioCountsByCity = {};

  studios.forEach(studio => {
    if (studio.county_slug) {
      studioCountsByCounty[studio.county_slug] = (studioCountsByCounty[studio.county_slug] || 0) + 1;
    }
    if (studio.county_slug && studio.city_slug) {
      const cityKey = `${studio.county_slug}/${studio.city_slug}`;
      studioCountsByCity[cityKey] = (studioCountsByCity[cityKey] || 0) + 1;
    }
  });

  console.log('Final studio distribution:');
  Object.keys(studioCountsByCounty).sort((a, b) => studioCountsByCounty[b] - studioCountsByCounty[a]).forEach(county => {
    console.log(`   ${county}: ${studioCountsByCounty[county]} studios`);
  });

  // Reset all counts to 0 first
  console.log('\n🔄 Resetting all location counts to 0...');
  const { error: resetError } = await supabase
    .from('public_locations')
    .update({ butcher_count: 0 })
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (resetError) {
    console.error('❌ Error resetting counts:', resetError);
    return;
  }

  // Update county counts
  console.log('🔄 Updating county counts...');
  for (const [countySlug, count] of Object.entries(studioCountsByCounty)) {
    const { error: updateCountyError } = await supabase
      .from('public_locations')
      .update({ butcher_count: count })
      .eq('type', 'county')
      .eq('slug', countySlug);

    if (updateCountyError) {
      console.error(`❌ Error updating county ${countySlug}:`, updateCountyError);
    } else {
      console.log(`   ✅ ${countySlug}: ${count} studios`);
    }
  }

  // Update city counts
  console.log('\n🔄 Updating city counts...');
  let updatedCities = 0;
  for (const [cityKey, count] of Object.entries(studioCountsByCity)) {
    const [countySlug, citySlug] = cityKey.split('/');
    const { error: updateCityError } = await supabase
      .from('public_locations')
      .update({ butcher_count: count })
      .eq('type', 'city')
      .eq('county_slug', countySlug)
      .eq('slug', citySlug);

    if (updateCityError) {
      console.error(`❌ Error updating city ${cityKey}:`, updateCityError);
    } else {
      updatedCities++;
      if (count > 0 && updatedCities <= 15) { // Show first 15 cities with studios
        console.log(`   ✅ ${cityKey}: ${count} studios`);
      }
    }
  }

  const citiesWithStudios = Object.values(studioCountsByCity).filter(count => count > 0).length;
  console.log(`   ✅ Updated ${citiesWithStudios} cities with studios`);

  console.log(`\n🎉 Final cleanup complete!`);
  console.log(`📊 Summary:`);
  console.log(`   Total counties: 45 (all of England)`);
  console.log(`   Total towns/cities: 450`);
  console.log(`   Counties with studios: ${Object.keys(studioCountsByCounty).length}`);
  console.log(`   Cities with studios: ${citiesWithStudios}`);
  console.log(`   Total active studios: ${studios.length}`);
}

// Run the script
finalLocationCleanup().catch(console.error);