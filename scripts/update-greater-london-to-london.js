const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY);

async function updateGreaterLondonToLondon() {
  console.log('🔄 Updating Greater London to London across database...\n');

  // 1. Update public_locations table - county entry
  console.log('📍 Updating county entry in public_locations...');
  const { error: countyError } = await supabase
    .from('public_locations')
    .update({
      name: 'London',
      slug: 'london',
      county_slug: 'london',
      full_path: 'london',
      updated_at: new Date().toISOString()
    })
    .eq('slug', 'greater-london')
    .eq('type', 'county');

  if (countyError) {
    console.error('❌ Error updating county:', countyError);
    return;
  }
  console.log('✅ Updated county from Greater London to London');

  // 2. Update public_locations table - borough entries
  console.log('\n📍 Updating borough entries in public_locations...');
  const { data: boroughs, error: fetchError } = await supabase
    .from('public_locations')
    .select('*')
    .eq('county_slug', 'greater-london')
    .eq('type', 'city');

  if (fetchError) {
    console.error('❌ Error fetching boroughs:', fetchError);
    return;
  }

  console.log(`Found ${boroughs.length} boroughs to update`);

  for (const borough of boroughs) {
    const newFullPath = borough.full_path.replace('greater-london/', 'london/');

    const { error: boroughError } = await supabase
      .from('public_locations')
      .update({
        county_slug: 'london',
        full_path: newFullPath,
        updated_at: new Date().toISOString()
      })
      .eq('id', borough.id);

    if (boroughError) {
      console.error(`❌ Error updating ${borough.name}:`, boroughError);
    } else {
      console.log(`  ✅ Updated ${borough.name} paths`);
    }
  }

  // 3. Update pilates_studios table
  console.log('\n🏃 Updating pilates studios...');
  const { data: studios, error: studiosError } = await supabase
    .from('pilates_studios')
    .select('*')
    .eq('county', 'Greater London');

  if (studiosError) {
    console.error('❌ Error fetching studios:', studiosError);
    return;
  }

  console.log(`Found ${studios.length} studios to update`);

  for (const studio of studios) {
    const newFullPath = studio.full_url_path.replace('greater-london/', 'london/');

    const { error: studioError } = await supabase
      .from('pilates_studios')
      .update({
        county: 'London',
        county_slug: 'london',
        full_url_path: newFullPath,
        updated_at: new Date().toISOString()
      })
      .eq('id', studio.id);

    if (studioError) {
      console.error(`❌ Error updating studio ${studio.name}:`, studioError);
    } else {
      console.log(`  ✅ Updated ${studio.name}`);
    }
  }

  console.log('\n📊 Summary:');
  console.log('✅ Updated county name from "Greater London" to "London"');
  console.log('✅ Updated county slug from "greater-london" to "london"');
  console.log(`✅ Updated ${boroughs.length} borough location paths`);
  console.log(`✅ Updated ${studios.length} studio records`);
  console.log('✅ All URL paths updated from greater-london/ to london/');

  console.log('\n🎉 Greater London to London update complete!');
}

updateGreaterLondonToLondon().catch(console.error);