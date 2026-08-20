const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY);

async function fixCentralBedfordshireUrls() {
  console.log('🔍 Finding studios with central-bedfordshire in URLs...\n');

  // Get all studios with central-bedfordshire in their full_url_path
  const { data: centralStudios, error: fetchError } = await supabase
    .from('pilates_studios')
    .select('id, name, address, full_url_path')
    .ilike('full_url_path', '%central-bedfordshire%');

  if (fetchError) {
    console.error('❌ Error fetching studios:', fetchError);
    return;
  }

  if (!centralStudios || centralStudios.length === 0) {
    console.log('✅ No studios found with central-bedfordshire URLs');
    return;
  }

  console.log(`📊 Found ${centralStudios.length} studios to fix:\n`);

  // Display what we're going to fix
  centralStudios.forEach((studio, index) => {
    const newUrl = studio.full_url_path.replace('central-bedfordshire', 'bedfordshire');
    console.log(`${index + 1}. ${studio.name}`);
    console.log(`   Current: ${studio.full_url_path}`);
    console.log(`   Fixed:   ${newUrl}\n`);
  });

  // Fix each studio's URL
  console.log('🔧 Updating URLs...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const studio of centralStudios) {
    const newUrl = studio.full_url_path.replace('central-bedfordshire', 'bedfordshire');

    const { error: updateError } = await supabase
      .from('pilates_studios')
      .update({ full_url_path: newUrl })
      .eq('id', studio.id);

    if (updateError) {
      console.error(`❌ Failed to update ${studio.name}:`, updateError);
      errorCount++;
    } else {
      console.log(`✅ Updated: ${studio.name} -> ${newUrl}`);
      successCount++;
    }
  }

  console.log(`\n📈 Summary:`);
  console.log(`✅ Successfully updated: ${successCount} studios`);
  console.log(`❌ Failed to update: ${errorCount} studios`);

  if (successCount > 0) {
    console.log(`\n🎉 All central-bedfordshire URLs have been corrected to bedfordshire!`);
  }
}

// Run the script
fixCentralBedfordshireUrls()
  .then(() => {
    console.log('\n✨ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });