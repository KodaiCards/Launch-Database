-- Migration 0045: Schema integrity improvements
-- 1. Indexes on invoices(client_id, status, invoice_date)
-- 2. Indexes on splice_design_imports(project_id) and splice_design_imports(status)
-- 3. ON DELETE RESTRICT on invoices.client_id FK
-- 4. ON DELETE RESTRICT on invoice_items.project_id FK
-- 5. CHECK constraint: is_ongoing=true requires billing_cadence='monthly'
--
-- NOTE: invoices.contract_id does not exist on this table; that item is skipped.
-- NOTE: pending_project_request_id has 8+ active references in routes/timeclock;
--       it is NOT dropped.

-- Indexes on invoices
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_date ON invoices(invoice_date);

-- Indexes on splice_design_imports (simple single-column, distinct from existing composites)
CREATE INDEX IF NOT EXISTS idx_splice_design_imports_project_id ON splice_design_imports(project_id);
CREATE INDEX IF NOT EXISTS idx_splice_design_imports_status_col ON splice_design_imports(status);

-- Rewrite invoices.client_id FK with ON DELETE RESTRICT
DO $$ BEGIN
  ALTER TABLE invoices DROP CONSTRAINT IF EXISTS invoices_client_id_fkey;
  ALTER TABLE invoices
    ADD CONSTRAINT invoices_client_id_fkey
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE RESTRICT;
EXCEPTION WHEN others THEN
  RAISE NOTICE 'Skipping invoices_client_id_fkey rewrite: %', SQLERRM;
END $$;

-- Rewrite invoice_items.project_id FK with ON DELETE RESTRICT
DO $$ BEGIN
  ALTER TABLE invoice_items DROP CONSTRAINT IF EXISTS invoice_items_project_id_fkey;
  ALTER TABLE invoice_items
    ADD CONSTRAINT invoice_items_project_id_fkey
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE RESTRICT;
EXCEPTION WHEN others THEN
  RAISE NOTICE 'Skipping invoice_items_project_id_fkey rewrite: %', SQLERRM;
END $$;

-- Pre-flight: repair any rows violating is_ongoing → billing_cadence='monthly'
DO $$
DECLARE bad_count int;
BEGIN
  SELECT COUNT(*) INTO bad_count FROM projects WHERE is_ongoing AND billing_cadence IS DISTINCT FROM 'monthly';
  IF bad_count > 0 THEN
    UPDATE projects SET billing_cadence = 'monthly' WHERE is_ongoing AND billing_cadence IS DISTINCT FROM 'monthly';
    RAISE NOTICE 'Repaired % rows violating is_ongoing→monthly invariant', bad_count;
  END IF;
END $$;

-- CHECK constraint: is_ongoing=true requires billing_cadence='monthly'
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'check_ongoing_is_monthly'
      AND conrelid = 'projects'::regclass
  ) THEN
    ALTER TABLE projects
      ADD CONSTRAINT check_ongoing_is_monthly
      CHECK (NOT is_ongoing OR billing_cadence = 'monthly');
  END IF;
EXCEPTION WHEN others THEN
  RAISE NOTICE 'Skipping check_ongoing_is_monthly constraint: %', SQLERRM;
END $$;
