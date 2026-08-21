#!/usr/bin/env node
/**
 * Enrich studios from their own websites via Firecrawl.
 *
 * Firecrawl returns LLM-extracted JSON, which is not trustworthy as-is: in
 * testing it filled empty numbers with 0, wrote "Not explicitly stated" into
 * string fields, and listed Les Mills classes as pilates types. Everything is
 * therefore validated before it can be written, and anything that fails
 * validation is dropped rather than stored.
 *
 * Every written value records its source and the page it came from.
 *
 *   node scripts/enrich-from-websites.js --limit 40           # dry run
 *   node scripts/enrich-from-websites.js --limit 40 --execute # write
 *
 * Cost: 5 Firecrawl credits per studio.
 */

require('dotenv').config({ path: '.env.local' });
const { Firecrawl } = require('@mendable/firecrawl-js');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const argv = process.argv.slice(2);
const EXECUTE = argv.includes('--execute');
const LIMIT = Number(argv[argv.indexOf('--limit') + 1]) || 25;
const CONCURRENCY = 2;            // the plan's maxConcurrency
const CREDITS_PER_STUDIO = 5;
// The plan allows 10 requests/minute. Pace below it rather than burning
// attempts on 429s - 20 of 30 failed that way before this was added.
const MAX_PER_MINUTE = 8;

const fc = new Firecrawl({ apiKey: process.env.FIRECRAWL_API_KEY });
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY);

const minInterval = 60000 / MAX_PER_MINUTE;
let nextSlot = 0;
async function throttle() {
  const now = Date.now();
  const slot = Math.max(now, nextSlot);
  nextSlot = slot + minInterval;
  if (slot > now) await new Promise(r => setTimeout(r, slot - now));
}

/* ------------------------------------------------------------- vocabularies */

// Only pilates disciplines. Keeps "Les Mills BODYPUMP" and similar out.
const CLASS_TYPES = {
  reformer: 'Reformer Pilates',
  mat: 'Mat Pilates',
  clinical: 'Clinical Pilates',
  rehab: 'Clinical Pilates',
  physio: 'Clinical Pilates',
  prenatal: 'Prenatal Pilates',
  antenatal: 'Prenatal Pilates',
  pregnancy: 'Prenatal Pilates',
  postnatal: 'Postnatal Pilates',
  barre: 'Barre',
  tower: 'Tower Pilates',
  cadillac: 'Cadillac Pilates',
  chair: 'Chair Pilates',
  'pre-pilates': 'Beginner Pilates',
  beginner: 'Beginner Pilates',
  private: 'Private Pilates',
  '1:1': 'Private Pilates',
  'one to one': 'Private Pilates',
  duet: 'Duet Pilates',
  equipment: 'Equipment Pilates',
};

const QUALIFICATIONS = ['BASI', 'Body Control', 'APPI', 'Polestar', 'STOTT', 'PMA', 'HCPC', 'CSP', 'Pilates Foundation'];

const BOOKING_PLATFORMS = ['Mindbody', 'TeamUp', 'Momence', 'ClassPass', 'Glofox', 'Bookwhen', 'Gymcatch', 'Acuity', 'Direct'];

/** Model filler that means "I found nothing". */
const NO_VALUE = /^(not\s+(explicitly\s+)?(stated|specified|mentioned|listed|available|provided)|none|n\/?a|unknown|null|-|tbc|see website|contact.*)$/i;

/* -------------------------------------------------------------- validation */

const cleanString = (v) => {
  if (typeof v !== 'string') return null;
  const s = v.trim();
  if (!s || NO_VALUE.test(s) || s.length < 3) return null;
  return s;
};

const cleanUrl = (v) => {
  const s = cleanString(v);
  if (!s) return null;
  try {
    const u = new URL(s);
    return u.protocol === 'http:' || u.protocol === 'https:' ? u.toString() : null;
  } catch { return null; }
};

/** Numbers only inside a plausible range; 0 means "not found", not free. */
const cleanNumber = (v, min, max) => {
  const n = typeof v === 'number' ? v : parseFloat(v);
  if (!Number.isFinite(n) || n < min || n > max) return null;
  return n;
};

function cleanClassTypes(v) {
  if (!Array.isArray(v)) return null;
  const out = new Set();
  for (const raw of v) {
    if (typeof raw !== 'string') continue;
    const s = raw.toLowerCase();
    for (const [needle, label] of Object.entries(CLASS_TYPES)) {
      if (s.includes(needle)) out.add(label);
    }
  }
  return out.size ? [...out] : null;
}

function cleanQualifications(v) {
  if (!Array.isArray(v)) return null;
  const out = new Set();
  for (const raw of v) {
    if (typeof raw !== 'string') continue;
    for (const q of QUALIFICATIONS) {
      if (raw.toLowerCase().includes(q.toLowerCase())) out.add(q);
    }
  }
  return out.size ? [...out] : null;
}

/**
 * Kept for reference but not written. Instructor names are deliberately not
 * published: the directory previously carried invented ones, and a name
 * scraped from a page is weaker evidence than a stated qualification.
 */
function cleanNames(v) {
  if (!Array.isArray(v)) return null;
  const out = v
    .map(n => cleanString(n))
    .filter(Boolean)
    .filter(n => /^[A-Z][a-zA-Z'’.-]+(\s+[A-Z][a-zA-Z'’.-]+){1,3}$/.test(n))
    .filter(n => !/pilates|studio|team|instructor|classes|fitness/i.test(n))
    .slice(0, 12);
  return out.length ? [...new Set(out)] : null;
}

/**
 * A price field must contain an actual amount. Without this the model offers
 * marketing copy - "Free first class", "Choose your membership available" -
 * which reads as a price on the page but tells the visitor nothing.
 */
const cleanPriceText = (v) => {
  const s = cleanString(v);
  if (!s) return null;
  if (!/£\s*\d|\d+\s*(?:pounds|gbp)\b/i.test(s)) return null;
  return s.slice(0, 120);
};

function cleanPlatform(v) {
  const s = cleanString(v);
  if (!s) return null;
  const hit = BOOKING_PLATFORMS.find(p => s.toLowerCase().includes(p.toLowerCase()));
  return hit || null;
}

/* ------------------------------------------------------------------ schema */

const SCHEMA = {
  type: 'object',
  properties: {
    class_types: { type: 'array', items: { type: 'string' },
      description: 'Pilates class types explicitly offered, e.g. Reformer, Mat, Clinical, Prenatal, Barre. Omit anything that is not pilates. Empty array if unclear.' },
    price_drop_in: { type: 'number', description: 'Single drop-in class price in GBP. Omit the field entirely if not stated. Never guess and never use 0.' },
    price_class_pack: { type: 'string', description: 'Class pack price exactly as written, e.g. "10 classes for £150". Omit if not stated.' },
    price_membership: { type: 'string', description: 'Membership price exactly as written, e.g. "£89 per month". Omit if not stated.' },
    booking_url: { type: 'string', description: 'Full URL to book a class. Omit if there is none.' },
    booking_platform: { type: 'string', description: 'Booking platform name if identifiable from links: Mindbody, TeamUp, Momence, ClassPass, Glofox, Bookwhen, Gymcatch, Acuity.' },
    instructor_qualifications: { type: 'array', items: { type: 'string' }, description: 'Pilates qualifications mentioned: BASI, Body Control, APPI, Polestar, STOTT, PMA, HCPC, CSP.' },
    class_size_max: { type: 'number', description: 'Maximum number of people per class if stated. Omit if not stated. Never use 0.' },
    beginner_friendly: { type: 'boolean', description: 'True only if the page explicitly welcomes beginners.' },
    description: { type: 'string', description: "Two sentences describing the studio in its own words. Omit if the page has no usable description." },
  },
};

/* -------------------------------------------------------------------- main */

async function enrich(studio, attempt = 1) {
  await throttle();
  let doc;
  try {
    doc = await fc.scrape(studio.website, {
    formats: [{ type: 'json', schema: SCHEMA }],
      onlyMainContent: true,
      timeout: 45000,
    });
  } catch (e) {
    // Back off and retry a rate limit rather than losing the studio.
    if (/rate limit/i.test(String(e.message)) && attempt <= 3) {
      await new Promise(r => setTimeout(r, 20000 * attempt));
      return enrich(studio, attempt + 1);
    }
    throw e;
  }
  const j = doc.json || {};

  const fields = {
    class_types: cleanClassTypes(j.class_types),
    price_drop_in: cleanNumber(j.price_drop_in, 1, 200),
    price_class_pack: cleanPriceText(j.price_class_pack),
    price_membership: cleanPriceText(j.price_membership),
    booking_url: cleanUrl(j.booking_url),
    booking_platform: cleanPlatform(j.booking_platform),
    instructor_qualifications: cleanQualifications(j.instructor_qualifications),
    class_size_max: cleanNumber(j.class_size_max, 1, 100),
    beginner_friendly: typeof j.beginner_friendly === 'boolean' ? j.beginner_friendly : null,
    description: (() => {
      const d = cleanString(j.description);
      return d && d.length >= 40 ? d.slice(0, 600) : null;
    })(),
  };

  // beginner_friendly false is indistinguishable from "not found" here, so it
  // is only recorded when true.
  if (fields.beginner_friendly !== true) fields.beginner_friendly = null;

  const kept = Object.fromEntries(Object.entries(fields).filter(([, v]) => v != null));
  return { kept, raw: j };
}

(async () => {
  console.log(EXECUTE ? 'mode: EXECUTE (writes to database)' : 'mode: DRY RUN (writes nothing)');

  const credits = (await fc.getCreditUsage()).remainingCredits;
  const need = LIMIT * CREDITS_PER_STUDIO;
  console.log(`credits: ${credits} available, ~${need} needed for ${LIMIT} studios\n`);
  if (need > credits) {
    console.error(`Not enough credits: ${LIMIT} studios needs ~${need}. Lower --limit.`);
    process.exit(1);
  }

  // Most-reviewed first, but only genuine pilates studios. Ordering by
  // reviews alone surfaces leisure centres and gyms, whose pages yield
  // little and whose pilates offering is incidental.
  const { data: pool, error } = await sb
    .from('pilates_studios')
    .select('id,name,website,field_sources,google_review_count')
    .eq('is_active', true)
    .eq('business_status', 'OPERATIONAL')
    .not('website', 'is', null)
    .is('website_scraped_at', null)
    .order('google_review_count', { ascending: false })
    .limit(1000);
  if (error) throw error;

  const studios = (pool || [])
    .filter(s => /pilates|reformer/i.test(s.name))
    .slice(0, LIMIT);
  console.log(`studios to process: ${studios.length}\n`);

  const results = [], failures = [];
  const fieldTally = {};
  let cursor = 0;

  async function worker() {
    for (;;) {
      const i = cursor++;
      if (i >= studios.length) return;
      const s = studios[i];
      try {
        const { kept } = await enrich(s);
        Object.keys(kept).forEach(k => { fieldTally[k] = (fieldTally[k] || 0) + 1; });
        results.push({ id: s.id, name: s.name, website: s.website, fields: kept });

        if (EXECUTE) {
          const now = new Date().toISOString();
          const sources = { ...(s.field_sources || {}) };
          const update = { website_scraped_at: now, website_scrape_status: Object.keys(kept).length ? 'ok' : 'no_data' };
          for (const [k, v] of Object.entries(kept)) {
            // Owner-supplied data always wins.
            if (sources[k]?.source === 'owner') continue;
            update[k] = v;
            sources[k] = { source: 'website', at: now, url: s.website };
          }
          update.field_sources = sources;
          const { error: wErr } = await sb.from('pilates_studios').update(update).eq('id', s.id);
          if (wErr) failures.push({ name: s.name, error: `write failed: ${wErr.message}` });
        }
      } catch (e) {
        failures.push({ name: s.name, website: s.website, error: String(e.message).slice(0, 110) });
        if (EXECUTE) {
          await sb.from('pilates_studios')
            .update({ website_scraped_at: new Date().toISOString(), website_scrape_status: 'fetch_failed' })
            .eq('id', s.id);
        }
      }
      process.stdout.write(`\r  processed ${results.length + failures.length}/${studios.length}`);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  console.log('\n');

  const withAny = results.filter(r => Object.keys(r.fields).length).length;
  console.log(`RESULTS`);
  console.log(`  scraped ok        : ${results.length}`);
  console.log(`  failed            : ${failures.length}`);
  console.log(`  yielded some data : ${withAny}`);
  console.log('\nFIELD YIELD (share of studios scraped):');
  Object.entries(fieldTally).sort((a, b) => b[1] - a[1]).forEach(([k, n]) =>
    console.log(`  ${k.padEnd(28)} ${String(n).padStart(4)}  ${((100 * n) / (results.length || 1)).toFixed(0)}%`));

  if (failures.length) {
    console.log(`\nFAILURES (first 8):`);
    failures.slice(0, 8).forEach(f => console.log(`  ${f.name?.slice(0, 34)}: ${f.error}`));
  }

  fs.writeFileSync('_enrich_preview.json', JSON.stringify({ results, failures }, null, 1));
  console.log(`\npreview: _enrich_preview.json`);
  const after = (await fc.getCreditUsage()).remainingCredits;
  console.log(`credits used: ${credits - after}   remaining: ${after}`);
  if (!EXECUTE) console.log('nothing written. re-run with --execute to apply.');
})().catch(e => { console.error(e); process.exit(1); });
