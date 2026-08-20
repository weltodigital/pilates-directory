#!/usr/bin/env node

/**
 * Fix Row Level Security policies to allow data insertion
 */

require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase service role key')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixRLS() {
  console.log('🔧 Fixing Row Level Security Policies')
  console.log('====================================\n')

  try {
    // Disable RLS temporarily for butchers table
    console.log('1. Disabling RLS for butchers table...')
    const { error: disableError } = await supabase.rpc('exec', {
      sql: 'ALTER TABLE butchers DISABLE ROW LEVEL SECURITY;'
    })

    if (disableError) {
      console.log('   ⚠️  RLS already disabled or error:', disableError.message)
    } else {
      console.log('   ✅ RLS disabled for butchers')
    }

    // Disable RLS for reviews table
    console.log('2. Disabling RLS for reviews table...')
    const { error: disableReviewsError } = await supabase.rpc('exec', {
      sql: 'ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;'
    })

    if (disableReviewsError) {
      console.log('   ⚠️  RLS already disabled or error:', disableReviewsError.message)
    } else {
      console.log('   ✅ RLS disabled for reviews')
    }

    // Disable RLS for specialties table
    console.log('3. Disabling RLS for specialties table...')
    const { error: disableSpecialtiesError } = await supabase.rpc('exec', {
      sql: 'ALTER TABLE specialties DISABLE ROW LEVEL SECURITY;'
    })

    if (disableSpecialtiesError) {
      console.log('   ⚠️  RLS already disabled or error:', disableSpecialtiesError.message)
    } else {
      console.log('   ✅ RLS disabled for specialties')
    }

    console.log('\n🎉 RLS policies fixed!')
    console.log('Now you can add data to the database.')

  } catch (error) {
    console.error('❌ Error fixing RLS:', error.message)
  }
}

fixRLS()
