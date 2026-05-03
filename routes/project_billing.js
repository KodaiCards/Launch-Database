// routes/project_billing.js — project lifecycle endpoints around billing.
//
//   POST /api/projects/:id/unbill          — reverse a billed status, keep hours
//   PUT  /api/projects/:id/mark-billed     — stamp billed_date + status
//   POST /api/projects/:id/bill-and-clone  — bill the project, snapshot an
//                                             invoice line, and optionally
//                                             create a follow-on for next period
//
// Manager+admin gate. These were inline in server.js; grouping here keeps
// routes/projects.js focused on CRUD and lets bill-and-clone (which spans
// projects + invoices + invoice_items in one transaction) live next to its
// peers.
//
// Extracted from server.js as part of CLEANUP_PLAN.md Track 1.3.

module.exports = function installProjectBillingRoutes(app, pool, mw) {
  const { requireManagerOrAdmin } = mw;

  // Unbill a single project (reverse billing, keep hours)
  app.post('/api/projects/:id/unbill', requireManagerOrAdmin, async (req, res) => {
    try {
      const { rows } = await pool.query(
        `UPDATE projects SET status='completed', billed_date=NULL WHERE id=$1 RETURNING *`,
        [req.params.id]
      );
      if (!rows.length) return res.status(404).json({ error: 'Project not found' });
      // Remove invoice items referencing this project
      await pool.query('DELETE FROM invoice_items WHERE project_id=$1', [req.params.id]);
      res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.put('/api/projects/:id/mark-billed', requireManagerOrAdmin, async (req, res) => {
    try {
      const { rows } = await pool.query(
        `UPDATE projects SET billed_date=NOW(), status='billed' WHERE id=$1 RETURNING *`,
        [req.params.id]
      );
      // Permit pipeline ends at 'checklist' — billing status is reflected by
      // projects.billed_date, not by writing a 'billed' permit_stages row.
      res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // "Bill and clone": marks the current project billed, snapshots an invoice line,
  // and creates a follow-on project for the next billing period so ongoing hourly
  // work (inspection, RE) can keep accumulating without re-entering all the metadata.
  // Body: { invoice_number?, invoice_date?, billed_amount, create_follow_on?, follow_on_name? }
  app.post('/api/projects/:id/bill-and-clone', requireManagerOrAdmin, async (req, res) => {
    const { invoice_number, invoice_date, billed_amount, create_follow_on, follow_on_name } = req.body;
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Load original project so we can clone its setup
      const origR = await client.query('SELECT * FROM projects WHERE id=$1', [req.params.id]);
      const orig = origR.rows[0];
      if (!orig) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Project not found' });
      }

      // 1. Mark current project as billed — but ONLY for one-time projects.
      // For monthly projects we keep status='active' and don't stamp billed_date;
      // the invoice line item itself is the record that this month was billed.
      const billDate = invoice_date || new Date().toISOString().split('T')[0];
      if ((orig.billing_cadence || 'one_time') !== 'monthly') {
        await client.query(
          `UPDATE projects SET billed_date=$1, status='billed' WHERE id=$2`,
          [billDate, req.params.id]
        );
      }

      // 2. Snapshot an invoice (using the existing invoices + invoice_items tables)
      let invoiceId = null;
      if (billed_amount && parseFloat(billed_amount) > 0) {
        const invR = await client.query(
          `INSERT INTO invoices (client_id, invoice_number, invoice_date, total_amount, status, notes)
           VALUES ($1, $2, $3, $4, 'sent', $5) RETURNING id`,
          [orig.client_id, invoice_number || null, billDate, billed_amount,
           `Auto-snapshot from project ${orig.name}`]
        );
        invoiceId = invR.rows[0].id;

        const qty = orig.billing_type === 'footage' ? orig.footage : orig.actual_hours;
        const unit = orig.billing_type === 'footage' ? 'lf' : 'hours';
        await client.query(
          `INSERT INTO invoice_items (invoice_id, project_id, description, quantity, unit, rate, amount)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [invoiceId, orig.id, orig.name, qty, unit, orig.billing_rate, billed_amount]
        );
      }

      // 3. Permit pipeline no longer has a "billed" stage — billing status
      // is read from projects.billed_date directly. Nothing to do here.

      // 4. Optionally create a follow-on project (for ongoing hourly work)
      let followOn = null;
      if (create_follow_on) {
        const newName = follow_on_name || `${orig.name} (continued)`;
        const followR = await client.query(
          `INSERT INTO projects (
             parent_id, name, client_id, contract_id, work_order_number,
             project_type, status, billing_type, billing_rate, footage,
             expected_hours, expected_revenue, start_date, notes,
             budget_code_id, concentrator_id
           ) VALUES (
             $1, $2, $3, $4, $5, $6, 'active', $7, $8, $9, $10, $11, $12, $13, $14, $15
           ) RETURNING *`,
          [
            orig.parent_id, newName, orig.client_id, orig.contract_id, orig.work_order_number,
            orig.project_type, orig.billing_type, orig.billing_rate, orig.footage,
            orig.expected_hours, orig.expected_revenue, billDate, orig.notes,
            orig.budget_code_id, orig.concentrator_id
          ]
        );
        followOn = followR.rows[0];
      }

      await client.query('COMMIT');
      res.json({ ok: true, invoice_id: invoiceId, follow_on: followOn });
    } catch (e) {
      await client.query('ROLLBACK');
      console.error('bill-and-clone error:', e);
      res.status(500).json({ error: e.message });
    } finally {
      client.release();
    }
  });
};
