// routes/billing.js — bulk billing + saved batches.
//
// Endpoints:
//   POST /api/billing/bill-multiple        — bill N projects as one invoice
//   GET  /api/billing/batches              — list saved batch invoices
//   GET  /api/billing/batches/:id          — load a single batch with items
//   POST /api/billing/batches              — save a new batch
//   DELETE /api/billing/batches/:id        — delete a batch (cascades items)
//   POST /api/billing/batches/:id/confirm  — turn a batch into a real invoice
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
const { logAudit } = require('./_audit');

module.exports = function installBillingRoutes(app, pool, mw) {
  const { requireManagerOrAdmin, invoiceGenerator } = mw;
  const { requirePermission } = require('./_permissions');
  const moneyView = requirePermission(pool, 'money.view');
  const manageBilling = requirePermission(pool, 'money.manage_billing');

  // ─────────────────────────────────────────────────────────────────────────
  // BULK INVOICE — bill multiple projects as a single invoice
  // Body: { project_ids: [...], invoice_number, invoice_date, invoice_name,
  //         items: [{project_id, description, amount, ...}] }
  // Each project gets a line item; the invoice gets one invoice_number.
  // ─────────────────────────────────────────────────────────────────────────
  app.post('/api/billing/bill-multiple', manageBilling, async (req, res) => {
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
      // Accumulate in integer cents to avoid float drift on multi-line invoices.
      // Convert back to dollars only at DB-write / response time.
      let totalCents = 0;
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
          // Filter is_billable=TRUE so unbilled overhead entries (e.g. Misc,
          // Permitting overhead) don't inflate the invoice total for monthly
          // projects. COALESCE handles pre-0029 rows that have is_billable NULL.
          const sumR = await client.query(`
            SELECT COALESCE(SUM(hours), 0)::float AS h
            FROM time_entries
            WHERE project_id = $1
              AND EXTRACT(YEAR FROM entry_date)::int = $2
              AND EXTRACT(MONTH FROM entry_date)::int = $3
              AND COALESCE(is_billable, TRUE) = TRUE
          `, [p.id, override.period_year, override.period_month]);
          hours = parseFloat(sumR.rows[0].h) || 0;
          const monthName = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][override.period_month - 1];
          periodLabel = `${monthName} ${override.period_year}`;
        }

        // Amount priority:
        //   1. caller's per-line override.amount (UI / bulk-bill flow)
        //   2. project's manual_invoice_amount (flat fee override stored on project)
        //   3. calculated: footage → expected_revenue, hourly → hours × rate
        // M-1 fix: reject negative override amounts before they pollute
        // the totalCents accumulator and create negative invoices.
        if (override.amount != null) {
          const overrideAmt = parseFloat(override.amount);
          if (!isNaN(overrideAmt) && overrideAmt < 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'Override amount cannot be negative' });
          }
        }
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
        // Integer-cents accumulation — eliminates float drift on sums.
        totalCents += Math.round(amount * 100);
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
      // Convert cents back to dollars for the DB write (toFixed keeps precision explicit).
      const total = totalCents / 100;
      const invR = await client.query(
        `INSERT INTO invoices (client_id, invoice_number, invoice_date,
                               billing_period_start, billing_period_end,
                               total_amount, status, notes)
         VALUES ($1, $2, $3, $4, $5, $6, 'sent', $7) RETURNING id`,
        [billClientId, invoice_number || null, billDate,
         billingPeriodStart, billingPeriodEnd,
         (totalCents / 100).toFixed(2), invoice_name || null]
      );
      const invoiceId = invR.rows[0].id;

      // Perf (Wave 3): batch-insert invoice_items via a single multi-row
      // VALUES statement instead of one INSERT per line item (N→1 round
      // trips). Batch close-out one_time projects with a single UPDATE
      // using ANY($ids) instead of per-project UPDATEs (N→1 round trips).
      if (lineItems.length) {
        // Build parameterised multi-row INSERT for invoice_items.
        // period_year / period_month are written so the unique partial index
        // (idx_invoice_items_project_period, migration 0043) can enforce
        // one invoice item per project per month. A 23505 on this INSERT
        // means the admin already billed this project+month — caught below.
        const itemValues = [];
        const itemParams = [];
        let pi = 1;
        for (const li of lineItems) {
          itemValues.push(`($${pi},$${pi+1},$${pi+2},$${pi+3},$${pi+4},$${pi+5},$${pi+6},$${pi+7},$${pi+8})`);
          itemParams.push(invoiceId, li.project_id, li.description, li.quantity, li.unit, li.rate, li.amount,
                          li.period_year || null, li.period_month || null);
          pi += 9;
        }
        await client.query(
          `INSERT INTO invoice_items (invoice_id, project_id, description, quantity, unit, rate, amount, period_year, period_month)
           VALUES ${itemValues.join(',')}`,
          itemParams
        );
      }
      // Cadence-aware close-out:
      //   • one_time projects close fully — billed_date set, status='billed'
      //   • monthly projects stay active so they reappear in next month's queue.
      //     The invoice line item itself records what was billed for which period.
      // Permit pipeline ends at 'checklist'. Billing status is reflected by
      // projects.billed_date — no need to write a 'billed' permit_stages row.
      const oneTimeProjectIds = lineItems
        .filter(li => {
          const proj = projR.rows.find(p => p.id === li.project_id);
          return (proj?.billing_cadence || 'one_time') !== 'monthly';
        })
        .map(li => li.project_id);
      if (oneTimeProjectIds.length) {
        await client.query(
          `UPDATE projects SET billed_date=$1, status='billed' WHERE id = ANY($2::uuid[])`,
          [billDate, oneTimeProjectIds]
        );
      }

      await client.query('COMMIT');

      try {
        await logAudit(pool, {
          req,
          action: 'created',
          entity_type: 'invoice',
          entity_id: invoiceId,
          before: null,
          after: {
            id: invoiceId,
            invoice_number,
            invoice_date: billDate,
            total_amount: total,
            line_count: lineItems.length,
            billing_period_start: billingPeriodStart,
            billing_period_end: billingPeriodEnd,
            project_count: lineItems.length
          },
          source: 'admin',
          meta: { reason: 'Bulk invoice created' }
        });
      } catch (auditErr) {
        console.error('[bill-multiple:audit]', auditErr && auditErr.message);
      }

      broadcast('admin', 'invoice_created', { id: invoiceId, total, line_count: lineItems.length });
      res.json({ ok: true, invoice_id: invoiceId, total, line_count: lineItems.length });
    } catch (e) {
      await client.query('ROLLBACK');
      if (e.code === '23505' && e.constraint === 'idx_invoice_items_project_period') {
        // Unique partial index violation: this project+month was already billed.
        // Look up the existing invoice so the frontend can deep-link to it.
        const dupItem = e.detail && e.detail.match(/project_id, period_year, period_month\)=\(([^,]+), (\d+), (\d+)\)/);
        let existingInvoiceId = null;
        try {
          if (dupItem) {
            const ex = await pool.query(
              `SELECT invoice_id FROM invoice_items WHERE project_id=$1 AND period_year=$2 AND period_month=$3 LIMIT 1`,
              [dupItem[1], parseInt(dupItem[2]), parseInt(dupItem[3])]
            );
            existingInvoiceId = ex.rows[0]?.invoice_id || null;
          }
        } catch (_) { /* best-effort */ }
        return res.status(409).json({
          error: 'Invoice already exists for this project + period. Refresh and retry.',
          existing_invoice_id: existingInvoiceId,
        });
      }
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

  app.get('/api/billing/batches', moneyView, async (req, res) => {
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

  app.get('/api/billing/batches/:id', moneyView, async (req, res) => {
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
  app.post('/api/billing/batches', manageBilling, async (req, res) => {
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
      // Accumulate snapshot_amounts in integer cents to avoid float drift.
      const totalAmountCents = (Array.isArray(items) ? items : []).reduce(
        (s, it) => s + Math.round((Number(it.snapshot_amount) || 0) * 100), 0
      );
      const totalAmount = totalAmountCents / 100;
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

      try {
        await logAudit(pool, {
          req,
          action: 'created',
          entity_type: 'billing_batch',
          entity_id: batch.id,
          before: null,
          after: {
            id: batch.id,
            name: batch.name,
            client_id: batch.client_id,
            total_amount: batch.total_amount,
            item_count: project_ids.length,
            period_start: batch.period_start,
            period_end: batch.period_end
          },
          source: 'admin',
          meta: { reason: 'Billing batch created for review' }
        });
      } catch (auditErr) {
        console.error('[batches:create:audit]', auditErr && auditErr.message);
      }

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
  app.delete('/api/billing/batches/:id', manageBilling, async (req, res) => {
    try {
      // M-4 fix: verify the batch belongs to the requesting user unless they
      // are an admin. Managers can only delete their own batches.
      const isAdmin = req.user && req.user.role === 'admin';
      const ownershipFilter = isAdmin
        ? `WHERE id = $1`
        : `WHERE id = $1 AND created_by_user_id = $2`;
      const ownershipParams = isAdmin
        ? [req.params.id]
        : [req.params.id, req.user.id];
      const { rows } = await pool.query(
        `DELETE FROM billing_batches ${ownershipFilter} RETURNING id, name, total_amount`,
        ownershipParams
      );
      if (!rows[0]) {
        // Disambiguate: does the batch exist at all?
        const { rows: exists } = await pool.query(
          `SELECT 1 FROM billing_batches WHERE id = $1`, [req.params.id]
        );
        if (exists.length) return res.status(403).json({ error: 'Not authorized to delete this batch.' });
        return res.status(404).json({ error: 'Batch not found' });
      }

      try {
        await logAudit(pool, {
          req,
          action: 'deleted',
          entity_type: 'billing_batch',
          entity_id: req.params.id,
          before: { id: rows[0].id, name: rows[0].name, total_amount: rows[0].total_amount },
          after: null,
          source: 'admin',
          meta: { reason: 'Billing batch deleted' }
        });
      } catch (auditErr) {
        console.error('[batches:delete:audit]', auditErr && auditErr.message);
      }

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
  app.post('/api/billing/batches/:id/confirm', manageBilling, async (req, res) => {
    const { invoice_number, invoice_date, invoice_name } = req.body || {};
    if (!invoice_number || !String(invoice_number).trim()) {
      return res.status(400).json({ error: 'invoice_number required' });
    }
    // Load the batch + items.
    // M-4 fix: apply ownership check — managers can only confirm their own
    // batches; admins can confirm any.
    const confirmIsAdmin = req.user && req.user.role === 'admin';
    const { rows: bRows } = await pool.query(
      `SELECT * FROM billing_batches WHERE id = $1`, [req.params.id]
    );
    if (!bRows[0]) return res.status(404).json({ error: 'Batch not found' });
    if (!confirmIsAdmin && bRows[0].created_by_user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to confirm this batch.' });
    }
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
      // Perf (Wave 3): batch-fetch all project names + cadences in ONE query
      // instead of one SELECT per item inside the loop (N+1 → 1).
      const itemProjectIds = itemRows.map(it => it.project_id).filter(Boolean);
      const projMapRows = itemProjectIds.length
        ? (await client.query(
            `SELECT id, name, billing_cadence FROM projects WHERE id = ANY($1::uuid[])`,
            [itemProjectIds]
          )).rows
        : [];
      const projMap = new Map(projMapRows.map(p => [p.id, p]));

      let lineCount = 0;
      // Collect one_time project IDs for a single bulk UPDATE at the end.
      const oneTimeIds = [];
      // W205: pass snapshot_period_year/_month through to invoice_items so
      // the unique partial index (idx_invoice_items_project_period) catches
      // a second batch confirm for the same project+month. Without these
      // columns the index silently no-ops (NULLs aren't compared).
      try {
        for (const it of itemRows) {
          const proj = projMap.get(it.project_id);
          const desc = proj ? proj.name : 'Project';
          const cadence = proj?.billing_cadence || 'one_time';
          await client.query(
            `INSERT INTO invoice_items (invoice_id, project_id, description, amount, period_year, period_month)
               VALUES ($1, $2, $3, $4, $5, $6)`,
            [inv.id, it.project_id, desc, it.snapshot_amount || 0,
             it.snapshot_period_year || null, it.snapshot_period_month || null]
          );
          if (cadence !== 'monthly') {
            oneTimeIds.push(it.project_id);
          }
          lineCount++;
        }
      } catch (itemErr) {
        if (itemErr.code === '23505' && itemErr.constraint === 'idx_invoice_items_project_period') {
          await client.query('ROLLBACK');
          const dupItem = itemErr.detail && itemErr.detail.match(/project_id, period_year, period_month\)=\(([^,]+), (\d+), (\d+)\)/);
          return res.status(409).json({
            error: 'Already invoiced for this period',
            period_year: dupItem ? parseInt(dupItem[2]) : null,
            period_month: dupItem ? parseInt(dupItem[3]) : null,
          });
        }
        throw itemErr;
      }
      // Batch close-out for one_time projects (one UPDATE instead of N).
      if (oneTimeIds.length) {
        await client.query(
          `UPDATE projects SET status = 'billed', billed_date = $1 WHERE id = ANY($2::uuid[])`,
          [invDate, oneTimeIds]
        );
      }
      // Delete the batch (cascades items)
      await client.query(`DELETE FROM billing_batches WHERE id = $1`, [req.params.id]);
      await client.query('COMMIT');

      try {
        await logAudit(pool, {
          req,
          action: 'created',
          entity_type: 'invoice',
          entity_id: inv.id,
          before: null,
          after: {
            id: inv.id,
            invoice_number: inv.invoice_number,
            invoice_date: inv.invoice_date,
            total_amount: inv.total_amount,
            line_count: lineCount,
            billing_period_start: inv.billing_period_start,
            billing_period_end: inv.billing_period_end,
            from_batch_id: req.params.id
          },
          source: 'admin',
          meta: { reason: 'Batch confirmed and converted to invoice' }
        });
      } catch (auditErr) {
        console.error('[batches:confirm:audit]', auditErr && auditErr.message);
      }

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

};
