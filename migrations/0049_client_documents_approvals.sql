-- Wave 49: Client portal write surface — documents + approvals
-- Adds read-write surfaces for client orgs to upload documents and respond to approval requests.
-- Storage uses existing UPLOAD_DIR infra (same as project_documents).

CREATE TABLE IF NOT EXISTS public.client_documents (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_org_id           uuid NOT NULL REFERENCES public.client_organizations(id) ON DELETE CASCADE,
  project_id              uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  filename                text NOT NULL,
  mime_type               text NOT NULL,
  size_bytes              bigint NOT NULL,
  storage_key             text NOT NULL,
  uploaded_by_user_id     uuid REFERENCES public.users(id) ON DELETE SET NULL,
  uploaded_by_client_user_id uuid REFERENCES public.client_users(id) ON DELETE SET NULL,
  direction               text NOT NULL DEFAULT 'to_client',
  status                  text NOT NULL DEFAULT 'active',
  notes                   text,
  created_at              timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT client_documents_direction_check CHECK (direction IN ('to_client', 'from_client')),
  CONSTRAINT client_documents_status_check CHECK (status IN ('active', 'archived')),
  CONSTRAINT client_documents_uploader_check CHECK (
    (uploaded_by_user_id IS NOT NULL AND uploaded_by_client_user_id IS NULL) OR
    (uploaded_by_user_id IS NULL AND uploaded_by_client_user_id IS NOT NULL) OR
    (uploaded_by_user_id IS NULL AND uploaded_by_client_user_id IS NULL)
  )
);

CREATE INDEX IF NOT EXISTS idx_client_documents_org ON public.client_documents(client_org_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_client_documents_project ON public.client_documents(project_id) WHERE project_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_client_documents_status ON public.client_documents(client_org_id, status);

CREATE TABLE IF NOT EXISTS public.client_approvals (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_org_id           uuid NOT NULL REFERENCES public.client_organizations(id) ON DELETE CASCADE,
  project_id              uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  title                   text NOT NULL,
  description             text,
  document_id             uuid REFERENCES public.client_documents(id) ON DELETE SET NULL,
  requested_by            uuid REFERENCES public.users(id) ON DELETE SET NULL,
  responded_by_client_user_id uuid REFERENCES public.client_users(id) ON DELETE SET NULL,
  response                text,
  response_notes          text,
  requested_at            timestamptz NOT NULL DEFAULT now(),
  responded_at            timestamptz,
  status                  text NOT NULL DEFAULT 'pending',
  CONSTRAINT client_approvals_response_check CHECK (response IN ('approved', 'rejected', 'changes_requested')),
  CONSTRAINT client_approvals_status_check CHECK (status IN ('pending', 'responded', 'cancelled'))
);

CREATE INDEX IF NOT EXISTS idx_client_approvals_org_pending ON public.client_approvals(client_org_id, status) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_client_approvals_org_all ON public.client_approvals(client_org_id, status);
CREATE INDEX IF NOT EXISTS idx_client_approvals_project ON public.client_approvals(project_id) WHERE project_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_client_approvals_responded_at ON public.client_approvals(responded_at DESC) WHERE responded_at IS NOT NULL;
