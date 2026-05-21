-- Migration 0038: CSV review queue
-- Holds unmatched rows from CSV imports so admins can manually triage them
-- instead of silently skipping. Rows persisted here are not yet time_entries.

CREATE TABLE IF NOT EXISTS csv_review_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  imported_at timestamp with time zone NOT NULL DEFAULT now(),
  imported_by_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  csv_filename text,
  raw_row jsonb NOT NULL,
  match_attempts jsonb NOT NULL,
  suggested_project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  status varchar(20) NOT NULL DEFAULT 'pending',
  matched_project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  resolved_at timestamp with time zone,
  resolved_by_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  notes text,
  CONSTRAINT csv_review_queue_status_check CHECK (status IN ('pending', 'matched', 'discarded'))
);

CREATE INDEX IF NOT EXISTS csv_review_queue_status_idx
  ON csv_review_queue (status, imported_at DESC);
