-- 0014_splice_design_imports.sql
--
-- Splice Matrix Phase 3C — submit-and-review ingest of KMZ/DXF
-- design files. Multiple AutoCAD designers each submit their own
-- file; the master designer reviews the diff against the live tree
-- and approves/skips per-row.
--
-- Two tables:
--
-- splice_design_imports — one row per uploaded file. Captures
-- everything you need to reconstruct who-submitted-what-when long
-- after the file is gone (we don't keep the source bytes by default;
-- audit-grade preservation is opt-in via source_bytes).
--
-- splice_design_import_changes — one row per proposed mutation
-- (add a closure, move a cable path, remove an orphan). Carries
-- payload_jsonb so the apply step doesn't need to re-parse the
-- source file.
--
-- status flow on splice_design_imports:
--   pending           → initial state after upload
--   partially_applied → some changes approved & applied; rest skipped
--   applied           → all changes were approved & applied
--   rejected          → master designer killed the import wholesale
--
-- decision flow on splice_design_import_changes:
--   pending           → initial state
--   approved          → master flagged for apply
--   skipped           → master rejected this specific change
-- After the parent import is `apply`d, every approved change gets
-- its decision frozen and the apply step writes through.

CREATE TABLE IF NOT EXISTS splice_design_imports (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id             UUID NOT NULL REFERENCES splice_projects(id) ON DELETE CASCADE,
  source_filename        VARCHAR(300),
  -- 'kmz', 'kml', 'dxf', 'geojson' — picked by file-extension sniff at upload time.
  source_format          VARCHAR(20) NOT NULL,
  source_size_bytes      INTEGER,
  -- Optional preserved bytes. Off by default — KMZs are small but a
  -- DXF can be megabytes and we don't want every project's row tree
  -- bloated with binary blobs nobody reads.
  source_bytes           BYTEA,
  uploaded_by_staff_id   UUID REFERENCES staff(id) ON DELETE SET NULL,
  uploaded_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status                 VARCHAR(20) NOT NULL DEFAULT 'pending'
                           CHECK (status IN ('pending', 'applied', 'partially_applied', 'rejected')),
  decision_at            TIMESTAMPTZ,
  decision_by_staff_id   UUID REFERENCES staff(id) ON DELETE SET NULL,
  -- Free-form summary populated at parse time:
  --   { adds: { locations, cables }, updates: {...}, removes: {...},
  --     errors: [...], warnings: [...] }
  summary_jsonb          JSONB,
  -- DXF-only: the calibration the importer used (control points or
  -- declared CRS). Stored so a re-run can reproduce the geometry.
  dxf_calibration_jsonb  JSONB,
  notes                  TEXT
);

CREATE INDEX IF NOT EXISTS idx_splice_design_imports_project
  ON splice_design_imports(project_id, uploaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_splice_design_imports_status
  ON splice_design_imports(project_id, status);

CREATE TABLE IF NOT EXISTS splice_design_import_changes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  import_id    UUID NOT NULL REFERENCES splice_design_imports(id) ON DELETE CASCADE,
  -- 'add', 'update', 'delete' — the kind of mutation the apply step
  -- will perform if approved.
  change_type  VARCHAR(20) NOT NULL CHECK (change_type IN ('add', 'update', 'delete')),
  -- Which splice_* table this change writes to. Phase 3C ships
  -- 'splice_locations' and 'splice_cables' only; later phases may
  -- add 'splice_closures' (placement of an existing closure on the
  -- map for a closure first created in the diagram).
  target_table VARCHAR(40) NOT NULL,
  -- For update/delete: the existing row's id. For add: NULL (the
  -- apply step generates the id on insert).
  target_id    UUID,
  -- The proposed values. Shape depends on target_table; we lean on
  -- the apply step to validate, not the schema. Examples:
  --   { name, type, latitude, longitude }                            (location add)
  --   { latitude, longitude }                                        (location coords update)
  --   { name, fiber_count, construction_type, path_geojson }         (cable add)
  --   { path_geojson }                                               (cable path update)
  payload_jsonb JSONB NOT NULL,
  -- The master designer's decision. Defaults to 'pending' for adds
  -- and updates; 'skipped' for deletes (deletes are opt-in only).
  decision     VARCHAR(20) NOT NULL DEFAULT 'pending'
                 CHECK (decision IN ('pending', 'approved', 'skipped')),
  decision_at  TIMESTAMPTZ,
  decision_by_staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
  -- Optional reviewer note attached to the decision (why skipped,
  -- caveats on approve). Survives the apply.
  decision_comment TEXT,
  -- Set when the apply step has actually written the change through
  -- to the live tree, with the resulting id (matches target_id for
  -- updates/deletes; new uuid for adds). NULL until applied.
  applied_at   TIMESTAMPTZ,
  applied_target_id UUID
);

CREATE INDEX IF NOT EXISTS idx_splice_design_import_changes_import
  ON splice_design_import_changes(import_id);
CREATE INDEX IF NOT EXISTS idx_splice_design_import_changes_decision
  ON splice_design_import_changes(import_id, decision);
