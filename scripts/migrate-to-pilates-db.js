/**
 * Database Migration Script
 * Copies data from butchers-directory database to pilates-directory database
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Old butchers database credentials
const OLD_SUPABASE_URL = 'https://kasctpzogieejraebawc.supabase.co';
const OLD_SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imthc2N0cHpvZ2llZWpyYWViYXdjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODgxNzI3NywiZXhwIjoyMDc0MzkzMjc3fQ.CSBjcZmQK5sy2Lmp1CPyMdrdS6hAHenfr7i5WontDyQ';

// New pilates database credentials
const NEW_SUPABASE_URL = process.env.SUPABASE_URL;
const NEW_SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const oldSupabase = createClient(OLD_SUPABASE_URL, OLD_SUPABASE_SERVICE_KEY);
const newSupabase = createClient(NEW_SUPABASE_URL, NEW_SUPABASE_SERVICE_KEY);

async function createPilatesStudiosTable() {
  console.log('🏗️  Creating pilates_studios table...');

  // Check if table already exists by trying to select from it
  const { error: checkError } = await newSupabase
    .from('pilates_studios')
    .select('id')
    .limit(1);

  if (!checkError) {
    console.log('✅ Table already exists');
    return true;
  }

  // If table doesn't exist, we need to create it manually in Supabase dashboard
  // For now, let's try to insert a test record to see what happens
  console.log('⚠️  Table does not exist. Please create the pilates_studios table in your Supabase dashboard with the following structure:');
  console.log(`
    CREATE TABLE pilates_studios (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      address TEXT,
      postcode TEXT,
      city TEXT,
      county TEXT,
      city_slug TEXT,
      county_slug TEXT,
      full_url_path TEXT,
      phone TEXT,
      email TEXT,
      website TEXT,
      latitude DECIMAL,
      longitude DECIMAL,
      google_place_id TEXT,
      google_rating DECIMAL,
      google_review_count INTEGER,
      class_types TEXT[] DEFAULT '{}',
      instructor_names TEXT[] DEFAULT '{}',
      specialties TEXT[] DEFAULT '{}',
      price_range TEXT,
      equipment_available TEXT[] DEFAULT '{}',
      opening_hours JSONB,
      images TEXT[] DEFAULT '{}',
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);

  return false;
}

async function migrateData() {
  console.log('📊 Starting data migration...\n');

  // Create table first
  const tableCreated = await createPilatesStudiosTable();
  if (!tableCreated) {
    console.error('❌ Failed to create table, aborting migration');
    return;
  }

  // Get all data from old database
  console.log('📥 Fetching data from old database...');
  const { data: oldData, error: fetchError } = await oldSupabase
    .from('pilates_studios')
    .select('*');

  if (fetchError) {
    console.error('❌ Error fetching old data:', fetchError);
    return;
  }

  console.log(`📋 Found ${oldData.length} studios to migrate\n`);

  // Check if new database already has data
  const { data: existingData, error: existingError } = await newSupabase
    .from('pilates_studios')
    .select('id')
    .limit(1);

  if (existingError && existingError.code !== 'PGRST116') {
    console.error('❌ Error checking existing data:', existingError);
    return;
  }

  if (existingData && existingData.length > 0) {
    console.log('⚠️  New database already contains data. Clearing first...');
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

  // Insert data in batches
  const batchSize = 50;
  let migrated = 0;
  let errors = 0;

  for (let i = 0; i < oldData.length; i += batchSize) {
    const batch = oldData.slice(i, i + batchSize);
    console.log(`🔄 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(oldData.length / batchSize)}...`);

    // Remove id field to let new database generate new UUIDs
    const batchData = batch.map(({ id, ...rest }) => rest);

    const { error: insertError } = await newSupabase
      .from('pilates_studios')
      .insert(batchData);

    if (insertError) {
      console.error(`❌ Error inserting batch: ${insertError.message}`);
      errors += batch.length;
    } else {
      migrated += batch.length;
      console.log(`✅ Migrated ${batch.length} studios (Total: ${migrated})`);
    }

    // Small delay between batches
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`\n📊 Migration Summary:`);
  console.log(`   ✅ Successfully migrated: ${migrated} studios`);
  console.log(`   ❌ Failed: ${errors} studios`);

  if (errors === 0) {
    console.log(`\n🎉 Migration completed successfully!`);
    console.log(`🔗 New database URL: ${NEW_SUPABASE_URL}`);
  } else {
    console.log(`\n⚠️  Migration completed with errors. Please review.`);
  }
}

// Run the migration
migrateData().catch(console.error);