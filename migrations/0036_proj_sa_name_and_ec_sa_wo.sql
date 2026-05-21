-- 0036_proj_sa_name_and_ec_sa_wo.sql
-- Persist free-text service area name on non-EC projects + 1:1 WO# per EC service area

BEGIN;

-- Non-EC project SA persistence (free-text SA name stored on project row)
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS service_area_name TEXT;

-- 1:1 WO# per EC service area (each SA carries its own WO#; replaces N:N from ec_work_orders)
ALTER TABLE ec_service_areas
  ADD COLUMN IF NOT EXISTS work_order_number TEXT;

COMMIT;
