const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function fixLondonCounty() {
  console.log('🔍 Checking London county entry...\n');

  // Check if London county exists
  const { data: londonCounty, error: fetchError } = await supabase
    .from('public_locations')
    .select('*')
    .eq('slug', 'london')
    .eq('type', 'county')
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('❌ Error checking London county:', fetchError);
    return;
  }

  if (!londonCounty) {
    console.log('❌ London county missing! Recreating...');

    const { error: createError } = await supabase
      .from('public_locations')
      .insert({
        name: 'London',
        slug: 'london',
        county_slug: 'london',
        full_path: 'london',
        type: 'county',
        butcher_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (createError) {
      console.error('❌ Error creating London county:', createError);
    } else {
      console.log('✅ London county recreated');

      // Generate SEO content for the new county
      console.log('📝 Generating SEO content...');
      const { exec } = require('child_process');
      exec('node scripts/generate-seo-content.js', (error, stdout, stderr) => {
        if (error) {
          console.error('❌ Error generating SEO:', error);
        } else {
          console.log('✅ SEO content generated');
        }
      });
    }
  } else {
    console.log('✅ London county exists');
    console.log('   Name:', londonCounty.name);
    console.log('   SEO Title:', londonCounty.seo_title || 'Not set');
  }

  // Check boroughs count
  const { data: boroughs } = await supabase
    .from('public_locations')
    .select('name')
    .eq('county_slug', 'london')
    .eq('type', 'city');

  console.log('\n📊 Total London boroughs:', boroughs.length);

  // Update county studio count
  const { data: studios } = await supabase
    .from('pilates_studios')
    .select('id')
    .eq('county_slug', 'london')
    .eq('is_active', true);

  const studioCount = studios.length;

  const { error: updateError } = await supabase
    .from('public_locations')
    .update({
      butcher_count: studioCount,
      updated_at: new Date().toISOString()
    })
    .eq('slug', 'london')
    .eq('type', 'county');

  if (updateError) {
    console.error('❌ Error updating studio count:', updateError);
  } else {
    console.log(`✅ Updated London county studio count to ${studioCount}`);
  }
}

fixLondonCounty().catch(console.error);