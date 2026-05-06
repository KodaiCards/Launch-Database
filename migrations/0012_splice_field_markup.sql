-- 0012_splice_field_markup.sql
--
-- Splice Matrix Phase 2B #7 — no-login splicer field markup via QR.
--
-- The differentiator no commercial OSP tool nails: every vendor fights
-- to put splicers in their CRM. We let them stay outside it. The
-- splicer prints the field document, scans the per-closure QR code on
-- their phone, lands on a public page (no login, no app install),
-- snaps a photo of the as-built closure interior, and uploads. The
-- engineer then sees those photos attached to the closure inside the
-- editor.
--
--
-- splice_closure_public_tokens — opaque random tokens that key into
-- a single closure. Issued by the engineer when they print the doc;
-- the QR code printed on each closure page encodes
-- {SPLICE_PUBLIC_URL}/splice/field/{token}. Multiple tokens per
-- closure are allowed (re-issue if the printed copy walked off the
-- truck), but the most recent un-expired token is what new prints
-- use.
--
-- expires_at is nullable: NULL = never expires (matches the OSP
-- reality where a field doc may sit in a splicer's truck for months
-- before they get to that section of the route). When set, the
-- public endpoint enforces it.
CREATE TABLE IF NOT EXISTS splice_closure_public_tokens (
  token                VARCHAR(64) PRIMARY KEY,
  closure_id           UUID NOT NULL REFERENCES splice_closures(id) ON DELETE CASCADE,
  project_id           UUID NOT NULL REFERENCES splice_projects(id) ON DELETE CASCADE,
  expires_at           TIMESTAMPTZ,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by_staff_id  UUID REFERENCES staff(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_splice_public_tokens_closure
  ON splice_closure_public_tokens(closure_id);
CREATE INDEX IF NOT EXISTS idx_splice_public_tokens_project
  ON splice_closure_public_tokens(project_id);

-- splice_field_markups — image uploads from splicers in the field.
--
-- image_data BYTEA: splice service has no Railway volume of its own
-- (admin owns /uploads). For v2, store small images directly in
-- Postgres. The endpoint caps uploads at 2MB so a typical
-- closure-interior phone shot fits comfortably; large multi-photo
-- bundles will be revisited if/when uploads start straining the row
-- size.
--
-- mime_type lets the GET-image endpoint serve the right Content-Type
-- header without re-sniffing. byte_size lets list endpoints render
-- size hints without bloating the JSON with the BYTEA payload.
--
-- token is soft-link only — markups outlive their tokens (an engineer
-- might revoke a token after a job is done but want to keep the
-- as-built photos on the project).
CREATE TABLE IF NOT EXISTS splice_field_markups (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  closure_id      UUID NOT NULL REFERENCES splice_closures(id) ON DELETE CASCADE,
  project_id      UUID NOT NULL REFERENCES splice_projects(id) ON DELETE CASCADE,
  token           VARCHAR(64) REFERENCES splice_closure_public_tokens(token) ON DELETE SET NULL,
  splicer_name    VARCHAR(120),
  notes           TEXT,
  mime_type       VARCHAR(80) NOT NULL,
  byte_size       INTEGER NOT NULL,
  image_data      BYTEA NOT NULL,
  uploaded_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Light forensic field for spotting abuse patterns (rate-limit
  -- bypass attempts, etc). Not exposed to non-admins.
  uploader_ip     VARCHAR(45)
);

CREATE INDEX IF NOT EXISTS idx_splice_field_markups_closure
  ON splice_field_markups(closure_id);
CREATE INDEX IF NOT EXISTS idx_splice_field_markups_project
  ON splice_field_markups(project_id);
CREATE INDEX IF NOT EXISTS idx_splice_field_markups_uploaded_at
  ON splice_field_markups(uploaded_at DESC);
