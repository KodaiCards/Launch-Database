-- Migration 0070: link a service area to its map plan.
--
-- Closes the map→$ loop: an SA points at the fiber-map plan its geometry lives
-- under (the map persists per-plan keys frm_pts_<plan>/frm_segs_<plan> via
-- map_store). With map_plan_id + construction_contract_id set, the SA can derive
-- its construction expected (units × CC catalog) + footage straight from the map.
-- ADDITIVE + idempotent.

ALTER TABLE service_areas ADD COLUMN IF NOT EXISTS map_plan_id text;
