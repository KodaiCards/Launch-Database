// routes/invoices.js — invoice list + PSC RUS PDF generator endpoints.
//
// Extracted from server.js as part of CLEANUP_PLAN.md Track 1.3.5.
// generate-pdf-from-projects is smoke-tested
// (tests/psc_rus_pdf.test.js) — that test asserts a real PDF comes back
// for a permitting project under a RUS client AND that a non-RUS client
// produces a 422 with conflicts. preview-data is smoke-tested via
// tests/contract_friendly_label.test.js.
//
// Manager+admin gate. The renderer + data assembler live in
// invoice_generator.js; this module is just the route surface.

const { updateProjectHours } = require('./_helpers');
const invoiceGenerator = require('../invoice_generator');

module.exports = function installInvoicesRoutes(app, pool, mw) {
  const { requireManagerOrAdmin } = mw;

  // List invoices with items, grouped by month
  app.get('/api/invoices', requireManagerOrAdmin, async (req, res) => {
    const year = req.query.year || new Date().getFullYear();
    try {
      const { rows } = await pool.query(`
        SELECT i.*,
          cl.name as client_name,
          EXTRACT(MONTH FROM i.invoice_date)::int as month,
          json_agg(json_build_object(
            'id', ii.id, 'project_id', ii.project_id,
            'description', ii.description, 'quantity', ii.quantity,
            'unit', ii.unit, 'rate', ii.rate, 'amount', ii.amount,
            'project_name', p.name, 'project_type', p.project_type,
            'work_order_number', p.work_order_number
          )) FILTER (WHERE ii.id IS NOT NULL) as items
        FROM invoices i
        LEFT JOIN clients cl ON cl.id = i.client_id
        LEFT JOIN invoice_items ii ON ii.invoice_id = i.id
        LEFT JOIN projects p ON p.id = ii.project_id
        WHERE EXTRACT(YEAR FROM i.invoice_date) = $1
        GROUP BY i.id, cl.name
        ORDER BY i.invoice_date DESC
      `, [year]);
      res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // ─── PSC RUS PDF generator ────────────────────────────────────────────────
  // POST /api/invoices/generate-pdf — assembles the data and streams a PDF.
  // Body: { engineering_contract_id, job_id, period_start, period_end,
  //         contract_ids? (array of UUIDs to limit to specific contracts) }
  // Returns: application/pdf with Content-Disposition: attachment.
  //
  // Manager+admin only. Format is exclusive to RUS-program work — the
  // generator throws if the engineering contract's program isn't 'rus'.
  app.post('/api/invoices/generate-pdf', requireManagerOrAdmin, async (req, res) => {
    const { engineering_contract_id, job_id, period_start, period_end, contract_ids } = req.body || {};
    if (!engineering_contract_id) return res.status(400).json({ error: 'engineering_contract_id required' });
    if (!job_id) return res.status(400).json({ error: 'job_id required' });
    if (!period_start || !period_end) return res.status(400).json({ error: 'period_start and period_end required (YYYY-MM-DD)' });

    let data;
    try {
      data = await invoiceGenerator.buildInvoiceData(pool, {
        engineering_contract_id, job_id, period_start, period_end,
        contract_ids: Array.isArray(contract_ids) ? contract_ids : null,
      });
    } catch (e) {
      // Friendly errors for the most common cases
      console.error('[invoices:generate-pdf:assemble]', e && e.message);
      return res.status(400).json({ error: e.message });
    }

    // Stream the PDF directly. We never buffer the full file in memory —
    // pdfkit pipes chunks straight to the response.
    const filename = invoiceGenerator.suggestedFilename(data);
    res.setHeader('Content-Type', 'application/pdf');
    // Inline disposition so the browser opens it in a new tab (better UX
    // than forcing a download — admin can still save from there).
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    try {
      invoiceGenerator.renderInvoicePdf(data, res);
    } catch (e) {
      console.error('[invoices:generate-pdf:render]', e && e.stack || e);
      // We may have already started writing PDF bytes — if so, the headers
      // are already flushed and we can't change to a JSON error. Just close
      // the stream and let the client handle the malformed PDF.
      if (!res.headersSent) {
        res.status(500).json({ error: 'PDF render failed.' });
      } else {
        res.end();
      }
    }
  });

  // POST /api/invoices/preview-makeup — given a list of project_ids,
  // returns the inferred invoice scope (client, engineering contract, job,
  // period) plus any conflicts that would block PDF generation. Used by
  // the Print PDF modal to show the user what's in the invoice before
  // clicking Generate PDF.
  app.post('/api/invoices/preview-makeup', requireManagerOrAdmin, async (req, res) => {
    const { project_ids } = req.body || {};
    if (!Array.isArray(project_ids) || !project_ids.length) {
      return res.status(400).json({ error: 'project_ids array required' });
    }
    try {
      const result = await invoiceGenerator.inferInvoiceMakeup(pool, project_ids);
      res.json(result);
    } catch (e) {
      console.error('[invoices:preview-makeup]', e && e.message);
      res.status(500).json({ error: 'Failed to assemble makeup.' });
    }
  });

  // POST /api/invoices/generate-pdf-from-projects — same output as
  // /generate-pdf, but scope is inferred from project_ids instead of being
  // passed explicitly. Returns 422 (with the conflict list) if the
  // selection is ambiguous, so the modal can prompt the user to fix.
  app.post('/api/invoices/generate-pdf-from-projects', requireManagerOrAdmin, async (req, res) => {
    const { project_ids, period_start, period_end } = req.body || {};
    if (!Array.isArray(project_ids) || !project_ids.length) {
      return res.status(400).json({ error: 'project_ids array required' });
    }
    let data;
    try {
      data = await invoiceGenerator.buildInvoiceDataFromProjects(pool, {
        project_ids, period_start, period_end,
      });
    } catch (e) {
      if (e.conflicts) {
        // 422 = "we understand the request but it can't be processed as-is".
        // Frontend reads e.conflicts to show the user what to fix.
        return res.status(422).json({
          error: e.message,
          conflicts: e.conflicts,
          makeup: e.makeup,
        });
      }
      console.error('[invoices:generate-pdf-from-projects]', e && e.message);
      return res.status(400).json({ error: e.message });
    }
    const filename = invoiceGenerator.suggestedFilename(data);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    try {
      invoiceGenerator.renderInvoicePdf(data, res);
    } catch (e) {
      console.error('[invoices:generate-pdf-from-projects:render]', e && e.stack || e);
      if (!res.headersSent) {
        res.status(500).json({ error: 'PDF render failed.' });
      } else {
        res.end();
      }
    }
  });

  // GET /api/invoices/generate-pdf/preview-data — returns the assembled
  // data structure without rendering. Useful for the UI to show a "this
  // is what's in the invoice" preview before the user clicks Generate PDF.
  app.get('/api/invoices/generate-pdf/preview-data', requireManagerOrAdmin, async (req, res) => {
    const { engineering_contract_id, job_id, period_start, period_end } = req.query || {};
    if (!engineering_contract_id || !job_id || !period_start || !period_end) {
      return res.status(400).json({ error: 'engineering_contract_id, job_id, period_start, period_end required' });
    }
    try {
      const data = await invoiceGenerator.buildInvoiceData(pool, {
        engineering_contract_id, job_id, period_start, period_end,
      });
      res.json(data);
    } catch (e) {
      console.error('[invoices:generate-pdf:preview]', e && e.message);
      res.status(400).json({ error: e.message });
    }
  });

  app.delete('/api/invoices/:id', requireManagerOrAdmin, async (req, res) => {
    const { wipe_hours } = req.query; // ?wipe_hours=true
    try {
      // Get invoice items to find linked projects
      const { rows: items } = await pool.query(
        'SELECT project_id FROM invoice_items WHERE invoice_id=$1', [req.params.id]
      );
      const projectIds = items.map(i => i.project_id).filter(Boolean);

      // Unbill linked projects (set status back to completed, clear billed_date)
      for (const pid of projectIds) {
        await pool.query(
          `UPDATE projects SET status='completed', billed_date=NULL WHERE id=$1 AND status='billed'`,
          [pid]
        );
      }

      // Optionally wipe hours for those projects
      if (wipe_hours === 'true') {
        for (const pid of projectIds) {
          await pool.query('DELETE FROM time_entries WHERE project_id=$1', [pid]);
          await updateProjectHours(pid);
        }
      }

      // Delete the invoice (cascade deletes invoice_items)
      await pool.query('DELETE FROM invoices WHERE id=$1', [req.params.id]);

      res.json({ ok: true, unbilled_projects: projectIds.length });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
};
