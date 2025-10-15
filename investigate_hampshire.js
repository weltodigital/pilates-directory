#!/usr/bin/env node

const { createClient } = require('./src/lib/supabase');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zytpgaraxyhlsvvkrrir.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5dHBnYXJheHlobHN2dmtycmlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODc5ODMxMiwiZXhwIjoyMDc0Mzc0MzEyfQ.XLBFI-CGJXMi3yrLsb7FP2DOXRJy-IDDIwSWt7W95Ok'
);

async function investigateHampshire() {
  console.log('🔍 Investigating Hampshire studio distribution...\n');

  const targetCities = ['Alton', 'Andover', 'Basingstoke', 'Eastleigh', 'Fareham', 'Gosport', 'Havant', 'Portsmouth', 'Southampton', 'Winchester'];

  const { data: existingStudios } = await supabase
    .from('pilates_studios')
    .select('name, city, county, city_slug, county_slug, is_active, address, full_url_path')
    .eq('county_slug', 'hampshire')
    .eq('is_active', true);

  console.log(`📊 Found ${existingStudios?.length || 0} existing Hampshire studios\n`);

  const cityGroups = {};
  targetCities.forEach(city => cityGroups[city] = []);

  if (existingStudios) {
    existingStudios.forEach(studio => {
      const city = studio.city || 'Unknown';
      if (cityGroups[city]) {
        cityGroups[city].push(studio);
      } else {
        if (!cityGroups.Other) cityGroups.Other = [];
        cityGroups.Other.push(studio);
      }
    });
  }

  console.log('🏙️ Hampshire Studios by Target City:');
  console.log('='.repeat(80));
  targetCities.forEach(city => {
    console.log(`${city}: ${cityGroups[city].length} studios`);
    cityGroups[city].forEach(studio => {
      console.log(`  - ${studio.name}`);
      console.log(`    Address: ${studio.address}`);
      console.log(`    URL: ${studio.full_url_path || 'Missing'}`);
    });
    console.log('');
  });

  if (cityGroups.Other && cityGroups.Other.length > 0) {
    console.log('Other locations:');
    cityGroups.Other.forEach(studio => {
      console.log(`  - ${studio.name} (${studio.city})`);
    });
    console.log('');
  }

  const emptyCities = targetCities.filter(city => cityGroups[city].length === 0);
  console.log(`❌ Cities needing studios: ${emptyCities.join(', ')}`);
  console.log(`✅ Cities with studios: ${targetCities.filter(city => cityGroups[city].length > 0).join(', ')}`);
}

investigateHampshire().catch(console.error);