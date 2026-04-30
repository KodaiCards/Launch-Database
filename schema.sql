-- Launch Fiber Services - Database Schema
-- Run this once on your Railway PostgreSQL instance

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─────────────────────────────────────────
-- CORE TABLES
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  is_rus BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  contract_number VARCHAR(50) NOT NULL,
  name VARCHAR(200),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- PROJECTS
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  client_id UUID REFERENCES clients(id),
  contract_id UUID REFERENCES contracts(id),
  work_order_number VARCHAR(100),
  project_type VARCHAR(50) NOT NULL,
  -- inspection | re | permitting | design | other
  status VARCHAR(50) DEFAULT 'active',
  -- active | completed | billed | on_hold

  -- Billing config
  billing_type VARCHAR(20) NOT NULL DEFAULT 'hourly',
  -- hourly | footage
  billing_rate DECIMAL(10,2),
  -- $/hr for hourly; auto $90/hr for RUS footage
  footage DECIMAL(10,2),
  -- linear feet (permitting)
  miles DECIMAL(10,4),
  -- computed: footage / 5280

  -- Financial estimates (auto-calculated)
  expected_hours DECIMAL(10,2),
  expected_revenue DECIMAL(10,2),

  -- Actuals (sum from time_entries)
  actual_hours DECIMAL(10,2) DEFAULT 0,
  actual_revenue DECIMAL(10,2) DEFAULT 0,

  -- Dates
  start_date DATE,
  completed_date DATE,
  billed_date DATE,

  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- TIME ENTRIES
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS time_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  staff_id UUID REFERENCES staff(id),
  entry_date DATE NOT NULL,
  hours DECIMAL(5,2) NOT NULL,
  job_title VARCHAR(100),
  notes TEXT,
  import_batch VARCHAR(200),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- PERMITTING PIPELINE
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS permit_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  stage VARCHAR(50) NOT NULL,
  -- potential | started | submitted | approved | checklist | billed
  completed_at TIMESTAMPTZ,
  notes TEXT,
  updated_by VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, stage)
);

CREATE TABLE IF NOT EXISTS permit_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  doc_type VARCHAR(50) NOT NULL,
  -- submitted_permit | checklist | bill | revision
  file_name VARCHAR(255),
  file_path TEXT,
  file_size INTEGER,
  revision_number INTEGER DEFAULT 1,
  uploaded_by VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- BILLING / INVOICES
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id),
  invoice_number VARCHAR(100) UNIQUE,
  invoice_date DATE,
  billing_period_start DATE,
  billing_period_end DATE,
  total_amount DECIMAL(12,2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'draft',
  -- draft | sent | paid
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id),
  description TEXT NOT NULL,
  quantity DECIMAL(10,3),
  unit VARCHAR(20),
  -- hours | miles | lf
  rate DECIMAL(10,2),
  amount DECIMAL(12,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- AI CHAT LOG
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- SEED DATA
-- ─────────────────────────────────────────

INSERT INTO clients (name, is_rus) VALUES
  ('PSC', TRUE),
  ('COX', FALSE),
  ('IFT', FALSE),
  ('TRI-CO', FALSE)
ON CONFLICT (name) DO NOTHING;

-- ─────────────────────────────────────────
-- TRIGGERS: auto-update updated_at
-- ─────────────────────────────────────────

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS projects_updated_at ON projects;
CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─────────────────────────────────────────
-- MIGRATIONS (safe to re-run)
-- ─────────────────────────────────────────

-- Add parent_id for nested projects (existing databases)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES projects(id) ON DELETE CASCADE;

-- ─────────────────────────────────────────
-- BUDGETS
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  -- links to the parent project
  name VARCHAR(200) NOT NULL,
  -- e.g. "RUS 217 Reconnect 3"
  total_amount DECIMAL(14,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS budget_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id UUID REFERENCES budgets(id) ON DELETE CASCADE,
  code VARCHAR(100) NOT NULL,
  -- e.g. "Inspection", "Resident Engineer", "Permitting", "Design"
  description VARCHAR(255),
  allocated_amount DECIMAL(14,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Link projects to a budget code so billing draws from the right allocation
ALTER TABLE projects ADD COLUMN IF NOT EXISTS budget_code_id UUID REFERENCES budget_codes(id) ON DELETE SET NULL;

-- Auto-update budgets.updated_at
DROP TRIGGER IF EXISTS budgets_updated_at ON budgets;
CREATE TRIGGER budgets_updated_at
  BEFORE UPDATE ON budgets
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─────────────────────────────────────────
-- CONCENTRATORS / SERVICE AREAS
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS concentrators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_label VARCHAR(100) NOT NULL,
  area_name VARCHAR(200) NOT NULL,
  work_order_number VARCHAR(100),
  active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(contract_label, area_name)
);

-- Link projects to a concentrator
ALTER TABLE projects ADD COLUMN IF NOT EXISTS concentrator_id UUID REFERENCES concentrators(id) ON DELETE SET NULL;

-- Seed concentrator data
INSERT INTO concentrators (contract_label, area_name, work_order_number) VALUES
  ('Contract 3', 'Mt. Paran', '16316'),
  ('Contract 3', 'Crossroad School', '16300'),
  ('Contract 3', 'HWY 240', '16302'),
  ('Contract 3', 'Knoxville', '16298'),
  ('Contract 3', 'Cummings', '16299'),
  ('Contract 3', 'Wesley', '16301'),
  ('Contract 4', 'Butler', '16295'),
  ('Contract 4', 'Rustin Lake', NULL),
  ('Contract 4', 'Reynolds', '16294'),
  ('Contract 5', 'Talbotton', '16303'),
  ('Contract 5', 'Roberta', '16296'),
  ('Contract 5', 'Colluden', '16297')
ON CONFLICT (contract_label, area_name) DO UPDATE SET work_order_number = EXCLUDED.work_order_number;

-- ─────────────────────────────────────────
-- BILLING HOLD (powers the "Wait" button on the Billing tab)
-- When set, hides a project from the billing queue until that date.
-- ─────────────────────────────────────────
ALTER TABLE projects ADD COLUMN IF NOT EXISTS bill_hold_until DATE;

-- ─────────────────────────────────────────
-- HOURS PRECISION (preserve decimal precision on imports)
-- DECIMAL(5,2) was rounding to 2 places, which truncated values like 11.745
-- to 11.75. Widen to 4 places — matches whatever timesheets actually contain.
-- ─────────────────────────────────────────
ALTER TABLE time_entries ALTER COLUMN hours TYPE DECIMAL(8,4);
ALTER TABLE projects ALTER COLUMN actual_hours TYPE DECIMAL(12,4);
ALTER TABLE projects ALTER COLUMN expected_hours TYPE DECIMAL(12,4);

-- ─────────────────────────────────────────
-- JOBS (work categories like Inspector, RE, Permitting, Design...)
-- These replace the role of project_type for billing logic. project_type
-- now only describes the program category (BAU / GF(R) / RUS / Other).
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,        -- e.g. "Inspection", "Resident Engineer"
  default_billing_type VARCHAR(20) DEFAULT 'hourly', -- 'hourly' | 'footage'
  default_rate NUMERIC(10,2),                -- $/hr for hourly, $/mile for footage
  -- Permitting is a special kind of footage billing: "calculated hours" at $90/hr
  -- where hours = miles * (random 25..30 in 0.25 increments), min 25 hours.
  is_permitting BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project program categories (BAU, GF(R), RUS, Other). User can add more.
CREATE TABLE IF NOT EXISTS project_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO project_types (name) VALUES
  ('BAU'), ('GF(R)'), ('RUS'), ('Other')
ON CONFLICT (name) DO NOTHING;

-- Pre-load the standard work jobs. Permitting uses a special calc explained above.
-- "Permitting" is the standard DOT/County permit. "Permitting (RR)" is the
-- railroad variant — uses the same hours-per-mile calc but with a custom rate
-- you can set later (default left null so projects can be created before the
-- rate is finalized).
INSERT INTO jobs (name, default_billing_type, default_rate, is_permitting) VALUES
  ('Inspection',          'hourly',  90,   FALSE),
  ('Resident Engineer',   'hourly', 100,   FALSE),
  ('Permitting',          'footage', 90,   TRUE),
  ('Permitting (RR)',     'footage', NULL, TRUE),
  ('Design',              'hourly',  NULL, FALSE),
  ('Other',               'hourly',  NULL, FALSE)
ON CONFLICT (name) DO NOTHING;

-- Link projects to a job (the work category) and a project_type (the program category).
ALTER TABLE projects ADD COLUMN IF NOT EXISTS job_id UUID REFERENCES jobs(id) ON DELETE SET NULL;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_type_id UUID REFERENCES project_types(id) ON DELETE SET NULL;

-- For permitting projects we now need to remember the randomized hours-per-mile
-- factor so re-displays show the same "expected hours" the project was created with.
ALTER TABLE projects ADD COLUMN IF NOT EXISTS permitting_hours_per_mile NUMERIC(6,2);

-- ─────────────────────────────────────────
-- PRICING LIST (Job × Project Type × Billing Code → rate)
-- The settings panel manages this; project creation pulls defaults from it.
-- A red dot appears in the settings button when there are jobs / types / codes
-- that don't yet have a price entry.
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pricing_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  project_type_id UUID REFERENCES project_types(id) ON DELETE CASCADE,
  billing_code VARCHAR(100), -- e.g. "g-1-B-4" (nullable: not every entry has one)
  billing_type VARCHAR(20) DEFAULT 'hourly', -- 'hourly' | 'footage' | 'permitting'
  rate NUMERIC(10,2),         -- $/hr or $/mile depending on billing_type
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (job_id, project_type_id, billing_code)
);

DROP TRIGGER IF EXISTS pricing_entries_updated_at ON pricing_entries;
CREATE TRIGGER pricing_entries_updated_at
  BEFORE UPDATE ON pricing_entries
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Pre-load RUS billing codes the user gave me.
-- Permitting code (a-2-D) is intentionally configured as 'permitting' billing_type
-- so the special hours-per-mile logic applies. Rate stays at $90/hr.
DO $$
DECLARE
  rus_id UUID;
  insp_id UUID; re_id UUID; perm_id UUID; other_id UUID;
BEGIN
  SELECT id INTO rus_id FROM project_types WHERE name = 'RUS';
  SELECT id INTO insp_id FROM jobs WHERE name = 'Inspection';
  SELECT id INTO re_id   FROM jobs WHERE name = 'Resident Engineer';
  SELECT id INTO perm_id FROM jobs WHERE name = 'Permitting';
  SELECT id INTO other_id FROM jobs WHERE name = 'Other';

  -- Hourly RUS codes
  INSERT INTO pricing_entries (job_id, project_type_id, billing_code, billing_type, rate)
  VALUES (insp_id, rus_id, 'g-1-B-4', 'hourly', 90)
  ON CONFLICT (job_id, project_type_id, billing_code) DO NOTHING;

  INSERT INTO pricing_entries (job_id, project_type_id, billing_code, billing_type, rate)
  VALUES (re_id, rus_id, 'g-1-B-1', 'hourly', 100)
  ON CONFLICT (job_id, project_type_id, billing_code) DO NOTHING;

  -- Permitting: $90/hr, special calc applied at project create
  INSERT INTO pricing_entries (job_id, project_type_id, billing_code, billing_type, rate)
  VALUES (perm_id, rus_id, 'a-2-D', 'permitting', 90)
  ON CONFLICT (job_id, project_type_id, billing_code) DO NOTHING;

  -- Permitting (RR): same calc, but rate is intentionally NULL — railroad
  -- permits are priced case-by-case. User sets the rate in Settings → Pricing
  -- when they have it. Project creation shouldn't block on the missing rate.
  IF (SELECT id FROM jobs WHERE name = 'Permitting (RR)') IS NOT NULL THEN
    INSERT INTO pricing_entries (job_id, project_type_id, billing_code, billing_type, rate)
    SELECT (SELECT id FROM jobs WHERE name = 'Permitting (RR)'), rus_id, NULL, 'permitting', NULL
    WHERE NOT EXISTS (
      SELECT 1 FROM pricing_entries pe
      WHERE pe.job_id = (SELECT id FROM jobs WHERE name = 'Permitting (RR)')
        AND pe.project_type_id = rus_id
    );
  END IF;

  -- $850 per mile codes (per-mile fixed billing). Mapped to "Other" job
  -- since they don't fit cleanly into Inspection/RE/Permitting/Design.
  INSERT INTO pricing_entries (job_id, project_type_id, billing_code, billing_type, rate, notes)
  VALUES
    (other_id, rus_id, 'a-4',         'footage', 850, 'Update Plant Records'),
    (other_id, rus_id, 'e-2-A-2(N)',  'footage', 850, 'OSP Staking Underground'),
    (other_id, rus_id, 'e-2-A-1(N)',  'footage', 850, 'OSP Staking Aerial'),
    (other_id, rus_id, 'g-1-I-3',     'footage', 850, 'Construction Progress Reports')
  ON CONFLICT (job_id, project_type_id, billing_code) DO NOTHING;
END $$;

-- ─────────────────────────────────────────
-- INVOICE GROUPING (multiple projects → one invoice)
-- The Billing tab already creates invoice records via bill-and-clone.
-- Now we let the user select multiple projects and bill them as ONE invoice
-- with one custom name. invoice_items already has project_id, so this works
-- by inserting one parent invoices row and N invoice_items rows.
-- ─────────────────────────────────────────
-- (no schema change needed — just need invoice_number to be settable freely)

-- ─────────────────────────────────────────
-- BUDGET → JOB LINKAGE
-- A budget_code can be filtered to a specific job so earned-revenue subtraction
-- only counts projects whose job matches. NULL = applies to all jobs.
-- ─────────────────────────────────────────
ALTER TABLE budget_codes ADD COLUMN IF NOT EXISTS job_id UUID REFERENCES jobs(id) ON DELETE SET NULL;

-- ─────────────────────────────────────────
-- LEGACY MIGRATION: backfill jobs + project_types for existing rows
-- Maps old project_type strings ('inspection','re','permitting','design','other')
-- onto the new jobs table. Runs once safely.
-- ─────────────────────────────────────────
DO $$
BEGIN
  UPDATE projects p SET job_id = j.id
    FROM jobs j WHERE p.job_id IS NULL AND p.project_type IS NOT NULL
    AND (
      (LOWER(p.project_type) = 'inspection' AND j.name = 'Inspection') OR
      (LOWER(p.project_type) IN ('re','resident engineer') AND j.name = 'Resident Engineer') OR
      (LOWER(p.project_type) = 'permitting' AND j.name = 'Permitting') OR
      (LOWER(p.project_type) = 'design' AND j.name = 'Design') OR
      (LOWER(p.project_type) = 'other' AND j.name = 'Other')
    );
END $$;

-- ─────────────────────────────────────────
-- BACKFILL: Set billing_rate on existing projects that have NULL
-- This ensures revenue calculations work for previously created projects
-- ─────────────────────────────────────────
UPDATE projects SET billing_rate = 90
  WHERE billing_rate IS NULL AND LOWER(project_type) = 'inspection';
UPDATE projects SET billing_rate = 100
  WHERE billing_rate IS NULL AND LOWER(project_type) IN ('re', 'resident engineer');
UPDATE projects SET billing_rate = 90
  WHERE billing_rate IS NULL AND LOWER(project_type) = 'permitting';
UPDATE projects SET billing_type = 'hourly'
  WHERE billing_type IS NULL AND LOWER(project_type) IN ('inspection', 're', 'resident engineer');
UPDATE projects SET billing_type = 'footage'
  WHERE billing_type IS NULL AND LOWER(project_type) = 'permitting';

-- ─────────────────────────────────────────
-- RECALC: Fix actual_hours from time_entries
-- Handles cases where hours exist but actual_hours is 0
-- ─────────────────────────────────────────

-- Step 1: Set leaf projects to their own direct hours
UPDATE projects SET actual_hours = COALESCE((
  SELECT SUM(hours) FROM time_entries WHERE project_id = projects.id
), 0)
WHERE NOT EXISTS (SELECT 1 FROM projects c WHERE c.parent_id = projects.id);

-- Step 2: Roll up to parents (run multiple times for unlimited depth)
DO $$
DECLARE
  i INT := 0;
  changed INT := 1;
BEGIN
  WHILE changed > 0 AND i < 20 LOOP
    UPDATE projects p SET actual_hours = (
      SELECT COALESCE(SUM(hours),0) FROM time_entries WHERE project_id = p.id
    ) + (
      SELECT COALESCE(SUM(actual_hours),0) FROM projects WHERE parent_id = p.id
    )
    WHERE EXISTS (SELECT 1 FROM projects c WHERE c.parent_id = p.id);
    GET DIAGNOSTICS changed = ROW_COUNT;
    i := i + 1;
  END LOOP;
END $$;

-- ─────────────────────────────────────────
-- BILLING CADENCE — distinguishes one-time projects (permitting, fixed-fee
-- design jobs) from ongoing monthly projects (Inspection contracts that bill
-- hours every month). Drives:
--   • the Billing tab queue (one row per unbilled month for monthly projects,
--     vs one row total for one-time projects)
--   • whether billing closes the project (one_time → status=billed, monthly
--     → project stays active and reappears next month)
--   • CSV importer warns when adding hours to a month that's already invoiced
-- ─────────────────────────────────────────
ALTER TABLE projects ADD COLUMN IF NOT EXISTS billing_cadence VARCHAR(20) DEFAULT 'one_time';

-- Backfill: any project whose Job is "Inspection" gets cadence='monthly'.
-- Done idempotently — re-running the schema won't blow away manual changes
-- because we only update rows that still have the default value.
UPDATE projects p SET billing_cadence = 'monthly'
  FROM jobs j
  WHERE p.job_id = j.id
    AND j.name = 'Inspection'
    AND (p.billing_cadence IS NULL OR p.billing_cadence = 'one_time');

-- ─────────────────────────────────────────
-- PROJECTED REVENUE — the project's contract value / projected total earnings.
-- For footage projects this defaults to expected_revenue (already computed).
-- For hourly projects it's user-entered (nullable; not required).
-- IMPORTANT: rollup uses leaves only. Containers don't carry their own
-- projected_revenue; their displayed total is SUM(descendant_leaves). That
-- prevents double counting when both a parent and its leaves have a value.
-- ─────────────────────────────────────────
ALTER TABLE projects ADD COLUMN IF NOT EXISTS projected_revenue NUMERIC(14,2);

-- Backfill footage projects: copy their already-calculated expected_revenue.
-- Hourly projects stay NULL until the user sets a value manually.
UPDATE projects
  SET projected_revenue = expected_revenue
  WHERE projected_revenue IS NULL
    AND billing_type = 'footage'
    AND expected_revenue IS NOT NULL;

-- ─────────────────────────────────────────
-- MANUAL INVOICE AMOUNT — overrides the calculated billing amount.
-- When set on a project, the Billing tab and bill flows use this flat amount
-- instead of (hours × rate) or footage expected_revenue. Useful for
-- fixed-fee jobs where the contract is for a specific dollar amount that
-- doesn't fit the hourly or per-mile model. NULL = use the calculated value.
-- ─────────────────────────────────────────
ALTER TABLE projects ADD COLUMN IF NOT EXISTS manual_invoice_amount NUMERIC(14,2);
