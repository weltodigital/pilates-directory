/**
 * Test script to verify Google Business Profile image collection for a single studio
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// API Configuration
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

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
 * Test image collection for a single studio
 */
async function testSingleStudioImages() {
  console.log('🧪 Testing Google Business Profile image collection...\n');

  // Get an existing studio from the database
  const { data: studios, error } = await supabase
    .from('pilates_studios')
    .select('id, name, google_place_id')
    .eq('is_active', true)
    .limit(1);

  if (error || !studios || studios.length === 0) {
    console.error('❌ No studios found in database:', error);
    return;
  }

  const studio = studios[0];
  console.log(`🏢 Testing with studio: ${studio.name}`);
  console.log(`📍 Google Place ID: ${studio.google_place_id}\n`);

  // Get place details including photos
  const details = await getPlaceDetails(studio.google_place_id);
  if (!details) {
    console.error('❌ Could not fetch place details');
    return;
  }

  console.log(`📊 Place details retrieved for: ${details.name}`);
  console.log(`🔍 Photos found: ${details.photos ? details.photos.length : 0}`);

  if (details.photos && details.photos.length > 0) {
    console.log('\n📸 Photo details:');
    details.photos.slice(0, 3).forEach((photo, index) => {
      console.log(`   ${index + 1}. Photo reference: ${photo.photo_reference}`);
      console.log(`      Width: ${photo.width}px, Height: ${photo.height}px`);
    });
  }

  // Process photos into URLs
  const imageUrls = processGooglePhotos(details.photos);
  console.log(`\n🖼️  Generated ${imageUrls.length} image URLs:`);
  imageUrls.forEach((url, index) => {
    console.log(`   ${index + 1}. ${url}`);
  });

  // Test updating the studio with images
  if (imageUrls.length > 0) {
    console.log(`\n💾 Updating studio "${studio.name}" with images...`);

    const { error: updateError } = await supabase
      .from('pilates_studios')
      .update({
        images: imageUrls,
        updated_at: new Date().toISOString()
      })
      .eq('id', studio.id);

    if (updateError) {
      console.error('❌ Error updating studio:', updateError);
    } else {
      console.log('✅ Studio updated successfully with images!');
    }
  }

  console.log('\n🎉 Test completed!');
}

// Run the test
testSingleStudioImages().catch(console.error);