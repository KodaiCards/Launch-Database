-- Migration 0082: unified training assessment attempts (the assessment engine).
--
-- Planning approval 2026-07-01 (thread + decisions): server-authoritative
-- assessment engine. Question POOLS live in the repo (content/training/
-- assessment-pools/); the server draws a random subset PER ATTEMPT, strips the
-- answer keys, and grades server-side. This table is the durable ATTEMPT RECORD:
-- it stores the drawn question ids + the learner's answers + the derived score,
-- so grading is reproducible and the I11 dashboard can replay exactly.
--
-- ONE unified table for both lesson tests and the NEW per-topic final quiz
-- (Q3 ruling). Cert path (training_cert_attempts) + the legacy per-topic
-- capstone (training_topic_capstone_attempts) are left INTACT this wave.
--
-- Launch dial (Carter 2026-07-01, tunable per-file / D013): lesson = draw 4 of 8;
-- topic_final = draw 15 of ~22. Those counts live in the pool files, not here.
--
-- ADDITIVE + idempotent. NOTE (backup gate, Planning): this migration must NOT
-- deploy until Carter confirms DB backups are on — apply to the dev DB for
-- build/verify only; production apply is gated.

CREATE TABLE IF NOT EXISTS public.training_assessment_attempts (
    id              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id         uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    assessment_id   text NOT NULL,
    kind            text NOT NULL,
    course_id       text NOT NULL,
    lesson_id       text,
    drawn_question_ids jsonb NOT NULL,     -- ordered ids drawn for this attempt
    answers         jsonb,                  -- { questionId: value } — null until submit
    score           smallint,               -- 0–100, derived server-side at submit
    total_items     smallint,
    correct_items   smallint,
    passed          boolean,
    status          text NOT NULL DEFAULT 'open',  -- 'open' (drawn) | 'submitted'
    duration_seconds integer,               -- open→submit, page-visibility-paused (I11)
    started_at      timestamp with time zone NOT NULL DEFAULT now(),
    submitted_at    timestamp with time zone,
    CONSTRAINT training_assessment_attempts_kind_check
        CHECK (kind = ANY (ARRAY['lesson'::text, 'topic_final'::text])),
    CONSTRAINT training_assessment_attempts_status_check
        CHECK (status = ANY (ARRAY['open'::text, 'submitted'::text])),
    CONSTRAINT training_assessment_attempts_score_check
        CHECK (score IS NULL OR (score >= 0 AND score <= 100))
);

-- Learner's own history + the I11 dashboard read path (per user, newest first).
CREATE INDEX IF NOT EXISTS idx_training_assessment_attempts_user_date
    ON public.training_assessment_attempts USING btree (user_id, submitted_at DESC);

-- Admin analytics + per-assessment rollups.
CREATE INDEX IF NOT EXISTS idx_training_assessment_attempts_assessment
    ON public.training_assessment_attempts USING btree (assessment_id, submitted_at DESC);
