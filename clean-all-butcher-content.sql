-- Comprehensive script to clean all butcher content and replace with proper pilates content
-- This script removes ALL traces of butcher-related content and creates SEO-optimized pilates content

-- First, remove problematic mixed content that resulted from previous replacements
UPDATE public_locations SET
  seo_title = REPLACE(REPLACE(seo_title, 'pilates studio shops', 'pilates studios'), 'Pilates Studio shops', 'Pilates studios'),
  h1_title = REPLACE(REPLACE(h1_title, 'pilates studio shops', 'pilates studios'), 'Pilates Studio shops', 'Pilates studios'),
  meta_description = REPLACE(REPLACE(meta_description, 'pilates studio shops', 'pilates studios'), 'Pilates Studio shops', 'Pilates studios'),
  seo_description = REPLACE(REPLACE(seo_description, 'pilates studio shops', 'pilates studios'), 'Pilates Studio shops', 'Pilates studios'),
  intro_text = REPLACE(REPLACE(intro_text, 'pilates studio shops', 'pilates studios'), 'Pilates Studio shops', 'Pilates studios'),
  main_content = REPLACE(REPLACE(main_content, 'pilates studio shops', 'pilates studios'), 'Pilates Studio shops', 'Pilates studios')
WHERE type IN ('county', 'city', 'town');

-- Remove meat and food-related terms that slipped through
UPDATE public_locations SET
  seo_title = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(seo_title,
    'beef', 'pilates classes'),
    'pork', 'reformer classes'),
    'sausages', 'mat classes'),
    'meat', 'pilates instruction'),
    'cuts', 'classes'),
    'butcher', 'pilates studio'),
  h1_title = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(h1_title,
    'beef', 'pilates classes'),
    'pork', 'reformer classes'),
    'sausages', 'mat classes'),
    'meat', 'pilates instruction'),
    'cuts', 'classes'),
    'butcher', 'pilates studio'),
  meta_description = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(meta_description,
    'beef', 'pilates classes'),
    'pork', 'reformer classes'),
    'sausages', 'mat classes'),
    'meat', 'pilates instruction'),
    'cuts', 'classes'),
    'butcher', 'pilates studio'),
  seo_description = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(seo_description,
    'beef', 'pilates classes'),
    'pork', 'reformer classes'),
    'sausages', 'mat classes'),
    'meat', 'pilates instruction'),
    'cuts', 'classes'),
    'butcher', 'pilates studio'),
  intro_text = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(intro_text,
    'beef', 'pilates classes'),
    'pork', 'reformer classes'),
    'sausages', 'mat classes'),
    'meat', 'pilates instruction'),
    'cuts', 'classes'),
    'butcher', 'pilates studio'),
  main_content = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(main_content,
    'beef', 'pilates classes'),
    'pork', 'reformer classes'),
    'sausages', 'mat classes'),
    'meat', 'pilates instruction'),
    'cuts', 'classes'),
    'butcher', 'pilates studio')
WHERE type IN ('county', 'city', 'town');

-- Remove more specific butcher-related terms
UPDATE public_locations SET
  seo_title = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(seo_title,
    'traditional farming', 'wellness practices'),
    'agricultural heritage', 'fitness heritage'),
    'market towns', 'wellness communities'),
    'specialise in', 'offer'),
    'traditional craftsmanship', 'expert instruction'),
    'everyday essentials', 'daily practice'),
    'special occasion cuts', 'specialized programs'),
  h1_title = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(h1_title,
    'traditional farming', 'wellness practices'),
    'agricultural heritage', 'fitness heritage'),
    'market towns', 'wellness communities'),
    'specialise in', 'offer'),
    'traditional craftsmanship', 'expert instruction'),
    'everyday essentials', 'daily practice'),
    'special occasion cuts', 'specialized programs'),
  meta_description = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(meta_description,
    'traditional farming', 'wellness practices'),
    'agricultural heritage', 'fitness heritage'),
    'market towns', 'wellness communities'),
    'specialise in', 'offer'),
    'traditional craftsmanship', 'expert instruction'),
    'everyday essentials', 'daily practice'),
    'special occasion cuts', 'specialized programs'),
  seo_description = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(seo_description,
    'traditional farming', 'wellness practices'),
    'agricultural heritage', 'fitness heritage'),
    'market towns', 'wellness communities'),
    'specialise in', 'offer'),
    'traditional craftsmanship', 'expert instruction'),
    'everyday essentials', 'daily practice'),
    'special occasion cuts', 'specialized programs'),
  intro_text = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(intro_text,
    'traditional farming', 'wellness practices'),
    'agricultural heritage', 'fitness heritage'),
    'market towns', 'wellness communities'),
    'specialise in', 'offer'),
    'traditional craftsmanship', 'expert instruction'),
    'everyday essentials', 'daily practice'),
    'special occasion cuts', 'specialized programs'),
  main_content = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(main_content,
    'traditional farming', 'wellness practices'),
    'agricultural heritage', 'fitness heritage'),
    'market towns', 'wellness communities'),
    'specialise in', 'offer'),
    'traditional craftsmanship', 'expert instruction'),
    'everyday essentials', 'daily practice'),
    'special occasion cuts', 'specialized programs')
WHERE type IN ('county', 'city', 'town');

-- Clean up more food-related terms
UPDATE public_locations SET
  seo_title = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(seo_title,
    'local produce', 'local wellness'),
    'fresh produce', 'fresh approaches'),
    'quality produce', 'quality instruction'),
    'farm fresh', 'studio fresh'),
    'organic produce', 'holistic practices'),
  h1_title = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(h1_title,
    'local produce', 'local wellness'),
    'fresh produce', 'fresh approaches'),
    'quality produce', 'quality instruction'),
    'farm fresh', 'studio fresh'),
    'organic produce', 'holistic practices'),
  meta_description = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(meta_description,
    'local produce', 'local wellness'),
    'fresh produce', 'fresh approaches'),
    'quality produce', 'quality instruction'),
    'farm fresh', 'studio fresh'),
    'organic produce', 'holistic practices'),
  seo_description = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(seo_description,
    'local produce', 'local wellness'),
    'fresh produce', 'fresh approaches'),
    'quality produce', 'quality instruction'),
    'farm fresh', 'studio fresh'),
    'organic produce', 'holistic practices'),
  intro_text = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(intro_text,
    'local produce', 'local wellness'),
    'fresh produce', 'fresh approaches'),
    'quality produce', 'quality instruction'),
    'farm fresh', 'studio fresh'),
    'organic produce', 'holistic practices'),
  main_content = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(main_content,
    'local produce', 'local wellness'),
    'fresh produce', 'fresh approaches'),
    'quality produce', 'quality instruction'),
    'farm fresh', 'studio fresh'),
    'organic produce', 'holistic practices')
WHERE type IN ('county', 'city', 'town');

-- Now create proper pilates-focused content for counties
UPDATE public_locations SET
  h1_title = 'Discover Premium Pilates Studios in ' || name,
  seo_title = 'Best Pilates Studios in ' || name || ' | Find Pilates Classes Near You | PilatesUK',
  meta_description = 'Find the finest pilates studios in ' || name || '. Browse reformer, mat, and clinical pilates classes with expert instructors. Read reviews and book online.',
  intro_text = 'Welcome to ' || name || '''s thriving pilates community. Whether you''re beginning your wellness journey or deepening your practice, discover studios that blend expert instruction with welcoming environments across ' || name || '.',
  seo_description = 'Transform your fitness journey in ' || name || ' with premier pilates studios offering reformer classes, mat work, and specialized programs. Expert instructors, modern equipment, welcoming community.',
  main_content = CASE
    WHEN main_content IS NULL OR main_content = '' OR main_content ILIKE '%butcher%' OR main_content ILIKE '%meat%' OR main_content ILIKE '%beef%' THEN
      '## Why Choose Pilates in ' || name || '?

Pilates has become increasingly popular in ' || name || ' thanks to its incredible benefits for both physical and mental wellbeing. Whether you''re looking to improve core strength, enhance flexibility, or find stress relief, our directory features the best pilates studios across ' || name || '.

### Types of Pilates Available in ' || name || '

**Mat Pilates**: Traditional floor-based exercises using your body weight for resistance
**Reformer Pilates**: Equipment-based classes offering variable resistance and support
**Clinical Pilates**: Specialized sessions for injury rehabilitation and prevention
**Prenatal Pilates**: Safe, modified classes for expecting mothers
**Senior Pilates**: Gentle, adapted sessions for older adults

### What to Expect at ' || name || ' Pilates Studios

- **Expert Instruction**: Certified pilates instructors with years of experience
- **Modern Equipment**: State-of-the-art reformers, cadillacs, and props
- **Welcoming Environment**: Studios designed to make everyone feel comfortable
- **Flexible Scheduling**: Classes available throughout the day to fit your lifestyle
- **Beginner Friendly**: Special programs for those new to pilates

### Benefits of Regular Pilates Practice

- Improved core strength and stability
- Enhanced flexibility and mobility
- Better posture and alignment
- Reduced stress and increased mindfulness
- Injury prevention and rehabilitation
- Increased energy and vitality

Start your pilates journey today by exploring the exceptional studios featured in our ' || name || ' directory.'
    ELSE main_content
  END
WHERE type = 'county';

-- Create proper pilates-focused content for cities and towns
UPDATE public_locations SET
  h1_title = 'Transform Your Practice in ' || name,
  seo_title = name || ' Pilates Studios | Your Wellness Journey Starts Here | PilatesUK',
  meta_description = 'Find exceptional pilates studios in ' || name || '. Expert-led classes, modern equipment, and a welcoming community await your wellness transformation.',
  intro_text = 'Discover ' || name || '''s premier pilates studios where movement meets mindfulness. From dynamic reformer sessions to restorative mat classes, find your perfect practice in our carefully curated selection of local studios.',
  seo_description = 'Elevate your pilates practice in ' || name || '. Discover studios offering personalized instruction, cutting-edge equipment, and classes for every level. Your wellness transformation starts here.',
  main_content = CASE
    WHEN main_content IS NULL OR main_content = '' OR main_content ILIKE '%butcher%' OR main_content ILIKE '%meat%' OR main_content ILIKE '%beef%' THEN
      '## Your Complete Guide to Pilates in ' || name || '

' || name || ' offers an exceptional selection of pilates studios catering to all levels and preferences. Whether you''re a complete beginner or an experienced practitioner, you''ll find the perfect studio to support your wellness journey.

### Finding the Right Pilates Studio in ' || name || '

When choosing a pilates studio, consider:

- **Class Types**: Mat, reformer, clinical, or specialized programs
- **Instructor Qualifications**: Look for certified, experienced professionals
- **Studio Atmosphere**: Find an environment where you feel comfortable
- **Equipment Quality**: Modern, well-maintained apparatus
- **Schedule Flexibility**: Classes that fit your lifestyle
- **Location**: Convenient access from home or work

### Popular Pilates Styles in ' || name || '

**Classical Pilates**: Traditional method following Joseph Pilates'' original teachings
**Contemporary Pilates**: Modern approach incorporating current movement science
**STOTT PILATES**: Anatomically-based method focusing on postural alignment
**Clinical Pilates**: Rehabilitation-focused practice led by physiotherapists

### What Makes ' || name || ' Pilates Studios Special

Our featured studios in ' || name || ' are selected for their commitment to excellence:

- Highly qualified, passionate instructors
- Comprehensive class offerings for all levels
- State-of-the-art equipment and facilities
- Strong sense of community and support
- Flexible membership options
- Clean, welcoming environments

### Getting Started with Pilates in ' || name || '

1. **Choose Your Style**: Decide between mat or equipment-based classes
2. **Book a Trial**: Most studios offer introductory packages
3. **Come Prepared**: Wear comfortable, fitted clothing
4. **Communicate**: Share any injuries or concerns with your instructor
5. **Be Patient**: Pilates is a journey - results come with consistent practice

Ready to begin your pilates journey? Explore our curated selection of ' || name || ' studios and find your perfect match for wellness and transformation.'
    ELSE main_content
  END
WHERE type IN ('city', 'town');

-- Update FAQ content to be pilates-focused
UPDATE public_locations SET
  faq_content = jsonb_build_object(
    'What is pilates?', 'Pilates is a low-impact exercise method that focuses on strengthening the core, improving flexibility, and enhancing overall body awareness through controlled movements.',
    'Is pilates suitable for beginners?', 'Absolutely! Most studios in ' || name || ' offer beginner-friendly classes with modified exercises and patient instruction to help you build confidence and strength.',
    'What should I wear to pilates?', 'Wear comfortable, fitted clothing that allows for full range of movement. Avoid loose clothing that might get caught in equipment. Most studios provide mats and props.',
    'How often should I do pilates?', 'For best results, aim for 2-3 pilates sessions per week. This allows your body to build strength and flexibility while giving adequate recovery time.',
    'What''s the difference between mat and reformer pilates?', 'Mat pilates uses body weight for resistance and is performed on a mat, while reformer pilates uses a specialized machine with springs and pulleys for variable resistance.',
    'Do I need to book in advance?', 'Yes, most pilates studios in ' || name || ' require advance booking as class sizes are typically limited to ensure personalized attention.',
    'What are the benefits of pilates?', 'Pilates improves core strength, flexibility, posture, balance, and body awareness. It can also help reduce stress, prevent injuries, and enhance overall wellbeing.',
    'Can pilates help with back pain?', 'Clinical pilates, offered by many studios in ' || name || ', can be very effective for back pain management when practiced under qualified instruction.'
  )
WHERE (faq_content IS NULL OR faq_content::text ILIKE '%butcher%' OR faq_content::text ILIKE '%meat%')
  AND type IN ('county', 'city', 'town');

-- Clean up any remaining problematic terms
UPDATE public_locations SET
  seo_title = REPLACE(REPLACE(REPLACE(REPLACE(seo_title,
    'shop', 'studio'),
    'finest', 'best'),
    'local', ''),
    'Find A', 'Find'),
  h1_title = REPLACE(REPLACE(REPLACE(REPLACE(h1_title,
    'shop', 'studio'),
    'finest', 'best'),
    'local', ''),
    'Find A', 'Find'),
  meta_description = REPLACE(REPLACE(REPLACE(REPLACE(meta_description,
    'shop', 'studio'),
    'finest', 'best'),
    'local', ''),
    'Find A', 'Find'),
  seo_description = REPLACE(REPLACE(REPLACE(REPLACE(seo_description,
    'shop', 'studio'),
    'finest', 'best'),
    'local', ''),
    'Find A', 'Find'),
  intro_text = REPLACE(REPLACE(REPLACE(REPLACE(intro_text,
    'shop', 'studio'),
    'finest', 'best'),
    'local', ''),
    'Find A', 'Find'),
  main_content = REPLACE(REPLACE(REPLACE(REPLACE(main_content,
    'shop', 'studio'),
    'finest', 'best'),
    'local', ''),
    'Find A', 'Find')
WHERE type IN ('county', 'city', 'town');

-- Final cleanup - remove any remaining inconsistencies
UPDATE public_locations SET
  seo_title = TRIM(REPLACE(REPLACE(seo_title, '  ', ' '), 'Pilates Studios Studios', 'Pilates Studios')),
  h1_title = TRIM(REPLACE(REPLACE(h1_title, '  ', ' '), 'Pilates Studios Studios', 'Pilates Studios')),
  meta_description = TRIM(REPLACE(REPLACE(meta_description, '  ', ' '), 'pilates studios studios', 'pilates studios')),
  seo_description = TRIM(REPLACE(REPLACE(seo_description, '  ', ' '), 'pilates studios studios', 'pilates studios')),
  intro_text = TRIM(REPLACE(REPLACE(intro_text, '  ', ' '), 'pilates studios studios', 'pilates studios')),
  main_content = TRIM(REPLACE(REPLACE(main_content, '  ', ' '), 'pilates studios studios', 'pilates studios'))
WHERE type IN ('county', 'city', 'town');