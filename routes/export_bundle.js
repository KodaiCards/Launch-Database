// routes/export_bundle.js — admin-only full data export as a ZIP of CSVs.
// Mount: require('./routes/export_bundle')(app, pool, { requireAdmin })
//
//   GET /api/export/all.zip → ZIP containing:
//     service_areas.csv  — all service areas with client + program
//     jobs.csv           — all service_area_jobs with area/client/assigned staff
//     invoices.csv       — all invoices with client, status, total
//
// Admin-only (not just manager). Additive; no mutations.

const archiver = require('archiver');

function csvCell(v) {
  let s = v === null || v === undefined ? '' : String(v);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  if (/[",\n\r]/.test(s)) s = '"' + s.replace(/"/g, '""') + '"';
  return s;
}

function rowsToCsv(header, rows) {
  const lines = [header.map(csvCell).join(',')];
  for (const r of rows) lines.push(r.map(csvCell).join(','));
  return lines.join('\r\n') + '\r\n';
}

module.exports = function installExportBundleRoutes(app, pool, mw) {
  const requireAdmin = (mw && mw.requireAdmin) || ((_req, _res, next) => next());

  app.get('/api/export/all.zip', requireAdmin, async (req, res) => {
    try {
      // Fetch all three datasets in parallel
      const [saRows, jobRows, invRows] = await Promise.all([
        pool.query(
          `SELECT sa.id, sa.name, sa.program, sa.status, sa.work_order_number,
                  c.name AS client_name, ec.name AS engineering_contract
           FROM service_areas sa
           LEFT JOIN clients c ON c.id = sa.client_id
           LEFT JOIN engineering_contracts ec ON ec.id = sa.engineering_contract_id
           ORDER BY c.name, sa.name`
        ).then(r => r.rows),

        pool.query(
          `SELECT saj.id, j.name AS job_name, saj.team, saj.status,
                  COALESCE(saj.estimated_amount, 0)::float AS estimated_amount,
                  COALESCE(saj.actual_amount, 0)::float AS actual_amount,
                  COALESCE(saj.actual_hours, 0)::float AS actual_hours,
                  saj.billing_type, saj.billed_date::text AS billed_date,
                  sa.name AS service_area_name, sa.program,
                  c.name AS client_name,
                  s.name AS assigned_staff
           FROM service_area_jobs saj
           JOIN service_areas sa ON sa.id = saj.service_area_id
           LEFT JOIN clients c ON c.id = sa.client_id
           LEFT JOIN jobs j ON j.id = saj.job_id
           LEFT JOIN staff s ON s.id = saj.assigned_staff_id
           ORDER BY c.name, sa.name, saj.team, j.name`
        ).then(r => r.rows),

        pool.query(
          `SELECT i.invoice_number, i.invoice_date::text AS invoice_date,
                  i.status, COALESCE(i.total_amount, 0)::float AS total_amount,
                  c.name AS client_name
           FROM invoices i
           LEFT JOIN clients c ON c.id = i.client_id
           ORDER BY i.invoice_date DESC NULLS LAST, i.invoice_number`
        ).then(r => r.rows),
      ]);

      const saCsv = rowsToCsv(
        ['ID', 'Name', 'Client', 'Program', 'Status', 'Work Order', 'Engineering Contract'],
        saRows.map(r => [r.id, r.name, r.client_name||'', r.program||'', r.status||'', r.work_order_number||'', r.engineering_contract||''])
      );

      const jobsCsv = rowsToCsv(
        ['ID', 'Job', 'Team', 'Status', 'Billing Type', 'Estimated $', 'Actual $', 'Hours', 'Billed Date', 'Service Area', 'Program', 'Client', 'Assigned Staff'],
        jobRows.map(r => [r.id, r.job_name||'', r.team||'', r.status||'', r.billing_type||'',
          r.estimated_amount.toFixed(2), r.actual_amount.toFixed(2), r.actual_hours.toFixed(2),
          r.billed_date||'', r.service_area_name||'', r.program||'', r.client_name||'', r.assigned_staff||''])
      );

      const invCsv = rowsToCsv(
        ['Invoice #', 'Date', 'Client', 'Status', 'Total'],
        invRows.map(r => [r.invoice_number||'', r.invoice_date||'', r.client_name||'', r.status||'', r.total_amount.toFixed(2)])
      );

      const stamp = new Date().toISOString().slice(0, 10);
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="launch-export-${stamp}.zip"`);

      const archive = archiver('zip', { zlib: { level: 6 } });
      archive.on('error', err => { throw err; });
      archive.pipe(res);
      archive.append(saCsv,   { name: 'service_areas.csv' });
      archive.append(jobsCsv, { name: 'jobs.csv' });
      archive.append(invCsv,  { name: 'invoices.csv' });
      await archive.finalize();
    } catch (e) {
      console.error('[export:all-zip]', e && e.message);
      if (!res.headersSent) res.status(500).json({ error: 'Export failed.' });
    }
  });
};

module.exports._helpers = { csvCell };
