-- Wave 211 (Client Portal v1, Epic E1) — foundation consolidation.
--
-- Discovery on 2026-05-30: client portal v1 schema already landed in earlier
-- migrations from prior session work. This migration documents the state and
-- closes the only outstanding drift between migrations and schema.sql so E2
-- (auth route wiring) + E3-E5 (UI) can build cleanly on a verified foundation.
--
-- ====================================================================
-- Already created by earlier migrations — DO NOT re-create:
-- ====================================================================
--
-- Migration 0047_client_portal_v1.sql (live on main):
--   - public.client_organizations  (id, name, short_name, logo_url, theme_color,
--                                   status CHECK active|suspended|archived,
--                                   created_at, created_by → users.id)
--   - public.client_users          (id, org_id → client_organizations.id,
--                                   email, name, is_primary, status CHECK
--                                   active|revoked, invited_by → users.id,
--                                   created_at)
--                                   No `role` column per Carter 2026-05-27 lock
--                                   (single role per client user in v1; granular
--                                   roles deferred until needed).
--   - public.client_tokens         (id, client_user_id → client_users.id,
--                                   token_hash UNIQUE, last_used_at, expires_at,
--                                   revoked_at, created_at)
--   - ALTER engineering_contracts ADD COLUMN client_org_id uuid
--       REFERENCES client_organizations(id) ON DELETE SET NULL
--   - Index idx_client_users_org ON client_users(org_id)
--   - Index idx_client_tokens_user ON client_tokens(client_user_id)
--   - Index idx_engineering_contracts_client_org
--       ON engineering_contracts(client_org_id) WHERE client_org_id IS NOT NULL
--
-- Migration 0049_client_documents_approvals.sql (live on main):
--   - public.client_documents      (id, client_org_id → client_organizations.id,
--                                   project_id → projects.id, filename, mime_type,
--                                   size_bytes, storage_key, uploaded_by_user_id,
--                                   uploaded_by_client_user_id, direction CHECK
--                                   to_client|from_client, status CHECK
--                                   active|archived, notes, created_at;
--                                   uploader xor constraint)
--                                   No `approval_type='invoice'` row class, no
--                                   `amount` column per Carter 2026-05-27 lock
--                                   (invoice approvals out of scope for v1).
--   - public.client_approvals      (id, client_org_id, project_id, title,
--                                   description, document_id → client_documents.id,
--                                   requested_by → users.id,
--                                   responded_by_client_user_id → client_users.id,
--                                   response CHECK approved|rejected|changes_requested,
--                                   response_notes, requested_at, responded_at,
--                                   status CHECK pending|responded|cancelled)
--   - Indexes idx_client_documents_org/_project/_status
--   - Indexes idx_client_approvals_org_pending/_org_all/_project/_responded_at
--
-- Middleware infrastructure (live on main as of W100-F7):
--   - routes/_client_auth.js — generateRawToken / hashToken / requireClientAuth /
--     CLIENT_SESSION_COOKIE (full implementation, uniform 401 to prevent token
--     oracle attacks, fire-and-forget last_used_at update)
--
-- Route surface partially live on main:
--   - routes/client_portal_v2.js
--   - routes/clients.js (admin-side org/user/token management)
--
-- ====================================================================
-- This migration: idempotent no-op safeguards
-- ====================================================================
--
-- All statements below use IF NOT EXISTS / IF NOT EXISTS-equivalent guards so
-- this migration is safe to run against any prior state. They are sanity nets
-- for environments where schema.sql may have drifted from migrations history
-- (e.g. dev DBs restored from a stale dump).

BEGIN;

-- Re-assert engineering_contracts.client_org_id column + index (idempotent).
-- Closes the schema.sql drift where idx_engineering_contracts_client_org is
-- present in migration 0047 but not always reflected in committed schema.sql.
ALTER TABLE public.engineering_contracts
  ADD COLUMN IF NOT EXISTS client_org_id uuid
  REFERENCES public.client_organizations(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_engineering_contracts_client_org
  ON public.engineering_contracts(client_org_id)
  WHERE client_org_id IS NOT NULL;

-- Re-assert core indexes (no-op if already present).
CREATE INDEX IF NOT EXISTS idx_client_users_org
  ON public.client_users(org_id);

CREATE INDEX IF NOT EXISTS idx_client_tokens_user
  ON public.client_tokens(client_user_id);

-- Re-assert E5 indexes (no-op if already present).
CREATE INDEX IF NOT EXISTS idx_client_documents_org
  ON public.client_documents(client_org_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_client_documents_project
  ON public.client_documents(project_id)
  WHERE project_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_client_documents_status
  ON public.client_documents(client_org_id, status);

CREATE INDEX IF NOT EXISTS idx_client_approvals_org_pending
  ON public.client_approvals(client_org_id, status)
  WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_client_approvals_org_all
  ON public.client_approvals(client_org_id, status);

CREATE INDEX IF NOT EXISTS idx_client_approvals_project
  ON public.client_approvals(project_id)
  WHERE project_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_client_approvals_responded_at
  ON public.client_approvals(responded_at DESC)
  WHERE responded_at IS NOT NULL;

COMMIT;
