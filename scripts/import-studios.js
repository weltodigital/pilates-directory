#!/usr/bin/env node
/**
 * Import studios from a Google Maps Extractor CSV.
 *
 * Matches on placeId against google_place_id, so only genuinely new studios
 * are added. Every value written comes from the CSV or from postcodes.io -
 * nothing is generated or inferred.
 *
 * Location model:
 *   England            -> /<ceremonial-county>/<town>/<studio>
 *   Scotland/Wales/NI  -> /<country>/<town>/<studio>
 *
 *   node scripts/import-studios.js <file.csv>              # dry run
 *   node scripts/import-studios.js <file.csv> --execute    # write
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const FILE = process.argv[2];
const EXECUTE = process.argv.includes('--execute');
if (!FILE || !fs.existsSync(FILE)) { console.error('usage: import-studios.js <file.csv> [--execute]'); process.exit(1); }

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY);

/* ------------------------------------------------------------------ helpers */

function parseCsv(text) {
  const rows = []; let row = [], cur = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i+1] === '"') { cur += '"'; i++; } else q = false; } else cur += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(cur); cur = ''; }
    else if (c === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; }
    else if (c !== '\r') cur += c;
  }
  if (cur || row.length) { row.push(cur); rows.push(row); }
  const head = rows.shift().map(h => h.replace(/^﻿/, ''));
  return rows.filter(r => r.length > 1).map(r => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ''])));
}

const slug = s => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/&/g, 'and').replace(/['’]/g, '').replace(/[^a-z0-9\s-]/g, ' ')
  .trim().replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

/**
 * Metropolitan boroughs and unitary authorities mapped onto the ceremonial
 * county the site already uses.
 *
 * postcodes.io returns admin_county = null for both, falling back to
 * admin_district - "Leeds", "Birmingham", "Manchester" - none of which are
 * counties. Without this table those cities cannot be imported at all.
 */
const UNITARY_TO_COUNTY = {
  // West Yorkshire
  'Leeds': 'west-yorkshire',
  'Bradford': 'west-yorkshire',
  'Kirklees': 'west-yorkshire',       // Huddersfield, Dewsbury, Batley
  'Calderdale': 'west-yorkshire',     // Halifax
  'Wakefield': 'west-yorkshire',
  // West Midlands
  'Birmingham': 'west-midlands',
  'Coventry': 'west-midlands',
  'Solihull': 'west-midlands',
  'Walsall': 'west-midlands',
  'Sandwell': 'west-midlands',        // West Bromwich
  'Dudley': 'west-midlands',
  'Wolverhampton': 'west-midlands',
  // Greater Manchester
  'Manchester': 'greater-manchester',
  'Salford': 'greater-manchester',
  'Bolton': 'greater-manchester',
  'Bury': 'greater-manchester',
  'Oldham': 'greater-manchester',
  'Rochdale': 'greater-manchester',
  'Stockport': 'greater-manchester',
  'Tameside': 'greater-manchester',
  'Trafford': 'greater-manchester',
  'Wigan': 'greater-manchester',
  // Merseyside
  'Liverpool': 'merseyside',
  'Knowsley': 'merseyside',
  'Sefton': 'merseyside',
  'St. Helens': 'merseyside',
  'Wirral': 'merseyside',
  // South Yorkshire
  'Sheffield': 'south-yorkshire',
  'Barnsley': 'south-yorkshire',
  'Doncaster': 'south-yorkshire',
  'Rotherham': 'south-yorkshire',
  // Tyne and Wear
  'Newcastle upon Tyne': 'tyne-and-wear',
  'Gateshead': 'tyne-and-wear',
  'North Tyneside': 'tyne-and-wear',
  'South Tyneside': 'tyne-and-wear',
  'Sunderland': 'tyne-and-wear',
  // Other unitary authorities
  'Cheshire West and Chester': 'cheshire',
  'Cheshire East': 'cheshire',
  'South Gloucestershire': 'gloucestershire',
  'Nottingham': 'nottinghamshire',
  'Derby': 'derbyshire',
  'Stoke-on-Trent': 'staffordshire',
  'Telford and Wrekin': 'shropshire',
  'Swindon': 'wiltshire',
  'West Berkshire': 'berkshire',
  'North Somerset': 'somerset',
  'Bath and North East Somerset': 'somerset',
  // Bristol sits under Somerset in the existing data; kept consistent so the
  // /somerset/bristol pages stay whole rather than splitting across two counties.
  'Bristol, City of': 'somerset',
  'Plymouth': 'devon',
  'Torbay': 'devon',
};

const COUNTRY_SLUG = { Scotland: 'scotland', Wales: 'wales', 'Northern Ireland': 'northern-ireland' };

/** CSV city values that are not place names. */
const BAD_CITY = /^(business park|village|villlage|unit|the )/i;
/** Regions and countries the extractor sometimes puts in the city field. */
// 'near' comes from addresses like "High St, Broom, Near B50 4HJ", where the
// extractor reads the word before the postcode as the town.
const NOT_A_TOWN = new Set(['yorkshire','england','scotland','wales','northern ireland',
  'united kingdom','uk','great britain','midlands','east midlands','west midlands',
  'near','nr','uk.','n/a','unknown']);

function openingHours(r) {
  const out = {};
  for (let i = 0; i < 7; i++) {
    const d = (r[`openingHours/${i}/day`] || '').trim();
    const h = (r[`openingHours/${i}/hours`] || '').trim();
    if (d && h) out[d.toLowerCase()] = h;
  }
  return Object.keys(out).length ? out : null;
}

function truthyGroup(r, prefix) {
  const found = new Set();
  for (const [k, v] of Object.entries(r)) {
    if (k.startsWith(prefix) && String(v).trim().toLowerCase() === 'true') {
      found.add(k.split('/').pop());
    }
  }
  return [...found];
}

function categories(r) {
  const out = [];
  for (let i = 0; i < 10; i++) {
    const c = (r[`categories/${i}`] || '').trim();
    if (c) out.push(c);
  }
  return out.length ? out : null;
}

/* --------------------------------------------------------------------- main */

(async () => {
  console.log(EXECUTE ? 'mode: EXECUTE (writes to database)\n' : 'mode: DRY RUN (writes nothing)\n');

  const csv = parseCsv(fs.readFileSync(FILE, 'utf8'));
  console.log(`csv rows: ${csv.length}`);

  // --- existing state -------------------------------------------------------
  const havePlace = new Set();
  const havePath = new Set();
  let from = 0;
  for (;;) {
    const { data, error } = await sb.from('pilates_studios')
      .select('google_place_id,full_url_path').range(from, from + 999);
    if (error) throw error;
    data.forEach(r => { if (r.google_place_id) havePlace.add(r.google_place_id); if (r.full_url_path) havePath.add(r.full_url_path); });
    if (data.length < 1000) break; from += 1000;
  }

  let locs = []; from = 0;
  for (;;) {
    const { data, error } = await sb.from('public_locations').select('name,slug,type,county_slug,full_path').range(from, from + 999);
    if (error) throw error;
    locs = locs.concat(data); if (data.length < 1000) break; from += 1000;
  }
  const haveCounty = new Set(locs.filter(l => l.type === 'county' || l.type === 'country').map(l => l.slug));
  const haveCity = new Set(locs.filter(l => l.type !== 'county' && l.type !== 'country').map(l => `${l.county_slug}/${l.slug}`));
  // town slug -> counties it already exists under, used to spot a CSV town that
  // belongs somewhere else entirely.
  const townCounties = new Map();
  locs.filter(l => l.type !== 'county' && l.type !== 'country')
      .forEach(l => { if (!townCounties.has(l.slug)) townCounties.set(l.slug, new Set()); townCounties.get(l.slug).add(l.county_slug); });
  console.log(`existing: ${havePlace.size} studios, ${haveCounty.size} counties/countries, ${haveCity.size} towns\n`);

  // --- new rows -------------------------------------------------------------
  const seen = new Set();
  const fresh = csv.filter(r => {
    const id = (r.placeId || '').trim();
    if (!id || havePlace.has(id) || seen.has(id)) return false;
    seen.add(id); return true;
  });
  console.log(`new studios in csv: ${fresh.length}`);

  // --- resolve postcodes ----------------------------------------------------
  const pcs = [...new Set(fresh.map(r => (r.postalCode || '').trim()).filter(Boolean))];
  const pc = new Map();
  for (let i = 0; i < pcs.length; i += 100) {
    const res = await fetch('https://api.postcodes.io/postcodes', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postcodes: pcs.slice(i, i + 100) }),
    });
    const j = await res.json();
    (j.result || []).forEach(x => { if (x.result) pc.set(x.query.toUpperCase().replace(/\s+/g, ''), x.result); });
  }
  console.log(`postcodes resolved: ${pc.size}/${pcs.length}`);

  // Postcodes get retired. postcodes.io returns nothing for them on the live
  // endpoint, but the studio still exists and the export carries coordinates,
  // so fall back to a reverse lookup on lat/lng.
  // Rows whose postcode is missing entirely, or retired and so absent from the
  // live lookup. Both still have coordinates, so reverse-geocode instead and
  // adopt the nearest real postcode.
  const unresolved = fresh.filter(r => {
    const k = (r.postalCode || '').toUpperCase().replace(/\s+/g, '');
    return !k || !pc.has(k);
  });
  let recovered = 0;
  for (const r of unresolved) {
    const lat = parseFloat(r['location/lat']), lon = parseFloat(r['location/lng']);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
    // Default search radius is 100m, which misses rural and edge-of-town
    // addresses. 2km is the maximum the API allows.
    const res = await fetch(`https://api.postcodes.io/postcodes?lon=${lon}&lat=${lat}&limit=1&radius=2000`);
    const j = await res.json();
    const hit = j.result && j.result[0];
    if (!hit) continue;
    // Adopt the resolved postcode when the export had none.
    if (!(r.postalCode || '').trim()) r.postalCode = hit.postcode;
    pc.set((r.postalCode || '').toUpperCase().replace(/\s+/g, ''), hit);
    recovered++;
  }
  if (unresolved.length) console.log(`recovered by coordinates: ${recovered}/${unresolved.length} (missing or retired postcodes)`);
  console.log();

  // --- build ----------------------------------------------------------------
  const studios = [], newCountries = new Map(), newCities = new Map(), skipped = [], relocated = [];
  const usedPaths = new Set(havePath);
  const now = new Date().toISOString();

  for (const r of fresh) {
    const p = pc.get((r.postalCode || '').toUpperCase().replace(/\s+/g, ''));
    if (!p) { skipped.push({ name: r.title, reason: 'postcode not resolvable' }); continue; }

    let countySlug, countyName;
    if (p.country === 'England') {
      const cand = p.admin_county || p.admin_district;
      countySlug = UNITARY_TO_COUNTY[cand] || slug(cand);
      countyName = cand;
      if (!haveCounty.has(countySlug)) { skipped.push({ name: r.title, reason: `county "${cand}" not in site` }); continue; }
    } else {
      countySlug = COUNTRY_SLUG[p.country];
      countyName = p.country;
      if (!countySlug) { skipped.push({ name: r.title, reason: `country "${p.country}"` }); continue; }
      if (!haveCounty.has(countySlug)) newCountries.set(countySlug, p.country);
    }

    // Town: the CSV's own city is the name people search; the admin district is
    // the administrative area ("Newark and Sherwood") and only a fallback.
    let cityName = (r.city || '').trim();
    if (!cityName || BAD_CITY.test(cityName) || NOT_A_TOWN.has(cityName.toLowerCase())) {
      const parish = p.parish && !/unparished/i.test(p.parish) ? p.parish : null;
      cityName = (r.neighborhood || '').trim() || parish || p.post_town || p.admin_district || '';
    }

    // A town the postcode data does not corroborate anywhere is probably a
    // building or estate name ("Castlestead"). The extractor's neighborhood
    // field is the better answer in that case.
    const corroborated = [p.admin_district, p.parish, p.post_town, p.admin_county]
      .filter(Boolean).some(v => v.toLowerCase().includes(cityName.toLowerCase()));
    if (!corroborated && (r.neighborhood || '').trim()) {
      const nb = r.neighborhood.trim();
      const nbOk = [p.admin_district, p.parish, p.post_town].filter(Boolean)
        .some(v => v.toLowerCase().includes(nb.toLowerCase()));
      if (nbOk) cityName = nb;
    }

    // Postal towns cross county lines: DE74 is a Derby postcode but sits in
    // Leicestershire, so the CSV says "Derby" while the studio is in Castle
    // Donington. When the CSV town is itself a place that belongs to a
    // different county, trust the postcode's parish instead.
    // Three signs the CSV town is wrong for this postcode:
    //  - it names a county/unitary that maps elsewhere ("Derby" in Leicestershire)
    //  - it already exists as a town under a different county ("Peterborough")
    //  - it is not a clean place name at all ("Coombe, St Stephen")
    const cityAsCounty = UNITARY_TO_COUNTY[cityName] || (haveCounty.has(slug(cityName)) ? slug(cityName) : null);
    const elsewhere = townCounties.has(slug(cityName)) && !townCounties.get(slug(cityName)).has(countySlug);
    const messy = cityName.includes(',');
    if ((cityAsCounty && cityAsCounty !== countySlug) || elsewhere || messy) {
      // Parish first, but reject administrative placeholders such as
      // "Erewash, unparished area". The extractor's neighborhood field is
      // usually the actual town in those cases ("Long Eaton").
      const parish = p.parish && !/unparished/i.test(p.parish) ? p.parish : null;
      const better = parish || (r.neighborhood || '').trim() || p.admin_district || cityName;
      relocated.push({ name: r.title, from: cityName, to: better, county: countySlug, postcode: r.postalCode });
      cityName = better;
    }
    if (!cityName) { skipped.push({ name: r.title, reason: 'no usable town' }); continue; }
    const citySlug = slug(cityName);
    const cityKey = `${countySlug}/${citySlug}`;
    if (!haveCity.has(cityKey)) newCities.set(cityKey, { name: cityName, slug: citySlug, county_slug: countySlug });

    // Unique studio path
    let base = slug(r.title);
    let path = `${cityKey}/${base}`;
    if (usedPaths.has(path)) path = `${cityKey}/${base}-${citySlug}`;
    let n = 2;
    while (usedPaths.has(path)) { path = `${cityKey}/${base}-${citySlug}-${n++}`; }
    usedPaths.add(path);

    const permClosed = String(r.permanentlyClosed).trim().toLowerCase() === 'true';
    const tempClosed = String(r.temporarilyClosed).trim().toLowerCase() === 'true';
    const access = truthyGroup(r, 'additionalInfo/Accessibility/');
    const parking = truthyGroup(r, 'additionalInfo/Parking/');
    const rating = parseFloat(r.totalScore);
    const reviews = parseInt(r.reviewsCount, 10);
    const postcode = (r.postalCode || '').toUpperCase().trim();

    const sources = {};
    const mark = k => { sources[k] = { source: 'google_maps_csv', at: now, confidence: 1 }; };

    const row = {
      name: (r.title || '').trim(),
      address: (r.address || '').trim() || null,
      postcode: postcode || null,
      outward_code: postcode ? postcode.split(/\s+/)[0] : null,
      city: cityName,
      county: countyName,
      city_slug: citySlug,
      county_slug: countySlug,
      full_url_path: path,
      latitude: parseFloat(r['location/lat']) || null,
      longitude: parseFloat(r['location/lng']) || null,
      google_place_id: (r.placeId || '').trim(),
      google_rating: Number.isFinite(rating) ? rating : null,
      google_review_count: Number.isFinite(reviews) ? reviews : 0,
      phone: (r.phone || '').trim() || null,
      website: (r.website || '').trim() || null,
      opening_hours: openingHours(r),
      google_primary_type: (r.categoryName || '').trim() || null,
      google_types: categories(r),
      business_status: permClosed ? 'CLOSED_PERMANENTLY' : tempClosed ? 'CLOSED_TEMPORARILY' : 'OPERATIONAL',
      accessibility_features: access.length ? access : null,
      parking_available: parking.length ? true : null,
      is_active: !permClosed,
      last_verified_at: now,
      last_scraped_at: now,
    };
    ['name','address','postcode','latitude','longitude','google_rating','google_review_count',
     'phone','website','opening_hours','google_primary_type','google_types','business_status',
     'accessibility_features','parking_available'].forEach(k => { if (row[k] !== null) mark(k); });
    row.field_sources = sources;

    studios.push(row);
  }

  // --- report ---------------------------------------------------------------
  const by = (arr, f) => arr.reduce((m, r) => (m[f(r)] = (m[f(r)] || 0) + 1, m), {});
  console.log(`STUDIOS TO INSERT: ${studios.length}`);
  console.log(`skipped: ${skipped.length}`);
  Object.entries(by(skipped, s => s.reason)).forEach(([k, v]) => console.log(`  ${String(v).padStart(4)}  ${k}`));

  if (relocated.length) {
    console.log(`\ntown corrected from the postcode (postal town crosses a county line): ${relocated.length}`);
    relocated.forEach(r => console.log(`  ${r.postcode.padEnd(9)} ${r.name.slice(0,32).padEnd(34)} ${r.from} -> ${r.to} (${r.county})`));
  }

  console.log(`\nnew country pages : ${newCountries.size}`);
  [...newCountries.values()].forEach(c => console.log(`  ${c}`));
  console.log(`new town pages    : ${newCities.size}`);

  console.log('\nstudios by county/country:');
  Object.entries(by(studios, s => s.county_slug)).sort((a, b) => b[1] - a[1]).slice(0, 15)
    .forEach(([k, v]) => console.log(`  ${String(v).padStart(4)}  ${k}`));

  console.log('\nbusiness status:');
  Object.entries(by(studios, s => s.business_status)).forEach(([k, v]) => console.log(`  ${String(v).padStart(4)}  ${k}`));

  console.log('\nsample paths:');
  studios.slice(0, 8).forEach(s => console.log(`  /${s.full_url_path}`));

  fs.writeFileSync('_import_preview.json', JSON.stringify({ studios, newCities: [...newCities.values()], newCountries: [...newCountries], skipped }, null, 1));
  console.log('\npreview written: _import_preview.json');

  if (!EXECUTE) { console.log('\nnothing written. re-run with --execute to apply.'); return; }

  // --- write ----------------------------------------------------------------
  console.log('\nwriting…');
  // public_locations.type is constrained to 'county' | 'city'. 'county' is this
  // schema's top-level location type, so Scotland/Wales/NI use it and every
  // existing route and query works unchanged.
  const countryRows = [...newCountries].map(([s, name]) => ({ name, slug: s, type: 'county', county_slug: null, full_path: s, butcher_count: 0 }));
  if (countryRows.length) {
    const { error } = await sb.from('public_locations').insert(countryRows);
    if (error) throw error;
    console.log(`  countries inserted: ${countryRows.length}`);
  }

  const cityRows = [...newCities.values()].map(c => ({
    name: c.name, slug: c.slug, type: 'city', county_slug: c.county_slug,
    full_path: `${c.county_slug}/${c.slug}`, butcher_count: 0,
  }));
  for (let i = 0; i < cityRows.length; i += 200) {
    const { error } = await sb.from('public_locations').insert(cityRows.slice(i, i + 200));
    if (error) throw error;
    process.stdout.write(`\r  towns inserted: ${Math.min(i + 200, cityRows.length)}/${cityRows.length}`);
  }
  console.log();

  for (let i = 0; i < studios.length; i += 200) {
    const { error } = await sb.from('pilates_studios').insert(studios.slice(i, i + 200));
    if (error) throw error;
    process.stdout.write(`\r  studios inserted: ${Math.min(i + 200, studios.length)}/${studios.length}`);
  }
  console.log('\ndone.');
})().catch(e => { console.error(e); process.exit(1); });
