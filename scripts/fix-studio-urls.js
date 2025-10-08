/**
 * Fix Studio URLs Script
 * Corrects malformed URLs that contain street addresses instead of city names
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Known city mappings for better extraction
const KNOWN_CITIES = {
  'bedfordshire': ['bedford', 'luton', 'biggleswade', 'dunstable', 'flitwick', 'kempston', 'leighton-buzzard', 'ampthill', 'caddington', 'marston-moretaine', 'westoning', 'wilden'],
  'london': ['london'],
  'greater-manchester': ['manchester'],
  'birmingham': ['birmingham']
};

/**
 * Create URL-friendly slug
 */
function createSlug(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .replace(/^-+|-+$/g, '');
}

/**
 * Improved address parsing that uses Google Places API for better city extraction
 */
async function getPlaceDetails(placeId) {
  const fields = 'address_components,formatted_address';
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${GOOGLE_MAPS_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.result.address_components) {
      return data.result.address_components;
    }
  } catch (error) {
    console.error('Error fetching place details:', error);
  }
  return null;
}

/**
 * Extract proper city and county from address components
 */
function extractCityCounty(addressComponents) {
  let city = '';
  let county = '';
  let country = '';

  for (const component of addressComponents) {
    const types = component.types;

    // Look for city/locality
    if (types.includes('postal_town') || types.includes('locality')) {
      city = component.long_name;
    }
    // Look for administrative area (county/state)
    else if (types.includes('administrative_area_level_2')) {
      county = component.long_name;
    }
    // Country
    else if (types.includes('country')) {
      country = component.long_name;
    }
  }

  // Special handling for UK addresses
  if (country === 'United Kingdom') {
    // For London addresses, set county to London
    if (city === 'London' || county === 'London') {
      city = 'London';
      county = 'London';
    }
    // For Manchester addresses
    else if (city === 'Manchester' || county === 'Greater Manchester') {
      city = 'Manchester';
      county = 'Greater Manchester';
    }
    // Keep Bedfordshire as is
    else if (county === 'Bedfordshire') {
      // city should already be correct from postal_town
    }
  }

  return { city: city || '', county: county || '', country };
}

/**
 * Fix URLs for all studios
 */
async function fixStudioUrls() {
  console.log('🔧 Starting studio URL fixes...\n');

  // Get all studios with potentially incorrect URLs
  const { data: studios, error } = await supabase
    .from('pilates_studios')
    .select('id, name, google_place_id, address, city, county, city_slug, county_slug, full_url_path')
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching studios:', error);
    return;
  }

  console.log(`📋 Found ${studios.length} studios to check\n`);

  let fixed = 0;
  let skipped = 0;

  for (const studio of studios) {
    console.log(`🏢 Processing: ${studio.name}`);
    console.log(`   Current URL: ${studio.full_url_path}`);

    if (!studio.google_place_id) {
      console.log('   ⚠️  No Google Place ID, skipping...');
      skipped++;
      continue;
    }

    // Get proper address components from Google Places
    const addressComponents = await getPlaceDetails(studio.google_place_id);
    if (!addressComponents) {
      console.log('   ⚠️  Could not get address details, skipping...');
      skipped++;
      continue;
    }

    // Extract proper city and county
    const { city, county } = extractCityCounty(addressComponents);

    if (!city || !county) {
      console.log('   ⚠️  Could not extract city/county, skipping...');
      skipped++;
      continue;
    }

    // Create proper slugs
    const countySlug = createSlug(county);
    const citySlug = createSlug(city);
    const studioSlug = createSlug(studio.name);

    // Generate correct URL
    const correctUrl = `${countySlug}/${citySlug}/${studioSlug}`;

    console.log(`   Fixed city: ${city}`);
    console.log(`   Fixed county: ${county}`);
    console.log(`   New URL: ${correctUrl}`);

    // Update the studio
    const { error: updateError } = await supabase
      .from('pilates_studios')
      .update({
        city: city,
        county: county,
        city_slug: citySlug,
        county_slug: countySlug,
        full_url_path: correctUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', studio.id);

    if (updateError) {
      console.error(`   ❌ Error updating: ${updateError.message}`);
      skipped++;
    } else {
      console.log('   ✅ Updated successfully');
      fixed++;
    }

    // Rate limiting delay
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log('');
  }

  console.log(`📊 Summary:`);
  console.log(`   ✅ Fixed: ${fixed} studios`);
  console.log(`   ⚠️  Skipped: ${skipped} studios`);
  console.log(`\n🎉 URL fix completed!`);
}

// Run the fix
fixStudioUrls().catch(console.error);