-- Create pilates_studios table to store individual studio data
CREATE TABLE pilates_studios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Basic Information
  name VARCHAR(255) NOT NULL,
  description TEXT,

  -- Location Data
  address TEXT,
  postcode VARCHAR(20),
  city VARCHAR(100),
  county VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),

  -- Contact Information
  phone VARCHAR(50),
  email VARCHAR(255),
  website VARCHAR(255),

  -- Google Maps Data
  google_place_id VARCHAR(255) UNIQUE,
  google_rating DECIMAL(3, 2),
  google_review_count INTEGER DEFAULT 0,

  -- Business Information
  is_active BOOLEAN DEFAULT true,
  opening_hours JSONB DEFAULT '{}',

  -- Pilates-Specific Data
  class_types TEXT[] DEFAULT ARRAY['Mat Pilates', 'Reformer Pilates'],
  instructor_names TEXT[] DEFAULT ARRAY[]::TEXT[],
  specialties TEXT[] DEFAULT ARRAY[]::TEXT[],
  price_range VARCHAR(100),
  equipment_available TEXT[] DEFAULT ARRAY['Reformers', 'Mats'],

  -- SEO and URL Structure
  county_slug VARCHAR(100),
  city_slug VARCHAR(100),
  full_url_path VARCHAR(500),

  -- Metadata
  last_scraped_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_pilates_studios_city ON pilates_studios(city);
CREATE INDEX idx_pilates_studios_county ON pilates_studios(county);
CREATE INDEX idx_pilates_studios_postcode ON pilates_studios(postcode);
CREATE INDEX idx_pilates_studios_google_place_id ON pilates_studios(google_place_id);
CREATE INDEX idx_pilates_studios_is_active ON pilates_studios(is_active);
CREATE INDEX idx_pilates_studios_county_slug ON pilates_studios(county_slug);
CREATE INDEX idx_pilates_studios_city_slug ON pilates_studios(city_slug);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pilates_studios_updated_at
    BEFORE UPDATE ON pilates_studios
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE pilates_studios ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON pilates_studios
    FOR SELECT TO anon, authenticated
    USING (is_active = true);

-- Create policy to allow service role full access
CREATE POLICY "Allow service role full access" ON pilates_studios
    FOR ALL TO service_role
    USING (true);