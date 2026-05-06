-- Phase 4.5 — threaded comments anchored to closures + splices.
-- Pattern: GitHub PR comments adapted for splice review cycles.
-- target_table is the table the comment lives on; target_id is the row id.
-- parent_comment_id NULL means a top-level thread; non-null means a reply.
-- resolved_at + resolved_by_user_id mark a thread as closed by the
-- engineer who acted on it.
CREATE TABLE IF NOT EXISTS splice_comments (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id            UUID NOT NULL REFERENCES splice_projects(id) ON DELETE CASCADE,
  -- 'splice_closures' | 'splices' (Phase 4.5 ships these two; future
  -- phases may add 'splice_cables' or 'splice_locations').
  target_table          VARCHAR(40) NOT NULL,
  target_id             UUID NOT NULL,
  body                  TEXT NOT NULL,
  created_by_user_id    UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at           TIMESTAMPTZ,
  resolved_by_user_id   UUID REFERENCES users(id) ON DELETE SET NULL,
  parent_comment_id     UUID REFERENCES splice_comments(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_splice_comments_target
  ON splice_comments(target_table, target_id);
CREATE INDEX IF NOT EXISTS idx_splice_comments_project
  ON splice_comments(project_id, created_at DESC);
