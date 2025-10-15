const { createClient } = require('@supabase/supabase-js');

// Database connection
const supabaseUrl = 'https://zytpgaraxyhlsvvkrrir.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5dHBnYXJheHlobHN2dmtycmlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODc5ODMxMiwiZXhwIjoyMDc0Mzc0MzEyfQ.XLBFI-CGJXMi3yrLsb7FP2DOXRJy-IDDIwSWt7W95Ok';

const supabase = createClient(supabaseUrl, supabaseKey);

async function queryManchesterStudios() {
  try {
    console.log('Querying Manchester area pilates studios...\n');

    // Get studios specifically in Manchester areas
    const { data: studios, error } = await supabase
      .from('pilates_studios')
      .select('*')
      .or('county.ilike.%manchester%,city.ilike.%manchester%')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching studios:', error);
      return;
    }

    console.log(`Found ${studios.length} pilates studios in Manchester areas\n`);

    if (studios.length === 0) {
      console.log('No Manchester area studios found. Let me check for similar variations...\n');

      // Try broader search
      const { data: broaderStudios, error: broaderError } = await supabase
        .from('pilates_studios')
        .select('*')
        .or('county.ilike.%greater%,city.ilike.%stockport%,city.ilike.%bury%,city.ilike.%rochdale%,city.ilike.%oldham%,city.ilike.%bolton%,city.ilike.%wigan%,city.ilike.%tameside%,city.ilike.%salford%')
        .order('created_at', { ascending: false });

      if (broaderError) {
        console.error('Error fetching broader studios:', error);
        return;
      }

      console.log(`Found ${broaderStudios.length} studios in Greater Manchester towns\n`);

      if (broaderStudios.length > 0) {
        broaderStudios.forEach(studio => {
          console.log(`\n=== ${studio.name} ===`);
          console.log(`City: ${studio.city}`);
          console.log(`County: ${studio.county}`);
          console.log(`Address: ${studio.address}`);
          console.log(`Postcode: ${studio.postcode}`);
          console.log(`Phone: ${studio.phone || 'MISSING'}`);
          console.log(`Website: ${studio.website || 'MISSING'}`);
          console.log(`Created: ${new Date(studio.created_at).toLocaleDateString()}`);
          console.log(`Missing data: ${[
            !studio.phone && 'phone',
            !studio.website && 'website',
            !studio.email && 'email',
            !studio.description && 'description',
            !studio.class_types?.length && 'class_types',
            !studio.equipment_available?.length && 'equipment',
            !Object.keys(studio.opening_hours || {}).length && 'hours',
            !studio.google_rating && 'google_rating',
            !studio.instagram && 'instagram',
            !studio.facebook && 'facebook'
          ].filter(Boolean).join(', ') || 'None'}`);
        });
      }

      return;
    }

    // Display each studio with missing data analysis
    studios.forEach(studio => {
      console.log(`\n=== ${studio.name} ===`);
      console.log(`City: ${studio.city}`);
      console.log(`County: ${studio.county}`);
      console.log(`Address: ${studio.address}`);
      console.log(`Postcode: ${studio.postcode}`);
      console.log(`Phone: ${studio.phone || 'MISSING'}`);
      console.log(`Website: ${studio.website || 'MISSING'}`);
      console.log(`Email: ${studio.email || 'MISSING'}`);
      console.log(`Instagram: ${studio.instagram || 'MISSING'}`);
      console.log(`Facebook: ${studio.facebook || 'MISSING'}`);
      console.log(`Description: ${studio.description ? 'Present' : 'MISSING'}`);
      console.log(`Class Types: ${studio.class_types?.length ? studio.class_types.join(', ') : 'MISSING'}`);
      console.log(`Equipment: ${studio.equipment_available?.length ? studio.equipment_available.join(', ') : 'MISSING'}`);
      console.log(`Opening Hours: ${Object.keys(studio.opening_hours || {}).length ? 'Present' : 'MISSING'}`);
      console.log(`Google Rating: ${studio.google_rating || 'MISSING'}`);
      console.log(`Google Reviews: ${studio.google_review_count || 0}`);
      console.log(`Created: ${new Date(studio.created_at).toLocaleDateString()}`);
      console.log(`Updated: ${new Date(studio.updated_at).toLocaleDateString()}`);
      console.log(`Status: ${studio.is_active ? 'Active' : 'Inactive'}`);

      // List missing data for enhancement
      const missingFields = [
        !studio.phone && 'phone',
        !studio.website && 'website',
        !studio.email && 'email',
        !studio.description && 'description',
        !studio.class_types?.length && 'class_types',
        !studio.equipment_available?.length && 'equipment',
        !Object.keys(studio.opening_hours || {}).length && 'opening_hours',
        !studio.google_rating && 'google_rating',
        !studio.instagram && 'instagram',
        !studio.facebook && 'facebook'
      ].filter(Boolean);

      console.log(`Missing data for enhancement: ${missingFields.join(', ') || 'None'}`);
    });

    // Summary for research prioritization
    console.log('\n\n=== RESEARCH PRIORITY SUMMARY ===');
    const criticalMissing = studios.filter(s => !s.phone || !s.website);
    const moderateMissing = studios.filter(s => !s.google_rating || !s.class_types?.length);

    console.log(`\nStudios missing critical info (phone/website): ${criticalMissing.length}`);
    criticalMissing.forEach(s => console.log(`  - ${s.name} (${s.city})`));

    console.log(`\nStudios missing moderate info (rating/classes): ${moderateMissing.length}`);
    moderateMissing.forEach(s => console.log(`  - ${s.name} (${s.city})`));

  } catch (error) {
    console.error('Error:', error);
  }
}

queryManchesterStudios();