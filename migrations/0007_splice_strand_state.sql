-- migrations/0007_splice_strand_state.sql
--
-- Splice Matrix Phase 2A #3 — three-lane ring-cut model.
--
-- Each strand of each cable at each location is in one of three states:
--   express  — passes through uninterrupted (no cut, no splice). Default.
--   spliced  — cut and connected to another strand. Implicit when a
--              splice row exists for this strand at this location.
--   stored   — cut and coiled in the closure but not spliced.
--              Stored_length_inches captures the slack reserved.
--
-- Most commercial tools fudge this with a generic "midspan" abstraction;
-- splicers in the field need explicit guidance so a tube isn't cut by
-- mistake. This table records EXPLICIT overrides — when no row exists
-- for a (cable, location, strand_position), the inferred state is
-- 'express' if no splice row touches that strand here, otherwise
-- 'spliced'.
--
-- Designers only insert rows when they want to mark a strand as
-- 'stored', or when they want to record an explicit 'express' decision
-- (rare — useful when the splicer should NOT cut a tube even though
-- the cable visits this location). They generally should NOT insert
-- 'spliced' rows because the splice row itself is the authority for
-- that state; doing so duplicates the truth source. The validation
-- engine flags conflicts (state='express' with a splice row, etc.).

CREATE TABLE IF NOT EXISTS splice_strand_states (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cable_id              UUID NOT NULL REFERENCES splice_cables(id) ON DELETE CASCADE,
  location_id           UUID NOT NULL REFERENCES splice_locations(id) ON DELETE CASCADE,
  strand_position       INTEGER NOT NULL CHECK (strand_position BETWEEN 1 AND 864),
  state                 VARCHAR(20) NOT NULL
                          CHECK (state IN ('express', 'spliced', 'stored')),
  stored_length_inches  INTEGER CHECK (stored_length_inches IS NULL OR stored_length_inches >= 0),
  notes                 TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (cable_id, location_id, strand_position)
);

CREATE INDEX IF NOT EXISTS idx_splice_strand_states_cable ON splice_strand_states(cable_id);
CREATE INDEX IF NOT EXISTS idx_splice_strand_states_location ON splice_strand_states(location_id);
CREATE INDEX IF NOT EXISTS idx_splice_strand_states_state ON splice_strand_states(state);
