-- Migration 0064: Service-Area-with-jobs model (Phase 2 keystone)
--
-- The new core model: a Service Area / Concentrator is the UNIT of work, and
-- "jobs" are line items inside it. This replaces the rollup-of-rollups projects
-- tree (is_rollup/rollup_level/rollup_key), which is retired from the everyday
-- model once the app is rewired onto these tables.
--
--   service_areas          — the unit (client-first; optional EC ⟺ RUS)
--   service_area_jobs      — line items (team · job-type · employee · rate · status · $)
--   service_area_materials — Phase 10 hook (BOM rows; empty for now)
--   time_entries.service_area_job_id        — hours roll into a job line item
--   time_clock_sessions.service_area_job_id — timeclock target (Phase 5)
--
-- ADDITIVE only: creates new tables + adds nullable columns. Does NOT touch or
-- drop the legacy projects tree. Idempotent: safe to re-run.

BEGIN;

-- ─── service_areas ───────────────────────────────────────────────────────────
-- Always under a client. engineering_contract_id is set ONLY for RUS work
-- (EC presence ⟺ RUS); program mirrors that.

CREATE TABLE IF NOT EXISTS public.service_areas (
  id                      uuid NOT NULL DEFAULT gen_random_uuid(),
  client_id               uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  engineering_contract_id uuid REFERENCES public.engineering_contracts(id) ON DELETE SET NULL,
  name                    text NOT NULL,
  work_order_number       text,
  program                 varchar(20),
  status                  varchar(30) NOT NULL DEFAULT 'active',
  notes                   text,
  start_date              date,
  completed_date          date,
  billed_date             date,
  is_ongoing              boolean NOT NULL DEFAULT false,
  billing_cadence         varchar(20) NOT NULL DEFAULT 'one_time',
  map_file_path           text,            -- Phase 7 map/KMZ hook
  map_filename            text,
  client_visible          boolean NOT NULL DEFAULT false,  -- Phase 6 portal hook
  created_by_user_id      uuid REFERENCES public.users(id) ON DELETE SET NULL,
  updated_by_user_id      uuid REFERENCES public.users(id) ON DELETE SET NULL,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT service_areas_pkey PRIMARY KEY (id),
  CONSTRAINT service_areas_program_check
    CHECK (program IS NULL OR program IN ('rus','bau','gfr','other')),
  CONSTRAINT service_areas_ec_implies_rus
    CHECK (engineering_contract_id IS NULL OR program = 'rus'),
  CONSTRAINT service_areas_billing_cadence_check
    CHECK (billing_cadence IN ('one_time','monthly')),
  CONSTRAINT service_areas_ongoing_monthly
    CHECK (NOT is_ongoing OR billing_cadence = 'monthly')
);

CREATE INDEX IF NOT EXISTS idx_service_areas_client ON public.service_areas (client_id);
CREATE INDEX IF NOT EXISTS idx_service_areas_ec     ON public.service_areas (engineering_contract_id);
CREATE INDEX IF NOT EXISTS idx_service_areas_status ON public.service_areas (status);

-- ─── service_area_jobs ───────────────────────────────────────────────────────
-- Line items. job_id → jobs catalog (the expandable work-type list:
-- "DOT Permitting", "Staking", "Inspection", …). team drives which status
-- pipeline applies; status is validated app-side per team (the CHECK here is a
-- permissive union of all pipeline states).

CREATE TABLE IF NOT EXISTS public.service_area_jobs (
  id                  uuid NOT NULL DEFAULT gen_random_uuid(),
  service_area_id     uuid NOT NULL REFERENCES public.service_areas(id) ON DELETE CASCADE,
  job_id              uuid REFERENCES public.jobs(id) ON DELETE SET NULL,
  team                varchar(20),
  assigned_staff_id   uuid REFERENCES public.staff(id) ON DELETE SET NULL,
  assigned_user_id    uuid REFERENCES public.users(id) ON DELETE SET NULL,
  billing_type        varchar(20) NOT NULL DEFAULT 'hourly',
  rate                numeric(10,2),
  status              varchar(30) NOT NULL DEFAULT 'potential',
  estimated_amount    numeric(14,2),
  actual_hours        numeric(12,4) NOT NULL DEFAULT 0,
  actual_amount       numeric(14,2) NOT NULL DEFAULT 0,
  footage             numeric(12,2),
  miles               numeric(10,4),
  start_date          date,
  completed_date      date,
  billed_date         date,
  notes               text,
  created_by_user_id  uuid REFERENCES public.users(id) ON DELETE SET NULL,
  updated_by_user_id  uuid REFERENCES public.users(id) ON DELETE SET NULL,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT service_area_jobs_pkey PRIMARY KEY (id),
  CONSTRAINT service_area_jobs_team_check
    CHECK (team IS NULL OR team IN ('permitting','design','construction')),
  CONSTRAINT service_area_jobs_billing_type_check
    CHECK (billing_type IN ('hourly','footage','fixed')),
  CONSTRAINT service_area_jobs_status_check
    CHECK (status IN ('potential','started','submitted','approved','issued',
                      'client_approved','revision','complete','billed','cancelled'))
);

CREATE INDEX IF NOT EXISTS idx_sa_jobs_service_area ON public.service_area_jobs (service_area_id);
CREATE INDEX IF NOT EXISTS idx_sa_jobs_job          ON public.service_area_jobs (job_id);
CREATE INDEX IF NOT EXISTS idx_sa_jobs_staff        ON public.service_area_jobs (assigned_staff_id);
CREATE INDEX IF NOT EXISTS idx_sa_jobs_team_status  ON public.service_area_jobs (team, status);

-- ─── service_area_materials (Phase 10 hook) ─────────────────────────────────
-- Reserved now so the model accommodates map-BOM-driven materials later.
-- Populated from a map's BOM CSV (source='bom_csv') or by hand ('manual').

CREATE TABLE IF NOT EXISTS public.service_area_materials (
  id              uuid NOT NULL DEFAULT gen_random_uuid(),
  service_area_id uuid NOT NULL REFERENCES public.service_areas(id) ON DELETE CASCADE,
  item            text NOT NULL,
  quantity        numeric(14,3),
  unit            varchar(40),
  unit_cost       numeric(14,2),
  source          varchar(20) NOT NULL DEFAULT 'manual',
  notes           text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT service_area_materials_pkey PRIMARY KEY (id),
  CONSTRAINT service_area_materials_source_check CHECK (source IN ('manual','bom_csv'))
);

CREATE INDEX IF NOT EXISTS idx_sa_materials_service_area ON public.service_area_materials (service_area_id);

-- ─── hours linkage ───────────────────────────────────────────────────────────
-- Hours logged against a service-area job (rolls into actual_hours). Kept
-- nullable + alongside legacy project_id during the transition.

ALTER TABLE public.time_entries        ADD COLUMN IF NOT EXISTS service_area_job_id uuid;
ALTER TABLE public.time_clock_sessions ADD COLUMN IF NOT EXISTS service_area_job_id uuid;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'time_entries_service_area_job_fkey') THEN
    ALTER TABLE public.time_entries
      ADD CONSTRAINT time_entries_service_area_job_fkey
      FOREIGN KEY (service_area_job_id) REFERENCES public.service_area_jobs(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tcs_service_area_job_fkey') THEN
    ALTER TABLE public.time_clock_sessions
      ADD CONSTRAINT tcs_service_area_job_fkey
      FOREIGN KEY (service_area_job_id) REFERENCES public.service_area_jobs(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_time_entries_sa_job ON public.time_entries (service_area_job_id);
CREATE INDEX IF NOT EXISTS idx_tcs_sa_job          ON public.time_clock_sessions (service_area_job_id);

DO $$
BEGIN
  RAISE NOTICE 'Migration 0064: service_areas + service_area_jobs + service_area_materials + hour links created (idempotent)';
END $$;

COMMIT;
