/**
 * Verify Wokingham Studio Fix
 * Check that studios have been moved to correct cities
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function verifyWokinghamFix() {
  console.log('🔍 Verifying Wokingham studio location fixes...\n');

  try {
    // Check current Wokingham studios
    const { data: wokinghamStudios, error: wokinghamError } = await supabase
      .from('pilates_studios')
      .select('name, city, address')
      .eq('city', 'Wokingham')
      .order('name');

    if (wokinghamError) {
      console.error('❌ Error fetching Wokingham studios:', wokinghamError);
      return;
    }

    console.log('📍 Current Wokingham studios:');
    if (wokinghamStudios.length === 0) {
      console.log('   No studios found in Wokingham');
    } else {
      wokinghamStudios.forEach((studio, index) => {
        console.log(`   ${index + 1}. ${studio.name}`);
        console.log(`      ${studio.address}\n`);
      });
    }

    // Check moved studios in their new locations
    const movedStudios = [
      { name: 'Clinical Pilates', expectedCity: 'Bracknell' },
      { name: 'Live Well Pilates', expectedCity: 'Bracknell' },
      { name: 'Lajuno Pilates', expectedCity: 'Bracknell' },
      { name: "Zo's Pilates & Nutrition", expectedCity: 'Reading' }
    ];

    console.log('\n🔄 Verifying moved studios:');

    for (const studio of movedStudios) {
      const { data: foundStudio, error } = await supabase
        .from('pilates_studios')
        .select('name, city, address, full_url_path')
        .eq('name', studio.name)
        .single();

      if (error || !foundStudio) {
        console.log(`   ❌ ${studio.name} - Not found`);
        continue;
      }

      if (foundStudio.city === studio.expectedCity) {
        console.log(`   ✅ ${studio.name} - Successfully moved to ${studio.expectedCity}`);
        console.log(`      URL: ${foundStudio.full_url_path}`);
      } else {
        console.log(`   ⚠️  ${studio.name} - Expected ${studio.expectedCity}, found in ${foundStudio.city}`);
      }
    }

    // Check Bracknell and Reading studio counts
    const { data: bracknellStudios } = await supabase
      .from('pilates_studios')
      .select('name')
      .eq('city', 'Bracknell');

    const { data: readingStudios } = await supabase
      .from('pilates_studios')
      .select('name')
      .eq('city', 'Reading');

    console.log('\n📊 Updated city counts:');
    console.log(`   Wokingham: ${wokinghamStudios.length} studios`);
    console.log(`   Bracknell: ${bracknellStudios?.length || 0} studios`);
    console.log(`   Reading: ${readingStudios?.length || 0} studios`);

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

verifyWokinghamFix().catch(console.error);