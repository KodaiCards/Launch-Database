-- migrations/0001_splice_schema.sql — Splice Matrix Tool, Phase 1 schema.
--
-- Standalone OSP fiber splice planning. NO foreign keys to the existing
-- projects / contracts / billing tables — this tool is a separate world.
-- Soft link to staff(id) only, for designer attribution.
--
-- Phase 1 covers: projects, locations (splice points), cables, buffer
-- tubes, fibers, closures, trays, splices, ribbon mass-fusion groups.
-- Other location types (CO, FDH, terminal, ring_cut) are in the CHECK
-- enum already so Phase 2 doesn't need a migration to use them.

CREATE TABLE IF NOT EXISTS splice_projects (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(200) NOT NULL,
  designer_id     UUID REFERENCES staff(id) ON DELETE SET NULL,
  status          VARCHAR(20) NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active','completed','archived')),
  notes           TEXT,
  -- Soft lock so two designers don't clobber each other. Cleared on
  -- explicit release or after a stale-lock timeout (enforced at the
  -- application layer, not here).
  locked_by_staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
  locked_by_name  VARCHAR(120),
  locked_at       TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_splice_projects_designer ON splice_projects(designer_id);
CREATE INDEX IF NOT EXISTS idx_splice_projects_status   ON splice_projects(status);

-- Locations on the splice project. Phase 1 only uses 'splice_point'; the
-- other types are reserved enum values for Phase 2 (topology).
CREATE TABLE IF NOT EXISTS splice_locations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      UUID NOT NULL REFERENCES splice_projects(id) ON DELETE CASCADE,
  type            VARCHAR(20) NOT NULL
                    CHECK (type IN ('co','splice_point','fdh','terminal','ring_cut')),
  name            VARCHAR(120) NOT NULL,
  sequence_index  INTEGER NOT NULL DEFAULT 0,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_splice_locations_project ON splice_locations(project_id);

-- Cables. Phase 1: a cable belongs to a project and may optionally be
-- routed between two locations. fiber_count restricted to OSP-typical
-- counts; ribbon construction implies fibers are grouped 12-per-tube.
CREATE TABLE IF NOT EXISTS splice_cables (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id         UUID NOT NULL REFERENCES splice_projects(id) ON DELETE CASCADE,
  name               VARCHAR(120) NOT NULL,
  fiber_count        INTEGER NOT NULL
                       CHECK (fiber_count IN (12,24,48,96,144,288,432,864)),
  construction_type  VARCHAR(20) NOT NULL
                       CHECK (construction_type IN ('ribbon','loose_tube')),
  from_location_id   UUID REFERENCES splice_locations(id) ON DELETE SET NULL,
  to_location_id     UUID REFERENCES splice_locations(id) ON DELETE SET NULL,
  manufacturer_part  VARCHAR(120),
  notes              TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_splice_cables_project ON splice_cables(project_id);

-- Buffer tubes (loose-tube) or ribbons (ribbon construction). Either
-- way, a cable with N fibers has N/12 of these objects, each grouping
-- 12 fibers and ordered by TIA-598 color sequence.
CREATE TABLE IF NOT EXISTS splice_buffer_tubes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cable_id    UUID NOT NULL REFERENCES splice_cables(id) ON DELETE CASCADE,
  position    INTEGER NOT NULL,                        -- 1..N within cable
  color       VARCHAR(20) NOT NULL,                    -- blue, orange, green, ...
  UNIQUE (cable_id, position)
);

CREATE INDEX IF NOT EXISTS idx_splice_buffer_tubes_cable ON splice_buffer_tubes(cable_id);

-- Individual fibers. 12 per buffer tube, in TIA-598 order.
CREATE TABLE IF NOT EXISTS splice_fibers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buffer_tube_id  UUID NOT NULL REFERENCES splice_buffer_tubes(id) ON DELETE CASCADE,
  position        INTEGER NOT NULL CHECK (position BETWEEN 1 AND 12),
  color           VARCHAR(20) NOT NULL,
  UNIQUE (buffer_tube_id, position)
);

CREATE INDEX IF NOT EXISTS idx_splice_fibers_tube ON splice_fibers(buffer_tube_id);

-- Splice closure at a location. tray_count and tray_capacity are tracked
-- so the UI can warn on over-capacity. model is free-form; the
-- splice_closure_models table below remembers every used model name so
-- later projects get a picklist that grew organically.
CREATE TABLE IF NOT EXISTS splice_closures (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id    UUID NOT NULL REFERENCES splice_locations(id) ON DELETE CASCADE,
  model          VARCHAR(120),
  tray_count     INTEGER NOT NULL DEFAULT 6 CHECK (tray_count > 0),
  tray_capacity  INTEGER NOT NULL DEFAULT 12 CHECK (tray_capacity > 0),
  notes          TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_splice_closures_location ON splice_closures(location_id);

CREATE TABLE IF NOT EXISTS splice_trays (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  closure_id   UUID NOT NULL REFERENCES splice_closures(id) ON DELETE CASCADE,
  position     INTEGER NOT NULL,
  UNIQUE (closure_id, position)
);

CREATE INDEX IF NOT EXISTS idx_splice_trays_closure ON splice_trays(closure_id);

-- Ribbon mass-fusion groups: when a designer drags a 12-fiber ribbon
-- onto another 12-fiber ribbon, we create 12 individual splice rows
-- AND group them under one splice_ribbon_group so the UI and the PDF
-- can render them as a single ribbon-to-ribbon line instead of 12.
CREATE TABLE IF NOT EXISTS splice_ribbon_groups (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tray_id     UUID NOT NULL REFERENCES splice_trays(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Splices: fiber A connected to fiber B, housed in a tray.
-- A fiber has two ends (one per side of the cable), so it can appear in
-- at most two splice rows — once on each end. We don't enforce that at
-- the constraint level for Phase 1 because expressing "appears at most
-- twice across both fiber_a and fiber_b columns" is awkward in SQL;
-- the route layer enforces it at write time and the read endpoint
-- surfaces violations as warnings.
CREATE TABLE IF NOT EXISTS splices (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tray_id           UUID NOT NULL REFERENCES splice_trays(id) ON DELETE CASCADE,
  fiber_a_id        UUID NOT NULL REFERENCES splice_fibers(id) ON DELETE CASCADE,
  fiber_b_id        UUID NOT NULL REFERENCES splice_fibers(id) ON DELETE CASCADE,
  splice_type       VARCHAR(20) NOT NULL DEFAULT 'fusion'
                      CHECK (splice_type IN ('fusion','mechanical')),
  ribbon_group_id   UUID REFERENCES splice_ribbon_groups(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT splice_no_self CHECK (fiber_a_id <> fiber_b_id)
);

CREATE INDEX IF NOT EXISTS idx_splices_tray         ON splices(tray_id);
CREATE INDEX IF NOT EXISTS idx_splices_fiber_a      ON splices(fiber_a_id);
CREATE INDEX IF NOT EXISTS idx_splices_fiber_b      ON splices(fiber_b_id);
CREATE INDEX IF NOT EXISTS idx_splices_ribbon_group ON splices(ribbon_group_id);

-- Used closure models. Owner explicitly said he doesn't have a list of
-- models — so instead of seeding one, every model name a designer types
-- is captured here with a use_count, and future picker dropdowns are
-- populated from this table. List grows organically.
CREATE TABLE IF NOT EXISTS splice_closure_models (
  model                  VARCHAR(120) PRIMARY KEY,
  default_tray_count     INTEGER NOT NULL DEFAULT 6,
  default_tray_capacity  INTEGER NOT NULL DEFAULT 12,
  use_count              INTEGER NOT NULL DEFAULT 1,
  last_used_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
