const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY);

// All 32 London boroughs + City of London
const LONDON_BOROUGHS = [
  'Barking and Dagenham',
  'Barnet',
  'Bexley',
  'Brent',
  'Bromley',
  'Camden',
  'City of London',
  'Croydon',
  'Ealing',
  'Enfield',
  'Greenwich',
  'Hackney',
  'Hammersmith and Fulham',
  'Haringey',
  'Harrow',
  'Havering',
  'Hillingdon',
  'Hounslow',
  'Islington',
  'Kensington and Chelsea',
  'Kingston upon Thames',
  'Lambeth',
  'Lewisham',
  'Merton',
  'Newham',
  'Redbridge',
  'Richmond upon Thames',
  'Southwark',
  'Sutton',
  'Tower Hamlets',
  'Waltham Forest',
  'Wandsworth',
  'Westminster'
];

function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

async function createLondonBoroughLocations() {
  console.log('🏙️ Creating London borough locations...\n');

  // First, ensure Greater London county exists
  const { data: existingCounty, error: countyCheckError } = await supabase
    .from('public_locations')
    .select('*')
    .eq('slug', 'greater-london')
    .eq('type', 'county')
    .single();

  if (!existingCounty) {
    console.log('📍 Creating Greater London county entry...');
    const { error: countyError } = await supabase
      .from('public_locations')
      .insert({
        name: 'Greater London',
        slug: 'greater-london',
        county_slug: 'greater-london',
        full_path: 'greater-london',
        type: 'county',
        butcher_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (countyError) {
      console.error('❌ Error creating Greater London county:', countyError);
      return;
    }
    console.log('✅ Created Greater London county');
  } else {
    console.log('✅ Greater London county already exists');
  }

  console.log('\\n📍 Creating borough locations...');

  let successCount = 0;
  let existingCount = 0;
  let errorCount = 0;

  for (const borough of LONDON_BOROUGHS) {
    const boroughSlug = generateSlug(borough);
    const fullPath = `greater-london/${boroughSlug}`;

    // Check if borough already exists
    const { data: existing, error: checkError } = await supabase
      .from('public_locations')
      .select('id')
      .eq('slug', boroughSlug)
      .eq('county_slug', 'greater-london')
      .single();

    if (existing) {
      console.log(`  ⏭️  ${borough} already exists`);
      existingCount++;
      continue;
    }

    // Create borough entry
    const { error: insertError } = await supabase
      .from('public_locations')
      .insert({
        name: borough,
        slug: boroughSlug,
        county_slug: 'greater-london',
        full_path: fullPath,
        type: 'city', // Using 'city' type for boroughs to match existing pattern
        butcher_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (insertError) {
      console.error(`  ❌ Error creating ${borough}:`, insertError);
      errorCount++;
    } else {
      console.log(`  ✅ Created ${borough}`);
      successCount++;
    }
  }

  console.log('\\n📊 Summary:');
  console.log(`✅ Successfully created: ${successCount} boroughs`);
  console.log(`⏭️  Already existed: ${existingCount} boroughs`);
  console.log(`❌ Failed to create: ${errorCount} boroughs`);
  console.log(`📍 Total boroughs: ${LONDON_BOROUGHS.length}`);

  console.log('\\n🎉 London borough structure created!');
  console.log('\\nNext steps:');
  console.log('1. Run the London pilates collection script');
  console.log('2. The Greater London county page will list all boroughs');
  console.log('3. Each borough will have its own page with studios');
}

createLondonBoroughLocations().catch(console.error);