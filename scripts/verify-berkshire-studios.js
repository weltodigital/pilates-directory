const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SECRET_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function verifyBerkshireStudios() {
  console.log('🔍 Verifying Berkshire studios in database...\n');

  try {
    // Count total Berkshire studios
    const { data: studios, error } = await supabase
      .from('pilates_studios')
      .select('name, city, county')
      .eq('county', 'Berkshire')
      .order('city');

    if (error) {
      console.error('❌ Error fetching studios:', error);
      return;
    }

    console.log(`✅ Found ${studios.length} Berkshire studios in database\n`);

    // Group by city
    const cityCounts = {};
    studios.forEach(studio => {
      cityCounts[studio.city] = (cityCounts[studio.city] || 0) + 1;
    });

    console.log('📊 Studios by city:');
    Object.entries(cityCounts)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([city, count]) => {
        console.log(`   ${city}: ${count} studios`);
      });

    console.log('\n🏢 All Berkshire studios:');
    studios.forEach((studio, index) => {
      console.log(`   ${index + 1}. ${studio.name} (${studio.city})`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

verifyBerkshireStudios().catch(console.error);