// routes/admin.js — admin-only migration / cleanup tools.
//
// All endpoints are admin-only and idempotent — running twice is safe.
//
//   POST /api/_admin/migrate-nesting          — re-nest projects under the
//     correct rollup chain (Client → Team → Service Area → Project) and
//     prune any rollup folders that became empty.
//
//   GET  /api/_admin/orphan-files             — list files on disk in
//     UPLOAD_DIR with no matching permit_documents row.
//   POST /api/_admin/adopt-orphan             — attach one orphan to a
//     project via permit_documents insert.
//   POST /api/_admin/adopt-orphans-bulk       — attach ALL orphans to one
//     project at once.
//
//   GET  /api/_admin/hours-backfill-preview   — what would link if we ran
//     the backfill (matched / ambiguous / unmatched).
//   POST /api/_admin/hours-backfill           — link time_entries to user
//     accounts by matching staff.name to users.full_name / users.username.
//
// Dependencies passed via mw: requireAdmin, uploadDir (the resolved path to
// the upload directory). ensureRollupChain is required directly from
// portal_module since this module is its only consumer outside server.js.
//
// Extracted from server.js as part of CLEANUP_PLAN.md Track 1.3.

const fs = require('fs');
const path = require('path');
const { ensureRollupChain } = require('../portal_module');

module.exports = function installAdminRoutes(app, pool, mw) {
  const { requireAdmin, uploadDir } = mw;

  // Re-nest every real project under its correct rollup chain. Idempotent —
  // skips projects already under the right parent.
  //
  // 2026-05 owner change: empty rollups are KEPT. Earlier versions of this
  // route swept any rollup that ended up with no children, which surprised
  // owners who had hand-curated service-area folders they wanted to keep
  // for organizational reasons (so a future project lands in a known
  // folder instead of triggering ensureRollupChain to recreate it under
  // some auto-derived name). The sweep is removed entirely — rollups stay
  // until the owner deletes them explicitly via /with-tree.
  //
  // The dry-run gate is still useful: re-nesting can move dozens of
  // projects in one click, and previewing what's about to move is helpful
  // even though no DELETEs happen. Default (no confirm) returns dry_run:true
  // and rolls back; {confirm: true} runs for real.
  app.post('/api/_admin/migrate-nesting', requireAdmin, async (req, res) => {
    const body = req.body || {};
    const dryRun = body.confirm !== true || body.dry_run === true;

    let processed = 0, moved = 0, skipped = 0, failed = 0;
    const errors = [];
    const movements = [];
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const { rows: projects } = await client.query(
        `SELECT id, name, client_id, concentrator_id, program, job_id, parent_id
         FROM projects
         WHERE COALESCE(is_rollup, false) = false
         ORDER BY created_at ASC`
      );
      for (const p of projects) {
        processed++;
        try {
          if (!p.client_id) { skipped++; continue; }
          const correctParent = await ensureRollupChain(client, {
            client_id:          p.client_id,
            concentrator_id:    p.concentrator_id,
            service_area_label: null,
            job_id:             p.job_id
          });
          if (!correctParent) { skipped++; continue; }
          if (p.parent_id === correctParent) {
            skipped++;
          } else {
            await client.query('UPDATE projects SET parent_id = $1 WHERE id = $2',
              [correctParent, p.id]);
            moved++;
            if (movements.length < 50) {
              movements.push({ project_id: p.id, name: p.name, from: p.parent_id, to: correctParent });
            }
          }
        } catch (e) {
          failed++;
          errors.push({ project_id: p.id, name: p.name, error: e.message });
        }
      }

      if (dryRun) {
        await client.query('ROLLBACK');
      } else {
        await client.query('COMMIT');
      }

      res.json({
        dry_run: dryRun,
        processed, moved, skipped, failed,
        // obsolete_rollups_removed kept in the response shape for backward
        // compatibility with any caller (or test) that reads it. Always 0
        // now that the sweep is gone.
        obsolete_rollups_removed: 0,
        movements,
        errors: errors.slice(0, 20),
        hint: dryRun
          ? (moved === 0
              ? 'Preview: every project is already nested correctly. Nothing to move.'
              : `Preview: would re-nest ${moved} of ${processed} projects. Empty rollup folders are kept (no DELETEs). Re-POST with {"confirm": true} to apply.`)
          : (moved === 0
              ? 'Tree already nested correctly — no projects needed moving.'
              : `Re-nested ${moved} of ${processed} projects. Empty rollup folders were left in place.`)
      });
    } catch (e) {
      try { await client.query('ROLLBACK'); } catch {}
      res.status(500).json({ error: e.message, processed, moved, failed });
    } finally {
      client.release();
    }
  });

  // Adopt orphan files — files that exist on disk in UPLOAD_DIR but have no
  // matching row in permit_documents. Common causes:
  //   - Files uploaded under an older system that didn't write to permit_documents
  //   - Files that survived a DB wipe/restore but the DB lost its records
  //
  // This endpoint scans UPLOAD_DIR, compares to permit_documents.file_path, and
  // surfaces the orphans. POSTing with { project_id, file_path } adopts a single
  // orphan file by inserting a permit_documents row for it. Use the GET first
  // to see what's available, then POST one per file you want to attach.
  app.get('/api/_admin/orphan-files', requireAdmin, async (req, res) => {
    try {
      const onDisk = fs.readdirSync(uploadDir);
      const { rows: dbDocs } = await pool.query(
        `SELECT file_path FROM permit_documents`
      );
      const dbPaths = new Set(dbDocs.map(d => d.file_path));
      const orphans = onDisk
        .filter(f => !dbPaths.has(f))
        .map(f => {
          const stat = fs.statSync(path.join(uploadDir, f));
          // Recover the original filename — our naming convention is
          // ${uuid}_${originalname}, so split on the first underscore after
          // the uuid (uuids are 36 chars).
          const original = f.length > 37 && f[36] === '_' ? f.substring(37) : f;
          return {
            file_path: f,
            file_name: original,
            file_size: stat.size,
            modified: stat.mtime.toISOString()
          };
        })
        .sort((a, b) => b.modified.localeCompare(a.modified));
      res.json({
        orphan_count: orphans.length,
        orphans,
        hint: orphans.length === 0
          ? 'No orphan files — every file on disk is accounted for in the database.'
          : `${orphans.length} files on disk have no matching permit_documents row. POST {project_id, file_path} to /api/_admin/adopt-orphan to attach one.`
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/_admin/adopt-orphan', requireAdmin, async (req, res) => {
    const { project_id, file_path, doc_type, uploaded_by } = req.body;
    if (!project_id || !file_path) {
      return res.status(400).json({ error: 'project_id and file_path required' });
    }
    try {
      // Verify the file actually exists on disk
      const fullPath = path.join(uploadDir, file_path);
      if (!fs.existsSync(fullPath)) {
        return res.status(404).json({ error: 'File not found on disk: ' + file_path });
      }
      const stat = fs.statSync(fullPath);
      // Verify project exists
      const proj = await pool.query('SELECT name FROM projects WHERE id = $1', [project_id]);
      if (!proj.rows.length) {
        return res.status(404).json({ error: 'Project not found' });
      }
      // Recover original filename from our uuid-prefixed naming convention
      const original = file_path.length > 37 && file_path[36] === '_'
        ? file_path.substring(37)
        : file_path;
      const { rows } = await pool.query(`
        INSERT INTO permit_documents
          (project_id, doc_type, file_name, file_path, file_size, revision_number, uploaded_by, notes)
        VALUES ($1, $2, $3, $4, $5, 1, $6, $7)
        RETURNING *`,
        [project_id, doc_type || 'document', original, file_path, stat.size,
         uploaded_by || 'migrated', 'Adopted from disk via migration tool']
      );
      res.json({ adopted: rows[0], project_name: proj.rows[0].name });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // Bulk adopt — assigns ALL orphan files to a single project at once. Useful
  // when files were uploaded for a specific project but the DB rows got lost.
  // More commonly, use /api/_admin/orphan-files + targeted POSTs to /adopt-orphan
  // for each file individually.
  app.post('/api/_admin/adopt-orphans-bulk', requireAdmin, async (req, res) => {
    const { project_id, doc_type, uploaded_by } = req.body;
    if (!project_id) return res.status(400).json({ error: 'project_id required' });
    try {
      const proj = await pool.query('SELECT name FROM projects WHERE id = $1', [project_id]);
      if (!proj.rows.length) return res.status(404).json({ error: 'Project not found' });

      const onDisk = fs.readdirSync(uploadDir);
      const { rows: dbDocs } = await pool.query(`SELECT file_path FROM permit_documents`);
      const dbPaths = new Set(dbDocs.map(d => d.file_path));
      const orphans = onDisk.filter(f => !dbPaths.has(f));

      let adopted = 0;
      for (const f of orphans) {
        const stat = fs.statSync(path.join(uploadDir, f));
        const original = f.length > 37 && f[36] === '_' ? f.substring(37) : f;
        await pool.query(`
          INSERT INTO permit_documents
            (project_id, doc_type, file_name, file_path, file_size, revision_number, uploaded_by, notes)
          VALUES ($1, $2, $3, $4, $5, 1, $6, $7)`,
          [project_id, doc_type || 'document', original, f, stat.size,
           uploaded_by || 'migrated', 'Bulk-adopted from disk via migration tool']
        );
        adopted++;
      }
      res.json({ adopted, project_name: proj.rows[0].name });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // ─── Backfill hours: link existing time_entries to user accounts by name ─
  // Workflow:
  //   - GET /api/_admin/hours-backfill-preview → returns who would match what.
  //     Lets admin sanity-check before committing. Shows matched, ambiguous,
  //     and unmatched groups.
  //   - POST /api/_admin/hours-backfill → actually writes user_id on time_entries.
  //
  // Match rule: case-insensitive equality between staff.name and users.full_name.
  // We also try matching against username as a fallback (in case "jsmith" is
  // what got typed in the time entry instead of "Jane Smith").
  //
  // This only updates rows where time_entries.user_id IS NULL — so re-running
  // after admin manually fixed a few never overwrites their corrections.

  app.get('/api/_admin/hours-backfill-preview', requireAdmin, async (req, res) => {
    try {
      const { rows } = await pool.query(`
        WITH staff_with_user AS (
          SELECT
            s.id as staff_id,
            s.name as staff_name,
            (SELECT u.id FROM users u
              WHERE LOWER(u.full_name) = LOWER(s.name)
                 OR LOWER(u.username)  = LOWER(s.name)
              LIMIT 1) as matched_user_id,
            (SELECT u.username FROM users u
              WHERE LOWER(u.full_name) = LOWER(s.name)
                 OR LOWER(u.username)  = LOWER(s.name)
              LIMIT 1) as matched_username,
            (SELECT COUNT(*)::int FROM users u
              WHERE LOWER(u.full_name) = LOWER(s.name)
                 OR LOWER(u.username)  = LOWER(s.name)) as match_count
          FROM staff s
        )
        SELECT
          sw.staff_name,
          sw.matched_username,
          sw.match_count,
          (SELECT COUNT(*)::int FROM time_entries te
            WHERE te.staff_id = sw.staff_id AND te.user_id IS NULL) as entries_to_link
        FROM staff_with_user sw
        ORDER BY sw.staff_name
      `);
      const matched   = rows.filter(r => r.match_count === 1 && r.entries_to_link > 0);
      const ambiguous = rows.filter(r => r.match_count > 1);
      const unmatched = rows.filter(r => r.match_count === 0 && r.entries_to_link > 0);
      const noEntries = rows.filter(r => r.entries_to_link === 0);
      const totalEntries = matched.reduce((s, r) => s + r.entries_to_link, 0);
      res.json({
        summary: {
          staff_total: rows.length,
          staff_with_user_match: matched.length,
          staff_ambiguous: ambiguous.length,
          staff_unmatched: unmatched.length,
          time_entries_to_link: totalEntries,
        },
        matched, ambiguous, unmatched, noEntries
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/_admin/hours-backfill', requireAdmin, async (req, res) => {
    try {
      // Single UPDATE that links every NULL-user_id time entry to a user whose
      // full_name (or username) matches the staff name on the entry. We only
      // do this when the match is unambiguous (count = 1) so we don't blindly
      // assign hours to the wrong person if two users happen to share a name.
      const result = await pool.query(`
        UPDATE time_entries te SET user_id = matched.user_id
        FROM (
          SELECT s.id as staff_id, u.id as user_id
          FROM staff s
          JOIN users u
            ON LOWER(u.full_name) = LOWER(s.name)
            OR LOWER(u.username)  = LOWER(s.name)
          GROUP BY s.id, u.id
          HAVING COUNT(*) OVER (PARTITION BY s.id) = 1
        ) matched
        WHERE te.staff_id = matched.staff_id AND te.user_id IS NULL
      `);
      res.json({
        ok: true,
        time_entries_updated: result.rowCount,
        hint: result.rowCount === 0
          ? 'No entries needed linking — either everything was already linked, or no staff names match a user full_name. Use the Preview button to see why.'
          : `Linked ${result.rowCount} time entries to user accounts based on matching name/full_name.`
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // ─── Orphan-file prune ─────────────────────────────────────────────────
  // /api/_admin/orphan-files lists what's on disk with no DB row. The
  // automation scheduler calls pruneOrphanFiles() once a day to actually
  // delete orphans older than 7 days. Manual endpoint here lets the admin
  // run the prune sooner from Settings → Migration Tools, with explicit
  // confirm to avoid accidental deletes.
  //
  // Two-stage delete (preview + confirm) so the destructive path is
  // never reached without acknowledgement.
  app.post('/api/_admin/prune-orphan-files', requireAdmin, async (req, res) => {
    const body = req.body || {};
    const dryRun = body.confirm !== true || body.dry_run === true;
    const olderThanHours = Number.isFinite(body.older_than_hours)
      ? Math.max(0, body.older_than_hours)
      : 7 * 24;  // default: 7 days
    try {
      const result = await pruneOrphanFiles({ pool, uploadDir, olderThanHours, dryRun });
      res.json({
        dry_run: dryRun,
        older_than_hours: olderThanHours,
        candidates: result.candidates.length,
        deleted: result.deleted,
        skipped_too_recent: result.skippedTooRecent,
        bytes_freed: result.bytesFreed,
        sample: result.candidates.slice(0, 20).map(c => ({ file_path: c.file_path, age_hours: c.ageHours, file_size: c.size })),
        hint: dryRun
          ? `Preview: would delete ${result.candidates.length} orphan files older than ${olderThanHours}h `
            + `(${(result.bytesFreed / 1024 / 1024).toFixed(1)} MB freed). `
            + `Re-POST with {"confirm": true} to apply.`
          : `Deleted ${result.deleted} orphan files (${(result.bytesFreed / 1024 / 1024).toFixed(1)} MB freed). `
            + `${result.skippedTooRecent} files were left in place because they're newer than ${olderThanHours}h.`,
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
};

// ─── Helper: orphan-file prune ───────────────────────────────────────────
// Exported so the automation scheduler can call this without re-implementing.
// Scans top-level uploadDir (where permit_documents files live) and the
// invoice-templates/ subdir, builds a set of in-use paths from
// permit_documents.file_path and invoice_templates.reference_pdf_path, and
// returns / deletes anything on disk older than `olderThanHours` that
// isn't referenced.
//
// Conservative defaults: 7-day age cutoff so the undo TTL (60s) and any
// manual recovery window safely pass before files actually disappear.
async function pruneOrphanFiles({ pool, uploadDir, olderThanHours = 168, dryRun = true }) {
  const fs = require('fs');
  const path = require('path');
  const out = { candidates: [], deleted: 0, bytesFreed: 0, skippedTooRecent: 0 };
  if (!uploadDir || !fs.existsSync(uploadDir)) return out;

  // In-use paths for the top-level upload directory
  const dbDocs = await pool.query(`SELECT file_path FROM permit_documents`).catch(() => ({ rows: [] }));
  const inUseTop = new Set(dbDocs.rows.map(d => d.file_path));

  // In-use paths for the invoice-templates/ subdir. invoice_templates stores
  // reference_pdf_path as a full filesystem path; we extract the basename.
  const tplRows = await pool.query(
    `SELECT reference_pdf_path FROM invoice_templates WHERE reference_pdf_path IS NOT NULL`
  ).catch(() => ({ rows: [] }));
  const inUseTpl = new Set(tplRows.rows.map(r => path.basename(r.reference_pdf_path)));

  const cutoffMs = Date.now() - olderThanHours * 60 * 60 * 1000;

  function scanDir(dir, inUseSet, label) {
    let entries = [];
    try { entries = fs.readdirSync(dir); } catch { return; }
    for (const f of entries) {
      const full = path.join(dir, f);
      let stat;
      try { stat = fs.statSync(full); } catch { continue; }
      if (stat.isDirectory()) continue;  // don't recurse into other subdirs
      if (inUseSet.has(f)) continue;
      const ageHours = (Date.now() - stat.mtimeMs) / (60 * 60 * 1000);
      if (stat.mtimeMs > cutoffMs) {
        out.skippedTooRecent++;
        continue;
      }
      out.candidates.push({ file_path: f, full_path: full, size: stat.size, ageHours, label });
    }
  }

  scanDir(uploadDir, inUseTop, 'top');
  scanDir(path.join(uploadDir, 'invoice-templates'), inUseTpl, 'invoice-templates');

  if (!dryRun) {
    for (const c of out.candidates) {
      try {
        require('fs').unlinkSync(c.full_path);
        out.deleted++;
        out.bytesFreed += c.size;
      } catch (e) {
        // Best-effort — file may have been deleted by another process,
        // or permission denied. Log and continue.
        console.error('[admin:prune-orphan-files] unlink failed:', c.full_path, e && e.message);
      }
    }
  } else {
    out.bytesFreed = out.candidates.reduce((s, c) => s + c.size, 0);
  }
  return out;
}

module.exports.pruneOrphanFiles = pruneOrphanFiles;
