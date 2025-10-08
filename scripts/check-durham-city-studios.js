const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkDurhamCityStudios() {
  console.log('🔍 Checking Durham city studios in database...\n');

  // Check for studios that mention Durham in address
  const { data: addressMatches, error: addressError } = await supabase
    .from('pilates_studios')
    .select('id, name, city, address, county')
    .eq('county', 'Durham')
    .ilike('address', '%Durham%')
    .eq('is_active', true);

  if (addressMatches && addressMatches.length > 0) {
    console.log(`📍 Found ${addressMatches.length} studios with Durham in address:`);
    addressMatches.forEach(studio => {
      console.log(`   - ${studio.name} (City: ${studio.city})`);
      console.log(`     Address: ${studio.address}`);
    });
  }

  // Check for studios categorized as Durham
  const { data: cityMatches, error: cityError } = await supabase
    .from('pilates_studios')
    .select('id, name, city, address, county')
    .eq('county', 'Durham')
    .eq('city', 'Durham')
    .eq('is_active', true);

  if (cityMatches && cityMatches.length > 0) {
    console.log(`\n📛 Found ${cityMatches.length} studios categorized as Durham:`);
    cityMatches.forEach(studio => {
      console.log(`   - ${studio.name}`);
      console.log(`     Address: ${studio.address}`);
    });
  }

  if ((!addressMatches || addressMatches.length === 0) && (!cityMatches || cityMatches.length === 0)) {
    console.log('❌ No studios found with Durham in address or city');
  }
}

checkDurhamCityStudios().catch(console.error);