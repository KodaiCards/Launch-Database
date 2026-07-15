// routes/contracts.js — billing contracts CRUD + cascade delete with undo.
//
// Extracted from server.js as part of CLEANUP_PLAN.md Track 1.3. The
// cascade delete uses collectProjectTree + saveUndoBucket from
// routes/_helpers.js so the undo bucket survives across the
// /api/undo/:token replay path.

const { collectProjectTree, saveUndoBucket } = require('./_helpers');
const { broadcast } = require('./_sse');
const { logAudit } = require('./_audit');

module.exports = function installContractsRoutes(app, pool, mw) {
  const { requireAdmin } = mw;
  // Wave 1.5 [UNGATED]: GET /api/contracts was missing auth.
  const requireAuth = (mw && mw.requireAuth) || (() => (req, res, next) => next());
  const requireStaff = (mw && mw.requireStaff) || requireAuth(); // O34: staff-only reads (excludes trainee/customer)
  const { requirePermission } = require('./_permissions');
  const viewProjects = requirePermission(pool, 'projects.view_all');
  const manageProjects = requirePermission(pool, 'projects.manage');

  app.get('/api/contracts', viewProjects, async (req, res) => {
    const { client_id, engineering_contract_id } = req.query;
    try {
      const where = [];
      const params = [];
      let i = 1;
      if (client_id) { where.push(`c.client_id = $${i++}`); params.push(client_id); }
      if (engineering_contract_id) { where.push(`c.engineering_contract_id = $${i++}`); params.push(engineering_contract_id); }
      const whereStr = where.length ? `WHERE ${where.join(' AND ')}` : '';
      // Include engineering contract name + number so the admin Contracts
      // list can display the umbrella as a top-level header above its
      // child billing contracts.
      const { rows } = await pool.query(
        `SELECT c.*, cl.name as client_name,
                ec.name as engineering_contract_name,
                ec.contract_number as engineering_contract_number
           FROM contracts c
           JOIN clients cl ON cl.id = c.client_id
           LEFT JOIN engineering_contracts ec ON ec.id = c.engineering_contract_id
           ${whereStr}
           ORDER BY cl.name, ec.name NULLS LAST, c.contract_number`,
        params
      );
      res.json(rows);
    } catch (e) {
      console.error('[contracts:GET]', e && e.message);
      res.status(500).json({ error: 'Failed to load contracts.' });
    }
  });

  // Item 2 fix: requireAdmin added — creating contracts is an admin-only operation
  app.post('/api/contracts', manageProjects, async (req, res) => {
    const { client_id, contract_number, name, engineering_contract_id, friendly_label } = req.body;

    // C-4 LOW: validate required fields
    if (!contract_number || typeof contract_number !== 'string' || !contract_number.trim()) {
      return res.status(400).json({ error: 'contract_number required' });
    }
    if (!client_id) {
      return res.status(400).json({ error: 'client_id required' });
    }

    try {
      const { rows } = await pool.query(
        `INSERT INTO contracts (client_id, contract_number, name, engineering_contract_id, friendly_label)
           VALUES ($1,$2,$3,$4,$5) RETURNING *`,
        [client_id, contract_number, name, engineering_contract_id || null, friendly_label || null]
      );

      // C-2 MED: add audit log on contract creation
      await logAudit(pool, {
        req,
        action: 'contract.create',
        entity_type: 'contract',
        entity_id: rows[0].id,
        after: rows[0],
        source: 'admin'
      }).catch(() => {});

      broadcast('admin', 'contract_added', { id: rows[0].id, name: rows[0].name });
      res.json(rows[0]);
    } catch (e) {
      console.error('[contracts:POST]', e && e.message);
      res.status(500).json({ error: 'Failed to create contract.' });
    }
  });

  // PUT /api/contracts/:id — update a contract. Adds umbrella support so the
  // admin can move a contract under (or out of) an engineering_contract.
  app.put('/api/contracts/:id', manageProjects, async (req, res) => {
    const { contract_number, name, engineering_contract_id, friendly_label, active } = req.body;
    try {
      const sets = [];
      const params = [req.params.id];
      let i = 2;
      if (contract_number !== undefined) { sets.push(`contract_number = $${i++}`); params.push(contract_number); }
      if (name !== undefined) { sets.push(`name = $${i++}`); params.push(name); }
      if (engineering_contract_id !== undefined) {
        sets.push(`engineering_contract_id = $${i++}`);
        params.push(engineering_contract_id || null);
      }
      if (friendly_label !== undefined) { sets.push(`friendly_label = $${i++}`); params.push(friendly_label || null); }
      if (active !== undefined) { sets.push(`active = $${i++}`); params.push(!!active); }
      if (!sets.length) return res.status(400).json({ error: 'Nothing to update' });
      const { rows } = await pool.query(
        `UPDATE contracts SET ${sets.join(', ')} WHERE id = $1 RETURNING *`,
        params
      );
      if (!rows[0]) return res.status(404).json({ error: 'Contract not found' });

      // C-2 MED: add audit log on contract update
      await logAudit(pool, {
        req,
        action: 'contract.update',
        entity_type: 'contract',
        entity_id: rows[0].id,
        after: rows[0],
        source: 'admin'
      }).catch(() => {});

      broadcast('admin', 'contract_updated', { id: rows[0].id, name: rows[0].name });
      res.json(rows[0]);
    } catch (e) {
      console.error('[contracts:PUT]', e && e.message);
      res.status(500).json({ error: 'Failed to update contract.' });
    }
  });

  // DELETE /api/contracts/:id — admin-only. Refuses if any project references
  // this contract; the admin must detach those projects first OR pass
  // ?cascade=1 to delete every project under it (each as a tree, with hours
  // and permit data) plus the contract itself, all in one transaction with
  // an undo bucket covering the whole cascade. The schema has
  // projects.contract_id REFERENCES contracts(id) with no CASCADE, so plain
  // DELETE without ?cascade=1 still gives a friendly message instead of a
  // raw FK error.
  app.delete('/api/contracts/:id', manageProjects, async (req, res) => {
    const cascade = req.query.cascade === '1' || req.query.cascade === 'true';
    try {
      const { rows: kids } = await pool.query(
        `SELECT id FROM projects WHERE contract_id = $1`,
        [req.params.id]
      );
      if (kids.length > 0 && !cascade) {
        return res.status(409).json({
          error: `Cannot delete — ${kids.length} project(s) still reference this contract. Detach them first, or retry with ?cascade=1 to delete the projects (and their hours) too.`,
          project_count: kids.length,
        });
      }

      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const contractRow = await client.query('SELECT * FROM contracts WHERE id = $1', [req.params.id]);
        if (!contractRow.rows[0]) {
          await client.query('ROLLBACK');
          return res.status(404).json({ error: 'Contract not found' });
        }

        let cascadeProjects = [];
        let cascadeTimeEntries = [];
        let cascadeInvoiceItems = [];
        let cascadePermitStages = [];
        let cascadePermitDocuments = [];

        if (cascade && kids.length > 0) {
          // Walk every direct-child project's tree (the children may also
          // have their own descendant rollups).
          for (const k of kids) {
            const tree = await collectProjectTree(k.id);
            for (const p of tree) cascadeProjects.push(p);
          }
          const allIds = cascadeProjects.map(p => p.id);
          const teRes = await client.query('SELECT * FROM time_entries WHERE project_id = ANY($1::uuid[])', [allIds]);
          cascadeTimeEntries = teRes.rows;
          try { const r = await client.query('SELECT * FROM invoice_items WHERE project_id = ANY($1::uuid[])', [allIds]); cascadeInvoiceItems = r.rows; } catch {}
          try { const r = await client.query('SELECT * FROM permit_stages WHERE project_id = ANY($1::uuid[])', [allIds]); cascadePermitStages = r.rows; } catch {}
          try { const r = await client.query('SELECT * FROM permit_documents WHERE project_id = ANY($1::uuid[])', [allIds]); cascadePermitDocuments = r.rows; } catch {}

          // Delete leaf rows first
          await client.query('DELETE FROM time_entries WHERE project_id = ANY($1::uuid[])', [allIds]);
          try { await client.query('DELETE FROM invoice_items WHERE project_id = ANY($1::uuid[])', [allIds]); } catch {}
          try { await client.query('DELETE FROM permit_documents WHERE project_id = ANY($1::uuid[])', [allIds]); } catch {}
          try { await client.query('DELETE FROM permit_stages WHERE project_id = ANY($1::uuid[])', [allIds]); } catch {}
          // Batch delete all projects in one statement. Postgres evaluates
          // the self-referencing parent_id RESTRICT FK at end-of-statement,
          // so deleting all tree nodes together is safe. (Phase 6 BE-Perf L-4)
          await client.query('DELETE FROM projects WHERE id = ANY($1::uuid[])', [allIds]);
        }

        await client.query('DELETE FROM contracts WHERE id = $1', [req.params.id]);

        // C-3 MED: save undo bucket INSIDE transaction so data integrity is atomic
        const undo = await saveUndoBucket(req.user && req.user.id, 'contract_cascade', {
          contract: contractRow.rows[0],
          project_tree: cascade ? {
            projects: cascadeProjects,
            time_entries: cascadeTimeEntries,
            invoice_items: cascadeInvoiceItems,
            permit_stages: cascadePermitStages,
            permit_documents: cascadePermitDocuments,
          } : null,
        });

        await client.query('COMMIT');

        // C-2 MED: add audit log on contract deletion
        await logAudit(pool, {
          req,
          action: 'contract.delete',
          entity_type: 'contract',
          entity_id: req.params.id,
          before: contractRow.rows[0],
          source: 'admin'
        }).catch(() => {});

        broadcast('admin', 'contract_deleted', { id: req.params.id, cascade, deleted_projects: cascadeProjects.length });
        res.json({
          ok: true,
          cascade,
          deleted_projects: cascadeProjects.length,
          deleted_time_entries: cascadeTimeEntries.length,
          undo_token: undo.token,
          undo_expires_at: undo.expires_at,
        });
      } catch (e) {
        try { await client.query('ROLLBACK'); } catch {}
        throw e;
      } finally {
        client.release();
      }
    } catch (e) {
      console.error('[contracts:delete]', e && e.message);
      res.status(500).json({ error: 'Internal error.' });
    }
  });
};
