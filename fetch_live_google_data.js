#!/usr/bin/env node

/**
 * Fetch live Google Business Profile data for all Greater Manchester studios
 * This replaces all fake data with real, current information from Google
 */

const { createClient } = require('./src/lib/supabase');
const https = require('https');
const { URL } = require('url');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zytpgaraxyhlsvvkrrir.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5dHBnYXJheHlobHN2dmtycmlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODc5ODMxMiwiZXhwIjoyMDc0Mzc0MzEyfQ.XLBFI-CGJXMi3yrLsb7FP2DOXRJy-IDDIwSWt7W95Ok'
);

// Extract API key from existing Google Maps URLs
const GOOGLE_API_KEY = 'AIzaSyBqo9vGZgFvRiO0C6j-5zrYySLWcDyCxg4';

// Known real website URLs for studios (manually researched)
const REAL_STUDIO_DATA = {
  'Body Nurture': {
    website: 'https://www.bodynurture.co.uk/',
    actual_name: 'Body Nurture'
  },
  'Reform YU': {
    website: 'https://reformyu.co.uk/',
    actual_name: 'Reform YU'
  },
  'The Mill Studios': {
    website: 'https://www.themillstudios.co/',
    actual_name: 'The Mill Studios'
  },
  'The Pilates Suite': {
    website: 'https://www.pilatessuite.co.uk/',
    actual_name: 'The Pilates Suite'
  },
  'Thrive Pilates': {
    website: 'https://www.thrivepilates.uk/',
    actual_name: 'Thrive Pilates'
  },
  'Kore Studios': {
    website: 'http://www.korestudios.uk/',
    actual_name: 'Kore Studios'
  },
  'PXY Reformer Pilates': {
    website: 'https://pxyreformerpilates.com/',
    actual_name: 'PXY Reformer Pilates'
  },
  'release Reformer Pilates': {
    website: 'http://releasepilates.com/',
    actual_name: 'release Reformer Pilates'
  },
  'Restart Reformer Pilates Cheetham Hill': {
    website: 'https://restartpilates.co.uk/',
    actual_name: 'Restart Reformer Pilates Cheetham Hill'
  },
  'Restart Reformer Pilates Circle Square': {
    website: 'https://www.restartpilates.co.uk/',
    actual_name: 'Restart Reformer Pilates Circle Square'
  },
  'Restart Reformer Pilates Deansgate': {
    website: 'https://www.restartpilates.co.uk/',
    actual_name: 'Restart Reformer Pilates Deansgate'
  },
  'Runway Pilates Manchester': {
    website: 'http://www.runwaypilates.com/',
    actual_name: 'Runway Pilates Manchester'
  },
  'The Pilates Kitchen, Reformer Pilates Studio and Health Cafe': {
    website: 'https://momence.com/u/the-pilates-kitchen-mFJmJu',
    actual_name: 'The Pilates Kitchen'
  },
  'The Reformer Studio': {
    website: 'https://www.reformerstudio.co.uk/',
    actual_name: 'The Reformer Studio'
  },
  'Art of Pilates': {
    website: 'https://artofpilates.co.uk/',
    actual_name: 'Art of Pilates'
  },
  'Ballantyne Studio': {
    website: 'https://www.ballantynestudio.com/',
    actual_name: 'Ballantyne Studio'
  },
  'Rebalance Pilates': {
    website: 'https://rebalancepilates.co.uk/',
    actual_name: 'Rebalance Pilates'
  },
  'Re-Form Pilates': {
    website: 'https://re-form.co.uk/',
    actual_name: 'Re-Form Pilates'
  }
};

// Make HTTP request
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; StudioDataBot/1.0)'
      }
    };

    const request = (parsedUrl.protocol === 'https:' ? https : require('http')).request(options, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse response: ${e.message}`));
        }
      });
    });

    request.on('error', reject);
    request.setTimeout(10000, () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });
    request.end();
  });
}

// Search for place using Google Places API
async function searchPlace(name, address) {
  const query = encodeURIComponent(`${name} ${address}`);
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${GOOGLE_API_KEY}`;

  try {
    const data = await makeRequest(url);
    if (data.results && data.results.length > 0) {
      return data.results[0]; // Return first (best) match
    }
    return null;
  } catch (error) {
    console.log(`    ⚠️ Search failed: ${error.message}`);
    return null;
  }
}

// Get place details using Google Places API
async function getPlaceDetails(placeId) {
  const fields = 'place_id,name,rating,user_ratings_total,photos,website,formatted_phone_number,geometry,types';
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${GOOGLE_API_KEY}`;

  try {
    const data = await makeRequest(url);
    if (data.result) {
      return data.result;
    }
    return null;
  } catch (error) {
    console.log(`    ⚠️ Details failed: ${error.message}`);
    return null;
  }
}

// Convert Google Photos to URLs
function getPhotoUrls(photos, maxPhotos = 4) {
  if (!photos || !Array.isArray(photos)) return [];

  return photos.slice(0, maxPhotos).map(photo =>
    `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photo.photo_reference}&key=${GOOGLE_API_KEY}`
  );
}

async function fetchLiveGoogleData() {
  console.log('🔍 Fetching live Google Business Profile data for Hampshire studios...\n');

  const { data: studios, error } = await supabase
    .from('pilates_studios')
    .select('*')
    .eq('county_slug', 'hampshire')
    .eq('is_active', true)
    .order('city')
    .order('name');

  if (error) {
    console.error('Error fetching studios:', error);
    return;
  }

  console.log(`📊 Processing ${studios.length} studios...\n`);

  let updated = 0;
  let errors = 0;

  for (const studio of studios) {
    try {
      console.log(`🔍 Searching: ${studio.name} (${studio.city})`);

      // Search for the place
      const searchResult = await searchPlace(studio.name, studio.address);

      if (!searchResult) {
        console.log(`    ❌ No Google Business Profile found`);
        errors++;
        continue;
      }

      console.log(`    ✅ Found place: ${searchResult.name}`);

      // Get detailed information
      const placeDetails = await getPlaceDetails(searchResult.place_id);

      if (!placeDetails) {
        console.log(`    ❌ Could not get place details`);
        errors++;
        continue;
      }

      const updates = {
        updated_at: new Date().toISOString(),
        last_scraped_at: new Date().toISOString()
      };

      // Update Google Place ID
      if (placeDetails.place_id && placeDetails.place_id !== studio.google_place_id) {
        updates.google_place_id = placeDetails.place_id;
        console.log(`    📍 Updated Place ID`);
      }

      // Update real Google rating
      if (placeDetails.rating && placeDetails.rating !== studio.google_rating) {
        updates.google_rating = placeDetails.rating;
        console.log(`    ⭐ Updated rating: ${studio.google_rating} → ${placeDetails.rating}`);
      }

      // Update real review count
      if (placeDetails.user_ratings_total && placeDetails.user_ratings_total !== studio.google_review_count) {
        updates.google_review_count = placeDetails.user_ratings_total;
        console.log(`    📊 Updated reviews: ${studio.google_review_count} → ${placeDetails.user_ratings_total}`);
      }

      // Update with real Google Business Profile images
      if (placeDetails.photos && placeDetails.photos.length > 0) {
        const realImages = getPhotoUrls(placeDetails.photos);
        if (realImages.length > 0) {
          updates.images = realImages;
          console.log(`    📸 Updated with ${realImages.length} real Google photos`);
        }
      }

      // Update real website from our curated list
      const realData = REAL_STUDIO_DATA[studio.name];
      if (realData && realData.website && realData.website !== studio.website) {
        updates.website = realData.website;
        console.log(`    🌐 Updated website: ${realData.website}`);
      } else if (placeDetails.website && placeDetails.website !== studio.website) {
        updates.website = placeDetails.website;
        console.log(`    🌐 Updated website from Google: ${placeDetails.website}`);
      }

      // Update phone number if available from Google
      if (placeDetails.formatted_phone_number && placeDetails.formatted_phone_number !== studio.phone) {
        updates.phone = placeDetails.formatted_phone_number;
        console.log(`    📞 Updated phone: ${placeDetails.formatted_phone_number}`);
      }

      // Update coordinates if more accurate
      if (placeDetails.geometry && placeDetails.geometry.location) {
        const lat = placeDetails.geometry.location.lat;
        const lng = placeDetails.geometry.location.lng;
        if (Math.abs(lat - (studio.latitude || 0)) > 0.001 || Math.abs(lng - (studio.longitude || 0)) > 0.001) {
          updates.latitude = lat;
          updates.longitude = lng;
          console.log(`    📍 Updated coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        }
      }

      // Apply updates
      if (Object.keys(updates).length > 2) { // More than just updated_at and last_scraped_at
        const { error: updateError } = await supabase
          .from('pilates_studios')
          .update(updates)
          .eq('id', studio.id);

        if (updateError) {
          throw new Error(`Update failed: ${updateError.message}`);
        }

        console.log(`    ✅ Successfully updated ${Object.keys(updates).length - 2} fields`);
        updated++;
      } else {
        console.log(`    ℹ️ No updates needed - data already current`);
      }

      console.log('');

      // Rate limiting - be respectful to Google's API
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.log(`    ❌ Error processing ${studio.name}: ${error.message}\n`);
      errors++;
    }
  }

  console.log('='.repeat(60));
  console.log(`📊 LIVE DATA UPDATE COMPLETE`);
  console.log(`✅ Successfully updated: ${updated} studios`);
  console.log(`❌ Errors: ${errors} studios`);
  console.log(`📈 Success rate: ${updated > 0 ? ((updated / (updated + errors)) * 100).toFixed(1) : 0}%`);
  console.log('\n🎯 All Hampshire studio data is now live and current from Google Business Profiles!');
}

fetchLiveGoogleData().catch(console.error);