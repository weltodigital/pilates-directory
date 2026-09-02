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
 * MONEY. This script costs nothing to run, by construction. Every call is
 * billed whether or not it writes - a dry run costs exactly what --execute
 * costs - so the free monthly allowance is treated as the budget:
 *
 *   1. DAILY_CALL_BUDGET mirrors the server-side per-day quota, and the free
 *      monthly allowance (FIELD_TIERS.freePerMonth) bounds the month. Calls
 *      are tallied per day in .places-usage.json and the run stops at
 *      whichever limit binds first. Spending anything at all needs --paid,
 *      and --paid still prints the figure and waits for a typed confirmation.
 *   2. Scope is trimmed, not the work abandoned: studios are refreshed
 *      stalest-first, so a daily run walks the whole table over several
 *      months and every studio comes round again. Nothing is skipped
 *      permanently.
 *   3. Responses are cached to .places-cache for CACHE_TTL_DAYS, so the dry
 *      run and the --execute that follows share one set of calls. Cache hits
 *      are free and uncapped. --fresh bypasses.
 *   4. Billed calls are capped at the confirmed number, charged before the
 *      request goes out, so a retry loop cannot run the bill up.
 *
 * The field mask sets the price: a call is billed at the highest tier any
 * requested field belongs to, not per field. See FIELD_TIERS.
 *
 * The tally here is local and advisory - it cannot see calls made by anything
 * else holding the key. The only real ceiling is server-side: in Cloud console
 * set APIs & Services -> Places API (New) -> Quotas, and cap the daily
 * GetPlace requests. See BUDGET.md.
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const readline = require('readline');

const KEY = process.env.GOOGLE_PLACES_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY;

if (!KEY) { console.error('GOOGLE_PLACES_API_KEY missing from .env.local'); process.exit(1); }
if (!SUPABASE_URL || !SUPABASE_KEY) { console.error('Supabase env vars missing'); process.exit(1); }

const argv = process.argv.slice(2);
const EXECUTE = argv.includes('--execute');
const ALL = argv.includes('--all');
const LIMIT = ALL ? Infinity : Number(argv[argv.indexOf('--limit') + 1]) || 100;
const ASSUME_YES = argv.includes('--yes');
const PAID = argv.includes('--paid');
const FRESH = argv.includes('--fresh');
const ATMOSPHERE = argv.includes('--atmosphere');
const CONCURRENCY = 8;
const CACHE_DIR = '.places-cache';
const CACHE_TTL_DAYS = 30;
const USAGE_FILE = '.places-usage.json';
// Must not exceed the server-side GetPlaceRequest-per-day quota, which is the
// real ceiling. 30/day is ~930/month, inside the 1,000 free Enterprise calls.
// Raising this without raising the quota just buys RESOURCE_EXHAUSTED.
const DAILY_CALL_BUDGET = 30;
const COORD_TOLERANCE_M = 10;   // ignore sub-10m coordinate drift
// The server-side quota is 60 GetPlaceRequest/minute and 30/day (see
// BUDGET.md). Stay under the per-minute limit so the run never spends itself
// backing off 429s; the daily cap is what actually bounds the bill.
const MAX_PER_MINUTE = 30;

/**
 * Places (New) bills a Place Details call at the highest SKU tier any
 * requested field belongs to - not per field - so one field can reprice the
 * whole run. USD per 1,000 calls; each tier has its own monthly free
 * allowance, 1,000 at the two Enterprise tiers.
 *
 * editorialSummary is the only field we want from the top tier, and asking
 * for it costs ~20% more on every call. It is opt-in via --atmosphere.
 */
const FIELD_TIERS = [
  { name: 'Essentials', usdPer1000: 5, freePerMonth: 10000,
    fields: ['id', 'formattedAddress', 'location', 'types'] },
  { name: 'Pro', usdPer1000: 17, freePerMonth: 5000,
    fields: ['displayName', 'businessStatus', 'primaryType', 'primaryTypeDisplayName', 'accessibilityOptions'] },
  { name: 'Enterprise', usdPer1000: 20, freePerMonth: 1000,
    fields: ['nationalPhoneNumber', 'websiteUri', 'rating', 'userRatingCount', 'regularOpeningHours'] },
  { name: 'Enterprise+Atmosphere', usdPer1000: 25, freePerMonth: 1000, optional: true,
    fields: ['editorialSummary'] },
];

const ACTIVE_TIERS = FIELD_TIERS.filter(t => !t.optional || ATMOSPHERE);
const BILLED_TIER = ACTIVE_TIERS[ACTIVE_TIERS.length - 1];
const FIELD_MASK = ACTIVE_TIERS.flatMap(t => t.fields).join(',');
const usd = (calls) => (calls * BILLED_TIER.usdPer1000) / 1000;

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

const cachePath = (placeId) => `${CACHE_DIR}/${placeId.replace(/[^A-Za-z0-9_-]/g, '_')}.json`;

/** A cached response still inside its TTL, or null. */
function readCache(placeId) {
  if (FRESH) return null;
  try {
    const entry = JSON.parse(fs.readFileSync(cachePath(placeId), 'utf8'));
    if (Date.now() - entry.at > CACHE_TTL_DAYS * 86400000) return null;
    return entry.place;
  } catch { return null; }
}

function writeCache(placeId, place) {
  try {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    fs.writeFileSync(cachePath(placeId), JSON.stringify({ at: Date.now(), place }));
  } catch { /* a cache we cannot write is a slower run, not a failed one */ }
}

/**
 * Calls made per calendar month, per tier. Written as each call is charged
 * rather than at the end, so a crash or a Ctrl-C cannot lose the tally and
 * hand the next run an allowance it has already spent.
 */
const today = () => new Date().toISOString().slice(0, 10);
const thisMonth = () => new Date().toISOString().slice(0, 7);

function readUsage() {
  try { return JSON.parse(fs.readFileSync(USAGE_FILE, 'utf8')); } catch { return {}; }
}

function usedToday() {
  return readUsage()[today()]?.[BILLED_TIER.name] || 0;
}

function usedThisMonth() {
  return Object.entries(readUsage())
    .filter(([day]) => day.startsWith(thisMonth()))
    .reduce((n, [, tiers]) => n + (tiers[BILLED_TIER.name] || 0), 0);
}

function recordCall() {
  const usage = readUsage();
  const d = today();
  usage[d] = usage[d] || {};
  usage[d][BILLED_TIER.name] = (usage[d][BILLED_TIER.name] || 0) + 1;
  // Keep a year of history and no more.
  for (const key of Object.keys(usage).sort().slice(0, -370)) delete usage[key];
  try { fs.writeFileSync(USAGE_FILE, JSON.stringify(usage, null, 2)); } catch { /* tally is advisory */ }
}

const billing = { calls: 0, cacheHits: 0, cap: 0 };

async function fetchPlace(placeId, attempt = 1) {
  // Charge the budget once per studio. Retries below re-enter with attempt > 1
  // and are already paid for.
  if (attempt === 1) {
    const hit = readCache(placeId);
    if (hit) { billing.cacheHits++; return hit; }
    if (billing.calls >= billing.cap) return { __error: 'call cap reached' };
    billing.calls++;
    recordCall();
  }
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
  writeCache(placeId, json);
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
    if (m) {
      out.postcode = `${m[1].toUpperCase()} ${m[2].toUpperCase()}`;
      out.outward_code = m[1].toUpperCase();
    }
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
  if (p.businessStatus) out.business_status = p.businessStatus;
  if (p.primaryTypeDisplayName?.text || p.primaryType) {
    out.google_primary_type = p.primaryTypeDisplayName?.text || p.primaryType;
  }
  if (Array.isArray(p.types) && p.types.length) out.google_types = p.types;
  if (p.editorialSummary?.text) out.google_editorial_summary = p.editorialSummary.text;

  if (p.accessibilityOptions && Object.keys(p.accessibilityOptions).length) {
    out.accessibility = p.accessibilityOptions;
    // Only the flags Google actually set to true, as readable labels.
    // NOTE: wheelchairAccessibleParking is deliberately NOT mapped to
    // parking_available - "has accessible parking" is not "has parking".
    const LABELS = {
      wheelchairAccessibleEntrance: 'Wheelchair accessible entrance',
      wheelchairAccessibleParking: 'Wheelchair accessible parking',
      wheelchairAccessibleRestroom: 'Wheelchair accessible toilet',
      wheelchairAccessibleSeating: 'Wheelchair accessible seating',
    };
    const feats = Object.entries(p.accessibilityOptions)
      .filter(([k, v]) => v === true && LABELS[k]).map(([k]) => LABELS[k]);
    if (feats.length) out.accessibility_features = feats;
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

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(question, a => { rl.close(); resolve(a); }));
}

const norm = (v) => (v === null || v === undefined ? null : typeof v === 'object' ? JSON.stringify(v) : String(v).trim());

async function run() {
  console.log(`mode: ${EXECUTE ? 'EXECUTE (writes to database)' : 'DRY RUN (writes nothing)'}`);
  console.log(`scope: ${ALL ? 'all studios' : `first ${LIMIT}`}\n`);

  let studios = [], from = 0;
  for (;;) {
    const { data, error } = await sb
      .from('pilates_studios')
      .select('id,name,full_url_path,google_place_id,phone,website,google_rating,google_review_count,address,postcode,outward_code,latitude,longitude,opening_hours,business_status,accessibility,accessibility_features,google_primary_type,google_types,google_editorial_summary,field_sources,last_verified_at')
      .eq('is_active', true)
      .not('google_place_id', 'is', null)
      .order('last_verified_at', { ascending: true, nullsFirst: true })
      .order('id', { ascending: true })
      .range(from, from + 999);
    if (error) throw error;
    studios = studios.concat(data);
    if (data.length < 1000 || studios.length >= LIMIT) break;
    from += 1000;
  }
  if (studios.length > LIMIT) studios = studios.slice(0, LIMIT);
  console.log(`studios to check: ${studios.length}\n`);

  // Spend the free allowance, and stop there. Studios came back stalest-first,
  // so whatever the allowance does not cover this month is exactly what next
  // month's run reaches first. Nothing is dropped, only deferred.
  const spentToday = usedToday();
  const spentThisMonth = usedThisMonth();
  const freeLeft = Math.max(0, Math.min(
    DAILY_CALL_BUDGET - spentToday,                 // the server-side quota
    BILLED_TIER.freePerMonth - spentThisMonth,      // the free allowance
  ));

  const fromCache = [], needCall = [];
  for (const s of studios) (readCache(s.google_place_id) ? fromCache : needCall).push(s);

  const willCall = Math.min(needCall.length, PAID ? needCall.length : freeLeft);
  const deferred = needCall.length - willCall;
  const paidCalls = Math.max(0, willCall - freeLeft);

  studios = fromCache.concat(needCall.slice(0, willCall));
  billing.cap = willCall;

  console.log('BUDGET');
  console.log(`  billed tier              : ${BILLED_TIER.name} ($${BILLED_TIER.usdPer1000}/1,000)`);
  console.log(`  today's quota            : ${spentToday} of ${DAILY_CALL_BUDGET} used on ${today()}`);
  console.log(`  free allowance           : ${spentThisMonth} of ${BILLED_TIER.freePerMonth} used in ${thisMonth()}`);
  console.log(`  free from cache          : ${fromCache.length}`);
  console.log(`  calls this run           : ${willCall}`);
  console.log(`  estimated spend          : $${usd(paidCalls).toFixed(2)}\n`);

  if (deferred) {
    console.log(`  ${deferred} studios are deferred: today's ${DAILY_CALL_BUDGET}-call quota does not reach them.`);
    console.log(`  They are the stalest, so tomorrow's run takes them first.`);
    if (!PAID) console.log('  --paid would refresh them now, for money.');
    console.log('');
  }

  if (paidCalls > 0) {
    if (!process.stdin.isTTY || ASSUME_YES) {
      // --yes covers the free path only. Real money always needs a person.
      console.error(`refusing to spend $${usd(paidCalls).toFixed(2)} without an interactive confirmation.`);
      process.exit(1);
    }
    const answer = await ask(`spend $${usd(paidCalls).toFixed(2)} on ${paidCalls} calls beyond the free allowance? type yes: `);
    if (answer.trim().toLowerCase() !== 'yes') { console.log('cancelled. nothing was fetched.'); return; }
    console.log('');
  }

  if (!studios.length) { console.log('nothing to do.'); return; }

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

      // Reported, never auto-deactivated. business_status is stored so the
      // permanently-closed list can be reviewed and actioned separately.
      if (p.businessStatus === 'CLOSED_PERMANENTLY') {
        deactivated.push({ id: s.id, name: s.name, url: s.full_url_path });
      }

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

      if (!Object.keys(diff).length) { stats.unchanged++; continue; }
      changes.push({ id: s.id, name: s.name, businessStatus: p.businessStatus, diff });

      if (EXECUTE) {
        const now = new Date().toISOString();
        const update = Object.fromEntries(Object.entries(diff).map(([k, v]) => [k, v.after]));
        // Record where each value came from. Precedence is owner > website >
        // google_places > inferred, so never clobber a higher-tier source.
        const sources = { ...(s.field_sources || {}) };
        for (const k of Object.keys(diff)) {
          const existing = sources[k]?.source;
          if (existing === 'owner' || existing === 'website') {
            delete update[k];
            continue;
          }
          sources[k] = { source: 'google_places', at: now, confidence: 1 };
        }
        update.field_sources = sources;
        update.last_scraped_at = now;
        update.last_verified_at = now;
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

  console.log('\nSPEND');
  console.log(`  calls made               : ${billing.calls}`);
  console.log(`  free from cache          : ${billing.cacheHits}`);
  console.log(`  cost                     : $${usd(paidCalls).toFixed(2)}`);
  console.log(`  quota left today         : ${Math.max(0, DAILY_CALL_BUDGET - usedToday())} of ${DAILY_CALL_BUDGET}`);
  console.log(`  free allowance left      : ${Math.max(0, BILLED_TIER.freePerMonth - usedThisMonth())} of ${BILLED_TIER.freePerMonth} this month`);
  if (!EXECUTE && billing.calls) {
    console.log('  the --execute run replays this cache, so it spends nothing further');
  }

  console.log(`\n  permanently closed (reported only): ${deactivated.length}`);

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
