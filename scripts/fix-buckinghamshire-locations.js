/**
 * Fix Buckinghamshire Studio Locations
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
  // Amersham studios incorrectly listed under Chesham
  {
    name: 'Bucks Pilates',
    currentCity: 'Chesham',
    newCity: 'Amersham',
    reason: 'Address contains Amersham'
  },
  {
    name: 'FORM Pilates Studio',
    currentCity: 'Chesham',
    newCity: 'Amersham',
    reason: 'Address contains Amersham'
  },
  {
    name: 'Heidi Pilates',
    currentCity: 'Chesham',
    newCity: 'Amersham',
    reason: 'Address contains Amersham'
  },
  {
    name: 'Sol Pilates',
    currentCity: 'Chesham',
    newCity: 'Amersham',
    reason: 'Address contains Amersham'
  },
  {
    name: 'Strength and Glow Pilates Amersham',
    currentCity: 'Chesham',
    newCity: 'Amersham',
    reason: 'Address contains Amersham'
  },
  {
    name: 'Tru Pilates',
    currentCity: 'Chesham',
    newCity: 'Amersham',
    reason: 'Address contains Amersham'
  },
  {
    name: 'Yatta Studio',
    currentCity: 'Chesham',
    newCity: 'Amersham',
    reason: 'Address contains Amersham'
  },
  // Other misplaced studios
  {
    name: 'Fuse Health Beaconsfield * HIIT|PILATES|YOGA|BARRE',
    currentCity: 'Beaconsfield',
    newCity: 'High Wycombe',
    reason: 'Address shows High Wycombe location'
  },
  {
    name: 'Ponds Barn Studio',
    currentCity: 'Gerrards Cross',
    newCity: 'Beaconsfield',
    reason: 'Address shows Beaconsfield location'
  },
  {
    name: 'Reformer Pilates Beaconsfield',
    currentCity: 'Gerrards Cross',
    newCity: 'Beaconsfield',
    reason: 'Address shows Beaconsfield location'
  },
  {
    name: 'Clare Law Personal Trainer & Pilates',
    currentCity: 'High Wycombe',
    newCity: 'Marlow',
    reason: 'Address shows Marlow location'
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
    const newFullUrlPath = `buckinghamshire/${newCitySlug}/${generateSlug(studio.name, studioMove.newCity)}`;

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
  console.log('🚀 Starting Buckinghamshire Studio Location Fix');
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
    console.log('\n🎉 Buckinghamshire location fixes complete!');
    console.log('Studios have been moved to their correct cities based on their addresses.');
  }
}

if (require.main === module) {
  main().catch(console.error);
}