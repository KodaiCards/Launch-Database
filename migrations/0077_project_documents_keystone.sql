-- Migration 0077: keystone project documents.
--
-- Projects-tab Phase C (docs/projects_tab_design.md): documents live on the
-- project (a service_area_job, engineering disciplines only). We reuse the
-- existing, security-hardened permit_documents table + upload pipeline rather
-- than build a new store. Three additive changes:
--
--   1. service_area_job_id — the keystone link (legacy project_id stays for the
--      old admin tabs; keystone docs key off this column instead).
--   2. file_size → bigint — DWG deliverables can be large (2 GB cap); the old
--      integer column overflows just above 2.0 GB.
--   3. status — a free-text status tag (Draft / Submitted / In Review /
--      Approved / Final), nullable. doc_type already carries the kind
--      (Final DWG / Final PDF / Permit Application / …).
--
-- ADDITIVE + idempotent.

ALTER TABLE permit_documents ADD COLUMN IF NOT EXISTS service_area_job_id uuid;
ALTER TABLE permit_documents ALTER COLUMN file_size TYPE bigint;
ALTER TABLE permit_documents ADD COLUMN IF NOT EXISTS status varchar(30);

CREATE INDEX IF NOT EXISTS idx_permit_documents_saj
  ON permit_documents (service_area_job_id);
