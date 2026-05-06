-- 0013_splice_geography.sql
--
-- Splice Matrix Phase 3A — satellite-map foundation.
--
-- Adds geographic coordinates to locations (single point) and to
-- cables (the polyline that follows the actual fiber route to the
-- C.O.). Both are NULLABLE: existing splice projects predate the
-- map view, and a project that is purely a logical splice plan with
-- no real-world geography stays valid forever.
--
-- Storage choices (deliberate):
--
-- DECIMAL(10,7) for lat/lon: 7 decimal places ≈ 1.1cm ground
-- precision at the equator, well past what the satellite imagery
-- resolves and exactly what most KMZ/DXF sources carry. DECIMAL,
-- not FLOAT, so equality comparisons in the diff path are stable
-- (a float-to-string round-trip can flip the last bit).
--
-- JSONB for cable path_geojson: GeoJSON LineString
--   {"type":"LineString","coordinates":[[lon,lat],[lon,lat],...]}
-- Note GeoJSON convention is [lon, lat], opposite to "lat, lon"
-- spoken order — matches the rest of the GIS world (KML, Mapbox,
-- Leaflet, MapLibre).
--
-- No PostGIS. Plain DECIMAL + JSONB keeps the database stack
-- unchanged. If query volume ever needs spatial indexes (it
-- won't for tens-of-thousands of closures), adding PostGIS later
-- is a non-breaking upgrade — wrap the columns in geography()
-- on the way in.

ALTER TABLE splice_locations
  ADD COLUMN IF NOT EXISTS latitude  DECIMAL(10, 7),
  ADD COLUMN IF NOT EXISTS longitude DECIMAL(10, 7);

ALTER TABLE splice_cables
  ADD COLUMN IF NOT EXISTS path_geojson JSONB;

-- Bounding-box index on locations for the eventual "show me all
-- closures in the current map viewport" query. Plain b-tree on lat
-- + lon is good enough at this scale; PostGIS GIST would only earn
-- its keep past ~100k rows.
CREATE INDEX IF NOT EXISTS idx_splice_locations_geo
  ON splice_locations(latitude, longitude)
  WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
