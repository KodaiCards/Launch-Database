-- Migration 0055 — Fix project_photos.uploaded_by constraint contradiction
--
-- The column was defined as: uploaded_by uuid NOT NULL REFERENCES users(id) ON DELETE SET NULL
-- NOT NULL and ON DELETE SET NULL are mutually exclusive: if the referenced user is deleted
-- and the FK action sets the column to NULL, the NOT NULL constraint would cause the
-- DELETE to fail with a constraint violation.
--
-- Fix: drop the NOT NULL constraint so that ON DELETE SET NULL works as intended.
-- This preserves photo records when their uploader's account is deleted.
--
-- schema.sql already reflects the desired end state (uploaded_by is nullable there).
-- This migration brings existing installs into alignment.

BEGIN;

ALTER TABLE project_photos ALTER COLUMN uploaded_by DROP NOT NULL;

COMMIT;
