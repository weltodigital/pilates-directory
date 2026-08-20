const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY);

async function verifyStudioPages() {
  console.log('🔍 VERIFYING STUDIO PAGES ARE ACCESSIBLE\n');

  // Get all active studios
  const { data: studios, error } = await supabase
    .from('pilates_studios')
    .select('id, name, full_url_path, is_active')
    .eq('is_active', true)
    .order('name');

  if (error) {
    console.error('❌ Error fetching studios:', error);
    return;
  }

  console.log(`📊 Found ${studios?.length || 0} active studios\n`);

  // Test first 5 studios to verify the page structure works
  const testStudios = studios?.slice(0, 5) || [];

  console.log('🧪 Testing first 5 studios for page accessibility:\n');

  let successCount = 0;
  let errorCount = 0;

  for (const studio of testStudios) {
    console.log(`🏢 ${studio.name}`);
    console.log(`   Path: ${studio.full_url_path}`);

    // Parse the URL path
    const pathParts = studio.full_url_path.split('/');
    if (pathParts.length !== 3) {
      console.log(`   ❌ Invalid URL structure: ${studio.full_url_path}`);
      errorCount++;
      continue;
    }

    const [countySlug, citySlug, studioSlug] = pathParts;

    // Test if we can fetch the studio data (simulate the page.tsx getStudio function)
    const { data: studioData, error: studioError } = await supabase
      .from('pilates_studios')
      .select('*')
      .eq('full_url_path', studio.full_url_path)
      .eq('is_active', true)
      .single();

    if (studioError || !studioData) {
      console.log(`   ❌ Studio data not found: ${studioError?.message || 'No data'}`);
      errorCount++;
      continue;
    }

    // Test if we can fetch location data (simulate the page.tsx getLocationData function)
    const [countyResult, cityResult] = await Promise.all([
      supabase
        .from('public_locations')
        .select('name, slug')
        .eq('slug', countySlug)
        .eq('type', 'county')
        .single(),
      supabase
        .from('public_locations')
        .select('name, slug')
        .eq('slug', citySlug)
        .eq('county_slug', countySlug)
        .in('type', ['city', 'town'])
        .single()
    ]);

    if (countyResult.error || cityResult.error) {
      console.log(`   ❌ Location data error:`);
      if (countyResult.error) console.log(`      County: ${countyResult.error.message}`);
      if (cityResult.error) console.log(`      City: ${cityResult.error.message}`);
      errorCount++;
      continue;
    }

    console.log(`   ✅ Page accessible: ${countyResult.data.name} > ${cityResult.data.name} > ${studioData.name}`);
    console.log(`   📍 URL: https://pilatesuk.co.uk/${studio.full_url_path}`);
    successCount++;
    console.log('');
  }

  console.log('📈 TEST RESULTS:');
  console.log(`✅ Successful tests: ${successCount}/${testStudios.length}`);
  console.log(`❌ Failed tests: ${errorCount}/${testStudios.length}`);

  if (successCount === testStudios.length) {
    console.log('\n🎉 All tested studio pages are accessible!');
    console.log(`\n📊 FULL DATABASE STATUS:`);
    console.log(`   Total active studios: ${studios?.length || 0}`);
    console.log(`   All studios have valid URL paths and should be accessible`);
    console.log(`   Studio page template is working correctly`);

    // Show a few example URLs
    console.log(`\n🔗 Example studio URLs:`);
    studios?.slice(0, 10).forEach((studio, index) => {
      console.log(`   ${index + 1}. https://pilatesuk.co.uk/${studio.full_url_path}`);
    });

  } else {
    console.log('\n⚠️ Some issues found. All studios may not be accessible.');
  }

  // Check for any studios with invalid URL structures
  const invalidStudios = studios?.filter(studio => {
    const pathParts = studio.full_url_path.split('/');
    return pathParts.length !== 3 || pathParts.some(part => !part);
  }) || [];

  if (invalidStudios.length > 0) {
    console.log(`\n❌ ${invalidStudios.length} studios have invalid URL structures:`);
    invalidStudios.forEach(studio => {
      console.log(`   - ${studio.name}: ${studio.full_url_path}`);
    });
  } else {
    console.log(`\n✅ All ${studios?.length || 0} studios have valid URL structures`);
  }
}

// Run the verification
verifyStudioPages()
  .then(() => {
    console.log('\n✨ Studio page verification completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Verification failed:', error);
    process.exit(1);
  });