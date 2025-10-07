-- Update location headings to modern, stylish pilates directory style
-- This script creates contemporary, engaging headings for the pilates directory

-- Update county-level headings with modern style
UPDATE public_locations SET
  seo_title = CASE
    WHEN type = 'county' THEN 'Discover ' || name || '''s Best Pilates Studios | PilatesUK'
  END,
  h1_title = CASE
    WHEN type = 'county' THEN 'Discover Premium Pilates in ' || name
  END,
  meta_description = CASE
    WHEN type = 'county' THEN 'Explore ' || name || '''s finest pilates studios. From reformer to mat classes, find your perfect wellness journey with expert instructors and state-of-the-art facilities.'
  END
WHERE type = 'county';

-- Update city/town-level headings with modern style
UPDATE public_locations SET
  seo_title = CASE
    WHEN type IN ('city', 'town') THEN name || ' Pilates Studios | Your Wellness Journey Starts Here'
  END,
  h1_title = CASE
    WHEN type IN ('city', 'town') THEN 'Transform Your Practice in ' || name
  END,
  meta_description = CASE
    WHEN type IN ('city', 'town') THEN 'Find exceptional pilates studios in ' || name || '. Expert-led classes, modern equipment, and a welcoming community await your wellness transformation.'
  END
WHERE type IN ('city', 'town');

-- Alternative modern heading styles (choose one set)
-- Uncomment the style you prefer:

-- Style Option 1: Wellness-focused
/*
UPDATE public_locations SET
  h1_title = CASE
    WHEN type = 'county' THEN 'Elevate Your Wellness in ' || name
    WHEN type IN ('city', 'town') THEN 'Your Pilates Sanctuary in ' || name
  END
WHERE type IN ('county', 'city', 'town');
*/

-- Style Option 2: Movement-focused
/*
UPDATE public_locations SET
  h1_title = CASE
    WHEN type = 'county' THEN 'Master Movement in ' || name
    WHEN type IN ('city', 'town') THEN 'Move. Strengthen. Thrive in ' || name
  END
WHERE type IN ('county', 'city', 'town');
*/

-- Style Option 3: Modern minimalist
/*
UPDATE public_locations SET
  h1_title = CASE
    WHEN type = 'county' THEN name || ' Pilates Collective'
    WHEN type IN ('city', 'town') THEN 'Pilates. Refined. ' || name
  END
WHERE type IN ('county', 'city', 'town');
*/

-- Style Option 4: Aspirational
/*
UPDATE public_locations SET
  h1_title = CASE
    WHEN type = 'county' THEN 'Unlock Your Potential in ' || name
    WHEN type IN ('city', 'town') THEN 'Where Strength Meets Grace in ' || name
  END
WHERE type IN ('county', 'city', 'town');
*/

-- Style Option 5: Community-focused
/*
UPDATE public_locations SET
  h1_title = CASE
    WHEN type = 'county' THEN 'Join ' || name || '''s Pilates Community'
    WHEN type IN ('city', 'town') THEN 'Connect. Strengthen. Flourish in ' || name
  END
WHERE type IN ('county', 'city', 'town');
*/

-- Update intro text with modern, engaging copy
UPDATE public_locations SET
  intro_text = CASE
    WHEN type = 'county' THEN 'Welcome to ' || name || '''s thriving pilates community. Whether you''re beginning your wellness journey or deepening your practice, discover studios that blend expert instruction with welcoming environments across ' || name || '.'
    WHEN type IN ('city', 'town') THEN 'Discover ' || name || '''s premier pilates studios where movement meets mindfulness. From dynamic reformer sessions to restorative mat classes, find your perfect practice in our carefully curated selection of local studios.'
  END
WHERE type IN ('county', 'city', 'town');

-- Update SEO descriptions with modern, benefit-focused language
UPDATE public_locations SET
  seo_description = CASE
    WHEN type = 'county' THEN 'Transform your fitness journey in ' || name || ' with premier pilates studios offering reformer classes, mat work, and specialized programs. Expert instructors, modern equipment, welcoming community.'
    WHEN type IN ('city', 'town') THEN 'Elevate your pilates practice in ' || name || '. Discover studios offering personalized instruction, cutting-edge equipment, and classes for every level. Your wellness transformation starts here.'
  END
WHERE type IN ('county', 'city', 'town');