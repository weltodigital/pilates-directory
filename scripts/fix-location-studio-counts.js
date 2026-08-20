const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY);

async function fixLocationStudioCounts() {
  console.log('🔧 FIXING STUDIO COUNTS IN LOCATION TABLES\n');

  // Get all locations (counties and cities/towns)
  const { data: locations, error: locationsError } = await supabase
    .from('public_locations')
    .select('*')
    .order('type', { ascending: true })
    .order('name');

  if (locationsError) {
    console.error('❌ Error fetching locations:', locationsError);
    return;
  }

  console.log(`📊 Found ${locations?.length || 0} locations to audit\n`);

  let updatedCount = 0;
  let errorCount = 0;

  for (const location of locations || []) {
    console.log(`🏘️  Checking: ${location.name} (${location.type})`);

    let actualStudioCount = 0;

    try {
      if (location.type === 'county') {
        // For counties, count all studios in that county
        const { data: studios, error: studiosError } = await supabase
          .from('pilates_studios')
          .select('id')
          .eq('county_slug', location.slug)
          .eq('is_active', true);

        if (studiosError) {
          console.log(`   ❌ Error counting studios: ${studiosError.message}`);
          errorCount++;
          continue;
        }

        actualStudioCount = studios?.length || 0;

      } else if (location.type === 'city' || location.type === 'town') {
        // For cities/towns, count studios in that specific city/town
        const { data: studios, error: studiosError } = await supabase
          .from('pilates_studios')
          .select('id')
          .eq('city_slug', location.slug)
          .eq('county_slug', location.county_slug)
          .eq('is_active', true);

        if (studiosError) {
          console.log(`   ❌ Error counting studios: ${studiosError.message}`);
          errorCount++;
          continue;
        }

        actualStudioCount = studios?.length || 0;
      }

      const currentCount = location.butcher_count || 0;

      if (actualStudioCount !== currentCount) {
        console.log(`   📈 Updating count: ${currentCount} → ${actualStudioCount}`);

        // Update the location with correct studio count
        const { error: updateError } = await supabase
          .from('public_locations')
          .update({ butcher_count: actualStudioCount })
          .eq('id', location.id);

        if (updateError) {
          console.log(`   ❌ Failed to update: ${updateError.message}`);
          errorCount++;
        } else {
          console.log(`   ✅ Successfully updated studio count`);
          updatedCount++;
        }
      } else {
        console.log(`   ✓ Count is correct: ${actualStudioCount} studios`);
      }

    } catch (err) {
      console.log(`   ❌ Error processing location: ${err.message}`);
      errorCount++;
    }

    console.log('');
  }

  // Summary
  console.log('📈 STUDIO COUNT FIX SUMMARY:');
  console.log(`✅ Locations updated: ${updatedCount}`);
  console.log(`❌ Errors encountered: ${errorCount}`);
  console.log(`📊 Total locations checked: ${locations?.length || 0}`);

  if (updatedCount > 0) {
    console.log(`\n🎉 Successfully updated studio counts for ${updatedCount} locations!`);
    console.log('💡 County and city pages will now show accurate studio counts.');
  }

  // Show some examples of corrected counts
  if (updatedCount > 0) {
    console.log('\n📍 SAMPLE OF CORRECTED LOCATIONS:');

    const { data: sampleLocations } = await supabase
      .from('public_locations')
      .select('name, type, butcher_count')
      .order('butcher_count', { ascending: false })
      .limit(10);

    sampleLocations?.forEach((loc, index) => {
      console.log(`   ${index + 1}. ${loc.name} (${loc.type}): ${loc.butcher_count} studios`);
    });
  }
}

// Run the script
fixLocationStudioCounts()
  .then(() => {
    console.log('\n✨ Studio count fixing completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Studio count fixing failed:', error);
    process.exit(1);
  });