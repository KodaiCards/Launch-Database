-- 0085_role_bundles.sql — System F custom-role bundles (#76). Idempotent.
-- L-016: no seeded bundles/rows — bundles are created on the Settings page.
CREATE TABLE IF NOT EXISTS role_bundles (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS role_bundle_keys (
  bundle_id BIGINT NOT NULL REFERENCES role_bundles(id) ON DELETE CASCADE,
  permission_key TEXT NOT NULL,
  PRIMARY KEY (bundle_id, permission_key)
);
CREATE TABLE IF NOT EXISTS user_role_bundles (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bundle_id BIGINT NOT NULL REFERENCES role_bundles(id) ON DELETE CASCADE,
  assigned_by TEXT,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, bundle_id)
);
