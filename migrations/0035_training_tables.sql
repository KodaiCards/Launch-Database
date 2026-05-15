-- Migration 0035: Training progress + cert attempt tables for OSP-RW.2
--
-- Three tables:
--   training_progress            — per-user, per-lesson completion state
--   training_cert_attempts       — per-user cert mock exam attempts
--   training_topic_capstone_attempts — per-user per-topic capstone quiz attempts
--
-- Design notes:
--   * users.id is UUID (from bootstrapAuthSchema). All FK references use UUID.
--   * training_progress PRIMARY KEY (user_id, lesson_id) — one row per user-lesson.
--   * No COALESCE / expressions in inline UNIQUE(...) — unique constraints that
--     need function calls use separate CREATE UNIQUE INDEX (Migration 0032 lesson).
--   * No %% in RAISE NOTICE strings — use single % (Migration 0023 lesson).
--   * Multi-statement migration wrapped in BEGIN / COMMIT.

BEGIN;

-- ─── training_progress ───────────────────────────────────────────────────────
-- Tracks a user's progress through each lesson.
-- course_id: topic identifier  e.g. 'T02', 'C01'
-- lesson_id: lesson identifier e.g. 'T02.L05'  (unique within a course)
-- Primary key on (user_id, lesson_id) — one row per user per lesson.
-- Index on (user_id, course_id) supports the course-view aggregate query
-- that computes per-course completion percentages for the splash tile.

CREATE TABLE IF NOT EXISTS training_progress (
  user_id        UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id      TEXT        NOT NULL,
  lesson_id      TEXT        NOT NULL,
  status         TEXT        NOT NULL DEFAULT 'not_started'
                             CHECK (status IN ('not_started', 'in_progress', 'completed')),
  completion_pct SMALLINT    NOT NULL DEFAULT 0
                             CHECK (completion_pct BETWEEN 0 AND 100),
  best_score     SMALLINT    CHECK (best_score BETWEEN 0 AND 100),
  attempts       INT         NOT NULL DEFAULT 0,
  started_at     TIMESTAMPTZ,
  completed_at   TIMESTAMPTZ,
  last_seen_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_training_progress_user_course
  ON training_progress (user_id, course_id);

-- ─── training_cert_attempts ──────────────────────────────────────────────────
-- Records each mock certification exam attempt.
-- cert_track: one of the supported cert identifiers.
-- domain_scores: JSONB breakdown per domain (flexible, no FK required).

CREATE TABLE IF NOT EXISTS training_cert_attempts (
  id                 SERIAL      PRIMARY KEY,
  user_id            UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cert_track         TEXT        NOT NULL
                                 CHECK (cert_track IN ('OSP-Designer','RCDD','CFOT','CFOS-O')),
  attempt_date       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  score              SMALLINT    NOT NULL CHECK (score BETWEEN 0 AND 100),
  passed             BOOLEAN     NOT NULL,
  time_taken_seconds INT,
  domain_scores      JSONB,
  total_items        INT         NOT NULL,
  correct_items      INT         NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_training_cert_attempts_user_date
  ON training_cert_attempts (user_id, attempt_date DESC);

-- ─── training_topic_capstone_attempts ────────────────────────────────────────
-- Records per-topic capstone quiz attempts (end-of-course assessment).
-- course_id: topic identifier  e.g. 'T02'

CREATE TABLE IF NOT EXISTS training_topic_capstone_attempts (
  id            SERIAL      PRIMARY KEY,
  user_id       UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id     TEXT        NOT NULL,
  attempt_date  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  score         SMALLINT    NOT NULL CHECK (score BETWEEN 0 AND 100),
  passed        BOOLEAN     NOT NULL,
  total_items   INT         NOT NULL,
  correct_items INT         NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_training_capstone_user_course_date
  ON training_topic_capstone_attempts (user_id, course_id, attempt_date DESC);

COMMIT;
