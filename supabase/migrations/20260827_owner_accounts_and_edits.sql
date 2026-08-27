-- Owner accounts, review queues and the edit workflow.
--
-- Three separate ideas, all resting on the same rule the earlier migration
-- set out: nothing a member of the public sends reaches pilates_studios
-- without a human approving it.
--
--   1. studio_owners        who may sign in, and which studios they hold
--   2. owner_login_tokens   single-use magic links; owner_sessions holds the
--                           resulting cookie
--   3. studio_edits         proposed changes, queued for the same review as
--                           submissions and claims
--
-- The magic link does the job the claim form cannot. Checking that a claimant
-- typed an address at the studio's domain proves the domain exists, not that
-- they read mail there. Sending the login link to that address does.
--
-- Safe to re-run.

-- ------------------------------------------------------------------- owners
create table if not exists studio_owners (
  id uuid primary key default gen_random_uuid(),
  -- stored lowercase; the login form lowercases before looking up
  email text not null unique,
  name text,
  created_at timestamptz not null default now(),
  last_login_at timestamptz
);

-- An owner may hold more than one studio, and a studio may have more than one
-- person able to edit it, so this is a join table rather than a column.
create table if not exists studio_owner_studios (
  owner_id uuid not null references studio_owners(id) on delete cascade,
  studio_id uuid not null references pilates_studios(id) on delete cascade,
  -- the approved claim this access came from, kept so an access grant can
  -- always be traced back to the evidence that justified it
  granted_from_claim uuid references studio_claims(id) on delete set null,
  granted_at timestamptz not null default now(),
  primary key (owner_id, studio_id)
);

create index if not exists idx_owner_studios_studio on studio_owner_studios (studio_id);

-- ------------------------------------------------------------ login tokens
-- Only the SHA-256 of each token is stored: a leaked backup of this table
-- cannot be used to sign in as anybody.
create table if not exists owner_login_tokens (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references studio_owners(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  requester_hash text,
  created_at timestamptz not null default now()
);

create index if not exists idx_login_tokens_owner on owner_login_tokens (owner_id, created_at desc);

create table if not exists owner_sessions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references studio_owners(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  user_agent text,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create index if not exists idx_owner_sessions_owner on owner_sessions (owner_id);

-- -------------------------------------------------------------------- edits
-- changes  holds only the fields the owner actually altered
-- previous holds those same fields as they stood when the form was opened,
--          so review shows a real before-and-after and a stale edit can be
--          spotted rather than silently overwriting newer data
create table if not exists studio_edits (
  id uuid primary key default gen_random_uuid(),
  studio_id uuid not null references pilates_studios(id) on delete cascade,
  owner_id uuid references studio_owners(id) on delete set null,

  changes jsonb not null,
  previous jsonb not null default '{}'::jsonb,
  note text,

  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected', 'withdrawn')),
  reviewed_at timestamptz,
  review_note text,
  applied_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_edits_status on studio_edits (status, created_at desc);
create index if not exists idx_edits_studio on studio_edits (studio_id, created_at desc);

-- ------------------------------------------------------------- audit trail
-- Every approval and rejection, so a change to a live listing can always be
-- traced to the decision that let it through.
create table if not exists admin_actions (
  id uuid primary key default gen_random_uuid(),
  action text not null,              -- submission.approved, claim.rejected, ...
  target_table text not null,
  target_id uuid,
  note text,
  detail jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_admin_actions_created on admin_actions (created_at desc);

-- --------------------------------------------------------------------- RLS
-- Same posture as the submission tables: enabled with no policies, so the
-- anon and publishable keys reach none of this. Every read and write goes
-- through a server route holding the secret key.
alter table studio_owners        enable row level security;
alter table studio_owner_studios enable row level security;
alter table owner_login_tokens   enable row level security;
alter table owner_sessions       enable row level security;
alter table studio_edits         enable row level security;
alter table admin_actions        enable row level security;
