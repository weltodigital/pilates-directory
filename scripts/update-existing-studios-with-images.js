/**
 * Update existing studios with Google Business Profile images
 * This will add images to studios that don't have them yet
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
  const fields = 'photos';
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
    const maxWidth = 800;
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photo.photo_reference}&key=${GOOGLE_MAPS_API_KEY}`;
  });
}

/**
 * Update existing studios with images
 */
async function updateExistingStudiosWithImages() {
  console.log('🖼️  Updating existing studios with Google Business Profile images...\n');

  // Get studios without images
  const { data: studios, error } = await supabase
    .from('pilates_studios')
    .select('id, name, google_place_id')
    .eq('is_active', true)
    .or('images.is.null,images.eq.{}'); // Process ALL studios without images

  if (error || !studios || studios.length === 0) {
    console.log('✅ All studios already have images or no studios found');
    return;
  }

  console.log(`📋 Found ${studios.length} studios to update with images\n`);

  let updated = 0;
  let skipped = 0;

  for (const studio of studios) {
    console.log(`🏢 Processing: ${studio.name}`);

    if (!studio.google_place_id) {
      console.log('   ⚠️  No Google Place ID, skipping...');
      skipped++;
      continue;
    }

    // Get photos
    const details = await getPlaceDetails(studio.google_place_id);
    if (!details || !details.photos) {
      console.log('   📸 No photos found');
      skipped++;
      continue;
    }

    // Process photos
    const imageUrls = processGooglePhotos(details.photos);
    console.log(`   📸 Found ${details.photos.length} photos, using ${imageUrls.length}`);

    // Update studio
    const { error: updateError } = await supabase
      .from('pilates_studios')
      .update({
        images: imageUrls,
        updated_at: new Date().toISOString()
      })
      .eq('id', studio.id);

    if (updateError) {
      console.error(`   ❌ Error updating: ${updateError.message}`);
      skipped++;
    } else {
      console.log('   ✅ Updated successfully');
      updated++;
    }

    // Rate limiting delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Updated: ${updated} studios`);
  console.log(`   ⚠️  Skipped: ${skipped} studios`);
  console.log(`\n🎉 Image update completed!`);
}

// Run the update
updateExistingStudiosWithImages().catch(console.error);