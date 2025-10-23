/**
 * Suffolk Pilates Studio Data Collection Script
 * Targets specific cities and towns within Suffolk county
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// API Configuration
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Suffolk cities and towns
const SUFFOLK_LOCATIONS = [
  'Beccles, Suffolk, UK',
  'Bury St Edmunds, Suffolk, UK',
  'Felixstowe, Suffolk, UK',
  'Haverhill, Suffolk, UK',
  'Ipswich, Suffolk, UK',
  'Lowestoft, Suffolk, UK',
  'Mildenhall, Suffolk, UK',
  'Newmarket, Suffolk, UK',
  'Sudbury, Suffolk, UK',
  'Woodbridge, Suffolk, UK'
];

/**
 * Search for pilates studios using Google Places API
 */
async function searchPilatesStudios(location, radius = 10000) {
  const query = `pilates studios in ${location}`;
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&radius=${radius}&key=${GOOGLE_MAPS_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK') {
      console.log(`Found ${data.results.length} pilates studios in ${location}`);
      return data.results;
    } else {
      console.error(`Google Places API error for ${location}:`, data.status);
      return [];
    }
  } catch (error) {
    console.error(`Error searching pilates studios in ${location}:`, error);
    return [];
  }
}

/**
 * Get detailed information about a place using Google Places API
 */
async function getPlaceDetails(placeId) {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,website,opening_hours,rating,user_ratings_total,photos,types,price_level,business_status,vicinity,plus_code,geometry&key=${GOOGLE_MAPS_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK') {
      return data.result;
    } else {
      console.error(`Google Place Details API error:`, data.status);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching place details:`, error);
    return null;
  }
}

/**
 * Get photo URL from Google Places
 */
function getPhotoUrl(photoReference, maxWidth = 800) {
  if (!photoReference) return null;
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${GOOGLE_MAPS_API_KEY}`;
}

/**
 * Format opening hours for database storage
 */
function formatOpeningHours(openingHours) {
  if (!openingHours || !openingHours.weekday_text) return {};

  const formatted = {};
  openingHours.weekday_text.forEach(day => {
    const [dayName, hours] = day.split(': ');
    formatted[dayName] = hours;
  });

  return formatted;
}

/**
 * Generate URL-friendly slug
 */
function generateSlug(name, city) {
  const combined = `${name} ${city}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return combined;
}

/**
 * Extract city from address
 */
function extractCityFromAddress(address, location) {
  // Try to extract city from the search location first
  const locationCity = location.split(',')[0].trim();

  // Parse the formatted address
  const parts = address.split(',');

  // Usually the city is the second to last part before the postcode
  for (let i = parts.length - 2; i >= 0; i--) {
    const part = parts[i].trim();
    // Check if this part matches a known city
    if (SUFFOLK_LOCATIONS.some(loc => loc.startsWith(part))) {
      return part;
    }
  }

  // Fallback to location city
  return locationCity;
}

/**
 * Determine price range based on Google's price level
 */
function getPriceRange(priceLevel) {
  const priceRanges = {
    0: 'Free',
    1: '£',
    2: '££',
    3: '£££',
    4: '££££'
  };
  return priceRanges[priceLevel] || '££';
}

/**
 * Detect class types from studio name and description
 */
function detectClassTypes(name, types = []) {
  const classTypes = [];
  const nameAndTypes = `${name} ${types.join(' ')}`.toLowerCase();

  if (nameAndTypes.includes('reformer')) classTypes.push('Reformer Pilates');
  if (nameAndTypes.includes('mat')) classTypes.push('Mat Pilates');
  if (nameAndTypes.includes('clinical')) classTypes.push('Clinical Pilates');
  if (nameAndTypes.includes('prenatal') || nameAndTypes.includes('pregnancy')) classTypes.push('Prenatal Pilates');
  if (nameAndTypes.includes('postnatal')) classTypes.push('Postnatal Pilates');
  if (nameAndTypes.includes('barre')) classTypes.push('Barre');
  if (nameAndTypes.includes('yoga')) classTypes.push('Yoga Pilates Fusion');

  // Default class types if none detected
  if (classTypes.length === 0) {
    classTypes.push('Mat Pilates', 'Reformer Pilates');
  }

  return classTypes;
}

/**
 * Collect pilates studios for a specific location
 */
async function collectStudiosForLocation(location) {
  console.log(`\n📍 Collecting pilates studios for ${location}...`);

  const studios = await searchPilatesStudios(location);
  const processedStudios = [];

  for (const studio of studios) {
    console.log(`\n  Processing: ${studio.name}`);

    // Skip if not actually a pilates studio
    if (!studio.types.some(type =>
      type.includes('gym') ||
      type.includes('health') ||
      type.includes('fitness') ||
      type.includes('pilates')
    )) {
      console.log(`    ⏭️  Skipping - not a fitness/pilates facility`);
      continue;
    }

    // Get detailed information
    const details = await getPlaceDetails(studio.place_id);
    if (!details) {
      console.log(`    ⚠️  Could not fetch details`);
      continue;
    }

    // Extract and process data
    const city = extractCityFromAddress(details.formatted_address, location);
    const citySlug = city.toLowerCase().replace(/\s+/g, '-');

    // Get photos
    const photoUrls = [];
    if (details.photos && details.photos.length > 0) {
      for (let i = 0; i < Math.min(5, details.photos.length); i++) {
        const photoUrl = getPhotoUrl(details.photos[i].photo_reference);
        if (photoUrl) photoUrls.push(photoUrl);
      }
    }

    const studioData = {
      name: details.name,
      description: `Professional pilates studio in ${city}, Suffolk offering expert instruction and quality equipment.`,
      address: details.formatted_address,
      postcode: details.plus_code?.compound_code || '',
      city: city,
      county: 'Suffolk',
      phone: details.formatted_phone_number || null,
      email: null,
      website: details.website || null,
      latitude: details.geometry?.location?.lat || null,
      longitude: details.geometry?.location?.lng || null,
      google_place_id: studio.place_id,
      google_rating: details.rating || null,
      google_review_count: details.user_ratings_total || 0,
      images: photoUrls,
      class_types: detectClassTypes(details.name, studio.types),
      instructor_names: [],
      specialties: [],
      price_range: getPriceRange(details.price_level),
      equipment_available: ['Reformers', 'Mats'],
      is_active: details.business_status === 'OPERATIONAL',
      opening_hours: formatOpeningHours(details.opening_hours),
      county_slug: 'suffolk',
      city_slug: citySlug,
      full_url_path: `suffolk/${citySlug}/${generateSlug(details.name, city)}`,
      last_scraped_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    processedStudios.push(studioData);
    console.log(`    ✅ Processed successfully`);

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  return processedStudios;
}

/**
 * Save studios to Supabase
 */
async function saveToSupabase(studios) {
  console.log(`\n💾 Saving ${studios.length} studios to Supabase...`);

  for (const studio of studios) {
    try {
      // Check if studio already exists
      const { data: existing, error: checkError } = await supabase
        .from('pilates_studios')
        .select('id')
        .eq('google_place_id', studio.google_place_id)
        .single();

      if (existing) {
        console.log(`  ⏭️  ${studio.name} already exists - skipping`);
        continue;
      }

      // Insert new studio
      const { error } = await supabase
        .from('pilates_studios')
        .insert(studio);

      if (error) {
        console.error(`  ❌ Error saving ${studio.name}:`, error);
      } else {
        console.log(`  ✅ Saved ${studio.name}`);
      }
    } catch (error) {
      console.error(`  ❌ Error processing ${studio.name}:`, error);
    }
  }
}

/**
 * Main execution function
 */
async function main() {
  console.log('🚀 Starting Suffolk Pilates Studio Collection');
  console.log('==========================================\n');

  const allStudios = [];

  // Collect studios for each location
  for (const location of SUFFOLK_LOCATIONS) {
    const studios = await collectStudiosForLocation(location);
    allStudios.push(...studios);

    // Delay between locations to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`\n📊 Collection Summary:`);
  console.log(`   Total studios found: ${allStudios.length}`);

  // Remove duplicates based on google_place_id
  const uniqueStudios = Array.from(
    new Map(allStudios.map(s => [s.google_place_id, s])).values()
  );
  console.log(`   Unique studios: ${uniqueStudios.length}`);

  // Save to database
  await saveToSupabase(uniqueStudios);

  console.log('\n✨ Suffolk collection complete!');
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { collectStudiosForLocation };