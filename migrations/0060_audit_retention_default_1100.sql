-- Migration 0060: bump audit_log retention default to 1100 days (~3 years)
--
-- Carter directive 2026-05-30: RUS engineering contracts require 3-year
-- audit retention. Universal bump from 730 -> 1100 days for compliance.
-- Variable per-EC retention deferred.

UPDATE audit_retention_config
   SET hot_retention_days = 1100
 WHERE id = 1 AND hot_retention_days = 730;

DO $$
DECLARE
  current_val int;
BEGIN
  SELECT hot_retention_days INTO current_val FROM audit_retention_config WHERE id = 1;
  RAISE NOTICE 'Wave 210: audit_retention_config.hot_retention_days now = %', current_val;
END $$;
