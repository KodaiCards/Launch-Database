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

-- ─────────────────────────────────────────
-- PERMIT SUBTYPE: DOT or RR
-- ─────────────────────────────────────────
ALTER TABLE projects ADD COLUMN IF NOT EXISTS permit_subtype VARCHAR(20);

-- ─────────────────────────────────────────
-- POTENTIAL PERMITS (submitted by Design, reviewed by Permitting)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS potential_permits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sr_hwy VARCHAR(200),
  county VARCHAR(200),
  route VARCHAR(200),
  notes TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  submitted_by VARCHAR(100),
  reviewed_by VARCHAR(100),
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- DESIGN STAGES (potential → started → review_process → completed)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS design_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  stage VARCHAR(50) NOT NULL,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  updated_by VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, stage)
);
-- ═══════════════════════════════════════════════════════════════════════════
-- SCHEMA v2 ADDITIONS — Portal/Team support, propose-and-approve flow,
--                       and project duplicate prevention.
--
-- This file is IDEMPOTENT — safe to append to schema.sql so it runs on
-- every startup, or run once manually with `psql ... -f schema_v2_additions.sql`.
-- ═══════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Team assignment for jobs.
--    Admin assigns each job to a team in admin Settings. The team controls
--    which portal can see/use that job when creating projects.
--      'design'     → only the Design portal can pick this job
--      'permitting' → only the Permitting portal can pick this job
--      'both'       → both portals can pick this job
--      NULL         → unassigned; both portals see it (admin should assign)
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS team VARCHAR(20);

-- Sensible defaults for the seeded jobs (only sets where NULL — won't override
-- anything the admin has already configured).
UPDATE jobs SET team = 'permitting' WHERE name IN ('Permitting','Permitting (RR)') AND team IS NULL;
UPDATE jobs SET team = 'design'     WHERE name = 'Design' AND team IS NULL;
UPDATE jobs SET team = 'both'       WHERE name IN ('Inspection','Resident Engineer','Other') AND team IS NULL;


-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Duplicate-project prevention.
--    Rule: same project NAME under the same PARENT is a duplicate.
--    Top-level projects (no parent) are bucketed under a synthetic 'ROOT'
--    sentinel so the index covers them too.
--
--    Wrapped in DO/EXCEPTION because if existing rows already violate the
--    rule, the index creation will fail. We log a warning and continue —
--    the application layer also enforces the rule, so new dupes are still
--    blocked. To find existing duplicates, run the query in the warning.
-- ─────────────────────────────────────────────────────────────────────────────
DO $migration$
BEGIN
  BEGIN
    EXECUTE 'CREATE UNIQUE INDEX IF NOT EXISTS uniq_project_name_per_parent
             ON projects (COALESCE(parent_id::text, ''ROOT''), LOWER(name))';
  EXCEPTION WHEN unique_violation THEN
    RAISE WARNING 'Existing duplicate projects detected — unique index NOT created. '
                  'Find dupes with: SELECT parent_id, LOWER(name), COUNT(*) FROM projects '
                  'GROUP BY parent_id, LOWER(name) HAVING COUNT(*) > 1; '
                  'Then re-run this migration after cleanup.';
  END;
END
$migration$;


-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Setting change requests (the propose-and-approve queue).
--    When a portal user adds/edits/deletes a Job, Project Type, Client, or
--    Contract, the change is staged here as 'pending'. Admin sees a badge
--    in Settings, reviews each request, and approves or rejects it.
--    Approval applies the change; rejection drops it. Either way, an audit
--    trail (proposed_by, source_portal, reviewed_by, reviewed_at) is kept.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS setting_change_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type      VARCHAR(30) NOT NULL,    -- 'job' | 'project_type' | 'client' | 'contract'
  action           VARCHAR(20) NOT NULL,    -- 'create' | 'update' | 'delete'
  entity_id        UUID,                    -- NULL for create
  payload          JSONB NOT NULL,          -- proposed values (full row for create, partial for update)
  current_snapshot JSONB,                   -- snapshot of admin's current value at time of proposal
                                            -- (lets the admin UI show "currently X, proposed Y")
  source_portal    VARCHAR(20) NOT NULL,    -- 'design' | 'permitting'
  proposed_by      VARCHAR(100),            -- name entered by portal user
  status           VARCHAR(20) DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected'
  reviewed_by      VARCHAR(100),
  reviewed_at      TIMESTAMPTZ,
  review_notes     TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Fast path for the badge count query
CREATE INDEX IF NOT EXISTS idx_scr_pending
  ON setting_change_requests (created_at DESC)
  WHERE status = 'pending';


-- ═══════════════════════════════════════════════════════════════════════════
-- End of v2 additions
-- ═══════════════════════════════════════════════════════════════════════════
-- ═══════════════════════════════════════════════════════════════════════════
-- SCHEMA v2 ADDITIONS — Portal/Team support, propose-and-approve flow,
--                       and project duplicate prevention.
--
-- This file is IDEMPOTENT — safe to append to schema.sql so it runs on
-- every startup, or run once manually with `psql ... -f schema_v2_additions.sql`.
-- ═══════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Team assignment for jobs.
--    Admin assigns each job to a team in admin Settings. The team controls
--    which portal can see/use that job when creating projects.
--      'design'     → only the Design portal can pick this job
--      'permitting' → only the Permitting portal can pick this job
--      'both'       → both portals can pick this job
--      NULL         → unassigned; both portals see it (admin should assign)
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS team VARCHAR(20);

-- Sensible defaults for the seeded jobs (only sets where NULL — won't override
-- anything the admin has already configured).
UPDATE jobs SET team = 'permitting' WHERE name IN ('Permitting','Permitting (RR)') AND team IS NULL;
UPDATE jobs SET team = 'design'     WHERE name = 'Design' AND team IS NULL;
UPDATE jobs SET team = 'both'       WHERE name IN ('Inspection','Resident Engineer','Other') AND team IS NULL;


-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Duplicate-project prevention.
--    Rule: same project NAME under the same PARENT is a duplicate.
--    Top-level projects (no parent) are bucketed under a synthetic 'ROOT'
--    sentinel so the index covers them too.
--
--    Wrapped in DO/EXCEPTION because if existing rows already violate the
--    rule, the index creation will fail. We log a warning and continue —
--    the application layer also enforces the rule, so new dupes are still
--    blocked. To find existing duplicates, run the query in the warning.
-- ─────────────────────────────────────────────────────────────────────────────
DO $migration$
BEGIN
  BEGIN
    EXECUTE 'CREATE UNIQUE INDEX IF NOT EXISTS uniq_project_name_per_parent
             ON projects (COALESCE(parent_id::text, ''ROOT''), LOWER(name))';
  EXCEPTION WHEN unique_violation THEN
    RAISE WARNING 'Existing duplicate projects detected — unique index NOT created. '
                  'Find dupes with: SELECT parent_id, LOWER(name), COUNT(*) FROM projects '
                  'GROUP BY parent_id, LOWER(name) HAVING COUNT(*) > 1; '
                  'Then re-run this migration after cleanup.';
  END;
END
$migration$;


-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Setting change requests (the propose-and-approve queue).
--    When a portal user adds/edits/deletes a Job, Project Type, Client, or
--    Contract, the change is staged here as 'pending'. Admin sees a badge
--    in Settings, reviews each request, and approves or rejects it.
--    Approval applies the change; rejection drops it. Either way, an audit
--    trail (proposed_by, source_portal, reviewed_by, reviewed_at) is kept.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS setting_change_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type      VARCHAR(30) NOT NULL,    -- 'job' | 'project_type' | 'client' | 'contract'
  action           VARCHAR(20) NOT NULL,    -- 'create' | 'update' | 'delete'
  entity_id        UUID,                    -- NULL for create
  payload          JSONB NOT NULL,          -- proposed values (full row for create, partial for update)
  current_snapshot JSONB,                   -- snapshot of admin's current value at time of proposal
                                            -- (lets the admin UI show "currently X, proposed Y")
  source_portal    VARCHAR(20) NOT NULL,    -- 'design' | 'permitting'
  proposed_by      VARCHAR(100),            -- name entered by portal user
  status           VARCHAR(20) DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected'
  reviewed_by      VARCHAR(100),
  reviewed_at      TIMESTAMPTZ,
  review_notes     TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Fast path for the badge count query
CREATE INDEX IF NOT EXISTS idx_scr_pending
  ON setting_change_requests (created_at DESC)
  WHERE status = 'pending';


-- ═══════════════════════════════════════════════════════════════════════════
-- End of v2 additions
-- ═══════════════════════════════════════════════════════════════════════════


-- ═══════════════════════════════════════════════════════════════════════════
-- SCHEMA v3 ADDITIONS — Job applicability filters, billing codes, rollup
--                       projects (auto-nesting), universal-rate propagation,
--                       and seeded job set per latest spec.
--
-- Idempotent. Safe to run on every startup.
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── 1. Jobs: billing_code + applicability flags + soft-rebrand-friendly ──
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS billing_code        VARCHAR(40);
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS for_psc_client      BOOLEAN DEFAULT TRUE;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS for_generic_client  BOOLEAN DEFAULT TRUE;
-- Defaults are TRUE so any pre-existing custom job stays visible everywhere
-- until the admin tightens its scope explicitly.

-- ─── 2. Projects: rollup-folder columns ───────────────────────────────────
-- A "rollup" is a synthetic parent project that exists only to organize the
-- tree (Client / Service Area / Project Type / Team folders). They have
-- is_rollup=TRUE and rollup_level set to one of the four enum values below.
-- Real projects always have is_rollup=FALSE and rollup_level=NULL.
ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_rollup     BOOLEAN DEFAULT FALSE;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS rollup_level  VARCHAR(20);  -- 'client'|'service_area'|'project_type'|'team'
ALTER TABLE projects ADD COLUMN IF NOT EXISTS rollup_key    TEXT;         -- canonical key for find-or-create (e.g. client_id, concentrator_id, project_type_id, team name)

-- Find-or-create lookups on rollups need to be fast.
CREATE INDEX IF NOT EXISTS idx_projects_rollup
  ON projects (rollup_level, parent_id, rollup_key)
  WHERE is_rollup = TRUE;


-- ─── 3. Reseed jobs to match the latest spec ──────────────────────────────
-- Strategy: insert the canonical 9 + 3 jobs, on conflict update billing_code
-- and applicability so admin's prior tweaks aren't clobbered. Old auto-seeded
-- jobs that are no longer in the spec are deactivated, NOT deleted, so any
-- existing project history is preserved.

-- 3a. The 9 PSC jobs (also surface for non-PSC where flagged below)
INSERT INTO jobs (name, default_billing_type, default_rate, is_permitting, billing_code, team, for_psc_client, for_generic_client) VALUES
  ('County Permitting',            'footage', NULL, TRUE,  'a-2-D',      'permitting', TRUE, TRUE),
  ('DOT Permitting',               'footage', NULL, TRUE,  'a-2-D',      'permitting', TRUE, TRUE),
  ('RR Permitting',                'footage', NULL, TRUE,  'a-2-D',      'permitting', TRUE, TRUE),
  ('Resident Engineer',            'hourly',  100,  FALSE, 'g-1-B-1',    'both',       TRUE, FALSE),
  ('Inspection',                   'hourly',  90,   FALSE, 'g-1-B-4',    'both',       TRUE, FALSE),
  ('Update Plant Records',         'footage', 850,  FALSE, 'a-4',        'design',     TRUE, FALSE),
  ('OSP Staking Aerial',           'footage', 850,  FALSE, 'e-2-A-1(N)', 'design',     TRUE, FALSE),
  ('OSP Staking Underground',      'footage', 850,  FALSE, 'e-2-A-2(N)', 'design',     TRUE, FALSE),
  ('Construction Progress Reports','footage', 850,  FALSE, 'g-1-I-3',    'both',       TRUE, FALSE)
ON CONFLICT (name) DO UPDATE SET
  default_billing_type = EXCLUDED.default_billing_type,
  is_permitting        = EXCLUDED.is_permitting,
  billing_code         = EXCLUDED.billing_code,
  team                 = EXCLUDED.team,
  for_psc_client       = EXCLUDED.for_psc_client,
  for_generic_client   = EXCLUDED.for_generic_client,
  active               = TRUE;
-- NOTE: default_rate is NOT updated on conflict — admin's manual rate edits stick.

-- 3b. The 3 non-PSC-only jobs (admin sets rates manually after seed)
INSERT INTO jobs (name, default_billing_type, default_rate, is_permitting, billing_code, team, for_psc_client, for_generic_client) VALUES
  ('OSP Design & Fiber Assignments', 'hourly', NULL, FALSE, NULL, 'design', FALSE, TRUE),
  ('Staking Fiber Assignments',      'hourly', NULL, FALSE, NULL, 'design', FALSE, TRUE),
  ('Records Management',             'hourly', NULL, FALSE, NULL, 'both',   FALSE, TRUE)
ON CONFLICT (name) DO UPDATE SET
  default_billing_type = EXCLUDED.default_billing_type,
  team                 = EXCLUDED.team,
  for_psc_client       = EXCLUDED.for_psc_client,
  for_generic_client   = EXCLUDED.for_generic_client,
  active               = TRUE;

-- 3c. Deactivate legacy seeded jobs that aren't in the new spec (preserves
-- foreign keys on existing projects, just hides from new selections).
UPDATE jobs SET active = FALSE
WHERE name IN ('Permitting', 'Permitting (RR)', 'Design', 'Resident Engineer 2', 'Other')
  AND name NOT IN (
    'County Permitting','DOT Permitting','RR Permitting',
    'Resident Engineer','Inspection','Update Plant Records',
    'OSP Staking Aerial','OSP Staking Underground','Construction Progress Reports',
    'OSP Design & Fiber Assignments','Staking Fiber Assignments','Records Management'
  );


-- ─── 4. Auto-nesting migration: re-parent existing real projects ──────────
-- Runs once. Walks every active "real" project (is_rollup=FALSE) whose
-- parent_id is currently NULL, and re-points it under its proper Team rollup
-- (creating the Client / Service Area / Project Type / Team rollup chain
-- on demand). Projects that already had a parent are LEFT ALONE so manual
-- sub-project chains aren't flattened — only the top of each chain moves.

DO $migration_v3$
DECLARE
  pj            RECORD;
  client_row    RECORD;
  client_folder UUID;
  area_folder   UUID;
  type_folder   UUID;
  team_folder   UUID;
  team_name     TEXT;
  team_label    TEXT;
BEGIN
  -- Only run if migration hasn't already happened (presence of any rollup
  -- means we've run this before).
  IF EXISTS (SELECT 1 FROM projects WHERE is_rollup = TRUE LIMIT 1) THEN
    RAISE NOTICE 'Auto-nest migration already applied (rollups exist) — skipping.';
    RETURN;
  END IF;

  FOR pj IN
    SELECT p.*, c.name AS client_name, c.is_rus AS client_is_rus
    FROM projects p
    LEFT JOIN clients c ON c.id = p.client_id
    WHERE p.is_rollup = FALSE
      AND p.parent_id IS NULL
      AND p.client_id IS NOT NULL
  LOOP
    -- (1) CLIENT folder
    SELECT id INTO client_folder
    FROM projects
    WHERE is_rollup = TRUE AND rollup_level = 'client' AND rollup_key = pj.client_id::text
    LIMIT 1;
    IF client_folder IS NULL THEN
      INSERT INTO projects (name, client_id, status, is_rollup, rollup_level, rollup_key, project_type)
      VALUES (pj.client_name, pj.client_id, 'active', TRUE, 'client', pj.client_id::text, 'rollup')
      RETURNING id INTO client_folder;
    END IF;

    -- (2) SERVICE AREA folder (only if concentrator_id present)
    area_folder := client_folder;
    IF pj.concentrator_id IS NOT NULL THEN
      SELECT id INTO area_folder
      FROM projects
      WHERE is_rollup = TRUE AND rollup_level = 'service_area' AND rollup_key = pj.concentrator_id::text
        AND parent_id = client_folder
      LIMIT 1;
      IF area_folder IS NULL THEN
        INSERT INTO projects (name, client_id, parent_id, concentrator_id, status, is_rollup, rollup_level, rollup_key, project_type)
        SELECT
          COALESCE(con.area_name, 'Service Area'),
          pj.client_id, client_folder, pj.concentrator_id, 'active', TRUE, 'service_area', pj.concentrator_id::text, 'rollup'
        FROM concentrators con WHERE con.id = pj.concentrator_id
        RETURNING id INTO area_folder;
        IF area_folder IS NULL THEN area_folder := client_folder; END IF;
      END IF;
    END IF;

    -- (3) PROJECT TYPE folder (only when client is PSC-class AND project_type_id present)
    type_folder := area_folder;
    IF pj.client_is_rus = TRUE AND pj.project_type_id IS NOT NULL THEN
      SELECT id INTO type_folder
      FROM projects
      WHERE is_rollup = TRUE AND rollup_level = 'project_type' AND rollup_key = pj.project_type_id::text
        AND parent_id = area_folder
      LIMIT 1;
      IF type_folder IS NULL THEN
        INSERT INTO projects (name, client_id, parent_id, concentrator_id, project_type_id, status, is_rollup, rollup_level, rollup_key, project_type)
        SELECT
          COALESCE(pt.name, 'Project Type'),
          pj.client_id, area_folder, pj.concentrator_id, pj.project_type_id, 'active', TRUE, 'project_type', pj.project_type_id::text, 'rollup'
        FROM project_types pt WHERE pt.id = pj.project_type_id
        RETURNING id INTO type_folder;
        IF type_folder IS NULL THEN type_folder := area_folder; END IF;
      END IF;
    END IF;

    -- (4) TEAM folder (always — derived from job)
    SELECT COALESCE(j.team, 'shared') INTO team_name FROM jobs j WHERE j.id = pj.job_id;
    IF team_name IS NULL THEN team_name := 'shared'; END IF;
    team_label := CASE team_name
      WHEN 'design'     THEN 'Design Team'
      WHEN 'permitting' THEN 'Permitting Team'
      WHEN 'both'       THEN 'Shared (Design + Permitting)'
      ELSE 'Shared / Unassigned' END;

    SELECT id INTO team_folder
    FROM projects
    WHERE is_rollup = TRUE AND rollup_level = 'team' AND rollup_key = team_name
      AND parent_id = type_folder
    LIMIT 1;
    IF team_folder IS NULL THEN
      INSERT INTO projects (name, client_id, parent_id, concentrator_id, project_type_id, status, is_rollup, rollup_level, rollup_key, project_type)
      VALUES (team_label, pj.client_id, type_folder, pj.concentrator_id, pj.project_type_id, 'active', TRUE, 'team', team_name, 'rollup')
      RETURNING id INTO team_folder;
    END IF;

    -- (5) Re-parent the real project under its Team folder
    UPDATE projects SET parent_id = team_folder WHERE id = pj.id;

  END LOOP;
  RAISE NOTICE 'Auto-nest migration: complete.';
END
$migration_v3$;


-- ═══════════════════════════════════════════════════════════════════════════
-- End of v3 additions
-- ═══════════════════════════════════════════════════════════════════════════
