/**
 * Fix Durham City Studio Locations
 * Move studios with Durham city addresses from other cities to Durham
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

/**
 * Generate URL-friendly slug
 */
function generateSlug(name, city) {
  const combined = `${name} ${city}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return combined;
}

async function moveStudiosToDurham() {
  console.log('🚀 Starting Durham City Studio Location Fix');
  console.log('======================================\n');

  // Find studios with Durham city addresses that should be categorized as Durham city
  // First get all studios with Durham in address, then filter the specific ones
  const { data: allStudiosCandidates, error: findError } = await supabase
    .from('pilates_studios')
    .select('*')
    .eq('county', 'Durham')
    .neq('city', 'Durham')
    .ilike('address', '%Durham%')
    .eq('is_active', true);

  if (findError) {
    console.error('❌ Error finding studios:', findError);
    return;
  }

  // Filter for Durham city specific addresses
  const studios = allStudiosCandidates.filter(studio => {
    const address = studio.address.toLowerCase();
    return address.includes('durham dh1') ||
           address.includes('city, durham') ||
           address.includes('crossgate centre') ||
           address.includes('nevilles cross, durham');
  });

  if (!studios || studios.length === 0) {
    console.log('❌ No studios found to move');
    return;
  }

  console.log(`🔍 Found ${studios.length} studios to move to Durham:\n`);

  let successCount = 0;
  let failCount = 0;

  for (const studio of studios) {
    console.log(`🔄 Moving: ${studio.name}`);
    console.log(`   Address: ${studio.address}`);
    console.log(`   Current City: ${studio.city}`);

    try {
      // Calculate new slug values
      const newCitySlug = 'durham';
      const newFullUrlPath = `durham/${newCitySlug}/${generateSlug(studio.name, 'Durham')}`;

      // Update the studio
      const { error: updateError } = await supabase
        .from('pilates_studios')
        .update({
          city: 'Durham',
          city_slug: newCitySlug,
          full_url_path: newFullUrlPath,
          updated_at: new Date().toISOString()
        })
        .eq('id', studio.id);

      if (updateError) {
        console.log(`   ❌ Error updating studio: ${updateError.message}`);
        failCount++;
      } else {
        console.log(`   ✅ Successfully moved to Durham`);
        console.log(`   📝 New URL path: ${newFullUrlPath}`);
        successCount++;
      }
    } catch (error) {
      console.log(`   ❌ Error processing ${studio.name}: ${error.message}`);
      failCount++;
    }

    console.log(''); // Empty line for spacing
  }

  console.log('📊 Summary:');
  console.log(`   ✅ Successfully moved: ${successCount} studios`);
  console.log(`   ❌ Failed to move: ${failCount} studios`);

  if (successCount > 0) {
    console.log('\n🎉 Durham city location fixes complete!');
    console.log('Studios have been moved to Durham based on their addresses.');
  }
}

if (require.main === module) {
  moveStudiosToDurham().catch(console.error);
}