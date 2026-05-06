-- Phase 4.7 — fusion-splicer field loss records.
-- Fujikura Splice+ (and any other format we add later) uploads
-- per-splice records with GPS + loss measurement. The server
-- attempts to bind each record to a planned splice in the project
-- by GPS proximity + (where available) cable/fiber metadata.
-- Unbound records still land in the table so the engineer can
-- manually attach them later. raw_payload_jsonb keeps the full
-- source record for forensics and for fields we don't model yet
-- (operator name, splicer serial, splice mode, etc.).
CREATE TABLE IF NOT EXISTS splice_loss_records (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id          UUID NOT NULL REFERENCES splice_projects(id) ON DELETE CASCADE,
  -- Auto-bound at ingest when a single nearby splice matches; nullable
  -- so unbound records can sit in the table awaiting manual attach.
  splice_id           UUID REFERENCES splices(id) ON DELETE SET NULL,
  -- Phase 5.B made closure + location first-class anchors for splices.
  -- A loss record may bind at any of those granularities.
  closure_id          UUID REFERENCES splice_closures(id) ON DELETE SET NULL,
  location_id         UUID REFERENCES splice_locations(id) ON DELETE SET NULL,
  source              VARCHAR(40) NOT NULL DEFAULT 'fujikura_splice_plus',
  splicer_serial      VARCHAR(120),
  operator_name       VARCHAR(120),
  splice_loss_db      NUMERIC(5, 3),
  measured_at         TIMESTAMPTZ,
  gps_lat             DECIMAL(10, 7),
  gps_lon             DECIMAL(10, 7),
  -- Bind quality: 'auto' if the server snapped this to a splice with
  -- high confidence, 'manual' if the engineer attached it later, NULL
  -- if still unbound.
  bind_method         VARCHAR(20),
  raw_payload_jsonb   JSONB NOT NULL,
  uploaded_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  uploaded_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  -- Optional reference back to the public field-markup token that
  -- ingested this record (set when uploaded via the splicer page).
  field_token         VARCHAR(64) REFERENCES splice_closure_public_tokens(token) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_splice_loss_records_project
  ON splice_loss_records(project_id, measured_at DESC);
CREATE INDEX IF NOT EXISTS idx_splice_loss_records_splice
  ON splice_loss_records(splice_id) WHERE splice_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_splice_loss_records_closure
  ON splice_loss_records(closure_id) WHERE closure_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_splice_loss_records_location
  ON splice_loss_records(location_id) WHERE location_id IS NOT NULL;
