const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Function to generate SEO-optimized content based on studio data (third-person perspective)
function generateStudioContent(studio) {
  const name = studio.name;
  const city = studio.city || 'Unknown City';
  const county = studio.county || 'Unknown County';
  const rating = studio.google_rating || studio.rating;
  const reviewCount = studio.google_review_count || studio.review_count || 0;
  const classTypes = studio.class_types || [];
  const specialties = studio.specialties || [];
  const equipment = studio.equipment_available || [];
  const instructors = studio.instructor_names || [];
  const isVerified = studio.is_verified;
  const beginnerFriendly = studio.beginner_friendly;
  const onlineBooking = studio.online_booking_available;
  const parking = studio.parking_available;

  // Generate location-specific content from third-person perspective
  let content = `${name} is `;

  // Add location context
  if (city && county) {
    content += `a premier pilates studio located in ${city}, ${county}. `;
  } else {
    content += `a dedicated pilates studio. `;
  }

  // Add rating and verification if available
  if (rating && reviewCount > 0) {
    content += `The studio has earned an outstanding ${rating}-star rating from ${reviewCount} satisfied clients, `;
  }
  if (isVerified) {
    content += `and holds verified status for its professional standards. `;
  }

  // Add specialty/class type information
  if (classTypes.length > 0) {
    const classTypesText = classTypes.slice(0, 3).join(', ').toLowerCase();
    content += `${name} specializes in ${classTypesText} classes, `;
  } else {
    content += `The studio offers comprehensive pilates instruction, `;
  }

  // Add target audience
  if (beginnerFriendly) {
    content += `making it an ideal choice for both beginners and experienced practitioners. `;
  } else {
    content += `providing expert instruction for all skill levels. `;
  }

  // Add instructor information
  if (instructors.length > 0) {
    if (instructors.length === 1) {
      content += `The studio is led by certified instructor ${instructors[0]}, who `;
    } else if (instructors.length > 1) {
      content += `Their team of expert instructors, including ${instructors[0]}, `;
    }
    content += `brings years of experience and passion for pilates to every session. `;
  } else {
    content += `The certified instructors at ${name} bring extensive experience and dedication to helping clients achieve their fitness goals. `;
  }

  // Add equipment and facilities
  if (equipment.length > 0) {
    const equipmentText = equipment.slice(0, 3).join(', ').toLowerCase();
    content += `The studio is fully equipped with ${equipmentText} and other professional-grade equipment to ensure an exceptional workout experience. `;
  }

  // Add convenience features
  const conveniences = [];
  if (onlineBooking) conveniences.push('convenient online booking');
  if (parking) conveniences.push('dedicated parking facilities');

  if (conveniences.length > 0) {
    content += `${name} offers ${conveniences.join(' and ')} to enhance the client experience. `;
  }

  // Add local SEO elements
  content += `For those seeking pilates classes in ${city}`;
  if (classTypes.length > 0) {
    content += `, ${classTypes[0].toLowerCase()} sessions`;
  }
  content += `, or professional fitness instruction in ${county}, `;
  content += `${name} provides a welcoming environment focused on core strengthening, flexibility improvement, and overall wellbeing. `;

  // Add neutral call to action
  content += `The studio welcomes new members and offers various class options to suit different fitness levels and schedules.`;

  return content;
}

async function generateAllStudioContent() {
  console.log('🎯 GENERATING SEO-OPTIMIZED CONTENT FOR ALL STUDIOS\n');

  // Get all active studios
  const { data: studios, error } = await supabase
    .from('pilates_studios')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (error) {
    console.error('❌ Error fetching studios:', error);
    return;
  }

  console.log(`📊 Found ${studios?.length || 0} studios to update\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const studio of studios || []) {
    console.log(`✏️  Generating content for: ${studio.name}`);

    try {
      // Generate new SEO-optimized content
      const newContent = generateStudioContent(studio);

      console.log(`   📝 Generated ${newContent.length} characters of content`);
      console.log(`   Preview: ${newContent.substring(0, 100)}...`);

      // Update the studio description in the database
      const { error: updateError } = await supabase
        .from('pilates_studios')
        .update({ description: newContent })
        .eq('id', studio.id);

      if (updateError) {
        console.log(`   ❌ Failed to update: ${updateError.message}`);
        errorCount++;
      } else {
        console.log(`   ✅ Successfully updated content`);
        successCount++;
      }
    } catch (err) {
      console.log(`   ❌ Error generating content: ${err.message}`);
      errorCount++;
    }

    console.log('');
  }

  console.log('📈 CONTENT GENERATION SUMMARY:');
  console.log(`✅ Successfully updated: ${successCount} studios`);
  console.log(`❌ Failed updates: ${errorCount} studios`);

  if (successCount > 0) {
    console.log(`\n🎉 Generated SEO-optimized content for ${successCount} pilates studios!`);
    console.log('💡 Each studio now has unique, location-specific content that includes:');
    console.log('   - Location-based keywords and phrases');
    console.log('   - Studio specialties and class types');
    console.log('   - Instructor and equipment information');
    console.log('   - Rating and verification status');
    console.log('   - Local SEO optimization');
    console.log('   - Compelling calls-to-action');
  }
}

// Run the script
generateAllStudioContent()
  .then(() => {
    console.log('\n✨ Studio content generation completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Content generation failed:', error);
    process.exit(1);
  });