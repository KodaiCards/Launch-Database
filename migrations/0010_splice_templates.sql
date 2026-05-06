-- 0010_splice_templates.sql
--
-- Splice Matrix Phase 2B #5 — closure templates + project clone.
--
-- Owner spec from PROJECT_NORTH_STAR §6.B / SPLICE_BUILD_PLAN.md:
--   "designers splice 144→144 straight-through 80% of the time.
--    Templates shave an hour per project. OZmap and netTerrain do
--    this well; VETRO and 3-GIS poorly."
--
-- Closure templates store the closure shell (model name, tray count,
-- tray capacity) plus an optional default splice pattern in JSONB.
-- "Apply template" on the canvas materializes a real closure +
-- trays + (optionally) splices in one shot.
--
-- scope_client_id NULL → global template visible across all clients.
-- scope_client_id set → only shows on closures created under that
-- client's projects. Lets a designer save "Verizon's standard
-- 12-position closure" without polluting the picklist on PSC work.
--
-- Project clone is purely server-side and doesn't need its own table —
-- it deep-copies every row under a source splice_project (locations,
-- cables, tubes, fibers, closures, trays, splices, ribbon_groups,
-- strand_states) into a new splice_project. The clone endpoint lives
-- in routes/splice.js.

CREATE TABLE IF NOT EXISTS splice_closure_templates (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                  VARCHAR(120) NOT NULL,
  -- Nullable: NULL means the template is global / cross-client.
  -- soft-link to clients(id) so deleting a client doesn't kill the
  -- template (it just becomes global).
  scope_client_id       UUID REFERENCES clients(id) ON DELETE SET NULL,
  -- Closure shell. Mirrors splice_closures(model, tray_count,
  -- tray_capacity) so applying a template is a 1:1 INSERT.
  model                 VARCHAR(120),
  tray_count            INTEGER NOT NULL DEFAULT 6 CHECK (tray_count > 0),
  tray_capacity         INTEGER NOT NULL DEFAULT 12 CHECK (tray_capacity > 0),
  -- Optional pre-configured splice pattern. Shape:
  --   [{ tray_position, ribbon_groups: [{ count: 12 }],
  --      single_splices: [{ a_tube_index, a_fiber_index, b_tube_index,
  --                         b_fiber_index, splice_type }] }, ...]
  -- The application path resolves these against the cables present at
  -- the closure's location at apply time, so a template can encode
  -- "ribbon 1 of cable A → ribbon 1 of cable B, mass-fusion" in a
  -- way that's reusable across different concrete projects.
  default_splices_jsonb JSONB,
  notes                 TEXT,
  -- Soft attribution. Doesn't gate access — any logged-in designer
  -- can use any template; the field is for "who saved this so I can
  -- ask them about edge cases" UX.
  created_by_staff_id   UUID REFERENCES staff(id) ON DELETE SET NULL,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_splice_closure_templates_scope
  ON splice_closure_templates(scope_client_id);
CREATE INDEX IF NOT EXISTS idx_splice_closure_templates_model
  ON splice_closure_templates(model);
