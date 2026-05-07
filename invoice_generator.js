// ═══════════════════════════════════════════════════════════════════════════
// invoice_generator.js — RUS-PROGRAM INVOICE GENERATOR
// ═══════════════════════════════════════════════════════════════════════════
//
//                              ★ READ THIS FIRST ★
//
// This module exclusively handles RUS-program work — invoices for
// engineering contracts whose `engineering_contracts.program = 'rus'`.
// It is gated to refuse non-RUS work because the format is RUS-specific
// and silently mis-formatting an invoice would be worse than failing.
//
// RUS work is materially more complicated than ordinary (BAU/GFR/Other)
// work. This file is dense for that reason. The complications, in order:
//
//   1. UMBRELLA STRUCTURE. Ordinary invoices are project → invoice. RUS
//      goes:  Engineering Contract (umbrella, e.g. "RUS 217 Engineering
//      Contract GA 1706 -A72") → multiple billing contracts (e.g. 515-3,
//      515-4, 515-5) → multiple service-area work orders → per-team work.
//      One invoice covers ONE engineering contract umbrella + ONE job
//      across all child contracts. Friendly contract labels ("Contract 3"
//      for 515-3) live on contracts.friendly_label.
//
//   2. LOAN NAME BANNER. RUS work is loan-financed by USDA. The loan
//      name (e.g. "Reconnect 3") prints as a top-level grouping label on
//      every page. Stored on engineering_contracts.loan_name. Other
//      programs leave it NULL.
//
//   3. TWO DELIVERABLE FORMATS, PICKED BY THE JOB:
//
//      a. HOURLY — Inspector, Resident Engineer, Records Management,
//         anything billed by hours × rate.
//         Summary page: Hours / Rate / Amount columns per WO, contract
//         subtotals, umbrella subtotal, grand total.
//         + DETAIL PAGES: one per employee, listing every time entry
//         (date, week-ending Sunday, WO, contract, hours). USDA wants
//         the audit trail; ordinary clients don't.
//
//      b. FOOTAGE — DOT/County/RR Permitting, OSP Staking (Aerial /
//         Underground), Update Plant Records, Construction Progress
//         Reports. Billed by miles × rate (with the special permitting
//         hours-per-mile randomization handled at project create).
//         Summary page only: Footage column auto-formatted as miles
//         (≥ 5280 ft → "X.XX mi" 2dp) or feet ("X,XXX ft" comma-grouped).
//         NO timecards pages.
//
//   4. RUS BILLING CODES. Each job has a specific RUS code (g-1-B-4 for
//      Inspection, g-1-B-1 for RE, a-2-D for Permitting, etc.) that
//      prints on the invoice. Lives on jobs.billing_code; pricing
//      defaults live on pricing_entries keyed on (job_id, program,
//      billing_code).
//
//   5. PERIOD HANDLING. Hourly invoices respect period_start/period_end
//      and only include time entries inside the window. Footage invoices
//      include any project under the contract+job — footage doesn't
//      accumulate over time the way hours do.
//
//   6. ZERO-ACTIVITY ROWS. Sub-contracts with no activity in the period
//      are dropped silently (keeps the PDF clean when 515-4 had nothing
//      this month but 515-3 and 515-5 did). WOs with zero hours/footage
//      are also dropped.
//
//   7. FAIL-LOUD GATING. The first thing buildInvoiceData() does after
//      loading the engineering contract is verify ec.program === 'rus'.
//      Any other value (or NULL) throws a clear error pointing at the
//      memory file `reference_invoice_non_rus_formats.md`. This was a
//      Path B safety net (2026-05-04): before the refactor, the gate
//      checked clients.is_rus, which mistakenly grouped PSC's BAU work
//      with its RUS work. PSC has both, so client-level gating produced
//      mis-formatted invoices for BAU contracts. Don't loosen this gate.
//
// PUBLIC SURFACE
// ──────────────
//   buildInvoiceData(pool, opts)  → assemble the data structure (testable
//                                   without PDF — useful for the API
//                                   preview endpoint and unit tests)
//   renderInvoicePdf(data, stream) → write the PDF into a writable stream
//
// The two are split deliberately so the data assembly can be unit-tested
// without spinning up pdfkit, and so an HTML-preview endpoint can reuse
// the same data.
//
// NON-RUS PROGRAMS
// ────────────────
// BAU, GFR, and Other engineering contracts each need their own template.
// Owner expects to provide samples for each later. When that happens,
// branch off this file rather than mutating it — see
// `reference_invoice_non_rus_formats.md` for the playbook.
// ═══════════════════════════════════════════════════════════════════════════

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// ─── Constants ─────────────────────────────────────────────────────────────
const COL = {
  // Header row — dark navy bg, white bold text. Matches the owner's Excel.
  HEADER_BG:   '#1F4E79',
  HEADER_TEXT: '#FFFFFF',
  // Loan + umbrella row — light blue/grey bg, dark text.
  LOAN_BG:     '#D9E1F2',
  LOAN_TEXT:   '#000000',
  // Per-contract section header — slightly lighter than loan row.
  CONTRACT_BG: '#F2F2F2',
  // Per-contract subtotal row.
  CONTRACT_SUBTOTAL_BG: '#E7E6E6',
  // Loan-wide subtotal — black bg, white bold text.
  LOAN_SUBTOTAL_BG:   '#000000',
  LOAN_SUBTOTAL_TEXT: '#FFFFFF',
  // Final summary row — blue bg, white bold text.
  SUMMARY_BG:   '#4472C4',
  SUMMARY_TEXT: '#FFFFFF',
  // Body rows
  BODY_TEXT:    '#000000',
  BORDER:       '#BFBFBF',
  TABLE_BORDER: '#1F4E79',
};
const FONT = {
  BODY:      'Helvetica',
  BODY_BOLD: 'Helvetica-Bold',
  ITALIC:    'Helvetica-Oblique',
};
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

// Path to the Launch Fiber Services logo. Loaded if present, gracefully
// skipped if missing — never throws on absent logo. Filename matches the
// asset committed under public/img/.
const LOGO_PATH = path.join(__dirname, 'public', 'img', 'launch-fiber-logo.png');

// ─── Number formatters ────────────────────────────────────────────────────
function fmtMoney(n) {
  const v = Number(n) || 0;
  return '$' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function fmtHours(n) {
  const v = Number(n) || 0;
  return v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
// Format footage per the owner's spec:
//   ≥ 1 mile (5280 ft) → "X.XX mi" with 2 decimals
//   < 1 mile           → "X,XXX ft" comma-separated
function fmtFootage(ft) {
  const v = Number(ft) || 0;
  if (v >= 5280) {
    const miles = v / 5280;
    return miles.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' mi';
  }
  return v.toLocaleString('en-US', { maximumFractionDigits: 0 }) + ' ft';
}
function monthYearLabel(periodStart) {
  // periodStart is a 'YYYY-MM-DD' string from Postgres
  const [y, m] = String(periodStart).split('-').map(Number);
  return `${MONTH_NAMES[m - 1] || ''} ${y}`;
}

// ─── Data assembly ────────────────────────────────────────────────────────
//
// opts: {
//   engineering_contract_id (required) — the umbrella we're billing
//   job_id                  (required) — Inspector, RE, DOT Permitting, etc.
//   period_start            (required) — 'YYYY-MM-DD'
//   period_end              (required) — 'YYYY-MM-DD'
//   contract_ids            (optional) — limit to these billing contracts
//                                        (array of UUIDs); default = all
// }
//
// Returns: { meta, contracts, totals } plus, for hourly jobs, a
// `timecards` array grouped by employee.
async function buildInvoiceData(pool, opts) {
  const { engineering_contract_id, job_id, period_start, period_end, contract_ids } = opts;
  if (!engineering_contract_id) throw new Error('engineering_contract_id required');
  if (!job_id) throw new Error('job_id required');
  if (!period_start || !period_end) throw new Error('period_start and period_end required');

  // 1. Engineering contract + client + loan info
  //
  // The engineering contract is the umbrella we're billing. We pull its
  // program here for the gate below — that's the source of truth for
  // "is this RUS work?" Path B (2026-05-04) replaced the old
  // clients.is_rus check, which incorrectly grouped PSC's BAU work
  // with its RUS work (PSC has both). See the file header for context.
  const ecRes = await pool.query(
    `SELECT ec.id, ec.name, ec.contract_number, ec.loan_name, ec.program,
            cl.id AS client_id, cl.name AS client_name
       FROM engineering_contracts ec
       JOIN clients cl ON cl.id = ec.client_id
       WHERE ec.id = $1`,
    [engineering_contract_id]
  );
  if (!ecRes.rows[0]) throw new Error('Engineering contract not found');
  const ec = ecRes.rows[0];

  // ─────────────── RUS-ONLY GATE ────────────────────────────────────────
  // This template is exclusive to RUS-program work because:
  //   • Format is matched to the USDA RUS reporting style (loan name
  //     banner, friendly contract labels, RUS billing codes, timecards
  //     audit trail for hourly).
  //   • BAU/GFR/Other clients use their own (yet-to-be-built) templates.
  // Failing loudly here is intentional — silently mis-formatting an
  // invoice would be worse than refusing.
  // To bill non-RUS work: change the EC's program to 'rus' (only if it
  // really is RUS work — usually a misclassification), or build a new
  // template module. See `reference_invoice_non_rus_formats.md`.
  if (ec.program !== 'rus') {
    const programLabel = ec.program ? `program "${ec.program}"` : 'no program set';
    throw new Error(`Cannot render RUS invoice: engineering contract "${ec.name}" (client "${ec.client_name}") has ${programLabel}, not 'rus'. This PDF template is exclusive to RUS-program work. To use it, set the engineering contract's Program to RUS in Settings → Engineering Contracts. Other programs need their own template (see memory: reference_invoice_non_rus_formats).`);
  }

  // 2. Job info — billing code, rate, hourly vs footage
  const jobRes = await pool.query(
    `SELECT id, name, default_billing_type, default_rate, billing_code, is_permitting
       FROM jobs WHERE id = $1`,
    [job_id]
  );
  if (!jobRes.rows[0]) throw new Error('Job not found');
  const job = jobRes.rows[0];
  const isFootage = (job.default_billing_type === 'footage') || job.is_permitting;
  const rate = Number(job.default_rate) || 0;

  // 3. Contracts under this engineering contract (optionally filtered)
  const params = [engineering_contract_id];
  let contractWhere = 'engineering_contract_id = $1';
  if (Array.isArray(contract_ids) && contract_ids.length) {
    contractWhere += ` AND id = ANY($2::uuid[])`;
    params.push(contract_ids);
  }
  const contractsRes = await pool.query(
    `SELECT id, contract_number, name, friendly_label
       FROM contracts WHERE ${contractWhere}
       ORDER BY contract_number`,
    params
  );
  if (!contractsRes.rows.length) {
    throw new Error('No contracts found under this engineering contract' +
      (contract_ids ? ' (with the specified filter)' : ''));
  }
  const contracts = contractsRes.rows;

  // 4. For each contract, gather the projects (= work orders) that have
  //    activity in the period for this job. Hourly: aggregate hours from
  //    time_entries. Footage: use project.footage from the projects table
  //    (footage doesn't accumulate over time the way hours do).
  const contractScopes = [];
  let grandHours = 0;
  let grandFootage = 0;
  let grandAmount = 0;

  for (const c of contracts) {
    // Owner-flagged 2026-05-06: AI-built trees often set contract_id on
    // a rollup container, leaving leaves with contract_id NULL. The old
    // direct-match query found zero leaves and the invoice rendered
    // empty (no WO#, no inspector name). Walk descendants of any
    // project under this contract so leaves whose ANCESTOR carries the
    // contract_id are included. Falls back to leaf's own work_order_number,
    // then any ancestor's WO# via COALESCE so the field never goes (no WO).
    const projRes = await pool.query(
      `WITH RECURSIVE tree AS (
         SELECT p.id, p.parent_id, p.work_order_number, p.name,
                p.footage::float AS footage,
                p.expected_revenue::float AS expected_revenue,
                p.job_id, p.contract_id, p.is_rollup, p.concentrator_id, 0 AS depth
           FROM projects p
          WHERE p.contract_id = $1
          UNION ALL
         SELECT p.id, p.parent_id, p.work_order_number, p.name,
                p.footage::float AS footage,
                p.expected_revenue::float AS expected_revenue,
                p.job_id, p.contract_id, p.is_rollup, p.concentrator_id, t.depth + 1
           FROM projects p
           JOIN tree t ON p.parent_id = t.id
          WHERE t.depth < 10
       ),
       wo_resolve AS (
         -- For each leaf, resolve a WO# from the leaf or any ancestor's
         -- work_order_number, OR from a concentrator on the leaf or
         -- ancestor. Walks up the parent chain; first non-null wins.
         SELECT t.id AS leaf_id,
                COALESCE(t.work_order_number,
                         (SELECT pa.work_order_number FROM projects pa
                            WHERE pa.id = t.parent_id AND pa.work_order_number IS NOT NULL),
                         (SELECT con.work_order_number FROM concentrators con
                            WHERE con.id = t.concentrator_id),
                         (SELECT con.work_order_number FROM projects pa
                            JOIN concentrators con ON con.id = pa.concentrator_id
                            WHERE pa.id = t.parent_id),
                         (SELECT con.work_order_number FROM projects pa
                            JOIN projects ga ON ga.id = pa.parent_id
                            JOIN concentrators con ON con.id = ga.concentrator_id
                            WHERE pa.id = t.parent_id)
                ) AS resolved_wo
           FROM tree t
       )
       SELECT DISTINCT ON (t.id)
              t.id, COALESCE(wr.resolved_wo, t.work_order_number) AS work_order_number,
              t.name, t.footage, t.expected_revenue
         FROM tree t
         LEFT JOIN wo_resolve wr ON wr.leaf_id = t.id
         WHERE t.job_id = $2 AND COALESCE(t.is_rollup, FALSE) = FALSE
         ORDER BY t.id, COALESCE(wr.resolved_wo, t.work_order_number) NULLS LAST, t.name`,
      [c.id, job_id]
    );
    const wos = [];
    let contractHours = 0, contractFootage = 0, contractAmount = 0;

    for (const p of projRes.rows) {
      let hours = 0, footage = 0, amount = 0;
      if (isFootage) {
        // Footage projects: take the project's footage and rate (or
        // expected_revenue if rate is zero). Period filter doesn't apply
        // to footage the way it does to hours; we include any project
        // under this contract+job.
        footage = p.footage || 0;
        amount = (p.expected_revenue && p.expected_revenue > 0)
          ? p.expected_revenue
          : (footage / 5280) * rate;
      } else {
        // Hourly: sum time_entries.hours within the period. Walks the
        // leaf's parent chain so entries that landed on a WO rollup
        // (CSV importer matched the rollup because the leaf had no
        // WO#) get attributed back to the matching leaf. Ancestor
        // entries only count when their job_title matches the leaf's
        // job — otherwise sibling jobs under the same WO would each
        // claim all the hours.
        const teRes = await pool.query(`
          WITH RECURSIVE leaf_ctx AS (
            SELECT p.id AS leaf_id, p.id AS cursor_id, p.parent_id,
                   LOWER(j.name) AS job_name_lc, 0 AS depth
              FROM projects p
              LEFT JOIN jobs j ON j.id = p.job_id
             WHERE p.id = $1
            UNION ALL
            SELECT lc.leaf_id, p.id, p.parent_id, lc.job_name_lc, lc.depth + 1
              FROM leaf_ctx lc
              JOIN projects p ON p.id = lc.parent_id
             WHERE lc.depth < 10
          )
          SELECT COALESCE(SUM(te.hours), 0)::float AS h
            FROM leaf_ctx lc
            JOIN time_entries te ON te.project_id = lc.cursor_id
           WHERE te.entry_date BETWEEN $2 AND $3
             AND (lc.cursor_id = lc.leaf_id
                  OR (lc.job_name_lc IS NOT NULL
                      AND LOWER(COALESCE(te.job_title, '')) = lc.job_name_lc))
        `, [p.id, period_start, period_end]);
        hours = teRes.rows[0].h;
        amount = hours * rate;
      }
      // Skip WOs with zero activity — they'd render as junk rows
      if ((isFootage ? footage : hours) <= 0) continue;
      wos.push({
        project_id: p.id,
        work_order_number: p.work_order_number || '(no WO)',
        project_name: p.name,
        hours, footage, amount,
      });
      contractHours += hours;
      contractFootage += footage;
      contractAmount += amount;
    }

    // Skip contracts with no activity — keeps the PDF clean when an
    // invoice is filed against an umbrella but a particular sub-contract
    // had nothing this period.
    if (!wos.length) continue;

    contractScopes.push({
      contract_id: c.id,
      contract_number: c.contract_number,
      friendly_label: c.friendly_label || c.contract_number,
      wos,
      contract_hours: contractHours,
      contract_footage: contractFootage,
      contract_amount: contractAmount,
    });
    grandHours += contractHours;
    grandFootage += contractFootage;
    grandAmount += contractAmount;
  }

  if (!contractScopes.length) {
    throw new Error('No work orders with activity in this period under the selected contracts.');
  }

  // 5. Hourly-only: gather timecards grouped by employee for the detail
  //    page. Joins through projects → time_entries → staff. Includes
  //    week_ending computed on the fly (Sunday-rounded).
  let timecards = [];
  if (!isFootage) {
    const projectIds = contractScopes.flatMap(cs => cs.wos.map(w => w.project_id));
    // Walk each leaf's ancestor chain so entries that landed on a WO
    // rollup get attributed to the matching leaf in the timecard
    // section. Same recursive CTE pattern as the totals query above.
    // Joins through the LEAF (not the entry's project_id) for WO# +
    // contract context so the timecard rows show the right values
    // regardless of where the entry actually sits in the tree.
    const tcRes = await pool.query(`
      WITH RECURSIVE leaf_ctx AS (
        SELECT p.id AS leaf_id, p.id AS cursor_id, p.parent_id,
               LOWER(j.name) AS job_name_lc, 0 AS depth
          FROM projects p
          LEFT JOIN jobs j ON j.id = p.job_id
         WHERE p.id = ANY($1::uuid[])
        UNION ALL
        SELECT lc.leaf_id, p.id, p.parent_id, lc.job_name_lc, lc.depth + 1
          FROM leaf_ctx lc
          JOIN projects p ON p.id = lc.parent_id
         WHERE lc.depth < 10
      )
      SELECT te.entry_date::text AS date,
             te.hours::float AS hours,
             s.name AS staff_name,
             COALESCE(leaf.work_order_number,
                      (SELECT pa.work_order_number FROM projects pa
                         WHERE pa.id = leaf.parent_id AND pa.work_order_number IS NOT NULL),
                      (SELECT pa2.work_order_number FROM projects pa
                         JOIN projects pa2 ON pa2.id = pa.parent_id
                         WHERE pa.id = leaf.parent_id AND pa2.work_order_number IS NOT NULL),
                      (SELECT con.work_order_number FROM concentrators con
                         WHERE con.id = leaf.concentrator_id)
             ) AS wo,
             leaf_c.contract_number AS contract_number,
             leaf_c.friendly_label AS contract_friendly,
             (date_trunc('week', te.entry_date) + INTERVAL '6 days')::date::text AS week_ending
        FROM leaf_ctx lc
        JOIN time_entries te ON te.project_id = lc.cursor_id
        JOIN projects leaf ON leaf.id = lc.leaf_id
        LEFT JOIN contracts leaf_c ON leaf_c.id = leaf.contract_id
        LEFT JOIN staff s ON s.id = te.staff_id
       WHERE te.entry_date BETWEEN $2 AND $3
         AND (lc.cursor_id = lc.leaf_id
              OR (lc.job_name_lc IS NOT NULL
                  AND LOWER(COALESCE(te.job_title, '')) = lc.job_name_lc))
       ORDER BY s.name NULLS LAST, te.entry_date, leaf.work_order_number
    `, [projectIds, period_start, period_end]);
    // Group by staff name
    const byStaff = new Map();
    for (const r of tcRes.rows) {
      const name = r.staff_name || '(unassigned)';
      if (!byStaff.has(name)) byStaff.set(name, { staff_name: name, entries: [], total_hours: 0 });
      byStaff.get(name).entries.push({
        date: r.date,
        week_ending: r.week_ending,
        wo: r.wo || '(no WO)',
        hours: r.hours,
        contract_number: r.contract_number,
        contract_friendly: r.contract_friendly,
      });
      byStaff.get(name).total_hours += r.hours;
    }
    timecards = [...byStaff.values()];
  }

  return {
    meta: {
      job_name: job.name,
      job_billing_code: job.billing_code,
      job_billing_type: isFootage ? 'footage' : 'hourly',
      // Permitting jobs are footage-billed but the customer-facing rate is
      // $/hr (hours derived from miles via the documented calc). Renderer
      // uses this flag to pick the Hours+$/hr column layout instead of the
      // Footage+$/mi one.
      is_permitting: !!job.is_permitting,
      rate,
      period_start,
      period_end,
      month_year: monthYearLabel(period_start),
      engineering_contract: {
        id: ec.id,
        name: ec.name,
        contract_number: ec.contract_number,
        loan_name: ec.loan_name || null,
      },
      client_name: ec.client_name,
    },
    contracts: contractScopes,
    totals: {
      hours: grandHours,
      footage: grandFootage,
      amount: grandAmount,
    },
    timecards,
  };
}

// ─── PDF rendering ────────────────────────────────────────────────────────
//
// Renders the assembled RUS-program `data` into the given writable stream.
// Caller is responsible for setting Content-Type and finalizing the
// response after the PDF stream `end` event.
//
// This renderer assumes `data` came from buildInvoiceData(), which has
// already verified ec.program='rus'. It does NOT re-check the gate —
// don't call this directly with hand-crafted data unless you've matched
// the RUS format spec described in the file header.
function renderInvoicePdf(data, stream) {
  const isFootage = data.meta.job_billing_type === 'footage';
  // Owner-flagged 2026-05-06: "minimal margins" — drop from 50/40 to
  // 28/24 (~0.33"). Backgrounds in pdfkit are always rendered (no
  // print-background toggle exists; fills always paint), so the
  // "export with background colors on" clause is already satisfied.
  const doc = new PDFDocument({
    size: 'LETTER',
    margins: { top: 28, bottom: 28, left: 24, right: 24 },
    info: {
      Title: `${data.meta.job_name} Summary - ${data.meta.month_year}`,
      Author: 'Launch Fiber Services',
      Subject: 'RUS Invoice',
    },
  });
  doc.pipe(stream);

  renderSummaryPage(doc, data, isFootage);

  // Hourly variants get one or more timecard pages (one section per employee)
  if (!isFootage && data.timecards.length) {
    doc.addPage();
    renderTimecardsPages(doc, data);
  }

  doc.end();
}

function renderSummaryPage(doc, data, isFootage) {
  const m = data.meta;
  const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;

  // Permitting jobs render with Hours+$/hr columns and footage as a sub-info
  // line in the Description cell. Pure footage jobs (non-permitting) keep
  // the original Footage+$/mi layout.
  const isPermitting = !!m.is_permitting;

  // ── Logo (centered at top) ─────────────────────────────────────────
  // 180px wide, horizontally centered. Owner-flagged 2026-05-06 — wants
  // a smaller logo than the prior 260px so the summary table breathes.
  // Height now comes from the actual image dimensions (was estimated
  // at width/3.8, but the real Launch wordmark is closer to 2:1, so
  // the previous estimate left the title overlapping the logo).
  const startY = doc.y;
  const logoWidth = 180;
  const logoX = doc.page.margins.left + (pageWidth - logoWidth) / 2;
  let postLogoY = startY;
  if (fs.existsSync(LOGO_PATH)) {
    try {
      const img = doc.openImage(LOGO_PATH);
      const renderedHeight = logoWidth * (img.height / img.width);
      doc.image(LOGO_PATH, logoX, startY, { width: logoWidth });
      postLogoY = startY + renderedHeight + 16;
    } catch (e) { /* corrupt or unsupported image format — silently skip */ }
  }
  doc.y = postLogoY;

  // ── Title + month (centered, small — replaces the old metadata block) ──
  // "Permitting Summary" for any permitting job; "{Job Name} Summary" else.
  // Sized to read as section headers, not page titles — the logo IS the
  // page identity now.
  const titleText = isPermitting ? 'Permitting Summary' : `${m.job_name} Summary`;
  doc.font(FONT.BODY_BOLD).fontSize(16).fillColor('#000');
  doc.text(titleText, doc.page.margins.left, doc.y, { width: pageWidth, align: 'center' });
  doc.font(FONT.ITALIC).fontSize(11).fillColor('#444');
  doc.text(m.month_year, doc.page.margins.left, doc.y + 2, { width: pageWidth, align: 'center' });
  doc.moveDown(1);

  // ── Table ──────────────────────────────────────────────────────────
  // Three layouts share this renderer, picked by job team:
  //   - Permitting (is_permitting=true) — 6 cols including a dedicated
  //     Footage column. Hours derived from amount/rate; Rate is $/hr.
  //   - Pure footage non-permitting — 5 cols, Qty column shows Footage,
  //     Rate is $/mi (legacy non-PSC-RUS path).
  //   - Hourly (Inspection / Resident Engineer / etc.) — 5 cols with
  //     Hours column and $/hr Rate.
  const qtyLabel = isPermitting ? 'Hours' : (isFootage ? 'Footage' : 'Hours');
  const cols = isPermitting ? [
    { key: 'item',  label: 'Item',        width: 70,  align: 'left'  },
    { key: 'desc',  label: 'Description', width: 165, align: 'left'  },
    { key: 'foot',  label: 'Footage',     width: 75,  align: 'right' },
    { key: 'qty',   label: 'Hours',       width: 70,  align: 'right' },
    { key: 'rate',  label: 'Rate',        width: 70,  align: 'right' },
    { key: 'amt',   label: 'Amount',      width: 90,  align: 'right' },
  ] : [
    { key: 'item',  label: 'Item',        width: 95,  align: 'left'  },
    { key: 'desc',  label: 'Description', width: 235, align: 'left'  },
    { key: 'qty',   label: qtyLabel,      width: 75,  align: 'right' },
    { key: 'rate',  label: 'Rate',        width: 70,  align: 'right' },
    { key: 'amt',   label: 'Amount',      width: 90,  align: 'right' },
  ];
  const tableTotalWidth = cols.reduce((s, c) => s + c.width, 0);
  // Center the table horizontally on the page (instead of pinning to the
  // left margin). The table is wider than the margin-bounded area, so
  // pinning to margins.left used to leave it visibly off-center to the
  // right. Centering keeps it visually aligned with the page-centered
  // logo and title above.
  const tableX = (doc.page.width - tableTotalWidth) / 2;
  // Owner-flagged 2026-05-06: bump body text from 9pt → 11pt so it
  // almost reaches the row borders with a small gap. MIN_ROW_H rises
  // to 26 to give 11pt text proper breathing room. Cells are
  // vertically centered (equal gap above + below) — each cell
  // measures its own text height and offsets accordingly.
  const MIN_ROW_H = 26;
  const ROW_PAD_TOP = 5;
  const ROW_PAD_BOTTOM = 5;
  const BODY_FONT_SIZE = 11;

  // Helper to draw one row at the current y, advancing y by the actual
  // height the row took up.
  //
  // opts.spanAll = true  → render a SINGLE centered text spanning all
  //                        columns (used for the per-contract header
  //                        rows like "Contract 3/515-3" in the
  //                        reference invoice).
  function drawRow(cells, opts = {}) {
    const y = doc.y;
    const bg = opts.bg;
    const textColor = opts.textColor || COL.BODY_TEXT;
    const bold = !!opts.bold;
    const padLeft = 6, padRight = 6;
    const fontSize = opts.fontSize || BODY_FONT_SIZE;
    const spanAll = !!opts.spanAll;
    // opts.minHeight lets a caller (e.g. the subtotal row) ask for a
    // tighter row than the default MIN_ROW_H. The row still grows to
    // fit wrapped text — this just lowers the FLOOR.
    const minRowH = opts.minHeight != null ? opts.minHeight : MIN_ROW_H;

    doc.font(bold ? FONT.BODY_BOLD : FONT.BODY).fontSize(fontSize);

    // Measure phase. For spanAll we measure the single label; for
    // standard rows we measure the tallest cell. Per-cell heights are
    // reused below for vertical centering.
    const cellHeights = {};
    let rowH;
    if (spanAll) {
      const txt = cells.text != null ? String(cells.text) : '';
      const tw = tableTotalWidth - padLeft - padRight;
      const h = doc.heightOfString(txt, { width: tw, align: 'center' });
      cellHeights.__span = h;
      rowH = Math.max(minRowH, Math.ceil(h + ROW_PAD_TOP + ROW_PAD_BOTTOM));
    } else {
      let maxTextH = 0;
      for (const c of cols) {
        const cellText = cells[c.key] != null ? String(cells[c.key]) : '';
        const tw = c.width - padLeft - padRight;
        const h = doc.heightOfString(cellText, { width: tw, align: c.align });
        cellHeights[c.key] = h;
        if (h > maxTextH) maxTextH = h;
      }
      rowH = Math.max(minRowH, Math.ceil(maxTextH + ROW_PAD_TOP + ROW_PAD_BOTTOM));
    }

    if (bg) {
      doc.rect(tableX, y, tableTotalWidth, rowH).fill(bg);
    }
    doc.strokeColor(COL.BORDER).lineWidth(0.5);
    doc.rect(tableX, y, tableTotalWidth, rowH).stroke();
    doc.font(bold ? FONT.BODY_BOLD : FONT.BODY).fontSize(fontSize).fillColor(textColor);

    // Vertical center each cell within rowH so short text sits in the
    // middle of the row. PDFKit positions text at the TOP of the
    // line-height box, but the visible glyph caps sit ~20-25% below
    // that top because of ascender padding. The mathematical center
    // of the heightOfString box leaves the GLYPHS biased toward the
    // top of the row visually. Bias the offset down by ~25% of the
    // ascender allowance (font size × 0.22) so the visual middle of
    // the letters matches the geometric middle of the row.
    // Owner-flagged 2026-05-06: "text sits high".
    const ascenderBias = Math.round(fontSize * 0.22);
    function vOffsetFor(textH) {
      return Math.max(1, Math.floor((rowH - textH) / 2) + ascenderBias);
    }

    if (spanAll) {
      const txt = cells.text != null ? String(cells.text) : '';
      const yOff = vOffsetFor(cellHeights.__span);
      doc.text(txt, tableX + padLeft, y + yOff, {
        width: tableTotalWidth - padLeft - padRight,
        align: 'center',
      });
    } else {
      let cx = tableX;
      for (let i = 0; i < cols.length; i++) {
        const c = cols[i];
        const cellText = cells[c.key] != null ? String(cells[c.key]) : '';
        const tx = cx + padLeft;
        const tw = c.width - padLeft - padRight;
        const yOff = vOffsetFor(cellHeights[c.key]);
        doc.text(cellText, tx, y + yOff, { width: tw, align: c.align });
        cx += c.width;
      }
    }
    doc.y = y + rowH;
  }

  // Column header row
  const headerCells = Object.fromEntries(cols.map(c => [c.key, c.label]));
  drawRow(headerCells, { bg: COL.HEADER_BG, textColor: COL.HEADER_TEXT, bold: true });

  // Loan + umbrella row (top of table body)
  drawRow({
    item: m.engineering_contract.loan_name || '',
    desc: m.engineering_contract.name,
  }, { bg: COL.LOAN_BG, bold: true });

  // Per-contract sections.
  // Reference invoice ALWAYS shows a centered contract header + a
  // billing-code sub-header before the WO# rows, even for a single
  // contract. The single-contract codepath used to skip both, which is
  // why the generated PDF had "WO# rows floating with no per-contract
  // grouping. Owner-flagged 2026-05-06.
  for (const cs of data.contracts) {
    // Contract header row — full-width centered, gray bg.
    drawRow({ text: cs.friendly_label }, {
      bg: COL.CONTRACT_BG, bold: true, spanAll: true,
    });

    // Billing-code sub-header — bold code in the Item column, rest
    // empty. Reference shows this row above each contract's WO list.
    if (m.job_billing_code) {
      drawRow({ item: m.job_billing_code }, { bold: true });
    }

    // WO rows. The rate column is populated EVERY row (was set in code
    // already but the layout makes sure it shows). For permitting:
    // footage gets its own column; hours derived from amount / rate.
    for (const wo of cs.wos) {
      const cells = {
        desc: `WO# ${wo.work_order_number}`,
        amt:  fmtMoney(wo.amount),
      };
      if (isPermitting) {
        const derivedHours = m.rate > 0 ? wo.amount / m.rate : 0;
        cells.foot = wo.footage > 0 ? fmtFootage(wo.footage) : '';
        cells.qty  = fmtHours(derivedHours);
        cells.rate = fmtMoney(m.rate) + '/hr';
      } else if (isFootage) {
        cells.qty  = fmtFootage(wo.footage);
        cells.rate = fmtMoney(m.rate) + '/mi';
      } else {
        cells.qty  = fmtHours(wo.hours);
        cells.rate = fmtMoney(m.rate) + '/hr';
      }
      drawRow(cells);
    }

    // Per-contract subtotal. Owner-flagged 2026-05-06:
    //   - Label moves from `item` (95px, wraps) to `desc` (235px, fits
    //     "Contract 3 / 515-3 Subtotal" on one line).
    //   - Background is the light blue LOAN_BG to match the
    //     "Reconnect 3 / RUS 217..." row above (visual coupling — the
    //     subtotal belongs to the loan-level summary).
    //   - Smaller minHeight so the row is thinner than body rows now
    //     that the label fits on a single line.
    //   - Rate column intentionally empty (rate per row is identical;
    //     re-stating it on the subtotal is noise).
    const subQty = isPermitting
      ? fmtHours(m.rate > 0 ? cs.contract_amount / m.rate : 0)
      : (isFootage ? fmtFootage(cs.contract_footage) : fmtHours(cs.contract_hours));
    const subCells = {
      desc: `${cs.friendly_label} Subtotal`,
      qty: subQty,
      amt: fmtMoney(cs.contract_amount),
    };
    if (isPermitting) subCells.foot = fmtFootage(cs.contract_footage);
    drawRow(subCells, { bg: COL.LOAN_BG, bold: true, minHeight: 20 });
  }

  // Final total row. Reference shows "Total" in the Item column with
  // the rate ($90.00/hr) populated alongside the qty + amount, on a
  // dark blue bg with white text. We keep that single-bottom-row look
  // and drop the older black "Loan Subtotal" intermediary because for
  // a single-contract invoice it's redundant with the per-contract
  // subtotal above.
  const totalQty = isPermitting
    ? fmtHours(m.rate > 0 ? data.totals.amount / m.rate : 0)
    : (isFootage ? fmtFootage(data.totals.footage) : fmtHours(data.totals.hours));
  const totalCells = {
    item: 'Total',
    qty: totalQty,
    rate: isPermitting || !isFootage
      ? (m.rate > 0 ? fmtMoney(m.rate) + '/hr' : '')
      : (m.rate > 0 ? fmtMoney(m.rate) + '/mi' : ''),
    amt: fmtMoney(data.totals.amount),
  };
  if (isPermitting) totalCells.foot = fmtFootage(data.totals.footage);
  drawRow(totalCells, { bg: COL.SUMMARY_BG, textColor: COL.SUMMARY_TEXT, bold: true });
}

// ─── Timecards detail pages (hourly only) ──────────────────────────────
//
// Owner-flagged 2026-05-06: previous output had the staff name as a
// section heading above each per-employee block, with a "Date / Week
// Ending / WO# / Contract / Code / Hours" table per employee. The
// reference invoice owner uploaded uses ONE table for the whole
// invoice with columns "Date / Name / WO # / Contract / Hours" — the
// staff name lives on each row, no per-employee splits, no Week
// Ending or Code column. This rewrite matches that.
function renderTimecardsPages(doc, data) {
  const m = data.meta;
  const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;

  // Centered logo + title — same positioning as the summary page so
  // the document reads as a single deliverable. 180px wide matches the
  // summary's owner-tweaked size. Height read from the actual image
  // dimensions; the prior 3.8:1 estimate caused overlap with the
  // title text on every page.
  const startY = doc.y;
  const logoWidth = 180;
  const logoX = doc.page.margins.left + (pageWidth - logoWidth) / 2;
  let postLogoY = startY;
  if (fs.existsSync(LOGO_PATH)) {
    try {
      const img = doc.openImage(LOGO_PATH);
      const renderedHeight = logoWidth * (img.height / img.width);
      doc.image(LOGO_PATH, logoX, startY, { width: logoWidth });
      postLogoY = startY + renderedHeight + 16;
    } catch (e) {}
  }
  doc.y = postLogoY;

  doc.font(FONT.BODY_BOLD).fontSize(16).fillColor('#000');
  doc.text('Timecard Detail', doc.page.margins.left, doc.y, {
    width: pageWidth, align: 'center',
  });
  doc.font(FONT.ITALIC).fontSize(11).fillColor('#444');
  doc.text(m.month_year, doc.page.margins.left, doc.y + 2, {
    width: pageWidth, align: 'center',
  });
  doc.moveDown(1);

  // Single-table layout. Flatten every entry across every staff member
  // into one chronological list, then sort by date + name so the table
  // reads naturally.
  const allEntries = [];
  for (const tc of data.timecards) {
    for (const e of tc.entries) {
      allEntries.push({
        date: e.date,
        name: tc.staff_name,
        wo: e.wo,
        contract: e.contract_friendly || e.contract_number || '',
        hours: e.hours,
      });
    }
  }
  allEntries.sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? -1 : 1;
    return (a.name || '').localeCompare(b.name || '');
  });

  const cols = [
    { key: 'date',     label: 'Date',     width: 100, align: 'left'  },
    { key: 'name',     label: 'Name',     width: 130, align: 'left'  },
    { key: 'wo',       label: 'WO #',     width: 80,  align: 'left'  },
    { key: 'contract', label: 'Contract', width: 130, align: 'left'  },
    { key: 'hours',    label: 'Hours',    width: 80,  align: 'right' },
  ];
  const tableTotalWidth = cols.reduce((s, c) => s + c.width, 0);
  const tableX = (doc.page.width - tableTotalWidth) / 2;
  // Owner-flagged 2026-05-06: same body-text + row-height bump as the
  // summary table, with vertical centering on each cell.
  const MIN_ROW_H = 26;
  const ROW_PAD_TOP = 5;
  const ROW_PAD_BOTTOM = 5;
  const BODY_FONT_SIZE = 11;

  function drawRow(cells, opts = {}) {
    const y = doc.y;
    const fontSize = opts.fontSize || BODY_FONT_SIZE;
    const minRowH = opts.minHeight != null ? opts.minHeight : MIN_ROW_H;
    doc.font(opts.bold ? FONT.BODY_BOLD : FONT.BODY).fontSize(fontSize);

    const cellHeights = {};
    let maxTextH = 0;
    for (const c of cols) {
      const text = cells[c.key] != null ? String(cells[c.key]) : '';
      const h = doc.heightOfString(text, { width: c.width - 12, align: c.align });
      cellHeights[c.key] = h;
      if (h > maxTextH) maxTextH = h;
    }
    const rowH = Math.max(minRowH, Math.ceil(maxTextH + ROW_PAD_TOP + ROW_PAD_BOTTOM));

    if (opts.bg) doc.rect(tableX, y, tableTotalWidth, rowH).fill(opts.bg);
    doc.strokeColor(COL.BORDER).lineWidth(0.5);
    doc.rect(tableX, y, tableTotalWidth, rowH).stroke();
    doc.font(opts.bold ? FONT.BODY_BOLD : FONT.BODY).fontSize(fontSize)
       .fillColor(opts.textColor || COL.BODY_TEXT);

    // Same ascender-bias logic as the summary table — pdfkit's text()
    // y is the top of the line-height box, but visible glyph caps
    // sit ~22% in. Bias down so the visual middle matches the row
    // center. Owner-flagged 2026-05-06.
    const ascenderBias = Math.round(fontSize * 0.22);
    let cx = tableX;
    for (const c of cols) {
      const text = cells[c.key] != null ? String(cells[c.key]) : '';
      const yOff = Math.max(1, Math.floor((rowH - cellHeights[c.key]) / 2) + ascenderBias);
      doc.text(text, cx + 6, y + yOff, { width: c.width - 12, align: c.align });
      cx += c.width;
    }
    doc.y = y + rowH;
  }

  function drawHeaderRow() {
    drawRow(Object.fromEntries(cols.map(c => [c.key, c.label])),
      { bg: COL.HEADER_BG, textColor: COL.HEADER_TEXT, bold: true });
  }
  drawHeaderRow();

  let totalHours = 0;
  for (const e of allEntries) {
    // Auto page break — leave room for total row + small footer margin.
    if (doc.y + MIN_ROW_H + 28 > doc.page.height - doc.page.margins.bottom) {
      doc.addPage();
      drawHeaderRow();
    }
    drawRow({
      date:     formatDateLong(e.date),
      name:     e.name,
      wo:       e.wo,
      contract: e.contract,
      hours:    fmtHours(e.hours),
    });
    totalHours += parseFloat(e.hours) || 0;
  }

  // Total row — rate column is the right-most "Hours" col here, so
  // "Total Hours" lives in the Contract column for visual alignment
  // with the value to its right.
  drawRow({
    contract: 'Total Hours',
    hours: fmtHours(totalHours),
  }, { bg: COL.SUMMARY_BG, textColor: COL.SUMMARY_TEXT, bold: true });
}

// "2026-03-05" → "Mar 5, 2026" — matches the reference's "May 1, 2026"
// long-form. Fall back to the input string if parsing breaks for any
// reason.
function formatDateLong(isoDate) {
  if (!isoDate) return '';
  try {
    const [y, mo, d] = String(isoDate).split('-').map(Number);
    if (!y || !mo || !d) return isoDate;
    return `${MONTH_NAMES[mo - 1].slice(0, 3)} ${d}, ${y}`;
  } catch { return String(isoDate); }
}

// ─── Filename helper ──────────────────────────────────────────────────────
// Builds a sensible default filename for the Content-Disposition header.
function suggestedFilename(data) {
  const m = data.meta;
  // Sanitize for filesystem use — no slashes, no quotes
  const clean = (s) => String(s || '').replace(/[\\/:*?"<>|]/g, '').trim();
  const parts = [
    m.month_year,
    clean(m.job_name),
    clean(m.engineering_contract.loan_name || m.engineering_contract.contract_number || 'Invoice'),
    'Summary',
  ].filter(Boolean);
  return parts.join(' ') + '.pdf';
}

// ─── From-projects entry path ─────────────────────────────────────────
//
// New billing UX (2026-05-03): user selects projects in the Billing tab
// → clicks Print PDF → server infers EC + job + period from the selection.
// Returns either an "unambiguous" verdict (one EC, one job, periods OK)
// → ready to render, OR a "conflict" verdict the modal can use to prompt
// the user to resolve before generating.
//
// `inferInvoiceMakeup(pool, project_ids)` is the data layer — pure
// inspection, no PDF, no errors thrown for ambiguous selection. Returns
// { ok, conflicts, makeup, projects }.
async function inferInvoiceMakeup(pool, projectIds) {
  if (!Array.isArray(projectIds) || !projectIds.length) {
    return { ok: false, conflicts: ['No projects selected'], makeup: null, projects: [] };
  }
  // One round trip: pull every project + its client + contract + EC + job.
  // p.project_type is included so the no-job-set fallback below can map
  // legacy projects (no job_id, but project_type is set) to a matching
  // jobs row by name.
  const { rows } = await pool.query(
    `SELECT p.id, p.name AS project_name, p.work_order_number,
            p.billing_type, p.billing_rate::float AS rate,
            p.actual_hours::float AS actual_hours,
            p.footage::float AS footage,
            p.expected_revenue::float AS expected_revenue,
            p.project_type,
            p.status, p.billed_date, p.billing_cadence,
            cl.id AS client_id, cl.name AS client_name,
            c.id AS contract_id, c.contract_number, c.friendly_label AS contract_label,
            ec.id AS engineering_contract_id, ec.name AS engineering_contract_name,
            ec.contract_number AS engineering_contract_number, ec.loan_name,
            ec.program AS ec_program,
            j.id AS job_id, j.name AS job_name, j.billing_code,
            j.default_billing_type, j.is_permitting,
            (SELECT MIN(entry_date)::text FROM time_entries WHERE project_id = p.id) AS first_entry_date,
            (SELECT MAX(entry_date)::text FROM time_entries WHERE project_id = p.id) AS last_entry_date
       FROM projects p
       LEFT JOIN clients cl ON cl.id = p.client_id
       LEFT JOIN contracts c ON c.id = p.contract_id
       LEFT JOIN engineering_contracts ec ON ec.id = c.engineering_contract_id
       LEFT JOIN jobs j ON j.id = p.job_id
       WHERE p.id = ANY($1::uuid[])`,
    [projectIds]
  );
  if (!rows.length) {
    return { ok: false, conflicts: ['None of the selected projects exist'], makeup: null, projects: [] };
  }

  // Collapse into distinct sets to detect conflicts
  const clients = new Set(rows.map(r => r.client_id).filter(Boolean));
  const ecs = new Set(rows.map(r => r.engineering_contract_id).filter(Boolean));
  const jobs = new Set(rows.map(r => r.job_id).filter(Boolean));

  // Fallback: if no project in the selection has a job_id assigned BUT
  // they all share the same project_type, look up a matching job by
  // name. Owner rule: "this should be pulled from the jobs of the
  // projects I'm batching together — I will never bill 2 different
  // project jobs together." Lets legacy projects (project_type set,
  // job_id NULL) still produce an invoice without manual relinking.
  // Only fires when jobs.size === 0; the multi-job case still
  // surfaces a conflict the user has to resolve.
  let inferredJobInfo = null;
  if (jobs.size === 0) {
    const ptypes = new Set(rows.map(r => (r.project_type || '').trim().toLowerCase()).filter(Boolean));
    if (ptypes.size === 1) {
      const ptype = [...ptypes][0];
      // Match on case-insensitive name OR a small alias map for
      // project_type strings that don't equal the job name. RUS
      // pricing and team-based billing keys off jobs.name; matching
      // here keeps the downstream invoice generation honest.
      const aliases = {
        re: 'Resident Engineer',
        resident_engineer: 'Resident Engineer',
        'resident engineer': 'Resident Engineer',
      };
      const targetName = aliases[ptype] || ptype;
      try {
        const jr = await pool.query(
          `SELECT id, name, billing_code, default_billing_type, is_permitting
           FROM jobs
           WHERE active = TRUE AND LOWER(name) = LOWER($1)
           LIMIT 2`,
          [targetName]
        );
        if (jr.rows.length === 1) {
          inferredJobInfo = jr.rows[0];
          jobs.add(inferredJobInfo.id);
          // Patch every row's job fields in place so the rest of this
          // function (and the makeup payload below) sees the inferred job.
          for (const r of rows) {
            r.job_id = inferredJobInfo.id;
            r.job_name = inferredJobInfo.name;
            r.billing_code = inferredJobInfo.billing_code;
            r.default_billing_type = inferredJobInfo.default_billing_type;
            r.is_permitting = inferredJobInfo.is_permitting;
          }
        }
      } catch (e) {
        // Lookup failure is non-fatal — the legacy "no job" conflict
        // will fire below and the user can fix the project's job_id.
        console.warn('[inferInvoiceMakeup:job-fallback]', e && e.message);
      }
    }
  }

  const conflicts = [];
  if (clients.size === 0) conflicts.push('No client on any selected project');
  if (clients.size > 1)   conflicts.push(`Selection spans ${clients.size} clients — pick one client at a time`);
  if (ecs.size === 0)     conflicts.push('No engineering contract attached — assign one in Settings → Contracts before invoicing');
  if (ecs.size > 1)       conflicts.push(`Selection spans ${ecs.size} engineering contracts — pick one umbrella at a time`);
  if (jobs.size === 0) {
    // After the fallback above, jobs.size===0 means project_types were
    // mixed OR no matching jobs row exists. Tell the user both options.
    conflicts.push('No job on any selected project — assign a job to the project, or set its project type to a value that matches a Job name (Inspection / Resident Engineer / etc.)');
  }
  if (jobs.size > 1) {
    const names = [...new Set(rows.map(r => r.job_name).filter(Boolean))];
    conflicts.push(`Selection spans ${jobs.size} jobs (${names.join(', ')}) — one job per invoice`);
  }
  // RUS-only check on the unambiguous case. Program lives on the
  // engineering contract — a single client (PSC) can have BOTH RUS and
  // non-RUS engineering contracts, so we gate on ec.program rather than
  // cl.is_rus.
  const firstRow = rows[0];
  if (ecs.size === 1 && firstRow.ec_program !== 'rus') {
    const programLabel = firstRow.ec_program ? `program "${firstRow.ec_program}"` : 'no program set';
    conflicts.push(`Engineering contract "${firstRow.engineering_contract_name || ''}" has ${programLabel} — the PSC RUS PDF template is exclusive to engineering contracts with program='rus'`);
  }

  // Period inference: take the min/max entry_date across all selected
  // hourly projects. Footage projects have no entry dates, so they default
  // to "any". Caller can override via period_start/period_end.
  let inferredStart = null, inferredEnd = null;
  for (const r of rows) {
    if (r.first_entry_date && (!inferredStart || r.first_entry_date < inferredStart)) inferredStart = r.first_entry_date;
    if (r.last_entry_date && (!inferredEnd || r.last_entry_date > inferredEnd)) inferredEnd = r.last_entry_date;
  }

  // Distinct contracts — used by the modal to show "this invoice covers
  // contracts: 515-3, 515-4" so the user sees the multi-contract grouping.
  const contractMap = new Map();
  for (const r of rows) {
    if (!r.contract_id || contractMap.has(r.contract_id)) continue;
    contractMap.set(r.contract_id, {
      id: r.contract_id,
      contract_number: r.contract_number,
      friendly_label: r.contract_label || r.contract_number,
    });
  }

  return {
    ok: conflicts.length === 0,
    conflicts,
    makeup: {
      client_id: clients.size === 1 ? [...clients][0] : null,
      client_name: firstRow.client_name,
      engineering_contract_id: ecs.size === 1 ? [...ecs][0] : null,
      engineering_contract_name: firstRow.engineering_contract_name,
      engineering_contract_number: firstRow.engineering_contract_number,
      loan_name: firstRow.loan_name,
      job_id: jobs.size === 1 ? [...jobs][0] : null,
      job_name: firstRow.job_name,
      job_billing_code: firstRow.billing_code,
      job_billing_type: firstRow.is_permitting || firstRow.default_billing_type === 'footage' ? 'footage' : 'hourly',
      contracts: [...contractMap.values()],
      inferred_period_start: inferredStart,
      inferred_period_end: inferredEnd,
      project_count: rows.length,
    },
    projects: rows.map(r => ({
      id: r.id,
      name: r.project_name,
      wo: r.work_order_number,
      contract_id: r.contract_id,
      contract_number: r.contract_number,
      job_id: r.job_id,
      job_name: r.job_name,
      client_id: r.client_id,
      engineering_contract_id: r.engineering_contract_id,
      hours: r.actual_hours,
      footage: r.footage,
    })),
  };
}

// Build the same InvoiceData shape as buildInvoiceData but driven by an
// explicit project_ids list. Caller can supply period_start/period_end
// to override what we infer from time_entries (useful when billing for a
// specific month even if some entries fall outside it).
async function buildInvoiceDataFromProjects(pool, opts) {
  const { project_ids, period_start, period_end } = opts;
  const inf = await inferInvoiceMakeup(pool, project_ids);
  if (!inf.ok) {
    const err = new Error(inf.conflicts.join('; '));
    err.conflicts = inf.conflicts;
    err.makeup = inf.makeup;
    throw err;
  }
  // Period: prefer explicit override; otherwise use inferred range; if
  // there were no time entries (footage-only) default to a wide window.
  const start = period_start || inf.makeup.inferred_period_start || '1970-01-01';
  const end   = period_end   || inf.makeup.inferred_period_end   || '2099-12-31';
  // Limit to ONLY the contracts that are actually represented in the
  // selection — otherwise buildInvoiceData would scan every contract under
  // the engineering contract and possibly include WOs the user didn't pick.
  const contract_ids = inf.makeup.contracts.map(c => c.id);
  return await buildInvoiceData(pool, {
    engineering_contract_id: inf.makeup.engineering_contract_id,
    job_id: inf.makeup.job_id,
    period_start: start,
    period_end: end,
    contract_ids,
  });
}

module.exports = {
  buildInvoiceData,
  buildInvoiceDataFromProjects,
  inferInvoiceMakeup,
  renderInvoicePdf,
  suggestedFilename,
};
