-- 0083: training completion certificates (specs/certificates.md)
CREATE TABLE IF NOT EXISTS training_certificates (
  id SERIAL PRIMARY KEY,
  cert_no TEXT UNIQUE NOT NULL,
  -- #68/Registrar merge-fix: users.id is UUID, not INTEGER (the ratified spec's
  -- reference migration assumed integer — an FK type-mismatch that would abort
  -- the deploy). Corrected to UUID; Partner to sync specs/certificates.md.
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  recipient_name TEXT NOT NULL,
  course_code TEXT NOT NULL DEFAULT 'OSP_DESIGN',
  course_title TEXT NOT NULL DEFAULT 'Outside Plant (OSP) Fiber Design Course',
  completed_on DATE NOT NULL,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  issued_by TEXT,
  revoked BOOLEAN NOT NULL DEFAULT false,
  revoked_reason TEXT
);
CREATE INDEX IF NOT EXISTS idx_training_certificates_user ON training_certificates(user_id);
