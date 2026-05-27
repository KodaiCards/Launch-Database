-- Client portal v1 foundation per audit-output/future/client-portal-spec.md
-- + Carter 2026-05-27 locks:
--   - single role per client user (no role granularity in v1)
--   - no invoice surface in v1
--   - auto-visible projects (visibility wired in E4 via EC join)
--   - document retention: forever (manual purge per doc, managed in E5)
--   - client_documents + client_approvals deferred to E5 (write surface)

CREATE TABLE IF NOT EXISTS public.client_organizations (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  short_name    text,
  logo_url      text,
  theme_color   text,
  status        text NOT NULL DEFAULT 'active',
  created_at    timestamptz NOT NULL DEFAULT now(),
  created_by    uuid REFERENCES public.users(id) ON DELETE SET NULL,
  CONSTRAINT client_organizations_status_check CHECK (status IN ('active', 'suspended', 'archived'))
);

CREATE TABLE IF NOT EXISTS public.client_users (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        uuid NOT NULL REFERENCES public.client_organizations(id) ON DELETE CASCADE,
  email         text,
  name          text,
  is_primary    boolean NOT NULL DEFAULT false,
  status        text NOT NULL DEFAULT 'active',
  invited_by    uuid REFERENCES public.users(id) ON DELETE SET NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT client_users_status_check CHECK (status IN ('active', 'revoked'))
);

CREATE INDEX IF NOT EXISTS idx_client_users_org ON public.client_users(org_id);

CREATE TABLE IF NOT EXISTS public.client_tokens (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_user_id  uuid NOT NULL REFERENCES public.client_users(id) ON DELETE CASCADE,
  token_hash      text NOT NULL UNIQUE,
  last_used_at    timestamptz,
  expires_at      timestamptz,
  revoked_at      timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_client_tokens_user ON public.client_tokens(client_user_id);

-- Link engineering_contracts → client_organizations.
-- Existing ec.client text values (e.g. "PSC") are backfilled via admin UI
-- after orgs are created; no automatic backfill here.
ALTER TABLE public.engineering_contracts
  ADD COLUMN IF NOT EXISTS client_org_id uuid REFERENCES public.client_organizations(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_engineering_contracts_client_org
  ON public.engineering_contracts(client_org_id)
  WHERE client_org_id IS NOT NULL;
