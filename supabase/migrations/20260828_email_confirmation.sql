-- Confirm the email address before a human is asked to judge the claim.
--
-- Until now a claim went straight into the review queue on the strength of an
-- address someone typed. The domain check proved the domain existed; it could
-- not prove the person held a mailbox there. Proof did arrive - the
-- set-password link is sent to that address - but only after approval, which
-- is the wrong way round: the reviewer was asked to decide first and learned
-- whether the claimant could read the mail afterwards.
--
-- Both queues now start unconfirmed. A row becomes pending, and so becomes
-- visible for review, only once its link has been followed. What reaches the
-- reviewer is therefore always a claim from someone who reads mail at that
-- address, which is the question the review is actually for.
--
-- Safe to re-run.

-- --------------------------------------------------------------- new status
alter table studio_claims drop constraint if exists studio_claims_status_check;
alter table studio_claims add constraint studio_claims_status_check
  check (status in ('unconfirmed', 'pending', 'approved', 'rejected', 'expired'));

alter table studio_submissions drop constraint if exists studio_submissions_status_check;
alter table studio_submissions add constraint studio_submissions_status_check
  check (status in ('unconfirmed', 'pending', 'approved', 'rejected', 'duplicate', 'expired'));

alter table studio_claims
  add column if not exists email_confirmed_at timestamptz;
alter table studio_submissions
  add column if not exists email_confirmed_at timestamptz;

-- An unconfirmed claim still occupies the slot, so a second attempt from the
-- same address updates rather than queueing a duplicate for review.
drop index if exists idx_claims_one_open;
create unique index if not exists idx_claims_one_open
  on studio_claims (studio_id, lower(claimant_email))
  where status in ('unconfirmed', 'pending');

-- ---------------------------------------------------------------- the token
-- One table for both queues: the thing being proved is identical, and only
-- the row it points at differs. Tokens are stored hashed, like every other
-- token here, so a leaked backup cannot be replayed.
create table if not exists email_verifications (
  id uuid primary key default gen_random_uuid(),

  -- which queue the target_id belongs to
  kind text not null check (kind in ('claim', 'submission')),
  target_id uuid not null,
  -- the address the link was sent to, kept so a confirmation can be shown
  -- without joining back to a row the confirmer may no longer be allowed to see
  email text not null,

  token_hash text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_verifications_target on email_verifications (kind, target_id);

alter table email_verifications enable row level security;
