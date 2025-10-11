import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zytpgaraxyhlsvvkrrir.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5dHBnYXJheHlobHN2dmtycmlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODc5ODMxMiwiZXhwIjoyMDc0Mzc0MzEyfQ.XLBFI-CGJXMi3yrLsb7FP2DOXRJy-IDDIwSWt7W95Ok'

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

export { createClient }
export const supabase = createClient(supabaseUrl, supabaseServiceKey)