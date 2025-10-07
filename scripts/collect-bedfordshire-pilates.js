/**
 * Bedfordshire Pilates Studio Data Collection Script
 * Targets specific cities and towns within Bedfordshire county
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// API Configuration
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Bedfordshire cities and towns from the directory
const BEDFORDSHIRE_LOCATIONS = [
  'Bedford, Bedfordshire, UK',
  'Luton, Bedfordshire, UK',
  'Biggleswade, Bedfordshire, UK',
  'Dunstable, Bedfordshire, UK',
  'Flitwick, Bedfordshire, UK',
  'Great Barford, Bedfordshire, UK',
  'Kempston, Bedfordshire, UK',
  'Leighton Buzzard, Bedfordshire, UK',
  'Marston Moretaine, Bedfordshire, UK',
  'Westoning, Bedfordshire, UK',
  'Wilden, Bedfordshire, UK'
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
    console.error(`Error searching ${location}:`, error);
    return [];
  }
}

/**
 * Get detailed place information from Google Places
 */
async function getPlaceDetails(placeId) {
  const fields = 'name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,opening_hours,geometry,reviews,photos,business_status,types';
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${GOOGLE_MAPS_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK') {
      return data.result;
    } else {
      console.error(`Error getting place details for ${placeId}:`, data.status);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching place details:`, error);
    return null;
  }
}

/**
 * Process Google Photos and convert to image URLs
 */
function processGooglePhotos(photos) {
  if (!photos || !Array.isArray(photos)) {
    return [];
  }

  return photos.slice(0, 5).map(photo => {
    // Use the photo reference to construct a high-quality image URL
    const maxWidth = 800; // Good quality for directory display
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photo.photo_reference}&key=${GOOGLE_MAPS_API_KEY}`;
  });
}

/**
 * Scrape studio website using Firecrawl
 */
async function scrapeStudioWebsite(url) {
  if (!url) return null;

  try {
    const response = await fetch('https://api.firecrawl.dev/v0/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: url,
        formats: ['extract'],
        extract: {
          schema: {
            type: 'object',
            properties: {
              description: { type: 'string' },
              class_types: {
                type: 'array',
                items: { type: 'string' }
              },
              instructors: {
                type: 'array',
                items: { type: 'string' }
              },
              email: { type: 'string' },
              pricing: { type: 'string' },
              specialties: {
                type: 'array',
                items: { type: 'string' }
              },
              equipment: {
                type: 'array',
                items: { type: 'string' }
              }
            }
          },
          systemPrompt: 'Extract information about this pilates studio.',
          prompt: 'Extract class types, instructor names, contact email, pricing, specialties, and equipment from this pilates studio website.'
        }
      })
    });

    const data = await response.json();

    if (data.success) {
      return data.data;
    } else {
      console.error(`Firecrawl error for ${url}:`, data.error);
      return null;
    }
  } catch (error) {
    console.error(`Error scraping website ${url}:`, error);
    return null;
  }
}

/**
 * Extract location data from address
 */
function parseAddress(address) {
  const parts = address.split(', ');
  const postcode = parts[parts.length - 2] || '';
  const country = parts[parts.length - 1] || '';

  // Extract city/town (usually second to last or third to last)
  let city = '';
  let county = 'Bedfordshire';

  if (parts.length >= 3) {
    city = parts[parts.length - 3] || '';
    if (parts.length >= 4) {
      county = parts[parts.length - 4] || 'Bedfordshire';
    }
  }

  return { city, county, postcode, country };
}

/**
 * Create URL-friendly slug
 */
function createSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
}

/**
 * Save studio to database
 */
async function saveStudio(studioData) {
  try {
    const { data, error } = await supabase
      .from('pilates_studios')
      .insert(studioData)
      .select();

    if (error) {
      console.error('Database insert error:', error);
      return null;
    }

    console.log(`✅ Saved studio: ${studioData.name}`);
    return data[0];
  } catch (error) {
    console.error('Error saving studio:', error);
    return null;
  }
}

/**
 * Process a single studio
 */
async function processStudio(place, location) {
  console.log(`\n🏢 Processing: ${place.name}`);

  // Get detailed information
  const details = await getPlaceDetails(place.place_id);
  if (!details) return null;

  // Parse address
  const addressInfo = parseAddress(details.formatted_address);

  // Scrape website if available
  let websiteData = null;
  if (details.website) {
    console.log(`🕷️  Scraping website: ${details.website}`);
    websiteData = await scrapeStudioWebsite(details.website);

    // Add delay to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Process Google Photos
  const googleImages = processGooglePhotos(details.photos);
  console.log(`📸 Found ${googleImages.length} images from Google Business Profile`);

  // Prepare studio data
  const extractedData = websiteData?.extract || {};
  const studioData = {
    name: details.name,
    description: extractedData.description || `Professional pilates studio in ${addressInfo.city}`,
    address: details.formatted_address,
    postcode: addressInfo.postcode,
    city: addressInfo.city,
    county: 'Bedfordshire',
    phone: details.formatted_phone_number || null,
    email: extractedData.email || null,
    website: details.website || null,
    latitude: details.geometry?.location?.lat || null,
    longitude: details.geometry?.location?.lng || null,
    google_place_id: place.place_id,
    google_rating: details.rating || null,
    google_review_count: details.user_ratings_total || 0,

    // Images from Google Business Profile
    images: googleImages,

    // Pilates-specific data from website
    class_types: extractedData.class_types || ['Mat Pilates', 'Reformer Pilates'],
    instructor_names: extractedData.instructors || [],
    specialties: extractedData.specialties || [],
    price_range: extractedData.pricing || null,
    equipment_available: extractedData.equipment || ['Reformers', 'Mats'],

    // Business info
    is_active: details.business_status === 'OPERATIONAL',
    opening_hours: details.opening_hours?.weekday_text ?
      Object.fromEntries(details.opening_hours.weekday_text.map((day, i) => [i, day])) : {},

    // SEO fields
    county_slug: 'bedfordshire',
    city_slug: createSlug(addressInfo.city),
    full_url_path: `bedfordshire/${createSlug(addressInfo.city)}/${createSlug(details.name)}`,

    // Timestamps
    last_scraped_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  return await saveStudio(studioData);
}

/**
 * Main collection function for Bedfordshire
 */
async function collectBedfordshirePilates() {
  console.log('🚀 Starting Bedfordshire pilates studio data collection...\n');

  let totalStudios = 0;

  for (const location of BEDFORDSHIRE_LOCATIONS) {
    console.log(`\n📍 Searching ${location}...`);

    // Search for studios in this location
    const places = await searchPilatesStudios(location);

    if (places.length === 0) {
      console.log(`   No pilates studios found in ${location}`);
      continue;
    }

    // Process each studio
    for (const place of places) {
      await processStudio(place, location);
      totalStudios++;

      // Rate limiting delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Longer delay between locations
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  console.log(`\n✅ Bedfordshire collection complete! Processed ${totalStudios} studios.`);
}

/**
 * Run the collection script
 */
if (require.main === module) {
  collectBedfordshirePilates().catch(console.error);
}

module.exports = {
  collectBedfordshirePilates,
  searchPilatesStudios,
  processStudio
};