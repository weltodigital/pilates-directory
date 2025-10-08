/**
 * Fix Cambridgeshire Studio Locations
 * Move misplaced studios to their correct cities based on addresses
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

/**
 * Studios to move based on their actual addresses
 */
const STUDIO_MOVES = [
  // Chatteris studios currently under other cities
  {
    name: 'Fitpilates',
    currentCity: 'Wisbech',
    newCity: 'Chatteris',
    reason: 'Address shows Chatteris location'
  },
  {
    name: 'Wrapture',
    currentCity: 'Ramsey',
    newCity: 'Chatteris',
    reason: 'Address shows Chatteris location'
  },
  // Ely studios currently under Soham
  {
    name: 'All Wellness',
    currentCity: 'Soham',
    newCity: 'Ely',
    reason: 'Address shows ELY postcode'
  },
  {
    name: 'Pilates with Pippa',
    currentCity: 'Soham',
    newCity: 'Ely',
    reason: 'Address shows ELY postcode'
  },
  {
    name: 'FRESH.',
    currentCity: 'Soham',
    newCity: 'Ely',
    reason: 'Address shows ELY postcode'
  },
  {
    name: 'Good Feeling Collective: Soft Tissue Therapy, Massage, Pilates & Reflexology',
    currentCity: 'Soham',
    newCity: 'Ely',
    reason: 'Address shows ELY postcode'
  },
  {
    name: 'The Paradise Centre',
    currentCity: 'Soham',
    newCity: 'Ely',
    reason: 'Address shows ELY postcode'
  },
  // March studios currently under Wisbech
  {
    name: 'freckledclub',
    currentCity: 'Wisbech',
    newCity: 'March',
    reason: 'Address shows March location'
  },
  {
    name: 'Fenland Pilates and Fitness',
    currentCity: 'Wisbech',
    newCity: 'March',
    reason: 'Address shows March location'
  }
];

async function moveStudio(studioMove) {
  console.log(`\n🔄 Moving ${studioMove.name} from ${studioMove.currentCity} to ${studioMove.newCity}...`);
  console.log(`   Reason: ${studioMove.reason}`);

  try {
    // Find the studio
    const { data: studio, error: findError } = await supabase
      .from('pilates_studios')
      .select('*')
      .eq('name', studioMove.name)
      .eq('city', studioMove.currentCity)
      .single();

    if (findError || !studio) {
      console.log(`   ❌ Studio not found: ${studioMove.name}`);
      return false;
    }

    console.log(`   📍 Found studio: ${studio.name}`);
    console.log(`   📬 Address: ${studio.address}`);

    // Calculate new slug values
    const newCitySlug = studioMove.newCity.toLowerCase().replace(/\s+/g, '-');
    const newFullUrlPath = `cambridgeshire/${newCitySlug}/${generateSlug(studio.name, studioMove.newCity)}`;

    // Update the studio
    const { error: updateError } = await supabase
      .from('pilates_studios')
      .update({
        city: studioMove.newCity,
        city_slug: newCitySlug,
        full_url_path: newFullUrlPath,
        updated_at: new Date().toISOString()
      })
      .eq('id', studio.id);

    if (updateError) {
      console.log(`   ❌ Error updating studio: ${updateError.message}`);
      return false;
    }

    console.log(`   ✅ Successfully moved to ${studioMove.newCity}`);
    console.log(`   📝 New URL path: ${newFullUrlPath}`);
    return true;

  } catch (error) {
    console.log(`   ❌ Error processing ${studioMove.name}: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting Cambridgeshire Studio Location Fix');
  console.log('===========================================\n');

  let successCount = 0;
  let failCount = 0;

  for (const studioMove of STUDIO_MOVES) {
    const success = await moveStudio(studioMove);
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
    console.log('\n🎉 Cambridgeshire location fixes complete!');
    console.log('Studios have been moved to their correct cities based on their addresses.');
  }
}

if (require.main === module) {
  main().catch(console.error);
}