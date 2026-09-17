-- Two active studios sharing a full_url_path made the studio page's .single()
-- lookup fail, so both returned 404. Fifteen such paths were repaired by hand
-- on 2026-09-17; this stops new ones. Partial on is_active so a deactivated
-- duplicate can keep its old path for the record.
create unique index if not exists pilates_studios_active_path_unique
  on public.pilates_studios (full_url_path)
  where is_active;
