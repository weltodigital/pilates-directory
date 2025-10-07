const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function removeEmptyBedfordshireLocations() {
  console.log('🗑️ REMOVING EMPTY BEDFORDSHIRE LOCATION PAGES\n');

  // Get all Bedfordshire cities/towns (exclude the county itself)
  const { data: locations, error: locationsError } = await supabase
    .from('public_locations')
    .select('*')
    .eq('county_slug', 'bedfordshire')
    .in('type', ['city', 'town'])
    .order('name');

  if (locationsError) {
    console.error('❌ Error fetching Bedfordshire locations:', locationsError);
    return;
  }

  console.log(`📊 Found ${locations?.length || 0} Bedfordshire cities/towns to check\n`);

  const locationsToRemove = [];
  const locationsToKeep = [];

  for (const location of locations || []) {
    console.log(`📍 Checking: ${location.name} (${location.butcher_count} studios)`);

    if (location.butcher_count === 0 || location.butcher_count === null) {
      console.log(`   🗑️ Marked for removal (no studios)`);
      locationsToRemove.push(location);
    } else {
      console.log(`   ✅ Keeping (has ${location.butcher_count} studios)`);
      locationsToKeep.push(location);
    }
  }

  console.log(`\n📊 REMOVAL SUMMARY:`);
  console.log(`🗑️ Locations to remove: ${locationsToRemove.length}`);
  console.log(`✅ Locations to keep: ${locationsToKeep.length}`);

  if (locationsToRemove.length > 0) {
    console.log(`\n🗑️ LOCATIONS TO BE REMOVED:`);
    locationsToRemove.forEach(loc => {
      console.log(`   - ${loc.name} (${loc.slug})`);
    });

    console.log(`\n✅ LOCATIONS TO KEEP:`);
    locationsToKeep.forEach(loc => {
      console.log(`   - ${loc.name} (${loc.slug}) - ${loc.butcher_count} studios`);
    });

    console.log(`\n🔄 Proceeding with removal...`);

    let successCount = 0;
    let errorCount = 0;

    for (const location of locationsToRemove) {
      console.log(`\n🗑️ Removing: ${location.name}`);

      try {
        // Check if there are any SEO content entries for this location
        const { data: seoContent, error: seoError } = await supabase
          .from('location_seo_content')
          .select('id')
          .eq('location_slug', location.slug);

        if (seoContent && seoContent.length > 0) {
          console.log(`   📝 Removing ${seoContent.length} SEO content entries`);

          const { error: deleteSeoError } = await supabase
            .from('location_seo_content')
            .delete()
            .eq('location_slug', location.slug);

          if (deleteSeoError) {
            console.log(`   ❌ Failed to remove SEO content: ${deleteSeoError.message}`);
          } else {
            console.log(`   ✅ SEO content removed`);
          }
        }

        // Remove the location from public_locations
        const { error: deleteError } = await supabase
          .from('public_locations')
          .delete()
          .eq('id', location.id);

        if (deleteError) {
          console.log(`   ❌ Failed to remove location: ${deleteError.message}`);
          errorCount++;
        } else {
          console.log(`   ✅ Location removed successfully`);
          successCount++;
        }

      } catch (err) {
        console.log(`   ❌ Error removing location: ${err.message}`);
        errorCount++;
      }
    }

    console.log(`\n📈 REMOVAL RESULTS:`);
    console.log(`✅ Successfully removed: ${successCount} locations`);
    console.log(`❌ Failed to remove: ${errorCount} locations`);

    if (successCount > 0) {
      console.log(`\n🎉 Successfully cleaned up ${successCount} empty location pages!`);
      console.log(`💡 These pages will no longer be generated or appear in navigation.`);

      // Show final Bedfordshire structure
      console.log(`\n📊 FINAL BEDFORDSHIRE STRUCTURE:`);
      console.log(`   County: Bedfordshire (35 studios total)`);
      locationsToKeep.forEach(loc => {
        console.log(`   └── ${loc.name}: ${loc.butcher_count} studios`);
      });
    }

  } else {
    console.log(`\n✅ No empty locations found - all Bedfordshire cities/towns have studios!`);
  }
}

// Run the removal
removeEmptyBedfordshireLocations()
  .then(() => {
    console.log('\n✨ Empty location removal completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Removal failed:', error);
    process.exit(1);
  });