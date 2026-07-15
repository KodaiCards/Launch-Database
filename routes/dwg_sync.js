// routes/dwg_sync.js — DWG offline-sync backend (Wave 35 / C1).
//
// Allows field technicians with the right roles to download raw DWG/DXF files
// to their laptops over WiFi, then open them in AutoCAD/DraftSight while
// offline in trucks.  No in-browser viewer, no server-side conversion.
//
// Endpoints:
//   GET  /api/dwg-sync/projects                 — projects the user can sync
//   GET  /api/dwg-sync/projects/:id/manifest    — file manifest + ETag
//   GET  /api/dwg-sync/files/:docId             — stream binary with ETag / 304
//   GET  /api/dwg-sync/state                    — calling user's sync cursors
//   POST /api/dwg-sync/state                    — upsert a sync cursor
//
// Schema: migration 0044_dwg_offline_sync.sql
//   permit_documents.sha256        char(64) nullable  — computed lazily on first request
//   permit_documents.content_type  varchar(80) nullable — stored at upload time (future)
//   project_dwg_sync_state         — per-user, per-project sync cursors

const fs   = require('fs');
const fsp  = fs.promises;
const path = require('path');
const crypto = require('crypto');
const { logAudit } = require('./_audit');

const DWG_ROLES = [
  'admin',
  'design_manager',
  'design_engineer',
  'permitting_engineer',
  'permitting_manager',
];

// Only DWG and DXF files are eligible for offline sync.
const DWG_EXT_SQL = `lower(right(d.file_name, 4)) IN ('.dwg', '.dxf')`;

module.exports = function installDwgSyncRoutes(app, pool, mw) {
  const requireAuth = (mw && mw.requireAuth) || (() => (req, res, next) => next());
  // System F (#77): DWG project sync reads are delegable via projects.view_all
  // (project-domain work; admin passes by role). DWG_ROLES == the projects.view_all
  // seed, so this preserves current access.
  const { requirePermission } = require('./_permissions');
  const viewProjects = requirePermission(pool, 'projects.view_all');
  const uploadDir = (mw && mw.uploadDir) || process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads');

  // ─── GET /api/dwg-sync/projects ─────────────────────────────────────────────
  // List projects that have at least one DWG/DXF document.
  // Returns project metadata + DWG count + manifest_etag + latest doc updated_at
  // so the frontend can show which projects are available for sync.
  //
  // HIGH-1 fix: scope to projects accessible by the calling user.
  // Admin/manager roles see all; other DWG-role employees only see projects
  // linked via job_assignments or ec_job_visibility (same pattern as
  // project_photos.js userHasProjectAccess).
  app.get('/api/dwg-sync/projects',
    viewProjects,
    async (req, res) => {
      const role = req.user.role || '';
      const isAdminOrManager = role === 'admin' ||
        role === 'design_manager' ||
        role === 'permitting_manager';

      // Admin/manager: no scoping restriction.
      // Other DWG-role staff: only projects they are linked to via assignments.
      const accessFilter = isAdminOrManager
        ? ''
        : `AND (
            p.client_id IS NULL
            OR EXISTS (
              SELECT 1 FROM job_assignments ja
              WHERE (ja.client_id = p.client_id
                     OR ja.engineering_contract_id = p.engineering_contract_id)
                AND ja.engineering_contract_id IS NOT DISTINCT FROM p.engineering_contract_id
              LIMIT 1
            )
            OR EXISTS (
              SELECT 1 FROM ec_job_visibility ejv
              WHERE ejv.engineering_contract_id = p.engineering_contract_id
                AND p.engineering_contract_id IS NOT NULL
              LIMIT 1
            )
          )`;

      try {
        const { rows } = await pool.query(`
          SELECT
            p.id                        AS project_id,
            p.name                      AS project_name,
            c.name                      AS client_name,
            COUNT(d.id)::int            AS dwg_count,
            MAX(d.created_at)           AS latest_doc_at,
            s.manifest_etag,
            s.last_synced_at
          FROM projects p
          LEFT JOIN clients c          ON c.id = p.client_id
          INNER JOIN permit_documents d ON d.project_id = p.id
                                       AND ${DWG_EXT_SQL}
          LEFT JOIN project_dwg_sync_state s
                                       ON s.project_id = p.id
                                       AND s.user_id = $1
          WHERE p.is_rollup IS NOT TRUE
            ${accessFilter}
          GROUP BY p.id, p.name, c.name, s.manifest_etag, s.last_synced_at
          ORDER BY MAX(d.created_at) DESC
        `, [req.user.id]);
        res.json({ projects: rows });
      } catch (err) {
        console.error('[dwg-sync] GET /projects error:', err.message);
        res.status(500).json({ error: 'Failed to list DWG projects' });
      }
    }
  );

  // ─── GET /api/dwg-sync/projects/:id/manifest ────────────────────────────────
  // Returns the full DWG/DXF manifest for a project.
  // Computes SHA-256 lazily: if permit_documents.sha256 is NULL for any file,
  // reads the file from disk, computes SHA-256, persists it, then returns it.
  // ETag = SHA-256 of the sorted concatenation of all per-file sha256 values.
  //
  // HIGH-1 fix: 404 if calling user does not have access to this project.
  app.get('/api/dwg-sync/projects/:id/manifest',
    viewProjects,
    async (req, res) => {
      const projectId = req.params.id;
      const role = req.user.role || '';
      const isAdminOrManager = role === 'admin' ||
        role === 'design_manager' ||
        role === 'permitting_manager';

      try {
        // Membership check for non-admin/manager roles.
        if (!isAdminOrManager) {
          const access = await pool.query(`
            SELECT 1 FROM projects p
            WHERE p.id = $1
              AND p.is_rollup IS NOT TRUE
              AND (
                p.client_id IS NULL
                OR EXISTS (
                  SELECT 1 FROM job_assignments ja
                  WHERE (ja.client_id = p.client_id
                         OR ja.engineering_contract_id = p.engineering_contract_id)
                    AND ja.engineering_contract_id IS NOT DISTINCT FROM p.engineering_contract_id
                  LIMIT 1
                )
                OR EXISTS (
                  SELECT 1 FROM ec_job_visibility ejv
                  WHERE ejv.engineering_contract_id = p.engineering_contract_id
                    AND p.engineering_contract_id IS NOT NULL
                  LIMIT 1
                )
              )
            LIMIT 1
          `, [projectId]);
          if (access.rows.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
          }
        }

        const { rows } = await pool.query(`
          SELECT id, file_name, file_path, file_size, sha256, created_at AS updated_at
          FROM permit_documents
          WHERE project_id = $1
            AND ${DWG_EXT_SQL.replace(/d\./g, '')}
          ORDER BY id
        `, [projectId]);

        if (rows.length === 0) {
          return res.json({ project_id: projectId, etag: null, files: [] });
        }

        // Lazy SHA-256 computation — only for rows without a stored hash.
        for (const doc of rows) {
          if (!doc.sha256) {
            const fullPath = path.join(uploadDir, doc.file_path);
            try {
              const buf = await fsp.readFile(fullPath);
              const hash = crypto.createHash('sha256').update(buf).digest('hex');
              await pool.query(
                `UPDATE permit_documents SET sha256 = $1 WHERE id = $2`,
                [hash, doc.id]
              );
              doc.sha256 = hash;
            } catch (readErr) {
              // File missing on disk — include in manifest with null sha256
              // so the client knows it exists in the DB but can't be downloaded.
              console.warn('[dwg-sync] file not found on disk:', doc.file_path, readErr.message);
            }
          }
        }

        // ETag = SHA-256 of the sorted concatenation of all per-file sha256 values.
        // Sorted by doc id (already ordered above) to keep it deterministic.
        const etag = crypto
          .createHash('sha256')
          .update(rows.map(r => r.sha256 || '').join(','))
          .digest('hex');

        const files = rows.map(doc => ({
          doc_id:    doc.id,
          file_name: doc.file_name,
          file_path: doc.file_path,
          file_size: doc.file_size,
          sha256:    doc.sha256,
          updated_at: doc.updated_at,
          url:       `/api/dwg-sync/files/${doc.id}`,
        }));

        res.json({ project_id: projectId, etag, files });
      } catch (err) {
        console.error('[dwg-sync] GET /manifest error:', err.message);
        res.status(500).json({ error: 'Failed to build manifest' });
      }
    }
  );

  // ─── GET /api/dwg-sync/files/:docId ─────────────────────────────────────────
  // Stream the raw DWG/DXF binary with auth gate and path-traversal guard.
  // Honors If-None-Match for 304 responses to save bandwidth on incremental
  // sync runs.
  //
  // HIGH-1 fix: lookup file's project, check caller's access. 404 if no access.
  app.get('/api/dwg-sync/files/:docId',
    viewProjects,
    async (req, res) => {
      const role = req.user.role || '';
      const isAdminOrManager = role === 'admin' ||
        role === 'design_manager' ||
        role === 'permitting_manager';

      try {
        // Fetch the document — join to project for membership check in one query.
        // For non-admin/manager, also verify the user has access to the project.
        let queryText, queryParams;
        if (isAdminOrManager) {
          queryText = `
            SELECT d.id, d.file_name, d.file_path, d.file_size, d.sha256, d.content_type
            FROM permit_documents d
            WHERE d.id = $1
              AND ${DWG_EXT_SQL}
            LIMIT 1
          `;
          queryParams = [req.params.docId];
        } else {
          queryText = `
            SELECT d.id, d.file_name, d.file_path, d.file_size, d.sha256, d.content_type
            FROM permit_documents d
            JOIN projects p ON p.id = d.project_id
            WHERE d.id = $1
              AND ${DWG_EXT_SQL}
              AND p.is_rollup IS NOT TRUE
              AND (
                p.client_id IS NULL
                OR EXISTS (
                  SELECT 1 FROM job_assignments ja
                  WHERE (ja.client_id = p.client_id
                         OR ja.engineering_contract_id = p.engineering_contract_id)
                    AND ja.engineering_contract_id IS NOT DISTINCT FROM p.engineering_contract_id
                  LIMIT 1
                )
                OR EXISTS (
                  SELECT 1 FROM ec_job_visibility ejv
                  WHERE ejv.engineering_contract_id = p.engineering_contract_id
                    AND p.engineering_contract_id IS NOT NULL
                  LIMIT 1
                )
              )
            LIMIT 1
          `;
          queryParams = [req.params.docId];
        }

        const { rows } = await pool.query(queryText, queryParams);

        if (!rows[0]) return res.status(404).json({ error: 'File not found' });
        const doc = rows[0];

        const resolved = path.resolve(uploadDir, doc.file_path);
        const uploadRoot = path.resolve(uploadDir) + path.sep;
        if (!resolved.startsWith(uploadRoot) && resolved !== path.resolve(uploadDir)) {
          return res.status(400).json({ error: 'Invalid file path' });
        }

        if (!fs.existsSync(resolved) || fs.statSync(resolved).isDirectory()) {
          return res.status(404).json({ error: 'File not found on disk' });
        }

        // Compute SHA-256 if not already stored.
        let sha256 = doc.sha256;
        if (!sha256) {
          const buf = await fsp.readFile(resolved);
          sha256 = crypto.createHash('sha256').update(buf).digest('hex');
          await pool.query(
            `UPDATE permit_documents SET sha256 = $1 WHERE id = $2`,
            [sha256, doc.id]
          );
        }

        // Honor If-None-Match for 304s.
        const clientEtag = req.headers['if-none-match'];
        if (clientEtag && clientEtag === `"${sha256}"`) {
          return res.status(304).end();
        }

        const contentType = doc.content_type || 'application/octet-stream';
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Length', doc.file_size || fs.statSync(resolved).size);
        res.setHeader('ETag', `"${sha256}"`);
        res.setHeader('Cache-Control', 'private, max-age=0, must-revalidate');
        res.setHeader('Content-Disposition', `attachment; filename="${doc.file_name}"`);
        res.sendFile(resolved);
      } catch (err) {
        console.error('[dwg-sync] GET /files error:', err.message);
        res.status(500).json({ error: 'Failed to serve file' });
      }
    }
  );

  // ─── GET /api/dwg-sync/state ─────────────────────────────────────────────────
  // Returns the calling user's sync cursors — one row per project they've
  // synced.  No admin filter: every logged-in user reads their own state only.
  app.get('/api/dwg-sync/state',
    requireAuth(),
    async (req, res) => {
      try {
        const { rows } = await pool.query(`
          SELECT project_id, last_synced_at, manifest_etag, client_label
          FROM project_dwg_sync_state
          WHERE user_id = $1
          ORDER BY last_synced_at DESC
        `, [req.user.id]);
        res.json({ state: rows });
      } catch (err) {
        console.error('[dwg-sync] GET /state error:', err.message);
        res.status(500).json({ error: 'Failed to load sync state' });
      }
    }
  );

  // ─── POST /api/dwg-sync/state ────────────────────────────────────────────────
  // Upsert a sync cursor for the calling user + project.
  // Body: { project_id, manifest_etag, client_label? }
  app.post('/api/dwg-sync/state',
    requireAuth(),
    async (req, res) => {
      const { project_id, manifest_etag, client_label } = req.body || {};
      if (!project_id) return res.status(400).json({ error: 'project_id required' });
      try {
        const { rows } = await pool.query(`
          INSERT INTO project_dwg_sync_state
                (user_id, project_id, last_synced_at, manifest_etag, client_label)
          VALUES ($1, $2, now(), $3, $4)
          ON CONFLICT (user_id, project_id) DO UPDATE
            SET last_synced_at = EXCLUDED.last_synced_at,
                manifest_etag  = EXCLUDED.manifest_etag,
                client_label   = EXCLUDED.client_label
          RETURNING last_synced_at
        `, [req.user.id, project_id, manifest_etag || null, client_label || null]);
        logAudit(pool, {
          req,
          action: 'dwg_sync.state_upsert',
          entity_type: 'dwg_sync_state',
          entity_id: project_id,
          after: { project_id, manifest_etag: manifest_etag || null, client_label: client_label || null, last_synced_at: rows[0].last_synced_at },
          source: 'user',
        }).catch(() => {});
        res.json({ ok: true, last_synced_at: rows[0].last_synced_at });
      } catch (err) {
        console.error('[dwg-sync] POST /state error:', err.message);
        res.status(500).json({ error: 'Failed to save sync state' });
      }
    }
  );
};
