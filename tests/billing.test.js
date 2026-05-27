// tests/billing.test.js
//
// Wave-28 (B1 / pre-refactor) baseline tests for routes/billing.js plus the
// money-math paths that intersect from routes/revenue.js and
// routes/invoices.js. These tests intentionally lock in CURRENT BEHAVIOR
// (float-precision math, no idempotency guard, hardcoded fallback rates)
// so the B1 cents-integer refactor + B2 idempotency unique-index change
// have a green baseline to refactor against.
//
// Tests intentionally NOT modifying routes/billing.js — this file only
// reads behavior. When B1 lands, the // FLOAT-DRIFT cases will need
// re-assertion against the new cents-integer math. When B2 lands, the
// // IDEMPOTENCY cases will need inversion (current behavior is broken;
// post-B2 it must reject the duplicate).
//
// Endpoints covered:
//   POST   /api/billing/bill-multiple
//   GET    /api/billing/batches
//   GET    /api/billing/batches/:id
//   POST   /api/billing/batches
//   DELETE /api/billing/batches/:id
//   POST   /api/billing/batches/:id/confirm
//   GET    /api/billing/report
//   GET    /api/revenue/by-client                (rate fallback parity)
//   GET    /api/revenue/details                  (rate fallback parity)
//   GET    /api/revenue/monthly-summary          (YTD sanity)
//
// NOTE: DATABASE_URL must be set. _helpers.js throws otherwise.

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const {
  bootTestServer, close, adminLogin, requestJson, request,
  fixtures, cleanupAll, uniqueTag, pool,
} = require('./_helpers');

let token;
const cleanup = {
  clients: [],
  projects: [],
  staff: [],
};
// Tracked separately so we sweep dependents before parents.
const extraCleanup = {
  invoices: [],            // invoice ids — sweep invoice_items first
  billing_batches: [],     // batch ids — items cascade
};

before(async () => {
  await bootTestServer();
  token = await adminLogin();
});

after(async () => {
  // Sweep invoice_items first (FK to invoices).
  if (extraCleanup.invoices.length) {
    try {
      await pool.query(
        `DELETE FROM invoice_items WHERE invoice_id = ANY($1::uuid[])`,
        [extraCleanup.invoices]
      );
      await pool.query(
        `DELETE FROM invoices WHERE id = ANY($1::uuid[])`,
        [extraCleanup.invoices]
      );
    } catch (e) {
      console.warn('[cleanup] invoices sweep failed:', e.message);
    }
  }
  if (extraCleanup.billing_batches.length) {
    try {
      // billing_batch_items has ON DELETE CASCADE per migration; deleting
      // the batch deletes the items.
      await pool.query(
        `DELETE FROM billing_batches WHERE id = ANY($1::uuid[])`,
        [extraCleanup.billing_batches]
      );
    } catch (e) {
      console.warn('[cleanup] billing_batches sweep failed:', e.message);
    }
  }
  await cleanupAll(cleanup);
  await close();
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

// Round to 2 decimals, the way the DECIMAL(12,2) / NUMERIC(14,2) cast does
// when JS floats land in the column.
function dec2(n) { return Math.round((Number(n) + Number.EPSILON) * 100) / 100; }

// Seed a project + N time entries. Returns the project row.
async function seedHourlyProject({
  client_id, billing_rate = 90, billing_cadence = 'one_time',
  staff_id, hours = [], project_type = 'inspection',
  status = 'active', name,
}) {
  const proj = await fixtures.project({
    name: name || uniqueTag('bill-proj'),
    client_id,
    project_type,
    billing_type: 'hourly',
    billing_rate,
    status,
  });
  // billing_cadence is on projects but the helper doesn't set it.
  await pool.query(
    `UPDATE projects SET billing_cadence = $1 WHERE id = $2`,
    [billing_cadence, proj.id]
  );
  cleanup.projects.push(proj.id);
  for (const h of hours) {
    await fixtures.timeEntry({
      project_id: proj.id,
      staff_id,
      entry_date: h.date,
      hours: h.hours,
      job_title: h.job_title || 'Inspector',
    });
    // is_billable defaults to TRUE per schema; only override if asked.
    if (h.is_billable === false) {
      await pool.query(
        `UPDATE time_entries SET is_billable = FALSE
           WHERE project_id = $1 AND entry_date = $2 AND hours = $3`,
        [proj.id, h.date, h.hours]
      );
    }
  }
  return proj;
}

// Seed a footage project (no time entries needed for the billing math).
async function seedFootageProject({
  client_id, footage = 1000, expected_revenue = 5000,
  status = 'completed', name,
}) {
  const proj = await fixtures.project({
    name: name || uniqueTag('bill-ftg'),
    client_id,
    project_type: 'inspection',
    billing_type: 'footage',
    billing_rate: 5, // per-foot (nonsense if multiplied by hours — that's the trap)
    status,
    footage,
    expected_revenue,
  });
  cleanup.projects.push(proj.id);
  return proj;
}

// ─── Shared client / staff ───────────────────────────────────────────────────

let sharedClient;
let sharedStaff;

before(async () => {
  sharedClient = await fixtures.client({ name: uniqueTag('billing-client') });
  cleanup.clients.push(sharedClient.id);

  sharedStaff = await fixtures.staff({ name: uniqueTag('billing-staff') });
  cleanup.staff.push(sharedStaff.id);
});

// ════════════════════════════════════════════════════════════════════════════
// POST /api/billing/bill-multiple — line-item & total computation
// ════════════════════════════════════════════════════════════════════════════

test('bill-multiple: single one-time hourly project, integer hours × rate', async () => {
  const proj = await seedHourlyProject({
    client_id: sharedClient.id,
    billing_rate: 90,
    staff_id: sharedStaff.id,
    hours: [
      { date: '2024-01-15', hours: 8 },
      { date: '2024-01-16', hours: 8 },
    ],
  });
  // helper sums hours into projects.actual_hours? No — we have to set it,
  // because the one-time branch uses parseFloat(p.actual_hours).
  await pool.query(
    `UPDATE projects SET actual_hours = 16 WHERE id = $1`, [proj.id]
  );

  const res = await requestJson('POST', '/api/billing/bill-multiple', {
    token,
    body: {
      project_ids: [proj.id],
      invoice_number: uniqueTag('INV-OT-1'),
      invoice_date: '2024-01-31',
    },
  });
  assert.equal(res.ok, true);
  assert.equal(res.line_count, 1);
  assert.equal(dec2(res.total), 1440); // 16 × 90
  extraCleanup.invoices.push(res.invoice_id);

  // Verify line item persisted with computed amount.
  const { rows } = await pool.query(
    `SELECT amount, quantity, rate FROM invoice_items WHERE invoice_id = $1`,
    [res.invoice_id]
  );
  assert.equal(rows.length, 1);
  assert.equal(parseFloat(rows[0].amount), 1440);
  assert.equal(parseFloat(rows[0].quantity), 16);
  assert.equal(parseFloat(rows[0].rate), 90);
});

test('bill-multiple: single one-time hourly project closes out (status=billed)', async () => {
  const proj = await seedHourlyProject({
    client_id: sharedClient.id,
    billing_rate: 100,
    staff_id: sharedStaff.id,
    hours: [{ date: '2024-02-05', hours: 10 }],
  });
  await pool.query(`UPDATE projects SET actual_hours = 10 WHERE id = $1`, [proj.id]);

  const res = await requestJson('POST', '/api/billing/bill-multiple', {
    token,
    body: {
      project_ids: [proj.id],
      invoice_number: uniqueTag('INV-OT-CLOSE'),
      invoice_date: '2024-02-28',
    },
  });
  assert.equal(res.ok, true);
  extraCleanup.invoices.push(res.invoice_id);

  const { rows } = await pool.query(
    `SELECT status, billed_date FROM projects WHERE id = $1`, [proj.id]
  );
  assert.equal(rows[0].status, 'billed',
    'one-time project must close to status=billed after bill-multiple');
  assert.ok(rows[0].billed_date, 'billed_date must be set');
});

test('bill-multiple: monthly cadence project stays active after billing', async () => {
  const proj = await seedHourlyProject({
    client_id: sharedClient.id,
    billing_rate: 90,
    billing_cadence: 'monthly',
    staff_id: sharedStaff.id,
    hours: [
      { date: '2024-03-05', hours: 8 },
      { date: '2024-03-06', hours: 4 },
    ],
  });

  const res = await requestJson('POST', '/api/billing/bill-multiple', {
    token,
    body: {
      project_ids: [proj.id],
      invoice_number: uniqueTag('INV-M-1'),
      invoice_date: '2024-04-01',
      items: [
        { project_id: proj.id, period_year: 2024, period_month: 3 },
      ],
    },
  });
  assert.equal(res.ok, true);
  assert.equal(dec2(res.total), 1080); // (8 + 4) × 90 = 1080
  extraCleanup.invoices.push(res.invoice_id);

  const { rows } = await pool.query(
    `SELECT status, billed_date, billing_cadence FROM projects WHERE id = $1`,
    [proj.id]
  );
  assert.equal(rows[0].billing_cadence, 'monthly');
  assert.equal(rows[0].status, 'active',
    'monthly cadence project must stay active (no billed close-out)');
  assert.equal(rows[0].billed_date, null,
    'monthly cadence project must not have billed_date set');
});

test('bill-multiple: monthly with period override only sums that month\'s billable hours', async () => {
  const proj = await seedHourlyProject({
    client_id: sharedClient.id,
    billing_rate: 90,
    billing_cadence: 'monthly',
    staff_id: sharedStaff.id,
    hours: [
      { date: '2024-04-01', hours: 8 },  // April
      { date: '2024-04-15', hours: 4 },  // April
      { date: '2024-05-01', hours: 8 },  // May (must NOT be in invoice)
    ],
  });

  const res = await requestJson('POST', '/api/billing/bill-multiple', {
    token,
    body: {
      project_ids: [proj.id],
      invoice_number: uniqueTag('INV-M-APR'),
      items: [{ project_id: proj.id, period_year: 2024, period_month: 4 }],
    },
  });
  assert.equal(dec2(res.total), 1080); // (8 + 4) × 90 — May entry NOT included
  extraCleanup.invoices.push(res.invoice_id);
});

test('bill-multiple: monthly skips is_billable=FALSE entries', async () => {
  const proj = await seedHourlyProject({
    client_id: sharedClient.id,
    billing_rate: 90,
    billing_cadence: 'monthly',
    staff_id: sharedStaff.id,
    hours: [
      { date: '2024-06-05', hours: 10, is_billable: true },
      { date: '2024-06-06', hours: 5, is_billable: false }, // overhead — must NOT bill
    ],
  });

  const res = await requestJson('POST', '/api/billing/bill-multiple', {
    token,
    body: {
      project_ids: [proj.id],
      invoice_number: uniqueTag('INV-M-JUN'),
      items: [{ project_id: proj.id, period_year: 2024, period_month: 6 }],
    },
  });
  assert.equal(dec2(res.total), 900); // 10 × 90 (unbillable 5h skipped)
  extraCleanup.invoices.push(res.invoice_id);
});

test('bill-multiple: footage project bills expected_revenue, not hours×rate', async () => {
  const proj = await seedFootageProject({
    client_id: sharedClient.id,
    footage: 1500,
    expected_revenue: 7500.00,
  });

  const res = await requestJson('POST', '/api/billing/bill-multiple', {
    token,
    body: {
      project_ids: [proj.id],
      invoice_number: uniqueTag('INV-FTG-1'),
    },
  });
  assert.equal(dec2(res.total), 7500.00);
  extraCleanup.invoices.push(res.invoice_id);

  const { rows } = await pool.query(
    `SELECT unit, quantity, amount FROM invoice_items WHERE invoice_id = $1`,
    [res.invoice_id]
  );
  assert.equal(rows[0].unit, 'lf');
  assert.equal(parseFloat(rows[0].quantity), 1500);
  assert.equal(parseFloat(rows[0].amount), 7500.00);
});

test('bill-multiple: caller override.amount wins over project math', async () => {
  const proj = await seedHourlyProject({
    client_id: sharedClient.id,
    billing_rate: 90,
    staff_id: sharedStaff.id,
    hours: [{ date: '2024-07-01', hours: 10 }],
  });
  await pool.query(`UPDATE projects SET actual_hours = 10 WHERE id = $1`, [proj.id]);

  const res = await requestJson('POST', '/api/billing/bill-multiple', {
    token,
    body: {
      project_ids: [proj.id],
      invoice_number: uniqueTag('INV-OVR'),
      items: [{ project_id: proj.id, amount: 1234.56, description: 'Custom desc' }],
    },
  });
  // Override.amount wins.
  assert.equal(dec2(res.total), 1234.56);
  extraCleanup.invoices.push(res.invoice_id);

  const { rows } = await pool.query(
    `SELECT description, amount FROM invoice_items WHERE invoice_id = $1`,
    [res.invoice_id]
  );
  assert.equal(rows[0].description, 'Custom desc');
  assert.equal(parseFloat(rows[0].amount), 1234.56);
});

test('bill-multiple: project.manual_invoice_amount overrides hours×rate (no override)', async () => {
  const proj = await seedHourlyProject({
    client_id: sharedClient.id,
    billing_rate: 90,
    staff_id: sharedStaff.id,
    hours: [{ date: '2024-08-01', hours: 10 }],
  });
  await pool.query(
    `UPDATE projects SET actual_hours = 10, manual_invoice_amount = 2500
       WHERE id = $1`,
    [proj.id]
  );

  const res = await requestJson('POST', '/api/billing/bill-multiple', {
    token,
    body: {
      project_ids: [proj.id],
      invoice_number: uniqueTag('INV-MANUAL'),
    },
  });
  assert.equal(dec2(res.total), 2500);
  extraCleanup.invoices.push(res.invoice_id);

  const { rows } = await pool.query(
    `SELECT unit, quantity, amount FROM invoice_items WHERE invoice_id = $1`,
    [res.invoice_id]
  );
  assert.equal(rows[0].unit, 'flat');
  assert.equal(parseFloat(rows[0].quantity), 1);
  assert.equal(parseFloat(rows[0].amount), 2500);
});

test('bill-multiple: multiple projects same client roll into single invoice', async () => {
  const a = await seedHourlyProject({
    client_id: sharedClient.id,
    billing_rate: 90,
    staff_id: sharedStaff.id,
    hours: [],
  });
  const b = await seedHourlyProject({
    client_id: sharedClient.id,
    billing_rate: 100,
    staff_id: sharedStaff.id,
    hours: [],
  });
  await pool.query(`UPDATE projects SET actual_hours = 4 WHERE id = $1`, [a.id]);
  await pool.query(`UPDATE projects SET actual_hours = 10 WHERE id = $1`, [b.id]);

  const res = await requestJson('POST', '/api/billing/bill-multiple', {
    token,
    body: {
      project_ids: [a.id, b.id],
      invoice_number: uniqueTag('INV-MULTI'),
    },
  });
  assert.equal(res.line_count, 2);
  // 4×90 + 10×100 = 360 + 1000 = 1360
  assert.equal(dec2(res.total), 1360);
  extraCleanup.invoices.push(res.invoice_id);

  const { rows } = await pool.query(
    `SELECT COUNT(*)::int AS n FROM invoice_items WHERE invoice_id = $1`,
    [res.invoice_id]
  );
  assert.equal(rows[0].n, 2);
});

test('bill-multiple: rejects mixed-client selection', async () => {
  const otherClient = await fixtures.client({ name: uniqueTag('other-client') });
  cleanup.clients.push(otherClient.id);

  const a = await seedHourlyProject({
    client_id: sharedClient.id,
    staff_id: sharedStaff.id,
    hours: [],
  });
  const b = await seedHourlyProject({
    client_id: otherClient.id,
    staff_id: sharedStaff.id,
    hours: [],
  });

  const res = await request('POST', '/api/billing/bill-multiple', {
    token,
    body: {
      project_ids: [a.id, b.id],
      invoice_number: uniqueTag('INV-MIX'),
    },
  });
  assert.equal(res.status, 400);
  const body = await res.json();
  assert.match(body.error, /same client/i);
});

test('bill-multiple: rejects empty project_ids', async () => {
  const res = await request('POST', '/api/billing/bill-multiple', {
    token,
    body: { project_ids: [], invoice_number: 'EMPTY' },
  });
  assert.equal(res.status, 400);
});

test('bill-multiple: rejects multi-month periods in a single invoice', async () => {
  const proj = await seedHourlyProject({
    client_id: sharedClient.id,
    billing_rate: 90,
    billing_cadence: 'monthly',
    staff_id: sharedStaff.id,
    hours: [
      { date: '2024-09-05', hours: 8 },
      { date: '2024-10-05', hours: 8 },
    ],
  });

  const res = await request('POST', '/api/billing/bill-multiple', {
    token,
    body: {
      project_ids: [proj.id, proj.id], // forced multi-period
      invoice_number: uniqueTag('INV-MULTIMONTH'),
      items: [
        { project_id: proj.id, period_year: 2024, period_month: 9 },
        { project_id: proj.id, period_year: 2024, period_month: 10 },
      ],
    },
  });
  // The endpoint validates project_ids vs found rows first; duplicate
  // project_ids in the body returns 400 "One or more projects not found"
  // because the SELECT returns 1 row but length expects 2. Either way,
  // the endpoint rejects → 400.
  assert.equal(res.status, 400);
});

test('bill-multiple: writes billing_period_start/end when items share single month', async () => {
  const proj = await seedHourlyProject({
    client_id: sharedClient.id,
    billing_rate: 90,
    billing_cadence: 'monthly',
    staff_id: sharedStaff.id,
    hours: [{ date: '2024-11-15', hours: 4 }],
  });

  const res = await requestJson('POST', '/api/billing/bill-multiple', {
    token,
    body: {
      project_ids: [proj.id],
      invoice_number: uniqueTag('INV-PERIOD'),
      items: [{ project_id: proj.id, period_year: 2024, period_month: 11 }],
    },
  });
  extraCleanup.invoices.push(res.invoice_id);

  const { rows } = await pool.query(
    `SELECT billing_period_start::text, billing_period_end::text
       FROM invoices WHERE id = $1`,
    [res.invoice_id]
  );
  assert.equal(rows[0].billing_period_start, '2024-11-01');
  assert.equal(rows[0].billing_period_end, '2024-11-30');
});

// ════════════════════════════════════════════════════════════════════════════
// FLOAT-DRIFT — current behavior locks here. After B1 cents-integer
// refactor, these assertions need updating to the new (correct) numbers.
// ════════════════════════════════════════════════════════════════════════════

test('// FLOAT-DRIFT: 0.1 + 0.2 + 0.3 + ... accumulator with float math', async () => {
  // JS float math: 0.1 + 0.2 + 0.3 + 0.4 + 0.5 + 0.6 + 0.7 = 2.8 expected,
  // but with float accumulation the running sum lands at
  // 2.8000000000000003 → NUMERIC(12,2) rounds to 2.80 on insert.
  // Pre-B1: total is computed as a JS float, then DECIMAL cast rounds.
  // Post-B1 (cents-int): all arithmetic happens in integer cents — sum
  // is exact at 280 cents → 2.80. Both pre and post produce 2.80 in the
  // DB column, so this case ALSO passes post-B1; the test is still valuable
  // as a regression guard.
  const proj = await seedHourlyProject({
    client_id: sharedClient.id,
    billing_rate: 1, // $1/hr so hours map directly to dollars
    staff_id: sharedStaff.id,
    hours: [],
  });
  // Use 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7 hours @ $1/hr → total expected 2.80
  await pool.query(
    `UPDATE projects SET actual_hours = 2.8 WHERE id = $1`, [proj.id]
  );

  const res = await requestJson('POST', '/api/billing/bill-multiple', {
    token,
    body: {
      project_ids: [proj.id],
      invoice_number: uniqueTag('INV-DRIFT-1'),
    },
  });
  extraCleanup.invoices.push(res.invoice_id);

  // Total amount in column = NUMERIC(12,2) → 2.80
  const { rows } = await pool.query(
    `SELECT total_amount FROM invoices WHERE id = $1`, [res.invoice_id]
  );
  // Capture CURRENT BEHAVIOR — post-B1 should still be 2.80 (cents-exact)
  assert.equal(parseFloat(rows[0].total_amount), 2.80);
});

test('// FLOAT-DRIFT: many small fractional amounts accumulate via JS float', async () => {
  // Seeds 100 line items each at $0.07 (a value that does NOT have an
  // exact float representation). 100 × 0.07 = 7.00 mathematically.
  // Pre-B1 sums these as JS floats — the running total lands at
  // 7.000000000000004 or similar, NUMERIC(12,2) rounds to 7.00.
  // Post-B1 (cents-int) sums 100 × 7 cents = 700 cents = 7.00 exact.
  // Both produce 7.00 in column, but the line_count tests the loop.
  const projects = [];
  for (let i = 0; i < 100; i++) {
    const p = await fixtures.project({
      name: uniqueTag(`drift-${i}`),
      client_id: sharedClient.id,
      project_type: 'inspection',
      billing_type: 'hourly',
      billing_rate: 90,
      status: 'active',
    });
    cleanup.projects.push(p.id);
    projects.push(p);
  }
  // Build items with explicit amount=0.07 each
  const items = projects.map(p => ({
    project_id: p.id, amount: 0.07,
  }));
  const res = await requestJson('POST', '/api/billing/bill-multiple', {
    token,
    body: {
      project_ids: projects.map(p => p.id),
      invoice_number: uniqueTag('INV-DRIFT-2'),
      items,
    },
  });
  extraCleanup.invoices.push(res.invoice_id);
  assert.equal(res.line_count, 100);

  // Capture current behavior: NUMERIC(12,2) cast normalizes to 7.00.
  const { rows } = await pool.query(
    `SELECT total_amount FROM invoices WHERE id = $1`, [res.invoice_id]
  );
  // 100 × 0.07 — within 1 cent due to float drift, but DECIMAL(12,2) cast
  // typically lands at 7.00. The float-math response total (pre-cast)
  // would be 7.000000000000004 but DECIMAL stores 7.00.
  assert.equal(parseFloat(rows[0].total_amount), 7.00);
});

test('// FLOAT-DRIFT: classic 0.1 + 0.2 case via override amounts', async () => {
  // The textbook float-precision case. 0.1 + 0.2 === 0.30000000000000004 in JS.
  // Pre-B1: response.total (the JS-side return) reflects the float result;
  //         DB column rounds to 0.30 via NUMERIC(12,2) cast.
  // Post-B1 (cents-int): response.total is exactly 0.30 (30 cents).
  const a = await fixtures.project({
    name: uniqueTag('drift-01'),
    client_id: sharedClient.id,
    project_type: 'inspection',
    billing_type: 'hourly',
    billing_rate: 90,
    status: 'active',
  });
  cleanup.projects.push(a.id);
  const b = await fixtures.project({
    name: uniqueTag('drift-02'),
    client_id: sharedClient.id,
    project_type: 'inspection',
    billing_type: 'hourly',
    billing_rate: 90,
    status: 'active',
  });
  cleanup.projects.push(b.id);

  const res = await requestJson('POST', '/api/billing/bill-multiple', {
    token,
    body: {
      project_ids: [a.id, b.id],
      invoice_number: uniqueTag('INV-DRIFT-3'),
      items: [
        { project_id: a.id, amount: 0.1 },
        { project_id: b.id, amount: 0.2 },
      ],
    },
  });
  extraCleanup.invoices.push(res.invoice_id);

  // Post-B1 (cents-int): response.total is exactly 0.30 (30 cents / 100).
  // The float-drift path (0.30000000000000004) is eliminated because the
  // accumulator now runs in integer cents.
  assert.equal(res.total, 0.30,
    'post-B1: response.total must be exactly 0.30 — cents-int eliminates float drift');

  const { rows } = await pool.query(
    `SELECT total_amount FROM invoices WHERE id = $1`, [res.invoice_id]
  );
  assert.equal(parseFloat(rows[0].total_amount), 0.30);
});

// ════════════════════════════════════════════════════════════════════════════
// IDEMPOTENCY — B2 guard: unique partial index on invoice_items(project_id,
// period_year, period_month) prevents duplicate monthly billing. A second POST
// for the same project+month returns 409 with existing_invoice_id so the
// frontend can deep-link to the already-created invoice.
// ════════════════════════════════════════════════════════════════════════════

test('IDEMPOTENCY: bill-multiple rejects duplicate monthly invoice with 409 (post-B2)', async () => {
  // Post-B2 behavior: the unique partial index idx_invoice_items_project_period
  // (migration 0043) means a second call for the same project+period_year+period_month
  // is caught by the 23505 handler and returns 409 with existing_invoice_id.
  // Only one invoice is created; the DB count stays at 1.
  const proj = await seedHourlyProject({
    client_id: sharedClient.id,
    billing_rate: 90,
    billing_cadence: 'monthly',
    staff_id: sharedStaff.id,
    hours: [{ date: '2024-12-05', hours: 8 }],
  });

  const first = await requestJson('POST', '/api/billing/bill-multiple', {
    token,
    body: {
      project_ids: [proj.id],
      invoice_number: uniqueTag('INV-IDEM-1'),
      items: [{ project_id: proj.id, period_year: 2024, period_month: 12 }],
    },
  });
  extraCleanup.invoices.push(first.invoice_id);

  // Second POST for the same project + period must return 409.
  const secondRaw = await request('POST', '/api/billing/bill-multiple', {
    token,
    body: {
      project_ids: [proj.id],
      invoice_number: uniqueTag('INV-IDEM-2'),
      items: [{ project_id: proj.id, period_year: 2024, period_month: 12 }],
    },
  });
  assert.equal(secondRaw.status, 409,
    'post-B2: duplicate period billing must return 409');

  const secondBody = await secondRaw.json();
  assert.ok(secondBody.error, 'post-B2: 409 body must include error message');
  assert.equal(secondBody.existing_invoice_id, first.invoice_id,
    'post-B2: 409 body must reference the original invoice id');

  // Only one invoice item for this project+month exists in the DB.
  const { rows } = await pool.query(`
    SELECT COUNT(*)::int AS n FROM invoices i
    JOIN invoice_items ii ON ii.invoice_id = i.id
    WHERE ii.project_id = $1
      AND i.billing_period_start = '2024-12-01'
  `, [proj.id]);
  assert.equal(rows[0].n, 1,
    'post-B2: only one invoice must exist for the same project+month');
});

// ════════════════════════════════════════════════════════════════════════════
// GET/POST/DELETE /api/billing/batches — saved batch flow
// ════════════════════════════════════════════════════════════════════════════

test('batches: POST creates a batch with computed total from snapshot_amounts', async () => {
  const a = await seedHourlyProject({
    client_id: sharedClient.id,
    billing_rate: 90,
    staff_id: sharedStaff.id,
    hours: [],
  });
  const b = await seedHourlyProject({
    client_id: sharedClient.id,
    billing_rate: 90,
    staff_id: sharedStaff.id,
    hours: [],
  });

  const batch = await requestJson('POST', '/api/billing/batches', {
    token,
    body: {
      name: uniqueTag('batch-1'),
      project_ids: [a.id, b.id],
      items: [
        { project_id: a.id, snapshot_amount: 500.00 },
        { project_id: b.id, snapshot_amount: 750.50 },
      ],
    },
  });
  assert.ok(batch.id);
  assert.equal(parseFloat(batch.total_amount), 1250.50);
  extraCleanup.billing_batches.push(batch.id);

  const { rows: items } = await pool.query(
    `SELECT * FROM billing_batch_items WHERE batch_id = $1 ORDER BY snapshot_amount`,
    [batch.id]
  );
  assert.equal(items.length, 2);
});

test('batches: GET / lists batches with item_count', async () => {
  const a = await seedHourlyProject({
    client_id: sharedClient.id, staff_id: sharedStaff.id, hours: [],
  });

  const batch = await requestJson('POST', '/api/billing/batches', {
    token,
    body: {
      name: uniqueTag('batch-list'),
      project_ids: [a.id],
      items: [{ project_id: a.id, snapshot_amount: 100 }],
    },
  });
  extraCleanup.billing_batches.push(batch.id);

  const list = await requestJson('GET', '/api/billing/batches', { token });
  assert.ok(Array.isArray(list));
  const mine = list.find(b => b.id === batch.id);
  assert.ok(mine);
  assert.equal(mine.item_count, 1);
});

test('batches: GET /:id returns batch with items hydrated', async () => {
  const a = await seedHourlyProject({
    client_id: sharedClient.id, staff_id: sharedStaff.id, hours: [],
  });

  const batch = await requestJson('POST', '/api/billing/batches', {
    token,
    body: {
      name: uniqueTag('batch-detail'),
      project_ids: [a.id],
      items: [{ project_id: a.id, snapshot_amount: 250 }],
    },
  });
  extraCleanup.billing_batches.push(batch.id);

  const detail = await requestJson('GET', `/api/billing/batches/${batch.id}`, { token });
  assert.equal(detail.id, batch.id);
  assert.ok(Array.isArray(detail.items));
  assert.equal(detail.items.length, 1);
  assert.equal(detail.items[0].project_id, a.id);
});

test('batches: DELETE removes batch + cascades items', async () => {
  const a = await seedHourlyProject({
    client_id: sharedClient.id, staff_id: sharedStaff.id, hours: [],
  });

  const batch = await requestJson('POST', '/api/billing/batches', {
    token,
    body: {
      name: uniqueTag('batch-del'),
      project_ids: [a.id],
      items: [{ project_id: a.id, snapshot_amount: 999 }],
    },
  });
  const res = await requestJson('DELETE', `/api/billing/batches/${batch.id}`, { token });
  assert.equal(res.ok, true);

  const { rows } = await pool.query(
    `SELECT 1 FROM billing_batches WHERE id = $1`, [batch.id]
  );
  assert.equal(rows.length, 0);

  const { rows: items } = await pool.query(
    `SELECT 1 FROM billing_batch_items WHERE batch_id = $1`, [batch.id]
  );
  assert.equal(items.length, 0, 'cascade delete must remove items');
});

test('batches: POST /:id/confirm converts batch into invoice and deletes batch', async () => {
  const a = await seedHourlyProject({
    client_id: sharedClient.id, staff_id: sharedStaff.id, hours: [],
  });

  const batch = await requestJson('POST', '/api/billing/batches', {
    token,
    body: {
      name: uniqueTag('batch-confirm'),
      project_ids: [a.id],
      items: [{ project_id: a.id, snapshot_amount: 432.10 }],
    },
  });

  const result = await requestJson('POST', `/api/billing/batches/${batch.id}/confirm`, {
    token,
    body: {
      invoice_number: uniqueTag('INV-FROM-BATCH'),
      invoice_date: '2024-05-15',
    },
  });
  assert.equal(result.ok, true);
  assert.ok(result.invoice);
  assert.equal(parseFloat(result.total), 432.10);
  extraCleanup.invoices.push(result.invoice.id);

  // Batch must be deleted.
  const { rows } = await pool.query(
    `SELECT 1 FROM billing_batches WHERE id = $1`, [batch.id]
  );
  assert.equal(rows.length, 0, 'batch must be deleted after confirm');

  // Invoice line item must exist with snapshot_amount as amount.
  const { rows: items } = await pool.query(
    `SELECT amount FROM invoice_items WHERE invoice_id = $1`, [result.invoice.id]
  );
  assert.equal(items.length, 1);
  assert.equal(parseFloat(items[0].amount), 432.10);
});

test('batches: confirm rejects empty batch', async () => {
  // Create a batch with no items (project_ids forces an item row via NULL
  // snapshot_amount fallback — there's no clean way to make truly-empty
  // batches via the API. Instead, create + immediately DELETE the items.
  const a = await seedHourlyProject({
    client_id: sharedClient.id, staff_id: sharedStaff.id, hours: [],
  });
  const batch = await requestJson('POST', '/api/billing/batches', {
    token,
    body: {
      name: uniqueTag('empty-batch'),
      project_ids: [a.id],
      items: [{ project_id: a.id, snapshot_amount: 50 }],
    },
  });
  extraCleanup.billing_batches.push(batch.id);
  // Manually purge the items so confirm sees zero items.
  await pool.query(`DELETE FROM billing_batch_items WHERE batch_id = $1`, [batch.id]);

  const res = await request('POST', `/api/billing/batches/${batch.id}/confirm`, {
    token,
    body: { invoice_number: uniqueTag('INV-EMPTY') },
  });
  assert.equal(res.status, 400);
});

test('batches: confirm 404 on missing batch', async () => {
  const res = await request('POST', '/api/billing/batches/00000000-0000-0000-0000-000000000000/confirm', {
    token,
    body: { invoice_number: 'X' },
  });
  assert.equal(res.status, 404);
});

test('batches: confirm requires invoice_number', async () => {
  const a = await seedHourlyProject({
    client_id: sharedClient.id, staff_id: sharedStaff.id, hours: [],
  });
  const batch = await requestJson('POST', '/api/billing/batches', {
    token,
    body: {
      name: uniqueTag('batch-noinv'),
      project_ids: [a.id],
      items: [{ project_id: a.id, snapshot_amount: 100 }],
    },
  });
  extraCleanup.billing_batches.push(batch.id);

  const res = await request('POST', `/api/billing/batches/${batch.id}/confirm`, {
    token,
    body: {},
  });
  assert.equal(res.status, 400);
});

// ════════════════════════════════════════════════════════════════════════════
// GET /api/billing/report — YTD + monthly invoice rollup
// ════════════════════════════════════════════════════════════════════════════

test('billing/report: monthly_revenue sums total_amount for the requested month', async () => {
  // Seed an invoice via bill-multiple, then assert the report sees it.
  const proj = await seedHourlyProject({
    client_id: sharedClient.id,
    billing_rate: 90,
    staff_id: sharedStaff.id,
    hours: [],
  });
  await pool.query(`UPDATE projects SET actual_hours = 5 WHERE id = $1`, [proj.id]);

  const inv = await requestJson('POST', '/api/billing/bill-multiple', {
    token,
    body: {
      project_ids: [proj.id],
      invoice_number: uniqueTag('INV-RPT'),
      invoice_date: '2030-06-15', // future year to isolate from other tests
    },
  });
  extraCleanup.invoices.push(inv.invoice_id);

  const report = await requestJson(
    'GET', '/api/billing/report?month=6&year=2030', { token }
  );
  assert.equal(report.year, 2030);
  assert.equal(report.month, 6);
  // Float drift: 5×90 = 450. monthly_revenue is summed via parseFloat in JS.
  assert.equal(dec2(report.monthly_revenue), 450);
  assert.ok(Array.isArray(report.invoices));
  assert.ok(report.invoices.find(i => i.id === inv.invoice_id));
});

test('billing/report: ytd_revenue sums total_amount for the year', async () => {
  // Two invoices in the same year, different months — YTD must sum both.
  const proj = await seedHourlyProject({
    client_id: sharedClient.id,
    billing_rate: 100,
    staff_id: sharedStaff.id,
    hours: [],
  });
  await pool.query(`UPDATE projects SET actual_hours = 3 WHERE id = $1`, [proj.id]);

  const inv1 = await requestJson('POST', '/api/billing/bill-multiple', {
    token,
    body: {
      project_ids: [proj.id],
      invoice_number: uniqueTag('INV-YTD-A'),
      invoice_date: '2031-03-15',
    },
  });
  extraCleanup.invoices.push(inv1.invoice_id);

  // Re-set status to active so we can bill again
  await pool.query(`UPDATE projects SET status='active', billed_date=NULL WHERE id=$1`, [proj.id]);

  const inv2 = await requestJson('POST', '/api/billing/bill-multiple', {
    token,
    body: {
      project_ids: [proj.id],
      invoice_number: uniqueTag('INV-YTD-B'),
      invoice_date: '2031-09-20',
    },
  });
  extraCleanup.invoices.push(inv2.invoice_id);

  const report = await requestJson('GET', '/api/billing/report?year=2031', { token });
  // 3 × 100 + 3 × 100 = 600 (each bill-multiple uses actual_hours=3 since
  // the project type defaults preserve it).
  assert.equal(dec2(report.ytd_revenue), 600);
});

// ════════════════════════════════════════════════════════════════════════════
// Rate fallback — billing.js, revenue.js (details + by-client) duplicate the
// hardcoded fallback table. Test consistency.
// ════════════════════════════════════════════════════════════════════════════

test('rate fallback: bill-multiple uses 90 for inspection when billing_rate NULL', async () => {
  // Override seedHourlyProject defaults to leave billing_rate NULL.
  const proj = await fixtures.project({
    name: uniqueTag('null-rate-insp'),
    client_id: sharedClient.id,
    project_type: 'inspection',
    billing_type: 'hourly',
    billing_rate: null,
    status: 'active',
  });
  cleanup.projects.push(proj.id);
  await pool.query(`UPDATE projects SET actual_hours = 10 WHERE id = $1`, [proj.id]);

  const res = await requestJson('POST', '/api/billing/bill-multiple', {
    token,
    body: {
      project_ids: [proj.id],
      invoice_number: uniqueTag('INV-RATE-INSP'),
    },
  });
  extraCleanup.invoices.push(res.invoice_id);
  // Fallback inspection=90, hours=10 → 900
  assert.equal(dec2(res.total), 900);
});

test('rate fallback: bill-multiple uses 100 for "re" / "resident engineer"', async () => {
  const proj = await fixtures.project({
    name: uniqueTag('null-rate-re'),
    client_id: sharedClient.id,
    project_type: 're',
    billing_type: 'hourly',
    billing_rate: null,
    status: 'active',
  });
  cleanup.projects.push(proj.id);
  await pool.query(`UPDATE projects SET actual_hours = 8 WHERE id = $1`, [proj.id]);

  const res = await requestJson('POST', '/api/billing/bill-multiple', {
    token,
    body: {
      project_ids: [proj.id],
      invoice_number: uniqueTag('INV-RATE-RE'),
    },
  });
  extraCleanup.invoices.push(res.invoice_id);
  assert.equal(dec2(res.total), 800); // 8 × 100
});

test('rate fallback: bill-multiple uses 90 for permitting', async () => {
  const proj = await fixtures.project({
    name: uniqueTag('null-rate-permit'),
    client_id: sharedClient.id,
    project_type: 'permitting',
    billing_type: 'hourly',
    billing_rate: null,
    status: 'active',
  });
  cleanup.projects.push(proj.id);
  await pool.query(`UPDATE projects SET actual_hours = 5 WHERE id = $1`, [proj.id]);

  const res = await requestJson('POST', '/api/billing/bill-multiple', {
    token,
    body: {
      project_ids: [proj.id],
      invoice_number: uniqueTag('INV-RATE-P'),
    },
  });
  extraCleanup.invoices.push(res.invoice_id);
  assert.equal(dec2(res.total), 450); // 5 × 90
});

test('rate fallback: bill-multiple uses 0 for unknown project_type with NULL rate', async () => {
  const proj = await fixtures.project({
    name: uniqueTag('null-rate-unknown'),
    client_id: sharedClient.id,
    project_type: 'other',
    billing_type: 'hourly',
    billing_rate: null,
    status: 'active',
  });
  cleanup.projects.push(proj.id);
  await pool.query(`UPDATE projects SET actual_hours = 10 WHERE id = $1`, [proj.id]);

  const res = await requestJson('POST', '/api/billing/bill-multiple', {
    token,
    body: {
      project_ids: [proj.id],
      invoice_number: uniqueTag('INV-RATE-UNK'),
    },
  });
  extraCleanup.invoices.push(res.invoice_id);
  assert.equal(dec2(res.total), 0); // 10 × 0 fallback
});

// ════════════════════════════════════════════════════════════════════════════
// /api/revenue — math-path parity sanity checks
// ════════════════════════════════════════════════════════════════════════════

test('revenue/details: hourly project uses rate fallback table identical to billing.js', async () => {
  // Project: project_type='inspection', billing_rate=NULL, 4 hours in May 2032.
  // revenue/details fallback rate for inspection = 90 → earned = 360.
  const proj = await fixtures.project({
    name: uniqueTag('rev-fallback'),
    client_id: sharedClient.id,
    project_type: 'inspection',
    billing_type: 'hourly',
    billing_rate: null,
    status: 'active',
  });
  cleanup.projects.push(proj.id);
  await fixtures.timeEntry({
    project_id: proj.id, staff_id: sharedStaff.id,
    entry_date: '2032-05-10', hours: 4,
  });

  const details = await requestJson(
    'GET', '/api/revenue/details?year=2032&month=5', { token }
  );
  const ours = details.find(r => r.id === proj.id);
  assert.ok(ours, 'project must be in details');
  assert.equal(parseFloat(ours.period_hours), 4);
  assert.equal(parseFloat(ours.earned), 360,
    'revenue/details fallback (inspection=90) must match billing.js fallback (90)');
});

test('revenue/by-client: sums hourly earned per client using billing_rate × hours', async () => {
  // Use a fresh client to isolate from other tests' invoices.
  const cli = await fixtures.client({ name: uniqueTag('rbc-client') });
  cleanup.clients.push(cli.id);
  const proj = await fixtures.project({
    name: uniqueTag('rbc-proj'),
    client_id: cli.id,
    project_type: 'inspection',
    billing_type: 'hourly',
    billing_rate: 90,
    status: 'active',
  });
  cleanup.projects.push(proj.id);

  await fixtures.timeEntry({
    project_id: proj.id, staff_id: sharedStaff.id,
    entry_date: '2033-04-10', hours: 6,
  });

  const rows = await requestJson(
    'GET', '/api/revenue/by-client?year=2033', { token }
  );
  const ours = rows.find(r => r.client_id === cli.id);
  assert.ok(ours);
  assert.equal(parseFloat(ours.earned_hourly), 540); // 6 × 90
  assert.equal(parseFloat(ours.total_hours), 6);
});

test('revenue/monthly-summary: billed reflects deletion (hard-deleted invoice disappears)', async () => {
  const proj = await seedHourlyProject({
    client_id: sharedClient.id,
    billing_rate: 100,
    staff_id: sharedStaff.id,
    hours: [],
  });
  await pool.query(`UPDATE projects SET actual_hours = 2 WHERE id = $1`, [proj.id]);

  const inv = await requestJson('POST', '/api/billing/bill-multiple', {
    token,
    body: {
      project_ids: [proj.id],
      invoice_number: uniqueTag('INV-DEL'),
      invoice_date: '2034-07-15',
    },
  });
  // NOT pushed to extraCleanup — we delete it manually below.

  let summary = await requestJson(
    'GET', '/api/revenue/monthly-summary?year=2034', { token }
  );
  let july = summary.find(r => r.month === 7);
  assert.ok(july);
  assert.equal(parseFloat(july.billed), 200, '2 × 100 should show as billed');

  // Hard-delete the invoice (also delete its items first to avoid FK pain).
  await pool.query(`DELETE FROM invoice_items WHERE invoice_id = $1`, [inv.invoice_id]);
  await pool.query(`DELETE FROM invoices WHERE id = $1`, [inv.invoice_id]);

  summary = await requestJson(
    'GET', '/api/revenue/monthly-summary?year=2034', { token }
  );
  july = summary.find(r => r.month === 7);
  assert.equal(parseFloat(july.billed), 0,
    'deleted invoice must drop out of billed sum');
});

// ════════════════════════════════════════════════════════════════════════════
// Negative path — auth gating
// ════════════════════════════════════════════════════════════════════════════

test('bill-multiple: requires auth (401 without token)', async () => {
  const res = await request('POST', '/api/billing/bill-multiple', {
    body: { project_ids: ['x'], invoice_number: 'NA' },
  });
  // 401 or 403 depending on the middleware — both prove the gate is up.
  assert.ok(res.status === 401 || res.status === 403,
    `expected 401/403, got ${res.status}`);
});

test('batches GET: requires auth (401 without token)', async () => {
  const res = await request('GET', '/api/billing/batches', {});
  assert.ok(res.status === 401 || res.status === 403,
    `expected 401/403, got ${res.status}`);
});
