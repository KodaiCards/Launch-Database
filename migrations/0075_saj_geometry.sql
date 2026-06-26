-- Migration 0075: store a project's drawn line geometry on the job.
--
-- Projects-tab Phase B (docs/projects_tab_design.md): drawing a permitting/design
-- line on the map creates the project (a service_area_job) and auto-fills
-- footage + miles (existing columns) from the geometry. This column holds the
-- drawn line itself (GeoJSON-ish: [[lat,lng],…] or a GeoJSON LineString) so the
-- project has a location to render. Manual projects leave it NULL ("No location").
-- ADDITIVE + idempotent.

ALTER TABLE service_area_jobs ADD COLUMN IF NOT EXISTS geometry jsonb;
