/**
 * Fix Paignton Studio Locations
 * Move studios with Paignton addresses from Torquay to Paignton
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

async function moveStudiosToPaignton() {
  console.log('🚀 Starting Paignton Studio Location Fix');
  console.log('======================================\n');

  // Find all studios with Paignton in address but categorized as Torquay
  const { data: studios, error: findError } = await supabase
    .from('pilates_studios')
    .select('*')
    .eq('county', 'Devon')
    .eq('city', 'Torquay')
    .ilike('address', '%Paignton%')
    .eq('is_active', true);

  if (findError) {
    console.error('❌ Error finding studios:', findError);
    return;
  }

  if (!studios || studios.length === 0) {
    console.log('❌ No studios found to move');
    return;
  }

  console.log(`🔍 Found ${studios.length} studios to move to Paignton:\n`);

  let successCount = 0;
  let failCount = 0;

  for (const studio of studios) {
    console.log(`🔄 Moving: ${studio.name}`);
    console.log(`   Address: ${studio.address}`);

    try {
      // Calculate new slug values
      const newCitySlug = 'paignton';
      const newFullUrlPath = `devon/paignton/${generateSlug(studio.name, 'Paignton')}`;

      // Update the studio
      const { error: updateError } = await supabase
        .from('pilates_studios')
        .update({
          city: 'Paignton',
          city_slug: newCitySlug,
          full_url_path: newFullUrlPath,
          updated_at: new Date().toISOString()
        })
        .eq('id', studio.id);

      if (updateError) {
        console.log(`   ❌ Error updating studio: ${updateError.message}`);
        failCount++;
      } else {
        console.log(`   ✅ Successfully moved to Paignton`);
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
    console.log('\n🎉 Paignton location fixes complete!');
    console.log('Studios have been moved to Paignton based on their addresses.');
  }
}

if (require.main === module) {
  moveStudiosToPaignton().catch(console.error);
}