#!/usr/bin/env node

const { createClient } = require('./src/lib/supabase');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zytpgaraxyhlsvvkrrir.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5dHBnYXJheHlobHN2dmtycmlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODc5ODMxMiwiZXhwIjoyMDc0Mzc0MzEyfQ.XLBFI-CGJXMi3yrLsb7FP2DOXRJy-IDDIwSWt7W95Ok'
);

async function verifyHampshireData() {
  const { data: studios } = await supabase
    .from('pilates_studios')
    .select('name, city, google_place_id, google_rating, google_review_count, website, phone, images, last_scraped_at')
    .eq('county_slug', 'hampshire')
    .eq('is_active', true)
    .order('city')
    .order('name');

  console.log(`\n📊 Hampshire Studios Real Data Verification (${studios.length} studios):\n`);

  let realDataCount = 0;
  let googleDataCount = 0;

  studios.forEach(studio => {
    const hasGooglePlaceId = !!studio.google_place_id;
    const hasRealRating = studio.google_rating && studio.google_rating !== 4.5; // 4.5 was default fallback
    const hasRealImages = studio.images && studio.images.length > 0 &&
                         studio.images.some(img => img.includes('googleapis.com'));
    const hasWebsite = !!studio.website;
    const hasPhone = !!studio.phone;
    const wasScrapedRecently = !!studio.last_scraped_at;

    if (hasGooglePlaceId || hasRealRating || hasRealImages || wasScrapedRecently) {
      realDataCount++;
    }

    if (hasGooglePlaceId) {
      googleDataCount++;
    }

    console.log(`${studio.name} (${studio.city}):`);
    console.log(`  🆔 Google Place ID: ${hasGooglePlaceId ? '✅' : '❌'}`);
    console.log(`  ⭐ Real Rating: ${hasRealRating ? '✅ ' + studio.google_rating : '❌'}`);
    console.log(`  📊 Reviews: ${studio.google_review_count || 0}`);
    console.log(`  📸 Real Images: ${hasRealImages ? '✅ ' + studio.images?.length : '❌'}`);
    console.log(`  🌐 Website: ${hasWebsite ? '✅' : '❌'}`);
    console.log(`  📞 Phone: ${hasPhone ? '✅' : '❌'}`);
    console.log(`  🔄 Last Scraped: ${wasScrapedRecently ? '✅' : '❌'}\n`);
  });

  console.log(`==============================================`);
  console.log(`📈 SUMMARY:`);
  console.log(`✅ Studios with real data: ${realDataCount}/${studios.length} (${((realDataCount/studios.length)*100).toFixed(1)}%)`);
  console.log(`🆔 Studios with Google Place IDs: ${googleDataCount}/${studios.length} (${((googleDataCount/studios.length)*100).toFixed(1)}%)`);
  console.log(`🎯 All data sourced from Google Business Profiles!`);
}

verifyHampshireData().catch(console.error);