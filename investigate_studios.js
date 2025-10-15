const { createClient } = require('./src/lib/supabase');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zytpgaraxyhlsvvkrrir.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5dHBnYXJheHlobHN2dmtycmlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODc5ODMxMiwiZXhwIjoyMDc0Mzc0MzEyfQ.XLBFI-CGJXMi3yrLsb7FP2DOXRJy-IDDIwSWt7W95Ok'
);

async function investigateStudios() {
  console.log('🔍 Investigating Greater Manchester studio distribution...\n');

  // Get all Greater Manchester studios
  const { data: allStudios } = await supabase
    .from('pilates_studios')
    .select('name, city, county, city_slug, county_slug, is_active, address')
    .eq('county_slug', 'greater-manchester')
    .eq('is_active', true);

  console.log(`📊 Found ${allStudios.length} active studios in Greater Manchester\n`);

  // Group by city
  const cityGroups = {};
  allStudios.forEach(studio => {
    const city = studio.city || 'Unknown';
    if (!cityGroups[city]) cityGroups[city] = [];
    cityGroups[city].push(studio);
  });

  console.log('🏙️ Studios by City:');
  Object.keys(cityGroups).sort().forEach(city => {
    console.log(`${city}: ${cityGroups[city].length} studios`);
    cityGroups[city].forEach(studio => {
      console.log(`  - ${studio.name} (city_slug: '${studio.city_slug}')`);
      console.log(`    Address: ${studio.address}`);
    });
    console.log('');
  });

  // Check city_slug matching
  console.log('\n🔍 Checking city_slug values for potential mismatches:');
  const citySlugGroups = {};
  allStudios.forEach(studio => {
    const slug = studio.city_slug || 'Unknown';
    if (!citySlugGroups[slug]) citySlugGroups[slug] = [];
    citySlugGroups[slug].push(studio);
  });

  Object.keys(citySlugGroups).sort().forEach(slug => {
    console.log(`City slug '${slug}': ${citySlugGroups[slug].length} studios`);
    citySlugGroups[slug].forEach(studio => {
      console.log(`  - ${studio.name} (city: '${studio.city}')`);
    });
    console.log('');
  });
}

investigateStudios().catch(console.error);