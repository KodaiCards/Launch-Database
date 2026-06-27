-- Migration 0079: per-staff training content visibility.
--
-- Default = see everything (no row). Admin can restrict a person via a reusable
-- PRESET (an allow-list of tracks/subjects/lessons) and/or per-user show/hide
-- overrides. Scope levels: 'track' (osp|isp|cert) | 'subject' (course id, e.g.
-- T01) | 'lesson' (e.g. T01.L01). Higher scopes cascade to their children.
--
-- ADDITIVE + idempotent.

CREATE TABLE IF NOT EXISTS training_presets (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  description text,
  created_by  uuid,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS training_preset_scopes (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  preset_id  uuid NOT NULL REFERENCES training_presets(id) ON DELETE CASCADE,
  scope_type text NOT NULL,   -- 'track' | 'subject' | 'lesson'
  scope_id   text NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_training_preset_scopes_preset ON training_preset_scopes (preset_id);

CREATE TABLE IF NOT EXISTS user_training_access (
  user_id    uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  base       text NOT NULL DEFAULT 'all',   -- 'all' | 'preset' | 'none'
  preset_id  uuid REFERENCES training_presets(id) ON DELETE SET NULL,
  updated_by uuid,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_training_overrides (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scope_type text NOT NULL,   -- 'track' | 'subject' | 'lesson'
  scope_id   text NOT NULL,
  mode       text NOT NULL,   -- 'show' | 'hide'
  UNIQUE (user_id, scope_type, scope_id)
);
CREATE INDEX IF NOT EXISTS idx_user_training_overrides_user ON user_training_overrides (user_id);
