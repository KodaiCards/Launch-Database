-- migrations/0018_splice_location_types.sql — Extend splice_locations.type
-- enum so OSP designs can use the full vocabulary of field infrastructure.
-- The Phase 1 migration only enumerated the types needed for splice-centric
-- topology (co, splice_point, fdh, terminal, ring_cut). Field work also
-- places handholes, manholes, poles, pedestals, and vaults; the map palette
-- needs all of these without a schema error.

ALTER TABLE splice_locations DROP CONSTRAINT IF EXISTS splice_locations_type_check;
ALTER TABLE splice_locations ADD CONSTRAINT splice_locations_type_check
  CHECK (type IN ('co','splice_point','fdh','terminal','ring_cut',
                  'handhole','manhole','pole','pedestal','vault'));
