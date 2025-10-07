/**
 * Generate SEO Content for All Locations
 * Creates comprehensive, SEO-optimized content for all counties and cities
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// SEO content templates for different types of locations
const COUNTY_TEMPLATES = {
  metropolitan: {
    keywords: ['pilates classes', 'pilates studios', 'pilates instructors', 'mat pilates', 'reformer pilates', 'pilates near me', 'pilates fitness', 'core strengthening'],
    benefits: [
      'Improved core strength and stability',
      'Enhanced flexibility and posture',
      'Better balance and coordination',
      'Reduced back pain and tension',
      'Increased muscle tone and definition',
      'Mind-body connection and stress relief',
      'Low-impact fitness suitable for all ages',
      'Rehabilitation and injury prevention'
    ]
  },
  rural: {
    keywords: ['local pilates', 'community fitness', 'wellness classes', 'small group pilates', 'personal training', 'health and fitness', 'exercise classes'],
    benefits: [
      'Close-knit community atmosphere',
      'Personalized attention from instructors',
      'Peaceful, relaxed environment',
      'Convenient local fitness solution',
      'Support for rural wellness initiatives',
      'Accessible exercise for all fitness levels',
      'Connection with like-minded neighbors',
      'Stress relief from countryside tranquility'
    ]
  }
};

function generateCountyContent(countyName, countySlug, studioCount) {
  const isMetropolitan = ['greater-london', 'greater-manchester', 'west-midlands', 'west-yorkshire', 'south-yorkshire', 'tyne-and-wear', 'merseyside'].includes(countySlug);
  const template = isMetropolitan ? COUNTY_TEMPLATES.metropolitan : COUNTY_TEMPLATES.rural;

  const studioText = studioCount > 0 ? `featuring ${studioCount} verified pilates studios` : 'with growing pilates opportunities';
  const availabilityText = studioCount > 0 ?
    `Choose from ${studioCount} professional pilates studios across ${countyName}, each offering unique classes and expert instruction.` :
    `While we're currently building our network in ${countyName}, this area has tremendous potential for pilates growth and community wellness.`;

  return {
    meta_title: `Best Pilates Classes in ${countyName} | Find Studios Near You`,
    meta_description: `Discover top-rated pilates studios in ${countyName}. Expert instructors, mat & reformer classes, all fitness levels welcome. Book your class today!`,
    meta_keywords: [`pilates ${countySlug}`, `${countyName} pilates`, ...template.keywords],

    h1_title: `Pilates Classes in ${countyName}`,
    hero_description: `Discover exceptional pilates studios across ${countyName} ${studioText}. From beginner-friendly mat classes to advanced reformer sessions, find the perfect pilates experience for your fitness journey.`,

    intro_paragraph: `${countyName} offers a diverse range of pilates opportunities for fitness enthusiasts of all levels. ${availabilityText} Whether you're seeking core strengthening, flexibility improvement, or stress relief, ${countyName}'s pilates community provides welcoming environments for your wellness goals.`,

    about_location: `Located in the heart of England, ${countyName} combines ${isMetropolitan ? 'urban convenience with world-class fitness facilities' : 'rural charm with community-focused wellness options'}. The area's commitment to health and fitness makes it an ideal location for pilates practitioners seeking ${isMetropolitan ? 'cutting-edge studios and diverse class options' : 'personalized attention and peaceful practice environments'}.`,

    pilates_benefits: `Pilates offers numerous benefits for ${countyName} residents:\n\n${template.benefits.map(benefit => `• ${benefit}`).join('\n')}\n\nWhether you're recovering from injury, improving athletic performance, or maintaining overall wellness, pilates provides a comprehensive approach to physical and mental health.`,

    local_info: `${countyName} is known for ${isMetropolitan ? 'its vibrant fitness scene and accessibility to premium wellness facilities' : 'its community spirit and focus on quality of life'}. Many pilates studios in the area offer flexible scheduling to accommodate ${isMetropolitan ? 'busy urban lifestyles' : 'work-life balance priorities'}, with options for group classes, private sessions, and specialized programs. The local pilates community is welcoming and supportive, making it easy for newcomers to feel at home.`,

    cta_title: `Start Your Pilates Journey in ${countyName} Today`,
    cta_description: `Ready to experience the benefits of pilates? Browse our directory of verified studios in ${countyName}, read reviews from local practitioners, and book your first class. Your path to better health and wellness starts here.`,

    faq_data: [
      {
        question: `How many pilates studios are in ${countyName}?`,
        answer: studioCount > 0 ?
          `We currently feature ${studioCount} verified pilates studios across ${countyName}, with new locations being added regularly as the pilates community continues to grow.` :
          `We're actively working to connect with pilates instructors and studios in ${countyName}. While our directory is growing, this area offers excellent opportunities for pilates development and community wellness initiatives.`
      },
      {
        question: `What types of pilates classes are available in ${countyName}?`,
        answer: `${countyName} pilates studios typically offer a comprehensive range of classes including mat pilates, reformer pilates, chair pilates, and barrel work. Many studios also provide specialized programs for seniors, prenatal pilates, rehabilitation, and athletic conditioning.`
      },
      {
        question: `Are pilates classes in ${countyName} suitable for beginners?`,
        answer: `Absolutely! Most pilates studios in ${countyName} welcome beginners and offer introductory classes, foundation courses, and modified exercises. Instructors are trained to provide personalized guidance and ensure safe, effective practice for all fitness levels.`
      },
      {
        question: `How much do pilates classes cost in ${countyName}?`,
        answer: `Pilates class prices in ${countyName} vary depending on the studio, class type, and package options. Generally, expect to pay £15-25 for drop-in mat classes and £25-40 for reformer sessions. Many studios offer attractive package deals, memberships, and introductory offers for new students.`
      }
    ]
  };
}

function generateCityContent(cityName, citySlug, countyName, countySlug, studioCount) {
  const studioText = studioCount > 0 ? `home to ${studioCount} professional pilates studios` : 'an emerging destination for pilates enthusiasts';
  const classText = studioCount > 0 ?
    `With ${studioCount} established studios, ${cityName} offers diverse pilates options from traditional mat classes to cutting-edge reformer sessions.` :
    `While our pilates directory for ${cityName} is still growing, this vibrant community shows excellent potential for wellness and fitness development.`;

  return {
    meta_title: `Pilates Classes in ${cityName}, ${countyName} | Top Rated Studios`,
    meta_description: `Find the best pilates studios in ${cityName}, ${countyName}. Expert instructors, flexible schedules, all levels welcome. Book your pilates class today!`,
    meta_keywords: [`pilates ${citySlug}`, `${cityName} pilates classes`, `${cityName} fitness`, `pilates ${countySlug}`, 'mat pilates', 'reformer pilates'],

    h1_title: `Best Pilates Studios in ${cityName}`,
    hero_description: `Explore ${cityName}'s premier pilates studios offering expert instruction and comprehensive wellness programs. Whether you're a beginner or advanced practitioner, discover the perfect pilates experience in ${countyName}'s vibrant ${cityName} community.`,

    intro_paragraph: `${cityName}, nestled in ${countyName}, is ${studioText} catering to fitness enthusiasts at every level. ${classText} The local pilates community is known for its welcoming atmosphere and commitment to helping students achieve their wellness goals through mindful movement and expert guidance.`,

    about_location: `${cityName} combines the best of ${countyName}'s character with modern fitness amenities. The area attracts health-conscious residents who value quality instruction and community connection. Local pilates studios reflect this commitment to excellence, offering state-of-the-art equipment, experienced instructors, and programs designed to meet diverse needs and schedules.`,

    pilates_benefits: `Pilates training in ${cityName} provides exceptional benefits for local residents:\n\n• Convenient location within ${countyName} for easy access\n• Community-focused studios with personalized attention\n• Comprehensive fitness approach combining strength, flexibility, and mindfulness\n• Stress relief and mental wellness in a supportive environment\n• Improved posture and core strength for daily activities\n• Low-impact exercise suitable for all ages and fitness levels\n• Social connection with like-minded wellness enthusiasts\n• Professional instruction with ongoing support and guidance`,

    local_info: `The pilates scene in ${cityName} reflects the broader wellness culture of ${countyName}. Studios often feature small class sizes for personalized attention, flexible scheduling to accommodate local lifestyles, and strong connections to the community. Many instructors are longtime ${countyName} residents who understand the unique needs and preferences of local students, creating an authentic and supportive practice environment.`,

    cta_title: `Find Your Perfect Pilates Studio in ${cityName}`,
    cta_description: `Ready to join the ${cityName} pilates community? Browse our curated selection of local studios, compare class offerings and instructor credentials, and book your first session. Experience the difference that expert guidance and community support can make in your fitness journey.`,

    faq_data: [
      {
        question: `How many pilates studios are in ${cityName}?`,
        answer: studioCount > 0 ?
          `${cityName} currently features ${studioCount} verified pilates studios in our directory, offering a range of class styles and scheduling options to meet diverse community needs.` :
          `We're actively expanding our network in ${cityName} and throughout ${countyName}. While our current directory is growing, this area shows excellent potential for pilates studio development and community wellness programs.`
      },
      {
        question: `What makes ${cityName} pilates studios unique?`,
        answer: `${cityName} pilates studios are known for their community focus, experienced instructors, and commitment to personalized attention. Many studios emphasize the connection between physical fitness and mental wellness, reflecting the values and lifestyle priorities of ${countyName} residents.`
      },
      {
        question: `Are there beginner-friendly pilates options in ${cityName}?`,
        answer: `Yes! ${cityName} pilates studios welcome beginners with open arms. Most offer foundation classes, beginner workshops, and modified exercises. Instructors are experienced in helping new students build confidence and develop proper form in a supportive environment.`
      },
      {
        question: `How do I choose the right pilates studio in ${cityName}?`,
        answer: `Consider factors like location convenience, class schedules that fit your lifestyle, instructor credentials and teaching style, studio atmosphere, and equipment quality. Many ${cityName} studios offer trial classes or introductory packages to help you find the perfect fit for your pilates journey.`
      }
    ]
  };
}

async function generateAllSeoContent() {
  console.log('🎯 Generating SEO content for all English locations...\n');

  // Get all locations from public_locations
  const { data: locations, error: locationsError } = await supabase
    .from('public_locations')
    .select('name, slug, type, county_slug, butcher_count')
    .order('type, name');

  if (locationsError) {
    console.error('❌ Error fetching locations:', locationsError);
    return;
  }

  console.log(`📍 Found ${locations.length} locations to process:`);
  const counties = locations.filter(l => l.type === 'county');
  const cities = locations.filter(l => l.type === 'city');
  console.log(`   Counties: ${counties.length}`);
  console.log(`   Cities: ${cities.length}\n`);

  // Clear existing content
  console.log('🧹 Clearing existing SEO content...');
  const { error: deleteError } = await supabase
    .from('location_seo_content')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (deleteError) {
    console.error('❌ Error clearing existing content:', deleteError);
    return;
  }

  let processed = 0;
  let errors = 0;

  // Process counties first
  console.log('📝 Generating county content...');
  for (const county of counties) {
    try {
      const content = generateCountyContent(county.name, county.slug, county.butcher_count);

      const seoRecord = {
        location_slug: county.slug,
        location_type: 'county',
        location_name: county.name,
        county_slug: county.slug,
        canonical_url: `https://pilatesuk.com/${county.slug}`,
        og_title: content.meta_title,
        og_description: content.meta_description,
        twitter_title: content.meta_title,
        twitter_description: content.meta_description,
        schema_data: {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": content.h1_title,
          "description": content.meta_description,
          "url": `https://pilatesuk.com/${county.slug}`,
          "mainEntity": {
            "@type": "Place",
            "name": county.name,
            "description": content.hero_description
          }
        },
        ...content
      };

      const { error: insertError } = await supabase
        .from('location_seo_content')
        .insert(seoRecord);

      if (insertError) {
        console.error(`❌ Error inserting ${county.name}:`, insertError.message);
        errors++;
      } else {
        processed++;
        if (processed % 10 === 0) {
          console.log(`   ✅ Processed ${processed} locations...`);
        }
      }
    } catch (error) {
      console.error(`❌ Error processing county ${county.name}:`, error.message);
      errors++;
    }
  }

  // Process cities
  console.log('\n📝 Generating city content...');
  const batchSize = 25;
  for (let i = 0; i < cities.length; i += batchSize) {
    const batch = cities.slice(i, i + batchSize);
    const batchRecords = [];

    for (const city of batch) {
      try {
        // Find the county name for this city
        const countyData = counties.find(c => c.slug === city.county_slug);
        const countyName = countyData ? countyData.name : city.county_slug.replace(/-/g, ' ');

        const content = generateCityContent(city.name, city.slug, countyName, city.county_slug, city.butcher_count);

        const seoRecord = {
          location_slug: `${city.county_slug}/${city.slug}`,
          location_type: 'city',
          location_name: city.name,
          county_slug: city.county_slug,
          canonical_url: `https://pilatesuk.com/${city.county_slug}/${city.slug}`,
          og_title: content.meta_title,
          og_description: content.meta_description,
          twitter_title: content.meta_title,
          twitter_description: content.meta_description,
          schema_data: {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": content.h1_title,
            "description": content.meta_description,
            "url": `https://pilatesuk.com/${city.county_slug}/${city.slug}`,
            "mainEntity": {
              "@type": "Place",
              "name": city.name,
              "description": content.hero_description,
              "containedInPlace": {
                "@type": "Place",
                "name": countyName
              }
            }
          },
          ...content
        };

        batchRecords.push(seoRecord);
      } catch (error) {
        console.error(`❌ Error processing city ${city.name}:`, error.message);
        errors++;
      }
    }

    // Insert batch
    if (batchRecords.length > 0) {
      const { error: batchError } = await supabase
        .from('location_seo_content')
        .insert(batchRecords);

      if (batchError) {
        console.error(`❌ Error inserting batch ${Math.floor(i / batchSize) + 1}:`, batchError.message);
        errors += batchRecords.length;
      } else {
        processed += batchRecords.length;
        console.log(`   ✅ Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(cities.length / batchSize)} (${processed} total)`);
      }
    }

    // Small delay between batches
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log(`\n🎉 SEO content generation complete!`);
  console.log(`📊 Summary:`);
  console.log(`   Successfully processed: ${processed} locations`);
  console.log(`   Errors: ${errors}`);
  console.log(`   Total coverage: ${processed}/${locations.length} locations`);

  if (processed > 0) {
    console.log(`\n🚀 Your pilates directory now has comprehensive SEO content for:`);
    console.log(`   • ${counties.length} English counties`);
    console.log(`   • ${cities.length} cities and towns`);
    console.log(`   • Complete meta tags, structured data, and FAQs`);
    console.log(`   • Location-specific, search-optimized content`);
    console.log(`\n💡 Next step: Update your pages to use this SEO content!`);
  }
}

// Run the script
generateAllSeoContent().catch(console.error);