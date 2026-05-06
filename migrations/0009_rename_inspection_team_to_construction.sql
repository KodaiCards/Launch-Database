-- 0009_rename_inspection_team_to_construction.sql
--
-- Owner-flagged 2026-05-06: rename the "Inspection" team to "Construction".
-- The team enum lives in two places at the data layer:
--
--   1. jobs.team — VARCHAR column with values like 'inspection',
--      'permitting', 'design', 'both', NULL. Bumps any 'inspection'
--      to 'construction'.
--   2. staff.extra_teams — TEXT[] of additional teams a user can
--      access beyond their primary role. Same swap.
--
-- The PROJECT_TYPE column ('inspection' / 're' / 'permitting' / etc.)
-- is a separate axis (work category, not team) and is NOT touched —
-- billing rates and inspection-tab scope still key on project_type.
--
-- Idempotent: re-running this migration is a no-op once the data is
-- already on 'construction'.

-- Rename jobs.team — defensive WHERE so we don't churn rows that are
-- already migrated.
UPDATE jobs
   SET team = 'construction'
 WHERE team = 'inspection';

-- Rename staff.extra_teams — array_replace returns the original array
-- unchanged when the search value isn't present, so this is safe to
-- run on already-migrated rows.
UPDATE staff
   SET extra_teams = array_replace(extra_teams, 'inspection', 'construction')
 WHERE extra_teams IS NOT NULL
   AND 'inspection' = ANY(extra_teams);
