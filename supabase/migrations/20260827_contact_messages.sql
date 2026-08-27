-- Contact form messages.
--
-- The row is written before the email is sent, and is the record that
-- survives if sending fails. A directory that loses an enquiry because an
-- email provider had a bad minute has lost the enquiry; the queue is the
-- source of truth, the email is the notification.
--
-- It also gives the form the same rate limiting as the other public forms,
-- which count recent rows by submitter hash.
--
-- Safe to re-run.

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),

  name text not null,
  email text not null,
  subject text,
  message text not null,

  -- whether the notification actually left the building
  delivered boolean not null default false,
  delivery_error text,

  -- salted hash of the sender's IP: enough to rate limit, without retaining
  -- an identifier for someone who only filled in a form
  submitter_hash text,
  user_agent text,
  referer text,

  handled_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_contact_created on contact_messages (created_at desc);
create index if not exists idx_contact_hash on contact_messages (submitter_hash, created_at desc);
create index if not exists idx_contact_unhandled
  on contact_messages (created_at desc) where handled_at is null;

-- Same posture as every other public-write table: enabled with no policies,
-- so the anon and publishable keys reach none of it. Writes arrive only
-- through the server route, which validates first.
alter table contact_messages enable row level security;
