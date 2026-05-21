BEGIN;

CREATE TABLE IF NOT EXISTS user_portal_access (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  portal_key varchar(50) NOT NULL,
  granted_at timestamptz DEFAULT now(),
  granted_by_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  PRIMARY KEY (user_id, portal_key)
);

CREATE INDEX IF NOT EXISTS idx_user_portal_access_user
  ON user_portal_access(user_id);

COMMIT;
