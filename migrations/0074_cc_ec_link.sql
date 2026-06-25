-- Migration 0074: a construction contract belongs to an engineering contract.
--
-- Projects-tab IA (docs/projects_tab_design.md): the tree is
-- Client → EC → CC → SA → Route → project, so a CC nests under its EC.
-- Nullable (a CC can still exist without an EC for non-RUS construction; the
-- tree then sits it directly under the client). ADDITIVE + idempotent.

ALTER TABLE construction_contracts ADD COLUMN IF NOT EXISTS engineering_contract_id uuid REFERENCES engineering_contracts(id);
CREATE INDEX IF NOT EXISTS idx_cc_ec ON construction_contracts (engineering_contract_id);
