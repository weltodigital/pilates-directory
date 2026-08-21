#!/usr/bin/env node
/**
 * Google Places refresh
 *
 * Re-reads every studio from the Places API (New) using its stored
 * google_place_id and reports (or applies) the differences.
 *
 * Only sourced values are ever written. Nothing is generated or inferred.
 *
 *   node scripts/places-refresh.js                  # dry run, 100 studios
 *   node scripts/places-refresh.js --limit 500      # dry run, 500 studios
 *   node scripts/places-refresh.js --all            # dry run, every studio
 *   node scripts/places-refresh.js --all --execute  # apply the changes
 *
 * Cost note: one Place Details call per studio, billed at the highest
 * field-mask tier touched (Enterprise, because of phone/rating/website).
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const KEY = process.env.GOOGLE_PLACES_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY;

if (!KEY) { console.error('GOOGLE_PLACES_API_KEY missing from .env.local'); process.exit(1); }
if (!SUPABASE_URL || !SUPABASE_KEY) { console.error('Supabase env vars missing'); process.exit(1); }

const argv = process.argv.slice(2);
const EXECUTE = argv.includes('--execute');
const ALL = argv.includes('--all');
const LIMIT = ALL ? Infinity : Number(argv[argv.indexOf('--limit') + 1]) || 100;
const CONCURRENCY = 8;
const COORD_TOLERANCE_M = 10;   // ignore sub-10m coordinate drift
// GetPlaceRequest is capped at 600/minute. Stay comfortably under it so the
// run never spends itself backing off 429s.
const MAX_PER_MINUTE = 450;

const FIELD_MASK = [
  'id',
  'displayName',
  'formattedAddress',
  'businessStatus',
  'nationalPhoneNumber',
  'websiteUri',
  'rating',
  'userRatingCount',
  'regularOpeningHours',
  'accessibilityOptions',
  'location',
].join(',');

const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

/** Spaces calls out to hold the request rate under MAX_PER_MINUTE. */
const minInterval = 60000 / MAX_PER_MINUTE;
let nextSlot = 0;
async function throttle() {
  const now = Date.now();
  const slot = Math.max(now, nextSlot);
  nextSlot = slot + minInterval;
  if (slot > now) await new Promise(r => setTimeout(r, slot - now));
}

async function fetchPlace(placeId, attempt = 1) {
  await throttle();
  const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
    headers: { 'X-Goog-Api-Key': KEY, 'X-Goog-FieldMask': FIELD_MASK },
  });

  if (res.status === 429 || res.status >= 500) {
    if (attempt > 4) return { __error: `retries exhausted (${res.status})` };
    await new Promise(r => setTimeout(r, 2 ** attempt * 500));
    return fetchPlace(placeId, attempt + 1);
  }

  const json = await res.json();
  if (json.error) return { __error: `${json.error.status}: ${json.error.message}` };
  return json;
}

/** Metres between two lat/lng pairs. */
function metresBetween(lat1, lng1, lat2, lng2) {
  const dLat = (lat2 - lat1) * 111320;
  const dLng = (lng2 - lng1) * 111320 * Math.cos((lat2 * Math.PI) / 180);
  return Math.sqrt(dLat * dLat + dLng * dLng);
}

const UK_POSTCODE = /\b([A-Z]{1,2}\d[A-Z\d]?)\s*(\d[A-Z]{2})\b/i;

/** Map a Places response onto our column names. Undefined = Google had nothing. */
function mapToColumns(p, current) {
  const out = {};
  if (p.nationalPhoneNumber) out.phone = p.nationalPhoneNumber;
  if (p.websiteUri) out.website = p.websiteUri;
  if (typeof p.rating === 'number') out.google_rating = p.rating;
  if (typeof p.userRatingCount === 'number') out.google_review_count = p.userRatingCount;

  if (p.formattedAddress) {
    out.address = p.formattedAddress;
    // Keep postcode in step with the address, otherwise a relocation leaves
    // the two columns disagreeing.
    const m = p.formattedAddress.match(UK_POSTCODE);
    if (m) out.postcode = `${m[1].toUpperCase()} ${m[2].toUpperCase()}`;
  }

  // Only move coordinates on a real relocation. Most differences are
  // sub-metre float noise and rewriting them is churn, not enrichment.
  if (p.location && typeof p.location.latitude === 'number') {
    const moved = current.latitude == null || current.longitude == null
      ? Infinity
      : metresBetween(current.latitude, current.longitude, p.location.latitude, p.location.longitude);
    if (moved > COORD_TOLERANCE_M) {
      out.latitude = p.location.latitude;
      out.longitude = p.location.longitude;
    }
  }
  if (p.regularOpeningHours?.weekdayDescriptions?.length) {
    // "Monday: 9:00 AM – 5:00 PM" -> { monday: "9:00 AM – 5:00 PM" }
    out.opening_hours = Object.fromEntries(
      p.regularOpeningHours.weekdayDescriptions.map(d => {
        const i = d.indexOf(':');
        return [d.slice(0, i).trim().toLowerCase(), d.slice(i + 1).trim()];
      })
    );
  }
  return out;
}

const norm = (v) => (v === null || v === undefined ? null : typeof v === 'object' ? JSON.stringify(v) : String(v).trim());

async function run() {
  console.log(`mode: ${EXECUTE ? 'EXECUTE (writes to database)' : 'DRY RUN (writes nothing)'}`);
  console.log(`scope: ${ALL ? 'all studios' : `first ${LIMIT}`}\n`);

  let studios = [], from = 0;
  for (;;) {
    const { data, error } = await sb
      .from('pilates_studios')
      .select('id,name,google_place_id,phone,website,google_rating,google_review_count,address,postcode,latitude,longitude,opening_hours')
      .eq('is_active', true)
      .not('google_place_id', 'is', null)
      .range(from, from + 999);
    if (error) throw error;
    studios = studios.concat(data);
    if (data.length < 1000 || studios.length >= LIMIT) break;
    from += 1000;
  }
  if (studios.length > LIMIT) studios = studios.slice(0, LIMIT);
  console.log(`studios to check: ${studios.length}\n`);

  const changes = [];
  const stats = { ok: 0, errored: 0, closed: 0, notFound: 0, unchanged: 0 };
  const fieldFills = {};   // field -> count of studios gaining a value
  const fieldDiffs = {};   // field -> count of studios whose value would change
  const errors = [];
  const statusBreakdown = {};
  const notOperational = [];
  const deactivated = [];

  let cursor = 0;
  async function worker() {
    for (;;) {
      const i = cursor++;
      if (i >= studios.length) return;
      const s = studios[i];
      const p = await fetchPlace(s.google_place_id);

      if (p.__error) {
        stats.errored++;
        if (/NOT_FOUND/i.test(p.__error)) stats.notFound++;
        errors.push({ id: s.id, name: s.name, error: p.__error });
        continue;
      }
      stats.ok++;
      statusBreakdown[p.businessStatus || 'UNKNOWN'] = (statusBreakdown[p.businessStatus || 'UNKNOWN'] || 0) + 1;
      if (p.businessStatus && p.businessStatus !== 'OPERATIONAL') {
        stats.closed++;
        notOperational.push({ id: s.id, name: s.name, businessStatus: p.businessStatus });
      }

      // Permanently closed businesses come off the directory. Temporarily
      // closed ones are left active - they reopen.
      const closePermanently = p.businessStatus === 'CLOSED_PERMANENTLY';
      if (closePermanently) deactivated.push({ id: s.id, name: s.name });

      const incoming = mapToColumns(p, s);
      const diff = {};
      for (const [k, v] of Object.entries(incoming)) {
        const before = norm(s[k]);
        const after = norm(v);
        if (after === null || after === before) continue;
        // treat an empty opening_hours object as "no value"
        if (k === 'opening_hours' && before === '{}' ) { diff[k] = { before: null, after: v }; fieldFills[k] = (fieldFills[k]||0)+1; continue; }
        diff[k] = { before: s[k] ?? null, after: v };
        if (before === null) fieldFills[k] = (fieldFills[k] || 0) + 1;
        else fieldDiffs[k] = (fieldDiffs[k] || 0) + 1;
      }

      if (!Object.keys(diff).length && !closePermanently) { stats.unchanged++; continue; }
      changes.push({ id: s.id, name: s.name, businessStatus: p.businessStatus, diff });

      if (EXECUTE) {
        const update = Object.fromEntries(Object.entries(diff).map(([k, v]) => [k, v.after]));
        update.last_scraped_at = new Date().toISOString();
        if (closePermanently) update.is_active = false;
        const { error } = await sb.from('pilates_studios').update(update).eq('id', s.id);
        if (error) errors.push({ id: s.id, name: s.name, error: `write failed: ${error.message}` });
      }

      if ((stats.ok + stats.errored) % 50 === 0) {
        process.stdout.write(`\r  processed ${stats.ok + stats.errored}/${studios.length}`);
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  console.log(`\r  processed ${stats.ok + stats.errored}/${studios.length}\n`);

  console.log('RESULTS');
  console.log(`  API calls succeeded      : ${stats.ok}`);
  console.log(`  API errors               : ${stats.errored}${stats.notFound ? ` (${stats.notFound} place_id NOT_FOUND)` : ''}`);
  console.log(`  already up to date       : ${stats.unchanged}`);
  console.log(`  would change             : ${changes.length}`);
  console.log(`  NOT operational          : ${stats.closed}  <- closed / temporarily closed`);

  console.log(`\n  permanently closed -> deactivated : ${deactivated.length}`);

  console.log('\nBUSINESS STATUS');
  Object.entries(statusBreakdown).sort((a,b)=>b[1]-a[1])
    .forEach(([k,n]) => console.log(`  ${k.padEnd(22)} ${String(n).padStart(5)}`));

  const pct = (n) => `${((100 * n) / (stats.ok || 1)).toFixed(1)}%`;
  console.log('\nFIELDS GAINING A VALUE (currently empty)');
  Object.entries(fieldFills).sort((a, b) => b[1] - a[1])
    .forEach(([k, n]) => console.log(`  ${k.padEnd(22)} ${String(n).padStart(5)}  ${pct(n)}`));
  console.log('\nFIELDS WHERE OUR VALUE IS STALE (differs from Google)');
  Object.entries(fieldDiffs).sort((a, b) => b[1] - a[1])
    .forEach(([k, n]) => console.log(`  ${k.padEnd(22)} ${String(n).padStart(5)}  ${pct(n)}`));

  if (errors.length) {
    console.log(`\nERRORS (first 10 of ${errors.length})`);
    errors.slice(0, 10).forEach(e => console.log(`  ${e.name}: ${e.error}`));
  }

  const report = `places-refresh-report${EXECUTE ? '' : '-dryrun'}.json`;
  fs.writeFileSync(report, JSON.stringify({ generatedAt: new Date().toISOString(), stats, statusBreakdown, notOperational, deactivated, fieldFills, fieldDiffs, changes, errors }, null, 2));
  console.log(`\nfull report: ${report} (${changes.length} studio diffs)`);
  if (!EXECUTE) console.log('nothing was written. re-run with --execute to apply.');
}

run().catch(e => { console.error(e); process.exit(1); });
