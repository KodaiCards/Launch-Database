-- 0024_splice_trayless.sql
-- Phase 5.B.3 — Allow splices to live outside a tray.
-- Adds closure_id and location_id anchor columns; relaxes tray_id NOT NULL;
-- backfills closure_id from existing tray relationships; adds a CHECK
-- constraint ensuring every splice has at least one anchor.

ALTER TABLE splices ALTER COLUMN tray_id DROP NOT NULL;

ALTER TABLE splices ADD COLUMN IF NOT EXISTS closure_id
  UUID REFERENCES splice_closures(id) ON DELETE CASCADE;

ALTER TABLE splices ADD COLUMN IF NOT EXISTS location_id
  UUID REFERENCES splice_locations(id) ON DELETE CASCADE;

-- Backfill: set closure_id from the tray's closure for every existing splice.
UPDATE splices
   SET closure_id = (
     SELECT closure_id FROM splice_trays WHERE splice_trays.id = splices.tray_id
   )
 WHERE closure_id IS NULL AND tray_id IS NOT NULL;

-- Constraint: a splice must be anchored to at least one of tray, closure, or location.
ALTER TABLE splices ADD CONSTRAINT chk_splice_anchor
  CHECK (tray_id IS NOT NULL OR closure_id IS NOT NULL OR location_id IS NOT NULL);

-- Index on the new columns for inspector queries.
CREATE INDEX IF NOT EXISTS idx_splices_closure  ON splices(closure_id);
CREATE INDEX IF NOT EXISTS idx_splices_location ON splices(location_id);
