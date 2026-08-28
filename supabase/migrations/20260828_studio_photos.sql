-- Owner-uploaded photos.
--
-- A separate table rather than the existing images column. That column holds
-- Google Places photo URLs, and those URLs carry our Google API key as a query
-- parameter - which is why nothing renders them today, and why owner photos
-- must not be mixed into them. What an owner uploads is ours to serve, from
-- our own storage, with no key attached.
--
-- Photos are reviewed like every other owner change. A directory that lets
-- anyone with a claimed listing publish an image straight to a public page
-- has handed out an image host.
--
-- Safe to re-run.

create table if not exists studio_photos (
  id uuid primary key default gen_random_uuid(),
  studio_id uuid not null references pilates_studios(id) on delete cascade,
  owner_id uuid references studio_owners(id) on delete set null,

  -- path within the storage bucket, and the public URL derived from it
  storage_path text not null unique,
  public_url text not null,

  alt text,
  -- display order, lowest first; the first approved photo leads the listing
  position smallint not null default 0,

  width integer,
  height integer,
  bytes integer,
  content_type text,

  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  reviewed_at timestamptz,
  review_note text,

  created_at timestamptz not null default now()
);

create index if not exists idx_photos_studio
  on studio_photos (studio_id, position) where status = 'approved';

create index if not exists idx_photos_pending
  on studio_photos (created_at) where status = 'pending';

create index if not exists idx_photos_owner on studio_photos (owner_id);

alter table studio_photos enable row level security;

-- ------------------------------------------------------------------ bucket
-- Public read so the images can be served straight from storage. Every write
-- goes through the upload route using the secret key, which validates the
-- file before it is ever stored.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'studio-photos', 'studio-photos', true, 5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Anyone may read; nobody may write without the secret key, which is what
-- having no insert, update or delete policy means.
drop policy if exists "studio photos are publicly readable" on storage.objects;
create policy "studio photos are publicly readable"
  on storage.objects for select
  using (bucket_id = 'studio-photos');
