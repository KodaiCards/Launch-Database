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
//
// Wave 171 fixes:
//   PB-1: sanitize 500 errors — no raw e.message to client
//   PB-2: audit log on all 3 billing state changes via logAudit(pool, {...})
//   PB-3: manager team-scope check — design_manager cannot act on permitting projects
//   PB-4: billed_amount coerced to 2 dp; NaN rejected with 400

const { logAudit } = require('./_audit');

module.exports = function installProjectBillingRoutes(app, pool, mw) {
  const { requireManagerOrAdmin } = mw;

  // PB-3: verify that a manager is scoped to the project's team.
  // Admins bypass this check. design_manager may only act on design-team
  // projects; permitting_manager only on permitting-team projects.
  async function assertTeamScope(req, res, projectId) {
    const role = req.user && req.user.role;
    if (role !== 'design_manager' && role !== 'permitting_manager') return true; // admin passes
    const team = role === 'design_manager' ? 'design' : 'permitting';
    const { rows } = await pool.query(
      `SELECT p.id FROM projects p
       JOIN jobs j ON j.id = p.job_id
       WHERE p.id = $1 AND j.team = $2`,
      [projectId, team]
    );
    if (!rows.length) {
      res.status(404).json({ error: 'Project not found' });
      return false;
    }
    return true;
  }

  // Unbill a single project (reverse billing, keep hours)
  app.post('/api/projects/:id/unbill', requireManagerOrAdmin, async (req, res) => {
    const projectId = req.params.id;
    try {
      // PB-3: manager team-scope check
      if (!(await assertTeamScope(req, res, projectId))) return;

      // Snapshot before state for audit log
      const beforeR = await pool.query('SELECT * FROM projects WHERE id=$1', [projectId]);
      const beforeRow = beforeR.rows[0];
      if (!beforeRow) return res.status(404).json({ error: 'Project not found' });

      const { rows } = await pool.query(
        `UPDATE projects SET status='completed', billed_date=NULL WHERE id=$1 RETURNING *`,
        [projectId]
      );
      if (!rows.length) return res.status(404).json({ error: 'Project not found' });
      // Remove invoice items referencing this project
      await pool.query('DELETE FROM invoice_items WHERE project_id=$1', [projectId]);

      // PB-2: audit log — fire-and-forget, never break the main operation
      logAudit(pool, {
        req,
        action: 'project_billing.unbill',
        entity_type: 'project',
        entity_id: projectId,
        before: { status: beforeRow.status, billed_date: beforeRow.billed_date },
        after: { status: 'completed', billed_date: null },
        source: 'admin',
      }).catch(() => {});

      res.json(rows[0]);
    } catch (e) {
      // PB-1: sanitize error — never leak PG internals to client
      console.error('[project_billing:unbill]', e && e.message);
      res.status(500).json({ error: 'Internal error.' });
    }
  });

  app.put('/api/projects/:id/mark-billed', requireManagerOrAdmin, async (req, res) => {
    const projectId = req.params.id;
    try {
      // PB-3: manager team-scope check
      if (!(await assertTeamScope(req, res, projectId))) return;

      // Snapshot before state for audit log
      const beforeR = await pool.query('SELECT * FROM projects WHERE id=$1', [projectId]);
      const beforeRow = beforeR.rows[0];
      if (!beforeRow) return res.status(404).json({ error: 'Project not found' });

      const { rows } = await pool.query(
        `UPDATE projects SET billed_date=NOW(), status='billed' WHERE id=$1 RETURNING *`,
        [projectId]
      );
      // Permit pipeline ends at 'checklist' — billing status is reflected by
      // projects.billed_date, not by writing a 'billed' permit_stages row.

      // PB-2: audit log — fire-and-forget
      if (rows.length) {
        logAudit(pool, {
          req,
          action: 'project_billing.mark_billed',
          entity_type: 'project',
          entity_id: projectId,
          before: { status: beforeRow.status, billed_date: beforeRow.billed_date },
          after: { status: 'billed', billed_date: rows[0].billed_date },
          source: 'admin',
        }).catch(() => {});
      }

      res.json(rows[0]);
    } catch (e) {
      // PB-1: sanitize error
      console.error('[project_billing:mark_billed]', e && e.message);
      res.status(500).json({ error: 'Internal error.' });
    }
  });

  // "Bill and clone": marks the current project billed, snapshots an invoice line,
  // and creates a follow-on project for the next billing period so ongoing hourly
  // work (inspection, RE) can keep accumulating without re-entering all the metadata.
  // Body: { invoice_number?, invoice_date?, billed_amount, create_follow_on?, follow_on_name? }
  app.post('/api/projects/:id/bill-and-clone', requireManagerOrAdmin, async (req, res) => {
    const { invoice_number, invoice_date, create_follow_on, follow_on_name } = req.body;
    const rawBilledAmount = req.body.billed_amount;

    // PB-4: coerce billed_amount to 2 decimal places; reject non-numeric input
    const billedAmountParsed = parseFloat(rawBilledAmount);
    if (rawBilledAmount !== undefined && rawBilledAmount !== null && rawBilledAmount !== '') {
      if (isNaN(billedAmountParsed)) {
        return res.status(400).json({ error: 'billed_amount must be a number.' });
      }
    }
    const billed_amount = !isNaN(billedAmountParsed) ? billedAmountParsed.toFixed(2) : null;

    const client = await pool.connect();
    try {
      // PB-3: manager team-scope check (must happen before BEGIN to avoid
      // holding a transaction open while we do the scope check)
      if (!(await assertTeamScope(req, res, req.params.id))) {
        client.release();
        return;
      }

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
      const beforeStatus = orig.status;
      const beforeBilledDate = orig.billed_date;
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
        // Inherit job_id and billing_cadence from the original. Without
        // job_id, the follow-on can't be picked up by the PSC RUS PDF
        // generator (which scopes by job). Without billing_cadence, a
        // monthly project's clone resets to 'one_time' and the next
        // bill-and-clone marks it billed instead of continuing the
        // month-after-month pattern. Both columns existed pre-extraction
        // but were missed when bill-and-clone moved into this module.
        const followR = await client.query(
          `INSERT INTO projects (
             parent_id, name, client_id, contract_id, work_order_number,
             project_type, status, billing_type, billing_rate, footage,
             expected_hours, expected_revenue, start_date, notes,
             budget_code_id, concentrator_id, job_id, billing_cadence,
             engineering_contract_id, service_area_name
           ) VALUES (
             $1, $2, $3, $4, $5, $6, 'active', $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17,
             $18, $19
           ) RETURNING *`,
          [
            orig.parent_id, newName, orig.client_id, orig.contract_id, orig.work_order_number,
            orig.project_type, orig.billing_type, orig.billing_rate, orig.footage,
            orig.expected_hours, orig.expected_revenue, billDate, orig.notes,
            orig.budget_code_id, orig.concentrator_id, orig.job_id, orig.billing_cadence,
            orig.engineering_contract_id || null, orig.service_area_name || null
          ]
        );
        followOn = followR.rows[0];
      }

      await client.query('COMMIT');

      // PB-2: audit log — fire-and-forget, after COMMIT so state is durable
      logAudit(pool, {
        req,
        action: 'project_billing.bill_and_clone',
        entity_type: 'project',
        entity_id: req.params.id,
        before: { status: beforeStatus, billed_date: beforeBilledDate },
        after: {
          status: (orig.billing_cadence || 'one_time') !== 'monthly' ? 'billed' : beforeStatus,
          billed_date: (orig.billing_cadence || 'one_time') !== 'monthly' ? billDate : beforeBilledDate,
          invoice_id: invoiceId,
          follow_on_id: followOn ? followOn.id : null,
        },
        source: 'admin',
      }).catch(() => {});

      res.json({ ok: true, invoice_id: invoiceId, follow_on: followOn });
    } catch (e) {
      await client.query('ROLLBACK');
      // PB-1: sanitize error — never leak PG internals to client
      console.error('[project_billing:bill_and_clone]', e && e.message);
      res.status(500).json({ error: 'Internal error.' });
    } finally {
      client.release();
    }
  });
};
