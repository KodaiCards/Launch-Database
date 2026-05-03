// ═══════════════════════════════════════════════════════════════════════════
// invoice_generator.js
//
// PDF invoice generator for PSC RUS work — pixel-faithful match of the
// owner's existing Excel summary template + a timecards detail page for
// hourly jobs.
//
// Two variants, picked by the JOB's billing_type:
//   - 'hourly'  → Inspector, Resident Engineer, anything PSC RUS hourly.
//                 Summary page (Hours/Rate/Amount columns) + one timecards
//                 page section per employee.
//   - 'footage' → Permitting, footage-billed PSC RUS work. Summary page
//                 with a Footage column (auto-formatted as miles when
//                 ≥ 1 mile, feet when below); NO timecards pages.
//
// All other invoice formats (non-PSC-RUS clients, future templates) are
// out of scope here — see memory file `reference_invoice_non_rus_formats.md`.
//
// Public surface:
//   buildInvoiceData(pool, opts)  → assemble the data structure (testable
//                                   without PDF — useful for the API
//                                   preview endpoint and unit tests)
//   renderInvoicePdf(data, stream) → write the PDF into a writable stream
//
// The two are split deliberately so the data assembly can be unit-tested
// without spinning up pdfkit, and so an HTML-preview endpoint can reuse
// the same data.
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
const LOGO_PATH = path.join(__dirname, 'public', 'img', 'Launch Fiber PNG.png');

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
  const ecRes = await pool.query(
    `SELECT ec.id, ec.name, ec.contract_number, ec.loan_name,
            cl.id AS client_id, cl.name AS client_name, cl.is_rus
       FROM engineering_contracts ec
       JOIN clients cl ON cl.id = ec.client_id
       WHERE ec.id = $1`,
    [engineering_contract_id]
  );
  if (!ecRes.rows[0]) throw new Error('Engineering contract not found');
  const ec = ecRes.rows[0];

  // Refuse to render for non-PSC-RUS work — different format. Better to
  // fail loudly than to mis-format a real invoice for COX or a future client.
  if (!ec.is_rus) {
    throw new Error(`Client "${ec.client_name}" is not RUS — this template is exclusive to PSC RUS work. Other clients need their own template (see reference_invoice_non_rus_formats memory).`);
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
    const projRes = await pool.query(
      `SELECT id, work_order_number, name, footage::float AS footage, expected_revenue::float AS expected_revenue
         FROM projects
         WHERE contract_id = $1 AND job_id = $2
         ORDER BY work_order_number NULLS LAST, name`,
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
        // Hourly: sum time_entries.hours within the period.
        const teRes = await pool.query(
          `SELECT COALESCE(SUM(hours), 0)::float AS h
             FROM time_entries
             WHERE project_id = $1 AND entry_date BETWEEN $2 AND $3`,
          [p.id, period_start, period_end]
        );
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
    const tcRes = await pool.query(
      `SELECT te.entry_date::text AS date,
              te.hours::float AS hours,
              s.name AS staff_name,
              p.work_order_number AS wo,
              c.contract_number AS contract_number,
              c.friendly_label AS contract_friendly,
              -- Week ending = next Sunday (or today if today is Sunday).
              -- date_trunc + interval gives us the Monday of the week,
              -- + 6 days = Sunday.
              (date_trunc('week', te.entry_date) + INTERVAL '6 days')::date::text AS week_ending
         FROM time_entries te
         JOIN projects p ON p.id = te.project_id
         JOIN contracts c ON c.id = p.contract_id
         LEFT JOIN staff s ON s.id = te.staff_id
         WHERE te.project_id = ANY($1::uuid[])
           AND te.entry_date BETWEEN $2 AND $3
         ORDER BY s.name NULLS LAST, te.entry_date, p.work_order_number`,
      [projectIds, period_start, period_end]
    );
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
// Renders the assembled `data` into the given writable stream. Caller is
// responsible for setting Content-Type and finalizing the response after
// the PDF stream `end` event.
function renderInvoicePdf(data, stream) {
  const isFootage = data.meta.job_billing_type === 'footage';
  const doc = new PDFDocument({
    size: 'LETTER',
    margins: { top: 50, bottom: 50, left: 40, right: 40 },
    info: {
      Title: `${data.meta.job_name} Summary - ${data.meta.month_year}`,
      Author: 'Launch Fiber Services',
      Subject: 'PSC RUS Invoice',
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
  // ~180px wide, horizontally centered. Skipped silently if the asset is
  // missing so the PDF still renders during early dev / fresh deploys.
  const startY = doc.y;
  const logoWidth = 180;
  const logoX = doc.page.margins.left + (pageWidth - logoWidth) / 2;
  let postLogoY = startY;
  if (fs.existsSync(LOGO_PATH)) {
    try {
      doc.image(LOGO_PATH, logoX, startY, { width: logoWidth });
      // PDFKit doesn't auto-advance doc.y after image() — estimate logo
      // height from typical aspect (≈ 3:1 for the Launch wordmark).
      postLogoY = startY + (logoWidth / 3) + 8;
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
  // 5 columns. Permitting uses Hours+$/hr (footage shown as sub-info in
  // Description); pure footage uses Footage+$/mi.
  const qtyLabel = isPermitting ? 'Hours' : (isFootage ? 'Footage' : 'Hours');
  const cols = [
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
  const rowH = 18;

  // Helper to draw one row at the current y, advancing y by rowH.
  function drawRow(cells, opts = {}) {
    const y = doc.y;
    const bg = opts.bg;
    const textColor = opts.textColor || COL.BODY_TEXT;
    const bold = !!opts.bold;
    const padLeft = 6, padRight = 6;
    // Background
    if (bg) {
      doc.rect(tableX, y, tableTotalWidth, rowH).fill(bg);
    }
    // Borders
    doc.strokeColor(COL.BORDER).lineWidth(0.5);
    doc.rect(tableX, y, tableTotalWidth, rowH).stroke();
    // Text per cell
    let cx = tableX;
    doc.font(bold ? FONT.BODY_BOLD : FONT.BODY).fontSize(9).fillColor(textColor);
    for (let i = 0; i < cols.length; i++) {
      const c = cols[i];
      const cellText = cells[c.key] != null ? String(cells[c.key]) : '';
      const tx = cx + padLeft;
      const tw = c.width - padLeft - padRight;
      doc.text(cellText, tx, y + 5, {
        width: tw, align: c.align,
      });
      cx += c.width;
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

  // Per-contract sections
  const showContractHeaders = data.contracts.length > 1;
  for (const cs of data.contracts) {
    if (showContractHeaders) {
      // Contract header row
      drawRow({
        item: cs.friendly_label,
      }, { bg: COL.CONTRACT_BG, bold: true });
    }
    // WO rows — billing code on first WO row only.
    // For permitting: derive hours from amount/rate (the calc that produced
    // the amount in the first place: hours = miles * 27.5, capped at 25
    // when miles<1) and put footage as a sub-info line in Description.
    let firstWo = true;
    for (const wo of cs.wos) {
      let qtyText, rateText, descText;
      if (isPermitting) {
        const derivedHours = m.rate > 0 ? wo.amount / m.rate : 0;
        qtyText = fmtHours(derivedHours);
        rateText = fmtMoney(m.rate) + '/hr';
        descText = `WO# ${wo.work_order_number}` +
          (wo.footage > 0 ? `   (${fmtFootage(wo.footage)})` : '');
      } else if (isFootage) {
        qtyText = fmtFootage(wo.footage);
        rateText = fmtMoney(m.rate) + '/mi';
        descText = `WO# ${wo.work_order_number}`;
      } else {
        qtyText = fmtHours(wo.hours);
        rateText = fmtMoney(m.rate) + '/hr';
        descText = `WO# ${wo.work_order_number}`;
      }
      drawRow({
        item: firstWo ? (m.job_billing_code || '') : '',
        desc: descText,
        qty: qtyText,
        rate: rateText,
        amt: fmtMoney(wo.amount),
      });
      firstWo = false;
    }
    // Per-contract subtotal — only if multi-contract
    if (showContractHeaders) {
      // Hours derived for permitting subtotal too (amount / rate aggregates
      // the same way since it's a linear function of amount).
      const subQty = isPermitting
        ? fmtHours(m.rate > 0 ? cs.contract_amount / m.rate : 0)
        : (isFootage ? fmtFootage(cs.contract_footage) : fmtHours(cs.contract_hours));
      drawRow({
        desc: `${cs.friendly_label} Subtotal`,
        qty: subQty,
        amt: fmtMoney(cs.contract_amount),
      }, { bg: COL.CONTRACT_SUBTOTAL_BG, bold: true });
    }
  }

  // Loan-wide subtotal — black bg, white text. The owner's screenshot has
  // this even on single-contract invoices.
  const totalQty = isPermitting
    ? fmtHours(m.rate > 0 ? data.totals.amount / m.rate : 0)
    : (isFootage ? fmtFootage(data.totals.footage) : fmtHours(data.totals.hours));
  drawRow({
    desc: m.engineering_contract.loan_name
      ? `${m.engineering_contract.loan_name} Subtotal`
      : 'Subtotal',
    qty: totalQty,
    amt: fmtMoney(data.totals.amount),
  }, { bg: COL.LOAN_SUBTOTAL_BG, textColor: COL.LOAN_SUBTOTAL_TEXT, bold: true });

  // Final summary row — blue bg, white text. Same numbers as the loan
  // subtotal in single-loan invoices, but a separate row matches the Excel.
  doc.moveDown(0.2);
  drawRow({
    desc: 'Summary',
    qty: totalQty,
    amt: fmtMoney(data.totals.amount),
  }, { bg: COL.SUMMARY_BG, textColor: COL.SUMMARY_TEXT, bold: true });
}

// ─── Timecards detail pages (hourly only) ──────────────────────────────
function renderTimecardsPages(doc, data) {
  const m = data.meta;
  const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;

  // Page header (repeats per page via PDFKit's page-add hook would be
  // cleaner, but for a single-page-per-employee layout we render header
  // once at top of each section).
  doc.font(FONT.BODY_BOLD).fontSize(16).fillColor('#000');
  doc.text(`${m.job_name} Timecards`, doc.page.margins.left, doc.page.margins.top);
  doc.font(FONT.ITALIC).fontSize(11).fillColor('#444');
  doc.text(`${m.month_year} · ${m.engineering_contract.loan_name || m.engineering_contract.name}`);
  doc.moveDown(0.6);

  for (let i = 0; i < data.timecards.length; i++) {
    if (i > 0) doc.addPage();
    renderTimecardSection(doc, data.timecards[i], m);
  }
}

function renderTimecardSection(doc, tc, meta) {
  const tableX = doc.page.margins.left;
  const cols = [
    { key: 'date',   label: 'Date',        width: 90,  align: 'left'  },
    { key: 'week',   label: 'Week Ending', width: 90,  align: 'left'  },
    { key: 'wo',     label: 'WO #',        width: 90,  align: 'left'  },
    { key: 'contract', label: 'Contract',  width: 130, align: 'left'  },
    { key: 'code',   label: 'Code',        width: 70,  align: 'left'  },
    { key: 'hours',  label: 'Hours',       width: 60,  align: 'right' },
  ];
  const tableTotalWidth = cols.reduce((s, c) => s + c.width, 0);
  const rowH = 16;

  // Section header — employee name in bold, summary line below
  doc.font(FONT.BODY_BOLD).fontSize(13).fillColor('#000');
  doc.text(tc.staff_name, tableX);
  doc.font(FONT.BODY).fontSize(9).fillColor('#666');
  doc.text(`${tc.entries.length} entries · ${fmtHours(tc.total_hours)} hrs total`, tableX);
  doc.moveDown(0.3);

  function drawRow(cells, opts = {}) {
    const y = doc.y;
    if (opts.bg) {
      doc.rect(tableX, y, tableTotalWidth, rowH).fill(opts.bg);
    }
    doc.strokeColor(COL.BORDER).lineWidth(0.4);
    doc.rect(tableX, y, tableTotalWidth, rowH).stroke();
    let cx = tableX;
    doc.font(opts.bold ? FONT.BODY_BOLD : FONT.BODY).fontSize(8.5)
       .fillColor(opts.textColor || COL.BODY_TEXT);
    for (const c of cols) {
      doc.text(cells[c.key] != null ? String(cells[c.key]) : '',
        cx + 4, y + 4, { width: c.width - 8, align: c.align });
      cx += c.width;
    }
    doc.y = y + rowH;
  }

  // Header
  drawRow(Object.fromEntries(cols.map(c => [c.key, c.label])),
    { bg: COL.HEADER_BG, textColor: COL.HEADER_TEXT, bold: true });

  // Body rows — auto-page-break if we run out of room
  for (const e of tc.entries) {
    // Crude page-break check: leave room for the total row at the bottom
    if (doc.y + rowH > doc.page.height - doc.page.margins.bottom - 30) {
      doc.addPage();
      // Reprint a slim header on continuation pages for readability
      doc.font(FONT.BODY_BOLD).fontSize(11).fillColor('#000');
      doc.text(`${tc.staff_name} (continued)`, tableX);
      doc.moveDown(0.3);
      drawRow(Object.fromEntries(cols.map(c => [c.key, c.label])),
        { bg: COL.HEADER_BG, textColor: COL.HEADER_TEXT, bold: true });
    }
    drawRow({
      date:     e.date,
      week:     e.week_ending,
      wo:       'WO# ' + e.wo,
      contract: e.contract_friendly || e.contract_number || '',
      code:     meta.job_billing_code || '',
      hours:    fmtHours(e.hours),
    });
  }

  // Total row
  drawRow({
    week: 'Total',
    hours: fmtHours(tc.total_hours),
  }, { bg: COL.LOAN_SUBTOTAL_BG, textColor: COL.LOAN_SUBTOTAL_TEXT, bold: true });
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
  // One round trip: pull every project + its client + contract + EC + job
  const { rows } = await pool.query(
    `SELECT p.id, p.name AS project_name, p.work_order_number,
            p.billing_type, p.billing_rate::float AS rate,
            p.actual_hours::float AS actual_hours,
            p.footage::float AS footage,
            p.expected_revenue::float AS expected_revenue,
            p.status, p.billed_date, p.billing_cadence,
            cl.id AS client_id, cl.name AS client_name, cl.is_rus,
            c.id AS contract_id, c.contract_number, c.friendly_label AS contract_label,
            ec.id AS engineering_contract_id, ec.name AS engineering_contract_name,
            ec.contract_number AS engineering_contract_number, ec.loan_name,
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

  const conflicts = [];
  if (clients.size === 0) conflicts.push('No client on any selected project');
  if (clients.size > 1)   conflicts.push(`Selection spans ${clients.size} clients — pick one client at a time`);
  if (ecs.size === 0)     conflicts.push('No engineering contract attached — assign one in Settings → Contracts before invoicing');
  if (ecs.size > 1)       conflicts.push(`Selection spans ${ecs.size} engineering contracts — pick one umbrella at a time`);
  if (jobs.size === 0)    conflicts.push('No job on any selected project');
  if (jobs.size > 1) {
    const names = [...new Set(rows.map(r => r.job_name).filter(Boolean))];
    conflicts.push(`Selection spans ${jobs.size} jobs (${names.join(', ')}) — one job per invoice`);
  }
  // RUS-only check on the unambiguous case
  const firstRow = rows[0];
  if (clients.size === 1 && !firstRow.is_rus) {
    conflicts.push(`Client "${firstRow.client_name}" is not RUS — this template is exclusive to PSC RUS work`);
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
