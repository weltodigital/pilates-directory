require('dotenv').config({ path: '.env.local', quiet: true })
const { createClient } = require('@supabase/supabase-js')
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)

;(async () => {
  // Four throwaway studios in the unlinked test town, so no real listing is
  // ever marked as paid-for.
  const ids = []
  for (let i = 1; i <= 4; i++) {
    const { data, error } = await s.from('pilates_studios').insert({
      name: `ZZ Slot Test ${i}`, postcode: 'DT9 6LQ',
      city: 'Zz Test Town', county: 'Zz Test',
      city_slug: 'zz-test-town', county_slug: 'zz-test',
      full_url_path: `zz-test/zz-test-town/zz-slot-test-${i}`,
      latitude: 50.894111, longitude: -2.577092,
      description: `Throwaway studio ${i} used to test the featured-slot cap.`,
      google_rating: 4.5 + i / 10, google_review_count: 10 * i,
      class_types: ['Mat Pilates', 'Reformer Pilates'],
      phone: `01935 00000${i}`, is_active: true, is_verified: true,
    }).select('id').single()
    if (error) return console.log('FAIL creating studio', i, error.message)
    ids.push(data.id)
  }
  console.log('created 4 test studios\n')

  // Claim slots the way the app does: try each number, collide, move on.
  const results = []
  for (let i = 0; i < 4; i++) {
    let placed = null, lastError = null
    for (const slot of [1, 2, 3]) {
      const { data, error } = await s.from('featured_listings').insert({
        studio_id: ids[i], county_slug: 'zz-test', city_slug: 'zz-test-town',
        slot, status: 'active', started_at: new Date(Date.now() + i * 1000).toISOString(),
      }).select('id,slot').single()
      if (!error) { placed = data; break }
      lastError = error
    }
    results.push({ studio: i + 1, slot: placed?.slot ?? null, error: placed ? null : lastError?.code })
    console.log(`studio ${i + 1}: ${placed ? 'slot ' + placed.slot : 'REFUSED (' + lastError?.code + ' unique violation)'}`)
  }

  const placed = results.filter(r => r.slot).length
  console.log(`\nslots filled: ${placed} (cap is 3) -> ${placed === 3 ? 'CAP HELD' : 'CAP FAILED'}`)

  // And the per-studio cap: one studio cannot buy a second slot.
  const { error: dupe } = await s.from('featured_listings').insert({
    studio_id: ids[0], county_slug: 'zz-test', city_slug: 'zz-test-town',
    slot: 1, status: 'active',
  })
  console.log('same studio buying twice:', dupe ? 'REFUSED (' + dupe.code + ')' : 'ALLOWED — BUG')

  require('fs').writeFileSync('.zz-ids.json', JSON.stringify(ids))
})()
