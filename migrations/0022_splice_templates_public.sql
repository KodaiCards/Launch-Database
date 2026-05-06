-- Phase 4.6 — closure-template public library. Templates with
-- published_at IS NOT NULL are visible across all accounts/clients
-- (sibling to the existing scope_client_id which scopes to one
-- client). Engineers download from the library; downloads bump
-- the use counter so a "popular templates" view ranks them.
ALTER TABLE splice_closure_templates
  ADD COLUMN IF NOT EXISTS published_at           TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS published_by_staff_id  UUID REFERENCES staff(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS download_count         INTEGER NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS idx_splice_closure_templates_published
  ON splice_closure_templates(published_at DESC NULLS LAST);
