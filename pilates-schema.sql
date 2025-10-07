-- PilatesUK Database Schema
-- Complete database schema for the pilates studio directory

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create pilates_studios table (renamed from butchers)
CREATE TABLE IF NOT EXISTS pilates_studios (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  postcode VARCHAR(10) NOT NULL,
  city VARCHAR(100) NOT NULL,
  county VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(255),
  website VARCHAR(255),
  instagram VARCHAR(255),
  facebook VARCHAR(255),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  rating DECIMAL(3, 2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 0,
  specialties TEXT[] DEFAULT '{}',
  opening_hours JSONB DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  class_types TEXT[] DEFAULT '{}',
  instructor_names TEXT[] DEFAULT '{}',
  price_range VARCHAR(50), -- e.g., "£15-25 per class"
  membership_options JSONB DEFAULT '{}',
  equipment_available TEXT[] DEFAULT '{}',
  accessibility_features TEXT[] DEFAULT '{}',
  parking_available BOOLEAN DEFAULT false,
  online_booking_available BOOLEAN DEFAULT false,
  beginner_friendly BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  google_place_id VARCHAR(255),
  google_rating DECIMAL(3, 2),
  google_review_count INTEGER DEFAULT 0,
  last_scraped_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- SEO fields
  county_slug VARCHAR(255),
  city_slug VARCHAR(255),
  full_url_path VARCHAR(500)
);

-- Create reviews table for pilates studios
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  studio_id UUID NOT NULL REFERENCES pilates_studios(id) ON DELETE CASCADE,
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  source VARCHAR(50) DEFAULT 'website', -- 'website', 'google', 'facebook', etc.
  source_review_id VARCHAR(255), -- External review ID for deduplication
  is_verified BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create specialties table for pilates-specific services
CREATE TABLE IF NOT EXISTS specialties (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  category VARCHAR(50), -- 'class_type', 'equipment', 'specialty', 'service'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create studio_specialties junction table
CREATE TABLE IF NOT EXISTS studio_specialties (
  studio_id UUID NOT NULL REFERENCES pilates_studios(id) ON DELETE CASCADE,
  specialty_id UUID NOT NULL REFERENCES specialties(id) ON DELETE CASCADE,
  PRIMARY KEY (studio_id, specialty_id)
);

-- Create class_schedules table
CREATE TABLE IF NOT EXISTS class_schedules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  studio_id UUID NOT NULL REFERENCES pilates_studios(id) ON DELETE CASCADE,
  class_name VARCHAR(255) NOT NULL,
  instructor_name VARCHAR(255),
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration_minutes INTEGER,
  level VARCHAR(50), -- 'Beginner', 'Intermediate', 'Advanced', 'All Levels'
  price DECIMAL(6, 2),
  max_capacity INTEGER,
  equipment_needed TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create instructors table
CREATE TABLE IF NOT EXISTS instructors (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  studio_id UUID NOT NULL REFERENCES pilates_studios(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  bio TEXT,
  qualifications TEXT[],
  specialties TEXT[],
  experience_years INTEGER,
  image_url VARCHAR(500),
  social_links JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pilates_studios_city ON pilates_studios(city);
CREATE INDEX IF NOT EXISTS idx_pilates_studios_county ON pilates_studios(county);
CREATE INDEX IF NOT EXISTS idx_pilates_studios_postcode ON pilates_studios(postcode);
CREATE INDEX IF NOT EXISTS idx_pilates_studios_rating ON pilates_studios(rating DESC);
CREATE INDEX IF NOT EXISTS idx_pilates_studios_location ON pilates_studios(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_pilates_studios_active ON pilates_studios(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_pilates_studios_google_place_id ON pilates_studios(google_place_id);
CREATE INDEX IF NOT EXISTS idx_reviews_studio_id ON reviews(studio_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(is_approved) WHERE is_approved = true;
CREATE INDEX IF NOT EXISTS idx_reviews_source ON reviews(source);
CREATE INDEX IF NOT EXISTS idx_class_schedules_studio_id ON class_schedules(studio_id);
CREATE INDEX IF NOT EXISTS idx_class_schedules_day_time ON class_schedules(day_of_week, start_time);
CREATE INDEX IF NOT EXISTS idx_instructors_studio_id ON instructors(studio_id);

-- Create full-text search index for pilates studios
CREATE INDEX IF NOT EXISTS idx_pilates_studios_search ON pilates_studios USING gin(
  to_tsvector('english', name || ' ' || COALESCE(description, '') || ' ' || city || ' ' || COALESCE(county, '') || ' ' || COALESCE(array_to_string(class_types, ' '), ''))
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_pilates_studios_updated_at
  BEFORE UPDATE ON pilates_studios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_class_schedules_updated_at
  BEFORE UPDATE ON class_schedules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_instructors_updated_at
  BEFORE UPDATE ON instructors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to update studio rating when reviews change
CREATE OR REPLACE FUNCTION update_studio_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the studio's rating and review count
  UPDATE pilates_studios
  SET
    rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM reviews
      WHERE studio_id = COALESCE(NEW.studio_id, OLD.studio_id)
      AND is_approved = true
    ),
    review_count = (
      SELECT COUNT(*)
      FROM reviews
      WHERE studio_id = COALESCE(NEW.studio_id, OLD.studio_id)
      AND is_approved = true
    )
  WHERE id = COALESCE(NEW.studio_id, OLD.studio_id);

  RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Create triggers to update studio ratings
CREATE TRIGGER update_studio_rating_on_review_insert
  AFTER INSERT ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_studio_rating();

CREATE TRIGGER update_studio_rating_on_review_update
  AFTER UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_studio_rating();

CREATE TRIGGER update_studio_rating_on_review_delete
  AFTER DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_studio_rating();

-- Insert pilates-specific specialties
INSERT INTO specialties (name, description, category) VALUES
  ('Mat Pilates', 'Traditional mat-based pilates exercises', 'class_type'),
  ('Reformer Pilates', 'Pilates using reformer equipment', 'class_type'),
  ('Clinical Pilates', 'Pilates for rehabilitation and injury prevention', 'class_type'),
  ('Prenatal Pilates', 'Pilates classes designed for pregnant women', 'class_type'),
  ('Postnatal Pilates', 'Pilates classes for new mothers', 'class_type'),
  ('Seniors Pilates', 'Gentle pilates classes for older adults', 'class_type'),
  ('Power Pilates', 'High-intensity pilates workouts', 'class_type'),
  ('Barre Pilates', 'Combination of ballet barre and pilates', 'class_type'),
  ('Yoga Pilates Fusion', 'Combined yoga and pilates classes', 'class_type'),
  ('Cadillac', 'Pilates using Cadillac/Trapeze Table equipment', 'equipment'),
  ('Chair', 'Pilates using Wunda Chair equipment', 'equipment'),
  ('Barrel', 'Pilates using Spine Corrector/Ladder Barrel', 'equipment'),
  ('Small Props', 'Classes using props like balls, bands, and rings', 'equipment'),
  ('Private Sessions', 'One-on-one pilates instruction', 'service'),
  ('Duet Sessions', 'Semi-private sessions for two people', 'service'),
  ('Group Classes', 'Regular group pilates classes', 'service'),
  ('Workshops', 'Special pilates workshops and training', 'service'),
  ('Teacher Training', 'Pilates instructor certification courses', 'service'),
  ('Physiotherapy Integration', 'Pilates with physiotherapy services', 'specialty'),
  ('Sports Performance', 'Pilates for athletes and sports performance', 'specialty'),
  ('Injury Rehabilitation', 'Specialized pilates for injury recovery', 'specialty'),
  ('Postural Correction', 'Focus on improving posture and alignment', 'specialty'),
  ('Stress Relief', 'Pilates classes focused on relaxation and stress reduction', 'specialty'),
  ('Weight Loss', 'Pilates programs designed for weight management', 'specialty'),
  ('Flexibility', 'Classes emphasizing flexibility and mobility', 'specialty'),
  ('Core Strength', 'Intensive core strengthening programs', 'specialty'),
  ('Balance Training', 'Programs focusing on balance and stability', 'specialty'),
  ('Mind-Body Connection', 'Emphasis on mindful movement and awareness', 'specialty'),
  ('Beginner Friendly', 'Welcoming environment for pilates beginners', 'service'),
  ('APPI Certified', 'Australian Physiotherapy & Pilates Institute certified', 'specialty'),
  ('Stott Pilates', 'Following Stott Pilates methodology', 'specialty'),
  ('Classical Pilates', 'Traditional Joseph Pilates method', 'specialty'),
  ('Contemporary Pilates', 'Modern pilates incorporating current research', 'specialty')
ON CONFLICT (name) DO NOTHING;

-- Create locations table for SEO landing pages (pilates-focused)
CREATE TABLE IF NOT EXISTS locations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('city', 'town', 'county', 'region')),
  county VARCHAR(100),
  county_slug VARCHAR(255),
  region VARCHAR(100),
  country VARCHAR(50) DEFAULT 'United Kingdom',
  population INTEGER,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  postcode_areas TEXT[] DEFAULT '{}',
  studio_count INTEGER DEFAULT 0,
  -- SEO fields
  seo_title VARCHAR(255),
  seo_description TEXT,
  seo_keywords TEXT[] DEFAULT '{}',
  meta_description TEXT,
  h1_title VARCHAR(255),
  intro_text TEXT,
  main_content TEXT,
  faq_content JSONB DEFAULT '{}',
  local_specialties TEXT[] DEFAULT '{}',
  nearby_locations TEXT[] DEFAULT '{}',
  -- Pilates-specific content
  local_pilates_scene TEXT,
  average_class_price VARCHAR(50),
  popular_class_types TEXT[] DEFAULT '{}',
  featured_studios TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- URL path for nested routes
  full_path VARCHAR(500) -- e.g., "london/central-london" or "manchester"
);

-- Create a view that combines studio counts with locations
CREATE OR REPLACE VIEW public_locations AS
SELECT
  l.*,
  COALESCE(studio_counts.studio_count, 0) as butcher_count -- Keep same name for compatibility
FROM locations l
LEFT JOIN (
  SELECT
    CASE
      WHEN l.type = 'county' THEN l.slug
      ELSE l.county_slug
    END as location_key,
    COUNT(ps.id) as studio_count
  FROM locations l
  LEFT JOIN pilates_studios ps ON (
    (l.type = 'county' AND ps.county_slug = l.slug) OR
    (l.type IN ('city', 'town') AND ps.city_slug = l.slug)
  )
  WHERE ps.is_active = true
  GROUP BY
    CASE
      WHEN l.type = 'county' THEN l.slug
      ELSE l.county_slug
    END
) studio_counts ON (
  (l.type = 'county' AND studio_counts.location_key = l.slug) OR
  (l.type IN ('city', 'town') AND studio_counts.location_key = l.county_slug)
)
WHERE l.is_active = true;

-- Create views for public access
CREATE OR REPLACE VIEW public_pilates_studios AS
SELECT
  id,
  name,
  description,
  address,
  postcode,
  city,
  county,
  phone,
  email,
  website,
  instagram,
  facebook,
  latitude,
  longitude,
  rating,
  review_count,
  specialties,
  opening_hours,
  images,
  class_types,
  instructor_names,
  price_range,
  membership_options,
  equipment_available,
  accessibility_features,
  parking_available,
  online_booking_available,
  beginner_friendly,
  is_verified,
  google_rating,
  google_review_count,
  county_slug,
  city_slug,
  full_url_path,
  created_at,
  updated_at
FROM pilates_studios
WHERE is_active = true;

-- Create a view for public reviews (only approved reviews)
CREATE OR REPLACE VIEW public_reviews AS
SELECT
  id,
  studio_id,
  user_name,
  rating,
  title,
  comment,
  source,
  created_at
FROM reviews
WHERE is_approved = true;

-- Grant necessary permissions
GRANT SELECT ON public_pilates_studios TO anon, authenticated;
GRANT SELECT ON public_reviews TO anon, authenticated;
GRANT SELECT ON public_locations TO anon, authenticated;
GRANT SELECT ON specialties TO anon, authenticated;
GRANT SELECT ON studio_specialties TO anon, authenticated;
GRANT SELECT ON class_schedules TO anon, authenticated;
GRANT SELECT ON instructors TO anon, authenticated;

-- Grant insert permissions for reviews (for public submissions)
GRANT INSERT ON reviews TO anon, authenticated;
GRANT SELECT ON pilates_studios TO anon, authenticated;

-- Create RLS (Row Level Security) policies
ALTER TABLE pilates_studios ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE studio_specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active studios
CREATE POLICY "Allow public read access to active studios" ON pilates_studios
  FOR SELECT USING (is_active = true);

-- Allow public read access to approved reviews
CREATE POLICY "Allow public read access to approved reviews" ON reviews
  FOR SELECT USING (is_approved = true);

-- Allow public insert for reviews (for customer reviews)
CREATE POLICY "Allow public insert for reviews" ON reviews
  FOR INSERT WITH CHECK (true);

-- Allow public read access to specialties
CREATE POLICY "Allow public read access to specialties" ON specialties
  FOR SELECT USING (true);

-- Allow public read access to studio_specialties
CREATE POLICY "Allow public read access to studio_specialties" ON studio_specialties
  FOR SELECT USING (true);

-- Allow public read access to class schedules
CREATE POLICY "Allow public read access to class schedules" ON class_schedules
  FOR SELECT USING (is_active = true);

-- Allow public read access to instructors
CREATE POLICY "Allow public read access to instructors" ON instructors
  FOR SELECT USING (is_active = true);

-- Allow public read access to active locations
CREATE POLICY "Allow public read access to active locations" ON locations
  FOR SELECT USING (is_active = true);