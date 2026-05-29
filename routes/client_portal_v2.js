// routes/client_portal_v2.js — token-based client portal v1 foundation (E2).
//
// This is the NEW client portal, built alongside the Wave 13 portal which
// stays operational at /client-portal until explicitly retired in E6.
//
// URL surface:
//   GET  /client/login/:rawToken                      — consume token, set cookie, 302 /client/
//   POST /client/logout                               — revoke token + clear cookie
//   GET  /api/client/me                               — current client_user + org
//
//   GET  /api/admin/client-orgs                       — list all orgs (admin only)
//   POST /api/admin/client-orgs                       — create org
//   GET  /api/admin/client-orgs/:id                   — get org + users + token counts
//   PUT  /api/admin/client-orgs/:id                   — update org metadata
//   POST /api/admin/client-orgs/:id/users             — create client_user in org
//   POST /api/admin/client-orgs/:id/users/:uid/tokens — generate token (raw shown once)
//   POST /api/admin/client-tokens/:tid/revoke         — revoke a token

// W45-MED-2: UUID format guard applied to all path params before SQL.
// PostgreSQL throws a syntax error (500) on non-UUID strings; we return 400.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isValidUUID(v) { return typeof v === 'string' && UUID_RE.test(v); }

// W107-HIGH-2: Magic-byte allowlist.
// We inspect actual file bytes on disk rather than trusting the client-supplied
// Content-Type header, which can be trivially spoofed.
const MIME_MAGIC = {
  'application/pdf':   [[0, '25504446']],
  'image/png':         [[0, '89504e47']],
  'image/jpeg':        [[0, 'ffd8ff']],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                       [[0, '504b0304']],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                       [[0, '504b0304']],
  'image/vnd.dwg':     [[0, '41433130']],
  'image/x-dwg':       [[0, '41433130']],
  'application/vnd.dwg': [[0, '41433130']],
};
const ALLOWED_UPLOAD_MIMES = Object.keys(MIME_MAGIC);

async function _verifyMagicBytes(filePath, mimeType) {
  const fs = require('fs');
  const signatures = MIME_MAGIC[mimeType];
  if (!signatures) return false;
  for (const [offset, hexStr] of signatures) {
    const needed = offset + hexStr.length / 2;
    const buf = Buffer.alloc(needed);
    let fd;
    try {
      fd = await fs.promises.open(filePath, 'r');
      const { bytesRead } = await fd.read(buf, 0, needed, 0);
      await fd.close();
      fd = null;
      if (bytesRead < needed) return false;
      const actual = buf.slice(offset, offset + hexStr.length / 2).toString('hex');
      if (!actual.startsWith(hexStr.toLowerCase())) return false;
    } catch {
      if (fd) { try { await fd.close(); } catch { /* ignore */ } }
      return false;
    }
  }
  return true;
}

module.exports = function installClientPortalV2(app, pool, { requireAuth }) {
  const {
    generateRawToken,
    hashToken,
    requireClientAuth,
    CLIENT_SESSION_COOKIE,
  } = require('./_client_auth');

  const { logAudit } = require('./_audit');

  const requireClientAuthMW = requireClientAuth(pool);

  function clientCookieOpts() {
    return {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    };
  }

  // ── Token consume ──────────────────────────────────────────────────────
  // Client clicks their login link. We hash the raw token, validate, set
  // cookie, then 302 to /client/ so the raw token disappears from the URL bar.
  app.get('/client/login/:rawToken', async (req, res) => {
    try {
      const raw = req.params.rawToken;
      if (!raw) return res.status(400).send('Missing token');
      const tokenHash = hashToken(raw);

      const { rows } = await pool.query(`
        SELECT ct.id, ct.expires_at, ct.revoked_at,
               cu.status AS user_status,
               co.status AS org_status
        FROM client_tokens ct
        JOIN client_users cu ON cu.id = ct.client_user_id
        JOIN client_organizations co ON co.id = cu.org_id
        WHERE ct.token_hash = $1
      `, [tokenHash]);

      // W45-MED-1: all 401 paths return the same opaque message to prevent
      // token-state enumeration (existence / revoked / expired / inactive).
      const DENY_MSG = 'This login link is invalid or no longer active.';
      if (!rows.length) return res.status(401).send(DENY_MSG);
      const r = rows[0];
      if (r.revoked_at) return res.status(401).send(DENY_MSG);
      if (r.expires_at && new Date(r.expires_at) < new Date()) return res.status(401).send(DENY_MSG);
      if (r.user_status !== 'active') return res.status(401).send(DENY_MSG);
      if (r.org_status !== 'active') return res.status(401).send(DENY_MSG);

      // W107-MED-2: audit successful logins.
      logAudit(pool, { req, action: 'client_portal.login', entity_type: 'client_token', entity_id: r.id, source: 'client_portal', actor_type: 'client_user' });

      res.cookie(CLIENT_SESSION_COOKIE, raw, clientCookieOpts());
      return res.redirect('/client/');
    } catch (e) {
      console.error('[client_portal_v2] token consume error:', e && e.message);
      return res.status(500).send('Login failed. Please try your link again.');
    }
  });

  // ── Logout ─────────────────────────────────────────────────────────────
  // Revokes the token row (so the cookie can't be replayed after clear)
  // and clears the cookie.
  app.post('/client/logout', requireClientAuthMW, async (req, res) => {
    try {
      const raw = req.cookies && req.cookies[CLIENT_SESSION_COOKIE];
      if (raw) {
        const tokenHash = hashToken(raw);
        await pool.query(
          'UPDATE client_tokens SET revoked_at = NOW() WHERE token_hash = $1',
          [tokenHash]
        );
      }
      // W107-MED-2: audit logout.
      logAudit(pool, { req, action: 'client_portal.logout', entity_type: 'client_session', entity_id: null, source: 'client_portal', actor_type: 'client_user' });

      res.clearCookie(CLIENT_SESSION_COOKIE, clientCookieOpts());
      return res.json({ ok: true });
    } catch (e) {
      console.error('[client_portal_v2] logout error:', e && e.message);
      return res.status(500).json({ error: 'logout failed' });
    }
  });

  // ── Client identity ────────────────────────────────────────────────────
  app.get('/api/client/me', requireClientAuthMW, (req, res) => {
    res.json({ client_user: req.client_user, client_org: req.client_org });
  });

  // ── Client projects list ────────────────────────────────────────────────
  // Returns leaf projects (is_rollup = false) for the client's organization
  // Grouped by engineering contract.
  app.get('/api/client/projects', requireClientAuthMW, async (req, res) => {
    try {
      const orgId = req.client_org.id;
      const { rows } = await pool.query(`
        SELECT
          p.id,
          p.name,
          p.service_area_name,
          p.program,
          p.status,
          p.created_at,
          p.engineering_contract_id,
          ec.id AS contract_id
        FROM projects p
        JOIN engineering_contracts ec ON ec.id = p.engineering_contract_id
        WHERE ec.client_org_id = $1
          AND COALESCE(p.is_rollup, false) = false
        ORDER BY ec.name, p.name
      `, [orgId]);

      res.json({ projects: rows });
    } catch (e) {
      console.error('[client_portal_v2] list projects:', e && e.message);
      res.status(500).json({ error: 'failed to load projects' });
    }
  });

  // ── Client single project detail ────────────────────────────────────────
  // Returns a single project by ID if it belongs to the authenticated client's org.
  // Returns 404 if project not found or doesn't belong to the client.
  app.get('/api/client/projects/:id', requireClientAuthMW, async (req, res) => {
    try {
      // W45-MED-2: validate UUID format before SQL to return 400 not 500.
      if (!isValidUUID(req.params.id)) return res.status(400).json({ error: 'invalid project id' });
      const orgId = req.client_org.id;
      const projectId = req.params.id;

      const { rows } = await pool.query(`
        SELECT
          p.id,
          p.name,
          p.service_area_name,
          p.program,
          p.status,
          p.created_at,
          p.engineering_contract_id,
          ec.id AS contract_id
        FROM projects p
        JOIN engineering_contracts ec ON ec.id = p.engineering_contract_id
        WHERE p.id = $1
          AND ec.client_org_id = $2
          AND COALESCE(p.is_rollup, false) = false
      `, [projectId, orgId]);

      if (!rows.length) return res.status(404).json({ error: 'project not found' });
      res.json({ project: rows[0] });
    } catch (e) {
      console.error('[client_portal_v2] get project:', e && e.message);
      res.status(500).json({ error: 'failed to load project' });
    }
  });

  // ── Client workspace files (folders + download) ─────────────────────────
  // Returns workspace folders (with their files) attached to a project.
  // Only returns public folders. Validates client_org ownership via EC chain.
  app.get('/api/client/projects/:project_id/workspace-files', requireClientAuthMW, async (req, res) => {
    try {
      const { project_id } = req.params;
      if (!isValidUUID(project_id)) return res.status(400).json({ error: 'invalid project id' });

      // Scope check: project must belong to caller's client_org via the EC FK chain
      const scopeCheck = await pool.query(`
        SELECT p.id FROM projects p
        JOIN engineering_contracts ec ON ec.id = p.engineering_contract_id
        WHERE p.id = $1 AND ec.client_org_id = $2
      `, [project_id, req.client_org.id]);

      if (!scopeCheck.rows.length) return res.status(404).json({ error: 'project not found' });

      // Fetch public folders attached to the project + their file counts
      const { rows: folders } = await pool.query(`
        SELECT
          wf.id,
          wf.name,
          wf.share_mode,
          wf.created_at,
          (SELECT COUNT(*) FROM workspace_files WHERE folder_id = wf.id)::int AS file_count
        FROM workspace_folders wf
        WHERE wf.project_id = $1
          AND wf.share_mode = 'public'
        ORDER BY wf.name
      `, [project_id]);

      // Fetch files for each folder
      const result = [];
      for (const folder of folders) {
        const { rows: files } = await pool.query(`
          SELECT
            wfile.id,
            wfile.filename,
            wfile.mime_type,
            wfile.size_bytes,
            wfile.uploaded_at,
            (SELECT username FROM users WHERE id = wfile.uploaded_by) AS uploaded_by_name
          FROM workspace_files wfile
          WHERE wfile.folder_id = $1
          ORDER BY wfile.uploaded_at DESC
          LIMIT 20
        `, [folder.id]);
        result.push({ ...folder, files });
      }

      res.json({ folders: result });
    } catch (e) {
      console.error('[client_portal_v2] workspace files:', e && e.message);
      res.status(500).json({ error: 'failed to load workspace files' });
    }
  });

  // Download a workspace file. Caller's client_org must own a project that has the parent folder attached.
  app.get('/api/client/workspace-files/:file_id/download', requireClientAuthMW, async (req, res) => {
    try {
      const { file_id } = req.params;
      if (!isValidUUID(file_id)) return res.status(400).json({ error: 'invalid file id' });

      // IDOR scope: file's folder must be project-linked + public + linked to a project the client_org owns
      const { rows } = await pool.query(`
        SELECT wfile.storage_key, wfile.filename, wfile.mime_type
        FROM workspace_files wfile
        JOIN workspace_folders wf ON wf.id = wfile.folder_id
        JOIN projects p ON p.id = wf.project_id
        JOIN engineering_contracts ec ON ec.id = p.engineering_contract_id
        WHERE wfile.id = $1
          AND wf.share_mode = 'public'
          AND ec.client_org_id = $2
      `, [file_id, req.client_org.id]);

      if (!rows.length) return res.status(404).json({ error: 'file not found' });
      const row = rows[0];

      // Stream the file
      const fs = require('fs');
      const path = require('path');
      // W107-MED-4: use __dirname-anchored base and add traversal guard.
      const uploadBase = path.join(__dirname, '..', 'uploads');
      const filePath = path.resolve(uploadBase, row.storage_key);
      if (!filePath.startsWith(uploadBase + path.sep) && filePath !== uploadBase) {
        return res.status(403).json({ error: 'access denied' });
      }

      try {
        await fs.promises.access(filePath, fs.constants.R_OK);
      } catch {
        return res.status(404).json({ error: 'file missing on disk' });
      }

      res.setHeader('Content-Type', row.mime_type);
      res.setHeader('Content-Disposition', `attachment; filename="${row.filename.replace(/"/g, '')}"`);
      fs.createReadStream(filePath).pipe(res);
    } catch (e) {
      console.error('[client_portal_v2] download file:', e && e.message);
      res.status(500).json({ error: 'download failed' });
    }
  });

  // ══════════════════════════════════════════════════════════════════════
  // Admin endpoints — all gated with requireAuth(['admin'])
  // ══════════════════════════════════════════════════════════════════════

  // ── List orgs ──────────────────────────────────────────────────────────
  app.get('/api/admin/client-orgs', requireAuth(['admin']), async (req, res) => {
    try {
      const { rows } = await pool.query(`
        SELECT
          co.*,
          COUNT(DISTINCT cu.id)::int          AS user_count,
          COUNT(DISTINCT ct.id) FILTER (
            WHERE ct.revoked_at IS NULL
            AND (ct.expires_at IS NULL OR ct.expires_at > NOW())
          )::int                              AS active_token_count,
          (
            SELECT cu2.name
            FROM client_users cu2
            WHERE cu2.org_id = co.id AND cu2.is_primary = true
            LIMIT 1
          )                                   AS primary_user_name,
          (
            SELECT cu2.email
            FROM client_users cu2
            WHERE cu2.org_id = co.id AND cu2.is_primary = true
            LIMIT 1
          )                                   AS primary_user_email
        FROM client_organizations co
        LEFT JOIN client_users cu ON cu.org_id = co.id
        LEFT JOIN client_tokens ct ON ct.client_user_id = cu.id
        GROUP BY co.id
        ORDER BY co.name
      `);
      res.json(rows);
    } catch (e) {
      console.error('[client_portal_v2] list orgs:', e && e.message);
      res.status(500).json({ error: 'failed to list organizations' });
    }
  });

  // ── Create org ─────────────────────────────────────────────────────────
  app.post('/api/admin/client-orgs', requireAuth(['admin']), async (req, res) => {
    const { name, short_name, logo_url, theme_color } = req.body || {};
    if (!name || !name.trim()) return res.status(400).json({ error: 'name required' });
    try {
      const { rows } = await pool.query(`
        INSERT INTO client_organizations (name, short_name, logo_url, theme_color, created_by)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `, [name.trim(), short_name || null, logo_url || null, theme_color || null, req.user.id]);
      res.status(201).json(rows[0]);
    } catch (e) {
      console.error('[client_portal_v2] create org:', e && e.message);
      res.status(500).json({ error: 'failed to create organization' });
    }
  });

  // ── Get org detail (with users + token info) ──────────────────────────
  app.get('/api/admin/client-orgs/:id', requireAuth(['admin']), async (req, res) => {
    try {
      // W45-MED-2: UUID validation.
      if (!isValidUUID(req.params.id)) return res.status(400).json({ error: 'invalid id' });
      const { rows: orgRows } = await pool.query(
        'SELECT * FROM client_organizations WHERE id = $1',
        [req.params.id]
      );
      if (!orgRows.length) return res.status(404).json({ error: 'org not found' });

      // W45-MED-3: explicit column list instead of cu.* to prevent future
      // accidental column exposure (e.g. if sensitive columns are added later).
      // invited_by UUID is an internal staff reference — intentionally omitted.
      const { rows: userRows } = await pool.query(`
        SELECT
          cu.id,
          cu.org_id,
          cu.email,
          cu.name,
          cu.is_primary,
          cu.status,
          cu.created_at,
          COALESCE(
            json_agg(
              json_build_object(
                'id',           ct.id,
                'created_at',   ct.created_at,
                'last_used_at', ct.last_used_at,
                'expires_at',   ct.expires_at,
                'revoked_at',   ct.revoked_at
              ) ORDER BY ct.created_at DESC
            ) FILTER (WHERE ct.id IS NOT NULL),
            '[]'::json
          ) AS tokens
        FROM client_users cu
        LEFT JOIN client_tokens ct ON ct.client_user_id = cu.id
        WHERE cu.org_id = $1
        GROUP BY cu.id
        ORDER BY cu.is_primary DESC, cu.created_at
      `, [req.params.id]);

      res.json({ org: orgRows[0], users: userRows });
    } catch (e) {
      console.error('[client_portal_v2] get org:', e && e.message);
      res.status(500).json({ error: 'failed to get organization' });
    }
  });

  // ── Update org ─────────────────────────────────────────────────────────
  app.put('/api/admin/client-orgs/:id', requireAuth(['admin']), async (req, res) => {
    // W45-MED-2: UUID validation.
    if (!isValidUUID(req.params.id)) return res.status(400).json({ error: 'invalid id' });
    const { name, short_name, logo_url, theme_color, status } = req.body || {};
    const validStatuses = ['active', 'suspended', 'archived'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'invalid status' });
    }
    try {
      const { rows } = await pool.query(`
        UPDATE client_organizations
        SET name        = COALESCE($1, name),
            short_name  = COALESCE($2, short_name),
            logo_url    = COALESCE($3, logo_url),
            theme_color = COALESCE($4, theme_color),
            status      = COALESCE($5, status)
        WHERE id = $6
        RETURNING *
      `, [
        name ? name.trim() : null,
        short_name !== undefined ? short_name : null,
        logo_url !== undefined ? logo_url : null,
        theme_color !== undefined ? theme_color : null,
        status || null,
        req.params.id,
      ]);
      if (!rows.length) return res.status(404).json({ error: 'org not found' });
      res.json(rows[0]);
    } catch (e) {
      console.error('[client_portal_v2] update org:', e && e.message);
      res.status(500).json({ error: 'failed to update organization' });
    }
  });

  // ── Create client user ─────────────────────────────────────────────────
  app.post('/api/admin/client-orgs/:id/users', requireAuth(['admin']), async (req, res) => {
    // W45-MED-2: UUID validation.
    if (!isValidUUID(req.params.id)) return res.status(400).json({ error: 'invalid id' });
    const { email, name, is_primary } = req.body || {};
    try {
      const { rows: orgCheck } = await pool.query(
        'SELECT id FROM client_organizations WHERE id = $1',
        [req.params.id]
      );
      if (!orgCheck.length) return res.status(404).json({ error: 'org not found' });

      const { rows } = await pool.query(`
        INSERT INTO client_users (org_id, email, name, is_primary, invited_by)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `, [
        req.params.id,
        email || null,
        name || null,
        is_primary === true,
        req.user.id,
      ]);
      res.status(201).json(rows[0]);
    } catch (e) {
      console.error('[client_portal_v2] create user:', e && e.message);
      res.status(500).json({ error: 'failed to create user' });
    }
  });

  // ── Generate token for a user ──────────────────────────────────────────
  // Returns raw token ONCE. Admin copies + sends to client.
  // After this response the raw value is never seen again (only hash stored).
  app.post('/api/admin/client-orgs/:id/users/:uid/tokens', requireAuth(['admin']), async (req, res) => {
    // W45-MED-2: UUID validation for both :id and :uid.
    if (!isValidUUID(req.params.id) || !isValidUUID(req.params.uid)) {
      return res.status(400).json({ error: 'invalid id' });
    }
    const { expires_days } = req.body || {};
    try {
      // Verify user belongs to the specified org.
      const { rows: userCheck } = await pool.query(
        'SELECT id FROM client_users WHERE id = $1 AND org_id = $2',
        [req.params.uid, req.params.id]
      );
      if (!userCheck.length) return res.status(404).json({ error: 'user not found in org' });

      const raw = generateRawToken();
      const tokenHash = hashToken(raw);
      let expiresAt = null;
      if (expires_days && Number.isFinite(+expires_days) && +expires_days > 0) {
        expiresAt = new Date(Date.now() + +expires_days * 86400 * 1000);
      }

      const { rows } = await pool.query(`
        INSERT INTO client_tokens (client_user_id, token_hash, expires_at)
        VALUES ($1, $2, $3)
        RETURNING id, created_at, expires_at
      `, [req.params.uid, tokenHash, expiresAt]);

      // W107-MED-2: audit token generation.
      logAudit(pool, { req, action: 'client_portal.token_generate', entity_type: 'client_token', entity_id: rows[0].id, after: { client_user_id: req.params.uid }, source: 'admin_ui' });

      const loginUrl = `${req.protocol}://${req.get('host')}/client/login/${raw}`;

      res.status(201).json({
        raw_token:  raw,
        login_url:  loginUrl,
        token_id:   rows[0].id,
        created_at: rows[0].created_at,
        expires_at: rows[0].expires_at,
        warning:    'Store this token securely — it will not be shown again.',
      });
    } catch (e) {
      console.error('[client_portal_v2] generate token:', e && e.message);
      res.status(500).json({ error: 'failed to generate token' });
    }
  });

  // ── Revoke token ───────────────────────────────────────────────────────
  app.post('/api/admin/client-tokens/:tid/revoke', requireAuth(['admin']), async (req, res) => {
    // W45-MED-2: UUID validation.
    if (!isValidUUID(req.params.tid)) return res.status(400).json({ error: 'invalid id' });
    try {
      const { rows } = await pool.query(`
        UPDATE client_tokens SET revoked_at = NOW()
        WHERE id = $1 AND revoked_at IS NULL
        RETURNING id, revoked_at
      `, [req.params.tid]);
      if (!rows.length) return res.status(404).json({ error: 'token not found or already revoked' });

      // W107-MED-2: audit token revocation.
      logAudit(pool, { req, action: 'client_portal.token_revoke', entity_type: 'client_token', entity_id: rows[0].id, source: 'admin_ui' });

      res.json({ ok: true, revoked_at: rows[0].revoked_at });
    } catch (e) {
      console.error('[client_portal_v2] revoke token:', e && e.message);
      res.status(500).json({ error: 'failed to revoke token' });
    }
  });

  // ══════════════════════════════════════════════════════════════════════
  // Wave 49: Documents + Approvals (client write surface)
  // ══════════════════════════════════════════════════════════════════════

  // ── List documents ─────────────────────────────────────────────────────
  app.get('/api/client/documents', requireClientAuthMW, async (req, res) => {
    try {
      const orgId = req.client_org.id;
      const projectId = req.query.project_id;

      // If project_id filter requested, verify it belongs to this org.
      if (projectId) {
        if (!isValidUUID(projectId)) return res.status(400).json({ error: 'invalid project_id' });
        const { rows: projCheck } = await pool.query(`
          SELECT p.id FROM projects p
          JOIN engineering_contracts ec ON ec.id = p.engineering_contract_id
          WHERE p.id = $1 AND ec.client_org_id = $2
        `, [projectId, orgId]);
        if (!projCheck.length) return res.status(404).json({ error: 'project not found in org' });
      }

      const query = projectId
        ? `
          SELECT id, client_org_id, project_id, filename, mime_type, size_bytes,
                 direction, status, notes, created_at
          FROM client_documents
          WHERE client_org_id = $1 AND project_id = $2 AND status = 'active'
          ORDER BY created_at DESC
        `
        : `
          SELECT id, client_org_id, project_id, filename, mime_type, size_bytes,
                 direction, status, notes, created_at
          FROM client_documents
          WHERE client_org_id = $1 AND status = 'active'
          ORDER BY created_at DESC
        `;

      const params = projectId ? [orgId, projectId] : [orgId];
      const { rows } = await pool.query(query, params);

      res.json({ documents: rows, total: rows.length });
    } catch (e) {
      console.error('[client_portal_v2] list documents:', e && e.message);
      res.status(500).json({ error: 'failed to load documents' });
    }
  });

  // ── Download document ──────────────────────────────────────────────────
  app.get('/api/client/documents/:id/download', requireClientAuthMW, async (req, res) => {
    try {
      if (!isValidUUID(req.params.id)) return res.status(400).json({ error: 'invalid document id' });
      const orgId = req.client_org.id;

      const { rows } = await pool.query(`
        SELECT id, storage_key, filename
        FROM client_documents
        WHERE id = $1 AND client_org_id = $2 AND status = 'active'
      `, [req.params.id, orgId]);

      if (!rows.length) return res.status(404).json({ error: 'document not found' });
      const doc = rows[0];

      const fs = require('fs');
      const path = require('path');
      const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads');
      const filePath = path.join(uploadDir, doc.storage_key);

      // Prevent path traversal.
      if (!filePath.startsWith(uploadDir)) {
        return res.status(403).json({ error: 'access denied' });
      }

      // W107-MED-3: strip CR/LF/quotes to prevent header injection.
      const safeFilename = doc.filename.replace(/["\r\n]/g, '');
      res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
      const stream = fs.createReadStream(filePath);
      stream.on('error', (e) => {
        console.error('[client_portal_v2] download stream error:', e && e.message);
        res.status(500).json({ error: 'failed to download document' });
      });
      stream.pipe(res);
    } catch (e) {
      console.error('[client_portal_v2] download document:', e && e.message);
      res.status(500).json({ error: 'failed to download document' });
    }
  });

  // ── Upload document ────────────────────────────────────────────────────
  // Note: assumes multer middleware is mounted at app level.
  // This endpoint requires multipart/form-data with fields: file, project_id (optional), notes (optional).

  const path = require('path');
  function installClientDocumentUpload(uploadMW) {
    app.post('/api/client/documents', requireClientAuthMW, uploadMW.single('file'), async (req, res) => {
      try {
        if (!req.file) return res.status(400).json({ error: 'no file provided' });

        const orgId = req.client_org.id;
        const projectId = req.body.project_id;
        const notes = req.body.notes || null;

        // W107-HIGH-2: use module-level allowlist + magic-byte verification.
        if (!ALLOWED_UPLOAD_MIMES.includes(req.file.mimetype)) {
          const fs = require('fs');
          fs.unlink(req.file.path, () => {});
          return res.status(400).json({ error: 'file type not allowed' });
        }

        // W107-HIGH-2: verify file magic bytes match the claimed MIME type.
        const magicOk = await _verifyMagicBytes(req.file.path, req.file.mimetype);
        if (!magicOk) {
          const fs = require('fs');
          fs.unlink(req.file.path, () => {});
          return res.status(400).json({ error: 'file content does not match declared type' });
        }

        // 50MB cap.
        if (req.file.size > 50 * 1024 * 1024) {
          const fs = require('fs');
          fs.unlink(req.file.path, (e) => {});
          return res.status(400).json({ error: 'file exceeds 50MB limit' });
        }

        // If project_id provided, verify it belongs to this org.
        if (projectId) {
          if (!isValidUUID(projectId)) {
            const fs = require('fs');
            fs.unlink(req.file.path, (e) => {});
            return res.status(400).json({ error: 'invalid project_id' });
          }
          const { rows: projCheck } = await pool.query(`
            SELECT p.id FROM projects p
            JOIN engineering_contracts ec ON ec.id = p.engineering_contract_id
            WHERE p.id = $1 AND ec.client_org_id = $2
          `, [projectId, orgId]);
          if (!projCheck.length) {
            const fs = require('fs');
            fs.unlink(req.file.path, (e) => {});
            return res.status(404).json({ error: 'project not found in org' });
          }
        }

        // Store relative path: client-docs/<org_id>/<filename>
        const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads');
        const fs = require('fs');
        const fsp = fs.promises;
        const ext = path.extname(req.file.originalname);
        const { v4: uuidv4 } = require('uuid');
        const uuid = uuidv4();
        const storageKey = path.join('client-docs', orgId, `${uuid}${ext}`).replace(/\\/g, '/');
        const fullPath = path.join(uploadDir, storageKey);
        const dirPath = path.dirname(fullPath);

        // Ensure directory exists.
        await fsp.mkdir(dirPath, { recursive: true });
        await fsp.rename(req.file.path, fullPath);

        // Insert document row.
        const { rows } = await pool.query(`
          INSERT INTO client_documents (
            client_org_id, project_id, filename, mime_type, size_bytes,
            storage_key, uploaded_by_client_user_id, direction, status, notes
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          RETURNING id, filename, mime_type, size_bytes, direction,
                    status, notes, created_at
        `, [
          orgId,
          projectId || null,
          req.file.originalname,
          req.file.mimetype,
          req.file.size,
          storageKey,
          req.client_user.id,
          'from_client',
          'active',
          notes
        ]);

        // W107-MED-2: audit document upload.
        logAudit(pool, { req, action: 'client_portal.document_upload', entity_type: 'client_document', entity_id: rows[0].id, after: { filename: rows[0].filename, mime_type: rows[0].mime_type }, source: 'client_portal', actor_type: 'client_user' });

        res.status(201).json({ document: rows[0] });
      } catch (e) {
        console.error('[client_portal_v2] upload document:', e && e.message);
        // Clean up on error.
        if (req.file && req.file.path) {
          const fs = require('fs');
          fs.unlink(req.file.path, (e) => {});
        }
        res.status(500).json({ error: 'failed to upload document' });
      }
    });
  }

  // Export the upload handler for server.js to wire.
  module.exports.installClientDocumentUpload = installClientDocumentUpload;

  // ── List approvals ─────────────────────────────────────────────────────
  app.get('/api/client/approvals', requireClientAuthMW, async (req, res) => {
    try {
      const orgId = req.client_org.id;
      const statusFilter = req.query.status || 'pending';

      // W100-F8: allowlist statusFilter values to prevent unexpected filter strings.
      const ALLOWED_STATUS_FILTERS = ['pending', 'responded', 'all'];
      if (!ALLOWED_STATUS_FILTERS.includes(statusFilter)) {
        return res.status(400).json({ error: `Invalid status filter. Allowed values: ${ALLOWED_STATUS_FILTERS.join(', ')}` });
      }

      let whereClause = 'client_org_id = $1';
      const params = [orgId];

      if (statusFilter !== 'all') {
        whereClause += ' AND status = $2';
        params.push(statusFilter);
      }

      const { rows } = await pool.query(`
        SELECT id, client_org_id, project_id, title, description, document_id,
               response, response_notes, requested_at, responded_at, status
        FROM client_approvals
        WHERE ${whereClause}
        ORDER BY CASE WHEN status = 'pending' THEN 0 ELSE 1 END, requested_at DESC
      `, params);

      res.json({ approvals: rows, total: rows.length });
    } catch (e) {
      console.error('[client_portal_v2] list approvals:', e && e.message);
      res.status(500).json({ error: 'failed to load approvals' });
    }
  });

  // ── Respond to approval ────────────────────────────────────────────────
  app.post('/api/client/approvals/:id/respond', requireClientAuthMW, async (req, res) => {
    try {
      if (!isValidUUID(req.params.id)) return res.status(400).json({ error: 'invalid approval id' });

      const { response, response_notes } = req.body || {};
      if (!['approved', 'rejected', 'changes_requested'].includes(response)) {
        return res.status(400).json({ error: 'invalid response value' });
      }

      const orgId = req.client_org.id;
      const approvalId = req.params.id;

      // Verify approval belongs to this org and is pending.
      const { rows: approvalCheck } = await pool.query(`
        SELECT id, status FROM client_approvals
        WHERE id = $1 AND client_org_id = $2
      `, [approvalId, orgId]);

      if (!approvalCheck.length) return res.status(404).json({ error: 'approval not found' });
      if (approvalCheck[0].status !== 'pending') {
        return res.status(409).json({ error: 'approval already responded' });
      }

      // Update approval.
      const { rows } = await pool.query(`
        UPDATE client_approvals
        SET response = $1, response_notes = $2, status = 'responded',
            responded_at = NOW(), responded_by_client_user_id = $3
        WHERE id = $4
        RETURNING id, response, response_notes, responded_at, status
      `, [response, response_notes || null, req.client_user.id, approvalId]);

      // W107-MED-2: audit approval response.
      logAudit(pool, { req, action: 'client_portal.approval_respond', entity_type: 'client_approval', entity_id: approvalId, after: { response, status: 'responded' }, source: 'client_portal', actor_type: 'client_user' });

      res.json({ approval: rows[0] });
    } catch (e) {
      console.error('[client_portal_v2] respond approval:', e && e.message);
      res.status(500).json({ error: 'failed to respond to approval' });
    }
  });

  // ── Create approval (admin only) ────────────────────────────────────────
  app.post('/api/admin/client-orgs/:id/approvals', requireAuth(['admin']), async (req, res) => {
    try {
      if (!isValidUUID(req.params.id)) return res.status(400).json({ error: 'invalid org id' });

      const { title, description, project_id, document_id } = req.body || {};
      if (!title) return res.status(400).json({ error: 'title required' });

      const orgId = req.params.id;

      // Verify org exists.
      const { rows: orgCheck } = await pool.query(
        'SELECT id FROM client_organizations WHERE id = $1',
        [orgId]
      );
      if (!orgCheck.length) return res.status(404).json({ error: 'org not found' });

      // If project_id or document_id provided, verify they scope to this org.
      if (project_id) {
        if (!isValidUUID(project_id)) return res.status(400).json({ error: 'invalid project_id' });
        const { rows: projCheck } = await pool.query(`
          SELECT p.id FROM projects p
          JOIN engineering_contracts ec ON ec.id = p.engineering_contract_id
          WHERE p.id = $1 AND ec.client_org_id = $2
        `, [project_id, orgId]);
        if (!projCheck.length) return res.status(404).json({ error: 'project not found in org' });
      }

      if (document_id) {
        if (!isValidUUID(document_id)) return res.status(400).json({ error: 'invalid document_id' });
        const { rows: docCheck } = await pool.query(
          'SELECT id FROM client_documents WHERE id = $1 AND client_org_id = $2',
          [document_id, orgId]
        );
        if (!docCheck.length) return res.status(404).json({ error: 'document not found in org' });
      }

      // Create approval.
      const { rows } = await pool.query(`
        INSERT INTO client_approvals (
          client_org_id, title, description, project_id, document_id, requested_by, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, title, description, project_id, document_id, status, requested_at
      `, [
        orgId,
        title,
        description || null,
        project_id || null,
        document_id || null,
        req.user.id,
        'pending'
      ]);

      // W107-MED-2: audit approval creation.
      logAudit(pool, { req, action: 'client_portal.approval_create', entity_type: 'client_approval', entity_id: rows[0].id, after: { title, org_id: orgId }, source: 'admin_ui' });

      res.status(201).json({ approval: rows[0] });
    } catch (e) {
      console.error('[client_portal_v2] create approval:', e && e.message);
      res.status(500).json({ error: 'failed to create approval' });
    }
  });
};
