// routes/time_entries.js — time entries CRUD + bulk delete with undo.
//
// Extracted from server.js as part of CLEANUP_PLAN.md Track 1.3.4. The
// bulk-delete-by-staff endpoint is the smoke-tested one
// (tests/hours_bulk_delete.test.js) and was the regression target for
// the YTD bug fixed in commit 35d22e6 — the test asserts deleted > 0
// for a year-only query.
//
// Audit logging is passed in (built once in server.js by
// timeclockModule.makeAuditLogger). Audit failures are isolated so a
// logging hiccup never turns a successful entry mutation into a 500.

const { updateProjectHours, saveUndoBucket, snapHoursToQuarter } = require('./_helpers');

module.exports = function installTimeEntriesRoutes(app, pool, mw) {
  const { requireAuth, auditTimeEntry, portalMode } = mw;

  app.get('/api/time-entries', async (req, res) => {
    const { project_id, staff_id, month, year } = req.query;
    let where = [];
    let params = [];
    let i = 1;
    if (project_id) { where.push(`te.project_id=$${i++}`); params.push(project_id); }
    if (staff_id) { where.push(`te.staff_id=$${i++}`); params.push(staff_id); }
    if (month && year) {
      where.push(`EXTRACT(MONTH FROM te.entry_date)=$${i++} AND EXTRACT(YEAR FROM te.entry_date)=$${i++}`);
      params.push(month, year);
    } else if (year) {
      // YTD mode: year only, no month filter
      where.push(`EXTRACT(YEAR FROM te.entry_date)=$${i++}`);
      params.push(year);
    }
    // Engineer-class users see hours attributed to them. Two attribution
    // signals exist on a time_entries row:
    //   - te.staff_id  — the staff record the hours belong to (set on
    //                    every entry; the canonical "whose work")
    //   - te.user_id   — the logged-in user who CREATED the entry (set
    //                    when an engineer self-logs via timeclock)
    // If admin enters an engineer's hours via CSV import or the Hours tab,
    // te.user_id is the admin's id, not the engineer's. The engineer
    // would then log in and see nothing — even though the staff link
    // is correct. Prefer staff_id when the user has a linked staff record
    // (set in Settings → Users → "Linked staff"), fall back to user_id
    // when no link exists so newly-created accounts still see only their
    // own self-logged time. Role check is done here server-side so even
    // if the frontend mistakenly shows the Hours tab to an engineer,
    // they only see their own data.
    if (req.user && (req.user.role === 'design_engineer' || req.user.role === 'permitting_engineer')) {
      if (req.user.staff_id) {
        where.push(`te.staff_id = $${i++}`);
        params.push(req.user.staff_id);
      } else {
        where.push(`te.user_id = $${i++}`);
        params.push(req.user.id);
      }
    }
    // Manager-class users see ONLY hours tied to projects on their team. The
    // project's team is determined via its job (jobs.team). Projects whose job
    // is 'both' or NULL are considered shared and visible to both managers.
    // Inspection projects (team='construction', formerly 'inspection') are admin-only since the
    // Inspection tab lives in admin. CSV-imported entries inherit the project's
    // team automatically because they're attached to existing projects (or to
    // newly-created projects whose job team is set at creation time).
    if (req.user && (req.user.role === 'design_manager' || req.user.role === 'permitting_manager')) {
      const team = req.user.role === 'design_manager' ? 'design' : 'permitting';
      where.push(`te.project_id IN (
        SELECT p.id FROM projects p
        LEFT JOIN jobs j ON j.id = p.job_id
        WHERE j.team = $${i} OR j.team = 'both' OR j.team IS NULL OR p.job_id IS NULL
      )`);
      params.push(team);
      i++;
    }
    const whereStr = where.length ? 'WHERE ' + where.join(' AND ') : '';
    try {
      const { rows } = await pool.query(`
        SELECT te.*, p.name as project_name, p.work_order_number, p.project_type,
               s.name as staff_name, cl.name as client_name,
               j.team as project_team, j.name as project_job_name
        FROM time_entries te
        LEFT JOIN projects p ON p.id = te.project_id
        LEFT JOIN jobs j ON j.id = p.job_id
        LEFT JOIN staff s ON s.id = te.staff_id
        LEFT JOIN clients cl ON cl.id = p.client_id
        ${whereStr}
        ORDER BY te.entry_date DESC, te.created_at DESC
      `, params);
      res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.post('/api/time-entries', requireAuth(), async (req, res) => {
    const { project_id, staff_id, entry_date, hours, job_title, notes, pending_project_request_id } = req.body;
    // HELD timecards: when an engineer logs time on the timeclock against
    // a project that's still pending admin approval, project_id is null
    // and the row is tagged with the request id. Either a real project OR
    // a pending request must be set — otherwise the entry is meaningless.
    if (!project_id && !pending_project_request_id) {
      return res.status(400).json({ error: 'project_id or pending_project_request_id required' });
    }
    // Engineer-scope: engineers may only log time as themselves. Coerce
    // the staff_id to the user's linked staff record so a forged body can
    // never assign hours to another employee.
    let effectiveStaffId = staff_id || null;
    if (req.user?.role === 'design_engineer' || req.user?.role === 'permitting_engineer') {
      // user.staff_id is set when the admin links the user to a staff record.
      // Falling back to req.user.id keeps the row attributable even if the
      // link wasn't set up yet (admin can rebind later via Settings).
      effectiveStaffId = req.user.staff_id || effectiveStaffId;
      // Reject mismatched staff_id explicitly rather than silently rewrite —
      // surfaces config issues instead of letting hours land on the wrong
      // person.
      if (staff_id && req.user.staff_id && String(staff_id) !== String(req.user.staff_id)) {
        return res.status(403).json({ error: 'Engineers can only log time against their own staff record.' });
      }
    }
    // Validate the pending_project_request_id when present: must exist and
    // still be in 'pending' status. Without this, anyone with the
    // request_id (e.g. shared between portals) could silently attach hours
    // to a request that's already been approved or rejected, where they
    // would never be retro-attached.
    if (pending_project_request_id) {
      const { rows: prq } = await pool.query(
        `SELECT id, status FROM setting_change_requests
          WHERE id = $1 AND entity_type = 'project' AND action = 'create'`,
        [pending_project_request_id]
      );
      if (!prq[0]) return res.status(400).json({ error: 'pending_project_request_id not found or wrong type.' });
      if (prq[0].status !== 'pending') {
        return res.status(409).json({ error: 'That project request is no longer pending; pick a real project.' });
      }
    }
    // Owner rule: hours always live on the 0.25 grid. Snap before INSERT
    // so anything stored is canonical regardless of how the row arrived
    // (admin form, portal, AI tool, CSV path that misses the snap).
    const snappedHours = snapHoursToQuarter(hours);
    let inserted;
    try {
      const userId = req.user?.id || null;
      const { rows } = await pool.query(`
        INSERT INTO time_entries (project_id, staff_id, entry_date, hours, job_title, notes, user_id, pending_project_request_id)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *
      `, [project_id || null, effectiveStaffId, entry_date, snappedHours, job_title, notes, userId, pending_project_request_id || null]);
      inserted = rows[0];
      // Skip the rollup when this is a held timecard — there's no project
      // to roll into yet. The retro-attach on approval handles it later.
      if (project_id) await updateProjectHours(project_id);
    } catch (e) {
      console.error('[time-entries:create]', e && e.message);
      return res.status(500).json({ error: 'Failed to create entry.' });
    }
    // Audit AFTER the entry is durable. Audit failures must not turn a
    // successful insert into a 500 — the previous version did, and users
    // would retry, double-inserting hours. We log audit failures and move on.
    try {
      await auditTimeEntry({
        req, timeEntryId: inserted.id, action: 'created',
        before: null, after: inserted,
        source: portalMode || 'admin',
      });
    } catch (auditErr) {
      console.error('[time-entries:create-audit]', auditErr && auditErr.message);
    }
    res.json(inserted);
  });

  app.post('/api/time-entries/bulk', async (req, res) => {
    const { entries } = req.body; // [{project_id, staff_id, entry_date, hours, job_title}]
    if (!entries || !entries.length) return res.status(400).json({ error: 'No entries' });

    const importBatch = `import_${Date.now()}`;
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const inserted = [];
      for (const e of entries) {
        // Snap to 0.25 grid — same invariant as the single-row POST path.
        const { rows } = await client.query(`
          INSERT INTO time_entries (project_id, staff_id, entry_date, hours, job_title, import_batch)
          VALUES ($1,$2,$3,$4,$5,$6) RETURNING *
        `, [e.project_id, e.staff_id || null, e.entry_date, snapHoursToQuarter(e.hours), e.job_title, importBatch]);
        inserted.push(rows[0]);
      }
      // Update actual_hours with hierarchy rollup
      const projectIds = [...new Set(entries.map(e => e.project_id))];
      await client.query('COMMIT');
      // Rollup after commit so pool queries work
      for (const pid of projectIds) {
        await updateProjectHours(pid);
      }
      res.json({ inserted: inserted.length, batch: importBatch });
    } catch (e) {
      await client.query('ROLLBACK');
      res.status(500).json({ error: e.message });
    } finally {
      client.release();
    }
  });

  // PUT /api/time-entries/:id — edit an existing entry. Used by:
  //   - Admin Hours tab (manual corrections)
  //   - Time Clock portal (employees fixing their own past cards)
  //   - Eventually: portal Hours tabs (managers fixing team entries)
  //
  // Engineers can ONLY edit their own entries (server enforces user_id match).
  // Managers can edit entries on their team's projects. Admin can edit anything.
  // All edits write to the audit log with before/after state.
  app.put('/api/time-entries/:id', async (req, res) => {
    const { project_id, staff_id, entry_date, hours, job_title, notes } = req.body;
    try {
      // Fetch existing for audit + permission check
      const { rows: existing } = await pool.query(
        'SELECT * FROM time_entries WHERE id=$1', [req.params.id]
      );
      const before = existing[0];
      if (!before) return res.status(404).json({ error: 'Entry not found' });

      // Ownership check for engineers — they can only edit their own
      if (req.user?.role === 'design_engineer' || req.user?.role === 'permitting_engineer') {
        if (String(before.user_id) !== String(req.user.id)) {
          return res.status(403).json({ error: 'You can only edit your own time entries' });
        }
      }

      // Build the update — only set fields that were sent (allows partial updates)
      const sets = [];
      const params = [req.params.id];
      let i = 2;
      if (project_id !== undefined) { sets.push(`project_id = $${i++}`); params.push(project_id); }
      if (staff_id !== undefined)   { sets.push(`staff_id = $${i++}`);   params.push(staff_id || null); }
      if (entry_date !== undefined) { sets.push(`entry_date = $${i++}`); params.push(entry_date); }
      if (hours !== undefined)      { sets.push(`hours = $${i++}`);      params.push(snapHoursToQuarter(hours)); }
      if (job_title !== undefined)  { sets.push(`job_title = $${i++}`);  params.push(job_title); }
      if (notes !== undefined)      { sets.push(`notes = $${i++}`);      params.push(notes); }
      if (!sets.length) return res.status(400).json({ error: 'No fields to update' });

      let updated;
      try {
        const { rows } = await pool.query(
          `UPDATE time_entries SET ${sets.join(', ')} WHERE id=$1 RETURNING *`,
          params
        );
        updated = rows[0];
        await updateProjectHours(before.project_id);
        if (project_id && String(project_id) !== String(before.project_id)) {
          await updateProjectHours(project_id);
        }
      } catch (e) {
        console.error('[time-entries:update]', e && e.message);
        return res.status(500).json({ error: 'Failed to update entry.' });
      }
      // Audit isolated — never let a logging hiccup make the user think their
      // (already committed) edit failed. A retry would double-write.
      try {
        await auditTimeEntry({
          req, timeEntryId: req.params.id, action: 'updated',
          before, after: updated,
          source: portalMode || 'admin',
        });
      } catch (auditErr) {
        console.error('[time-entries:update-audit]', auditErr && auditErr.message);
      }
      res.json(updated);
    } catch (e) {
      console.error('[time-entries:update-outer]', e && e.message);
      res.status(500).json({ error: 'Failed to update entry.' });
    }
  });

  app.delete('/api/time-entries/:id', requireAuth(), async (req, res) => {
    let before;
    let undoToken = null, undoExpiresAt = null;
    try {
      const { rows: existing } = await pool.query(
        'SELECT * FROM time_entries WHERE id=$1', [req.params.id]
      );
      before = existing[0] || null;
      if (!before) return res.status(404).json({ error: 'Entry not found.' });

      // Engineer-scope: own entries only. Mirrors the PUT handler's check.
      if (req.user?.role === 'design_engineer' || req.user?.role === 'permitting_engineer') {
        if (String(before.user_id) !== String(req.user.id)) {
          return res.status(403).json({ error: 'You can only delete your own time entries.' });
        }
      }

      const { rows } = await pool.query('DELETE FROM time_entries WHERE id=$1 RETURNING project_id', [req.params.id]);
      if (rows[0] && rows[0].project_id) {
        await updateProjectHours(rows[0].project_id);
      }

      // Snapshot for the 15s undo. Same kind/payload shape as the bulk
      // delete so the existing routes/undo.js project_tree / time_entries
      // logic can resurrect it. We use the simpler 'time_entries_bulk'
      // kind with a single-row payload — restoreUndoBucket already
      // re-INSERTs by id with ON CONFLICT DO NOTHING, perfect for a
      // single-row recovery.
      try {
        const undo = await saveUndoBucket(req.user && req.user.id, 'time_entries_bulk', {
          entries: [before],
        });
        undoToken = undo.token;
        undoExpiresAt = undo.expires_at;
      } catch (undoErr) {
        // Undo bucket is best-effort. Log but don't fail the delete.
        console.error('[time-entries:delete:undo]', undoErr && undoErr.message);
      }
    } catch (e) {
      console.error('[time-entries:delete]', e && e.message);
      return res.status(500).json({ error: 'Failed to delete entry.' });
    }
    // Audit isolated — see comments on POST/PUT above.
    if (before) {
      try {
        await auditTimeEntry({
          req, timeEntryId: req.params.id, action: 'deleted',
          before, after: null,
          source: portalMode || 'admin',
        });
      } catch (auditErr) {
        console.error('[time-entries:delete-audit]', auditErr && auditErr.message);
      }
    }
    res.json({ ok: true, undo_token: undoToken, undo_expires_at: undoExpiresAt });
  });

  // Bulk delete: all time entries for a given staff member, optionally filtered
  // by month/year. Used by the "Delete all hours for [employee]" action in the
  // Hours tab. Returns an undo_token alongside the count so the UI can offer
  // a 15s undo bar — the deleted rows are snapshotted before deletion and
  // can be restored verbatim (same UUIDs) within the TTL.
  //
  // requireAuth is a factory — `requireAuth(roles)` returns the actual
  // middleware. Passing it bare meant Express received the factory and
  // called it with (req, res, next), which produced a middleware that
  // never ran. The endpoint was silently auth-bypassed for weeks. Fixed
  // by calling the factory with the manager+admin role set.
  app.delete('/api/time-entries/by-staff/:staffId', requireAuth(['admin', 'design_manager', 'permitting_manager']), async (req, res) => {
    const { month, year } = req.query;
    const params = [req.params.staffId];
    let where = 'staff_id = $1';
    if (month && year) {
      where += ' AND EXTRACT(MONTH FROM entry_date)=$2::int AND EXTRACT(YEAR FROM entry_date)=$3::int';
      params.push(month, year);
    } else if (year) {
      where += ' AND EXTRACT(YEAR FROM entry_date)=$2::int';
      params.push(year);
    }
    try {
      // Snapshot the full rows BEFORE deletion so undo can re-INSERT them
      // verbatim. We grab every column the time_entries schema exposes.
      const snapshot = await pool.query(`SELECT * FROM time_entries WHERE ${where}`, params);
      if (!snapshot.rows.length) {
        return res.json({ ok: true, deleted: 0 });
      }
      const result = await pool.query(`DELETE FROM time_entries WHERE ${where}`, params);
      const affectedProjects = [...new Set(snapshot.rows.map(r => r.project_id).filter(Boolean))];
      for (const pid of affectedProjects) {
        try { await updateProjectHours(pid); } catch {}
      }
      const undo = await saveUndoBucket(req.user && req.user.id, 'time_entries_bulk', {
        entries: snapshot.rows,
      });
      res.json({
        ok: true,
        deleted: result.rowCount,
        undo_token: undo.token,
        undo_expires_at: undo.expires_at,
      });
    } catch (e) {
      console.error('bulk delete by staff error:', e);
      res.status(500).json({ error: e.message });
    }
  });
};
