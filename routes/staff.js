// routes/staff.js — staff (employees) list + create + delete + rename.
//
// The staff table is intentionally lean: id, name, active, created_at.
// Hourly rate lives on the project/job, not the staff member, since one
// employee can bill out at different rates depending on the work category.
//
// Delete strategy (added 2026-05-05): soft-delete by default. Hard-delete
// is offered when the staff member has no time_entries — keeps the audit
// trail intact when there's billing history. The list endpoint already
// filters `active = true`, so a soft-deleted staff disappears from the
// dropdowns immediately. Re-activating is a simple PUT { active: true }.
//
// Extracted from server.js as part of CLEANUP_PLAN.md Track 1.3.

module.exports = function installStaffRoutes(app, pool, mw) {
  const requireAdmin = (mw && mw.requireAdmin) || ((req, res, next) => next());

  app.get('/api/staff', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM staff WHERE active=true ORDER BY name');
      res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // Include inactive staff. Used by admin Settings to surface soft-deleted
  // rows so admin can reactivate or hard-delete them.
  app.get('/api/staff/all', requireAdmin, async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM staff ORDER BY active DESC, name');
      res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.post('/api/staff', async (req, res) => {
    const { name } = req.body;
    if (!name || !String(name).trim()) {
      return res.status(400).json({ error: 'name required' });
    }
    try {
      const { rows } = await pool.query(
        'INSERT INTO staff (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET active=true RETURNING *',
        [String(name).trim()]
      );
      res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // PUT — rename and/or toggle active. Partial update: only fields present
  // in the body are touched. Useful for reactivating a soft-deleted staff
  // (PUT { active: true }) or fixing a typo (PUT { name: '...' }).
  app.put('/api/staff/:id', requireAdmin, async (req, res) => {
    const { name, active } = req.body || {};
    const sets = [];
    const params = [req.params.id];
    let i = 2;
    if (name !== undefined) {
      const trimmed = String(name).trim();
      if (!trimmed) return res.status(400).json({ error: 'name cannot be empty' });
      sets.push(`name = $${i++}`); params.push(trimmed);
    }
    if (active !== undefined) {
      sets.push(`active = $${i++}`); params.push(!!active);
    }
    if (!sets.length) return res.status(400).json({ error: 'Nothing to update' });
    try {
      const { rows } = await pool.query(
        `UPDATE staff SET ${sets.join(', ')} WHERE id = $1 RETURNING *`,
        params
      );
      if (!rows[0]) return res.status(404).json({ error: 'Staff member not found' });
      res.json(rows[0]);
    } catch (e) {
      if (e.code === '23505') return res.status(409).json({ error: 'Another staff member already uses that name' });
      res.status(500).json({ error: e.message });
    }
  });

  // DELETE strategy:
  //   • Default: soft-delete (active=false). The staff disappears from the
  //     active list / time-entry dropdowns, but their historical time
  //     entries remain attached for billing audit purposes.
  //   • ?hard=1: actually delete the row. Refused if any time_entries
  //     reference the staff (returns 409 with a count). Use only when
  //     admin is sure the audit trail won't be needed — typically for
  //     test/seed data with zero time entries.
  //   • ?preview=1 (no DELETE): returns the count of time_entries +
  //     pending_project_request linkage so the UI can show what will
  //     be affected before the actual delete.
  app.delete('/api/staff/:id', requireAdmin, async (req, res) => {
    const { id } = req.params;
    const hard = req.query.hard === '1' || req.query.hard === 'true';
    const preview = req.query.preview === '1' || req.query.preview === 'true';

    try {
      const cur = await pool.query('SELECT id, name, active FROM staff WHERE id = $1', [id]);
      if (!cur.rows[0]) return res.status(404).json({ error: 'Staff member not found' });

      const teCountRow = await pool.query(
        'SELECT COUNT(*)::int AS cnt FROM time_entries WHERE staff_id = $1',
        [id]
      );
      const time_entries = teCountRow.rows[0].cnt;

      if (preview) {
        return res.json({
          name: cur.rows[0].name,
          active: cur.rows[0].active,
          time_entries,
          can_hard_delete: time_entries === 0,
        });
      }

      if (hard) {
        if (time_entries > 0) {
          return res.status(409).json({
            error: `Cannot hard-delete "${cur.rows[0].name}" — ${time_entries} time entr${time_entries === 1 ? 'y' : 'ies'} reference this staff member. Use soft-delete instead (no ?hard=1 query param) to preserve the audit trail.`,
            time_entries,
          });
        }
        await pool.query('DELETE FROM staff WHERE id = $1', [id]);
        return res.json({ ok: true, mode: 'hard', deleted_name: cur.rows[0].name });
      }

      // Soft-delete: flip active=false. Re-activate by PUT { active: true }.
      await pool.query('UPDATE staff SET active = false WHERE id = $1', [id]);
      res.json({ ok: true, mode: 'soft', deactivated_name: cur.rows[0].name, time_entries });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
};
