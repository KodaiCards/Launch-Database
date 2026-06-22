-- Migration 0063: Observability event_log table + event_retention_config
--
-- Telemetry table for client + server event logging. Distinct from
-- audit_log (compliance + tamper-resistant). event_log rows are hard-
-- deleted by a scheduled prune job (retention default: 30 days).
--
-- Idempotent: safe to re-run.

BEGIN;

-- ─── event_log ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.event_log (
  id              bigserial NOT NULL,
  occurred_at     timestamptz NOT NULL DEFAULT now(),
  program         text NOT NULL,
  event_type      text NOT NULL,
  source          text NOT NULL DEFAULT 'client',
  actor_user_id   uuid REFERENCES public.users(id) ON DELETE SET NULL,
  actor_username  text,
  actor_type      text NOT NULL DEFAULT 'user',
  session_id      text,
  request_id      text,
  target          text,
  url             text,
  http_method     text,
  http_status     integer,
  duration_ms     integer,
  message         text,
  ip              text,
  user_agent      text,
  meta            jsonb,
  CONSTRAINT event_log_pkey PRIMARY KEY (id)
);

-- Primary time-descending index for dashboard queries
CREATE INDEX IF NOT EXISTS idx_event_log_occurred_at
  ON public.event_log (occurred_at DESC);

-- Per-portal time-series queries
CREATE INDEX IF NOT EXISTS idx_event_log_program
  ON public.event_log (program, occurred_at DESC);

-- Per-user history queries
CREATE INDEX IF NOT EXISTS idx_event_log_actor
  ON public.event_log (actor_user_id, occurred_at DESC);

-- Event-type filtering (click, api_call, js_error, etc.)
CREATE INDEX IF NOT EXISTS idx_event_log_event_type
  ON public.event_log (event_type, occurred_at DESC);

-- Correlation: link client api_call to its server http_request
CREATE INDEX IF NOT EXISTS idx_event_log_request_id
  ON public.event_log (request_id)
  WHERE request_id IS NOT NULL;

-- Fast error-class dashboard queries (partial — only the error types)
CREATE INDEX IF NOT EXISTS idx_event_log_errors
  ON public.event_log (occurred_at DESC)
  WHERE event_type IN ('js_error', 'api_error', 'promise_rejection', 'login_failed');

-- ─── event_retention_config ──────────────────────────────────────────────────
--
-- Singleton (id must = 1) mirroring audit_retention_config structure.
-- Tracks prune policy + last-run state. Prune job hard-deletes rows older
-- than retention_days (unlike audit_log which soft-archives only).

CREATE TABLE IF NOT EXISTS public.event_retention_config (
  id                     integer NOT NULL PRIMARY KEY CHECK (id = 1),
  retention_days         integer NOT NULL DEFAULT 30,
  last_prune_run_at      timestamptz,
  last_prune_row_count   integer,
  updated_at             timestamptz NOT NULL DEFAULT now()
);

-- Seed default config row; no-op if already present
INSERT INTO public.event_retention_config (id, retention_days)
  VALUES (1, 30)
  ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
  RAISE NOTICE 'Migration 0063: event_log table and event_retention_config created (idempotent)';
END $$;

COMMIT;
