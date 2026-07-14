-- 0084_permissions_system.sql — System F permissions core (#73). Idempotent.
-- L-016 NO BAKING: NO person-specific grants and NO hardcoded role-default grant rows
-- ship here. Defaults are editable data rows Carter creates/edits on the Settings page;
-- the ONLY coded permission behavior is the admin bootstrap (admin implicitly holds all).
CREATE TABLE IF NOT EXISTS permission_grants (
  id             BIGSERIAL PRIMARY KEY,
  permission_key TEXT NOT NULL,
  subject_type   TEXT NOT NULL CHECK (subject_type IN ('role','user')),
  subject_id     TEXT NOT NULL,          -- role name, or users.id (UUID) as text
  granted_by     TEXT,                   -- users.id of the granter (audit trail)
  granted_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at     TIMESTAMPTZ             -- NULL = active; set = revoked (kept as history)
);
CREATE UNIQUE INDEX IF NOT EXISTS permission_grants_active_uniq
  ON permission_grants (permission_key, subject_type, subject_id) WHERE revoked_at IS NULL;
CREATE INDEX IF NOT EXISTS permission_grants_lookup
  ON permission_grants (subject_type, subject_id) WHERE revoked_at IS NULL;

ALTER TABLE users ADD COLUMN IF NOT EXISTS manager_id UUID REFERENCES users(id);
