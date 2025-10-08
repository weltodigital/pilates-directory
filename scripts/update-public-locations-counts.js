/**
 * Update Public Locations Studio Counts
 * Updates the butcher_count field in public_locations table with actual studio counts
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function updateCityStudioCounts() {
  console.log('🚀 Starting Public Locations Studio Count Update');
  console.log('===============================================\n');

  try {
    // Get all cities/towns from public_locations
    const { data: locations, error: locationsError } = await supabase
      .from('public_locations')
      .select('id, name, slug, county_slug, type')
      .in('type', ['city', 'town']);

    if (locationsError) {
      console.error('❌ Error fetching locations:', locationsError);
      return;
    }

    console.log(`📍 Found ${locations.length} cities/towns to update\n`);

    let updatedCount = 0;
    let totalStudios = 0;

    // Process each location
    for (const location of locations) {
      try {
        // Count actual studios in this city
        const { data: studios, error: studioError } = await supabase
          .from('pilates_studios')
          .select('id')
          .eq('city_slug', location.slug)
          .eq('is_active', true);

        if (studioError) {
          console.log(`   ❌ Error counting studios for ${location.name}: ${studioError.message}`);
          continue;
        }

        const studioCount = studios?.length || 0;

        // Update the public_locations table
        const { error: updateError } = await supabase
          .from('public_locations')
          .update({
            butcher_count: studioCount,
            updated_at: new Date().toISOString()
          })
          .eq('id', location.id);

        if (updateError) {
          console.log(`   ❌ Error updating ${location.name}: ${updateError.message}`);
          continue;
        }

        if (studioCount > 0) {
          console.log(`   ✅ ${location.name} (${location.county_slug}): ${studioCount} studios`);
          totalStudios += studioCount;
        } else {
          console.log(`   ⚪ ${location.name} (${location.county_slug}): 0 studios`);
        }

        updatedCount++;

      } catch (error) {
        console.log(`   ❌ Error processing ${location.name}: ${error.message}`);
      }
    }

    console.log('\n📊 Update Summary:');
    console.log(`   ✅ Locations updated: ${updatedCount}`);
    console.log(`   🏢 Total studios counted: ${totalStudios}`);

    // Also update county totals
    await updateCountyTotals();

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

async function updateCountyTotals() {
  console.log('\n🗺️  Updating county totals...\n');

  try {
    // Get all counties
    const { data: counties, error: countiesError } = await supabase
      .from('public_locations')
      .select('id, name, slug')
      .eq('type', 'county');

    if (countiesError) {
      console.error('❌ Error fetching counties:', countiesError);
      return;
    }

    for (const county of counties) {
      // Count total studios in this county
      const { data: studios, error: studioError } = await supabase
        .from('pilates_studios')
        .select('id')
        .eq('county_slug', county.slug)
        .eq('is_active', true);

      if (studioError) {
        console.log(`   ❌ Error counting studios for ${county.name}: ${studioError.message}`);
        continue;
      }

      const studioCount = studios?.length || 0;

      // Update the county total
      const { error: updateError } = await supabase
        .from('public_locations')
        .update({
          butcher_count: studioCount,
          updated_at: new Date().toISOString()
        })
        .eq('id', county.id);

      if (updateError) {
        console.log(`   ❌ Error updating county ${county.name}: ${updateError.message}`);
        continue;
      }

      console.log(`   ✅ ${county.name} County: ${studioCount} total studios`);
    }

  } catch (error) {
    console.error('❌ Error updating county totals:', error);
  }
}

async function main() {
  await updateCityStudioCounts();
  console.log('\n🎉 Public locations studio counts updated successfully!');
}

if (require.main === module) {
  main().catch(console.error);
}