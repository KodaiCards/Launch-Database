-- 0030_perf_indexes.sql — Wave 3 BE-Perf: 9 missing query-plan indexes.
--
-- All are CREATE INDEX IF NOT EXISTS so this migration is fully idempotent.
-- None alter table structure — safe to apply on a live production database
-- with zero downtime (Postgres builds indexes without a full table lock when
-- using the plain CREATE INDEX inside a transaction; for CONCURRENT builds
-- the migration runner's BEGIN/COMMIT approach is already correct).
--
-- Index naming convention: idx_<table>_<columns>.

-- 1. time_entries — project lookup by date range (dashboard period revenue,
--    billing report, invoice data assembly). The (project_id, entry_date)
--    composite satisfies WHERE project_id = $1 AND entry_date BETWEEN $2 AND $3.
CREATE INDEX IF NOT EXISTS idx_time_entries_project_date
  ON time_entries (project_id, entry_date);

-- 2. time_entries — staff lookup by date (timeclock, backfill preview,
--    hours-by-staff report). Satisfies WHERE staff_id = $1 AND entry_date = $2
--    and range variants.
CREATE INDEX IF NOT EXISTS idx_time_entries_staff_date
  ON time_entries (staff_id, entry_date);

-- 3. projects — parent traversal (recursive CTEs walk parent_id repeatedly).
--    Every WITH RECURSIVE tree join on c.parent_id = t.id hits this.
CREATE INDEX IF NOT EXISTS idx_projects_parent_id
  ON projects (parent_id);

-- 4. projects — status filter (dashboard active count, unbilled alert list,
--    billing queue). Very selective when combined with status='active' or
--    status='completed'.
CREATE INDEX IF NOT EXISTS idx_projects_status
  ON projects (status);

-- 5. projects — client scoping (dashboard per-client lists, billing batch
--    client enforcement, invoice makeup inference).
CREATE INDEX IF NOT EXISTS idx_projects_client_id
  ON projects (client_id);

-- 6. contracts — engineering contract lookup (invoice generator walks all
--    contracts under an EC; WITHOUT this, every contract query is a seqscan
--    on the contracts table).
CREATE INDEX IF NOT EXISTS idx_contracts_ec_id
  ON contracts (engineering_contract_id);

-- 7. invoice_items — project dimension (hours_csv billed-period check,
--    billing queue "already billed this month" filter). Joins
--    invoice_items ON project_id = ANY($1::uuid[]).
CREATE INDEX IF NOT EXISTS idx_invoice_items_project_id
  ON invoice_items (project_id);

-- 8. invoice_items — invoice FK (batch/:id/items lookup, billing report
--    item enumeration). Satisfies WHERE invoice_id = $1.
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id
  ON invoice_items (invoice_id);

-- 9. permit_stages — active-stage queries. The permits tab, automation
--    stale-permit finder, and AI pipeline all filter on
--    WHERE project_id = $1 AND completed_at IS NULL. The partial index
--    covers only active (not-yet-completed) rows — much smaller than a
--    full index on the column, and the query planner will use it whenever
--    completed_at IS NULL appears in the WHERE clause.
--
--    Note: the canonical "active" predicate in this codebase is
--    completed_at IS NULL, not a `complete` boolean (schema.sql uses
--    completed_at TIMESTAMPTZ with NULL = not yet done).
CREATE INDEX IF NOT EXISTS idx_permit_stages_active
  ON permit_stages (project_id)
  WHERE completed_at IS NULL;
