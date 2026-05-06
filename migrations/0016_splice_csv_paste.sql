-- 0016_splice_csv_paste.sql
--
-- Splice Phase 2C #13 — CSV/Excel paste import
--
-- splice_design_imports.source_format is a plain VARCHAR(20) — there
-- was never a CHECK constraint on it (see 0014_splice_design_imports.sql).
-- This migration therefore has no schema change to make; it exists to:
--   a) document the new accepted value 'csv' in the column comment, and
--   b) give the migration runner an auditable record of when this feature
--      was activated so rollbacks are unambiguous.
--
-- The endpoint POST /api/splice/projects/:id/import-paste writes
--   source_format = 'csv'
-- into splice_design_imports and then feeds the rows through the same
-- _diffIngestAgainstLive → splice_design_import_changes → apply path
-- that KMZ/DXF/GeoJSON use.  The master designer sees CSV-pasted
-- changes in the identical review modal.

COMMENT ON COLUMN splice_design_imports.source_format IS
  'kmz | kml | dxf | geojson | csv (Phase 2C #13: paste-imported from spreadsheet)';
