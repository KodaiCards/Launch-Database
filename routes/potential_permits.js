// routes/potential_permits.js — design-team-submitted permit candidates
// pending Permitting review. Each row is "we found a place that probably
// needs a permit; Permitting team should look at it." When approved, it
// becomes a real permitting project (project_id is set on the row).
//
// Wave 1.5 fixes:
//   [UNGATED]     — All four endpoints were missing requireAuth.
//   [BODY-ACTOR]  — submitted_by / reviewed_by were taken from the request
//                   body and stored verbatim, allowing anyone to spoof
//                   attribution. Now sourced from req.user (full_name or
//                   username) so attribution is tied to the authenticated session.
//
// Extracted from server.js as part of CLEANUP_PLAN.md Track 1.3.

const { broadcast } = require('./_sse');
const { logAudit } = require('./_audit');

module.exports = function installPotentialPermitsRoutes(app, pool, mw) {
  const requireAuth = (mw && mw.requireAuth) || (() => (req, res, next) => next());
  const requireStaff = (mw && mw.requireStaff) || requireAuth(); // O34: staff-only reads (excludes trainee/customer)
  const { requirePermission } = require('./_permissions');
  const viewProjects = requirePermission(pool, 'projects.view_all');
  const manageProjects = requirePermission(pool, 'projects.manage');

  app.get('/api/potential-permits', viewProjects, async (req, res) => {
    const { status } = req.query;
    try {
      const q = status
        ? 'SELECT * FROM potential_permits WHERE status=$1 ORDER BY created_at DESC'
        : 'SELECT * FROM potential_permits ORDER BY created_at DESC';
      const { rows } = await pool.query(q, status ? [status] : []);
      res.json(rows);
    } catch (e) {
      console.error('[potential_permits:GET]', e && e.message);
      res.status(500).json({ error: 'Failed to load potential permits.' });
    }
  });

  // Wave 1.5 [BODY-ACTOR]: submitted_by now derived from req.user, never from body.
  app.post('/api/potential-permits', manageProjects, async (req, res) => {
    const { sr_hwy, county, route, notes } = req.body;
    // submitted_by is always the authenticated user, not body-supplied.
    const submittedBy = req.user.full_name || req.user.username;
    try {
      const { rows } = await pool.query(
        `INSERT INTO potential_permits (sr_hwy, county, route, notes, submitted_by)
         VALUES ($1,$2,$3,$4,$5) RETURNING *`,
        [sr_hwy || null, county || null, route || null, notes || null, submittedBy]
      );
      // A6: notify permitting team so they don't have to poll the Review tab.
      // Matches the pattern in routes/permits.js — admin + team:permitting channels.
      try {
        const payload = {
          id: rows[0].id,
          project_id: rows[0].project_id || null,
          submitted_by: req.user.id,
          at: new Date().toISOString(),
        };
        broadcast('team:permitting', 'potential_permit_created', payload);
        broadcast('admin', 'potential_permit_created', payload);
      } catch (broadcastErr) {
        // Broadcast failure should not break the POST response.
        console.error('[potential_permits:POST] broadcast error:', broadcastErr && broadcastErr.message);
      }
      // PP-L1: Log the audit
      logAudit(pool, { req, action: 'create', entity_type: 'potential_permit', entity_id: rows[0].id, after: { status: rows[0].status }, source: 'design_portal' }).catch(() => {});
      res.json(rows[0]);
    } catch (e) {
      console.error('[potential_permits:POST]', e && e.message);
      res.status(500).json({ error: 'Failed to create potential permit.' });
    }
  });

  // Wave 1.5 [BODY-ACTOR]: reviewed_by now derived from req.user, never from body.
  app.put('/api/potential-permits/:id', manageProjects, async (req, res) => {
    const { status, project_id, notes } = req.body;
    // reviewed_by is always the authenticated user, not body-supplied.
    const reviewedBy = req.user.full_name || req.user.username;
    // PP-M2: Validate status against allowlist
    const ALLOWED_STATUSES = ['pending', 'approved', 'rejected', 'withdrawn'];
    if (status != null && !ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Invalid status — allowed: ' + ALLOWED_STATUSES.join(', ') });
    }
    try {
      const { rows } = await pool.query(
        `UPDATE potential_permits SET status=$1, reviewed_by=$2, project_id=$3, notes=COALESCE($4,notes), updated_at=NOW()
         WHERE id=$5 RETURNING *`,
        [status || 'pending', reviewedBy, project_id || null, notes, req.params.id]
      );
      // PP-M1: 404 on non-existent ID
      if (!rows[0]) return res.status(404).json({ error: 'Potential permit not found' });
      // PP-L1: Log the audit
      logAudit(pool, { req, action: 'update', entity_type: 'potential_permit', entity_id: req.params.id, after: { status: rows[0].status }, source: 'permitting_portal' }).catch(() => {});
      res.json(rows[0]);
    } catch (e) {
      console.error('[potential_permits:PUT]', e && e.message);
      res.status(500).json({ error: 'Failed to update potential permit.' });
    }
  });

  app.delete('/api/potential-permits/:id', manageProjects, async (req, res) => {
    try {
      const { rowCount } = await pool.query('DELETE FROM potential_permits WHERE id=$1', [req.params.id]);
      // PP-L2: 404 on non-existent ID
      if (rowCount === 0) return res.status(404).json({ error: 'Potential permit not found' });
      // PP-L1: Log the audit
      logAudit(pool, { req, action: 'delete', entity_type: 'potential_permit', entity_id: req.params.id, source: 'permitting_portal' }).catch(() => {});
      res.json({ ok: true });
    } catch (e) {
      console.error('[potential_permits:DELETE]', e && e.message);
      res.status(500).json({ error: 'Failed to delete potential permit.' });
    }
  });
};
