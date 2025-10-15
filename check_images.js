const { createClient } = require('./src/lib/supabase');

const supabase = createClient(
  'https://zytpgaraxyhlsvvkrrir.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5dHBnYXJheHlobHN2dmtycmlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODc5ODMxMiwiZXhwIjoyMDc0Mzc0MzEyfQ.XLBFI-CGJXMi3yrLsb7FP2DOXRJy-IDDIwSWt7W95Ok'
);

async function checkImageData() {
  console.log('🔍 CHECKING IMAGE DATA FOR STUDIOS...\n');

  const { data, error } = await supabase
    .from('pilates_studios')
    .select('id, name, city, images, google_place_id')
    .eq('is_active', true)
    .limit(100);

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`📊 Analyzing ${data.length} studios for image data...\n`);

  let hasImages = 0;
  let hasGooglePlaceId = 0;
  let missingBoth = 0;

  data.forEach(studio => {
    const hasImage = studio.images && Array.isArray(studio.images) && studio.images.length > 0;
    const hasPlaceId = studio.google_place_id && studio.google_place_id.trim().length > 0;

    if (hasImage) hasImages++;
    if (hasPlaceId) hasGooglePlaceId++;
    if (!hasImage && !hasPlaceId) missingBoth++;

    console.log(`${studio.name} (${studio.city})`);
    console.log(`  Images: ${hasImage ? '✅' : '❌'} ${hasImage ? `(${studio.images.length})` : ''}`);
    console.log(`  Google Place ID: ${hasPlaceId ? '✅' : '❌'} ${hasPlaceId ? studio.google_place_id : ''}`);
    console.log('');
  });

  console.log('=' .repeat(60));
  console.log(`📊 SUMMARY (sample of ${data.length} studios):`);
  console.log(`Studios with images: ${hasImages}`);
  console.log(`Studios with Google Place ID: ${hasGooglePlaceId}`);
  console.log(`Studios missing both: ${missingBoth}`);
}

checkImageData().catch(console.error);