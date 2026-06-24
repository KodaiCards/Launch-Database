-- Migration 0065: Routes + expected/completed materials + per-unit tracking + finalize/cost hooks
--
-- Extends the 0064 keystone with the structure locked during the workspace-mockup
-- design (2026-06-24). ADDITIVE + idempotent only — new tables, nullable columns,
-- widened CHECKs. Touches nothing in the legacy projects tree.
--
-- What this reserves (behavior is built later in routes/service_areas.js + the map sync):
--   service_area_routes              — OPTIONAL subdivision of a service area (own map + status)
--   service_area_jobs.route_id       — a job can belong to a route (NULL = area-level)
--   service_area_jobs.cost_category  — engineering vs construction, tagged BY DISCIPLINE
--   service_area_materials.route_id / completed_quantity / map_feature_ref
--   service_area_material_units      — per-unit status + installed_date (from the map)
--   service_area_job_assignments     — explicit multi-assignment ("Various") hook
--   *.build_finalized_at             — finalize the build (per route; area-level for no-route areas)
--   service_areas.client_visible_metrics — which summary tiles show in the client portal
--   *.map_geometry                   — plot hook for the per-area + client-aggregate maps
--
-- Cost model (locked): Engineering cost = engineering-discipline jobs (what LFS bills).
-- Construction cost = construction-discipline jobs (labor) + installed materials —
-- labor and materials stay SEPARATE line items but roll into one Construction tile.

BEGIN;

-- ─── service_area_routes (new; OPTIONAL level) ──────────────────────────────
-- A service area MAY have routes (physical fiber paths). Each route carries its
-- own map + status + finalize state. Areas with no routes attach jobs/materials
-- directly (route_id NULL) and finalize at the area level.

CREATE TABLE IF NOT EXISTS public.service_area_routes (
  id                  uuid NOT NULL DEFAULT gen_random_uuid(),
  service_area_id     uuid NOT NULL REFERENCES public.service_areas(id) ON DELETE CASCADE,
  name                text NOT NULL,
  status              varchar(30) NOT NULL DEFAULT 'active',
  sort_order          integer NOT NULL DEFAULT 0,
  map_file_path       text,
  map_filename        text,
  map_geometry        jsonb,                 -- plot hook (filled when the map integration lands)
  build_finalized_at  timestamptz,           -- non-null = build finalized (status → complete)
  notes               text,
  client_visible      boolean NOT NULL DEFAULT false,
  created_by_user_id  uuid REFERENCES public.users(id) ON DELETE SET NULL,
  updated_by_user_id  uuid REFERENCES public.users(id) ON DELETE SET NULL,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT service_area_routes_pkey PRIMARY KEY (id),
  CONSTRAINT service_area_routes_status_check
    CHECK (status IN ('active','on_hold','complete','cancelled'))
);

CREATE INDEX IF NOT EXISTS idx_sa_routes_service_area ON public.service_area_routes (service_area_id);

-- ─── service_areas: finalize + client tile visibility + plot hook ───────────

ALTER TABLE public.service_areas ADD COLUMN IF NOT EXISTS build_finalized_at timestamptz;
ALTER TABLE public.service_areas ADD COLUMN IF NOT EXISTS map_geometry       jsonb;
ALTER TABLE public.service_areas ADD COLUMN IF NOT EXISTS client_visible_metrics jsonb
  NOT NULL DEFAULT '{"progress":true,"engineering_cost":true,"construction_cost":false,"total_cost":true}'::jsonb;

-- ─── service_area_jobs: route + cost category ───────────────────────────────
-- cost_category is set by the write-path from the job's discipline:
--   construction discipline → 'construction';  permitting/design/inspection → 'engineering'.

ALTER TABLE public.service_area_jobs ADD COLUMN IF NOT EXISTS route_id      uuid;
ALTER TABLE public.service_area_jobs ADD COLUMN IF NOT EXISTS cost_category varchar(20);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'service_area_jobs_route_fkey') THEN
    ALTER TABLE public.service_area_jobs
      ADD CONSTRAINT service_area_jobs_route_fkey
      FOREIGN KEY (route_id) REFERENCES public.service_area_routes(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'service_area_jobs_cost_category_check') THEN
    ALTER TABLE public.service_area_jobs
      ADD CONSTRAINT service_area_jobs_cost_category_check
      CHECK (cost_category IS NULL OR cost_category IN ('engineering','construction'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_sa_jobs_route     ON public.service_area_jobs (route_id);
CREATE INDEX IF NOT EXISTS idx_sa_jobs_cost_cat  ON public.service_area_jobs (cost_category);

-- ─── service_area_job_assignments (new; multi-assignment "Various" hook) ─────
-- Optional explicit assignment of several people to one job. Per-person HOURS +
-- amounts in the UI come from time_entries grouped by staff; this table records
-- planned assignment when more than the single assigned_staff_id is needed.

CREATE TABLE IF NOT EXISTS public.service_area_job_assignments (
  id                   uuid NOT NULL DEFAULT gen_random_uuid(),
  service_area_job_id  uuid NOT NULL REFERENCES public.service_area_jobs(id) ON DELETE CASCADE,
  staff_id             uuid REFERENCES public.staff(id) ON DELETE CASCADE,
  user_id              uuid REFERENCES public.users(id) ON DELETE SET NULL,
  role                 varchar(40),
  created_at           timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT service_area_job_assignments_pkey PRIMARY KEY (id),
  CONSTRAINT sa_job_assign_unique UNIQUE (service_area_job_id, staff_id)
);

CREATE INDEX IF NOT EXISTS idx_sa_job_assign_job   ON public.service_area_job_assignments (service_area_job_id);
CREATE INDEX IF NOT EXISTS idx_sa_job_assign_staff ON public.service_area_job_assignments (staff_id);

-- ─── service_area_materials: route + expected/completed + map ref ───────────
-- 0064 already gave us item / quantity / unit / unit_cost / source / notes.
-- Here: quantity stays the EXPECTED qty; completed_quantity tracks installed.
-- Materials are construction-cost MATERIALS (kept separate from construction LABOR).

ALTER TABLE public.service_area_materials ADD COLUMN IF NOT EXISTS route_id           uuid;
ALTER TABLE public.service_area_materials ADD COLUMN IF NOT EXISTS completed_quantity numeric(14,3) NOT NULL DEFAULT 0;
ALTER TABLE public.service_area_materials ADD COLUMN IF NOT EXISTS map_feature_ref    text;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'service_area_materials_route_fkey') THEN
    ALTER TABLE public.service_area_materials
      ADD CONSTRAINT service_area_materials_route_fkey
      FOREIGN KEY (route_id) REFERENCES public.service_area_routes(id) ON DELETE SET NULL;
  END IF;
END $$;

-- widen source to include map-sourced rows (0064 allowed only 'manual','bom_csv')
ALTER TABLE public.service_area_materials DROP CONSTRAINT IF EXISTS service_area_materials_source_check;
ALTER TABLE public.service_area_materials
  ADD CONSTRAINT service_area_materials_source_check CHECK (source IN ('manual','bom_csv','map'));

CREATE INDEX IF NOT EXISTS idx_sa_materials_route ON public.service_area_materials (route_id);

-- ─── service_area_material_units (new; per-unit status + install date) ──────
-- Discrete items (splice closures, pedestals, handholes) get one row per unit so
-- the materials row can expand to per-unit status + installed_date pulled from the
-- map. Footage/bulk materials skip units and track via completed_quantity.

CREATE TABLE IF NOT EXISTS public.service_area_material_units (
  id              uuid NOT NULL DEFAULT gen_random_uuid(),
  material_id     uuid NOT NULL REFERENCES public.service_area_materials(id) ON DELETE CASCADE,
  label           text,
  sequence        integer,
  status          varchar(20) NOT NULL DEFAULT 'pending',
  installed_date  date,
  map_feature_ref text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT service_area_material_units_pkey PRIMARY KEY (id),
  CONSTRAINT sa_material_units_status_check CHECK (status IN ('pending','installed','removed'))
);

CREATE INDEX IF NOT EXISTS idx_sa_material_units_material ON public.service_area_material_units (material_id);

DO $$
BEGIN
  RAISE NOTICE 'Migration 0065: routes + expected/completed materials + per-unit + finalize/cost hooks (idempotent)';
END $$;

COMMIT;
