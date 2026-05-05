-- migrations/0008_splice_strand_metadata.sql
--
-- Splice Matrix Phase 2A #4 — strand-level circuit naming.
--
-- Designers increasingly need to deliver "strand 17 = Customer ABC,
-- strand 18 = backbone east" alongside the splice plan. Cheap schema
-- change with high perceived value: add nullable circuit_name +
-- customer + notes columns directly on splice_fibers.
--
-- All three are nullable; existing rows stay unaffected. The PDF
-- includes a "Circuit" column when at least one fiber has a circuit
-- name set; otherwise the column is suppressed to keep the field
-- document tight for jobs that don't carry circuit identifiers.

ALTER TABLE splice_fibers ADD COLUMN IF NOT EXISTS circuit_name VARCHAR(120);
ALTER TABLE splice_fibers ADD COLUMN IF NOT EXISTS customer     VARCHAR(120);
ALTER TABLE splice_fibers ADD COLUMN IF NOT EXISTS notes        TEXT;

-- Index on circuit_name so per-circuit lookups + reports are cheap.
CREATE INDEX IF NOT EXISTS idx_splice_fibers_circuit ON splice_fibers(circuit_name)
  WHERE circuit_name IS NOT NULL;
