const { createClient } = require('@supabase/supabase-js');

// Database connection
const supabaseUrl = 'https://zytpgaraxyhlsvvkrrir.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5dHBnYXJheHlobHN2dmtycmlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODc5ODMxMiwiZXhwIjoyMDc0Mzc0MzEyfQ.XLBFI-CGJXMi3yrLsb7FP2DOXRJy-IDDIwSWt7W95Ok';

const supabase = createClient(supabaseUrl, supabaseKey);

async function queryPilatesStudios() {
  try {
    console.log('Querying all pilates studios...\n');

    // Get all studios
    const { data: studios, error } = await supabase
      .from('pilates_studios')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching studios:', error);
      return;
    }

    console.log(`Found ${studios.length} pilates studios in the database\n`);

    // Group by county for better organization
    const studiosByCounty = studios.reduce((acc, studio) => {
      const county = studio.county || 'Unknown';
      if (!acc[county]) {
        acc[county] = [];
      }
      acc[county].push(studio);
      return acc;
    }, {});

    // Display studios by county
    Object.keys(studiosByCounty).sort().forEach(county => {
      console.log(`\n=== ${county.toUpperCase()} ===`);

      studiosByCounty[county].forEach(studio => {
        console.log(`\nStudio: ${studio.name}`);
        console.log(`  City: ${studio.city}`);
        console.log(`  Address: ${studio.address}`);
        console.log(`  Postcode: ${studio.postcode}`);
        console.log(`  Phone: ${studio.phone || 'MISSING'}`);
        console.log(`  Website: ${studio.website || 'MISSING'}`);
        console.log(`  Email: ${studio.email || 'MISSING'}`);
        console.log(`  Instagram: ${studio.instagram || 'MISSING'}`);
        console.log(`  Facebook: ${studio.facebook || 'MISSING'}`);
        console.log(`  Description: ${studio.description ? 'Present' : 'MISSING'}`);
        console.log(`  Class Types: ${studio.class_types?.length ? studio.class_types.join(', ') : 'MISSING'}`);
        console.log(`  Equipment: ${studio.equipment_available?.length ? studio.equipment_available.join(', ') : 'MISSING'}`);
        console.log(`  Opening Hours: ${Object.keys(studio.opening_hours || {}).length ? 'Present' : 'MISSING'}`);
        console.log(`  Google Rating: ${studio.google_rating || 'MISSING'}`);
        console.log(`  Google Reviews: ${studio.google_review_count || 0}`);
        console.log(`  Created: ${new Date(studio.created_at).toLocaleDateString()}`);
        console.log(`  Updated: ${new Date(studio.updated_at).toLocaleDateString()}`);
        console.log(`  Status: ${studio.is_active ? 'Active' : 'Inactive'}`);
      });
    });

    // Summary of missing data
    console.log('\n\n=== DATA COMPLETENESS SUMMARY ===');
    const missingData = {
      phone: studios.filter(s => !s.phone).length,
      website: studios.filter(s => !s.website).length,
      email: studios.filter(s => !s.email).length,
      description: studios.filter(s => !s.description).length,
      class_types: studios.filter(s => !s.class_types?.length).length,
      equipment_available: studios.filter(s => !s.equipment_available?.length).length,
      opening_hours: studios.filter(s => !Object.keys(s.opening_hours || {}).length).length,
      google_rating: studios.filter(s => !s.google_rating).length,
      instagram: studios.filter(s => !s.instagram).length,
      facebook: studios.filter(s => !s.facebook).length
    };

    console.log('\nStudios missing key information:');
    Object.entries(missingData).forEach(([field, count]) => {
      console.log(`  ${field}: ${count}/${studios.length} (${((count/studios.length)*100).toFixed(1)}%)`);
    });

    // Focus on Greater Manchester and Manchester area
    console.log('\n\n=== GREATER MANCHESTER & MANCHESTER AREA FOCUS ===');
    const manchesterAreas = studios.filter(studio =>
      studio.county?.toLowerCase().includes('manchester') ||
      studio.city?.toLowerCase().includes('manchester') ||
      studio.county?.toLowerCase().includes('greater manchester')
    );

    console.log(`Found ${manchesterAreas.length} studios in Manchester area:`);
    manchesterAreas.forEach(studio => {
      console.log(`\n${studio.name} (${studio.city}, ${studio.county})`);
      console.log(`  Created: ${new Date(studio.created_at).toLocaleDateString()}`);
      console.log(`  Missing: ${[
        !studio.phone && 'phone',
        !studio.website && 'website',
        !studio.email && 'email',
        !studio.description && 'description',
        !studio.class_types?.length && 'class_types',
        !studio.equipment_available?.length && 'equipment',
        !Object.keys(studio.opening_hours || {}).length && 'hours',
        !studio.google_rating && 'google_rating'
      ].filter(Boolean).join(', ') || 'None'}`);
    });

  } catch (error) {
    console.error('Error:', error);
  }
}

queryPilatesStudios();