-- migrations/0005_rus_pricing_seed_program.sql — Phase 3b polish (cleanup).
--
-- Re-seeds the RUS billing-code pricing entries that used to live in
-- schema.sql, now keyed on `program` (text enum) instead of the dropped
-- `project_type_id` FK. Without this migration:
--
--   • Fresh DBs would have no RUS pricing defaults at all (the legacy
--     seed in schema.sql was stubbed out in this commit because it
--     referenced the dropped column and was throwing on every boot).
--   • Existing DBs are unaffected by this migration if the rows already
--     exist (ON CONFLICT DO NOTHING on the unique index that migration
--     0004 created).
--
-- Codes are the RUS-specific billing codes the owner provided (g-1-B-4
-- for Inspection, g-1-B-1 for Resident Engineer, a-2-D for Permitting,
-- a-4 for Update Plant Records, e-2-A-1(N) / e-2-A-2(N) for OSP Staking,
-- g-1-I-3 for Construction Progress Reports). Permitting (a-2-D) is
-- billing_type='permitting' so the special hours-per-mile randomization
-- fires at project create.
--
-- Idempotent. Safe to re-run.

DO $migration$
DECLARE
  insp_id UUID;
  re_id   UUID;
  perm_id UUID;
  rr_id   UUID;
  other_id UUID;
BEGIN
  -- Lookup job UUIDs by canonical name. Job seeds live in schema.sql's
  -- $jobseed$ block + the v3 reseed in server.js — they should always
  -- exist by the time this migration runs.
  SELECT id INTO insp_id  FROM jobs WHERE name = 'Inspection';
  SELECT id INTO re_id    FROM jobs WHERE name = 'Resident Engineer';
  -- Prefer the new "DOT Permitting" name (Phase 3 reseed). Fall back to
  -- the legacy "Permitting" name for environments that haven't reseeded
  -- yet — both refer to the same job in practice.
  SELECT id INTO perm_id FROM jobs WHERE name IN ('DOT Permitting','Permitting') LIMIT 1;
  SELECT id INTO rr_id    FROM jobs WHERE name IN ('RR Permitting','Permitting (RR)') LIMIT 1;
  SELECT id INTO other_id FROM jobs WHERE name = 'Other';

  -- Hourly RUS codes
  IF insp_id IS NOT NULL THEN
    INSERT INTO pricing_entries (job_id, program, billing_code, billing_type, rate)
    VALUES (insp_id, 'rus', 'g-1-B-4', 'hourly', 90)
    ON CONFLICT (job_id, program, COALESCE(billing_code, '__no_code__')) DO NOTHING;
  END IF;

  IF re_id IS NOT NULL THEN
    INSERT INTO pricing_entries (job_id, program, billing_code, billing_type, rate)
    VALUES (re_id, 'rus', 'g-1-B-1', 'hourly', 100)
    ON CONFLICT (job_id, program, COALESCE(billing_code, '__no_code__')) DO NOTHING;
  END IF;

  -- DOT/County Permitting: $90/hr, special hours-per-mile calc applied at project create.
  IF perm_id IS NOT NULL THEN
    INSERT INTO pricing_entries (job_id, program, billing_code, billing_type, rate)
    VALUES (perm_id, 'rus', 'a-2-D', 'permitting', 90)
    ON CONFLICT (job_id, program, COALESCE(billing_code, '__no_code__')) DO NOTHING;
  END IF;

  -- RR Permitting: same calc, rate intentionally NULL — railroad permits
  -- are priced case-by-case. User sets the rate in Settings → Pricing.
  IF rr_id IS NOT NULL THEN
    INSERT INTO pricing_entries (job_id, program, billing_code, billing_type, rate)
    VALUES (rr_id, 'rus', NULL, 'permitting', NULL)
    ON CONFLICT (job_id, program, COALESCE(billing_code, '__no_code__')) DO NOTHING;
  END IF;

  -- $850-per-mile RUS codes. Mapped to "Other" job because the historical
  -- seed grouped them all there; admin can split them across separate
  -- jobs (Update Plant Records / OSP Staking / Construction Progress
  -- Reports) in Settings → Pricing if/when desired.
  IF other_id IS NOT NULL THEN
    INSERT INTO pricing_entries (job_id, program, billing_code, billing_type, rate, notes)
    VALUES
      (other_id, 'rus', 'a-4',         'footage', 850, 'Update Plant Records'),
      (other_id, 'rus', 'e-2-A-2(N)',  'footage', 850, 'OSP Staking Underground'),
      (other_id, 'rus', 'e-2-A-1(N)',  'footage', 850, 'OSP Staking Aerial'),
      (other_id, 'rus', 'g-1-I-3',     'footage', 850, 'Construction Progress Reports')
    ON CONFLICT (job_id, program, COALESCE(billing_code, '__no_code__')) DO NOTHING;
  END IF;

  RAISE NOTICE '[migration 0005] RUS pricing seed applied (Inspection / RE / Permitting / Per-mile codes).';
END
$migration$;
