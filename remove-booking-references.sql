-- Remove all booking-related content from the pilates directory
-- This script removes references to booking, trial classes, and online booking

UPDATE public_locations SET
  main_content = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(main_content,
    'Book your trial class today!', 'Find your perfect studio today!'),
    'book your trial class', 'visit your chosen studio'),
    'Book online', 'Contact directly'),
    'online booking', 'direct contact'),
    'advance booking', 'direct contact'),
    'book in advance', 'contact the studio'),
    'booking required', 'contact required'),
    'Trial classes', 'Introductory sessions'),
    'trial class', 'introductory session'),
    'book online', 'contact studio')
WHERE type IN ('county', 'city', 'town');

-- Update specific booking-related phrases
UPDATE public_locations SET
  main_content = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(main_content,
    'Take advantage of introductory offers before committing', 'Visit studios to learn about their programs'),
    'Most studios offer trial classes or beginner packages', 'Most studios welcome new students with orientation sessions'),
    'Browse our curated selection of', 'Explore our directory of'),
    'Book your trial class today', 'Contact your preferred studio today'),
    'advance booking as class sizes are limited', 'contacting studios directly as class sizes are limited'),
    'require advance booking', 'recommend calling ahead'),
    'book in advance?', 'contact in advance?')
WHERE type IN ('county', 'city', 'town');

-- Update FAQ content to remove booking references
UPDATE public_locations SET
  faq_content = jsonb_set(
    faq_content,
    '{Do I need to book in advance?}',
    '"Yes, most pilates studios recommend calling or contacting them directly as class sizes are limited for personalized attention."'::jsonb
  )
WHERE faq_content ? 'Do I need to book in advance?' AND type IN ('county', 'city', 'town');

-- Update meta descriptions to remove booking language
UPDATE public_locations SET
  meta_description = REPLACE(REPLACE(REPLACE(meta_description,
    'Book your trial class today!', 'Find your perfect studio today!'),
    'book online', 'contact studios'),
    'booking', 'information')
WHERE type IN ('county', 'city', 'town');

-- Update seo descriptions
UPDATE public_locations SET
  seo_description = REPLACE(REPLACE(REPLACE(seo_description,
    'book online', 'contact directly'),
    'booking', 'information'),
    'Book your', 'Find your')
WHERE type IN ('county', 'city', 'town');

-- Update intro text
UPDATE public_locations SET
  intro_text = REPLACE(REPLACE(REPLACE(intro_text,
    'book online', 'contact studios'),
    'booking options', 'contact information'),
    'online booking', 'direct contact')
WHERE type IN ('county', 'city', 'town');

-- Clean up any remaining booking references
UPDATE public_locations SET
  main_content = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(main_content,
    'online booking available', 'direct contact available'),
    'booking process', 'contact process'),
    'to book', 'to contact'),
    'booking information', 'contact information'),
    'class booking', 'class information')
WHERE type IN ('county', 'city', 'town');

-- Update the final call-to-action section
UPDATE public_locations SET
  main_content = REPLACE(main_content,
    'Each listing includes class schedules, pricing, instructor profiles, and real customer reviews to help you make the perfect choice for your wellness journey.',
    'Each listing includes studio information, class details, instructor profiles, and contact details to help you make the perfect choice for your wellness journey.')
WHERE type IN ('county', 'city', 'town');

-- Remove any remaining "book" references in various contexts
UPDATE public_locations SET
  main_content = REPLACE(REPLACE(REPLACE(REPLACE(main_content,
    ' and book online', ' and contact directly'),
    ', book online', ', contact studios'),
    'Read reviews, check schedules & book online', 'Read reviews, check schedules & contact studios'),
    'browse, compare, and book', 'browse, compare, and contact')
WHERE type IN ('county', 'city', 'town');