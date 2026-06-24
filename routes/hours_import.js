// routes/hours_import.js — keystone hours-CSV importer (the admin → cluster port).
//
// Replaces the legacy routes/hours_csv.js path that imported timecard hours into
// the retiring `projects` rollup tree. Same upload/parse pipeline (reuses the
// pure parsing helpers from hours_csv), but each row is matched to a
// `service_area_job` (see routes/_hours_match.js) and committed hours land in
// `time_entries.service_area_job_id`, then roll up into the job's actuals.
//
// Flow: POST /api/hours/import/validate (upload → parse → match → staged preview)
//       POST /api/hours/import/commit   (insert matched/overridden rows → recompute)
//
// Review rows (ambiguous / unknown) come back in the preview with a reason and
// are resolved inline at commit via `overrides` — keeps it one screen, no
// separate queue (a persistent cross-session review queue is a later add and
// needs a small migration; intentionally out of this increment).
//
// Mount (CEO, server.js):
//   require('./routes/hours_import')(app, pool, { requireAdmin, upload });

const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');
const { v4: uuidv4 } = require('uuid');

const { csvStage } = require('./_csv_stage');
const { snapHoursToQuarter } = require('./_helpers');
const { matchRow, normalizeWO, normalizeName } = require('./_hours_match');
const {
  detectColumns, parseDateCell, findHeaderRow, arrayToObjects, inferJobTitle,
} = require('./hours_csv')._helpers;
const { logAudit } = require('./_audit');

const STAGE_TTL_MS = 60 * 60 * 1000; // 1h, matches the legacy stage lifetime

module.exports = function installHoursImportRoutes(app, pool, mw) {
  const { requireAdmin, upload } = mw;
  const uid = (req) => (req && req.user && req.user.id) || null;

  // Build the three lookup maps the matcher needs, from current DB state.
  async function buildMatchContext() {
    const [areaR, jobR, staffR] = await Promise.all([
      pool.query(`SELECT id, name, client_id, program, work_order_number
                    FROM service_areas WHERE work_order_number IS NOT NULL AND work_order_number <> ''`),
      pool.query(`SELECT id, service_area_id, team, assigned_staff_id FROM service_area_jobs`),
      pool.query(`SELECT id, name FROM staff`),
    ]);
    const areasByWO = new Map();
    for (const a of areaR.rows) {
      const k = normalizeWO(a.work_order_number);
      if (!k) continue;
      if (!areasByWO.has(k)) areasByWO.set(k, []);
      areasByWO.get(k).push({ id: a.id, name: a.name, client_id: a.client_id, program: a.program });
    }
    const jobsByArea = new Map();
    for (const j of jobR.rows) {
      if (!jobsByArea.has(j.service_area_id)) jobsByArea.set(j.service_area_id, []);
      jobsByArea.get(j.service_area_id).push({ id: j.id, team: j.team, assigned_staff_id: j.assigned_staff_id });
    }
    const staffByName = new Map();
    for (const s of staffR.rows) staffByName.set(normalizeName(s.name), { id: s.id, name: s.name });
    return { areasByWO, jobsByArea, staffByName };
  }

  // Recompute a job's actual_hours + actual_amount from its time entries.
  // (Mirrors recomputeJob in routes/service_areas.js — keystone money math
  // stays server-side and consistent.)
  async function recomputeJob(client, jobId) {
    await client.query(
      `UPDATE service_area_jobs saj SET
         actual_hours = COALESCE((SELECT SUM(hours) FROM time_entries WHERE service_area_job_id = saj.id), 0),
         actual_amount = CASE saj.billing_type
           WHEN 'hourly'  THEN COALESCE((SELECT SUM(hours) FROM time_entries WHERE service_area_job_id = saj.id), 0) * COALESCE(saj.rate, 0)
           WHEN 'footage' THEN COALESCE(saj.footage, 0) * COALESCE(saj.rate, 0)
           ELSE COALESCE(saj.estimated_amount, 0)
         END,
         updated_at = now()
       WHERE saj.id = $1`,
      [jobId]
    );
  }

  // ─── Validate: parse + match → staged preview ──────────────────────────────
  app.post('/api/hours/import/validate', requireAdmin, upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const overrideYear = req.body.override_year ? parseInt(req.body.override_year, 10) : null;
    try {
      const ext = path.extname(req.file.originalname).toLowerCase();
      let rows2d = [];
      try {
        if (ext === '.xlsx' || ext === '.xls') {
          const wb = XLSX.readFile(req.file.path);
          rows2d = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1, defval: '', raw: false, dateNF: 'yyyy-mm-dd', blankrows: false });
        } else if (ext === '.csv' || ext === '.tsv') {
          const content = await fs.promises.readFile(req.file.path, 'utf8');
          const wb = XLSX.read(content, { type: 'string' });
          rows2d = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1, defval: '', raw: false, dateNF: 'yyyy-mm-dd', blankrows: false });
        } else {
          return res.status(400).json({ error: 'Unsupported file type. Use .csv, .xlsx, or .xls.' });
        }
      } finally {
        await fs.promises.unlink(req.file.path).catch(() => null);
      }

      const headerIdx = findHeaderRow(rows2d);
      if (headerIdx < 0) {
        return res.status(400).json({ error: 'Could not find a header row in the first 20 rows. Expected name/employee, date, hours, work order.', first_rows: rows2d.slice(0, 8) });
      }
      const { headers, rows } = arrayToObjects(rows2d, headerIdx);
      const cols = detectColumns(headers);
      const missing = [];
      if (!cols.name) missing.push('name/employee/inspector');
      if (!cols.date) missing.push('date');
      if (!cols.wo) missing.push('work_order');
      if (!cols.hours) missing.push('hours');
      if (missing.length) return res.status(400).json({ error: 'Missing required columns: ' + missing.join(', '), headers, detected_columns: cols });

      const inferredJobTitle = inferJobTitle(req.file.originalname, rows2d, headerIdx);
      const ctx = await buildMatchContext();

      const out = [];
      let matchedCount = 0, reviewCount = 0, totalHours = 0;
      rows.forEach((raw, i) => {
        const employee = raw[cols.name];
        const date = parseDateCell(raw[cols.date], null, null, overrideYear);
        const wo = raw[cols.wo];
        const hours = snapHoursToQuarter(parseFloat(raw[cols.hours]));
        const jobTitle = (cols.job_title && raw[cols.job_title]) ? raw[cols.job_title] : inferredJobTitle;
        const customer = cols.customer ? raw[cols.customer] : null;

        const base = { rowIndex: i, employee: employee || '', date, wo: wo || '', hours, jobTitle: jobTitle || '' };
        // Row-level invalid data takes precedence over a match.
        if (!date) { out.push(Object.assign(base, { status: 'review', reason: 'Unparseable / missing date', service_area_id: null, service_area_job_id: null, staff_id: null, team: null, is_billable: true, unbilled_category: null })); reviewCount++; return; }
        if (!(hours > 0)) { out.push(Object.assign(base, { status: 'review', reason: 'Missing / zero hours', service_area_id: null, service_area_job_id: null, staff_id: null, team: null, is_billable: true, unbilled_category: null })); reviewCount++; return; }

        const m = matchRow({ employee, wo, jobTitle, customer }, ctx);
        if (m.status === 'matched') matchedCount++; else reviewCount++;
        totalHours += hours;
        out.push(Object.assign(base, m));
      });

      const stageId = uuidv4();
      csvStage.set(stageId, { rows: out, fileName: req.file.originalname, createdBy: uid(req), expiresAt: Date.now() + STAGE_TTL_MS });

      res.json({
        stageId,
        fileName: req.file.originalname,
        columns: cols,
        summary: { total: out.length, matched: matchedCount, review: reviewCount, totalHours: Math.round(totalHours * 100) / 100 },
        rows: out,
      });
    } catch (e) {
      console.error('[hours_import:validate]', e && e.message);
      res.status(500).json({ error: 'Failed to read the file.' });
    }
  });

  // ─── Commit: insert matched + inline-resolved rows → recompute ─────────────
  // Body: { stageId, overrides?: { "<rowIndex>": "<service_area_job_id>" }, skip?: [rowIndex,...] }
  app.post('/api/hours/import/commit', requireAdmin, async (req, res) => {
    const { stageId } = req.body || {};
    const overrides = (req.body && req.body.overrides) || {};
    const skip = new Set(((req.body && req.body.skip) || []).map(Number));
    if (!stageId) return res.status(400).json({ error: 'stageId required' });

    const staged = csvStage.get(stageId);
    if (!staged || staged.expiresAt < Date.now()) {
      csvStage.delete(stageId);
      return res.status(410).json({ error: 'Upload session expired — re-validate the file.' });
    }

    // Resolve each row to a final {service_area_job_id, staff_id} or drop it.
    const toCommit = [];
    let reviewRemaining = 0;
    for (const row of staged.rows) {
      if (skip.has(row.rowIndex)) continue;
      const ovr = overrides[row.rowIndex] || overrides[String(row.rowIndex)] || null;
      const jobId = ovr || row.service_area_job_id;
      // staff_id must be known to attribute the hours; an override can fix the
      // job but not an unknown employee.
      if (!jobId || !row.staff_id || !(row.hours > 0) || !row.date) {
        if (row.status !== 'matched' && !ovr) reviewRemaining++;
        else if (!row.staff_id) reviewRemaining++;
        continue;
      }
      toCommit.push({ ...row, service_area_job_id: jobId });
    }

    if (!toCommit.length) return res.json({ committed: 0, skipped: skip.size, review_remaining: reviewRemaining, jobs_recomputed: 0 });

    const importBatch = 'import:' + new Date().toISOString().slice(0, 19) + ':' + stageId.slice(0, 8);
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      // Guard: only commit to jobs that actually exist (override could be stale).
      const jobIds = [...new Set(toCommit.map((r) => r.service_area_job_id))];
      const { rows: validJobs } = await client.query(
        `SELECT id FROM service_area_jobs WHERE id = ANY($1::uuid[])`, [jobIds]
      );
      const validSet = new Set(validJobs.map((j) => j.id));

      let committed = 0;
      const touched = new Set();
      for (const r of toCommit) {
        if (!validSet.has(r.service_area_job_id)) { reviewRemaining++; continue; }
        await client.query(
          `INSERT INTO time_entries
             (service_area_job_id, staff_id, entry_date, hours, job_title, import_batch, is_billable, unbilled_category, user_id)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
          [r.service_area_job_id, r.staff_id, r.date, r.hours, r.team || r.jobTitle || null,
           importBatch, r.is_billable !== false, r.unbilled_category || null, uid(req)]
        );
        committed++;
        touched.add(r.service_area_job_id);
      }
      for (const jobId of touched) await recomputeJob(client, jobId);
      await client.query('COMMIT');

      logAudit(pool, { req, action: 'hours.import.commit', entity_type: 'time_entries',
        entity_id: null, after: { committed, jobs: touched.size, batch: importBatch }, source: 'admin' }).catch(() => {});
      csvStage.delete(stageId);
      res.json({ committed, skipped: skip.size, review_remaining: reviewRemaining, jobs_recomputed: touched.size, import_batch: importBatch });
    } catch (e) {
      await client.query('ROLLBACK').catch(() => {});
      console.error('[hours_import:commit]', e && e.message);
      res.status(500).json({ error: 'Failed to import hours.' });
    } finally {
      client.release();
    }
  });
};
