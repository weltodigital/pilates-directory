import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zytpgaraxyhlsvvkrrir.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5dHBnYXJheHlobHN2dmtycmlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3OTgzMTIsImV4cCI6MjA3NDM3NDMxMn0.UBDHD3Qlz-gGdXrqXLMyf8DI4hTOdG-FXByF9WOXM98'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function queryGreaterManchesterLocations() {
  try {
    console.log('🔍 Querying Greater Manchester locations...')

    // First, let's see what columns exist in public_locations
    console.log('📋 Checking public_locations structure...')
    const { data: sampleData, error: sampleError } = await supabase
      .from('public_locations')
      .select('*')
      .limit(1)

    if (sampleError) {
      console.error('❌ Error getting sample data:', sampleError)
      return
    }

    if (sampleData && sampleData.length > 0) {
      console.log('Available columns:', Object.keys(sampleData[0]))
    }

    // Query all Greater Manchester locations
    const { data: locations, error } = await supabase
      .from('public_locations')
      .select('*')
      .or('name.ilike.%manchester%')
      .order('name')

    if (error) {
      console.error('❌ Error querying locations:', error)
      return
    }

    console.log(`\n📍 Found ${locations.length} Greater Manchester locations:`)
    console.log('='.repeat(80))

    const locationsWithoutStudios = []

    locations.forEach((location, index) => {
      const studioCount = location.butcher_count || 0
      const hasStudios = studioCount > 0 ? '✅' : '❌'

      console.log(`${index + 1}. ${location.name} (${location.type})`)
      console.log(`   County: ${location.county || 'N/A'}`)
      console.log(`   Slug: ${location.slug}`)
      console.log(`   Studios: ${studioCount} ${hasStudios}`)
      console.log(`   Population: ${location.population || 'N/A'}`)

      if (location.postcode_areas && location.postcode_areas.length > 0) {
        console.log(`   Postcode areas: ${location.postcode_areas.join(', ')}`)
      }

      console.log('')

      if (studioCount === 0) {
        locationsWithoutStudios.push(location)
      }
    })

    console.log('\n🎯 LOCATIONS WITHOUT PILATES STUDIOS:')
    console.log('=' .repeat(50))

    if (locationsWithoutStudios.length === 0) {
      console.log('All Greater Manchester locations have pilates studios!')
    } else {
      locationsWithoutStudios.forEach((location, index) => {
        console.log(`${index + 1}. ${location.name} (${location.type})`)
        console.log(`   County: ${location.county || 'N/A'}`)
        console.log(`   Population: ${location.population || 'N/A'}`)
        if (location.postcode_areas && location.postcode_areas.length > 0) {
          console.log(`   Postcode areas: ${location.postcode_areas.join(', ')}`)
        }
        console.log('')
      })

      console.log(`\n📊 Summary: ${locationsWithoutStudios.length} locations need pilates studios`)
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

// Run the query
queryGreaterManchesterLocations()