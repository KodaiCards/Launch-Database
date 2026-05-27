-- Migration 0044: DWG offline-sync support.
--
-- Adds SHA-256 + content-type columns to permit_documents so the manifest
-- endpoint can return delta-sync fingerprints and serve correct Content-Type
-- headers without re-reading the file on every request.
--
-- Adds project_dwg_sync_state to record per-user, per-project sync cursors.
-- The manifest API returns all DWGs for a project in one shot; the client
-- diffs file-by-file against the last manifest_etag it stored here.

ALTER TABLE public.permit_documents
  ADD COLUMN IF NOT EXISTS sha256       char(64),
  ADD COLUMN IF NOT EXISTS content_type varchar(80);

CREATE TABLE IF NOT EXISTS public.project_dwg_sync_state (
  user_id        uuid NOT NULL,
  project_id     uuid NOT NULL,
  last_synced_at timestamptz NOT NULL DEFAULT now(),
  manifest_etag  text,
  client_label   text,
  PRIMARY KEY (user_id, project_id)
);

CREATE INDEX IF NOT EXISTS idx_dwg_sync_state_user
  ON public.project_dwg_sync_state(user_id);
