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

INSERT INTO contracts (client_id, contract_number, name)
  SELECT id, 'CONTRACT-3', 'RUS Contract 3' FROM clients WHERE name = 'PSC'
ON CONFLICT DO NOTHING;

INSERT INTO contracts (client_id, contract_number, name)
  SELECT id, 'CONTRACT-4', 'RUS Contract 4' FROM clients WHERE name = 'PSC'
ON CONFLICT DO NOTHING;

INSERT INTO contracts (client_id, contract_number, name)
  SELECT id, 'CONTRACT-5', 'RUS Contract 5' FROM clients WHERE name = 'PSC'
ON CONFLICT DO NOTHING;

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
