const { createClient } = require('./src/lib/supabase');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zytpgaraxyhlsvvkrrir.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5dHBnYXJheHlobHN2dmtycmlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODc5ODMxMiwiZXhwIjoyMDc0Mzc0MzEyfQ.XLBFI-CGJXMi3yrLsb7FP2DOXRJy-IDDIwSWt7W95Ok'
);

async function analyzeAllStudios() {
  console.log('🔍 ANALYZING ALL PILATES STUDIOS IN DATABASE...\n');

  const { data, error } = await supabase
    .from('pilates_studios')
    .select('id, name, city, county, phone, email, website, class_types, equipment_available, specialties, instructor_names, description')
    .eq('is_active', true)
    .order('county', { ascending: true })
    .order('city', { ascending: true });

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log('📊 === STUDIO ANALYSIS ===');
  console.log(`Total active studios: ${data.length}`);

  // Analysis of missing data
  const missing = {
    phone: 0,
    email: 0,
    website: 0,
    class_types: 0,
    equipment_available: 0,
    specialties: 0,
    instructor_names: 0,
    description_short: 0
  };

  const byCounty = {};
  const needsEnhancement = [];

  data.forEach(studio => {
    let missingCount = 0;
    const missingFields = [];

    if (!studio.phone) {
      missing.phone++;
      missingCount++;
      missingFields.push('phone');
    }
    if (!studio.email) {
      missing.email++;
      missingCount++;
      missingFields.push('email');
    }
    if (!studio.website) {
      missing.website++;
      missingCount++;
      missingFields.push('website');
    }
    if (!studio.class_types || studio.class_types.length === 0) {
      missing.class_types++;
      missingCount++;
      missingFields.push('class_types');
    }
    if (!studio.equipment_available || studio.equipment_available.length === 0) {
      missing.equipment_available++;
      missingCount++;
      missingFields.push('equipment');
    }
    if (!studio.specialties || studio.specialties.length === 0) {
      missing.specialties++;
      missingCount++;
      missingFields.push('specialties');
    }
    if (!studio.instructor_names || studio.instructor_names.length === 0) {
      missing.instructor_names++;
      missingCount++;
      missingFields.push('instructors');
    }
    if (!studio.description || studio.description.length < 50) {
      missing.description_short++;
      missingCount++;
      missingFields.push('description');
    }

    if (missingCount > 0) {
      needsEnhancement.push({
        name: studio.name,
        city: studio.city,
        county: studio.county,
        missingCount,
        missingFields,
        id: studio.id
      });
    }

    if (!byCounty[studio.county]) byCounty[studio.county] = 0;
    byCounty[studio.county]++;
  });

  console.log('\n📋 === MISSING DATA ANALYSIS ===');
  console.log(`Studios missing phone: ${missing.phone} (${(missing.phone/data.length*100).toFixed(1)}%)`);
  console.log(`Studios missing email: ${missing.email} (${(missing.email/data.length*100).toFixed(1)}%)`);
  console.log(`Studios missing website: ${missing.website} (${(missing.website/data.length*100).toFixed(1)}%)`);
  console.log(`Studios missing class_types: ${missing.class_types} (${(missing.class_types/data.length*100).toFixed(1)}%)`);
  console.log(`Studios missing equipment: ${missing.equipment_available} (${(missing.equipment_available/data.length*100).toFixed(1)}%)`);
  console.log(`Studios missing specialties: ${missing.specialties} (${(missing.specialties/data.length*100).toFixed(1)}%)`);
  console.log(`Studios missing instructors: ${missing.instructor_names} (${(missing.instructor_names/data.length*100).toFixed(1)}%)`);
  console.log(`Studios with short description: ${missing.description_short} (${(missing.description_short/data.length*100).toFixed(1)}%)`);

  console.log('\n🌍 === STUDIOS BY COUNTY ===');
  Object.entries(byCounty)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .forEach(([county, count]) => console.log(`${county}: ${count} studios`));

  console.log('\n🔧 === ENHANCEMENT PRIORITY ===');
  console.log(`Studios needing enhancement: ${needsEnhancement.length}/${data.length} (${(needsEnhancement.length/data.length*100).toFixed(1)}%)`);

  // Top 20 studios that need the most work
  console.log('\n⚠️  === TOP 20 STUDIOS NEEDING MOST DATA ===');
  needsEnhancement
    .sort((a, b) => b.missingCount - a.missingCount)
    .slice(0, 20)
    .forEach((studio, index) => {
      console.log(`${index + 1}. ${studio.name} (${studio.city}, ${studio.county})`);
      console.log(`   Missing: ${studio.missingFields.join(', ')} (${studio.missingCount} fields)`);
    });

  // Enhanced studios (recent ones we've worked on)
  const enhanced = data.filter(studio =>
    studio.phone && studio.website &&
    studio.class_types && studio.class_types.length > 0 &&
    studio.equipment_available && studio.equipment_available.length > 0
  );

  console.log('\n✅ === FULLY ENHANCED STUDIOS ===');
  console.log(`Complete studios: ${enhanced.length}/${data.length} (${(enhanced.length/data.length*100).toFixed(1)}%)`);

  enhanced.forEach(studio => {
    console.log(`✅ ${studio.name} (${studio.city}, ${studio.county})`);
  });

  return {
    total: data.length,
    needsEnhancement: needsEnhancement.length,
    fullyEnhanced: enhanced.length,
    topPriority: needsEnhancement.slice(0, 50) // Top 50 for processing
  };
}

analyzeAllStudios().catch(console.error);