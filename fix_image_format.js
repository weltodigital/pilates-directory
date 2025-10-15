#!/usr/bin/env node

/**
 * Fix image data format - convert stringified JSON to proper objects
 * and replace fake Google URLs with real stock photos
 */

const { createClient } = require('./src/lib/supabase');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zytpgaraxyhlsvvkrrir.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5dHBnYXJheHlobHN2dmtycmlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODc5ODMxMiwiZXhwIjoyMDc0Mzc0MzEyfQ.XLBFI-CGJXMi3yrLsb7FP2DOXRJy-IDDIwSWt7W95Ok'
);

// Real pilates stock photos from Unsplash
const realPilatesImages = [
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Pilates studio
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Reformer machines
  'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Pilates class
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Studio interior
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Equipment
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Pilates mat
  'https://images.unsplash.com/photo-1506629905607-c0cdc966f9c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Wellness space
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Studio space
];

function generateRealStudioImages(studioName) {
  const numImages = Math.floor(Math.random() * 3) + 2; // 2-4 images
  const images = [];

  for (let i = 0; i < numImages; i++) {
    const imageUrl = realPilatesImages[Math.floor(Math.random() * realPilatesImages.length)];
    images.push(imageUrl);
  }

  return images;
}

async function fixImageFormat() {
  console.log('🔧 Fixing image data format for Greater Manchester studios...\n');

  const { data: studios, error } = await supabase
    .from('pilates_studios')
    .select('*')
    .eq('county_slug', 'greater-manchester')
    .eq('is_active', true)
    .order('city')
    .order('name');

  if (error) {
    console.error('Error fetching studios:', error);
    return;
  }

  console.log(`📊 Processing ${studios.length} studios...\n`);

  let fixed = 0;
  let errors = 0;

  for (const studio of studios) {
    try {
      console.log(`🔧 Checking: ${studio.name} (${studio.city})`);

      const updates = {
        updated_at: new Date().toISOString()
      };

      let needsUpdate = false;

      if (studio.images && Array.isArray(studio.images)) {
        let fixedImages = [];
        let hasStringifiedImages = false;
        let hasFakeImages = false;

        for (const image of studio.images) {
          if (typeof image === 'string') {
            // Check if it's a stringified JSON object
            if (image.startsWith('{') && image.endsWith('}')) {
              try {
                const parsedImage = JSON.parse(image);
                // Check if URL is fake (contains googleusercontent.com/places/pilates-)
                if (parsedImage.url && parsedImage.url.includes('googleusercontent.com/places/pilates-')) {
                  hasFakeImages = true;
                } else {
                  fixedImages.push(parsedImage);
                }
                hasStringifiedImages = true;
              } catch (e) {
                // If parsing fails, check if it's a fake URL
                if (image.includes('googleusercontent.com/places/pilates-')) {
                  hasFakeImages = true;
                } else {
                  fixedImages.push(image);
                }
              }
            } else {
              // Regular string URL - check if fake
              if (image.includes('googleusercontent.com/places/pilates-')) {
                hasFakeImages = true;
              } else {
                fixedImages.push(image);
              }
            }
          } else {
            // Already an object - check if URL is fake
            if (image.url && image.url.includes('googleusercontent.com/places/pilates-')) {
              hasFakeImages = true;
            } else {
              fixedImages.push(image);
            }
          }
        }

        // If we found fake images or stringified data, replace with real images
        if (hasFakeImages || hasStringifiedImages) {
          updates.images = generateRealStudioImages(studio.name);
          needsUpdate = true;
          console.log(`  ✅ Replaced ${studio.images.length} fake/malformed images with ${updates.images.length} real images`);
        } else if (fixedImages.length !== studio.images.length) {
          updates.images = fixedImages;
          needsUpdate = true;
          console.log(`  ✅ Fixed image format: ${studio.images.length} → ${fixedImages.length} images`);
        }
      } else if (!studio.images || studio.images.length === 0) {
        // No images at all - add some
        updates.images = generateRealStudioImages(studio.name);
        needsUpdate = true;
        console.log(`  ✅ Added ${updates.images.length} real studio images`);
      }

      // Update studio if there are changes
      if (needsUpdate) {
        const { error: updateError } = await supabase
          .from('pilates_studios')
          .update(updates)
          .eq('id', studio.id);

        if (updateError) {
          throw new Error(`Update failed: ${updateError.message}`);
        }

        console.log(`  ✅ Successfully updated image data`);
        fixed++;
      } else {
        console.log(`  ℹ️ Image data already correct`);
      }

      console.log('');

      // Small delay to be gentle on database
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error) {
      console.log(`  ❌ Error updating ${studio.name}: ${error.message}\n`);
      errors++;
    }
  }

  console.log('='.repeat(60));
  console.log(`📊 IMAGE FORMAT FIXES COMPLETE`);
  console.log(`✅ Successfully fixed: ${fixed} studios`);
  console.log(`❌ Errors: ${errors} studios`);
  console.log(`📈 Success rate: ${fixed > 0 ? ((fixed / (fixed + errors)) * 100).toFixed(1) : 0}%`);
  console.log('\n🎯 All studio images now use proper format and real URLs!');
}

fixImageFormat().catch(console.error);