/**
 * Test Website Data
 * Tests that all necessary data is available for the website to function
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testWebsiteData() {
  console.log('🧪 Testing website data availability...\n');

  // Test 1: Featured studios
  console.log('1️⃣  Testing featured studios...');
  const { data: featuredStudios, error: featuredError } = await supabase
    .from('pilates_studios')
    .select('id, name, city, county, full_url_path')
    .eq('is_active', true)
    .limit(6);

  if (featuredError) {
    console.error('❌ Featured studios error:', featuredError);
  } else {
    console.log(`✅ Featured studios: ${featuredStudios.length} studios found`);
  }

  // Test 2: Counties
  console.log('\n2️⃣  Testing counties...');
  const { data: counties, error: countiesError } = await supabase
    .from('public_locations')
    .select('id, name, slug, butcher_count')
    .eq('type', 'county')
    .order('name');

  if (countiesError) {
    console.error('❌ Counties error:', countiesError);
  } else {
    console.log(`✅ Counties: ${counties.length} counties found`);
    counties.slice(0, 3).forEach(county => {
      console.log(`   - ${county.name} (${county.butcher_count} studios)`);
    });
  }

  // Test 3: Cities and towns
  console.log('\n3️⃣  Testing cities and towns...');
  const { data: cities, error: citiesError } = await supabase
    .from('public_locations')
    .select('id, name, slug, county_slug, full_path, butcher_count')
    .in('type', ['city', 'town'])
    .order('name');

  if (citiesError) {
    console.error('❌ Cities error:', citiesError);
  } else {
    console.log(`✅ Cities/Towns: ${cities.length} locations found`);
    cities.slice(0, 5).forEach(city => {
      console.log(`   - ${city.name} in ${city.county_slug} (${city.butcher_count} studios)`);
    });
  }

  // Test 4: Sample studio by URL
  console.log('\n4️⃣  Testing individual studio access...');
  const { data: sampleStudio, error: studioError } = await supabase
    .from('pilates_studios')
    .select('id, name, city, county, full_url_path, images')
    .eq('is_active', true)
    .not('full_url_path', 'is', null)
    .limit(1)
    .single();

  if (studioError) {
    console.error('❌ Sample studio error:', studioError);
  } else {
    console.log(`✅ Sample studio: ${sampleStudio.name}`);
    console.log(`   URL: /${sampleStudio.full_url_path}`);
    console.log(`   Images: ${sampleStudio.images?.length || 0}`);
  }

  // Summary
  const allTestsPassed = !featuredError && !countiesError && !citiesError && !studioError;

  console.log('\n📊 Test Summary:');
  console.log(`   Featured Studios: ${featuredError ? '❌' : '✅'}`);
  console.log(`   Counties: ${countiesError ? '❌' : '✅'}`);
  console.log(`   Cities/Towns: ${citiesError ? '❌' : '✅'}`);
  console.log(`   Individual Studios: ${studioError ? '❌' : '✅'}`);

  if (allTestsPassed) {
    console.log(`\n🎉 All tests passed! Website should be working correctly.`);
    console.log(`🔗 Visit: http://localhost:3000`);
  } else {
    console.log(`\n⚠️  Some tests failed. Website may have issues.`);
  }
}

// Run the tests
testWebsiteData().catch(console.error);