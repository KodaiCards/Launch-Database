// routes/invoice_templates.js
//
// CRUD for the reference-PDF-driven invoice templates + the render-from-
// template endpoint. Owner uploads a sample PDF for a (job, client) pair;
// Claude vision analyses it once and the system stores the resulting HTML
// template (with mustache placeholders). At invoice time a separate
// endpoint substitutes real data and renders to PDF via puppeteer.
//
// Endpoints (all manager+admin):
//   GET    /api/invoice-templates                  list (with job/client names)
//   GET    /api/invoice-templates/:id              detail (incl. generated_html)
//   POST   /api/invoice-templates                  multipart: pdf file + form
//   PUT    /api/invoice-templates/:id              update name/notes/HTML
//   POST   /api/invoice-templates/:id/regenerate   re-run Claude on the PDF
//   DELETE /api/invoice-templates/:id              drop file + row
//   GET    /api/invoice-templates/:id/reference    download original PDF
//
//   POST   /api/invoices/preview-template          fill HTML for preview/edit
//   POST   /api/invoices/render-pdf-from-html      puppeteer-render arbitrary HTML
//
// Rendered PDFs flow back as a stream so we never buffer the full
// document in Node memory.

const path = require('path');
const fs = require('fs');
const fsp = fs.promises;
const multer = require('multer');
const invoiceGenerator = require('../invoice_generator');
const tplEngine = require('../invoice_template_engine');
const { logAudit } = require('./_audit');

module.exports = function installInvoiceTemplatesRoutes(app, pool, mw) {
  const { requireManagerOrAdmin, uploadDir } = mw;

  // ─── Multer: PDF upload (5 MB cap, .pdf only) ─────────────────────────
  const TEMPLATE_DIR = path.join(uploadDir || path.join(__dirname, '..', 'uploads'), 'invoice-templates');
  try { fs.mkdirSync(TEMPLATE_DIR, { recursive: true }); } catch {}

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, TEMPLATE_DIR),
    filename: (req, file, cb) => {
      // Sanitize: keep alphanumerics + dots/hyphens/underscores, prefix
      // with a timestamp to avoid clobbering on re-upload.
      const safe = String(file.originalname || 'sample.pdf')
        .replace(/[^A-Za-z0-9._-]/g, '_').slice(0, 200);
      cb(null, `${Date.now()}_${safe}`);
    },
  });
  const upload = multer({
    storage,
    // 50 MB cap — invoice format samples are sometimes scanned PDFs with
    // embedded images. The previous 5 MB ceiling was too tight for those
    // and produced an ugly HTML 500 page (no JSON error handler) — see
    // global API error middleware in server.js for the safety net.
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      // mimetype is client-controlled; treat it as a hint only. The
      // post-upload magic-byte check below is the authoritative gate.
      // We still reject obvious non-PDFs at this stage to avoid wasting
      // disk on files that will be unlinked anyway.
      const looksLikePdf = String(file.originalname || '').toLowerCase().endsWith('.pdf');
      if (!looksLikePdf && file.mimetype !== 'application/pdf') {
        return cb(new Error('Only .pdf uploads accepted'));
      }
      cb(null, true);
    },
  });

  // Defence-in-depth: read the first 5 bytes and confirm the PDF magic
  // header (%PDF-) before trusting the upload. Rejected files get
  // unlinked and the caller sees a 400. Cheap operation (5 bytes off
  // disk) and catches MIME-type spoofing.
  function _verifyPdfMagic(filePath) {
    return new Promise((resolve) => {
      try {
        const fd = fs.openSync(filePath, 'r');
        const buf = Buffer.alloc(5);
        fs.readSync(fd, buf, 0, 5, 0);
        fs.closeSync(fd);
        resolve(buf.toString('ascii') === '%PDF-');
      } catch { resolve(false); }
    });
  }

  // ─── Helper: run Claude analysis + persist result ─────────────────────
  // Best-effort. On failure we keep the row with analysis_status='failed'
  // and the operator can hit /regenerate or paste their own HTML via PUT.
  async function runAnalysisAndPersist(templateId, pdfPath) {
    try {
      const buf = await fsp.readFile(pdfPath);
      const html = await tplEngine.analyzeInvoicePdf(buf);
      await pool.query(
        `UPDATE invoice_templates
            SET generated_html = $2,
                analysis_status = 'ready',
                analysis_error = NULL,
                analyzed_at = NOW()
          WHERE id = $1`,
        [templateId, html]
      );
      return { ok: true };
    } catch (e) {
      console.error('[invoice-templates:analyze]', e);
      await pool.query(
        `UPDATE invoice_templates
            SET analysis_status = 'failed',
                analysis_error = $2,
                analyzed_at = NOW()
          WHERE id = $1`,
        [templateId, String(e && e.message || e).slice(0, 1000)]
      );
      return { ok: false, error: 'Analysis failed: internal server error' };
    }
  }

  // ─── List ──────────────────────────────────────────────────────────────
  app.get('/api/invoice-templates', requireManagerOrAdmin, async (req, res) => {
    try {
      const { rows } = await pool.query(`
        SELECT it.id, it.job_id, it.client_id, it.name,
               it.reference_pdf_filename, it.notes,
               it.analysis_status, it.analysis_error, it.analyzed_at,
               it.created_at, it.updated_at,
               j.name AS job_name, cl.name AS client_name,
               (it.generated_html IS NOT NULL AND length(it.generated_html) > 0) AS has_html
          FROM invoice_templates it
          LEFT JOIN jobs j     ON j.id = it.job_id
          LEFT JOIN clients cl ON cl.id = it.client_id
         ORDER BY cl.name NULLS LAST, j.name NULLS LAST, it.created_at DESC
      `);
      res.json(rows);
    } catch (e) {
      console.error('[invoice-templates:list]', e && e.message);
      res.status(500).json({ error: 'Failed to list templates.' });
    }
  });

  // ─── Detail ────────────────────────────────────────────────────────────
  app.get('/api/invoice-templates/:id', requireManagerOrAdmin, async (req, res) => {
    try {
      const { rows } = await pool.query(`
        SELECT it.*,
               j.name AS job_name, cl.name AS client_name
          FROM invoice_templates it
          LEFT JOIN jobs j     ON j.id = it.job_id
          LEFT JOIN clients cl ON cl.id = it.client_id
         WHERE it.id = $1
      `, [req.params.id]);
      if (!rows[0]) return res.status(404).json({ error: 'Template not found.' });
      // Don't leak the on-disk path; client only needs filename.
      const r = { ...rows[0] };
      delete r.reference_pdf_path;
      res.json(r);
    } catch (e) {
      console.error('[invoice-templates:detail]', e && e.message);
      res.status(500).json({ error: 'Failed to load template.' });
    }
  });

  // ─── Create + analyze ─────────────────────────────────────────────────
  app.post('/api/invoice-templates', requireManagerOrAdmin, upload.single('pdf'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'PDF file required (field name "pdf").' });
    const { job_id, client_id, name, notes } = req.body || {};
    if (!job_id || !client_id) {
      try { await fsp.unlink(req.file.path); } catch {}
      return res.status(400).json({ error: 'job_id and client_id are required.' });
    }
    // Magic-byte gate. file.mimetype was client-controlled.
    if (!await _verifyPdfMagic(req.file.path)) {
      try { await fsp.unlink(req.file.path); } catch {}
      return res.status(400).json({ error: 'Uploaded file is not a valid PDF (header check failed).' });
    }
    try {
      // UNIQUE (job_id, client_id) — replace existing template, archive old PDF.
      const { rows: existing } = await pool.query(
        `SELECT id, reference_pdf_path FROM invoice_templates
          WHERE job_id = $1 AND client_id = $2`,
        [job_id, client_id]
      );
      let templateId;
      if (existing[0]) {
        templateId = existing[0].id;
        // Best-effort delete of the old PDF file. Failure (eg. file already
        // missing) is fine — we'd rather leak a stale file than fail the
        // upload.
        if (existing[0].reference_pdf_path) {
          try { await fsp.unlink(existing[0].reference_pdf_path); } catch {}
        }
        await pool.query(
          `UPDATE invoice_templates
              SET name = $2, notes = $3,
                  reference_pdf_path = $4, reference_pdf_filename = $5,
                  generated_html = NULL,
                  analysis_status = 'pending',
                  analysis_error = NULL,
                  analyzed_at = NULL,
                  updated_at = NOW()
            WHERE id = $1`,
          [templateId, name || null, notes || null, req.file.path, req.file.originalname || null]
        );
      } else {
        const ins = await pool.query(
          `INSERT INTO invoice_templates
             (job_id, client_id, name, reference_pdf_path, reference_pdf_filename, notes,
              analysis_status, created_by_user_id)
           VALUES ($1, $2, $3, $4, $5, $6, 'pending', $7)
           RETURNING id`,
          [job_id, client_id, name || null, req.file.path,
           req.file.originalname || null, notes || null,
           (req.user && req.user.id) || null]
        );
        templateId = ins.rows[0].id;
      }

      // Kick the analysis. We await so the response carries the result —
      // makes the UI predictable (the operator clicks Save and sees
      // success / failure). For 50-page invoice samples this might run
      // 15-25 seconds; the request stays open. Async worker pattern is
      // future-work if that becomes painful.
      const result = await runAnalysisAndPersist(templateId, req.file.path);
      const { rows: out } = await pool.query(
        `SELECT id, job_id, client_id, name, reference_pdf_filename,
                analysis_status, analysis_error, analyzed_at
           FROM invoice_templates WHERE id = $1`,
        [templateId]
      );
      logAudit(pool, {
        req,
        action: 'invoice_template.create',
        entity_type: 'invoice_template',
        entity_id: templateId,
        source: 'admin',
      }).catch(()=>{});
      res.json({ ...out[0], analysis: result });
    } catch (e) {
      console.error('[invoice-templates:create]', e && e.stack || e);
      try { await fsp.unlink(req.file.path); } catch {}
      res.status(500).json({ error: 'Failed to save template.' });
    }
  });

  // ─── Update (name, notes, manually-edited HTML) ───────────────────────
  app.put('/api/invoice-templates/:id', requireManagerOrAdmin, async (req, res) => {
    const { name, notes, generated_html } = req.body || {};
    const sanitized_html = generated_html ? tplEngine.sanitizeTemplateHtml(generated_html) : null;
    try {
      const { rows } = await pool.query(
        `UPDATE invoice_templates
            SET name           = COALESCE($2, name),
                notes          = COALESCE($3, notes),
                generated_html = COALESCE($4, generated_html),
                analysis_status = CASE WHEN $4::text IS NOT NULL THEN 'ready' ELSE analysis_status END,
                updated_at = NOW()
          WHERE id = $1
          RETURNING id, job_id, client_id, name, analysis_status, analyzed_at`,
        [req.params.id, name || null, notes || null, sanitized_html]
      );
      if (!rows[0]) return res.status(404).json({ error: 'Template not found.' });
      logAudit(pool, {
        req,
        action: 'invoice_template.update',
        entity_type: 'invoice_template',
        entity_id: req.params.id,
        source: 'admin',
      }).catch(()=>{});
      res.json(rows[0]);
    } catch (e) {
      console.error('[invoice-templates:update]', e && e.message);
      res.status(500).json({ error: 'Failed to update template.' });
    }
  });

  // ─── Regenerate via Claude analysis ───────────────────────────────────
  app.post('/api/invoice-templates/:id/regenerate', requireManagerOrAdmin, async (req, res) => {
    try {
      const { rows } = await pool.query(
        `SELECT id, reference_pdf_path FROM invoice_templates WHERE id = $1`,
        [req.params.id]
      );
      if (!rows[0]) return res.status(404).json({ error: 'Template not found.' });
      const t = rows[0];
      // BE-perf: was fs.existsSync (sync I/O blocks event loop on every
      // request). fsp.stat is non-blocking; missing file rejects and we
      // map that to the same 400 response.
      const refExists = t.reference_pdf_path
        ? await fsp.stat(t.reference_pdf_path).then(() => true).catch(() => false)
        : false;
      if (!refExists) {
        return res.status(400).json({ error: 'Reference PDF missing on disk; re-upload required.' });
      }
      const result = await runAnalysisAndPersist(t.id, t.reference_pdf_path);
      const { rows: out } = await pool.query(
        `SELECT id, analysis_status, analysis_error, analyzed_at
           FROM invoice_templates WHERE id = $1`,
        [req.params.id]
      );
      res.json({ ...out[0], analysis: result });
    } catch (e) {
      console.error('[invoice-templates:regenerate]', e && e.message);
      res.status(500).json({ error: 'Failed to regenerate template.' });
    }
  });

  // ─── Delete ───────────────────────────────────────────────────────────
  app.delete('/api/invoice-templates/:id', requireManagerOrAdmin, async (req, res) => {
    try {
      const { rows } = await pool.query(
        `DELETE FROM invoice_templates WHERE id = $1 RETURNING reference_pdf_path`,
        [req.params.id]
      );
      if (!rows[0]) return res.status(404).json({ error: 'Template not found.' });
      if (rows[0].reference_pdf_path) {
        try { await fsp.unlink(rows[0].reference_pdf_path); } catch {}
      }
      logAudit(pool, {
        req,
        action: 'invoice_template.delete',
        entity_type: 'invoice_template',
        entity_id: req.params.id,
        source: 'admin',
      }).catch(()=>{});
      res.json({ ok: true });
    } catch (e) {
      console.error('[invoice-templates:delete]', e && e.message);
      res.status(500).json({ error: 'Failed to delete template.' });
    }
  });

  // ─── Download the original PDF reference ──────────────────────────────
  app.get('/api/invoice-templates/:id/reference', requireManagerOrAdmin, async (req, res) => {
    try {
      const { rows } = await pool.query(
        `SELECT reference_pdf_path, reference_pdf_filename FROM invoice_templates WHERE id = $1`,
        [req.params.id]
      );
      if (!rows[0] || !rows[0].reference_pdf_path) return res.status(404).json({ error: 'Reference PDF missing.' });
      const p = rows[0].reference_pdf_path;
      // Path-traversal guard, Windows-safe: path.relative returns a
      // string starting with '..' or an absolute path when the resolved
      // path escapes the base. startsWith() on raw paths is fragile
      // across separator/casing differences.
      const resolved = path.resolve(p);
      const base = path.resolve(TEMPLATE_DIR);
      const rel = path.relative(base, resolved);
      if (!rel || rel.startsWith('..') || path.isAbsolute(rel)) {
        return res.status(400).json({ error: 'Invalid reference path.' });
      }
      // BE-perf: was fs.existsSync (sync I/O blocks event loop). fsp.stat
      // is non-blocking; missing file maps to the same 404.
      const exists = await fsp.stat(resolved).then(() => true).catch(() => false);
      if (!exists) return res.status(404).json({ error: 'Reference PDF file missing on disk.' });
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition',
        `inline; filename="${(rows[0].reference_pdf_filename || 'reference.pdf').replace(/[^A-Za-z0-9._-]/g, '_')}"`);
      fs.createReadStream(resolved).pipe(res);
    } catch (e) {
      console.error('[invoice-templates:reference]', e && e.message);
      res.status(500).json({ error: 'Failed to fetch reference PDF.' });
    }
  });

  // ──────────────────────────────────────────────────────────────────────
  // RENDER endpoints — separate URL-space (/api/invoices/) so they live
  // alongside the existing PDF generator and can be mixed into the same
  // billing flow.
  // ──────────────────────────────────────────────────────────────────────

  // POST /api/invoices/preview-template
  // Body: { engineering_contract_id, job_id, period_start, period_end,
  //         contract_ids? }
  // Returns: { html, has_template, template_id?, data }
  // The frontend renders `html` in an iframe; admin can hand-edit before
  // POSTing it back to /render-pdf-from-html for the final PDF.
  app.post('/api/invoices/preview-template', requireManagerOrAdmin, async (req, res) => {
    const { engineering_contract_id, job_id, period_start, period_end, contract_ids } = req.body || {};
    if (!engineering_contract_id || !job_id || !period_start || !period_end) {
      return res.status(400).json({ error: 'engineering_contract_id, job_id, period_start, period_end required' });
    }
    let data;
    try {
      data = await invoiceGenerator.buildInvoiceData(pool, {
        engineering_contract_id, job_id, period_start, period_end,
        contract_ids: Array.isArray(contract_ids) ? contract_ids : null,
      });
    } catch (e) {
      console.error('[invoices:preview-template]', e);
      return res.status(400).json({ error: 'Failed to build invoice data: internal server error' });
    }
    // Resolve client_id via the engineering_contract → client.
    const client_id = data && data.meta && data.meta.engineering_contract && data.meta.engineering_contract.id
      ? (await pool.query(`SELECT client_id FROM engineering_contracts WHERE id = $1`,
                          [data.meta.engineering_contract.id])).rows[0]?.client_id
      : null;
    let template = null;
    if (client_id) {
      const { rows } = await pool.query(
        `SELECT id, generated_html, analysis_status FROM invoice_templates
          WHERE job_id = $1 AND client_id = $2`,
        [job_id, client_id]
      );
      template = rows[0] || null;
    }
    const adapted = tplEngine.adaptInvoiceDataForTemplate(data);
    if (!template || !template.generated_html || template.analysis_status !== 'ready') {
      return res.json({
        has_template: false,
        message: 'No template uploaded for this (job, client). Use the legacy generator or upload a template in Settings.',
        data: adapted,
      });
    }
    const html = tplEngine.substituteTemplate(template.generated_html, adapted);
    const sanitized = tplEngine.sanitizeTemplateHtml(html);
    res.json({
      has_template: true,
      template_id: template.id,
      html: sanitized,
      data: adapted,
    });
  });

  // POST /api/invoices/preview-from-projects
  // Same shape as /generate-pdf-from-projects (project_ids + optional
  // period_start/end), but instead of streaming a PDF it returns either:
  //   { has_template: true, html, makeup, data, template_id }   ← go to preview modal
  //   { has_template: false, makeup }                            ← caller should fall back
  // Called from the billing flow before deciding whether to use the
  // template path or the legacy hardcoded PSC RUS pdfkit generator.
  app.post('/api/invoices/preview-from-projects', requireManagerOrAdmin, async (req, res) => {
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
      console.error('[invoices:preview-from-projects]', e);
      return res.status(422).json({ error: 'Failed to build invoice data: internal server error', conflicts: e.conflicts || null, makeup: e.makeup || null });
    }
    // Resolve client_id via the engineering_contract.
    const ecId = data && data.meta && data.meta.engineering_contract && data.meta.engineering_contract.id;
    let clientId = null;
    if (ecId) {
      const r0 = await pool.query(`SELECT client_id FROM engineering_contracts WHERE id = $1`, [ecId]);
      clientId = r0.rows[0]?.client_id || null;
    }
    let template = null;
    if (clientId && data.meta.job_id != null) {
      // job_id isn't on data.meta directly — buildInvoiceData stashes job
      // metadata but not the id. Re-derive from job_name to keep things
      // simple (jobs.name is unique per spec). Falls back to NULL if
      // ambiguous; that just sends the caller down the no-template path.
    }
    // Look up by job NAME via the jobs table since data.meta carries job_name not job_id.
    const jobName = data && data.meta && data.meta.job_name;
    if (clientId && jobName) {
      const { rows: matches } = await pool.query(`
        SELECT it.id, it.generated_html, it.analysis_status
          FROM invoice_templates it
          JOIN jobs j ON j.id = it.job_id
         WHERE LOWER(j.name) = LOWER($1) AND it.client_id = $2
      `, [jobName, clientId]);
      if (matches.length === 0) {
        template = null;
      } else if (matches.length > 1) {
        return res.status(400).json({ error: 'Multiple templates match that job name — use template_id instead' });
      } else {
        template = matches[0];
      }
    }
    const adapted = tplEngine.adaptInvoiceDataForTemplate(data);
    if (!template || !template.generated_html || template.analysis_status !== 'ready') {
      return res.json({
        has_template: false,
        makeup: { engineering_contract_id: ecId, client_id: clientId, job_name: jobName },
        data: adapted,
      });
    }
    const html = tplEngine.substituteTemplate(template.generated_html, adapted);
    const sanitized = tplEngine.sanitizeTemplateHtml(html);
    res.json({
      has_template: true,
      template_id: template.id,
      makeup: { engineering_contract_id: ecId, client_id: clientId, job_name: jobName },
      html: sanitized,
      data: adapted,
    });
  });

  // POST /api/invoices/render-pdf-from-html
  // Body: { html, filename? }
  // Streams the rendered PDF back. The HTML is whatever the operator
  // edited in the preview UI; we don't substitute placeholders here.
  // Manager+admin only — same gate as the legacy generator.
  app.post('/api/invoices/render-pdf-from-html', requireManagerOrAdmin, async (req, res) => {
    const { html, filename } = req.body || {};
    if (!html || typeof html !== 'string') {
      return res.status(400).json({ error: 'html (string) required' });
    }
    let pdfBuf;
    try {
      pdfBuf = await tplEngine.renderHtmlToPdf(html);
    } catch (e) {
      console.error('[invoices:render-pdf-from-html]', e);
      return res.status(500).json({ error: 'PDF render failed: internal server error' });
    }
    const safeName = String(filename || 'invoice.pdf').replace(/[^A-Za-z0-9._-]/g, '_');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${safeName}"`);
    res.setHeader('Content-Length', String(pdfBuf.length));
    res.end(pdfBuf);
  });
};
