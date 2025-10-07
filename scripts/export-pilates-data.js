/**
 * Export Pilates Data Script
 * Exports all pilates studio data from the butchers database to JSON for manual migration
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Old butchers database credentials
const OLD_SUPABASE_URL = 'https://kasctpzogieejraebawc.supabase.co';
const OLD_SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imthc2N0cHpvZ2llZWpyYWViYXdjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODgxNzI3NywiZXhwIjoyMDc0MzkzMjc3fQ.CSBjcZmQK5sy2Lmp1CPyMdrdS6hAHenfr7i5WontDyQ';

const oldSupabase = createClient(OLD_SUPABASE_URL, OLD_SUPABASE_SERVICE_KEY);

async function exportData() {
  console.log('📊 Exporting pilates studio data...\n');

  // Get all data from old database
  console.log('📥 Fetching data from butchers database...');
  const { data: studioData, error: fetchError } = await oldSupabase
    .from('pilates_studios')
    .select('*');

  if (fetchError) {
    console.error('❌ Error fetching data:', fetchError);
    return;
  }

  console.log(`📋 Found ${studioData.length} studios to export\n`);

  // Save to JSON file
  const outputPath = path.join(__dirname, 'pilates_studios_export.json');
  fs.writeFileSync(outputPath, JSON.stringify(studioData, null, 2));

  console.log('✅ Data exported successfully!');
  console.log(`📁 Saved to: ${outputPath}`);

  // Show first record as sample
  if (studioData.length > 0) {
    console.log('\n📖 Sample record:');
    console.log(JSON.stringify(studioData[0], null, 2));
  }

  console.log('\n🔧 Next steps:');
  console.log('1. Create the pilates_studios table in your new Supabase database');
  console.log('2. Run the import script to load this data');
}

// Run the export
exportData().catch(console.error);