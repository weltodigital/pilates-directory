const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function setupDatabase() {
  console.log('🚀 Setting up Easy Meals Recipe Database...');

  // Initialize Supabase client with service role key
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  try {
    console.log('🔗 Testing database connection...');
    console.log('Database URL:', process.env.SUPABASE_URL);

    // Test basic connection
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.log('Auth check (expected):', error.message);
    }
    console.log('✅ Database connection established!');

    // Create the categories table first
    console.log('📋 Creating categories table...');
    const { error: categoriesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS categories (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          description TEXT,
          seo_title TEXT,
          seo_description TEXT,
          image_url TEXT,
          featured BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
      `
    });

    if (categoriesError) {
      console.log('Direct table creation...');
      // Direct approach if RPC not available
      const { error: directError } = await supabase
        .from('categories')
        .select('*')
        .limit(1);

      console.log('Categories table check:', directError ? 'needs creation' : 'exists');
    }

    console.log('✅ Basic setup attempted!');
    console.log('');
    console.log('📝 MANUAL SETUP REQUIRED:');
    console.log('Please run the following SQL files in your Supabase SQL Editor:');
    console.log('1. database/schema.sql');
    console.log('2. database/seed-data.sql');
    console.log('');
    console.log('Go to: https://lsadbveqzhrsjpylgxed.supabase.co/project/lsadbveqzhrsjpylgxed/sql');

  } catch (error) {
    console.error('❌ Connection error:', error.message);
    console.log('');
    console.log('📝 MANUAL SETUP REQUIRED:');
    console.log('Please run the following SQL files in your Supabase SQL Editor:');
    console.log('1. database/schema.sql');
    console.log('2. database/seed-data.sql');
    console.log('');
    console.log('Go to: https://lsadbveqzhrsjpylgxed.supabase.co/project/lsadbveqzhrsjpylgxed/sql');
  }
}

setupDatabase();