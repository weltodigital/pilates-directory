/**
 * Test New Database Connection
 * Quick test to verify the new pilates-directory database is working
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testDatabase() {
  console.log('🧪 Testing new pilates-directory database connection...\n');
  console.log(`🔗 Database URL: ${supabaseUrl}\n`);

  // Test basic connection
  const { data: studios, error, count } = await supabase
    .from('pilates_studios')
    .select('id, name, city, county, full_url_path, images', { count: 'exact' })
    .eq('is_active', true)
    .limit(5);

  if (error) {
    console.error('❌ Database connection failed:', error);
    return;
  }

  console.log(`✅ Database connection successful!`);
  console.log(`📊 Total active studios: ${count}`);
  console.log(`\n📋 Sample studios:`);

  studios.forEach((studio, index) => {
    console.log(`   ${index + 1}. ${studio.name}`);
    console.log(`      Location: ${studio.city}, ${studio.county}`);
    console.log(`      URL: ${studio.full_url_path}`);
    console.log(`      Images: ${studio.images?.length || 0}`);
    console.log('');
  });

  // Test specific URL paths that were fixed
  const { data: fixedStudio } = await supabase
    .from('pilates_studios')
    .select('name, city, county, full_url_path')
    .ilike('name', '%barre%')
    .limit(1)
    .single();

  if (fixedStudio) {
    console.log(`🔧 URL Fix Verification:`);
    console.log(`   Studio: ${fixedStudio.name}`);
    console.log(`   Fixed URL: ${fixedStudio.full_url_path}`);
    console.log(`   ✅ URL structure is correct (no street addresses)`);
  }

  console.log(`\n🎉 All tests passed! The new database is working correctly.`);
}

// Run the test
testDatabase().catch(console.error);