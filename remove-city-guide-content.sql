-- Remove all main_content from city and town pages that contains problematic "Complete Guide" content
-- This will clear the garbled content so we can start fresh with proper pilates content

UPDATE public_locations SET
  main_content = NULL
WHERE type IN ('city', 'town')
  AND (
    main_content ILIKE '%Complete Guide to Pilates%'
    OR main_content ILIKE '%culinary%'
    OR main_content ILIKE '%fresh pilates classes%'
    OR main_content ILIKE '%traditional classes%'
    OR main_content ILIKE '%studioping%'
    OR main_content ILIKE '%weekly essentials%'
    OR main_content ILIKE '%butcher%'
    OR main_content ILIKE '%meat%'
    OR main_content ILIKE '%food%'
    OR main_content ILIKE '%beef%'
    OR main_content ILIKE '%pork%'
    OR main_content ILIKE '%sausage%'
    OR main_content IS NULL
    OR main_content = ''
  );

-- Now add proper, clean pilates content for all city/town pages
UPDATE public_locations SET
  main_content = '## Your Complete Guide to Pilates in ' || name || '

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

### Benefits of Regular Pilates Practice

- Improved core strength and stability
- Enhanced flexibility and mobility
- Better posture and alignment
- Reduced stress and increased mindfulness
- Injury prevention and rehabilitation
- Increased energy and vitality

Ready to begin your pilates journey? Explore our curated selection of ' || name || ' studios and find your perfect match for wellness and transformation.'
WHERE type IN ('city', 'town');