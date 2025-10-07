/**
 * Fix Bedfordshire Counties
 * Fixes the missing Bedfordshire data that got split incorrectly
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixBedfordshireCounties() {
  console.log('🔧 Fixing Bedfordshire county data...\n');

  // Get all studios to see what's happening with Bedfordshire
  const { data: studios, error: studiosError } = await supabase
    .from('pilates_studios')
    .select('id, name, county, county_slug, city, city_slug')
    .eq('is_active', true)
    .order('county, city, name');

  if (studiosError) {
    console.error('❌ Error fetching studios:', studiosError);
    return;
  }

  console.log(`📋 Current studio distribution by county:`);
  const countsByCounty = {};
  studios.forEach(studio => {
    if (studio.county_slug) {
      countsByCounty[studio.county_slug] = countsByCounty[studio.county_slug] || [];
      countsByCounty[studio.county_slug].push({
        name: studio.name,
        city: studio.city,
        city_slug: studio.city_slug
      });
    }
  });

  Object.keys(countsByCounty).forEach(countySlug => {
    console.log(`   ${countySlug}: ${countsByCounty[countySlug].length} studios`);
  });

  // Fix Bedford county issue (should be part of Bedfordshire)
  console.log(`\n🔧 Fixing Bedford county -> Bedfordshire...`);
  const { error: updateBedfordError } = await supabase
    .from('pilates_studios')
    .update({
      county: 'Bedfordshire',
      county_slug: 'bedfordshire'
    })
    .eq('county_slug', 'bedford');

  if (updateBedfordError) {
    console.error('❌ Error updating Bedford studios:', updateBedfordError);
    return;
  }

  // Fix Central Bedfordshire -> Bedfordshire
  console.log(`🔧 Fixing Central Bedfordshire -> Bedfordshire...`);
  const { error: updateCentralBedfordshireError } = await supabase
    .from('pilates_studios')
    .update({
      county: 'Bedfordshire',
      county_slug: 'bedfordshire'
    })
    .eq('county_slug', 'central-bedfordshire');

  if (updateCentralBedfordshireError) {
    console.error('❌ Error updating Central Bedfordshire studios:', updateCentralBedfordshireError);
    return;
  }

  console.log('✅ Updated studio counties');

  // Now update the public_locations table with correct counts
  console.log(`\n📊 Recalculating location counts...`);

  // Get fresh studio data
  const { data: updatedStudios, error: updatedStudiosError } = await supabase
    .from('pilates_studios')
    .select('county_slug, city_slug')
    .eq('is_active', true);

  if (updatedStudiosError) {
    console.error('❌ Error fetching updated studios:', updatedStudiosError);
    return;
  }

  // Count studios by location
  const studioCountsByCounty = {};
  const studioCountsByCity = {};

  updatedStudios.forEach(studio => {
    if (studio.county_slug) {
      studioCountsByCounty[studio.county_slug] = (studioCountsByCounty[studio.county_slug] || 0) + 1;
    }
    if (studio.county_slug && studio.city_slug) {
      const cityKey = `${studio.county_slug}/${studio.city_slug}`;
      studioCountsByCity[cityKey] = (studioCountsByCity[cityKey] || 0) + 1;
    }
  });

  // Update county counts
  console.log(`🔄 Updating county counts...`);
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
  console.log(`\n🔄 Updating city counts...`);
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
      if (updatedCities <= 10) { // Show first 10 updates
        console.log(`   ✅ ${cityKey}: ${count} studios`);
      }
    }
  }

  if (updatedCities > 10) {
    console.log(`   ... and ${updatedCities - 10} more cities updated`);
  }

  console.log(`\n🎉 Bedfordshire county data fixed!`);
  console.log(`📊 Updated counts:`);
  Object.keys(studioCountsByCounty).sort((a, b) => studioCountsByCounty[b] - studioCountsByCounty[a]).forEach(county => {
    console.log(`   ${county}: ${studioCountsByCounty[county]} studios`);
  });
}

// Run the script
fixBedfordshireCounties().catch(console.error);