-- Enrichment schema for pilates_studios
--
-- Adds storage for: Google Places fields we can already fetch, website-extracted
-- fields (pricing, booking, qualifications), derived fields, category
-- verification, and per-field provenance.
--
-- Provenance is the important part. Every enriched value records where it came
-- from, so nothing can be published without a traceable source again.
--
-- Safe to re-run: every statement uses IF NOT EXISTS.

-- ---------------------------------------------------------------- Google Places
alter table pilates_studios
  -- OPERATIONAL | CLOSED_TEMPORARILY | CLOSED_PERMANENTLY
  add column if not exists business_status text,
  add column if not exists google_primary_type text,
  add column if not exists google_types text[],
  -- { wheelchairAccessibleEntrance: true, wheelchairAccessibleParking: true, ... }
  add column if not exists accessibility jsonb,
  add column if not exists google_editorial_summary text;

-- ------------------------------------------------------- Amenities (referenced
-- by the templates today but never present in the table, so they always
-- rendered as undefined)
alter table pilates_studios
  add column if not exists parking_available boolean,
  add column if not exists online_booking_available boolean,
  add column if not exists accessibility_features text[],
  add column if not exists beginner_friendly boolean;

-- --------------------------------------------------------------------- Derived
alter table pilates_studios
  -- Outward code from the postcode ("SW11" from "SW11 4NJ"). Powers
  -- postcode-level browse pages.
  add column if not exists outward_code text;

-- ------------------------------------------------------- Category verification
-- Google has no pilates_studio type, so whether a listing belongs in this
-- directory has to be derived and scored rather than read.
alter table pilates_studios
  add column if not exists is_pilates_studio boolean,
  add column if not exists category_confidence numeric(3,2),  -- 0.00 - 1.00
  add column if not exists category_evidence text,
  add column if not exists category_checked_at timestamptz;

-- --------------------------------------------------------------------- Pricing
-- Real figures, replacing the price_range column where every value is "££".
alter table pilates_studios
  add column if not exists price_drop_in numeric(8,2),
  add column if not exists price_class_pack jsonb,   -- [{ "classes": 5, "price": 75 }]
  add column if not exists price_membership jsonb,   -- [{ "period": "monthly", "price": 89 }]
  add column if not exists price_intro_offer text,
  add column if not exists price_currency text default 'GBP',
  add column if not exists price_band text;          -- derived: £ / ££ / £££

-- --------------------------------------------------------------------- Booking
alter table pilates_studios
  add column if not exists booking_url text,
  -- mindbody | teamup | momence | classpass | glofox | bookwhen | direct | ...
  add column if not exists booking_platform text;

-- ------------------------------------------------------------ Classes/teaching
alter table pilates_studios
  add column if not exists class_levels text[],      -- beginner | intermediate | advanced
  add column if not exists class_size_max integer,
  add column if not exists schedule_tags text[],     -- early_morning | evening | weekend
  add column if not exists goal_tags text[];         -- back_pain | prenatal | postnatal | over_60s | posture

-- ----------------------------------------------------------------- Instructors
alter table pilates_studios
  -- BASI | Body Control | APPI | Polestar | STOTT | PMA | HCPC | CSP
  add column if not exists instructor_qualifications text[];

-- --------------------------------------------------------------- Ownership and trust
alter table pilates_studios
  add column if not exists is_verified boolean default false,
  add column if not exists claimed_by uuid,
  add column if not exists claimed_at timestamptz,
  add column if not exists verified_at timestamptz;

-- ------------------------------------------------------------------ Provenance
-- field_sources maps column name -> how we know it, e.g.
--   { "phone":       { "source": "google_places", "at": "2026-08-21T…", "confidence": 1.0 },
--     "price_drop_in":{ "source": "website", "at": "…", "confidence": 0.82,
--                       "url": "https://studio.co.uk/pricing" } }
--
-- Precedence, highest first: owner > website > google_places > inferred.
-- A value with no entry here must not be rendered.
alter table pilates_studios
  add column if not exists field_sources jsonb default '{}'::jsonb,
  add column if not exists last_verified_at timestamptz,
  add column if not exists website_scraped_at timestamptz,
  add column if not exists website_scrape_status text;  -- ok | no_website | fetch_failed | no_data

-- --------------------------------------------------------------------- Indexes
create index if not exists idx_studios_outward_code
  on pilates_studios (outward_code) where outward_code is not null;

create index if not exists idx_studios_business_status
  on pilates_studios (business_status) where business_status is not null;

create index if not exists idx_studios_is_pilates
  on pilates_studios (is_pilates_studio) where is_pilates_studio is not null;

create index if not exists idx_studios_price_band
  on pilates_studios (price_band) where price_band is not null;

-- Array containment lookups for the "browse by type / goal" pages
create index if not exists idx_studios_class_types on pilates_studios using gin (class_types);
create index if not exists idx_studios_goal_tags   on pilates_studios using gin (goal_tags);
create index if not exists idx_studios_schedule    on pilates_studios using gin (schedule_tags);

-- Staleness-ordered refresh queue
create index if not exists idx_studios_last_verified
  on pilates_studios (last_verified_at nulls first)
  where is_active = true;
