const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkCountyStudios() {
  console.log('🔍 Checking East Sussex and Essex studios...\n');

  // Check East Sussex studios
  console.log('📍 EAST SUSSEX STUDIOS:');
  console.log('=====================\n');

  const { data: eastSussexStudios, error: eastSussexError } = await supabase
    .from('pilates_studios')
    .select('id, name, city, address')
    .eq('county', 'East Sussex')
    .eq('is_active', true)
    .order('city');

  if (eastSussexStudios && eastSussexStudios.length > 0) {
    // Group by city
    const eastSussexByCities = eastSussexStudios.reduce((acc, studio) => {
      if (!acc[studio.city]) acc[studio.city] = [];
      acc[studio.city].push(studio);
      return acc;
    }, {});

    console.log(`Total East Sussex studios: ${eastSussexStudios.length}\n`);
    console.log('By City:');
    Object.keys(eastSussexByCities).sort().forEach(city => {
      console.log(`\n${city}: ${eastSussexByCities[city].length} studios`);
      eastSussexByCities[city].forEach(studio => {
        console.log(`  - ${studio.name}`);
      });
    });
  } else {
    console.log('❌ No East Sussex studios found');
  }

  console.log('\n\n📍 ESSEX STUDIOS:');
  console.log('================\n');

  // Check Essex studios
  const { data: essexStudios, error: essexError } = await supabase
    .from('pilates_studios')
    .select('id, name, city, address')
    .eq('county', 'Essex')
    .eq('is_active', true)
    .order('city');

  if (essexStudios && essexStudios.length > 0) {
    // Group by city
    const essexByCities = essexStudios.reduce((acc, studio) => {
      if (!acc[studio.city]) acc[studio.city] = [];
      acc[studio.city].push(studio);
      return acc;
    }, {});

    console.log(`Total Essex studios: ${essexStudios.length}\n`);
    console.log('By City:');
    Object.keys(essexByCities).sort().forEach(city => {
      console.log(`\n${city}: ${essexByCities[city].length} studios`);
      essexByCities[city].forEach(studio => {
        console.log(`  - ${studio.name}`);
      });
    });
  } else {
    console.log('❌ No Essex studios found');
  }

  // Check public_locations table
  console.log('\n\n📊 PUBLIC LOCATIONS TABLE:');
  console.log('==========================\n');

  // Check East Sussex locations
  const { data: eastSussexLocations, error: eastSussexLocError } = await supabase
    .from('public_locations')
    .select('*')
    .eq('county_slug', 'east-sussex')
    .order('name');

  console.log('\nEast Sussex Public Locations:');
  if (eastSussexLocations && eastSussexLocations.length > 0) {
    eastSussexLocations.forEach(loc => {
      console.log(`  ${loc.name}: ${loc.studio_count} studios`);
    });
  } else {
    console.log('  ❌ No East Sussex locations in public_locations table');
  }

  // Check Essex locations
  const { data: essexLocations, error: essexLocError } = await supabase
    .from('public_locations')
    .select('*')
    .eq('county_slug', 'essex')
    .order('name');

  console.log('\nEssex Public Locations:');
  if (essexLocations && essexLocations.length > 0) {
    essexLocations.forEach(loc => {
      console.log(`  ${loc.name}: ${loc.studio_count} studios`);
    });
  } else {
    console.log('  ❌ No Essex locations in public_locations table');
  }
}

checkCountyStudios().catch(console.error);