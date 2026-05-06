-- 0020_splice_project_public_tokens.sql
--
-- Phase 4.1 — read-only public tokens at the PROJECT level (sibling
-- to splice_closure_public_tokens which works at the closure level).
-- A signed token URL renders the whole project as read-only — replaces
-- the KMZ-by-email stakeholder loop.
CREATE TABLE IF NOT EXISTS splice_project_public_tokens (
  token                VARCHAR(64) PRIMARY KEY,
  project_id           UUID NOT NULL REFERENCES splice_projects(id) ON DELETE CASCADE,
  expires_at           TIMESTAMPTZ,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by_staff_id  UUID REFERENCES staff(id) ON DELETE SET NULL,
  -- Optional human label so the engineer knows which link they shared
  -- with which client. e.g. "client review 2026-05-15".
  label                VARCHAR(200)
);
CREATE INDEX IF NOT EXISTS idx_splice_project_public_tokens_project
  ON splice_project_public_tokens(project_id);
