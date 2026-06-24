-- Migration 0069: Map integration POC — construction contracts + cost catalog +
-- DB-backed map storage.
--
-- Proves the chain Carter described: the map reports unit counts (13 handholes) →
-- reference the construction contract's uploaded unit list → price it (× $200) →
-- construction expected. ADDITIVE + idempotent.
--   construction_contracts — clean keystone CC entity (parallel to engineering_contracts).
--   cost_catalog          — per-CC unit prices (the uploaded Excel: item → $). item_key
--                           matches the map's ptype/cable code (handhole, pedestal, …).
--   map_store             — DB backend for the map's injectable window.storage (key→value),
--                           replacing localStorage so plans persist server-side.
--   service_areas.construction_contract_id / .miles — SA↔CC link + mileage (for the
--                           later hourly mileage allocation).

CREATE TABLE IF NOT EXISTS construction_contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id),
  name text NOT NULL,
  notes text,
  total_budget numeric(14,2),
  total_miles numeric(10,4),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cost_catalog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  construction_contract_id uuid NOT NULL REFERENCES construction_contracts(id) ON DELETE CASCADE,
  item_key text NOT NULL,                 -- map ptype / cable code, e.g. 'handhole'
  label text,
  unit text,
  unit_price numeric(14,2) NOT NULL DEFAULT 0,
  CONSTRAINT cost_catalog_uniq UNIQUE (construction_contract_id, item_key)
);

CREATE TABLE IF NOT EXISTS map_store (
  store_key text PRIMARY KEY,             -- the map's storage key (frm_pts_<plan>, …)
  value text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE service_areas ADD COLUMN IF NOT EXISTS construction_contract_id uuid REFERENCES construction_contracts(id);
ALTER TABLE service_areas ADD COLUMN IF NOT EXISTS miles numeric(10,4);
