-- 0031: Add EC-scoped Service Areas and Work Orders.
--
-- Why: Engineering contracts now carry their own lists of Service Areas
-- and Work Orders so the admin can define them once on the EC and have
-- project-create modals populate from those lists — instead of typing
-- free text every time or relying on the legacy concentrators table.
--
-- Design:
--   ec_service_areas  — one row per service area name under an EC.
--   ec_work_orders    — one row per WO number under an EC; optionally
--                       linked to a service area (many WOs → one SA).
--   ON DELETE CASCADE — deleting an EC cascades to both tables.
--   Unique per EC     — name/number must be unique within one EC, not
--                       globally (same name can appear under two ECs).
--
-- The existing concentrators table is untouched (legacy path).

CREATE TABLE IF NOT EXISTS ec_service_areas (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  engineering_contract_id uuid      NOT NULL
                                    REFERENCES engineering_contracts(id)
                                    ON DELETE CASCADE,
  name                  text        NOT NULL,
  notes                 text,
  created_at            timestamptz DEFAULT NOW(),
  UNIQUE (engineering_contract_id, name)
);

CREATE INDEX IF NOT EXISTS idx_ec_service_areas_ec
  ON ec_service_areas (engineering_contract_id);

CREATE TABLE IF NOT EXISTS ec_work_orders (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  engineering_contract_id uuid      NOT NULL
                                    REFERENCES engineering_contracts(id)
                                    ON DELETE CASCADE,
  service_area_id       uuid        REFERENCES ec_service_areas(id)
                                    ON DELETE SET NULL,
  number                text        NOT NULL,
  description           text,
  created_at            timestamptz DEFAULT NOW(),
  UNIQUE (engineering_contract_id, number)
);

CREATE INDEX IF NOT EXISTS idx_ec_work_orders_ec
  ON ec_work_orders (engineering_contract_id);

CREATE INDEX IF NOT EXISTS idx_ec_work_orders_sa
  ON ec_work_orders (service_area_id);
