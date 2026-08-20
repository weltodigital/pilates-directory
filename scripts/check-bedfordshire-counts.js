const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY);

async function checkBedfordshireCounts() {
  console.log('🏘️ CHECKING ALL BEDFORDSHIRE STUDIO COUNTS\n');

  // Get all Bedfordshire locations (county and cities/towns)
  const { data: locations, error: locationsError } = await supabase
    .from('public_locations')
    .select('*')
    .or('slug.eq.bedfordshire,county_slug.eq.bedfordshire')
    .order('type', { ascending: true })
    .order('name');

  if (locationsError) {
    console.error('❌ Error fetching Bedfordshire locations:', locationsError);
    return;
  }

  console.log(`📊 Found ${locations?.length || 0} Bedfordshire locations\n`);

  let correctCount = 0;
  let mismatchCount = 0;

  for (const location of locations || []) {
    console.log(`📍 ${location.name} (${location.type})`);

    try {
      let actualStudioCount = 0;

      if (location.type === 'county') {
        // Count all studios in Bedfordshire county
        const { data: studios, error: studiosError } = await supabase
          .from('pilates_studios')
          .select('id, name, city')
          .eq('county_slug', 'bedfordshire')
          .eq('is_active', true);

        if (studiosError) {
          console.log(`   ❌ Error counting studios: ${studiosError.message}`);
          mismatchCount++;
          continue;
        }

        actualStudioCount = studios?.length || 0;

        // Show studio breakdown by city
        if (studios && studios.length > 0) {
          const cityBreakdown = {};
          studios.forEach(studio => {
            const city = studio.city || 'Unknown';
            cityBreakdown[city] = (cityBreakdown[city] || 0) + 1;
          });

          console.log(`   📋 Studios by city:`);
          Object.entries(cityBreakdown)
            .sort(([,a], [,b]) => b - a)
            .forEach(([city, count]) => {
              console.log(`      ${city}: ${count} studios`);
            });
        }

      } else if (location.type === 'city' || location.type === 'town') {
        // Count studios in this specific city/town
        const { data: studios, error: studiosError } = await supabase
          .from('pilates_studios')
          .select('id, name')
          .eq('city_slug', location.slug)
          .eq('county_slug', 'bedfordshire')
          .eq('is_active', true);

        if (studiosError) {
          console.log(`   ❌ Error counting studios: ${studiosError.message}`);
          mismatchCount++;
          continue;
        }

        actualStudioCount = studios?.length || 0;

        // Show studio names
        if (studios && studios.length > 0) {
          console.log(`   🏢 Studios:`);
          studios.forEach(studio => {
            console.log(`      • ${studio.name}`);
          });
        }
      }

      const displayedCount = location.butcher_count || 0;

      if (actualStudioCount === displayedCount) {
        console.log(`   ✅ CORRECT: Displaying ${displayedCount} studios (actual: ${actualStudioCount})`);
        correctCount++;
      } else {
        console.log(`   ❌ MISMATCH: Displaying ${displayedCount} studios but actual is ${actualStudioCount}`);
        mismatchCount++;

        // Auto-fix the mismatch
        console.log(`   🔧 Fixing count: ${displayedCount} → ${actualStudioCount}`);
        const { error: updateError } = await supabase
          .from('public_locations')
          .update({ butcher_count: actualStudioCount })
          .eq('id', location.id);

        if (updateError) {
          console.log(`   ❌ Failed to fix: ${updateError.message}`);
        } else {
          console.log(`   ✅ Fixed successfully`);
          correctCount++;
          mismatchCount--;
        }
      }

    } catch (err) {
      console.log(`   ❌ Error processing location: ${err.message}`);
      mismatchCount++;
    }

    console.log('');
  }

  // Summary
  console.log('📈 BEDFORDSHIRE STUDIO COUNT SUMMARY:');
  console.log(`✅ Correct counts: ${correctCount}`);
  console.log(`❌ Mismatched counts: ${mismatchCount}`);
  console.log(`📊 Total locations checked: ${locations?.length || 0}`);

  if (mismatchCount === 0) {
    console.log('\n🎉 All Bedfordshire studio counts are accurate!');
  } else {
    console.log('\n⚠️ Some mismatches were found and fixed.');
  }

  // Final verification - get updated totals
  const { data: finalCheck } = await supabase
    .from('public_locations')
    .select('name, type, butcher_count')
    .or('slug.eq.bedfordshire,county_slug.eq.bedfordshire')
    .order('butcher_count', { ascending: false });

  if (finalCheck) {
    console.log('\n📊 FINAL BEDFORDSHIRE STUDIO COUNTS:');
    finalCheck.forEach(loc => {
      if (loc.butcher_count > 0) {
        console.log(`   ${loc.name} (${loc.type}): ${loc.butcher_count} studios`);
      }
    });
  }
}

// Run the check
checkBedfordshireCounts()
  .then(() => {
    console.log('\n✨ Bedfordshire studio count check completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Check failed:', error);
    process.exit(1);
  });