-- migrations/0015_splice_splitters.sql — Phase 2C #9: passive optical splitters.
--
-- A splitter lives inside a closure and presents one input fiber and N
-- output fibers (N is the fanout encoded in the ratio column). FTTH
-- designs route a single upstream strand through the splitter so it can
-- serve many downstream subscribers without an active amplifier.
--
-- Outputs are materialized as individual rows at INSERT time (N rows per
-- splitter where N = right-hand side of the ratio, e.g. 32 for '1x32').
-- This makes the output wiring self-describing and lets validation walk
-- the fiber graph without parsing the ratio string repeatedly.

CREATE TABLE IF NOT EXISTS splice_splitters (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  closure_id     UUID NOT NULL REFERENCES splice_closures(id) ON DELETE CASCADE,
  ratio          VARCHAR(10) NOT NULL CHECK (ratio IN ('1x2','1x4','1x8','1x16','1x32','1x64')),
  -- The fiber feeding the splitter input. NULL when not yet wired.
  input_fiber_id UUID REFERENCES splice_fibers(id) ON DELETE SET NULL,
  notes          TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_splice_splitters_closure ON splice_splitters(closure_id);

CREATE TABLE IF NOT EXISTS splice_splitter_outputs (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  splitter_id      UUID NOT NULL REFERENCES splice_splitters(id) ON DELETE CASCADE,
  position         INTEGER NOT NULL CHECK (position >= 1),
  -- Each output splices into a downstream fiber. NULL until wired.
  output_fiber_id  UUID REFERENCES splice_fibers(id) ON DELETE SET NULL,
  UNIQUE (splitter_id, position)
);
CREATE INDEX IF NOT EXISTS idx_splice_splitter_outputs_splitter ON splice_splitter_outputs(splitter_id);
