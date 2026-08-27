-- Owner passwords, replacing sign-in by emailed link.
--
-- The link stays for one job only: the first credential, and a forgotten one.
-- An owner cannot choose a password before we know they read mail at the
-- studio's domain, and that is still the thing an approved claim proves. What
-- changes is that the link now sets a password instead of being the way in
-- every time.
--
-- Safe to re-run.

alter table studio_owners
  add column if not exists password_hash text,
  -- Failed attempts are counted per account so a guessing run stalls. Reset
  -- on any successful sign-in.
  add column if not exists failed_login_count integer not null default 0,
  add column if not exists last_failed_login_at timestamptz;

-- Tokens now say what they are for. Existing rows are all sign-in links from
-- before this change; they are single-use and short-lived, so labelling them
-- as password setups costs nothing and keeps the column non-null.
alter table owner_login_tokens
  add column if not exists purpose text not null default 'set_password';

alter table owner_login_tokens
  drop constraint if exists owner_login_tokens_purpose_check;

alter table owner_login_tokens
  add constraint owner_login_tokens_purpose_check
  check (purpose in ('set_password', 'reset'));
