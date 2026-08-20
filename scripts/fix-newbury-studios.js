/**
 * Fix Newbury Studios - Move studios with Newbury addresses from Lambourn to Newbury
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SECRET_KEY;

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

/**
 * Studios to move from Lambourn to Newbury (based on addresses containing "Newbury")
 */
const STUDIO_NAMES_TO_MOVE = [
  'PilatesMe with with Lina Lennie',
  'Pilates with Sallie-Anne',
  'Inflo Studio (Yoga.Reformer.Pilates.Barre.)',
  'Sonja Hornsby Pilates',
  'Wellness Pilates Ltd'
];

async function moveStudioToNewbury(studioName) {
  console.log(`\n🔄 Moving ${studioName} from Lambourn to Newbury...`);

  try {
    // Find the studio
    const { data: studio, error: findError } = await supabase
      .from('pilates_studios')
      .select('*')
      .eq('name', studioName)
      .eq('city', 'Lambourn')
      .single();

    if (findError || !studio) {
      console.log(`   ❌ Studio not found: ${studioName}`);
      return false;
    }

    console.log(`   📍 Found studio: ${studio.name}`);
    console.log(`   📬 Address: ${studio.address}`);

    // Verify it has Newbury in the address
    if (!studio.address.toLowerCase().includes('newbury')) {
      console.log(`   ⚠️  Address doesn't contain Newbury - skipping`);
      return false;
    }

    // Calculate new slug values
    const newCitySlug = 'newbury';
    const newFullUrlPath = `berkshire/${newCitySlug}/${generateSlug(studio.name, 'Newbury')}`;

    // Update the studio
    const { error: updateError } = await supabase
      .from('pilates_studios')
      .update({
        city: 'Newbury',
        city_slug: newCitySlug,
        full_url_path: newFullUrlPath,
        updated_at: new Date().toISOString()
      })
      .eq('id', studio.id);

    if (updateError) {
      console.log(`   ❌ Error updating studio: ${updateError.message}`);
      return false;
    }

    console.log(`   ✅ Successfully moved to Newbury`);
    console.log(`   📝 New URL path: ${newFullUrlPath}`);
    return true;

  } catch (error) {
    console.log(`   ❌ Error processing ${studioName}: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting Newbury Studio Location Fix');
  console.log('=====================================\n');

  let successCount = 0;
  let failCount = 0;

  for (const studioName of STUDIO_NAMES_TO_MOVE) {
    const success = await moveStudioToNewbury(studioName);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }

  console.log('\n📊 Summary:');
  console.log(`   ✅ Successfully moved: ${successCount} studios`);
  console.log(`   ❌ Failed to move: ${failCount} studios`);

  if (successCount > 0) {
    console.log('\n🎉 Newbury location fixes complete!');
    console.log('The studios have been moved to Newbury based on their addresses.');
  }
}

if (require.main === module) {
  main().catch(console.error);
}