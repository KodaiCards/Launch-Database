-- Migration 0072: hand-drawn SA boundary + center for the map-first UX.
--
-- The Service Areas overview plots every build on a real (Leaflet) map and draws
-- each SA's boundary. boundary = the hand-drawn polygon (GeoJSON-ish: array of
-- [lat,lng] or a GeoJSON Polygon), editable from day one. center_lat/lng = where
-- to drop the overview pin / center the map (boundary centroid, or set by hand).
-- ADDITIVE + idempotent.

ALTER TABLE service_areas ADD COLUMN IF NOT EXISTS boundary jsonb;
ALTER TABLE service_areas ADD COLUMN IF NOT EXISTS center_lat numeric(10,7);
ALTER TABLE service_areas ADD COLUMN IF NOT EXISTS center_lng numeric(10,7);
