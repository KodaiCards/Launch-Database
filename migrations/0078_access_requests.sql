-- Migration 0078: access requests.
--
-- Training-launch pivot: trainees (and any non-admin employee) are locked to the
-- Training tile. From their launcher they can ask the admin for more access via a
-- free-text request. Those land here and surface in the admin Settings modal
-- (User Management area). Granting is still manual (Portal Access / role change);
-- this table is the inbox + audit trail of who asked for what.
--
-- ADDITIVE + idempotent.

CREATE TABLE IF NOT EXISTS access_requests (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES users(id) ON DELETE CASCADE,
  username    text,
  full_name   text,
  details     text NOT NULL,
  status      text NOT NULL DEFAULT 'pending',  -- pending | approved | dismissed
  created_at  timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz,
  resolved_by text
);

CREATE INDEX IF NOT EXISTS idx_access_requests_status
  ON access_requests (status, created_at DESC);
