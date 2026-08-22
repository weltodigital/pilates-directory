-- Studio submissions and ownership claims.
--
-- Both tables are staging areas, not live data. Nothing a member of the public
-- submits appears on the site until it is reviewed and promoted by hand. Given
-- this directory previously published generated instructor names and email
-- addresses, unreviewed public writes into pilates_studios are exactly the
-- failure mode worth designing out.
--
-- Safe to re-run.

-- ------------------------------------------------------------- submissions
create table if not exists studio_submissions (
  id uuid primary key default gen_random_uuid(),

  -- the studio being proposed
  name text not null,
  address text,
  postcode text not null,
  town text,
  county text,
  website text,
  phone text,
  class_types text[],

  -- who is proposing it
  contact_name text not null,
  contact_email text not null,
  contact_role text,
  message text,

  -- review workflow
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected', 'duplicate')),
  reviewed_at timestamptz,
  review_note text,
  -- set when a submission is promoted into the directory
  created_studio_id uuid references pilates_studios(id) on delete set null,
  -- populated when we suspect the studio is already listed
  possible_duplicate_id uuid references pilates_studios(id) on delete set null,

  -- salted hash of the submitter's IP: enough to rate limit, without
  -- retaining an identifier for someone who only filled in a form
  submitter_hash text,
  user_agent text,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------ claims
create table if not exists studio_claims (
  id uuid primary key default gen_random_uuid(),
  studio_id uuid not null references pilates_studios(id) on delete cascade,

  claimant_name text not null,
  claimant_email text not null,
  claimant_phone text,
  claimant_role text,
  -- how the claimant says their connection to the studio can be checked
  evidence text,
  message text,

  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  reviewed_at timestamptz,
  review_note text,

  submitter_hash text,
  user_agent text,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------- indexes
create index if not exists idx_submissions_status on studio_submissions (status, created_at desc);
create index if not exists idx_submissions_hash on studio_submissions (submitter_hash, created_at desc);
create index if not exists idx_claims_status on studio_claims (status, created_at desc);
create index if not exists idx_claims_studio on studio_claims (studio_id);
create index if not exists idx_claims_hash on studio_claims (submitter_hash, created_at desc);

-- One open claim per studio per email, so a repeated submit does not queue up
-- duplicates for review.
create unique index if not exists idx_claims_one_open
  on studio_claims (studio_id, lower(claimant_email))
  where status = 'pending';

-- --------------------------------------------------------------------- RLS
-- Enabled with no policies: the anon and publishable keys get no access at
-- all. Writes arrive only through the server-side API routes, which use the
-- secret key and validate before inserting.
alter table studio_submissions enable row level security;
alter table studio_claims enable row level security;
