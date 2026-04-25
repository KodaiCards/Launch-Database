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
