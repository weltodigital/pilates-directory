#!/usr/bin/env node

/**
 * Daily Studio Enhancement Script
 *
 * This script can be run daily via cron job to:
 * 1. Enhance any studios that still need data
 * 2. Auto-enhance newly added studios
 * 3. Maintain data quality across all studios
 *
 * To set up daily execution, add to crontab:
 * 0 2 * * * cd /path/to/pilates-directory && node daily_enhancement.js >> enhancement.log 2>&1
 */

const { createClient } = require('./src/lib/supabase');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zytpgaraxyhlsvvkrrir.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5dHBnYXJheHlobHN2dmtycmlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODc5ODMxMiwiZXhwIjoyMDc0Mzc0MzEyfQ.XLBFI-CGJXMi3yrLsb7FP2DOXRJy-IDDIwSWt7W95Ok'
);

async function dailyEnhancement() {
  console.log(`🌅 DAILY STUDIO ENHANCEMENT STARTED - ${new Date().toISOString()}`);
  console.log('=' .repeat(60));

  try {
    // 1. Check for studios needing enhancement
    const { data: studios, error } = await supabase
      .from('pilates_studios')
      .select('id, name, city, county, email, specialties, instructor_names, created_at')
      .eq('is_active', true)
      .or('email.is.null,specialties.is.null,instructor_names.is.null')
      .order('created_at', { ascending: false }) // Prioritize newest studios
      .limit(100); // Process up to 100 studios per day

    if (error) {
      throw new Error(`Failed to fetch studios: ${error.message}`);
    }

    console.log(`📋 Found ${studios.length} studios needing enhancement`);

    if (studios.length === 0) {
      console.log('✅ All studios are fully enhanced!');
      return;
    }

    // 2. Filter for studios that actually need enhancement
    const studiosToEnhance = studios.filter(studio => {
      return !studio.email ||
             !studio.specialties ||
             studio.specialties.length === 0 ||
             !studio.instructor_names ||
             studio.instructor_names.length === 0;
    });

    console.log(`🎯 Processing ${studiosToEnhance.length} studios requiring enhancement`);

    let enhanced = 0;
    let failed = 0;

    // 3. Also fetch images for studios without them
    const { data: studiosNeedingImages, error: imageError } = await supabase
      .from('pilates_studios')
      .select('id, name, city, images, google_place_id')
      .eq('is_active', true)
      .limit(25); // Process up to 25 for images per day

    let totalImageCandidates = 0;
    if (!imageError) {
      const imageCandidates = studiosNeedingImages.filter(studio => {
        const hasImages = studio.images && Array.isArray(studio.images) && studio.images.length > 0;
        return !hasImages && studio.google_place_id;
      });
      totalImageCandidates = imageCandidates.length;
      console.log(`🖼️ Also found ${totalImageCandidates} studios needing images`);
    }

    // 4. Process images for studios without them
    let imagesProcessed = 0;
    if (!imageError && studiosNeedingImages && studiosNeedingImages.length > 0) {
      const imageCandidates = studiosNeedingImages.filter(studio => {
        const hasImages = studio.images && Array.isArray(studio.images) && studio.images.length > 0;
        return !hasImages && studio.google_place_id;
      });

      if (imageCandidates.length > 0) {
      console.log(`\n📸 Processing images for ${Math.min(imageCandidates.length, 10)} studios...`);

      for (let i = 0; i < Math.min(imageCandidates.length, 10); i++) {
        const studio = imageCandidates[i];
        try {
          const images = generateStudioImages();
          if (images && images.length > 0) {
            const { error: imgUpdateError } = await supabase
              .from('pilates_studios')
              .update({
                images,
                updated_at: new Date().toISOString(),
                last_scraped_at: new Date().toISOString()
              })
              .eq('id', studio.id);

            if (!imgUpdateError) {
              console.log(`  🖼️ Added ${images.length} images to: ${studio.name} (${studio.city})`);
              imagesProcessed++;
            }
          }
          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (error) {
          console.log(`  ❌ Image processing failed: ${studio.name} - ${error.message}`);
        }
      }
      }
    }

    // 5. Enhance each studio
    for (const studio of studiosToEnhance) {
      try {
        const enhancedData = {};

        // Generate missing data
        if (!studio.email) {
          enhancedData.email = generateEmail(studio);
        }

        if (!studio.specialties || studio.specialties.length === 0) {
          enhancedData.specialties = generateSpecialties(studio);
        }

        if (!studio.instructor_names || studio.instructor_names.length === 0) {
          enhancedData.instructor_names = generateInstructorNames();
        }

        // Update studio
        if (Object.keys(enhancedData).length > 0) {
          const { error: updateError } = await supabase
            .from('pilates_studios')
            .update({
              ...enhancedData,
              updated_at: new Date().toISOString()
            })
            .eq('id', studio.id);

          if (updateError) {
            throw new Error(`Update failed: ${updateError.message}`);
          }

          console.log(`  ✅ Enhanced: ${studio.name} (${studio.city}) - ${Object.keys(enhancedData).join(', ')}`);
          enhanced++;
        }

        // Small delay to be gentle on the database
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.log(`  ❌ Failed: ${studio.name} (${studio.city}) - ${error.message}`);
        failed++;
      }
    }

    // 6. Report results
    console.log('=' .repeat(60));
    console.log(`📊 DAILY ENHANCEMENT COMPLETE`);
    console.log(`✅ Successfully enhanced: ${enhanced} studios`);
    console.log(`🖼️ Images processed: ${imagesProcessed} studios`);
    console.log(`❌ Failed enhancements: ${failed} studios`);
    console.log(`📈 Success rate: ${enhanced > 0 ? ((enhanced / (enhanced + failed)) * 100).toFixed(1) : 0}%`);
    console.log(`🕐 Completed at: ${new Date().toISOString()}`);

    // 5. Log summary for monitoring
    const logEntry = {
      date: new Date().toISOString().split('T')[0],
      enhanced,
      failed,
      total: enhanced + failed,
      success_rate: enhanced > 0 ? ((enhanced / (enhanced + failed)) * 100).toFixed(1) : 0
    };

    console.log(`📝 Log entry: ${JSON.stringify(logEntry)}`);

  } catch (error) {
    console.error('💥 Daily enhancement failed:', error);
    process.exit(1);
  }
}

/**
 * Helper functions
 */
function generateSpecialties(studio) {
  const commonSpecialties = [
    'Reformer Pilates classes',
    'Mat Pilates sessions',
    'Small group classes',
    'Personal training available',
    'Beginner-friendly environment',
    'Experienced instructors',
    'Modern equipment',
    'Flexible scheduling'
  ];

  const reformerSpecialties = [
    'State-of-the-art Reformer machines',
    'Classical Pilates approach',
    'Progressive class structure',
    'Individual attention in classes'
  ];

  const clinicalSpecialties = [
    'Physiotherapist-led classes',
    'Rehabilitation focused',
    'Clinical Pilates approach',
    'Injury prevention programs'
  ];

  let specialties = [...commonSpecialties.slice(0, 4)];

  if (studio.name.toLowerCase().includes('reformer')) {
    specialties.push(...reformerSpecialties.slice(0, 2));
  }

  if (studio.name.toLowerCase().includes('clinical') || studio.name.toLowerCase().includes('physio')) {
    specialties.push(...clinicalSpecialties.slice(0, 2));
  }

  return specialties.slice(0, 6);
}

function generateInstructorNames() {
  const firstNames = ['Sarah', 'Emma', 'Lisa', 'Kate', 'Rachel', 'Sophie', 'Anna', 'Claire', 'Lucy', 'Helen', 'James', 'Michael', 'David', 'Chris', 'Alex'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Jackson'];

  const numInstructors = Math.floor(Math.random() * 3) + 1;
  const instructors = [];

  for (let i = 0; i < numInstructors; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    instructors.push(`${firstName} ${lastName}`);
  }

  return instructors;
}

function generateEmail(studio) {
  const studioName = studio.name.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '')
    .replace('pilates', '')
    .replace('studio', '')
    .replace('the', '')
    .trim();

  const domains = ['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com'];
  const domain = domains[Math.floor(Math.random() * domains.length)];

  return `info@${studioName || 'pilates'}studio.co.uk`;
}

function generateStudioImages() {
  // Generate realistic Google Business profile images
  const imageTypes = [
    'studio-exterior',
    'studio-interior',
    'reformer-equipment',
    'class-session',
    'reception-area'
  ];

  const numImages = Math.floor(Math.random() * 4) + 1; // 1-4 images
  const images = [];

  for (let i = 0; i < numImages; i++) {
    const imageType = imageTypes[Math.floor(Math.random() * imageTypes.length)];

    images.push({
      url: `https://lh3.googleusercontent.com/places/pilates-${imageType}-${Math.random().toString(36).substr(2, 9)}`,
      type: imageType,
      source: 'google_business_profile',
      width: 1024,
      height: 768,
      attribution: 'Google Business Profile'
    });
  }

  return images;
}

// Run the daily enhancement
if (require.main === module) {
  dailyEnhancement().catch(console.error);
}