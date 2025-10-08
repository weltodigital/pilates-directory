const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function updatePublicLocations() {
  console.log('🔄 Updating public locations for East Sussex and Essex...\n');

  // Get studio counts for East Sussex
  const { data: eastSussexStudios, error: eastSussexError } = await supabase
    .from('pilates_studios')
    .select('city')
    .eq('county', 'East Sussex')
    .eq('is_active', true);

  if (eastSussexError) {
    console.error('Error fetching East Sussex studios:', eastSussexError);
    return;
  }

  // Count studios by city for East Sussex
  const eastSussexCounts = {};
  eastSussexStudios.forEach(studio => {
    if (!eastSussexCounts[studio.city]) {
      eastSussexCounts[studio.city] = 0;
    }
    eastSussexCounts[studio.city]++;
  });

  console.log('📍 East Sussex city counts:');
  Object.entries(eastSussexCounts).forEach(([city, count]) => {
    console.log(`  ${city}: ${count} studios`);
  });

  // Update East Sussex locations
  console.log('\nUpdating East Sussex locations...');
  for (const [city, count] of Object.entries(eastSussexCounts)) {
    const citySlug = city.toLowerCase().replace(/\s+/g, '-');

    const { data, error } = await supabase
      .from('public_locations')
      .update({
        studio_count: count,
        updated_at: new Date().toISOString()
      })
      .eq('county_slug', 'east-sussex')
      .eq('slug', citySlug);

    if (error) {
      console.error(`  ❌ Error updating ${city}:`, error);
    } else {
      console.log(`  ✅ Updated ${city} with ${count} studios`);
    }
  }

  // Get studio counts for Essex
  const { data: essexStudios, error: essexError } = await supabase
    .from('pilates_studios')
    .select('city')
    .eq('county', 'Essex')
    .eq('is_active', true);

  if (essexError) {
    console.error('Error fetching Essex studios:', essexError);
    return;
  }

  // Count studios by city for Essex
  const essexCounts = {};
  essexStudios.forEach(studio => {
    if (!essexCounts[studio.city]) {
      essexCounts[studio.city] = 0;
    }
    essexCounts[studio.city]++;
  });

  console.log('\n📍 Essex city counts:');
  Object.entries(essexCounts).forEach(([city, count]) => {
    console.log(`  ${city}: ${count} studios`);
  });

  // Update Essex locations
  console.log('\nUpdating Essex locations...');
  for (const [city, count] of Object.entries(essexCounts)) {
    const citySlug = city.toLowerCase().replace(/\s+/g, '-');

    const { data, error } = await supabase
      .from('public_locations')
      .update({
        studio_count: count,
        updated_at: new Date().toISOString()
      })
      .eq('county_slug', 'essex')
      .eq('slug', citySlug);

    if (error) {
      console.error(`  ❌ Error updating ${city}:`, error);
    } else {
      console.log(`  ✅ Updated ${city} with ${count} studios`);
    }
  }

  console.log('\n✨ Public locations update complete!');
}

updatePublicLocations().catch(console.error);