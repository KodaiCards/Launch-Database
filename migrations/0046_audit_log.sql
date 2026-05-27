-- System-wide audit log for compliance + RUS recordkeeping.
-- Distinct from time_entry_audit (which only covers time-entry mutations).

CREATE TABLE IF NOT EXISTS public.audit_log (
  id              bigserial PRIMARY KEY,
  at              timestamptz NOT NULL DEFAULT now(),
  actor_user_id   uuid REFERENCES public.users(id) ON DELETE SET NULL,
  actor_username  text,
  actor_type      text NOT NULL DEFAULT 'user',  -- 'user' | 'client_user' | 'system' | 'ai'
  action          text NOT NULL,                 -- 'create' | 'update' | 'delete' | 'void' | 'generate' | 'grant' | 'revoke' | 'execute' | 'publish' | ...
  entity_type     text NOT NULL,                 -- 'project' | 'invoice' | 'engineering_contract' | 'user' | 'portal_access' | 'permit' | 'splice_project' | 'design_import' | 'ai_tool' | etc.
  entity_id       text,                          -- uuid or composite key; nullable for some actions
  before_data     jsonb,
  after_data      jsonb,
  source          text,                          -- 'api' | 'admin_ui' | 'csv' | 'ai_assistant' | 'splice_field' | etc.
  ip              text,
  user_agent      text,
  meta            jsonb                          -- free-form for action-specific context
);

CREATE INDEX IF NOT EXISTS idx_audit_log_at         ON public.audit_log(at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_actor      ON public.audit_log(actor_user_id, at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_entity     ON public.audit_log(entity_type, entity_id, at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_action     ON public.audit_log(action, at DESC);

-- Tamper resistance: prevent DELETE on audit_log rows.
-- Retention cleanup MUST bypass this trigger via SET LOCAL session_replication_role='replica';
-- normal app code (and even admin users via psql) cannot delete.
CREATE OR REPLACE FUNCTION public.prevent_audit_delete() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'audit_log rows cannot be deleted (compliance + tamper-resistance)';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_audit_log_no_delete ON public.audit_log;
CREATE TRIGGER trg_audit_log_no_delete
  BEFORE DELETE ON public.audit_log
  FOR EACH ROW EXECUTE FUNCTION public.prevent_audit_delete();
