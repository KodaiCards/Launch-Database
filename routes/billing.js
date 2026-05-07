// routes/billing.js — bulk billing + saved batches + monthly report.
//
// Endpoints:
//   POST /api/billing/bill-multiple        — bill N projects as one invoice
//   GET  /api/billing/batches              — list saved batch invoices
//   GET  /api/billing/batches/:id          — load a single batch with items
//   POST /api/billing/batches              — save a new batch
//   DELETE /api/billing/batches/:id        — delete a batch (cascades items)
//   POST /api/billing/batches/:id/confirm  — turn a batch into a real invoice
//   GET  /api/billing/report               — monthly invoices + YTD totals
//
// All manager+admin. The bulk endpoint is the canonical path for the
// admin "bill these projects now" flow (cadence-aware: monthly projects
// stay active, one-time projects close out). Batches let admin save a
// planned invoice for review before committing.
//
// Uses invoice_generator.inferInvoiceMakeup for the batches save path,
// passed in via the mw bag so server.js owns the require call.
//
// Extracted from server.js as part of CLEANUP_PLAN.md Track 1.3.

const { broadcast } = require('./_sse');

module.exports = function installBillingRoutes(app, pool, mw) {
  const { requireManagerOrAdmin, invoiceGenerator } = mw;

  // ─────────────────────────────────────────────────────────────────────────
  // BULK INVOICE — bill multiple projects as a single invoice
  // Body: { project_ids: [...], invoice_number, invoice_date, invoice_name,
  //         items: [{project_id, description, amount, ...}] }
  // Each project gets a line item; the invoice gets one invoice_number.
  // ─────────────────────────────────────────────────────────────────────────
  app.post('/api/billing/bill-multiple', requireManagerOrAdmin, async (req, res) => {
    const { project_ids, invoice_number, invoice_date, invoice_name, items } = req.body;
    if (!Array.isArray(project_ids) || project_ids.length === 0) {
      return res.status(400).json({ error: 'project_ids must be a non-empty array' });
    }
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Pull all projects so we know rates, footage, hours, client_id
      const projR = await client.query(
        `SELECT * FROM projects WHERE id = ANY($1::uuid[])`, [project_ids]
      );
      if (projR.rows.length !== project_ids.length) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'One or more projects not found' });
      }

      // All projects in a single invoice should share the same client.
      // (We could allow mixed-client billing but it's probably user error.)
      const clientIds = [...new Set(projR.rows.map(p => p.client_id))];
      if (clientIds.length > 1) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'All selected projects must belong to the same client' });
      }
      const billClientId = clientIds[0] || null;

      // Build line items. If the caller supplied per-project line item overrides
      // (rate / amount / description), use them; otherwise derive from the project.
      // For monthly cadence projects, the override should also include
      // period_year / period_month — we sum hours just from that month.
      const itemMap = new Map((items || []).map(it => [it.project_id, it]));
      let total = 0;
      const lineItems = [];
      for (const p of projR.rows) {
        const override = itemMap.get(p.id) || {};
        const isFootage = p.billing_type === 'footage';
        const isMonthly = p.billing_cadence === 'monthly';
        const inferredRate = parseFloat(p.billing_rate) || ({'inspection':90,'re':100,'resident engineer':100,'permitting':90}[(p.project_type||'').toLowerCase()] || 0);
        const rate = inferredRate;
        const expected = parseFloat(p.expected_revenue) || 0;

        // Hours: for monthly with a specified period, sum only that period's
        // entries. Otherwise use lifetime actual_hours (one_time semantics).
        let hours = parseFloat(p.actual_hours) || 0;
        let periodLabel = null;
        if (isMonthly && override.period_year && override.period_month) {
          const sumR = await client.query(`
            SELECT COALESCE(SUM(hours), 0)::float AS h
            FROM time_entries
            WHERE project_id = $1
              AND EXTRACT(YEAR FROM entry_date)::int = $2
              AND EXTRACT(MONTH FROM entry_date)::int = $3
          `, [p.id, override.period_year, override.period_month]);
          hours = parseFloat(sumR.rows[0].h) || 0;
          const monthName = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][override.period_month - 1];
          periodLabel = `${monthName} ${override.period_year}`;
        }

        // Amount priority:
        //   1. caller's per-line override.amount (UI / bulk-bill flow)
        //   2. project's manual_invoice_amount (flat fee override stored on project)
        //   3. calculated: footage → expected_revenue, hourly → hours × rate
        const projManual = parseFloat(p.manual_invoice_amount);
        const hasManual = !isNaN(projManual) && projManual >= 0;
        const amount = override.amount != null ? parseFloat(override.amount)
          : hasManual ? projManual
          : isFootage ? expected
          : hours * rate;
        const qty = override.quantity != null ? parseFloat(override.quantity)
          : hasManual ? 1
          : isFootage ? p.footage
          : hours;
        const unit = override.unit || (hasManual ? 'flat' : (isFootage ? 'lf' : 'hours'));
        const description = override.description || (periodLabel ? `${p.name} — ${periodLabel}` : p.name);
        lineItems.push({
          project_id: p.id, description, quantity: qty, unit, rate, amount,
          // pass through to the bill-out loop so it knows which (year, month)
          // this line item represents (drives the invoice_date stamping)
          period_year: override.period_year || null,
          period_month: override.period_month || null
        });
        total += amount;
      }

      // Determine invoice_date AND billing_period bounds.
      //
      // Owner-flagged 2026-05-06: previously `invoice_date` doubled as
      // both "issued on" AND "covers this period," and the queue's
      // already-billed-for-this-month check used invoice_date. The
      // frontend always sets invoice_date to TODAY, so an invoice
      // covering March hours stamped as May 6th never matched the
      // March project_months row in the queue → items stayed unbilled.
      //
      // Fix: write `billing_period_start/end` whenever items share a
      // single (year, month). The queue check below now prefers those
      // columns over invoice_date for the period match.
      const monthlyPeriods = lineItems
        .filter(li => li.period_year && li.period_month)
        .map(li => `${li.period_year}-${li.period_month}`);
      const uniquePeriods = [...new Set(monthlyPeriods)];
      if (uniquePeriods.length > 1) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          error: 'Selected items span multiple months — bill each month as a separate invoice.'
        });
      }
      const billDate = invoice_date || new Date().toISOString().split('T')[0];
      let billingPeriodStart = null;
      let billingPeriodEnd = null;
      if (uniquePeriods.length === 1) {
        const [py, pm] = uniquePeriods[0].split('-').map(Number);
        billingPeriodStart = `${py}-${String(pm).padStart(2, '0')}-01`;
        const lastDay = new Date(py, pm, 0).getDate();
        billingPeriodEnd = `${py}-${String(pm).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
      }
      const invR = await client.query(
        `INSERT INTO invoices (client_id, invoice_number, invoice_date,
                               billing_period_start, billing_period_end,
                               total_amount, status, notes)
         VALUES ($1, $2, $3, $4, $5, $6, 'sent', $7) RETURNING id`,
        [billClientId, invoice_number || null, billDate,
         billingPeriodStart, billingPeriodEnd,
         total, invoice_name || null]
      );
      const invoiceId = invR.rows[0].id;

      for (const li of lineItems) {
        await client.query(
          `INSERT INTO invoice_items (invoice_id, project_id, description, quantity, unit, rate, amount)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [invoiceId, li.project_id, li.description, li.quantity, li.unit, li.rate, li.amount]
        );
        // Cadence-aware close-out:
        //   • one_time projects close fully — billed_date set, status='billed'
        //   • monthly projects stay active so they reappear in next month's queue.
        //     The invoice line item itself records what was billed for which period.
        const proj = projR.rows.find(p => p.id === li.project_id);
        const cadence = proj?.billing_cadence || 'one_time';
        if (cadence === 'monthly') {
          // Don't change status. Don't set billed_date. The invoice line item
          // (with its date) is the source of truth for "this month was billed".
        } else {
          await client.query(
            `UPDATE projects SET billed_date=$1, status='billed' WHERE id=$2`,
            [billDate, li.project_id]
          );
        }
        // Permit pipeline ends at 'checklist'. Billing status is reflected by
        // projects.billed_date — no need to write a 'billed' permit_stages row.
      }

      await client.query('COMMIT');
      broadcast('admin', 'invoice_created', { id: invoiceId, total, line_count: lineItems.length });
      res.json({ ok: true, invoice_id: invoiceId, total, line_count: lineItems.length });
    } catch (e) {
      await client.query('ROLLBACK');
      console.error('bill-multiple error:', e);
      res.status(500).json({ error: e.message });
    } finally {
      client.release();
    }
  });

  // ─────────────────────────────────────────────────────────────────────────
  // BILLING BATCHES — frozen group of selected projects the user can come
  // back to and either confirm-bill or break apart. Used by the "Save batch
  // & bill later" path off the Print PDF modal.
  // ─────────────────────────────────────────────────────────────────────────

  app.get('/api/billing/batches', requireManagerOrAdmin, async (req, res) => {
    try {
      const { rows } = await pool.query(
        `SELECT b.*,
                cl.name AS client_name,
                ec.name AS engineering_contract_name,
                j.name AS job_name,
                u.username AS created_by_username,
                (SELECT COUNT(*)::int FROM billing_batch_items bi WHERE bi.batch_id = b.id) AS item_count
           FROM billing_batches b
           LEFT JOIN clients cl ON cl.id = b.client_id
           LEFT JOIN engineering_contracts ec ON ec.id = b.engineering_contract_id
           LEFT JOIN jobs j ON j.id = b.job_id
           LEFT JOIN users u ON u.id = b.created_by_user_id
           ORDER BY b.created_at DESC`
      );
      res.json(rows);
    } catch (e) {
      console.error('[batches:list]', e && e.message);
      res.status(500).json({ error: 'Failed to load batches.' });
    }
  });

  app.get('/api/billing/batches/:id', requireManagerOrAdmin, async (req, res) => {
    try {
      const { rows: batch } = await pool.query(
        `SELECT b.*, cl.name AS client_name,
                ec.name AS engineering_contract_name, ec.loan_name,
                j.name AS job_name, j.billing_code
           FROM billing_batches b
           LEFT JOIN clients cl ON cl.id = b.client_id
           LEFT JOIN engineering_contracts ec ON ec.id = b.engineering_contract_id
           LEFT JOIN jobs j ON j.id = b.job_id
           WHERE b.id = $1`,
        [req.params.id]
      );
      if (!batch[0]) return res.status(404).json({ error: 'Batch not found' });
      const { rows: items } = await pool.query(
        `SELECT bi.*, p.name AS project_name, p.work_order_number,
                p.actual_hours::float AS actual_hours, p.billing_rate::float AS billing_rate
           FROM billing_batch_items bi
           JOIN projects p ON p.id = bi.project_id
           WHERE bi.batch_id = $1
           ORDER BY p.work_order_number NULLS LAST`,
        [req.params.id]
      );
      res.json({ ...batch[0], items });
    } catch (e) {
      console.error('[batches:get]', e && e.message);
      res.status(500).json({ error: 'Failed to load batch.' });
    }
  });

  // POST /api/billing/batches — save a batch. Body:
  //   { name, project_ids[], items?:[{project_id, snapshot_amount, period_year, period_month}] }
  // If items omitted, snapshot_amount falls back to project's current
  // earned amount. Inferred client/EC/job/period from project_ids via the
  // same logic as the PDF generator.
  app.post('/api/billing/batches', requireManagerOrAdmin, async (req, res) => {
    const { name, project_ids, items, notes } = req.body || {};
    if (!name || !String(name).trim()) return res.status(400).json({ error: 'name required' });
    if (!Array.isArray(project_ids) || !project_ids.length) return res.status(400).json({ error: 'project_ids array required' });
    let inf;
    try {
      inf = await invoiceGenerator.inferInvoiceMakeup(pool, project_ids);
    } catch (e) { return res.status(500).json({ error: e.message }); }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      // Inferred fields can be null when the selection is ambiguous — that's
      // fine for a batch (admin can fix before confirming). We still store
      // whatever single values the inference picked up.
      const totalAmount = (Array.isArray(items) ? items : []).reduce((s, it) => s + (Number(it.snapshot_amount) || 0), 0);
      const { rows: br } = await client.query(
        `INSERT INTO billing_batches
           (name, client_id, engineering_contract_id, job_id, period_start, period_end, total_amount, notes, created_by_user_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [
          String(name).trim(),
          inf.makeup ? inf.makeup.client_id : null,
          inf.makeup ? inf.makeup.engineering_contract_id : null,
          inf.makeup ? inf.makeup.job_id : null,
          inf.makeup ? inf.makeup.inferred_period_start : null,
          inf.makeup ? inf.makeup.inferred_period_end : null,
          totalAmount,
          notes || null,
          req.user ? req.user.id : null,
        ]
      );
      const batch = br[0];

      // Map items by project_id for fast lookup
      const itemMap = new Map();
      (Array.isArray(items) ? items : []).forEach(it => itemMap.set(it.project_id, it));
      for (const pid of project_ids) {
        const it = itemMap.get(pid) || {};
        await client.query(
          `INSERT INTO billing_batch_items (batch_id, project_id, snapshot_amount, snapshot_period_year, snapshot_period_month)
             VALUES ($1, $2, $3, $4, $5)`,
          [batch.id, pid, it.snapshot_amount || null, it.period_year || null, it.period_month || null]
        );
      }
      await client.query('COMMIT');
      broadcast('admin', 'batch_committed', { id: batch.id, name: batch.name });
      res.json(batch);
    } catch (e) {
      try { await client.query('ROLLBACK'); } catch {}
      console.error('[batches:create]', e && e.stack || e);
      res.status(500).json({ error: 'Failed to save batch.' });
    } finally {
      client.release();
    }
  });

  // DELETE /api/billing/batches/:id — break a batch (does NOT bill). The
  // projects return to the unbilled queue. Items are cascade-deleted.
  app.delete('/api/billing/batches/:id', requireManagerOrAdmin, async (req, res) => {
    try {
      const { rows } = await pool.query(
        `DELETE FROM billing_batches WHERE id = $1 RETURNING id`,
        [req.params.id]
      );
      if (!rows[0]) return res.status(404).json({ error: 'Batch not found' });
      broadcast('admin', 'batch_voided', { id: req.params.id });
      res.json({ ok: true });
    } catch (e) {
      console.error('[batches:delete]', e && e.message);
      res.status(500).json({ error: 'Failed to delete batch.' });
    }
  });

  // POST /api/billing/batches/:id/confirm — bill the batch (creates an
  // invoice via the same code path as bill-multiple) and then deletes the
  // batch. Body: { invoice_number, invoice_date?, invoice_name? }
  app.post('/api/billing/batches/:id/confirm', requireManagerOrAdmin, async (req, res) => {
    const { invoice_number, invoice_date, invoice_name } = req.body || {};
    if (!invoice_number || !String(invoice_number).trim()) {
      return res.status(400).json({ error: 'invoice_number required' });
    }
    // Load the batch + items
    const { rows: bRows } = await pool.query(
      `SELECT * FROM billing_batches WHERE id = $1`, [req.params.id]
    );
    if (!bRows[0]) return res.status(404).json({ error: 'Batch not found' });
    const { rows: itemRows } = await pool.query(
      `SELECT * FROM billing_batch_items WHERE batch_id = $1`, [req.params.id]
    );
    if (!itemRows.length) return res.status(400).json({ error: 'Batch is empty' });

    // Forward to bill-multiple via internal call would be ideal, but it's
    // an HTTP handler. Easiest: replicate the minimal logic here.
    const today = new Date().toISOString().split('T')[0];
    const invDate = invoice_date || today;
    const periodStart = bRows[0].period_start;
    const periodEnd = bRows[0].period_end;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      // Create invoice header
      const { rows: invRows } = await client.query(
        `INSERT INTO invoices (client_id, invoice_number, invoice_date, billing_period_start, billing_period_end, total_amount, status, notes)
           VALUES ($1, $2, $3, $4, $5, $6, 'draft', $7)
           RETURNING *`,
        [bRows[0].client_id, String(invoice_number).trim(), invDate, periodStart, periodEnd, bRows[0].total_amount, invoice_name || null]
      );
      const inv = invRows[0];
      // One line item per batch row.
      // Owner-flagged 2026-05-06: do NOT mark monthly-cadence projects
      // as status='billed' / billed_date. Monthly projects roll over
      // and bill again next month — closing them ends future billing
      // until admin manually re-opens. The invoice_items row plus
      // invoices.billing_period_start (or invoice_date) is the source
      // of truth for "this month was billed" via the queue's check.
      let lineCount = 0;
      for (const it of itemRows) {
        const { rows: pr } = await client.query(
          `SELECT name, billing_cadence FROM projects WHERE id = $1`, [it.project_id]
        );
        const proj = pr[0];
        const desc = proj ? proj.name : 'Project';
        const cadence = proj?.billing_cadence || 'one_time';
        await client.query(
          `INSERT INTO invoice_items (invoice_id, project_id, description, amount)
             VALUES ($1, $2, $3, $4)`,
          [inv.id, it.project_id, desc, it.snapshot_amount || 0]
        );
        if (cadence !== 'monthly') {
          await client.query(
            `UPDATE projects SET status = 'billed', billed_date = $1 WHERE id = $2`,
            [invDate, it.project_id]
          );
        }
        lineCount++;
      }
      // Delete the batch (cascades items)
      await client.query(`DELETE FROM billing_batches WHERE id = $1`, [req.params.id]);
      await client.query('COMMIT');
      broadcast('admin', 'invoice_created', { id: inv.id, batch_id: req.params.id, total: bRows[0].total_amount });
      broadcast('admin', 'batch_committed', { id: req.params.id, invoice_id: inv.id });
      res.json({ ok: true, invoice: inv, line_count: lineCount, total: bRows[0].total_amount });
    } catch (e) {
      try { await client.query('ROLLBACK'); } catch {}
      console.error('[batches:confirm]', e && e.stack || e);
      res.status(500).json({ error: 'Failed to confirm batch: ' + e.message });
    } finally {
      client.release();
    }
  });

  // ─── BILLING REPORT ───────────────────────────────────────────────────────

  app.get('/api/billing/report', requireManagerOrAdmin, async (req, res) => {
    const month = req.query.month ? parseInt(req.query.month, 10) : null;
    const year = req.query.year ? parseInt(req.query.year, 10) : new Date().getFullYear();
    try {
      let where, params;
      if (month) {
        where = `WHERE EXTRACT(MONTH FROM invoice_date) = $1 AND EXTRACT(YEAR FROM invoice_date) = $2`;
        params = [month, year];
      } else {
        where = `WHERE EXTRACT(YEAR FROM invoice_date) = $1`;
        params = [year];
      }
      const invR = await pool.query(`
        SELECT inv.id, inv.invoice_number, inv.invoice_date, inv.total_amount, inv.status, inv.notes,
               cl.name as client_name
        FROM invoices inv
        LEFT JOIN clients cl ON cl.id = inv.client_id
        ${where}
        ORDER BY inv.invoice_date ASC, inv.created_at ASC
      `, params);

      const monthlyRev = month
        ? invR.rows.reduce((s, r) => s + parseFloat(r.total_amount || 0), 0)
        : null;

      const ytdR = await pool.query(`
        SELECT COALESCE(SUM(total_amount), 0)::float AS ytd
        FROM invoices
        WHERE EXTRACT(YEAR FROM invoice_date) = $1
      `, [year]);

      res.json({
        year,
        month,
        monthly_revenue: monthlyRev,
        ytd_revenue: parseFloat(ytdR.rows[0].ytd) || 0,
        invoices: invR.rows
      });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
};
