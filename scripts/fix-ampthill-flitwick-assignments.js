const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function fixAmpthillFlitwickAssignments() {
  console.log('🔧 FIXING AMPTHILL AND FLITWICK STUDIO ASSIGNMENTS\n');

  // Studios to reassign based on their addresses
  const studiesToFix = [
    {
      name: 'The Pilates Reformer Studio Ampthill',
      address: '4A Church St, Ampthill, Bedford MK45 2EH, UK',
      newCity: 'Ampthill',
      newCitySlug: 'ampthill'
    },
    {
      name: 'HIX Pilates & Wellness Ltd',
      address: 'Verne Dr, Ampthill, Bedford MK45 2PS, UK',
      newCity: 'Ampthill',
      newCitySlug: 'ampthill'
    },
    {
      name: 'Steph Hammond - Pilates & Wellness',
      address: 'The Pilates Studio Ampthill, Unit D, The Sidlings, Ampthill Industrial Estate Station Rd, Ampthill, Bedford MK45 2QY, UK',
      newCity: 'Ampthill',
      newCitySlug: 'ampthill'
    },
    {
      name: 'Studio 281 Ampthill',
      address: '12 Kings Arms Yard, Ampthill, Bedford MK45 2PJ, UK',
      newCity: 'Ampthill',
      newCitySlug: 'ampthill'
    },
    {
      name: 'Cerisport',
      address: '65-67 Station Rd, Flitwick, Bedford MK45 1JU, UK',
      newCity: 'Flitwick',
      newCitySlug: 'flitwick'
    },
    {
      name: 'Chloe Fox Yoga & Barre',
      address: 'Dunstable Rd, Flitwick, Bedford MK45 1HU, UK',
      newCity: 'Flitwick',
      newCitySlug: 'flitwick'
    }
  ];

  let successCount = 0;
  let errorCount = 0;

  for (const studioInfo of studiesToFix) {
    console.log(`🏢 Fixing: ${studioInfo.name}`);
    console.log(`   Moving to: ${studioInfo.newCity} (${studioInfo.newCitySlug})`);

    try {
      // Find the studio by name and address
      const { data: studios, error: findError } = await supabase
        .from('pilates_studios')
        .select('id, name, city, city_slug, address')
        .eq('name', studioInfo.name)
        .single();

      if (findError || !studios) {
        console.log(`   ❌ Studio not found: ${findError?.message || 'No data'}`);
        errorCount++;
        continue;
      }

      console.log(`   📍 Current assignment: ${studios.city} (${studios.city_slug})`);

      // Update the studio's city and city_slug
      const { error: updateError } = await supabase
        .from('pilates_studios')
        .update({
          city: studioInfo.newCity,
          city_slug: studioInfo.newCitySlug
        })
        .eq('id', studios.id);

      if (updateError) {
        console.log(`   ❌ Failed to update: ${updateError.message}`);
        errorCount++;
      } else {
        console.log(`   ✅ Successfully reassigned to ${studioInfo.newCity}`);
        successCount++;
      }

    } catch (err) {
      console.log(`   ❌ Error processing studio: ${err.message}`);
      errorCount++;
    }

    console.log('');
  }

  console.log('📈 REASSIGNMENT SUMMARY:');
  console.log(`✅ Successfully reassigned: ${successCount} studios`);
  console.log(`❌ Failed reassignments: ${errorCount} studios`);

  if (successCount > 0) {
    console.log(`\\n🎉 Successfully reassigned ${successCount} studios to their correct cities!`);
    console.log('💡 Now running studio count update...');

    // Now update the studio counts
    await updateStudioCounts();
  }
}

async function updateStudioCounts() {
  console.log('\\n🔢 UPDATING STUDIO COUNTS FOR AFFECTED LOCATIONS\\n');

  const locationsToUpdate = ['bedford', 'ampthill', 'flitwick', 'bedfordshire'];

  for (const locationSlug of locationsToUpdate) {
    console.log(`📊 Updating count for: ${locationSlug}`);

    try {
      // Get location info
      const { data: location, error: locationError } = await supabase
        .from('public_locations')
        .select('*')
        .eq('slug', locationSlug)
        .single();

      if (locationError || !location) {
        console.log(`   ❌ Location not found: ${locationError?.message}`);
        continue;
      }

      let actualCount = 0;

      if (location.type === 'county') {
        // Count all studios in the county
        const { data: studios, error: studiosError } = await supabase
          .from('pilates_studios')
          .select('id')
          .eq('county_slug', locationSlug)
          .eq('is_active', true);

        actualCount = studios?.length || 0;
      } else {
        // Count studios in the city
        const { data: studios, error: studiosError } = await supabase
          .from('pilates_studios')
          .select('id')
          .eq('city_slug', locationSlug)
          .eq('is_active', true);

        actualCount = studios?.length || 0;
      }

      const currentCount = location.butcher_count || 0;

      if (actualCount !== currentCount) {
        console.log(`   📈 Updating count: ${currentCount} → ${actualCount}`);

        const { error: updateError } = await supabase
          .from('public_locations')
          .update({ butcher_count: actualCount })
          .eq('id', location.id);

        if (updateError) {
          console.log(`   ❌ Failed to update count: ${updateError.message}`);
        } else {
          console.log(`   ✅ Successfully updated count`);
        }
      } else {
        console.log(`   ✓ Count already correct: ${actualCount}`);
      }

    } catch (err) {
      console.log(`   ❌ Error updating count: ${err.message}`);
    }

    console.log('');
  }
}

// Run the fix
fixAmpthillFlitwickAssignments()
  .then(() => {
    console.log('\\n✨ Ampthill and Flitwick assignment fix completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Assignment fix failed:', error);
    process.exit(1);
  });