const FirecrawlApp = require('@mendable/firecrawl-js').default;
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Comprehensive list of UK cities and towns for pilates studio search
const UK_LOCATIONS = [
  // Major cities
  { name: 'London', county: 'Greater London', county_slug: 'greater-london' },
  { name: 'Birmingham', county: 'West Midlands', county_slug: 'west-midlands' },
  { name: 'Manchester', county: 'Greater Manchester', county_slug: 'greater-manchester' },
  { name: 'Leeds', county: 'West Yorkshire', county_slug: 'west-yorkshire' },
  { name: 'Liverpool', county: 'Merseyside', county_slug: 'merseyside' },
  { name: 'Sheffield', county: 'South Yorkshire', county_slug: 'south-yorkshire' },
  { name: 'Bristol', county: 'Bristol', county_slug: 'bristol' },
  { name: 'Newcastle', county: 'Tyne and Wear', county_slug: 'tyne-and-wear' },
  { name: 'Nottingham', county: 'Nottinghamshire', county_slug: 'nottinghamshire' },
  { name: 'Leicester', county: 'Leicestershire', county_slug: 'leicestershire' },

  // Scotland
  { name: 'Edinburgh', county: 'Edinburgh', county_slug: 'edinburgh' },
  { name: 'Glasgow', county: 'Glasgow', county_slug: 'glasgow' },
  { name: 'Aberdeen', county: 'Aberdeenshire', county_slug: 'aberdeenshire' },
  { name: 'Dundee', county: 'Angus', county_slug: 'angus' },

  // Wales
  { name: 'Cardiff', county: 'Cardiff', county_slug: 'cardiff' },
  { name: 'Swansea', county: 'Swansea', county_slug: 'swansea' },
  { name: 'Newport', county: 'Newport', county_slug: 'newport' },

  // Northern Ireland
  { name: 'Belfast', county: 'Belfast', county_slug: 'belfast' },

  // Other major towns
  { name: 'Brighton', county: 'East Sussex', county_slug: 'east-sussex' },
  { name: 'Oxford', county: 'Oxfordshire', county_slug: 'oxfordshire' },
  { name: 'Cambridge', county: 'Cambridgeshire', county_slug: 'cambridgeshire' },
  { name: 'Bath', county: 'Somerset', county_slug: 'somerset' },
  { name: 'York', county: 'North Yorkshire', county_slug: 'north-yorkshire' },
  { name: 'Canterbury', county: 'Kent', county_slug: 'kent' },
  { name: 'Chester', county: 'Cheshire', county_slug: 'cheshire' },
  { name: 'Reading', county: 'Berkshire', county_slug: 'berkshire' },
  { name: 'Milton Keynes', county: 'Buckinghamshire', county_slug: 'buckinghamshire' },
  { name: 'Bournemouth', county: 'Dorset', county_slug: 'dorset' },
  { name: 'Portsmouth', county: 'Hampshire', county_slug: 'hampshire' },
  { name: 'Southampton', county: 'Hampshire', county_slug: 'hampshire' },
  { name: 'Plymouth', county: 'Devon', county_slug: 'devon' },
  { name: 'Exeter', county: 'Devon', county_slug: 'devon' },
  { name: 'Coventry', county: 'West Midlands', county_slug: 'west-midlands' },
  { name: 'Wolverhampton', county: 'West Midlands', county_slug: 'west-midlands' },
  { name: 'Stoke-on-Trent', county: 'Staffordshire', county_slug: 'staffordshire' },
  { name: 'Derby', county: 'Derbyshire', county_slug: 'derbyshire' },
  { name: 'Hull', county: 'East Riding of Yorkshire', county_slug: 'east-riding-of-yorkshire' },
  { name: 'Bradford', county: 'West Yorkshire', county_slug: 'west-yorkshire' },
  { name: 'Wakefield', county: 'West Yorkshire', county_slug: 'west-yorkshire' },
  { name: 'Preston', county: 'Lancashire', county_slug: 'lancashire' },
  { name: 'Blackpool', county: 'Lancashire', county_slug: 'lancashire' },
  { name: 'Middlesbrough', county: 'North Yorkshire', county_slug: 'north-yorkshire' }
];

// Pilates-specific search terms
const PILATES_SEARCH_TERMS = [
  'pilates studio',
  'pilates classes',
  'reformer pilates',
  'mat pilates',
  'clinical pilates',
  'pilates instructor',
  'pilates centre',
  'pilates fitness',
  'barre pilates',
  'yoga pilates'
];

function createSlug(text) {
  return text.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function extractStudioInfo(content, searchLocation) {
  // Enhanced regex patterns for pilates studios
  const patterns = {
    name: [
      /(?:Studio|Centre|Center|Class|Academy|School|Fitness|Wellness|Health|Mind|Body|Core|Flow|Balance|Harmony|Pure|Total|Elite|Premier|Dynamic|Evolution|Transform|Phoenix|Zen|Sanctuary|Movement|Method|Space)[\s\w]*(?:Pilates|Studio|Centre|Center)/gi,
      /(?:Pilates)[\s\w]*(?:Studio|Centre|Center|Class|Academy|School|Fitness|Wellness|Health|Mind|Body|Core|Flow|Balance|Harmony|Pure|Total|Elite|Premier|Dynamic|Evolution|Transform|Phoenix|Zen|Sanctuary|Movement|Method|Space)/gi,
      /[\w\s]+(?:Pilates)/gi
    ],
    address: [
      /(\d+[\w\s,]*(?:Street|St|Road|Rd|Avenue|Ave|Lane|Ln|Drive|Dr|Close|Cl|Way|Place|Pl|Crescent|Cres|Gardens|Gdns|Square|Sq|Court|Ct|Terrace|Ter|Mews|Row|Hill|Park|Green|Common|Heath|Fields|Grove|Rise|View|Walk|Path|Parade|Circus|Wharf|Bridge|Mill|House|Building|Centre|Center|Complex|Plaza|Mall|Market|Station|Church|Chapel|School|Hospital|Hotel|Pub|Restaurant|Cafe|Shop|Store|Office|Business|Industrial|Retail|Commercial|Residential)[\w\s,]*)/gi
    ],
    phone: [
      /(?:tel:|phone:|call:|contact:?\s*)?(\+?44\s*(?:\(0\)|\(0)?[\s\-]?\d{2,4}[\s\-]?\d{3,4}[\s\-]?\d{3,4})/gi,
      /(?:tel:|phone:|call:|contact:?\s*)?(0\d{2,4}[\s\-]?\d{3,4}[\s\-]?\d{3,4})/gi
    ],
    website: [
      /(https?:\/\/(?:www\.)?[\w\-]+\.[\w\-]+(?:\.[\w\-]+)*(?:\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?)/gi,
      /(www\.[\w\-]+\.[\w\-]+(?:\.[\w\-]+)*(?:\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?)/gi
    ],
    email: [
      /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi
    ],
    classTypes: [
      /(?:mat|reformer|clinical|prenatal|postnatal|barre|power|yoga|fusion|beginner|intermediate|advanced|private|group|duet|equipment|cadillac|chair|barrel|props|seniors|sports|rehabilitation|injury|postural|flexibility|core|balance|mindful)\s*pilates/gi,
      /pilates\s*(?:mat|reformer|clinical|prenatal|postnatal|barre|power|yoga|fusion|beginner|intermediate|advanced|private|group|duet|equipment|cadillac|chair|barrel|props|seniors|sports|rehabilitation|injury|postural|flexibility|core|balance|mindful)/gi
    ],
    prices: [
      /£\s*(\d+(?:\.\d{2})?)\s*(?:per\s*(?:class|session|hour)|\/(?:class|session|hour))/gi,
      /(\d+(?:\.\d{2})?)\s*(?:pounds?|£)\s*(?:per\s*(?:class|session|hour)|\/(?:class|session|hour))/gi
    ],
    openingHours: [
      /(monday|tuesday|wednesday|thursday|friday|saturday|sunday|mon|tue|wed|thu|fri|sat|sun)[\s:]*(\d{1,2}(?::\d{2})?\s*(?:am|pm|AM|PM)?\s*[-–—]\s*\d{1,2}(?::\d{2})?\s*(?:am|pm|AM|PM)?)/gi
    ]
  };

  const studios = [];

  // Extract studio names
  let studioNames = new Set();
  patterns.name.forEach(pattern => {
    const matches = content.match(pattern) || [];
    matches.forEach(match => {
      const cleaned = match.trim().replace(/\s+/g, ' ');
      if (cleaned.length > 5 && cleaned.length < 100) {
        studioNames.add(cleaned);
      }
    });
  });

  // Convert to array and process each studio
  Array.from(studioNames).forEach(name => {
    const studio = {
      name: name,
      description: `${name} is a pilates studio located in ${searchLocation.name}, ${searchLocation.county}. Offering professional pilates instruction and classes for all levels.`,
      address: '',
      postcode: '',
      city: searchLocation.name,
      county: searchLocation.county,
      county_slug: searchLocation.county_slug,
      city_slug: createSlug(searchLocation.name),
      phone: '',
      email: '',
      website: '',
      class_types: [],
      price_range: '',
      opening_hours: {},
      specialties: ['Mat Pilates', 'Group Classes', 'Beginner Friendly'],
      is_active: true,
      last_scraped_at: new Date().toISOString(),
      full_url_path: `${searchLocation.county_slug}/${createSlug(searchLocation.name)}/${createSlug(name)}`
    };

    // Try to find address near the studio name in content
    const nameIndex = content.toLowerCase().indexOf(name.toLowerCase());
    if (nameIndex !== -1) {
      const contextBefore = content.substring(Math.max(0, nameIndex - 500), nameIndex);
      const contextAfter = content.substring(nameIndex, Math.min(content.length, nameIndex + 500));
      const context = contextBefore + name + contextAfter;

      // Extract additional information from context
      patterns.address.forEach(pattern => {
        const matches = context.match(pattern) || [];
        if (matches.length > 0 && !studio.address) {
          studio.address = matches[0].trim();
        }
      });

      patterns.phone.forEach(pattern => {
        const matches = context.match(pattern) || [];
        if (matches.length > 0 && !studio.phone) {
          studio.phone = matches[0].replace(/[^\d\s\+\(\)\-]/g, '').trim();
        }
      });

      patterns.email.forEach(pattern => {
        const matches = context.match(pattern) || [];
        if (matches.length > 0 && !studio.email) {
          studio.email = matches[0].trim();
        }
      });

      patterns.website.forEach(pattern => {
        const matches = context.match(pattern) || [];
        if (matches.length > 0 && !studio.website) {
          let website = matches[0].trim();
          if (!website.startsWith('http')) {
            website = 'https://' + website.replace(/^www\./, '');
          }
          studio.website = website;
        }
      });

      // Extract class types
      patterns.classTypes.forEach(pattern => {
        const matches = context.match(pattern) || [];
        matches.forEach(match => {
          const classType = match.replace(/pilates/gi, '').trim();
          if (classType && !studio.class_types.includes(classType)) {
            studio.class_types.push(classType);
          }
        });
      });

      // Extract prices
      patterns.prices.forEach(pattern => {
        const matches = context.match(pattern) || [];
        if (matches.length > 0 && !studio.price_range) {
          studio.price_range = matches[0];
        }
      });
    }

    // Add default address if none found
    if (!studio.address) {
      studio.address = `${searchLocation.name}, ${searchLocation.county}, UK`;
    }

    studios.push(studio);
  });

  return studios;
}

async function scrapePilatesStudiosForLocation(location, searchTerm) {
  try {
    console.log(`\n🔍 Searching for "${searchTerm}" in ${location.name}, ${location.county}...`);

    const searchQuery = `${searchTerm} ${location.name} ${location.county} UK`;
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;

    console.log(`📱 Crawling: ${googleSearchUrl}`);

    const crawlResult = await firecrawl.scrapeUrl(googleSearchUrl, {
      formats: ['markdown'],
      onlyMainContent: true,
      waitFor: 2000,
      timeout: 30000
    });

    if (!crawlResult.success) {
      console.log(`❌ Failed to crawl ${searchQuery}: ${crawlResult.error}`);
      return [];
    }

    console.log(`✅ Successfully crawled ${searchQuery}`);
    const content = crawlResult.data.markdown || '';

    if (content.length < 100) {
      console.log(`⚠️ Insufficient content for ${searchQuery}`);
      return [];
    }

    const studios = extractStudioInfo(content, location);
    console.log(`📊 Extracted ${studios.length} potential studios for ${searchQuery}`);

    return studios;

  } catch (error) {
    console.error(`❌ Error scraping ${searchTerm} in ${location.name}:`, error.message);
    return [];
  }
}

async function saveStudioToDatabase(studio) {
  try {
    // Check if studio already exists
    const { data: existing } = await supabase
      .from('pilates_studios')
      .select('id')
      .eq('name', studio.name)
      .eq('city', studio.city)
      .single();

    if (existing) {
      console.log(`📍 Studio "${studio.name}" already exists in ${studio.city}`);
      return null;
    }

    // Insert new studio
    const { data, error } = await supabase
      .from('pilates_studios')
      .insert([studio])
      .select()
      .single();

    if (error) {
      console.error(`❌ Error saving studio "${studio.name}":`, error.message);
      return null;
    }

    console.log(`✅ Saved studio: ${studio.name} in ${studio.city}`);
    return data;

  } catch (error) {
    console.error(`❌ Database error for studio "${studio.name}":`, error.message);
    return null;
  }
}

async function scrapePilatesStudios() {
  console.log('🚀 Starting comprehensive pilates studio scraping...');
  console.log(`📍 Searching in ${UK_LOCATIONS.length} locations`);
  console.log(`🔍 Using ${PILATES_SEARCH_TERMS.length} search terms`);

  const stats = {
    totalSearches: 0,
    successfulScrapes: 0,
    studiosFound: 0,
    studiosSaved: 0,
    errors: 0
  };

  // Process locations in batches to avoid rate limiting
  const BATCH_SIZE = 5;
  const DELAY_BETWEEN_REQUESTS = 2000; // 2 seconds
  const DELAY_BETWEEN_BATCHES = 10000; // 10 seconds

  for (let i = 0; i < UK_LOCATIONS.length; i += BATCH_SIZE) {
    const locationBatch = UK_LOCATIONS.slice(i, i + BATCH_SIZE);
    console.log(`\n📦 Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(UK_LOCATIONS.length / BATCH_SIZE)}`);

    for (const location of locationBatch) {
      for (const searchTerm of PILATES_SEARCH_TERMS) {
        stats.totalSearches++;

        try {
          const studios = await scrapePilatesStudiosForLocation(location, searchTerm);
          stats.successfulScrapes++;
          stats.studiosFound += studios.length;

          // Save each studio to database
          for (const studio of studios) {
            const saved = await saveStudioToDatabase(studio);
            if (saved) {
              stats.studiosSaved++;
            }
          }

          // Delay between requests to be respectful
          await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_REQUESTS));

        } catch (error) {
          stats.errors++;
          console.error(`❌ Error processing ${searchTerm} in ${location.name}:`, error.message);
        }
      }
    }

    // Longer delay between batches
    if (i + BATCH_SIZE < UK_LOCATIONS.length) {
      console.log(`⏱️ Waiting ${DELAY_BETWEEN_BATCHES / 1000} seconds before next batch...`);
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
    }
  }

  // Final statistics
  console.log('\n📊 Scraping Complete! Final Statistics:');
  console.log(`🔍 Total searches performed: ${stats.totalSearches}`);
  console.log(`✅ Successful scrapes: ${stats.successfulScrapes}`);
  console.log(`🏢 Studios found: ${stats.studiosFound}`);
  console.log(`💾 Studios saved: ${stats.studiosSaved}`);
  console.log(`❌ Errors encountered: ${stats.errors}`);
  console.log(`📈 Success rate: ${((stats.successfulScrapes / stats.totalSearches) * 100).toFixed(1)}%`);

  return stats;
}

// Add function to scrape Google My Business data specifically
async function scrapeGoogleMyBusinessData(studioName, location) {
  try {
    const searchQuery = `"${studioName}" pilates ${location.name} site:google.com`;
    const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;

    const crawlResult = await firecrawl.scrapeUrl(googleUrl, {
      formats: ['markdown'],
      onlyMainContent: true,
      waitFor: 3000,
      timeout: 30000
    });

    if (crawlResult.success) {
      const content = crawlResult.data.markdown || '';

      // Extract specific Google My Business data
      const gmb_data = {
        rating: extractGoogleRating(content),
        review_count: extractGoogleReviewCount(content),
        address: extractGoogleAddress(content),
        phone: extractGooglePhone(content),
        hours: extractGoogleHours(content),
        website: extractGoogleWebsite(content)
      };

      return gmb_data;
    }

    return null;
  } catch (error) {
    console.error(`Error scraping GMB data for ${studioName}:`, error.message);
    return null;
  }
}

function extractGoogleRating(content) {
  const ratingPattern = /(\d\.\d)\s*(?:stars?|★|rating)/i;
  const match = content.match(ratingPattern);
  return match ? parseFloat(match[1]) : null;
}

function extractGoogleReviewCount(content) {
  const reviewPattern = /(\d+(?:,\d+)*)\s*(?:reviews?|ratings?)/i;
  const match = content.match(reviewPattern);
  return match ? parseInt(match[1].replace(/,/g, '')) : null;
}

function extractGoogleAddress(content) {
  const addressPattern = /(?:Address|Located|Location):\s*(.+?)(?:\n|$)/i;
  const match = content.match(addressPattern);
  return match ? match[1].trim() : null;
}

function extractGooglePhone(content) {
  const phonePattern = /(?:Phone|Tel|Call):\s*([\d\s\+\(\)\-]+)/i;
  const match = content.match(phonePattern);
  return match ? match[1].trim() : null;
}

function extractGoogleHours(content) {
  const hoursPattern = /(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)[\s:]*(.+?)(?=(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)|$)/gi;
  const hours = {};
  let match;

  while ((match = hoursPattern.exec(content)) !== null) {
    const day = match[1].toLowerCase();
    const time = match[2].trim();
    hours[day] = time;
  }

  return Object.keys(hours).length > 0 ? hours : null;
}

function extractGoogleWebsite(content) {
  const websitePattern = /(?:Website|Visit|URL):\s*(https?:\/\/[\w\-\.]+)/i;
  const match = content.match(websitePattern);
  return match ? match[1] : null;
}

// Main execution
if (require.main === module) {
  scrapePilatesStudios()
    .then((stats) => {
      console.log('\n🎉 Pilates studio scraping completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Fatal error during scraping:', error);
      process.exit(1);
    });
}

module.exports = { scrapePilatesStudios, scrapePilatesStudiosForLocation, saveStudioToDatabase };