-- Update all location data from butchers to pilates theme
-- This script updates seo_title, h1_title, meta_description, and content fields

-- Update county-level data
UPDATE public_locations SET
  seo_title = REPLACE(REPLACE(REPLACE(seo_title, 'Butcher', 'Pilates Studio'), 'butcher', 'pilates studio'), 'Butchers', 'Pilates Studios'),
  h1_title = REPLACE(REPLACE(REPLACE(h1_title, 'Butcher', 'Pilates Studio'), 'butcher', 'pilates studio'), 'Butchers', 'Pilates Studios'),
  meta_description = REPLACE(REPLACE(REPLACE(meta_description, 'Butcher', 'Pilates Studio'), 'butcher', 'pilates studio'), 'Butchers', 'Pilates Studios'),
  seo_description = REPLACE(REPLACE(REPLACE(seo_description, 'Butcher', 'Pilates Studio'), 'butcher', 'pilates studio'), 'Butchers', 'Pilates Studios'),
  intro_text = REPLACE(REPLACE(REPLACE(intro_text, 'Butcher', 'Pilates Studio'), 'butcher', 'pilates studio'), 'Butchers', 'Pilates Studios'),
  main_content = REPLACE(REPLACE(REPLACE(main_content, 'Butcher', 'Pilates Studio'), 'butcher', 'pilates studio'), 'Butchers', 'Pilates Studios')
WHERE type = 'county';

-- Update city/town-level data
UPDATE public_locations SET
  seo_title = REPLACE(REPLACE(REPLACE(seo_title, 'Butcher', 'Pilates Studio'), 'butcher', 'pilates studio'), 'Butchers', 'Pilates Studios'),
  h1_title = REPLACE(REPLACE(REPLACE(h1_title, 'Butcher', 'Pilates Studio'), 'butcher', 'pilates studio'), 'Butchers', 'Pilates Studios'),
  meta_description = REPLACE(REPLACE(REPLACE(meta_description, 'Butcher', 'Pilates Studio'), 'butcher', 'pilates studio'), 'Butchers', 'Pilates Studios'),
  seo_description = REPLACE(REPLACE(REPLACE(seo_description, 'Butcher', 'Pilates Studio'), 'butcher', 'pilates studio'), 'Butchers', 'Pilates Studios'),
  intro_text = REPLACE(REPLACE(REPLACE(intro_text, 'Butcher', 'Pilates Studio'), 'butcher', 'pilates studio'), 'Butchers', 'Pilates Studios'),
  main_content = REPLACE(REPLACE(REPLACE(main_content, 'Butcher', 'Pilates Studio'), 'butcher', 'pilates studio'), 'Butchers', 'Pilates Studios')
WHERE type IN ('city', 'town');

-- More specific replacements for better SEO
UPDATE public_locations SET
  seo_title = REPLACE(REPLACE(seo_title, 'meat', 'pilates classes'), 'Meat', 'Pilates Classes'),
  h1_title = REPLACE(REPLACE(h1_title, 'meat', 'pilates classes'), 'Meat', 'Pilates Classes'),
  meta_description = REPLACE(REPLACE(meta_description, 'meat', 'pilates classes'), 'Meat', 'Pilates Classes'),
  intro_text = REPLACE(REPLACE(intro_text, 'meat', 'pilates classes'), 'Meat', 'Pilates Classes'),
  main_content = REPLACE(REPLACE(main_content, 'meat', 'pilates classes'), 'Meat', 'Pilates Classes')
WHERE type IN ('county', 'city', 'town');

-- Replace food-related terms with pilates terms
UPDATE public_locations SET
  seo_title = REPLACE(REPLACE(REPLACE(seo_title, 'fresh food', 'fitness classes'), 'quality food', 'quality instruction'), 'local food', 'local pilates'),
  meta_description = REPLACE(REPLACE(REPLACE(meta_description, 'fresh food', 'fitness classes'), 'quality food', 'quality instruction'), 'local food', 'local pilates'),
  intro_text = REPLACE(REPLACE(REPLACE(intro_text, 'fresh food', 'fitness classes'), 'quality food', 'quality instruction'), 'local food', 'local pilates'),
  main_content = REPLACE(REPLACE(REPLACE(main_content, 'fresh food', 'fitness classes'), 'quality food', 'quality instruction'), 'local food', 'local pilates')
WHERE type IN ('county', 'city', 'town');

-- Update specific pilates-focused titles for better SEO
UPDATE public_locations SET
  seo_title = CASE
    WHEN seo_title IS NULL OR seo_title = '' THEN name || ' Pilates Studios | Find Pilates Classes Near Me | PilatesUK'
    ELSE seo_title
  END,
  h1_title = CASE
    WHEN h1_title IS NULL OR h1_title = '' THEN 'Pilates Studios in ' || name || ' | Find Pilates Classes Near You'
    ELSE h1_title
  END,
  meta_description = CASE
    WHEN meta_description IS NULL OR meta_description = '' THEN 'Find the best pilates studios in ' || name || '. Browse reformer, mat & clinical pilates classes. Read reviews, check schedules & book online.'
    ELSE meta_description
  END
WHERE type = 'county';

UPDATE public_locations SET
  seo_title = CASE
    WHEN seo_title IS NULL OR seo_title = '' THEN name || ' Pilates Studios | Pilates Near Me | PilatesUK'
    ELSE seo_title
  END,
  h1_title = CASE
    WHEN h1_title IS NULL OR h1_title = '' THEN 'Pilates Studios in ' || name || ' | Pilates Near Me'
    ELSE h1_title
  END,
  meta_description = CASE
    WHEN meta_description IS NULL OR meta_description = '' THEN 'Find the best pilates studios in ' || name || '. Browse reformer, mat & clinical pilates classes near you. Read reviews, check schedules & book online.'
    ELSE meta_description
  END
WHERE type IN ('city', 'town');

-- Add pilates-specific keywords to seo_keywords
UPDATE public_locations SET
  seo_keywords = ARRAY[
    name || ' pilates',
    name || ' pilates studios',
    name || ' pilates classes',
    name || ' pilates near me',
    name || ' reformer pilates',
    name || ' mat pilates',
    name || ' clinical pilates',
    'pilates ' || LOWER(name),
    'pilates studios ' || LOWER(name),
    'pilates classes ' || LOWER(name)
  ]
WHERE type IN ('county', 'city', 'town');

-- Update intro_text to be pilates-focused for locations without custom content
UPDATE public_locations SET
  intro_text = CASE
    WHEN type = 'county' THEN 'Welcome to the comprehensive guide to pilates studios in ' || name || '. Whether you''re looking for reformer pilates, mat classes, clinical pilates, or specialized programs, our directory features the best studios across ' || name || ' with verified reviews, class schedules, and online booking options.'
    WHEN type IN ('city', 'town') THEN 'Discover exceptional pilates studios in ' || name || '. From beginner-friendly mat classes to advanced reformer sessions, find certified instructors and welcoming environments perfect for your pilates journey.'
    ELSE intro_text
  END
WHERE intro_text IS NULL OR intro_text = '' OR intro_text ILIKE '%butcher%' OR intro_text ILIKE '%meat%';