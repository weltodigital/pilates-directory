const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY);

async function fixAllCountyUrls() {
  console.log('🔍 Finding all studios with incorrect county URLs...\n');

  let totalFixed = 0;
  let totalErrors = 0;

  // Fix studios using 'bedford' as county (should be 'bedfordshire')
  console.log('📍 Fixing Bedford county URLs...');
  const { data: bedfordStudios } = await supabase
    .from('pilates_studios')
    .select('id, name, address, full_url_path')
    .like('full_url_path', 'bedford/%');

  if (bedfordStudios && bedfordStudios.length > 0) {
    console.log(`Found ${bedfordStudios.length} studios with 'bedford' as county:\n`);

    for (const studio of bedfordStudios) {
      const newUrl = studio.full_url_path.replace(/^bedford\//, 'bedfordshire/');

      console.log(`📝 ${studio.name}`);
      console.log(`   Old: ${studio.full_url_path}`);
      console.log(`   New: ${newUrl}`);

      const { error } = await supabase
        .from('pilates_studios')
        .update({ full_url_path: newUrl })
        .eq('id', studio.id);

      if (error) {
        console.log(`   ❌ Error: ${error.message}\n`);
        totalErrors++;
      } else {
        console.log(`   ✅ Fixed\n`);
        totalFixed++;
      }
    }
  }

  // Fix studios using 'luton' as county (should be 'bedfordshire')
  console.log('📍 Fixing Luton county URLs...');
  const { data: lutonStudios } = await supabase
    .from('pilates_studios')
    .select('id, name, address, full_url_path')
    .like('full_url_path', 'luton/%');

  if (lutonStudios && lutonStudios.length > 0) {
    console.log(`Found ${lutonStudios.length} studios with 'luton' as county:\n`);

    for (const studio of lutonStudios) {
      const newUrl = studio.full_url_path.replace(/^luton\//, 'bedfordshire/');

      console.log(`📝 ${studio.name}`);
      console.log(`   Old: ${studio.full_url_path}`);
      console.log(`   New: ${newUrl}`);

      const { error } = await supabase
        .from('pilates_studios')
        .update({ full_url_path: newUrl })
        .eq('id', studio.id);

      if (error) {
        console.log(`   ❌ Error: ${error.message}\n`);
        totalErrors++;
      } else {
        console.log(`   ✅ Fixed\n`);
        totalFixed++;
      }
    }
  }

  // Final verification - check for any remaining issues
  console.log('🔍 Final verification...');
  const { data: remainingIssues } = await supabase
    .from('pilates_studios')
    .select('name, full_url_path')
    .or('full_url_path.like.bedford/%,full_url_path.like.luton/%,full_url_path.like.central-bedfordshire%');

  if (remainingIssues && remainingIssues.length > 0) {
    console.log(`\n⚠️ ${remainingIssues.length} studios still have incorrect county URLs:`);
    remainingIssues.forEach(studio => {
      console.log(`   - ${studio.name}: ${studio.full_url_path}`);
    });
  } else {
    console.log('\n✅ All county URLs are now correct!');
  }

  console.log(`\n📈 Summary:`);
  console.log(`✅ Successfully fixed: ${totalFixed} studios`);
  console.log(`❌ Errors: ${totalErrors} studios`);

  if (totalFixed > 0) {
    console.log(`\n🎉 All incorrect county URLs have been corrected!`);
    console.log(`   - Bedford → Bedfordshire: Fixed ${bedfordStudios?.length || 0} studios`);
    console.log(`   - Luton → Bedfordshire: Fixed ${lutonStudios?.length || 0} studios`);
  }
}

// Run the script
fixAllCountyUrls()
  .then(() => {
    console.log('\n✨ County URL correction completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });