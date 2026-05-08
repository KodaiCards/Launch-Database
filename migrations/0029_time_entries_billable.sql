-- 0029: Track billed vs unbilled hours on time_entries.
--
-- Why: timeclock CSVs include rows where the tech picked an "unbilled
-- bucket" customer (Miscellaneous, Permitting, or a bare "WO #N" with no
-- real customer prefix). Those rows previously had nowhere to land — the
-- importer skipped any row whose WO# didn't match a project — so the
-- hours were silently dropped. With this migration, unbilled rows persist
-- with project_id=NULL and is_billable=FALSE, and the Hours / Revenue tabs
-- can segment billed vs unbilled.
--
-- is_billable defaults TRUE so every existing row remains billed.
-- unbilled_category captures which bucket the row came from
-- ('misc' | 'permitting' | 'wo_only') for grouping in the Hours tab.

ALTER TABLE time_entries
  ADD COLUMN IF NOT EXISTS is_billable BOOLEAN NOT NULL DEFAULT TRUE;

ALTER TABLE time_entries
  ADD COLUMN IF NOT EXISTS unbilled_category TEXT NULL;

-- Index supports the Hours tab "unbilled only" filter and the Revenue
-- utilization tile (which sums hours grouped by is_billable for a date
-- range). Partial index keeps the cost low — most rows are billed.
CREATE INDEX IF NOT EXISTS idx_time_entries_unbilled
  ON time_entries (entry_date)
  WHERE is_billable = FALSE;
