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
const { broadcast } = require('./_sse');
const { logAudit } = require('./_audit');

module.exports = function installTimeEntriesRoutes(app, pool, mw) {
  const { requireAuth, auditTimeEntry, portalMode } = mw;

  // Wave 1.5 [UNGATED]: GET /api/time-entries was missing auth. The role-scoping
  // logic below already gates engineers to their own entries — but only once
  // req.user is set, which the gate enforces.
  app.get('/api/time-entries', requireAuth(), async (req, res) => {
    const { project_id, staff_id, month, year, billable } = req.query;
    let where = [];
    let params = [];
    let i = 1;
    if (project_id) { where.push(`te.project_id=$${i++}`); params.push(project_id); }
    if (staff_id) { where.push(`te.staff_id=$${i++}`); params.push(staff_id); }
    // billable=billed → only billable rows; billable=unbilled → only
    // unbilled rows; absent or 'all' → no filter. The Hours tab uses this
    // to drive its Billed / Unbilled / All segment toggle.
    if (billable === 'billed') where.push(`te.is_billable = TRUE`);
    else if (billable === 'unbilled') where.push(`te.is_billable = FALSE`);
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
    // Perf (Wave 3): cap rows returned. Without a LIMIT the query can return
    // tens-of-thousands of rows on large deployments, saturating the network
    // and serialising the entire table into JSON on every tab load.
    // Default cap: 1000. Callers may pass ?limit=N (max 5000) and ?offset=N
    // for pagination. The existing month/year/project_id filters narrow this
    // further in the common case so the cap rarely bites normal usage.
    const rawLimit = parseInt(req.query.limit, 10);
    const rawOffset = parseInt(req.query.offset, 10);
    const limitVal  = Number.isFinite(rawLimit)  && rawLimit  > 0 ? Math.min(rawLimit, 5000)  : 1000;
    const offsetVal = Number.isFinite(rawOffset) && rawOffset >= 0 ? rawOffset : 0;
    params.push(limitVal, offsetVal);
    const limitPlaceholder  = `$${i++}`;
    const offsetPlaceholder = `$${i++}`;
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
        LIMIT ${limitPlaceholder} OFFSET ${offsetPlaceholder}
      `, params);
      res.json(rows);
    } catch (e) {
      console.error('[time-entries:get]', e && e.message);
      res.status(500).json({ error: 'Failed to load time entries.' });
    }
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
    // TE-6: entry_date must be parseable, not in the future, and not older
    // than 365 days. This prevents ghost entries from bad clocks and
    // blocks back-dating that could manipulate billing cycles.
    if (entry_date) {
      const d = new Date(entry_date);
      if (isNaN(d.getTime())) return res.status(400).json({ error: 'Invalid entry_date.' });
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const entryDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      if (entryDay > today) return res.status(400).json({ error: 'entry_date cannot be in the future.' });
      const maxPast = new Date(today);
      maxPast.setDate(maxPast.getDate() - 365);
      if (entryDay < maxPast) return res.status(400).json({ error: 'entry_date cannot be older than 365 days.' });
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
    logAudit(pool, {
      req,
      action: 'time_entry.create',
      entity_type: 'time_entry',
      entity_id: inserted.id,
      after: inserted,
      source: portalMode || 'admin',
    }).catch(() => {});
    broadcast('admin', 'time_entry_added', { id: inserted.id, project_id: inserted.project_id, staff_id: inserted.staff_id });
    broadcast('team:design', 'time_entry_added', { id: inserted.id, project_id: inserted.project_id });
    broadcast('team:permitting', 'time_entry_added', { id: inserted.id, project_id: inserted.project_id });
    broadcast('team:construction', 'time_entry_added', { id: inserted.id, project_id: inserted.project_id });
    res.json(inserted);
  });

  // Item 7 fix: requireAuth() added — this endpoint was completely unguarded.
  // Engineer staff_id coercion: mirrors POST /api/time-entries to prevent
  // bulk import assigning hours to another employee's staff record.
  app.post('/api/time-entries/bulk', requireAuth(), async (req, res) => {
    const { entries } = req.body; // [{project_id, staff_id, entry_date, hours, job_title}]
    if (!entries || !entries.length) return res.status(400).json({ error: 'No entries' });

    // TE-6: validate all entry_dates up front before starting the transaction.
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const maxPast = new Date(today);
    maxPast.setDate(maxPast.getDate() - 365);
    for (const e of entries) {
      if (e.entry_date) {
        const d = new Date(e.entry_date);
        if (isNaN(d.getTime())) return res.status(400).json({ error: 'Invalid entry_date in bulk entries.' });
        const entryDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        if (entryDay > today) return res.status(400).json({ error: 'entry_date cannot be in the future.' });
        if (entryDay < maxPast) return res.status(400).json({ error: 'entry_date cannot be older than 365 days.' });
      }
    }

    const importBatch = `import_${Date.now()}`;
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const inserted = [];
      for (const e of entries) {
        // Engineer-scope coercion: same invariant as the single-row POST path.
        // Engineers may only log time as themselves — coerce staff_id to their
        // own linked staff record and reject mismatched values.
        let effectiveStaffId = e.staff_id || null;
        if (req.user && (req.user.role === 'design_engineer' || req.user.role === 'permitting_engineer')) {
          effectiveStaffId = req.user.staff_id || effectiveStaffId;
          if (e.staff_id && req.user.staff_id && String(e.staff_id) !== String(req.user.staff_id)) {
            await client.query('ROLLBACK');
            client.release();
            return res.status(403).json({ error: 'Engineers can only log time against their own staff record.' });
          }
        }
        // Snap to 0.25 grid — same invariant as the single-row POST path.
        const { rows } = await client.query(`
          INSERT INTO time_entries (project_id, staff_id, entry_date, hours, job_title, import_batch)
          VALUES ($1,$2,$3,$4,$5,$6) RETURNING *
        `, [e.project_id, effectiveStaffId, e.entry_date, snapHoursToQuarter(e.hours), e.job_title, importBatch]);
        inserted.push(rows[0]);
      }
      // Update actual_hours with hierarchy rollup
      const projectIds = [...new Set(entries.map(e => e.project_id))];
      await client.query('COMMIT');
      // Rollup after commit so pool queries work
      for (const pid of projectIds) {
        await updateProjectHours(pid);
      }
      // TE-4: audit each inserted entry. Failures are isolated (no 500 on audit hiccup).
      for (const row of inserted) {
        try {
          await auditTimeEntry({
            req, timeEntryId: row.id, action: 'created',
            before: null, after: row,
            source: portalMode || 'admin',
          });
        } catch (auditErr) {
          console.error('[time-entries:bulk-insert-audit]', auditErr && auditErr.message);
        }
        logAudit(pool, {
          req,
          action: 'time_entry.create',
          entity_type: 'time_entry',
          entity_id: row.id,
          after: row,
          source: portalMode || 'admin',
          meta: { batch: importBatch },
        }).catch(() => {});
      }
      broadcast('admin', 'time_entry_added', { batch: importBatch, count: inserted.length });
      broadcast('team:design', 'time_entry_added', { batch: importBatch, count: inserted.length });
      broadcast('team:permitting', 'time_entry_added', { batch: importBatch, count: inserted.length });
      broadcast('team:construction', 'time_entry_added', { batch: importBatch, count: inserted.length });
      res.json({ inserted: inserted.length, batch: importBatch });
    } catch (e) {
      await client.query('ROLLBACK');
      console.error('[time-entries:bulk-insert]', e && e.message);
      res.status(500).json({ error: 'Failed to bulk-insert time entries.' });
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
  //
  // Item 7 fix: requireAuth() added — this endpoint was completely unguarded,
  // allowing unauthenticated callers to overwrite any time entry including
  // changing the staff_id to another employee's record.
  app.put('/api/time-entries/:id', requireAuth(), async (req, res) => {
    const { project_id, staff_id, entry_date, hours, job_title, notes } = req.body;
    // TE-6: entry_date range guard on edits — same rules as POST.
    if (entry_date !== undefined) {
      const d = new Date(entry_date);
      if (isNaN(d.getTime())) return res.status(400).json({ error: 'Invalid entry_date.' });
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const entryDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      if (entryDay > today) return res.status(400).json({ error: 'entry_date cannot be in the future.' });
      const maxPast = new Date(today);
      maxPast.setDate(maxPast.getDate() - 365);
      if (entryDay < maxPast) return res.status(400).json({ error: 'entry_date cannot be older than 365 days.' });
    }
    try {
      // Fetch existing for audit + permission check
      const { rows: existing } = await pool.query(
        'SELECT * FROM time_entries WHERE id=$1', [req.params.id]
      );
      const before = existing[0];
      if (!before) return res.status(404).json({ error: 'Entry not found' });

      // TE-5: Ownership note — te.user_id is the account that CREATED the
      // entry, not necessarily who the hours belong to. Admins entering time
      // on behalf of an engineer set user_id=admin.id while staff_id=engineer's
      // staff record. Engineers editing via the timeclock use user_id to scope
      // their own entries. Managers are scoped via jobs.team (see below) so
      // they never hit the user_id check.

      // Ownership check for engineers — they can only edit their own
      if (req.user?.role === 'design_engineer' || req.user?.role === 'permitting_engineer') {
        if (String(before.user_id) !== String(req.user.id)) {
          return res.status(403).json({ error: 'You can only edit your own time entries' });
        }
      }

      // TE-1: Manager team-scope check. Managers may only edit entries that
      // belong to projects on their team (via the project's job.team).
      // Projects with job.team='both' or NULL are shared. Admin bypasses this.
      if (req.user?.role === 'design_manager' || req.user?.role === 'permitting_manager') {
        const managerTeam = req.user.role === 'design_manager' ? 'design' : 'permitting';
        const { rows: scopeCheck } = await pool.query(
          `SELECT te.id FROM time_entries te
           LEFT JOIN projects p ON p.id = te.project_id
           LEFT JOIN jobs j ON j.id = p.job_id
           WHERE te.id = $1
             AND (j.team = $2 OR j.team = 'both' OR j.team IS NULL OR p.job_id IS NULL)`,
          [req.params.id, managerTeam]
        );
        if (!scopeCheck.length) {
          return res.status(404).json({ error: 'Entry not found' });
        }
      }

      // Build the update — only set fields that were sent (allows partial updates)
      const sets = [];
      const params = [req.params.id];
      let i = 2;
      if (project_id !== undefined) { sets.push(`project_id = $${i++}`); params.push(project_id); }
      // Engineer staff_id coercion: if an engineer sends a staff_id update,
      // coerce it to their own record and reject mismatches. Mirrors POST path.
      if (staff_id !== undefined) {
        let effectiveStaffId = staff_id;
        if (req.user?.role === 'design_engineer' || req.user?.role === 'permitting_engineer') {
          effectiveStaffId = req.user.staff_id || effectiveStaffId;
          if (staff_id && req.user.staff_id && String(staff_id) !== String(req.user.staff_id)) {
            return res.status(403).json({ error: 'Engineers can only log time against their own staff record.' });
          }
        }
        sets.push(`staff_id = $${i++}`);
        params.push(effectiveStaffId || null);
      }
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
      logAudit(pool, {
        req,
        action: 'time_entry.update',
        entity_type: 'time_entry',
        entity_id: req.params.id,
        before,
        after: updated,
        source: portalMode || 'admin',
      }).catch(() => {});
      broadcast('admin', 'time_entry_updated', { id: req.params.id, project_id: updated && updated.project_id });
      broadcast('team:design', 'time_entry_updated', { id: req.params.id, project_id: updated && updated.project_id });
      broadcast('team:permitting', 'time_entry_updated', { id: req.params.id, project_id: updated && updated.project_id });
      broadcast('team:construction', 'time_entry_updated', { id: req.params.id, project_id: updated && updated.project_id });
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

      // TE-1: Manager team-scope check for single delete. Managers may only
      // delete entries that belong to projects on their team (via job.team).
      // Projects with job.team='both' or NULL are shared. Admin bypasses this.
      if (req.user?.role === 'design_manager' || req.user?.role === 'permitting_manager') {
        const managerTeam = req.user.role === 'design_manager' ? 'design' : 'permitting';
        const { rows: scopeCheck } = await pool.query(
          `SELECT te.id FROM time_entries te
           LEFT JOIN projects p ON p.id = te.project_id
           LEFT JOIN jobs j ON j.id = p.job_id
           WHERE te.id = $1
             AND (j.team = $2 OR j.team = 'both' OR j.team IS NULL OR p.job_id IS NULL)`,
          [req.params.id, managerTeam]
        );
        if (!scopeCheck.length) {
          return res.status(404).json({ error: 'Entry not found.' });
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
      logAudit(pool, {
        req,
        action: 'time_entry.delete',
        entity_type: 'time_entry',
        entity_id: req.params.id,
        before,
        source: portalMode || 'admin',
      }).catch(() => {});
    }
    broadcast('admin', 'time_entry_deleted', { id: req.params.id, project_id: before && before.project_id });
    broadcast('team:design', 'time_entry_deleted', { id: req.params.id, project_id: before && before.project_id });
    broadcast('team:permitting', 'time_entry_deleted', { id: req.params.id, project_id: before && before.project_id });
    broadcast('team:construction', 'time_entry_deleted', { id: req.params.id, project_id: before && before.project_id });
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

    // TE-2: Manager team-scope check. Managers may only bulk-delete entries
    // for staff members who are linked to their team via users.team.
    // The staff table has no team column; the link is through users.staff_id.
    // Admins bypass this check.
    if (req.user?.role === 'design_manager' || req.user?.role === 'permitting_manager') {
      const managerTeam = req.user.role === 'design_manager' ? 'design' : 'permitting';
      const { rows: userCheck } = await pool.query(
        `SELECT id FROM users WHERE staff_id = $1 AND team = $2`,
        [req.params.staffId, managerTeam]
      );
      if (!userCheck.length) {
        return res.status(404).json({ error: 'Staff member not found on your team.' });
      }
    }

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
      // TE-3: audit each deleted row. Failures are isolated so a logging
      // hiccup never turns a successful bulk-delete into a 500.
      for (const row of snapshot.rows) {
        try {
          await auditTimeEntry({
            req, timeEntryId: row.id, action: 'deleted',
            before: row, after: null,
            source: portalMode || 'admin',
          });
        } catch (auditErr) {
          console.error('[time-entries:bulk-delete-audit]', auditErr && auditErr.message);
        }
        logAudit(pool, {
          req,
          action: 'time_entry.delete',
          entity_type: 'time_entry',
          entity_id: row.id,
          before: row,
          source: portalMode || 'admin',
          meta: { bulk_by_staff: req.params.staffId, month: month || null, year: year || null },
        }).catch(() => {});
      }
      broadcast('admin', 'time_entries_bulk_deleted', { staff_id: req.params.staffId, deleted: result.rowCount });
      broadcast('team:design', 'time_entries_bulk_deleted', { staff_id: req.params.staffId, deleted: result.rowCount });
      broadcast('team:permitting', 'time_entries_bulk_deleted', { staff_id: req.params.staffId, deleted: result.rowCount });
      broadcast('team:construction', 'time_entries_bulk_deleted', { staff_id: req.params.staffId, deleted: result.rowCount });
      res.json({
        ok: true,
        deleted: result.rowCount,
        undo_token: undo.token,
        undo_expires_at: undo.expires_at,
      });
    } catch (e) {
      console.error('[time-entries:bulk-delete-by-staff]', e && e.message);
      res.status(500).json({ error: 'Failed to bulk-delete time entries.' });
    }
  });
};
