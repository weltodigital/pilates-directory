/**
 * Import Pilates Data Script
 * Imports pilates studio data from JSON export into the new pilates-directory database
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// New pilates database credentials
const NEW_SUPABASE_URL = process.env.SUPABASE_URL;
const NEW_SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const newSupabase = createClient(NEW_SUPABASE_URL, NEW_SUPABASE_SERVICE_KEY);

async function importData() {
  console.log('📊 Starting data import to pilates-directory database...\n');

  // Read the exported data
  const exportPath = path.join(__dirname, 'pilates_studios_export.json');
  if (!fs.existsSync(exportPath)) {
    console.error('❌ Export file not found. Please run export script first.');
    return;
  }

  const studioData = JSON.parse(fs.readFileSync(exportPath, 'utf8'));
  console.log(`📋 Found ${studioData.length} studios to import\n`);

  // Check if table exists and is empty
  const { data: existingData, error: checkError } = await newSupabase
    .from('pilates_studios')
    .select('id')
    .limit(1);

  if (checkError) {
    console.error('❌ Error checking table:', checkError);
    console.log('Make sure you created the pilates_studios table in Supabase dashboard');
    return;
  }

  if (existingData && existingData.length > 0) {
    console.log('⚠️  Database already contains data. Clearing first...');
    const { error: deleteError } = await newSupabase
      .from('pilates_studios')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) {
      console.error('❌ Error clearing existing data:', deleteError);
      return;
    }
    console.log('✅ Existing data cleared\n');
  }

  // Prepare data for import (remove id to let new database generate new UUIDs)
  const importData = studioData.map(({ id, ...rest }) => rest);

  // Insert data in batches
  const batchSize = 25;
  let imported = 0;
  let errors = 0;

  for (let i = 0; i < importData.length; i += batchSize) {
    const batch = importData.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(importData.length / batchSize);

    console.log(`🔄 Processing batch ${batchNum}/${totalBatches} (${batch.length} studios)...`);

    const { error: insertError } = await newSupabase
      .from('pilates_studios')
      .insert(batch);

    if (insertError) {
      console.error(`❌ Error inserting batch ${batchNum}:`, insertError.message);
      errors += batch.length;
    } else {
      imported += batch.length;
      console.log(`✅ Successfully imported batch ${batchNum} (${batch.length} studios)`);
    }

    // Small delay between batches
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log(`\n📊 Import Summary:`);
  console.log(`   ✅ Successfully imported: ${imported} studios`);
  console.log(`   ❌ Failed: ${errors} studios`);
  console.log(`   🗄️  Total in database: ${imported}`);

  if (errors === 0) {
    console.log(`\n🎉 Import completed successfully!`);
    console.log(`🔗 New pilates database: ${NEW_SUPABASE_URL}`);
    console.log(`\n🔧 Next steps:`);
    console.log(`   1. Test the website with new database`);
    console.log(`   2. Update any remaining references to old database`);
    console.log(`   3. Verify all functionality works correctly`);
  } else {
    console.log(`\n⚠️  Import completed with errors. Please review.`);
  }
}

// Run the import
importData().catch(console.error);