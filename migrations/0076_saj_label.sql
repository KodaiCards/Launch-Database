-- Migration 0076: optional human label for a project (service_area_job).
--
-- Projects-tab Phase B: the "New Project" modal has a Name field ("auto-generated
-- if blank"). A project = a permitting/design service_area_job; the only name it
-- had was the job-catalog name (often NULL for ad-hoc map-drawn projects), so the
-- tree fell back to "permitting job". This column stores a free-text label; when
-- blank on create we auto-generate "<Discipline> — <Service Area>" (override-able).
-- ADDITIVE + idempotent.

ALTER TABLE service_area_jobs ADD COLUMN IF NOT EXISTS label text;
