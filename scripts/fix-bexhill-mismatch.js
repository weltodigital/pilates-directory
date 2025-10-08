const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function fixBexhillMismatch() {
  console.log('🔧 Fixing Bexhill-on-Sea city name mismatch...\n');

  // Find studios with city "Bexhill"
  const { data: studios, error: fetchError } = await supabase
    .from('pilates_studios')
    .select('*')
    .eq('city', 'Bexhill')
    .eq('county', 'East Sussex');

  if (fetchError) {
    console.error('Error fetching studios:', fetchError);
    return;
  }

  console.log(`Found ${studios.length} studios with city "Bexhill":`);
  studios.forEach(studio => {
    console.log(`  - ${studio.name}`);
  });

  console.log('\nUpdating to "Bexhill-on-Sea"...\n');

  for (const studio of studios) {
    const { error: updateError } = await supabase
      .from('pilates_studios')
      .update({
        city: 'Bexhill-on-Sea',
        city_slug: 'bexhill-on-sea',
        full_url_path: studio.full_url_path.replace('bexhill/', 'bexhill-on-sea/'),
        updated_at: new Date().toISOString()
      })
      .eq('id', studio.id);

    if (updateError) {
      console.error(`❌ Error updating ${studio.name}:`, updateError);
    } else {
      console.log(`✅ Updated ${studio.name}`);
    }
  }

  // Now update the public_locations count
  const { data: updatedStudios } = await supabase
    .from('pilates_studios')
    .select('id')
    .eq('city', 'Bexhill-on-Sea')
    .eq('county', 'East Sussex')
    .eq('is_active', true);

  const count = updatedStudios?.length || 0;

  const { error: countError } = await supabase
    .from('public_locations')
    .update({
      butcher_count: count,
      updated_at: new Date().toISOString()
    })
    .eq('slug', 'bexhill-on-sea')
    .eq('county_slug', 'east-sussex');

  if (countError) {
    console.error('\n❌ Error updating location count:', countError);
  } else {
    console.log(`\n✅ Updated Bexhill-on-Sea location count to ${count} studios`);
  }

  console.log('\n✨ Bexhill-on-Sea fix complete!');
}

fixBexhillMismatch().catch(console.error);