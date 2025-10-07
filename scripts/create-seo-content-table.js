/**
 * Create SEO Content Table
 * Creates a table to store SEO-optimized content for all location pages
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createSeoContentTable() {
  console.log('🏗️  Creating SEO content table...\n');

  // Check if table already exists
  const { error: checkError } = await supabase
    .from('location_seo_content')
    .select('id')
    .limit(1);

  if (!checkError) {
    console.log('⚠️  location_seo_content table already exists');
    return;
  }

  console.log('🔧 Please create the location_seo_content table in your Supabase dashboard:');
  console.log(`
CREATE TABLE location_seo_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  location_slug TEXT NOT NULL UNIQUE,
  location_type TEXT NOT NULL CHECK (location_type IN ('county', 'city')),
  location_name TEXT NOT NULL,
  county_slug TEXT,

  -- SEO Meta Data
  meta_title TEXT NOT NULL,
  meta_description TEXT NOT NULL,
  meta_keywords TEXT[],

  -- Page Content
  h1_title TEXT NOT NULL,
  hero_description TEXT NOT NULL,
  intro_paragraph TEXT NOT NULL,
  about_location TEXT NOT NULL,
  pilates_benefits TEXT NOT NULL,
  local_info TEXT NOT NULL,

  -- Call to Actions
  cta_title TEXT NOT NULL,
  cta_description TEXT NOT NULL,

  -- FAQ Content
  faq_data JSONB DEFAULT '[]',

  -- Schema.org structured data
  schema_data JSONB,

  -- SEO Metadata
  canonical_url TEXT,
  og_title TEXT,
  og_description TEXT,
  twitter_title TEXT,
  twitter_description TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_location_seo_content_slug ON location_seo_content(location_slug);
CREATE INDEX idx_location_seo_content_type ON location_seo_content(location_type);
CREATE INDEX idx_location_seo_content_county ON location_seo_content(county_slug);

-- Function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_location_seo_content_updated_at
    BEFORE UPDATE ON location_seo_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  `);

  console.log('\n✅ Please run this SQL in your Supabase dashboard, then run this script again to populate content.');
}

// Run the script
createSeoContentTable().catch(console.error);