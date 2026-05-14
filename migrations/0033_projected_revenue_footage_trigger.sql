-- Migration 0033: Keep projected_revenue in sync for footage projects.
--
-- For footage projects, projected_revenue = expected_revenue by definition.
-- When expected_revenue is recomputed (e.g. footage edited, billing_rate
-- changed), projected_revenue must follow or the Revenue → Projected Total
-- tile shows stale data.
--
-- For hourly projects, projected_revenue is derived at read time from
-- expected_hours × billing_rate in /api/revenue/projected-total, so the
-- stored column is NOT canonical for hourly — we don't auto-update it here.
-- Admin may still set it manually; the read-time derivation takes precedence
-- in the projection endpoint.
--
-- Trigger fires BEFORE UPDATE on projects so the INSERT sees the final value.

CREATE OR REPLACE FUNCTION sync_projected_revenue_footage()
RETURNS TRIGGER AS $$
BEGIN
  -- Only act on footage billing_type rows.
  -- ARC-3: when expected_revenue changes on a footage project, keep
  -- projected_revenue in lock-step. This prevents the stale-projected_revenue
  -- data quality issue (Auditor C-3): footage edited but projected not updated.
  IF NEW.billing_type = 'footage' AND (
    OLD.expected_revenue IS DISTINCT FROM NEW.expected_revenue
    OR OLD.billing_type IS DISTINCT FROM NEW.billing_type
  ) THEN
    NEW.projected_revenue := NEW.expected_revenue;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop if exists so the migration is idempotent on re-run.
DROP TRIGGER IF EXISTS trg_sync_projected_revenue_footage ON projects;

CREATE TRIGGER trg_sync_projected_revenue_footage
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION sync_projected_revenue_footage();

-- Backfill: bring existing footage projects into sync immediately.
UPDATE projects
  SET projected_revenue = expected_revenue
  WHERE billing_type = 'footage'
    AND projected_revenue IS DISTINCT FROM expected_revenue;
