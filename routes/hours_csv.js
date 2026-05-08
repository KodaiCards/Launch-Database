// routes/hours_csv.js
//
// Hours CSV / XLSX import — three-phase flow:
//   POST /api/hours/csv-validate    multipart upload → parsed + classified
//   POST /api/hours/csv-edit-row    per-row mutation before commit
//   POST /api/hours/csv-commit      stage_id → real time_entries rows
//
// Extracted from server.js as part of CLEANUP_PLAN.md Track 1.3.
// The shared csvStage Map lives in routes/_csv_stage.js so the AI's
// csv_smart_import path can read the same stage IDs without circular
// require between this module and routes/ai.js.
//
// Smoke tests: tests/csv_import.test.js exercises happy-path validate,
// duplicate detection (would_skip_duplicate), and modify
// classification (would_modify). Run via `npm test`.

const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const { v4: uuidv4 } = require('uuid');

const { csvStage, CSV_STAGE_TTL_MS } = require('./_csv_stage');
const { snapHoursToQuarter } = require('./_helpers');
const { updateProjectHours } = require('./_helpers');

// ─── Pure helpers ─────────────────────────────────────────────────────────
// Pure (no DB / state). Exported via module.exports._helpers so tests
// can hit them directly if needed.

// Normalize a WO# for matching: strip "WO" prefix, separators, whitespace, uppercase
function normalizeWO(s) {
  if (s === null || s === undefined) return '';
  return String(s).trim().toUpperCase()
    .replace(/^WO[\s\-_#:]*/i, '')   // strip leading "WO ", "WO-", "WO#", etc.
    .replace(/[\s\-_]+/g, '');         // strip remaining separators
}

// Normalize a name for matching: trim, collapse whitespace, lowercase
function normalizeName(s) {
  if (s === null || s === undefined) return '';
  return String(s).trim().replace(/\s+/g, ' ').toLowerCase();
}

// Match a header row to our canonical fields.
function detectColumns(headers) {
  const lc = headers.map(h => String(h).trim().toLowerCase());
  function findOne(...candidates) {
    for (const c of candidates) {
      const i = lc.indexOf(c);
      if (i >= 0) return headers[i];
    }
    return null;
  }
  return {
    name: findOne('name', 'employee', 'worker', 'staff', 'staff_name', 'employee_name', 'inspector', 'inspector name'),
    date: findOne('date', 'entry_date', 'work_date', 'day', 'work date'),
    week_ending: findOne('week ending', 'week_ending', 'weekending', 'week-ending'),
    wo: findOne('wo', 'wo#', 'wo #', 'work_order', 'work order', 'work_order_number', 'wo_number', 'work order #', 'work order#', 'job', 'job#'),
    hours: findOne('hours', 'hrs', 'time', 'qty'),
    job_title: findOne('job_title', 'title', 'position', 'role', 'classification'),
    billing_code: findOne('billing code', 'billing_code', 'code', 'rus code', 'rus billing code'),
    // Timeclock app exports the picked customer label here. Used by
    // classifyUnbilled() to detect placeholder customers (Miscellaneous,
    // Permitting, bare "WO #N") whose hours are not billable.
    customer: findOne('customer', 'client', 'customer_name', 'customer name', 'client_name', 'client name', 'cust')
  };
}

// Classify a CSV row's customer label into a billing bucket.
//   { unbilled: true,  category: 'misc' }       — "Miscellaneous" / "MISC"
//   { unbilled: true,  category: 'permitting' } — "Permitting"
//   { unbilled: true,  category: 'wo_only' }    — bare "WO #16295" with
//                                                  no real customer prefix
//   { unbilled: false, category: null }         — real customer (e.g.
//                                                  "Butler Inspecting WO #16295")
//
// Empty / missing input is treated as billed (preserves the legacy
// "no customer column at all" behavior — those CSVs never carried an
// unbilled marker, so they should still default to billed).
function classifyUnbilled(rawCustomer) {
  if (rawCustomer === null || rawCustomer === undefined) return { unbilled: false, category: null };
  const s = String(rawCustomer).trim();
  if (!s) return { unbilled: false, category: null };
  const lc = s.toLowerCase();
  if (lc === 'miscellaneous' || lc === 'misc') return { unbilled: true, category: 'misc' };
  if (lc === 'permitting') return { unbilled: true, category: 'permitting' };
  // Bare WO label with no customer prefix: "WO #16295", "WO 16295", "WO16295".
  if (/^wo\s*[#-]?\s*\d+$/i.test(s)) return { unbilled: true, category: 'wo_only' };
  return { unbilled: false, category: null };
}

const MONTH_LOOKUP = {
  jan:1, january:1, feb:2, february:2, mar:3, march:3, apr:4, april:4,
  may:5, jun:6, june:6, jul:7, july:7, aug:8, august:8,
  sep:9, sept:9, september:9, oct:10, october:10, nov:11, november:11, dec:12, december:12
};

// Smart year inference for short-month dates: assume current month's
// year unless the CSV month is far ahead (then it's last year).
function inferYear(csvMonth, anchorYear) {
  if (anchorYear) return anchorYear;
  const now = new Date();
  const curMonth = now.getMonth() + 1;
  const curYear = now.getFullYear();
  if (csvMonth > curMonth + 1) return curYear - 1;
  return curYear;
}

// Parse a date cell into YYYY-MM-DD or return null.
function parseDateCell(v, anchorYear, anchorDate, overrideYear) {
  if (v === null || v === undefined || v === '') return null;
  const s = String(v).trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  let m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (m) return `${m[3]}-${m[1].padStart(2,'0')}-${m[2].padStart(2,'0')}`;
  m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2})$/);
  if (m) {
    const yr = 2000 + parseInt(m[3], 10);
    return `${yr}-${m[1].padStart(2,'0')}-${m[2].padStart(2,'0')}`;
  }
  m = s.match(/^(\d{1,2})[\/\-](\d{1,2})$/);
  if (m) {
    const month = parseInt(m[1], 10);
    const day = parseInt(m[2], 10);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      const year = overrideYear || inferYear(month, anchorYear);
      return `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    }
  }
  m = s.match(/^(\d{1,2})[-\s\/]([A-Za-z]{3,})$/);
  if (m) {
    const monthNum = MONTH_LOOKUP[m[2].toLowerCase()];
    if (monthNum) {
      let year = overrideYear || anchorYear || inferYear(monthNum, null);
      const day = parseInt(m[1], 10);
      let result = `${year}-${String(monthNum).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
      if (anchorDate && !overrideYear) {
        const d = new Date(result + 'T00:00:00');
        const anchor = new Date(anchorDate + 'T00:00:00');
        const diffDays = (d - anchor) / 86400000;
        if (diffDays > 7) {
          year = (anchorYear || year) - 1;
          result = `${year}-${String(monthNum).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
        } else if (diffDays < -14) {
          year = (anchorYear || year) + 1;
          result = `${year}-${String(monthNum).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
        }
      }
      return result;
    }
  }
  const d = new Date(s);
  if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
  return null;
}

// Find the actual header row in a 2D array. Real-world spreadsheets
// often have title and metadata rows above the column headers.
function findHeaderRow(rows2d) {
  const SIGNALS = ['name', 'employee', 'worker', 'inspector', 'staff', 'date',
    'week ending', 'hours', 'hrs', 'wo', 'work order', 'job'];
  for (let i = 0; i < Math.min(rows2d.length, 20); i++) {
    const row = rows2d[i] || [];
    const lc = row.map(c => String(c || '').trim().toLowerCase()).filter(Boolean);
    if (lc.length < 3) continue;
    let matches = 0;
    for (const cell of lc) {
      for (const sig of SIGNALS) {
        if (cell === sig || cell.includes(sig)) { matches++; break; }
      }
    }
    if (matches >= 3) return i;
  }
  return -1;
}

// Convert a 2D row array (starting AT the header row) into objects.
function arrayToObjects(rows2d, headerIdx) {
  const headers = rows2d[headerIdx].map(h => String(h || '').trim());
  const out = [];
  for (let i = headerIdx + 1; i < rows2d.length; i++) {
    const row = rows2d[i] || [];
    if (row.every(c => c === null || c === undefined || String(c).trim() === '')) continue;
    const obj = {};
    headers.forEach((h, j) => { if (h) obj[h] = row[j]; });
    out.push(obj);
  }
  return { headers: headers.filter(Boolean), rows: out };
}

// Infer the job title from the filename and any rows above the header.
function inferJobTitle(filename, rows2d, headerIdx) {
  const corpus = [
    filename || '',
    ...(rows2d.slice(0, headerIdx).map(r => (r || []).map(c => String(c || '')).join(' ')))
  ].join(' ').toLowerCase();
  const KEYWORDS = [
    { match: /inspect/, title: 'Inspector' },
    { match: /resident\s*engineer|^re\b|\bre\s+timecard/, title: 'Resident Engineer' },
    { match: /permit/, title: 'Permitting' },
    { match: /design/, title: 'Design' },
    { match: /survey/, title: 'Surveyor' },
    { match: /splic/, title: 'Splicer' },
    { match: /foreman/, title: 'Foreman' }
  ];
  for (const kw of KEYWORDS) {
    if (kw.match.test(corpus)) return kw.title;
  }
  return null;
}

// ─── Routes ────────────────────────────────────────────────────────────────

module.exports = function installHoursCsvRoutes(app, pool, mw) {
  const { requireAdmin, upload, auditTimeEntry } = mw;

  app.post('/api/hours/csv-validate', requireAdmin, upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const overrideYear = req.body.override_year ? parseInt(req.body.override_year, 10) : null;

    try {
      const ext = path.extname(req.file.originalname).toLowerCase();
      let rows2d = [];

      if (ext === '.xlsx' || ext === '.xls') {
        const wb = XLSX.readFile(req.file.path);
        const sheet = wb.Sheets[wb.SheetNames[0]];
        rows2d = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '', raw: false, dateNF: 'yyyy-mm-dd', blankrows: false });
      } else if (ext === '.csv' || ext === '.tsv') {
        const content = fs.readFileSync(req.file.path, 'utf8');
        const wb = XLSX.read(content, { type: 'string' });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        rows2d = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '', raw: false, dateNF: 'yyyy-mm-dd', blankrows: false });
      } else {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: 'Unsupported file type. Use .csv, .xlsx, or .xls.' });
      }

      fs.unlinkSync(req.file.path);

      const headerIdx = findHeaderRow(rows2d);
      if (headerIdx < 0) {
        return res.status(400).json({
          error: 'Could not find a header row in the first 20 rows of the file. Expected columns include name/employee/inspector, date, hours, work order.',
          first_rows: rows2d.slice(0, 8)
        });
      }

      const { headers, rows } = arrayToObjects(rows2d, headerIdx);
      const cols = detectColumns(headers);

      const missing = [];
      if (!cols.name) missing.push('name/employee/inspector');
      if (!cols.date) missing.push('date');
      if (!cols.wo) missing.push('work_order');
      if (!cols.hours) missing.push('hours');
      if (missing.length) {
        return res.status(400).json({
          error: 'Missing required columns: ' + missing.join(', '),
          headers,
          detected_columns: cols
        });
      }

      const inferredJobTitle = inferJobTitle(req.file.originalname, rows2d, headerIdx);

      const [staffR, projR, pricingR] = await Promise.all([
        pool.query('SELECT id, name FROM staff'),
        // Owner-flagged 2026-05-06: WO# is often set ONLY on the parent
        // rollup (e.g. "Cummings (16299)"), not on the leaf
        // ("Inspection" / "Resident Engineer") under it. The old query
        // only pulled projects with a direct work_order_number, so when
        // a CSV row had WO=16299, pickProject matched the rollup and
        // hours piled on the rollup instead of the matching leaf.
        //
        // Recursive CTE: anchor on every project that has a WO#
        // (current behavior), then DESCEND to children, propagating the
        // effective_wo down so each leaf inherits its ancestor's WO#.
        // pickProject can then match leaves directly via the inherited
        // WO# and pick the one whose job matches the billing-code
        // lookup. Depth cap of 10 keeps this safe against malformed
        // parent_id chains.
        pool.query(`
          WITH RECURSIVE wo_tree AS (
            -- Anchor: every project with a real work_order_number.
            SELECT p.id, p.name, p.work_order_number, p.work_order_number AS effective_wo,
                   p.job_id, p.parent_id, p.is_rollup,
                   EXISTS (SELECT 1 FROM projects c WHERE c.parent_id = p.id) AS has_children,
                   0 AS depth
              FROM projects p
             WHERE p.work_order_number IS NOT NULL AND p.work_order_number != ''
            UNION ALL
            -- Descend: each child inherits the ancestor's effective_wo.
            SELECT p.id, p.name, p.work_order_number, w.effective_wo,
                   p.job_id, p.parent_id, p.is_rollup,
                   EXISTS (SELECT 1 FROM projects c WHERE c.parent_id = p.id) AS has_children,
                   w.depth + 1
              FROM projects p
              JOIN wo_tree w ON p.parent_id = w.id
             WHERE w.depth < 10
          )
          SELECT DISTINCT ON (w.id)
                 w.id, w.name, w.work_order_number, w.effective_wo,
                 w.job_id, w.parent_id, w.is_rollup, w.has_children,
                 w.depth, j.name AS job_name
            FROM wo_tree w
            LEFT JOIN jobs j ON j.id = w.job_id
            -- Skip rollups when there's a matching leaf descendant — see
            -- pickProject below; we still need rollups indexed for the
            -- "no leaves anywhere under this WO" fallback though, so we
            -- KEEP them in the result and let pickProject prefer leaves.
           ORDER BY w.id, w.depth ASC
        `),
        pool.query(`
          SELECT pe.billing_code, j.name as job_name
          FROM pricing_entries pe
          LEFT JOIN jobs j ON j.id = pe.job_id
          WHERE pe.billing_code IS NOT NULL AND pe.billing_code != ''
        `)
      ]);
      const staffByNorm = {};
      staffR.rows.forEach(s => { staffByNorm[normalizeName(s.name)] = s; });

      // Index by EFFECTIVE WO# (own or inherited from any ancestor) so
      // a CSV row tagged WO=16299 finds the leaves under the 16299
      // rollup, not just the rollup itself.
      const projsByNorm = {};
      projR.rows.forEach(p => {
        const k = normalizeWO(p.effective_wo);
        if (!k) return;
        (projsByNorm[k] = projsByNorm[k] || []).push(p);
      });

      const jobByCode = {};
      pricingR.rows.forEach(pe => {
        if (pe.billing_code && pe.job_name) {
          jobByCode[String(pe.billing_code).trim().toLowerCase()] = pe.job_name;
        }
      });

      // Pick the most specific project for a (WO, job) pair.
      // Order of preference:
      //   1. A real LEAF (is_rollup=FALSE, has_children=FALSE) whose
      //      job_name matches the billing-code-derived job. This is the
      //      common path for AI-built RUS trees: "Cummings 16299
      //      Inspection" beats "Cummings 16299 rollup".
      //   2. Any leaf at all (when the job name doesn't match — better
      //      than dropping hours on a folder).
      //   3. Any non-rollup row that matches the job name (defensive
      //      against legacy data without is_rollup flag).
      //   4. The first candidate whatever it is (legacy fallback so
      //      we never silently drop hours).
      function pickProject(woNorm, billingCodeJobName) {
        const candidates = projsByNorm[woNorm];
        if (!candidates || !candidates.length) return null;
        const wantLc = billingCodeJobName ? billingCodeJobName.toLowerCase() : null;
        const isRealLeaf = (c) => !c.has_children && !c.is_rollup;

        if (wantLc) {
          // 1. Real leaf with matching job
          const leafJobMatch = candidates.find(c => isRealLeaf(c)
            && c.job_name && c.job_name.toLowerCase() === wantLc);
          if (leafJobMatch) return leafJobMatch;
          // 3. Any non-rollup matching job
          const anyJobMatch = candidates.find(c => !c.is_rollup
            && c.job_name && c.job_name.toLowerCase() === wantLc);
          if (anyJobMatch) return anyJobMatch;
        }
        // 2. Any real leaf (no job constraint)
        const realLeaves = candidates.filter(isRealLeaf);
        if (realLeaves.length) return realLeaves[0];
        // 4. Last resort — first candidate (probably a rollup)
        return candidates[0];
      }

      const today = new Date(); today.setHours(0,0,0,0);
      const past18 = new Date(today); past18.setMonth(past18.getMonth() - 18);

      const validRows = [];
      const unknownStaff = new Map();
      const unknownWOs = new Map();
      const invalidRows = [];

      rows.forEach((r, i) => {
        const rowNum = headerIdx + 2 + i;
        const rawName = r[cols.name];
        const rawDate = r[cols.date];
        const rawWO = r[cols.wo];
        const rawHrs = r[cols.hours];
        const rawTitle = cols.job_title ? r[cols.job_title] : null;
        const rawWeekEnding = cols.week_ending ? r[cols.week_ending] : null;
        const rawCustomer = cols.customer ? r[cols.customer] : null;

        const allBlank = !String(rawName ?? '').trim()
          && !String(rawWO ?? '').trim()
          && !String(rawHrs ?? '').trim();
        if (allBlank) return;

        let anchorYear = null, anchorDate = null;
        if (rawWeekEnding) {
          const we = parseDateCell(rawWeekEnding);
          if (we) { anchorYear = parseInt(we.split('-')[0], 10); anchorDate = we; }
        }

        const { unbilled, category: unbilledCategory } = classifyUnbilled(rawCustomer);

        const issues = [];
        const name = (rawName || '').toString().trim();
        const date = parseDateCell(rawDate, anchorYear, anchorDate, overrideYear);
        const woNorm = normalizeWO(rawWO);
        const hrs = parseFloat(rawHrs);

        if (!name) issues.push('missing name');
        if (!date) issues.push('invalid or missing date');
        else {
          const d = new Date(date + 'T00:00:00');
          if (d > today) issues.push('date is in the future');
          else if (d < past18) issues.push('date is more than 18 months ago');
        }
        // Unbilled rows are allowed to have no WO# — they're overhead
        // hours that don't map to a real project.
        if (!woNorm && !unbilled) issues.push('missing work order');
        if (isNaN(hrs) || hrs <= 0) issues.push('invalid hours');
        if (hrs > 24) issues.push('hours > 24 in a single entry');

        if (issues.length) {
          invalidRows.push({ row_num: rowNum, raw: { name: rawName, date: rawDate, wo: rawWO, hours: rawHrs, customer: rawCustomer }, issues });
          return;
        }

        const staff = staffByNorm[normalizeName(name)];
        const staffKnown = !!staff;

        const rawCode = cols.billing_code ? String(r[cols.billing_code] ?? '').trim() : null;
        const codeLookup = rawCode ? jobByCode[rawCode.toLowerCase()] : null;
        const rowTitle = rawTitle ? String(rawTitle).trim() : null;
        const finalTitle = codeLookup || rowTitle || inferredJobTitle || null;
        const jobSource = codeLookup ? 'billing_code' : (rowTitle ? 'column' : (inferredJobTitle ? 'filename' : null));
        const jobMissing = !finalTitle;

        // Unbilled rows skip project matching entirely — they live with
        // project_id=NULL and is_billable=FALSE. wo_known stays TRUE for
        // unbilled rows so the commit step doesn't bucket them into the
        // "skipped_unknown_wo" tally; they're intentionally project-less,
        // not unmatched.
        const proj = unbilled ? null : pickProject(woNorm, codeLookup);
        const woKnown = unbilled ? true : !!proj;

        if (!staffKnown) unknownStaff.set(normalizeName(name), name);
        if (!unbilled && !proj) unknownWOs.set(woNorm, String(rawWO).trim());

        validRows.push({
          row_num: rowNum,
          name, name_norm: normalizeName(name),
          wo: String(rawWO ?? '').trim(), wo_norm: woNorm,
          customer: rawCustomer ? String(rawCustomer).trim() : null,
          date, hours: hrs,
          job_title: finalTitle,
          job_source: jobSource,
          billing_code: rawCode || null,
          job_missing: jobMissing,
          staff_id: staff?.id || null,
          project_id: proj?.id || null,
          project_name: proj?.name || null,
          project_job_name: proj?.job_name || null,
          staff_known: staffKnown,
          wo_known: woKnown,
          is_billable: !unbilled,
          unbilled_category: unbilledCategory
        });
      });

      const stage_id = uuidv4();
      // Already-billed-month conflict detection.
      const periodKeys = new Set();
      for (const r of validRows) {
        if (r.project_id && r.date) {
          const [y, mo] = r.date.split('-');
          periodKeys.add(`${r.project_id}|${parseInt(y)}|${parseInt(mo)}`);
        }
      }
      const billedPeriods = new Set();
      if (periodKeys.size > 0) {
        const projectIdsInRows = [...new Set(validRows.filter(r => r.project_id).map(r => r.project_id))];
        if (projectIdsInRows.length > 0) {
          const billedR = await pool.query(`
            SELECT DISTINCT ii.project_id,
                   EXTRACT(YEAR FROM inv.invoice_date)::int AS y,
                   EXTRACT(MONTH FROM inv.invoice_date)::int AS mo
            FROM invoice_items ii
            JOIN invoices inv ON inv.id = ii.invoice_id
            WHERE ii.project_id = ANY($1::uuid[])
          `, [projectIdsInRows]);
          billedR.rows.forEach(b => {
            billedPeriods.add(`${b.project_id}|${b.y}|${b.mo}`);
          });
        }
      }
      let billedConflictCount = 0;
      for (const r of validRows) {
        r.already_billed_period = false;
        if (r.project_id && r.date) {
          const [y, mo] = r.date.split('-').map(Number);
          if (billedPeriods.has(`${r.project_id}|${y}|${mo}`)) {
            r.already_billed_period = true;
            billedConflictCount++;
          }
        }
      }

      // Would-modify preview. Match key = staff + project + entry_date +
      // job_title (normalized). Two rows logged on the same date by the
      // same person against the same project but DIFFERENT jobs are
      // distinct entries — this matches the per-day, per-job ledger the
      // operator actually keeps. Duplicate vs modify within a single
      // (staff, project, date, job) bucket comes down to hours.
      //
      // Unbilled rows (project_id IS NULL, is_billable=FALSE) carry their
      // OWN match key with `UNB:<category>` standing in for project_id,
      // so re-importing the same week's CSV doesn't pile dup
      // Miscellaneous / Permitting rows on top of the previous pass.
      function jobKey(j) {
        return String(j || '').trim().replace(/\s+/g, ' ').toLowerCase();
      }
      const matchKeys = [];           // billed rows (project_id present)
      const unbilledMatchKeys = [];   // unbilled rows (project_id NULL)
      for (const r of validRows) {
        if (!r.staff_id || !r.date) {
          r.csv_classification = 'new';
          continue;
        }
        if (r.is_billable === false) {
          // Unbilled row: dedup against existing unbilled rows for the
          // same (staff, date, category, job).
          const cat = r.unbilled_category || 'misc';
          unbilledMatchKeys.push({ staff_id: r.staff_id, entry_date: r.date });
          r.match_key = `${r.staff_id}|UNB:${cat}|${r.date}|${jobKey(r.job_title)}`;
        } else if (r.project_id) {
          matchKeys.push({ staff_id: r.staff_id, project_id: r.project_id, entry_date: r.date });
          r.match_key = `${r.staff_id}|${r.project_id}|${r.date}|${jobKey(r.job_title)}`;
        } else {
          // Billed row that didn't resolve a project — leave as 'new';
          // commit will skip via skipped_unknown_wo.
          r.csv_classification = 'new';
        }
      }
      const byKey = new Map();
      if (matchKeys.length) {
        const staffArr = matchKeys.map(k => k.staff_id);
        const projArr = matchKeys.map(k => k.project_id);
        const dateArr = matchKeys.map(k => k.entry_date);
        // Pre-fetch every row matching any (staff, project, date) triple,
        // then bucket by the four-part key including job. Keeping the
        // SQL filter at the triple is cheaper than `WHERE … OR … OR …`
        // per-row and lets us compute counts client-side.
        const { rows: existing } = await pool.query(`
          SELECT id, staff_id, project_id, entry_date::text AS entry_date,
                 hours::float AS hours, job_title
            FROM time_entries
           WHERE staff_id = ANY($1::uuid[])
             AND project_id = ANY($2::uuid[])
             AND entry_date = ANY($3::date[])
        `, [staffArr, projArr, dateArr]);
        for (const e of existing) {
          const k = `${e.staff_id}|${e.project_id}|${e.entry_date}|${jobKey(e.job_title)}`;
          if (!byKey.has(k)) byKey.set(k, []);
          byKey.get(k).push(e);
        }
      }
      if (unbilledMatchKeys.length) {
        // Separate query — the billed-row lookup uses `project_id = ANY(...)`
        // which can't tolerate NULL. Look up the unbilled siblings of every
        // CSV row at (staff, date) and bucket them by `UNB:<category>` so
        // the four-part match key matches the validate-side keys above.
        const sArr = unbilledMatchKeys.map(k => k.staff_id);
        const dArr = unbilledMatchKeys.map(k => k.entry_date);
        const { rows: existing } = await pool.query(`
          SELECT id, staff_id, entry_date::text AS entry_date,
                 hours::float AS hours, job_title, unbilled_category
            FROM time_entries
           WHERE staff_id = ANY($1::uuid[])
             AND entry_date = ANY($2::date[])
             AND project_id IS NULL
             AND is_billable = FALSE
        `, [sArr, dArr]);
        for (const e of existing) {
          const cat = e.unbilled_category || 'misc';
          const k = `${e.staff_id}|UNB:${cat}|${e.entry_date}|${jobKey(e.job_title)}`;
          if (!byKey.has(k)) byKey.set(k, []);
          byKey.get(k).push(e);
        }
      }
      if (byKey.size > 0) {
        for (const r of validRows) {
          if (r.csv_classification === 'new' || !r.match_key) continue;
          const matches = byKey.get(r.match_key) || [];
          if (matches.length === 0) {
            r.csv_classification = 'new';
          } else if (matches.length > 1) {
            r.csv_classification = 'conflict';
            r.csv_existing_count = matches.length;
          } else {
            const m = matches[0];
            const sameHours = Math.abs((parseFloat(r.hours) || 0) - (parseFloat(m.hours) || 0)) < 1e-6;
            if (sameHours) {
              r.csv_classification = 'duplicate';
              r.csv_existing_id = m.id;
            } else {
              r.csv_classification = 'modify';
              r.csv_existing_id = m.id;
              r.csv_existing_hours = m.hours;
              r.csv_existing_job_title = m.job_title || '';
            }
          }
        }
      }
      const csvClassTally = { new: 0, duplicate: 0, modify: 0, conflict: 0 };
      for (const r of validRows) {
        const c = r.csv_classification || 'new';
        csvClassTally[c] = (csvClassTally[c] || 0) + 1;
      }

      csvStage.set(stage_id, {
        validRows,
        expiresAt: Date.now() + CSV_STAGE_TTL_MS
      });

      res.json({
        stage_id,
        headers,
        detected_columns: cols,
        inferred_job_title: inferredJobTitle,
        job_title_source: cols.job_title ? 'column' : (inferredJobTitle ? 'filename' : 'none'),
        rows_missing_job_title: validRows.filter(r => r.job_missing).length,
        summary: {
          total_rows: validRows.length + invalidRows.length,
          ready_to_import: validRows.filter(r => r.staff_known && r.wo_known).length,
          rows_with_unknown_staff: validRows.filter(r => !r.staff_known).length,
          rows_with_unknown_wo: validRows.filter(r => !r.wo_known).length,
          rows_in_billed_periods: billedConflictCount,
          unbilled_rows: validRows.filter(r => !r.is_billable).length,
          invalid: invalidRows.length,
          would_add: csvClassTally.new || 0,
          would_skip_duplicate: csvClassTally.duplicate || 0,
          would_modify: csvClassTally.modify || 0,
          would_conflict: csvClassTally.conflict || 0,
        },
        unknown_staff: [...unknownStaff.values()].map(name => ({
          name,
          similar: staffR.rows
            .filter(s => {
              const a = normalizeName(s.name), b = normalizeName(name);
              return a !== b && (a.includes(b.split(' ')[0]) || b.includes(a.split(' ')[0]));
            })
            .map(s => ({ id: s.id, name: s.name }))
            .slice(0, 3)
        })),
        unknown_wos: [...unknownWOs.values()],
        invalid_rows: invalidRows.slice(0, 50),
        valid_rows: validRows.slice(0, 500),
        valid_rows_total: validRows.length
      });
    } catch (e) {
      console.error('CSV validate error:', e);
      if (req.file?.path && fs.existsSync(req.file.path)) {
        try { fs.unlinkSync(req.file.path); } catch {}
      }
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/hours/csv-edit-row', requireAdmin, async (req, res) => {
    const { stage_id, row_num, patch } = req.body;
    if (!stage_id || !row_num || !patch) return res.status(400).json({ error: 'stage_id, row_num, patch required' });
    const staged = csvStage.get(stage_id);
    if (!staged) return res.status(400).json({ error: 'Staged data expired. Re-validate the file.' });

    const row = staged.validRows.find(r => r.row_num === row_num);
    if (!row) return res.status(404).json({ error: 'Row not found in staged data' });

    try {
      if ('project_id' in patch) {
        if (patch.project_id) {
          const r = await pool.query('SELECT id, name FROM projects WHERE id=$1', [patch.project_id]);
          if (!r.rows[0]) return res.status(400).json({ error: 'Project not found' });
          row.project_id = r.rows[0].id;
          row.project_name = r.rows[0].name;
          row.wo_known = true;
        } else {
          row.project_id = null;
          row.wo_known = false;
        }
      }
      if ('staff_id' in patch) {
        if (patch.staff_id) {
          const r = await pool.query('SELECT id, name FROM staff WHERE id=$1', [patch.staff_id]);
          if (!r.rows[0]) return res.status(400).json({ error: 'Staff not found' });
          row.staff_id = r.rows[0].id;
          row.staff_known = true;
        } else {
          row.staff_id = null;
          row.staff_known = false;
        }
      }
      if ('job_title' in patch) {
        row.job_title = patch.job_title ? String(patch.job_title).trim() : null;
        row.job_source = 'manual';
        row.job_missing = !row.job_title;
      }
      if ('hours' in patch) {
        const h = parseFloat(patch.hours);
        if (isNaN(h) || h <= 0) return res.status(400).json({ error: 'Hours must be a positive number' });
        row.hours = h;
      }

      res.json({ ok: true, row });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/hours/csv-commit', requireAdmin, async (req, res) => {
    const {
      stage_id,
      create_staff = [],
      map_staff = {},
      skip_unknown_wos = true,
      apply_job_title = null,
      skip_billed_period_rows = false,
      create_projects = [],
      create_jobs = [],
      default_client_id = null,
    } = req.body;
    if (!stage_id) return res.status(400).json({ error: 'Missing stage_id' });
    const staged = csvStage.get(stage_id);
    if (!staged) return res.status(400).json({ error: 'Staged data expired or not found. Re-validate the file.' });

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const existingStaff = await client.query('SELECT id, name FROM staff');
      const staffByNorm = {};
      existingStaff.rows.forEach(s => { staffByNorm[normalizeName(s.name)] = s.id; });

      const createdStaff = [];
      for (const rawName of create_staff) {
        const name = String(rawName).trim();
        const norm = normalizeName(name);
        if (!name || staffByNorm[norm]) continue;
        const { rows } = await client.query(
          'INSERT INTO staff (name, active) VALUES ($1, true) ON CONFLICT (name) DO UPDATE SET active=true RETURNING id, name',
          [name]
        );
        staffByNorm[norm] = rows[0].id;
        createdStaff.push(rows[0]);
      }
      for (const [norm, staffId] of Object.entries(map_staff)) {
        staffByNorm[norm] = staffId;
      }

      const createdJobs = [];
      const newJobsByName = {};
      for (const jdef of create_jobs) {
        const jname = String(jdef.name || '').trim();
        if (!jname) continue;
        const exists = await client.query('SELECT id FROM jobs WHERE LOWER(name) = LOWER($1) LIMIT 1', [jname]);
        if (exists.rows.length) {
          newJobsByName[jname.toLowerCase()] = exists.rows[0].id;
          continue;
        }
        const r = await client.query(
          `INSERT INTO jobs (name, default_billing_type, default_rate, team, active)
           VALUES ($1, $2, $3, $4, TRUE) RETURNING id, name`,
          [jname, jdef.billing_type || 'hourly', jdef.rate || null, jdef.team || null]
        );
        newJobsByName[jname.toLowerCase()] = r.rows[0].id;
        createdJobs.push(r.rows[0]);
      }

      const createdProjects = [];
      const newProjectsByWO = {};
      // Pre-load concentrators (the RUS service-area registry) so when we
      // create a new project for a WO we can derive its contract +
      // service-area linkage. Without this the new project lands with
      // contract_id=NULL, and the RUS tab's `WHERE ec.program='rus'`
      // filter silently excludes it. Owner-flagged 2026-05-06.
      const { rows: concRows } = await client.query(
        `SELECT id, contract_label, area_name, work_order_number FROM concentrators WHERE active = TRUE`
      );
      const concByWo = new Map();
      for (const c of concRows) {
        if (c.work_order_number) concByWo.set(String(c.work_order_number).trim(), c);
      }
      // Pre-load contracts so we can resolve contract_id from the
      // concentrator's contract_label. Match either friendly_label OR
      // contract_number startsWith (the legacy "Contract 3 / 515-3"
      // format the rest of the system already tolerates).
      const { rows: ctrRows } = await client.query(
        `SELECT id, friendly_label, contract_number FROM contracts`
      );
      function resolveContractIdForLabel(label) {
        if (!label) return null;
        const exact = ctrRows.find(c => c.friendly_label === label);
        if (exact) return exact.id;
        const startsWith = ctrRows.find(c => c.contract_number && c.contract_number.startsWith(label));
        return startsWith ? startsWith.id : null;
      }
      // Heuristic: if the job assigned to a CSV-created project is one
      // of the canonical RUS jobs, mirror that into project_type so the
      // dashboard / hours-by-type bucket / inspection tab default
      // surface it correctly. Avoids the "everything is Other" bug
      // owner reported. Job lookup uses the freshly-created jobs map
      // first, then the ALREADY-pre-loaded jobByCode mapping.
      function jobNameForJobId(jobId) {
        if (!jobId) return null;
        // newJobsByName is indexed by lowercased name → id; reverse-find.
        for (const [name, id] of Object.entries(newJobsByName)) {
          if (id === jobId) return name;
        }
        return null;
      }
      function projectTypeForJob(jobName) {
        if (!jobName) return 'other';
        const lc = jobName.toLowerCase();
        if (lc === 'inspection' || lc.includes('inspect')) return 'inspection';
        if (lc === 'resident engineer' || lc === 're') return 're';
        if (lc.includes('permit')) return 'permitting';
        if (lc.includes('design')) return 'design';
        return 'other';
      }
      for (const pdef of create_projects) {
        const woRaw = String(pdef.wo || '').trim();
        const woNorm = normalizeWO(woRaw);
        if (!woNorm) continue;
        const projName = String(pdef.name || `Project ${woRaw}`).trim();
        const clientId = pdef.client_id || default_client_id;
        if (!clientId) continue;
        let jobId = pdef.job_id || null;
        if (!jobId && pdef.job_name) {
          jobId = newJobsByName[pdef.job_name.toLowerCase()] || null;
        }

        // Concentrator + contract derivation. WO match → concentrator
        // → contract_label → contract_id. Falls through to NULL when
        // unmatched (non-PSC clients, ad-hoc WOs).
        const conc = concByWo.get(woRaw) || concByWo.get(woNorm);
        const concentratorId = conc ? conc.id : null;
        const inferredContractId = pdef.contract_id
          || (conc ? resolveContractIdForLabel(conc.contract_label) : null);

        // project_type inferred from the job. AI/admin-supplied value
        // wins; fall back to job-name-based heuristic so the row
        // surfaces correctly in the Hours-by-Type tile + dashboard.
        const inferredJobName = pdef.job_name || jobNameForJobId(jobId);
        const inferredProjectType = pdef.project_type || projectTypeForJob(inferredJobName);

        let parentId = null;
        try {
          if (typeof app.locals.ensureRollupChain === 'function') {
            parentId = await app.locals.ensureRollupChain({
              client_id: clientId,
              concentrator_id: concentratorId,
              service_area_label: pdef.area_label || (conc ? conc.area_name : null),
              job_id: jobId
            });
          }
        } catch(e) { /* ignore — project still creates without rollup */ }

        const r = await client.query(
          `INSERT INTO projects (
             name, client_id, work_order_number, job_id, contract_id,
             concentrator_id, parent_id, status, project_type,
             billing_type, billing_rate
           ) VALUES ($1,$2,$3,$4,$5,$6,$7,'active',$8,$9,$10)
           RETURNING id, name, work_order_number, contract_id, concentrator_id, project_type`,
          [projName, clientId, woRaw, jobId, inferredContractId, concentratorId, parentId,
           inferredProjectType,
           pdef.billing_type || 'hourly',
           pdef.billing_rate || null]
        );
        newProjectsByWO[woNorm] = r.rows[0].id;
        createdProjects.push(r.rows[0]);
      }

      for (const r of staged.validRows) {
        if (!r.wo_known && newProjectsByWO[r.wo_norm]) {
          r.project_id = newProjectsByWO[r.wo_norm];
          r.wo_known = true;
        }
        if (r.job_title && newJobsByName[r.job_title.toLowerCase()]) {
          // Just confirms the job now exists; job_title text remains as-is.
        }
      }

      const importBatch = `csv_import_${Date.now()}`;
      let inserted = 0;
      let skipped_unknown_wo = 0;
      let skipped_unresolved_staff = 0;
      let skipped_billed_period = 0;
      let skipped_duplicate = 0;
      const projectIds = new Set();
      const insertedRows = [];
      const skipDuplicates = req.body?.skip_duplicates !== false;

      for (const r of staged.validRows) {
        // Unbilled rows are allowed to commit without a project (they're
        // overhead, not pinned to a customer). r.wo_known is set to TRUE
        // on the validate side for unbilled rows so this guard only fires
        // for real WO matches that failed.
        if (!r.is_billable) {
          // Defensive: if a billed row somehow ends up flagged unbilled
          // here, it would commit with project_id=NULL. Only allow that
          // when the validate side actually classified it.
        } else if (!r.wo_known) { skipped_unknown_wo++; continue; }
        const staffId = r.staff_id || staffByNorm[r.name_norm] || null;
        if (!staffId) { skipped_unresolved_staff++; continue; }
        if (skip_billed_period_rows && r.already_billed_period) { skipped_billed_period++; continue; }
        if (skipDuplicates && r.csv_classification === 'duplicate') {
          skipped_duplicate++;
          continue;
        }

        // The validate stage already resolved a job for each row from
        // (in priority order) billing_code lookup -> CSV column ->
        // filename heuristic, and the user confirmed it in the
        // row-by-row ledger. r.job_title is that confirmed value —
        // preserve it. Only fall back to the project's assigned
        // job_name when the row itself carried no job (rare; e.g. a
        // CSV with no billing_code, no title column, and an unhelpful
        // filename). Then apply_job_title is the last-resort blanket.
        //
        // Earlier this preferred r.project_job_name first, which broke
        // the "matched project has the wrong job_id" case — a leaf
        // mis-tagged with the Other job would clobber a correctly
        // identified Inspection from the billing-code lookup.
        // (Owner-flagged 2026-05-06.)
        const finalJobTitle = r.job_title || r.project_job_name || apply_job_title || null;

        // Snap to 0.25 grid — owner rule that hours always live on
        // quarter-hour increments. Applied at INSERT time so a CSV row
        // with 8.3 lands as 8.25 on disk regardless of the source
        // spreadsheet's precision.
        const snappedHours = snapHoursToQuarter(r.hours);

        const { rows: insRows } = await client.query(
          `INSERT INTO time_entries (project_id, staff_id, entry_date, hours, job_title, import_batch, is_billable, unbilled_category)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
          [r.project_id, staffId, r.date, snappedHours, finalJobTitle, importBatch,
           r.is_billable !== false, r.unbilled_category || null]
        );
        if (insRows[0]) insertedRows.push(insRows[0]);
        inserted++;
        if (r.project_id) projectIds.add(r.project_id);
      }

      await client.query('COMMIT');
      csvStage.delete(stage_id);
      for (const pid of projectIds) {
        await updateProjectHours(pid);
      }

      // Audit each insert AFTER the commit so a logging hiccup never
      // rolls back valid time entries. Source = 'csv'.
      if (typeof auditTimeEntry === 'function') {
        for (const row of insertedRows) {
          try {
            await auditTimeEntry({
              req, timeEntryId: row.id, action: 'created',
              before: null, after: row,
              source: 'csv',
            });
          } catch (auditErr) {
            console.error('[csv-commit:audit]', auditErr && auditErr.message);
          }
        }
      }

      res.json({
        ok: true,
        batch: importBatch,
        inserted,
        skipped_unknown_wo,
        skipped_unresolved_staff,
        skipped_billed_period,
        skipped_duplicate,
        created_staff: createdStaff,
        created_jobs: createdJobs,
        created_projects: createdProjects,
        affected_projects: projectIds.size
      });
    } catch (e) {
      await client.query('ROLLBACK');
      console.error('CSV commit error:', e);
      res.status(500).json({ error: e.message });
    } finally {
      client.release();
    }
  });
};

// Pure helpers exported for unit testing + reuse from the AI tools
// module (csv_smart_import calls into the same parsing surface).
module.exports._helpers = {
  normalizeWO, normalizeName, detectColumns, MONTH_LOOKUP,
  parseDateCell, inferYear, findHeaderRow, arrayToObjects, inferJobTitle,
  classifyUnbilled,
};
