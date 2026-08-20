/**
 * Test script for pilates data collection
 * Tests Google Maps API and Firecrawl integration with a small sample
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// API Configuration
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SECRET_KEY;

console.log('🔧 Configuration Check:');
console.log('Google Maps API Key:', GOOGLE_MAPS_API_KEY ? '✅ Set' : '❌ Missing');
console.log('Firecrawl API Key:', FIRECRAWL_API_KEY ? '✅ Set' : '❌ Missing');
console.log('Supabase URL:', SUPABASE_URL ? '✅ Set' : '❌ Missing');
console.log('Supabase Service Key:', SUPABASE_SERVICE_KEY ? '✅ Set' : '❌ Missing');

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

/**
 * Test Google Places API
 */
async function testGooglePlaces() {
  console.log('\n🗺️  Testing Google Places API...');

  const query = 'pilates studios in Brighton, UK';
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_MAPS_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    console.log('API Status:', data.status);
    if (data.results && data.results.length > 0) {
      console.log(`✅ Found ${data.results.length} results`);
      console.log('First result:', data.results[0].name);
      return data.results[0]; // Return first result for further testing
    } else {
      console.log('❌ No results found');
      return null;
    }
  } catch (error) {
    console.error('❌ Google Places API error:', error.message);
    return null;
  }
}

/**
 * Test Google Place Details API
 */
async function testPlaceDetails(placeId) {
  console.log('\n📍 Testing Place Details API...');

  const fields = 'name,formatted_address,website,rating,user_ratings_total,formatted_phone_number';
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${GOOGLE_MAPS_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK') {
      console.log('✅ Place details retrieved');
      console.log('Name:', data.result.name);
      console.log('Address:', data.result.formatted_address);
      console.log('Website:', data.result.website || 'No website');
      console.log('Rating:', data.result.rating || 'No rating');
      return data.result;
    } else {
      console.log('❌ Place details error:', data.status);
      return null;
    }
  } catch (error) {
    console.error('❌ Place Details API error:', error.message);
    return null;
  }
}

/**
 * Test Firecrawl API
 */
async function testFirecrawl(websiteUrl) {
  if (!websiteUrl) {
    console.log('\n🕷️  Skipping Firecrawl test - no website URL');
    return null;
  }

  console.log('\n🕷️  Testing Firecrawl API...');
  console.log('Target URL:', websiteUrl);

  try {
    const response = await fetch('https://api.firecrawl.dev/v0/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: websiteUrl,
        formats: ['extract'],
        extract: {
          schema: {
            type: 'object',
            properties: {
              studio_name: { type: 'string' },
              description: { type: 'string' },
              class_types: {
                type: 'array',
                items: { type: 'string' }
              },
              instructors: {
                type: 'array',
                items: { type: 'string' }
              },
              contact_email: { type: 'string' },
              phone: { type: 'string' },
              pricing: { type: 'string' },
              specialties: {
                type: 'array',
                items: { type: 'string' }
              }
            }
          },
          systemPrompt: 'Extract information about this pilates studio from the website content.',
          prompt: 'Extract the studio name, description, types of pilates classes offered, instructor names, contact information, pricing details, and any specialties or unique features.'
        }
      })
    });

    const data = await response.json();

    if (data.success) {
      console.log('✅ Firecrawl successful');
      console.log('Extracted data:', JSON.stringify(data.data?.extract, null, 2));
      return data.data;
    } else {
      console.log('❌ Firecrawl error:', data.error || 'Unknown error');
      console.log('Full response:', JSON.stringify(data, null, 2));
      return null;
    }
  } catch (error) {
    console.error('❌ Firecrawl API error:', error.message);
    return null;
  }
}

/**
 * Test Database Connection
 */
async function testDatabase() {
  console.log('\n💾 Testing Database Connection...');

  try {
    // Test connection by selecting a few locations
    const { data, error } = await supabase
      .from('locations')
      .select('name')
      .limit(3);

    if (error) {
      console.log('❌ Database error:', error.message);
      console.log('Full error:', JSON.stringify(error, null, 2));
      return false;
    } else {
      console.log('✅ Database connection successful');
      console.log(`Found ${data.length} locations:`, data.map(l => l.name).join(', '));
      return true;
    }
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    return false;
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('🧪 Running Data Collection Tests\n');

  // Test database first
  const dbOk = await testDatabase();
  if (!dbOk) return;

  // Test Google Places API
  const firstPlace = await testGooglePlaces();
  if (!firstPlace) return;

  // Test Place Details API
  const placeDetails = await testPlaceDetails(firstPlace.place_id);
  if (!placeDetails) return;

  // Test Firecrawl if website available
  if (placeDetails.website) {
    await testFirecrawl(placeDetails.website);
  }

  console.log('\n🎉 All tests completed!');
  console.log('\n📋 Next Steps:');
  console.log('1. Run: npm run collect:pilates (to start full collection)');
  console.log('2. Monitor the database for new studio entries');
  console.log('3. Check the website to see studios appearing');
}

// Run tests
runTests().catch(console.error);