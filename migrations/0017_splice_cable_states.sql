-- Phase 2C #10: per-cable-at-location slack / service-loop modeling.
-- One row per (cable, location) pair — a cable passing through three
-- closures gets three rows.  UNIQUE constraint enforces idempotent
-- UPSERT from the PUT endpoint.
CREATE TABLE IF NOT EXISTS splice_cable_states (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cable_id             UUID NOT NULL REFERENCES splice_cables(id) ON DELETE CASCADE,
  location_id          UUID NOT NULL REFERENCES splice_locations(id) ON DELETE CASCADE,
  slack_length_inches  INTEGER CHECK (slack_length_inches IS NULL OR slack_length_inches >= 0),
  notes                TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (cable_id, location_id)
);
CREATE INDEX IF NOT EXISTS idx_splice_cable_states_cable    ON splice_cable_states(cable_id);
CREATE INDEX IF NOT EXISTS idx_splice_cable_states_location ON splice_cable_states(location_id);
