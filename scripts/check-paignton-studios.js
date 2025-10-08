const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkPaigntonStudios() {
  console.log('🔍 Checking Paignton studios in database...\n');

  // Check for studios that mention Paignton in address
  const { data: addressMatches, error: addressError } = await supabase
    .from('pilates_studios')
    .select('id, name, city, address, county')
    .eq('county', 'Devon')
    .ilike('address', '%Paignton%')
    .eq('is_active', true);

  if (addressMatches && addressMatches.length > 0) {
    console.log(`📍 Found ${addressMatches.length} studios with Paignton in address:`);
    addressMatches.forEach(studio => {
      console.log(`   - ${studio.name} (City: ${studio.city})`);
      console.log(`     Address: ${studio.address}`);
    });
  }

  // Check for studios categorized as Paignton
  const { data: cityMatches, error: cityError } = await supabase
    .from('pilates_studios')
    .select('id, name, city, address, county')
    .eq('county', 'Devon')
    .eq('city', 'Paignton')
    .eq('is_active', true);

  if (cityMatches && cityMatches.length > 0) {
    console.log(`\n📛 Found ${cityMatches.length} studios categorized as Paignton:`);
    cityMatches.forEach(studio => {
      console.log(`   - ${studio.name}`);
      console.log(`     Address: ${studio.address}`);
    });
  }

  if ((!addressMatches || addressMatches.length === 0) && (!cityMatches || cityMatches.length === 0)) {
    console.log('❌ No studios found with Paignton in address or city');
  }
}

checkPaigntonStudios().catch(console.error);