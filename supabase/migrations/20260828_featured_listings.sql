-- Featured listings: a paid slot at the top of a town page.
--
-- Three slots per town, and the cap is a unique index rather than a count
-- taken before an insert. Counting first has a window between the count and
-- the write, and the way that window is reached in practice is two owners in
-- the same town pressing the button within a second of each other - the exact
-- moment a town becomes worth featuring in. Numbering the slots turns the cap
-- into something the database enforces: a fourth subscriber cannot exist.
--
-- The slot is reserved before payment and released if payment does not
-- complete, so nobody pays for a place that was taken while they were typing
-- their card in.
--
-- Safe to re-run.

create table if not exists featured_listings (
  id uuid primary key default gen_random_uuid(),
  studio_id uuid not null references pilates_studios(id) on delete cascade,
  owner_id uuid references studio_owners(id) on delete set null,

  -- The town, copied rather than joined: it is what the cap is counted over
  -- and what the town page queries, and a studio that moves town should not
  -- silently take its slot with it.
  county_slug text not null,
  city_slug text not null,
  slot smallint not null check (slot between 1 and 3),

  status text not null default 'pending'
    check (status in ('pending', 'active', 'past_due', 'cancelled')),

  -- how long an unpaid reservation holds its slot
  reserved_until timestamptz,

  stripe_customer_id text,
  stripe_subscription_id text unique,
  stripe_checkout_session_id text,

  started_at timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  ended_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- The cap. A slot is occupied while it is paid for, while payment is being
-- collected, and while a payment is being retried - a card that failed this
-- morning should not cost a studio its place before Stripe has finished
-- trying.
create unique index if not exists idx_featured_slot
  on featured_listings (county_slug, city_slug, slot)
  where status in ('pending', 'active', 'past_due');

-- One live slot per studio, so a second checkout cannot double-charge.
create unique index if not exists idx_featured_one_per_studio
  on featured_listings (studio_id)
  where status in ('pending', 'active', 'past_due');

-- What the town page reads: active slots for one town, longest-standing first.
create index if not exists idx_featured_town
  on featured_listings (county_slug, city_slug, started_at)
  where status in ('active', 'past_due');

create index if not exists idx_featured_owner on featured_listings (owner_id);
create index if not exists idx_featured_subscription on featured_listings (stripe_subscription_id);

-- Expired reservations are swept on demand rather than by a scheduled job,
-- because the only moment the answer matters is when somebody is asking for a
-- slot.
create index if not exists idx_featured_reservations
  on featured_listings (reserved_until) where status = 'pending';

-- Stripe events, so a webhook delivered twice - which Stripe does by design -
-- is only acted on once.
create table if not exists stripe_events (
  id text primary key,
  type text not null,
  received_at timestamptz not null default now()
);

alter table featured_listings enable row level security;
alter table stripe_events enable row level security;
