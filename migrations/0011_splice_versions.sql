-- 0011_splice_versions.sql
--
-- Splice Matrix Phase 2B #6 — version snapshots + diff PDF.
--
-- Why: "the client redlined the splice plan; show me what changed."
-- No commercial OSP tool produces a clean rev-A vs rev-B diff —
-- OZmap and netTerrain rely on exporting two full PDFs and eyeballing
-- the difference; VETRO and 3-GIS lack any version history at all.
--
-- snapshot_jsonb stores the FULL hydrate (locations, cables, tubes,
-- fibers, closures, trays, splices, ribbon_groups, strand_states) so
-- the diff is computable purely from the version table without
-- touching the live row tree. That keeps diffs stable across future
-- schema migrations: a snapshot taken today still diffs cleanly even
-- after we add columns next quarter, because both sides of the diff
-- are read from the same JSONB shape.
--
-- generation_hash mirrors the 7-char SHA-1 prefix already shown in
-- the splicer PDF footer. Auto-snapshots that arrive with the same
-- hash as the last version are skipped (no graph delta = nothing
-- new to record). Manual snapshots always record, regardless of
-- hash, so a designer can checkpoint "good, before tomorrow's
-- redline review" even when nothing structural moved.
--
-- version_number is a per-project monotonically increasing integer
-- (1, 2, 3, …). Computed at write time as MAX(version_number)+1
-- under a UNIQUE (project_id, version_number) so concurrent writers
-- can't both grab the same number.
--
-- label is freeform: "rev A", "client review 2026-05-15", or NULL
-- for auto-snapshots.

CREATE TABLE IF NOT EXISTS splice_project_versions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id            UUID NOT NULL REFERENCES splice_projects(id) ON DELETE CASCADE,
  version_number        INTEGER NOT NULL,
  -- Full hydrate JSON. Read back as a plain JS object by pg's JSONB
  -- adapter — no second JSON.parse needed in route code.
  snapshot_jsonb        JSONB NOT NULL,
  -- 7-char generation hash from _generationHash(); used for
  -- auto-snapshot debouncing.
  generation_hash       VARCHAR(16),
  label                 VARCHAR(200),
  created_by_staff_id   UUID REFERENCES staff(id) ON DELETE SET NULL,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (project_id, version_number)
);

CREATE INDEX IF NOT EXISTS idx_splice_versions_project_created
  ON splice_project_versions(project_id, created_at DESC);
