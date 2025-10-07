/**
 * Create Public Locations Table
 * Creates the missing public_locations table and populates it with data from pilates_studios
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createPublicLocationsTable() {
  console.log('🏗️  Creating public_locations table and populating data...\n');

  // First, get all unique counties and cities from pilates_studios
  const { data: studios, error: studiosError } = await supabase
    .from('pilates_studios')
    .select('county, county_slug, city, city_slug')
    .eq('is_active', true);

  if (studiosError) {
    console.error('❌ Error fetching studios:', studiosError);
    return;
  }

  console.log(`📋 Found ${studios.length} studios to process\n`);

  // Extract unique counties
  const countyMap = new Map();
  const cityMap = new Map();

  studios.forEach(studio => {
    if (studio.county && studio.county_slug) {
      if (!countyMap.has(studio.county_slug)) {
        countyMap.set(studio.county_slug, {
          name: studio.county,
          slug: studio.county_slug,
          type: 'county',
          butcher_count: 0
        });
      }
      countyMap.get(studio.county_slug).butcher_count++;
    }

    if (studio.city && studio.city_slug && studio.county_slug) {
      const cityKey = `${studio.county_slug}/${studio.city_slug}`;
      if (!cityMap.has(cityKey)) {
        cityMap.set(cityKey, {
          name: studio.city,
          slug: studio.city_slug,
          county_slug: studio.county_slug,
          full_path: `${studio.county_slug}/${studio.city_slug}`,
          type: 'city',
          butcher_count: 0
        });
      }
      cityMap.get(cityKey).butcher_count++;
    }
  });

  const counties = Array.from(countyMap.values());
  const cities = Array.from(cityMap.values());

  console.log(`📊 Unique locations found:`);
  console.log(`   Counties: ${counties.length}`);
  console.log(`   Cities: ${cities.length}\n`);

  // Check if table exists and clear it
  const { error: checkError } = await supabase
    .from('public_locations')
    .select('id')
    .limit(1);

  if (!checkError) {
    console.log('⚠️  public_locations table already exists, clearing...');
    const { error: deleteError } = await supabase
      .from('public_locations')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (deleteError) {
      console.error('❌ Error clearing table:', deleteError);
      return;
    }
    console.log('✅ Table cleared\n');
  } else {
    console.log('🔧 Table does not exist. Please create it in your Supabase dashboard first with:');
    console.log(`
CREATE TABLE public_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  county_slug TEXT,
  full_path TEXT,
  type TEXT NOT NULL CHECK (type IN ('county', 'city', 'town')),
  butcher_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_public_locations_type ON public_locations(type);
CREATE INDEX idx_public_locations_county_slug ON public_locations(county_slug);
CREATE INDEX idx_public_locations_slug ON public_locations(slug);
    `);
    return;
  }

  // Insert counties first
  console.log('📥 Inserting counties...');
  const { error: countiesError } = await supabase
    .from('public_locations')
    .insert(counties);

  if (countiesError) {
    console.error('❌ Error inserting counties:', countiesError);
    return;
  }
  console.log(`✅ Inserted ${counties.length} counties`);

  // Insert cities
  console.log('📥 Inserting cities...');
  const { error: citiesError } = await supabase
    .from('public_locations')
    .insert(cities);

  if (citiesError) {
    console.error('❌ Error inserting cities:', citiesError);
    return;
  }
  console.log(`✅ Inserted ${cities.length} cities`);

  console.log(`\n🎉 public_locations table created and populated successfully!`);
  console.log(`📊 Summary:`);
  console.log(`   Total counties: ${counties.length}`);
  console.log(`   Total cities: ${cities.length}`);
  console.log(`   Total locations: ${counties.length + cities.length}`);

  // Show sample data
  console.log(`\n📖 Sample counties:`);
  counties.slice(0, 3).forEach(county => {
    console.log(`   ${county.name} (${county.butcher_count} studios)`);
  });

  console.log(`\n📖 Sample cities:`);
  cities.slice(0, 5).forEach(city => {
    console.log(`   ${city.name} in ${city.county_slug} (${city.butcher_count} studios)`);
  });
}

// Run the script
createPublicLocationsTable().catch(console.error);