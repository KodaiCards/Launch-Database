-- Migration 0050: Drop audit_log tamper-resistance trigger
--
-- Wave 51 revision: audit_log rows must be fully malleable by admins.
-- Removes the BEFORE DELETE trigger that previously prevented deletion.
-- Idempotent: safe to run on both fresh DBs and existing installations.

DROP TRIGGER IF EXISTS trg_audit_log_no_delete ON audit_log;
DROP FUNCTION IF EXISTS prevent_audit_delete();
