-- Migration 0071: contract "budget area" for the mileage allocation (loop 4/4).
--
-- Hourly jobs don't price off footage — they draw from the contract by mileage
-- (Carter): per_mile = remaining_$ (for a discipline) ÷ remaining_miles;
-- SA expected = SA.miles × per_mile. So a contract carries per-discipline budget
-- lines + total miles. Engineering budgets live on the EC, construction on the CC.
-- ADDITIVE + idempotent. (service_areas.miles came in 0069; construction_contracts
-- already has total_miles — add the same to engineering_contracts.)

ALTER TABLE engineering_contracts ADD COLUMN IF NOT EXISTS total_miles numeric(10,4);

CREATE TABLE IF NOT EXISTS contract_allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  engineering_contract_id  uuid REFERENCES engineering_contracts(id)  ON DELETE CASCADE,
  construction_contract_id uuid REFERENCES construction_contracts(id) ON DELETE CASCADE,
  discipline    text NOT NULL,                 -- inspection | permitting | design | construction
  budget_amount numeric(14,2) NOT NULL DEFAULT 0,
  CONSTRAINT contract_allocations_one_contract CHECK (
    (engineering_contract_id IS NOT NULL AND construction_contract_id IS NULL) OR
    (engineering_contract_id IS NULL AND construction_contract_id IS NOT NULL)
  )
);
CREATE UNIQUE INDEX IF NOT EXISTS contract_alloc_ec_disc ON contract_allocations (engineering_contract_id, discipline)  WHERE engineering_contract_id  IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS contract_alloc_cc_disc ON contract_allocations (construction_contract_id, discipline) WHERE construction_contract_id IS NOT NULL;
