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
  // skips projects already under the right parent. Also sweeps orphaned
  // (childless) rollup folders left behind by old nesting attempts.
  app.post('/api/_admin/migrate-nesting', requireAdmin, async (req, res) => {
    let processed = 0, moved = 0, skipped = 0, failed = 0;
    let obsoleteRollupsRemoved = 0;
    const errors = [];
    try {
      // Get every real project (no rollups, since rollups ARE the nesting structure)
      const { rows: projects } = await pool.query(
        `SELECT id, name, client_id, concentrator_id, project_type_id, job_id, parent_id
         FROM projects
         WHERE COALESCE(is_rollup, false) = false
         ORDER BY created_at ASC`
      );
      for (const p of projects) {
        processed++;
        try {
          // Skip projects without a client — they can't be nested.
          if (!p.client_id) { skipped++; continue; }

          // Migration can't recover service_area_label for legacy projects
          // (the field is new). PSC projects with a concentrator_id will get
          // a Service Area folder via that path. Non-PSC legacy projects
          // without a concentrator will land directly under the Team folder
          // until an admin edits them and adds a service area label.
          const correctParent = await ensureRollupChain(pool, {
            client_id:          p.client_id,
            concentrator_id:    p.concentrator_id,
            service_area_label: null,
            job_id:             p.job_id
          });

          if (!correctParent) { skipped++; continue; }

          if (p.parent_id === correctParent) {
            skipped++;
          } else {
            await pool.query('UPDATE projects SET parent_id = $1 WHERE id = $2',
              [correctParent, p.id]);
            moved++;
          }
        } catch (e) {
          failed++;
          errors.push({ project_id: p.id, name: p.name, error: e.message });
        }
      }

      // Cleanup pass — delete any rollup folder that no longer has children.
      // This catches:
      //   - project_type rollups from the very first nesting attempt
      //   - obsolete team rollups using the old labels ('Shared (Design + Permitting)',
      //     'Shared / Unassigned') after the team-key collapse normalized everything
      //     to 'design' / 'permitting' / 'shared'
      //   - service_area rollups whose underlying projects moved away
      //   - empty client rollups left after their last project moved
      // Loop because deleting a leaf rollup can make its parent become empty too.
      // Bound at 10 passes for safety.
      for (let pass = 0; pass < 10; pass++) {
        const { rows: deleted } = await pool.query(`
          DELETE FROM projects
          WHERE is_rollup = TRUE
            AND NOT EXISTS (
              SELECT 1 FROM projects child WHERE child.parent_id = projects.id
            )
          RETURNING id, rollup_level, name
        `);
        if (deleted.length === 0) break;
        obsoleteRollupsRemoved += deleted.length;
      }

      res.json({
        processed, moved, skipped, failed,
        obsolete_rollups_removed: obsoleteRollupsRemoved,
        errors: errors.slice(0, 20),  // cap so response stays small
        hint: moved === 0 && obsoleteRollupsRemoved === 0 && processed > 0
          ? 'No projects needed re-nesting and no obsolete rollups were found — the tree was already clean.'
          : `Re-nested ${moved} of ${processed} projects` + (obsoleteRollupsRemoved > 0 ? ` and removed ${obsoleteRollupsRemoved} obsolete service-area/project-type folders.` : '.')
      });
    } catch (e) {
      res.status(500).json({ error: e.message, processed, moved, failed });
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
};
