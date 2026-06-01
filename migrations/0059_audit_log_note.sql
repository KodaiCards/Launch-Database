-- Migration 0059: sequence-gap placeholder (no-op)
--
-- Background:
--   W205 added migration 0058 (invoices monthly-billing unique index re-assert).
--   W206 audit on invoice indexes concluded ALL needed indexes already existed
--   in migration 0045 (schema_integrity). No new migration was authored, so
--   the sequence skipped from 0058 → 0060 (W210 audit_log retention bump).
--
--   This placeholder fills the numbering gap so the migrations directory
--   reads as a contiguous sequence. Future agents grepping for "what does
--   0059 do?" land here and see the explanation instead of assuming a
--   missing/deleted migration.
--
-- Idempotent: SELECT 1 is a true no-op. Safe to apply on any database state.

SELECT 1;
