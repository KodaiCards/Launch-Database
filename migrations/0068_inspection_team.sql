-- Migration 0068: add 'inspection' to the service_area_jobs team CHECK.
--
-- 0064 created the team CHECK as (permitting | design | construction), omitting
-- inspection — but inspection IS a core discipline (Inspector, Resident Engineer;
-- hourly, engineering cost) per the 0065 cost model and how billing/projections
-- and the hours importer (routes/_hours_match.js) classify it. Widen it so
-- inspection jobs can exist on the keystone. Idempotent.

ALTER TABLE service_area_jobs DROP CONSTRAINT IF EXISTS service_area_jobs_team_check;
ALTER TABLE service_area_jobs
  ADD CONSTRAINT service_area_jobs_team_check
  CHECK (team IS NULL OR (team)::text = ANY (ARRAY['permitting','design','inspection','construction']));
