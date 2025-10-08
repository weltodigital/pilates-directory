const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function removeDuplicateLondonBoroughs() {
  console.log('🧹 Removing duplicate London borough entries...\n');

  // Get all London borough entries
  const { data: londonBoroughs, error } = await supabase
    .from('public_locations')
    .select('*')
    .eq('county_slug', 'london')
    .eq('type', 'city')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('❌ Error fetching London boroughs:', error);
    return;
  }

  console.log(`📊 Found ${londonBoroughs.length} London borough entries`);

  // Group by slug to find duplicates
  const boroughGroups = {};
  londonBoroughs.forEach(borough => {
    if (!boroughGroups[borough.slug]) {
      boroughGroups[borough.slug] = [];
    }
    boroughGroups[borough.slug].push(borough);
  });

  let totalRemoved = 0;

  // Process each group
  for (const [slug, boroughs] of Object.entries(boroughGroups)) {
    if (boroughs.length > 1) {
      console.log(`\n🔄 Processing ${slug} (${boroughs.length} duplicates):`);

      // Keep the newest entry (last in array after ordering by created_at)
      const keepEntry = boroughs[boroughs.length - 1];
      const removeEntries = boroughs.slice(0, -1);

      console.log(`   ✅ Keeping: ${keepEntry.name} (ID: ${keepEntry.id}) - Created: ${keepEntry.created_at}`);

      for (const removeEntry of removeEntries) {
        console.log(`   🗑️  Removing: ${removeEntry.name} (ID: ${removeEntry.id}) - Created: ${removeEntry.created_at}`);

        const { error: deleteError } = await supabase
          .from('public_locations')
          .delete()
          .eq('id', removeEntry.id);

        if (deleteError) {
          console.error(`   ❌ Error removing ${removeEntry.id}:`, deleteError);
        } else {
          console.log(`   ✅ Successfully removed duplicate`);
          totalRemoved++;
        }
      }
    } else {
      console.log(`✅ ${slug}: No duplicates found`);
    }
  }

  console.log(`\n📋 Summary:`);
  console.log(`   🗑️  Total duplicates removed: ${totalRemoved}`);
  console.log(`   ✅ Remaining unique boroughs: ${Object.keys(boroughGroups).length}`);

  // Verify no more duplicates
  const { data: verifyBoroughs } = await supabase
    .from('public_locations')
    .select('slug, name')
    .eq('county_slug', 'london')
    .eq('type', 'city');

  const uniqueSlugs = new Set(verifyBoroughs.map(b => b.slug));
  console.log(`   ✅ Verification: ${verifyBoroughs.length} total entries, ${uniqueSlugs.size} unique slugs`);

  if (verifyBoroughs.length === uniqueSlugs.size) {
    console.log('\n🎉 All duplicates successfully removed!');
  } else {
    console.log('\n⚠️  Some duplicates may still exist');
  }
}

removeDuplicateLondonBoroughs().catch(console.error);