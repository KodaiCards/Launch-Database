-- Migration 0048: Audit log retention policy + soft-archive tracking
--
-- RUS compliance requires 7-year audit trail retention.
-- Adds:
--   1. archived_at column on audit_log (soft-archive marker, not deletion)
--   2. Partial indexes for hot vs. archived queries
--   3. audit_retention_config table (singleton) to track policy + last-run state
--
-- DELETE trigger on audit_log still prevents deletion; archive = marking as archived.
--
-- Idempotent: safe to re-run.

-- Add archived_at column to audit_log (if not exists)
-- This is a soft-archive marker: rows older than hot_retention_days get archived_at set,
-- but they remain in the table (DELETE trigger prevents removal).
ALTER TABLE IF EXISTS public.audit_log
  ADD COLUMN IF NOT EXISTS archived_at timestamptz;

-- Partial index for hot queries (archived_at IS NULL = currently active)
-- Most queries will target hot rows; this index speeds those up.
CREATE INDEX IF NOT EXISTS idx_audit_log_hot
  ON public.audit_log (at DESC)
  WHERE archived_at IS NULL;

-- Partial index for archive queries (archived_at IS NOT NULL)
CREATE INDEX IF NOT EXISTS idx_audit_log_archived
  ON public.audit_log (archived_at)
  WHERE archived_at IS NOT NULL;

-- audit_retention_config: singleton table tracking hot/total retention days + last run
CREATE TABLE IF NOT EXISTS public.audit_retention_config (
  id                    integer NOT NULL PRIMARY KEY CHECK (id = 1),
  hot_retention_days    integer NOT NULL DEFAULT 730,  -- 2 years hot
  total_retention_days  integer NOT NULL DEFAULT 2557, -- 7 years (RUS requirement; informational only)
  last_archive_run_at   timestamptz,
  last_archive_row_count integer,
  updated_at            timestamptz NOT NULL DEFAULT now()
);

-- Insert default config (only runs if table was just created)
INSERT INTO public.audit_retention_config (id) VALUES (1) ON CONFLICT DO NOTHING;
