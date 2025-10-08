const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function findMisplacedStudios() {
  console.log('🔍 Looking for studios that should be in Chatteris, Ely, or March...\n');

  // Search for studios that mention these cities in their address or name
  const searchTerms = ['Chatteris', 'Ely', 'March'];

  for (const term of searchTerms) {
    console.log(`🔎 Searching for ${term}...`);

    // Search in address
    const { data: addressMatches, error: addressError } = await supabase
      .from('pilates_studios')
      .select('id, name, city, city_slug, address, county')
      .eq('county', 'Cambridgeshire')
      .ilike('address', `%${term}%`)
      .eq('is_active', true);

    if (addressMatches && addressMatches.length > 0) {
      console.log(`   📍 Found ${addressMatches.length} studios with ${term} in address:`);
      addressMatches.forEach(studio => {
        console.log(`      ${studio.name} - Currently in: ${studio.city} (${studio.city_slug})`);
        console.log(`      Address: ${studio.address}`);
      });
    }

    // Search in name
    const { data: nameMatches, error: nameError } = await supabase
      .from('pilates_studios')
      .select('id, name, city, city_slug, address, county')
      .eq('county', 'Cambridgeshire')
      .ilike('name', `%${term}%`)
      .eq('is_active', true);

    if (nameMatches && nameMatches.length > 0) {
      console.log(`   📛 Found ${nameMatches.length} studios with ${term} in name:`);
      nameMatches.forEach(studio => {
        console.log(`      ${studio.name} - Currently in: ${studio.city} (${studio.city_slug})`);
        console.log(`      Address: ${studio.address}`);
      });
    }

    if ((!addressMatches || addressMatches.length === 0) && (!nameMatches || nameMatches.length === 0)) {
      console.log(`   ❌ No studios found mentioning ${term}`);
    }
    console.log('');
  }

  // Also check what studios are actually categorized under places that might contain these
  console.log('\n🔍 Also checking for studios that ended up in other cities...\n');

  const { data: allStudios, error } = await supabase
    .from('pilates_studios')
    .select('name, city, city_slug, address')
    .eq('county', 'Cambridgeshire')
    .eq('is_active', true)
    .order('city');

  if (allStudios) {
    // Group by city
    const byCity = {};
    allStudios.forEach(studio => {
      if (!byCity[studio.city]) byCity[studio.city] = [];
      byCity[studio.city].push(studio);
    });

    Object.keys(byCity).forEach(city => {
      console.log(`📍 ${city} (${byCity[city].length} studios):`);
      byCity[city].forEach(studio => {
        console.log(`   - ${studio.name}`);
      });
      console.log('');
    });
  }
}

findMisplacedStudios().catch(console.error);