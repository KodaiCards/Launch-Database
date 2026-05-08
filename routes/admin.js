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
const bcrypt = require('bcryptjs');
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

  // GET /api/_admin/db-sizes — diagnostic to find which tables are
  // eating Postgres disk. Removes the need for the admin to find a
  // psql shell on Railway. Returns the top 20 tables by total size
  // (heap + indexes + TOAST), with live + dead row counts so a bloated
  // table is obvious. Visit /api/_admin/db-sizes in the browser while
  // logged in as admin.
  app.get('/api/_admin/db-sizes', requireAdmin, async (req, res) => {
    try {
      const { rows } = await pool.query(`
        SELECT
          schemaname || '.' || relname           AS table_name,
          pg_total_relation_size(relid)::bigint  AS total_bytes,
          pg_relation_size(relid)::bigint        AS heap_bytes,
          pg_indexes_size(relid)::bigint         AS index_bytes,
          pg_size_pretty(pg_total_relation_size(relid)) AS total_size,
          pg_size_pretty(pg_relation_size(relid))       AS heap_size,
          pg_size_pretty(pg_indexes_size(relid))        AS index_size,
          n_live_tup::bigint                     AS live_rows,
          n_dead_tup::bigint                     AS dead_rows
        FROM pg_stat_user_tables
        ORDER BY pg_total_relation_size(relid) DESC
        LIMIT 20
      `);
      const dbSizeR = await pool.query(
        `SELECT pg_size_pretty(pg_database_size(current_database())) AS db_size,
                pg_database_size(current_database())::bigint AS db_bytes`);
      res.json({
        database_size:  dbSizeR.rows[0].db_size,
        database_bytes: dbSizeR.rows[0].db_bytes,
        top_tables: rows,
        hint: 'If time_entry_audit dominates, POST /api/_admin/audit-cleanup '
            + 'to prune it. To return disk space to the OS afterwards, '
            + 'POST that endpoint with {"vacuum_full": true} during a '
            + 'maintenance window (locks the table for the duration).',
      });
    } catch (e) {
      console.error('[admin:db-sizes]', e && e.message);
      res.status(500).json({ error: e.message });
    }
  });

  // POST /api/_admin/audit-cleanup — one-shot manual audit-table
  // cleanup. Used to reclaim Postgres disk when the daily scheduler
  // hasn't kept up (e.g. after an initial deploy where months of
  // history accumulated before the retention task existed). The
  // scheduler also runs runAuditCleanup() once a day on its own.
  //
  // Body params (all optional):
  //   retain_trivial_days  — keep meaningful=FALSE rows newer than this
  //                          (default 90)
  //   retain_hard_months   — keep ANY rows newer than this (default 18)
  //   vacuum_full          — when TRUE, follow up with VACUUM FULL.
  //                          ACCESS EXCLUSIVE lock on time_entry_audit
  //                          for the duration; only run during a
  //                          maintenance window.
  app.post('/api/_admin/audit-cleanup', requireAdmin, async (req, res) => {
    const { runAuditCleanup } = require('../automation');
    const body = req.body || {};
    try {
      const result = await runAuditCleanup(pool, {
        retainTrivialDays: body.retain_trivial_days,
        retainHardMonths:  body.retain_hard_months,
      });
      let vacuumFullRan = false;
      let vacuumFullError = null;
      if (body.vacuum_full === true) {
        try {
          await pool.query(`VACUUM FULL time_entry_audit`);
          vacuumFullRan = true;
        } catch (e) {
          vacuumFullError = e.message;
        }
      }
      res.json({
        ...result,
        vacuum_full_ran:  vacuumFullRan,
        vacuum_full_error: vacuumFullError,
        hint: result.trivial_deleted + result.hard_deleted === 0
          ? 'No rows old enough to prune at the requested retention windows.'
          : `Removed ${result.trivial_deleted + result.hard_deleted} rows. `
            + (vacuumFullRan
                ? 'VACUUM FULL completed — disk space returned to OS.'
                : 'Plain VACUUM ran (table space marked reusable). '
                + 'POST {"vacuum_full": true} during a maintenance window to return disk space to the OS.'),
      });
    } catch (e) {
      console.error('[admin:audit-cleanup]', e && e.message);
      res.status(500).json({ error: e.message });
    }
  });

  // GET /api/_admin/rus-hours-debug — diagnostic for the RUS tab
  // hours-attribution gap. Shows which time_entries fall inside RUS
  // projects but aren't captured by the leaf-matching CTE, and explains
  // why each candidate leaf didn't match.
  //
  // Query params:
  //   period — 'ytd' (default) or 'month'
  //   month  — 'YYYY-MM' when period=month
  //
  // Returns:
  //   period, summary (total_entries_in_rus_chain, entries_attributed_to_leaf,
  //                    entries_unattributed, unattributed_hours_total),
  //   unattributed_breakdown — per-entry objects with candidate_leaves_under_this_project
  app.get('/api/_admin/rus-hours-debug', requireAdmin, async (req, res) => {
    const period = (req.query.period || 'ytd').toLowerCase();
    let monthYear = req.query.month;
    let startDate, endDate;
    const now = new Date();
    if (period === 'month') {
      if (!monthYear || !/^\d{4}-\d{2}$/.test(monthYear)) {
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        monthYear = `${yyyy}-${mm}`;
      }
      const [y, m] = monthYear.split('-').map(Number);
      startDate = `${y}-${String(m).padStart(2,'0')}-01`;
      const last = new Date(y, m, 0).getDate();
      endDate = `${y}-${String(m).padStart(2,'0')}-${String(last).padStart(2,'0')}`;
    } else {
      const yyyy = now.getFullYear();
      startDate = `${yyyy}-01-01`;
      endDate = now.toISOString().slice(0,10);
    }

    try {
      // 1. Find every time_entry that sits on any project in a RUS chain
      //    (i.e., the project's contract has engineering_contract.program='rus',
      //    OR a descendant leaf's contract does). We use a recursive walk to
      //    cover entries on rollups whose leaf children are RUS.
      //
      //    "Attributed" = the entry would be counted by the current CTE in
      //    inspection.js, i.e. either:
      //      - entry is directly on a RUS leaf, OR
      //      - entry is on an ancestor of a RUS leaf AND job_name_lc IS NOT NULL
      //        AND LOWER(entry.job_title) = job_name_lc.
      const { rows: allRusEntries } = await pool.query(`
        WITH RECURSIVE
        -- All leaf projects under RUS engineering contracts
        rus_leaves AS (
          SELECT p.id AS leaf_id, p.job_id, p.parent_id,
                 LOWER(j.name) AS job_name_lc
            FROM projects p
            LEFT JOIN jobs j           ON j.id = p.job_id
            LEFT JOIN contracts c      ON c.id = p.contract_id
            LEFT JOIN engineering_contracts ec ON ec.id = c.engineering_contract_id
           WHERE COALESCE(p.is_rollup, FALSE) = FALSE
             AND ec.program = 'rus'
        ),
        -- Ancestor chain for each RUS leaf (leaf → root)
        leaf_ancestors AS (
          SELECT leaf_id, leaf_id AS ancestor_id, job_name_lc, 0 AS depth
            FROM rus_leaves
          UNION ALL
          SELECT la.leaf_id, p.parent_id, la.job_name_lc, la.depth + 1
            FROM leaf_ancestors la
            JOIN projects p ON p.id = la.ancestor_id
           WHERE p.parent_id IS NOT NULL AND la.depth < 10
        )
        -- All time_entries in the date range that touch any node in any RUS chain
        SELECT DISTINCT te.id AS entry_id, te.hours, te.project_id, te.job_title,
               te.entry_date,
               p.name AS project_name, p.is_rollup,
               -- Was it attributed? Direct-on-leaf always yes; ancestor only if job_name match
               CASE
                 WHEN la_direct.leaf_id IS NOT NULL AND la_direct.depth = 0
                   THEN TRUE   -- entry directly on a RUS leaf
                 WHEN la_match.leaf_id IS NOT NULL
                   THEN TRUE   -- ancestor entry with matching job_title
                 ELSE FALSE
               END AS attributed
          FROM time_entries te
          JOIN projects p ON p.id = te.project_id
          -- Join to see if this entry's project_id is any node in a RUS chain
          JOIN leaf_ancestors la ON la.ancestor_id = te.project_id
          -- Check for direct-leaf attribution (depth=0)
          LEFT JOIN leaf_ancestors la_direct
                 ON la_direct.ancestor_id = te.project_id
                AND la_direct.leaf_id = la.leaf_id
                AND la_direct.depth = 0
          -- Check for ancestor+job_title match attribution
          LEFT JOIN leaf_ancestors la_match
                 ON la_match.ancestor_id = te.project_id
                AND la_match.leaf_id = la.leaf_id
                AND la_match.job_name_lc IS NOT NULL
                AND LOWER(COALESCE(te.job_title, '')) = la_match.job_name_lc
         WHERE te.entry_date BETWEEN $1 AND $2
      `, [startDate, endDate]);

      const totalEntries = allRusEntries.length;
      const attributed = allRusEntries.filter(e => e.attributed);
      const unattributed = allRusEntries.filter(e => !e.attributed);
      const unattributedHoursTotal = unattributed.reduce((s, e) => s + (parseFloat(e.hours) || 0), 0);

      // 2. For each unattributed entry, find the candidate RUS leaves that live
      //    under the same rollup (or ARE the project if it's a leaf with no job),
      //    and explain why each didn't match.
      const { rows: rusLeaves } = await pool.query(`
        WITH RECURSIVE
        rus_leaves AS (
          SELECT p.id AS leaf_id, p.id AS node_id, p.name AS leaf_name,
                 p.parent_id AS leaf_parent_id, p.job_id,
                 j.name AS job_name, LOWER(j.name) AS job_name_lc
            FROM projects p
            LEFT JOIN jobs j ON j.id = p.job_id
            LEFT JOIN contracts c ON c.id = p.contract_id
            LEFT JOIN engineering_contracts ec ON ec.id = c.engineering_contract_id
           WHERE COALESCE(p.is_rollup, FALSE) = FALSE AND ec.program = 'rus'
        ),
        leaf_ancestors AS (
          SELECT leaf_id, leaf_name, job_id, job_name, job_name_lc,
                 leaf_id AS ancestor_id, 0 AS depth
            FROM rus_leaves
          UNION ALL
          SELECT la.leaf_id, la.leaf_name, la.job_id, la.job_name, la.job_name_lc,
                 p.parent_id, la.depth + 1
            FROM leaf_ancestors la
            JOIN projects p ON p.id = la.ancestor_id
           WHERE p.parent_id IS NOT NULL AND la.depth < 10
        )
        SELECT ancestor_id AS rollup_id, leaf_id, leaf_name, job_id, job_name, job_name_lc, depth
          FROM leaf_ancestors
      `);

      // Index leaves-by-rollup
      const leavesByRollup = new Map();
      for (const row of rusLeaves) {
        const rid = row.rollup_id;
        if (!leavesByRollup.has(rid)) leavesByRollup.set(rid, []);
        leavesByRollup.get(rid).push(row);
      }

      // Build breakdown — group unattributed by project+job_title for compactness
      const groupKey = e => `${e.project_id}|${e.job_title || ''}`;
      const groups = new Map();
      for (const e of unattributed) {
        const k = groupKey(e);
        if (!groups.has(k)) {
          groups.set(k, {
            project_id: e.project_id,
            project_name: e.project_name,
            is_rollup: e.is_rollup,
            job_title_on_entry: e.job_title || null,
            hours: 0,
            entry_count: 0,
          });
        }
        const g = groups.get(k);
        g.hours += parseFloat(e.hours) || 0;
        g.entry_count++;
      }

      const breakdown = [];
      for (const g of groups.values()) {
        const candidates = (leavesByRollup.get(g.project_id) || [])
          .filter((v, i, arr) => arr.findIndex(x => x.leaf_id === v.leaf_id) === i);  // dedupe

        const candidateDetails = candidates.map(leaf => {
          const entryTitle = (g.job_title_on_entry || '').toLowerCase();
          let would_match = false;
          let why = '';
          if (!leaf.job_id) {
            why = 'leaf has no job_id assigned';
          } else if (!leaf.job_name_lc) {
            why = 'leaf job_name is NULL';
          } else if (entryTitle === leaf.job_name_lc) {
            would_match = true;
            why = 'exact match (but may be depth issue or duplicate attribution)';
          } else if (!entryTitle) {
            why = `entry job_title is empty/null; leaf job_name='${leaf.job_name}'`;
          } else if (entryTitle === 'other') {
            why = `entry job_title='Other' doesn't match leaf job_name='${leaf.job_name}'`;
          } else if (leaf.job_name_lc.includes(entryTitle) || entryTitle.includes(leaf.job_name_lc)) {
            why = `substring near-miss: entry='${g.job_title_on_entry}' vs leaf='${leaf.job_name}' (depth ${leaf.depth})`;
          } else {
            why = `job_title='${g.job_title_on_entry}' doesn't match leaf job_name='${leaf.job_name}' (depth ${leaf.depth})`;
          }
          return { id: leaf.leaf_id, name: leaf.leaf_name, job_name: leaf.job_name, would_match, why };
        });

        // Best guess: sole leaf with a non-null job_id
        const viableLeaves = candidates.filter(l => l.job_id);
        const best_guess_leaf_id = viableLeaves.length === 1 ? viableLeaves[0].leaf_id : null;

        breakdown.push({
          ...g,
          candidate_leaves_under_this_project: candidateDetails,
          best_guess_leaf_id,
        });
      }

      const label = period === 'month' ? monthYear : `${now.getFullYear()} YTD`;
      res.json({
        period: { start: startDate, end: endDate, mode: period, label },
        summary: {
          total_entries_in_rus_chain: totalEntries,
          entries_attributed_to_leaf: attributed.length,
          entries_unattributed: unattributed.length,
          unattributed_hours_total: Math.round(unattributedHoursTotal * 100) / 100,
        },
        unattributed_breakdown: breakdown,
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // GET /api/_admin/import-trace — list recent CSV imports so the
  // owner can pick a batch_id without guessing. Returns the most recent
  // 50 distinct import_batch values with their entry count, total
  // hours, and earliest/latest entry dates.
  app.get('/api/_admin/import-trace', requireAdmin, async (req, res) => {
    try {
      const { rows } = await pool.query(`
        SELECT import_batch,
               COUNT(*)::int AS entry_count,
               SUM(hours)::float AS total_hours,
               MIN(entry_date)::text AS first_date,
               MAX(entry_date)::text AS last_date,
               MIN(created_at) AS imported_at
          FROM time_entries
         WHERE import_batch IS NOT NULL
         GROUP BY import_batch
         ORDER BY MIN(created_at) DESC
         LIMIT 50
      `);
      res.json({
        message: 'Recent import batches. Append /:batch_id to drill into one.',
        batches: rows,
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // POST /api/_admin/reattribute-rollup-hours — moves time_entries
  // that were mis-attributed to a rollup project onto a real leaf
  // descendant matching the entry's job_title.
  //
  // Owner-flagged 2026-05-06: existing CSV imports landed entries on
  // rollups (the rollup carried the WO#; leaves didn't). The pickProject
  // fix in hours_csv.js stops this for FUTURE imports, but already-
  // imported batches still need their entries moved.
  //
  // Body:
  //   { dry_run?: true,             // default true — safe; preview
  //     import_batch?: 'string',    // optional — limit to one batch
  //     project_ids?: ['uuid', ...] // optional — limit to these rollup ids
  //   }
  //
  // Logic:
  //   1. Find time_entries whose project_id is a rollup (is_rollup=TRUE
  //      OR has children) AND whose job_title is non-empty.
  //   2. For each, walk descendants of that rollup looking for a LEAF
  //      with job_name matching the entry's job_title (case-
  //      insensitive). Same job mapping rules as the CSV importer.
  //   3. If exactly one leaf matches, the entry moves to it; otherwise
  //      the entry is reported and skipped.
  //   4. After moving, run updateProjectHours on both the old rollup
  //      and the new leaf so actual_hours reflects the move.
  app.post('/api/_admin/reattribute-rollup-hours', requireAdmin, async (req, res) => {
    const body = req.body || {};
    const dryRun = body.dry_run !== false;  // default true
    const batchFilter = body.import_batch || null;
    const projectFilter = Array.isArray(body.project_ids) && body.project_ids.length
      ? body.project_ids : null;

    try {
      // 1. Pull every time_entry currently on a rollup-or-parent.
      const filters = [`(p.is_rollup = TRUE OR EXISTS (SELECT 1 FROM projects ch WHERE ch.parent_id = p.id))`];
      const params = [];
      let i = 1;
      if (batchFilter) { filters.push(`te.import_batch = $${i++}`); params.push(batchFilter); }
      if (projectFilter) { filters.push(`te.project_id = ANY($${i++}::uuid[])`); params.push(projectFilter); }

      const { rows: candidates } = await pool.query(`
        SELECT te.id AS entry_id, te.hours, te.entry_date, te.job_title,
               te.project_id, p.name AS project_name, p.is_rollup,
               te.staff_id, te.import_batch
          FROM time_entries te
          JOIN projects p ON p.id = te.project_id
         WHERE ${filters.join(' AND ')}
           AND te.job_title IS NOT NULL AND te.job_title <> ''
         ORDER BY te.project_id, te.entry_date
      `, params);

      // 2. For each unique (parent_project_id, job_title), look up a
      //    matching leaf descendant. Cache to avoid repeated queries
      //    for the same combo.
      const targetCache = new Map();
      async function findLeafFor(parentId, jobTitle) {
        const key = parentId + '|' + jobTitle.toLowerCase();
        if (targetCache.has(key)) return targetCache.get(key);
        const { rows } = await pool.query(`
          WITH RECURSIVE descendants AS (
            SELECT id, parent_id, name, job_id, is_rollup,
                   EXISTS (SELECT 1 FROM projects ch WHERE ch.parent_id = projects.id) AS has_children,
                   0 AS depth
              FROM projects WHERE id = $1
            UNION ALL
            SELECT p.id, p.parent_id, p.name, p.job_id, p.is_rollup,
                   EXISTS (SELECT 1 FROM projects ch WHERE ch.parent_id = p.id) AS has_children,
                   d.depth + 1
              FROM projects p JOIN descendants d ON p.parent_id = d.id
             WHERE d.depth < 10
          )
          SELECT d.id, d.name, j.name AS job_name
            FROM descendants d
            LEFT JOIN jobs j ON j.id = d.job_id
           WHERE d.has_children = FALSE
             AND COALESCE(d.is_rollup, FALSE) = FALSE
             AND j.name IS NOT NULL
             AND LOWER(j.name) = LOWER($2)
           ORDER BY d.depth ASC
           LIMIT 2
        `, [parentId, jobTitle]);
        // Require exactly one match — ambiguous trees stay manual.
        const result = rows.length === 1 ? rows[0] : null;
        targetCache.set(key, result);
        return result;
      }

      // 3. Plan the moves. Each plan row is one entry → leaf.
      const moves = [];
      const skipped = [];
      for (const c of candidates) {
        const target = await findLeafFor(c.project_id, c.job_title);
        if (target) {
          moves.push({
            entry_id: c.entry_id,
            from_project_id: c.project_id,
            from_project_name: c.project_name,
            to_project_id: target.id,
            to_project_name: target.name,
            hours: c.hours,
            entry_date: c.entry_date,
            job_title: c.job_title,
            staff_id: c.staff_id,
          });
        } else {
          skipped.push({
            entry_id: c.entry_id,
            project_name: c.project_name,
            job_title: c.job_title,
            reason: 'no leaf descendant with matching job_name (or multiple matches)',
          });
        }
      }

      if (dryRun) {
        return res.json({
          dry_run: true,
          would_move: moves.length,
          would_skip: skipped.length,
          moves: moves.slice(0, 100),
          skipped: skipped.slice(0, 50),
          message: `Dry run. Would move ${moves.length} time entries off ${new Set(moves.map(m => m.from_project_id)).size} rollup(s) onto ${new Set(moves.map(m => m.to_project_id)).size} leaf(ves). Pass {"dry_run": false} to apply.`,
        });
      }

      // 4. Apply. Group by entry_id and UPDATE project_id; recompute
      //    actual_hours on the affected projects after.
      const client = await pool.connect();
      const affectedProjects = new Set();
      try {
        await client.query('BEGIN');
        for (const m of moves) {
          await client.query(
            `UPDATE time_entries SET project_id = $1 WHERE id = $2`,
            [m.to_project_id, m.entry_id]
          );
          affectedProjects.add(m.from_project_id);
          affectedProjects.add(m.to_project_id);
        }
        await client.query('COMMIT');
      } catch (e) {
        try { await client.query('ROLLBACK'); } catch {}
        client.release();
        return res.status(500).json({ error: e.message });
      }
      client.release();

      // updateProjectHours walks parent chain so calling it on each
      // leaf + each rollup propagates correctly. Imported lazily because
      // routes/_helpers.js carries a pool reference at module load.
      const { updateProjectHours } = require('./_helpers');
      for (const pid of affectedProjects) {
        try { await updateProjectHours(pid); }
        catch (e) { console.error('[reattribute] updateProjectHours failed:', pid, e.message); }
      }

      res.json({
        dry_run: false,
        moved: moves.length,
        skipped: skipped.length,
        affected_project_count: affectedProjects.size,
        skipped_sample: skipped.slice(0, 50),
        message: `Moved ${moves.length} time entries; recomputed actual_hours on ${affectedProjects.size} projects. Refresh the Hours tab and RUS tab to see the new attribution.`,
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // GET /api/_admin/import-trace/:batch_id — diagnostic for an import.
  //
  // Returns where each time_entries row from the batch landed and what
  // the project's RUS/billing wiring looks like, so the owner can
  // verify an import end-to-end without manually running SQL.
  // Owner-flagged 2026-05-06: multiple shipped fixes claimed to work
  // but the visible state didn't reflect it. This endpoint is the
  // self-serve "did the import actually do what I think it did" tool.
  //
  // Use cases:
  //   - "I imported 94 rows but RUS tab shows 0 hours" — surface
  //     each project's contract_id / engineering_contract.program. If
  //     program != 'rus', the RUS tab silently excludes the project.
  //   - "Projects tab shows 0 hrs on the rollup" — surface each
  //     project's actual_hours (the persisted rollup value) so owner
  //     can spot whether updateProjectHours actually fired.
  //   - "I expected hours to land on Project A but they're on Project B"
  //     — surface the project name + parent chain.
  //
  // The endpoint is read-only. Cap at 1000 rows so a malformed batch
  // can't OOM the response.
  app.get('/api/_admin/import-trace/:batch_id', requireAdmin, async (req, res) => {
    const batchId = req.params.batch_id;
    if (!batchId) return res.status(400).json({ error: 'batch_id is required' });
    try {
      // Per-entry: row id, date, hours, job_title, project info, ec.program,
      // and a parent chain so owner can see where each entry sits in the tree.
      const { rows: entries } = await pool.query(
        `SELECT te.id AS time_entry_id, te.entry_date, te.hours, te.job_title,
                te.staff_id, s.name AS staff_name,
                te.project_id, p.name AS project_name,
                p.is_rollup, p.project_type,
                p.work_order_number AS project_wo,
                p.contract_id, c.contract_number, c.friendly_label AS contract_label,
                ec.id AS engineering_contract_id, ec.program AS ec_program,
                ec.name AS engineering_contract_name,
                p.actual_hours::float AS project_actual_hours,
                pp.id AS parent_id, pp.name AS parent_name, pp.rollup_level AS parent_rollup_level,
                ppp.name AS grandparent_name,
                pj.name AS project_job_name
           FROM time_entries te
           LEFT JOIN projects p     ON p.id = te.project_id
           LEFT JOIN staff s        ON s.id = te.staff_id
           LEFT JOIN contracts c    ON c.id = p.contract_id
           LEFT JOIN engineering_contracts ec ON ec.id = c.engineering_contract_id
           LEFT JOIN projects pp    ON pp.id = p.parent_id
           LEFT JOIN projects ppp   ON ppp.id = pp.parent_id
           LEFT JOIN jobs pj        ON pj.id = p.job_id
          WHERE te.import_batch = $1
          ORDER BY te.entry_date, s.name, p.name
          LIMIT 1000`,
        [batchId]
      );
      if (!entries.length) {
        return res.json({
          batch_id: batchId,
          message: 'No time entries found for this import_batch. Either the batch_id is wrong, the entries were deleted, or the import was rolled back.',
          entries: [],
          summary: null,
        });
      }
      // Per-project rollup of the batch.
      const byProject = new Map();
      for (const e of entries) {
        const k = e.project_id || '__null__';
        if (!byProject.has(k)) {
          byProject.set(k, {
            project_id: e.project_id,
            project_name: e.project_name,
            is_rollup: e.is_rollup,
            project_type: e.project_type,
            project_wo: e.project_wo,
            project_job_name: e.project_job_name,
            contract_id: e.contract_id,
            contract_number: e.contract_number,
            contract_label: e.contract_label,
            engineering_contract_id: e.engineering_contract_id,
            ec_program: e.ec_program,
            engineering_contract_name: e.engineering_contract_name,
            project_actual_hours: e.project_actual_hours,
            parent_name: e.parent_name,
            parent_rollup_level: e.parent_rollup_level,
            grandparent_name: e.grandparent_name,
            entry_count: 0,
            sum_hours: 0,
            distinct_job_titles: new Set(),
            distinct_staff: new Set(),
            // Diagnostic flags surfacing why the project might not show
            // up where owner expects:
            problems: [],
          });
        }
        const r = byProject.get(k);
        r.entry_count++;
        r.sum_hours += parseFloat(e.hours) || 0;
        if (e.job_title) r.distinct_job_titles.add(e.job_title);
        if (e.staff_name) r.distinct_staff.add(e.staff_name);
      }
      const projectSummary = [...byProject.values()].map(r => {
        if (!r.contract_id) r.problems.push('no contract_id — RUS tab will exclude this project (filter requires contract→engineering_contract.program=\'rus\')');
        if (r.contract_id && r.ec_program !== 'rus') r.problems.push(`engineering contract program is "${r.ec_program || 'NULL'}" not "rus" — RUS tab will exclude`);
        if (r.is_rollup) r.problems.push('project is a rollup container (is_rollup=TRUE) — Projects-tab logged_hours shows 0 on rollups; rolled-up actual_hours = ' + (r.project_actual_hours || 0));
        if (!r.project_job_name) r.problems.push('project has no job_id assigned — Hours tab job display falls back to entry job_title');
        if (r.project_actual_hours == null || r.project_actual_hours === 0) r.problems.push('project.actual_hours is 0 or NULL — updateProjectHours may not have fired; sum_hours from this batch alone is ' + r.sum_hours.toFixed(2));
        return {
          ...r,
          distinct_job_titles: [...r.distinct_job_titles],
          distinct_staff: [...r.distinct_staff],
        };
      });
      const totals = {
        total_entries: entries.length,
        total_hours: entries.reduce((s, e) => s + (parseFloat(e.hours) || 0), 0),
        distinct_projects: byProject.size,
        distinct_staff: new Set(entries.map(e => e.staff_id).filter(Boolean)).size,
        rus_eligible_entries: entries.filter(e => e.ec_program === 'rus').length,
        rus_excluded_entries: entries.filter(e => e.ec_program !== 'rus').length,
        rollup_attached_entries: entries.filter(e => e.is_rollup).length,
      };
      res.json({
        batch_id: batchId,
        summary: totals,
        projects: projectSummary,
        // Cap entries returned to keep payload manageable; full project
        // rollup is in `projects`.
        entries_sample: entries.slice(0, 50),
        entries_truncated: entries.length > 50,
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // ─── Disk stats — volume + uploads directory summary ─────────────────────
  // GET /api/_admin/disk-stats
  //
  // Returns filesystem-level metrics for the Railway volume and a breakdown
  // of files inside UPLOAD_DIR. Does NOT touch the database at all, so this
  // works even when Postgres is degraded.
  //
  // Auth: normal requireAdmin session cookie (JWT token) OR a header
  // X-Admin-Bypass-Token matching ADMIN_BYPASS_TOKEN env var. The bypass
  // path allows access when Postgres is down and authMiddleware can't
  // populate req.user (since it does a DB lookup per request). Without it
  // the endpoint would always 401 when the DB is sick — defeating its purpose.
  //
  // If ADMIN_BYPASS_TOKEN is not set, the bypass path is disabled. The
  // response body includes a hint telling the operator which env var to set.
  app.get('/api/_admin/disk-stats', (req, res, next) => {
    const bypass = process.env.ADMIN_BYPASS_TOKEN;
    if (bypass && req.headers['x-admin-bypass-token'] === bypass) {
      return diskStatsHandler(req, res);
    }
    // Fall through to requireAdmin for normal (DB-healthy) auth.
    requireAdmin(req, res, () => diskStatsHandler(req, res));
  });

  function diskStatsHandler(req, res) {
    try {
      // Volume stats via statfsSync — no DB required.
      let volume = null;
      try {
        const sf = fs.statfsSync(uploadDir);
        // statfsSync fields: bsize (block size), blocks (total), bfree (free),
        // bavail (available to non-root), files (inodes), ffree (free inodes).
        const total     = sf.bsize * sf.blocks;
        const available = sf.bsize * sf.bavail;
        const used      = total - available;
        const usedPct   = total > 0 ? Math.round((used / total) * 1000) / 10 : 0;
        volume = { total_bytes: total, available_bytes: available, used_bytes: used, used_pct: usedPct };
      } catch (e) {
        volume = { error: e.message };
      }

      // Walk uploadDir (non-recursive at top level + invoice-templates subdir)
      // to tally total bytes, file count, and surface the top-20 largest files.
      let totalBytes = 0;
      let fileCount  = 0;
      const allFiles = [];

      function walkDir(dir, relBase) {
        let entries = [];
        try { entries = fs.readdirSync(dir); } catch { return; }
        for (const f of entries) {
          const full = path.join(dir, f);
          let st;
          try { st = fs.statSync(full); } catch { continue; }
          if (st.isDirectory()) {
            // Recurse one level into known subdirectories only.
            if (f === 'invoice-templates') walkDir(full, path.join(relBase, f));
            continue;
          }
          totalBytes += st.size;
          fileCount++;
          allFiles.push({ path: path.join(relBase, f), size: st.size, mtime: st.mtime.toISOString() });
        }
      }
      walkDir(uploadDir, '');
      allFiles.sort((a, b) => b.size - a.size);

      return res.json({
        volume,
        uploads_dir: {
          path: uploadDir,
          total_bytes: totalBytes,
          file_count: fileCount,
          top_20_largest: allFiles.slice(0, 20),
        },
        bypass_token_hint: !process.env.ADMIN_BYPASS_TOKEN
          ? 'ADMIN_BYPASS_TOKEN env var is not set. Set it in Railway → Variables to enable DB-bypass access when Postgres is degraded. Requests with header X-Admin-Bypass-Token matching that value will skip the DB auth check.'
          : undefined,
      });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // ─── Uploads cleanup — delete old files from UPLOAD_DIR ──────────────────
  // POST /api/_admin/uploads-cleanup
  //
  // Body (all optional):
  //   older_than_days  — delete files older than this many days (default 30)
  //   dry_run          — true (default) = preview only; false = actually delete
  //   max_delete       — cap on how many files to delete per call (default 1000)
  //
  // Returns: { scanned, would_delete|deleted, freed_bytes, sample_paths, warning }
  //
  // IMPORTANT: This is a filesystem-only operation — it does NOT consult the DB
  // to check whether a file has a permit_documents or project_documents row.
  // Files may be deleted that DO have DB references. This is the intentional
  // trade-off when recovering disk space with a degraded DB. The `warning` field
  // in the response documents this explicitly.
  //
  // Exclusions: invoice-templates/ subdirectory is never touched — those files
  // are persistent template assets, not ephemeral uploads.
  //
  // Like disk-stats, supports X-Admin-Bypass-Token for DB-down access.
  app.post('/api/_admin/uploads-cleanup', (req, res, next) => {
    const bypass = process.env.ADMIN_BYPASS_TOKEN;
    if (bypass && req.headers['x-admin-bypass-token'] === bypass) {
      return uploadsCleanupHandler(req, res);
    }
    requireAdmin(req, res, () => uploadsCleanupHandler(req, res));
  });

  function uploadsCleanupHandler(req, res) {
    const body = req.body || {};
    const olderThanDays = Number.isFinite(Number(body.older_than_days))
      ? Math.max(1, Number(body.older_than_days)) : 30;
    const dryRun    = body.dry_run !== false;   // default true
    const maxDelete = Number.isFinite(Number(body.max_delete))
      ? Math.max(1, Math.min(10000, Number(body.max_delete))) : 1000;

    const cutoffMs = Date.now() - olderThanDays * 24 * 60 * 60 * 1000;
    let scanned = 0;
    const candidates = [];

    // Walk uploadDir (top-level only; explicitly skip invoice-templates/).
    // invoice-templates/ files are persistent template assets and must never
    // be deleted by this sweep — they are excluded regardless of age.
    let entries = [];
    try { entries = fs.readdirSync(uploadDir); } catch (e) {
      return res.status(500).json({ error: 'Cannot read uploadDir: ' + e.message });
    }
    for (const f of entries) {
      const full = path.join(uploadDir, f);
      let st;
      try { st = fs.statSync(full); } catch { continue; }
      // Skip the invoice-templates subdir entirely.
      if (st.isDirectory()) continue;
      scanned++;
      if (st.mtimeMs < cutoffMs) {
        candidates.push({ file: f, full_path: full, size: st.size, mtime: st.mtime.toISOString() });
      }
    }

    // Cap to max_delete (in case of a runaway).
    const toDelete = candidates.slice(0, maxDelete);
    const totalBytes = toDelete.reduce((s, c) => s + c.size, 0);
    const samplePaths = toDelete.slice(0, 20).map(c => c.file);

    const WARNING =
      'This operation deletes files based on filesystem age only — the DB is NOT '
      + 'consulted. Files with live permit_documents or project_documents rows may '
      + 'be deleted. This is intentional when recovering disk space with a degraded '
      + 'or unavailable database.';

    if (dryRun) {
      return res.json({
        dry_run: true,
        older_than_days: olderThanDays,
        scanned,
        would_delete: toDelete.length,
        capped_at: maxDelete,
        more_candidates: candidates.length > maxDelete ? candidates.length - maxDelete : 0,
        freed_bytes: totalBytes,
        sample_paths: samplePaths,
        warning: WARNING,
        hint: `Dry run. Would delete ${toDelete.length} file(s) totalling ${(totalBytes / 1024 / 1024).toFixed(2)} MB. Re-POST with {"dry_run": false} to apply.`,
      });
    }

    // Real delete path.
    let deleted = 0;
    let freedBytes = 0;
    const errors = [];
    for (const c of toDelete) {
      try {
        fs.unlinkSync(c.full_path);
        deleted++;
        freedBytes += c.size;
      } catch (e) {
        errors.push({ file: c.file, error: e.message });
      }
    }

    return res.json({
      dry_run: false,
      older_than_days: olderThanDays,
      scanned,
      deleted,
      capped_at: maxDelete,
      more_candidates: candidates.length > maxDelete ? candidates.length - maxDelete : 0,
      freed_bytes: freedBytes,
      sample_paths: samplePaths,
      errors: errors.slice(0, 20),
      warning: WARNING,
      hint: `Deleted ${deleted} file(s), freed ${(freedBytes / 1024 / 1024).toFixed(2)} MB. `
        + (candidates.length > maxDelete
          ? `${candidates.length - maxDelete} more candidates were not touched (max_delete=${maxDelete}). Re-POST to continue.`
          : 'All candidates processed.'),
    });
  }

  // ─── Create staff + linked user account in one transaction ───────────────
  // POST /api/admin/staff-with-user
  //
  // Body: { staff_name, username, password, role, full_name, email, extra_teams }
  //
  // 1. Upserts the staff row (ON CONFLICT name → reactivate so the name is
  //    available even if it was previously soft-deleted).
  // 2. Creates the user with staff_id set to the upserted staff row.
  // 3. Rolls back everything if either step fails (e.g. duplicate username).
  //
  // Returns: { staff, user } — the two created/updated rows.
  const { VALID_ROLES, teamForRole } = require('../auth');
  const BCRYPT_ROUNDS = 12;

  app.post('/api/admin/staff-with-user', requireAdmin, async (req, res) => {
    const { staff_name, username, password, role, full_name, email, extra_teams } = req.body || {};
    if (!staff_name || !String(staff_name).trim()) {
      return res.status(400).json({ error: 'staff_name required' });
    }
    if (!username || !String(username).trim()) {
      return res.status(400).json({ error: 'username required' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'password must be at least 6 characters' });
    }
    if (!role || !VALID_ROLES.includes(role)) {
      return res.status(400).json({ error: `role must be one of: ${VALID_ROLES.join(', ')}` });
    }
    const cleanStaffName = String(staff_name).trim();
    const cleanUsername = String(username).trim();
    if (/\s/.test(cleanUsername)) {
      return res.status(400).json({ error: 'username cannot contain spaces' });
    }
    const cleanExtras = Array.isArray(extra_teams)
      ? extra_teams.filter(t => ['design','permitting','construction','inspection'].includes(t))
          .map(t => t === 'inspection' ? 'construction' : t)
      : [];

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const { rows: staffRows } = await client.query(
        `INSERT INTO staff (name) VALUES ($1)
         ON CONFLICT (name) DO UPDATE SET active = true
         RETURNING *`,
        [cleanStaffName]
      );
      const staff = staffRows[0];

      const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
      const { rows: userRows } = await client.query(
        `INSERT INTO users (username, password_hash, role, team, full_name, email, extra_teams, staff_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id, username, role, team, extra_teams, staff_id, full_name, email, active, created_at`,
        [cleanUsername, hash, role, teamForRole(role), full_name || null, email || null, cleanExtras, staff.id]
      );
      const user = userRows[0];

      await client.query('COMMIT');
      res.json({ staff, user });
    } catch (e) {
      await client.query('ROLLBACK');
      if (e.code === '23505') return res.status(409).json({ error: 'Username already taken' });
      res.status(500).json({ error: e.message });
    } finally {
      client.release();
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
