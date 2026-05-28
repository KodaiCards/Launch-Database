# Wave 102 — Billing/Revenue Security + Correctness Audit

**Scope:** `routes/invoices.js`, `routes/billing.js`, `routes/revenue.js`, `routes/hours_csv.js`  
**Supporting reads:** `invoice_generator.js`, `routes/_audit.js`, `schema.sql`  
**Date:** 2026-05-28  
**Verdict:** RED — 2 HIGH findings, 4 MEDIUM findings, 3 LOW findings

---

## Findings

---

### H-1 — Invoice DELETE missing transaction wrap
**Severity:** HIGH  
**File:** `routes/invoices.js:189-225`  
**Category:** Transaction integrity

**Snippet:**
```js
// lines 196-220 — sequential bare pool.query() calls, no BEGIN/COMMIT
const { rows: items } = await pool.query(
  'SELECT project_id FROM invoice_items WHERE invoice_id=$1', [req.params.id]
);
for (const pid of projectIds) {
  await pool.query(
    `UPDATE projects SET status='completed', billed_date=NULL WHERE id=$1 AND status='billed'`,
    [pid]
  );
}
if (wipe_hours === 'true') {
  for (const pid of projectIds) {
    await pool.query('DELETE FROM time_entries WHERE project_id=$1', [pid]);
    await updateProjectHours(pid);
  }
}
await pool.query('DELETE FROM invoices WHERE id=$1', [req.params.id]);
```

**Attack path:** Server process crashes (OOM, Railway restart, SIGKILL) after projects are un-billed (`status='completed'`) but before the `DELETE FROM invoices` line executes. Invoice row still exists, but linked projects now have `status='completed'` and `billed_date=NULL`. The invoice is effectively orphaned — it cannot be re-voided (projects are no longer `'billed'`) and is still visible in the invoice list. If `wipe_hours=true` was in play, time entries are partially deleted before the invoice is gone, creating a billing gap with no audit record.

**Fix shape:** Wrap the entire delete handler in a `pool.connect()` + `BEGIN/COMMIT/ROLLBACK` transaction block. Acquire a client, issue BEGIN, run all mutations, COMMIT, release client in finally. Pattern already used in `billing.js` `bill-multiple` route.

```js
const client = await pool.connect();
try {
  await client.query('BEGIN');
  // ... all mutations using client.query() instead of pool.query()
  await client.query('COMMIT');
} catch (e) {
  await client.query('ROLLBACK');
  throw e;
} finally {
  client.release();
}
```

---

### H-2 — billing.js has zero audit trail for invoice creation
**Severity:** HIGH  
**File:** `routes/billing.js:1-524` (entire file)  
**Category:** Audit trail completeness

**Snippet:**
```js
// Top of billing.js — no _audit import
const { broadcast } = require('./_sse');
// That's it. No: const { logAudit } = require('./_audit');
```

**Verification:** `grep -c "logAudit" routes/billing.js` returns `0`. The file has no audit instrumentation whatsoever.

**Affected operations (all unlogged):**
- `POST /api/billing/bill-multiple` — creates invoices + invoice_items rows, sets projects to `'billed'`, records `billed_date`
- `POST /api/billing/batches` — creates a billing_batch row
- `DELETE /api/billing/batches/:id` — deletes a batch
- `POST /api/billing/batches/:id/confirm` — creates an invoice from a batch (government-project billing)

**Attack path / compliance gap:** Government project billing (RUS program) happens through `bill-multiple` and `batch confirm`. An admin or manager can create, void, or modify government invoices with zero audit record. No actor_id, no before/after snapshot, no IP, no timestamp. If a billing dispute arises, there is no way to determine who billed which projects, when, or what amount was submitted.

Per the project's own audit design (`routes/_audit.js` header): "Imported wherever state changes." Billing is the highest-value state change surface in the application.

**Fix shape:** Add `const { logAudit } = require('./_audit');` at top of billing.js. Add `logAudit` calls after each successful invoice creation:
- After `bill-multiple` COMMIT (entity_type `'invoice'`, action `'create'`, after = `{ invoice_id, total, project_ids, billed_by }`)
- After `batch confirm` COMMIT (entity_type `'invoice'`, action `'create'`, meta includes batch_id)
- After batch DELETE (entity_type `'billing_batch'`, action `'delete'`, before = snapshot of batch row)

---

### M-1 — Negative invoice amounts accepted
**Severity:** MEDIUM  
**File:** `routes/billing.js:103-110`  
**Category:** Negative value validation

**Snippet:**
```js
// line 103-110 in bill-multiple override accumulation
const overrideAmt = override.amount != null
  ? parseFloat(override.amount)   // ← no >= 0 guard
  : null;
if (overrideAmt != null && !isNaN(overrideAmt)) {
  cents += Math.round(overrideAmt * 100);  // negative cents added
  hasManual = true;
}
```

**Attack path:** A manager with billing rights can submit `{"project_ids": [...], "overrides": [{"project_id": "...", "amount": -5000}]}`. The negative `overrideAmt` is added to the running `cents` accumulator. If enough overrides are negative, `totalAmount = cents / 100` becomes a negative number. This creates an invoice with a negative `amount` field. The unique partial index prevents billing the same project twice, but does not prevent negative amounts. A sufficiently negative billing entry could misrepresent revenue figures in `/api/revenue/*` endpoints.

**Fix shape:**
```js
const overrideAmt = override.amount != null ? parseFloat(override.amount) : null;
if (overrideAmt != null && !isNaN(overrideAmt)) {
  if (overrideAmt < 0) {
    return res.status(400).json({ error: 'Override amount cannot be negative' });
  }
  cents += Math.round(overrideAmt * 100);
  hasManual = true;
}
```

---

### M-2 — CSV 'modify' rows INSERT duplicate time_entries instead of UPDATE
**Severity:** MEDIUM  
**File:** `routes/hours_csv.js:1076-1108`  
**Category:** Calculation correctness / idempotency

**Snippet:**
```js
// csv-commit handler, line 1076-1082
for (const row of staged.rows) {
  if (row.csv_classification === 'duplicate') {
    skipped++;
    continue;
  }
  // 'modify' and 'conflict' rows FALL THROUGH to INSERT below
  const { rows: inserted } = await pool.query(
    `INSERT INTO time_entries (project_id, user_id, hours, work_date, ...)
     VALUES ($1,$2,$3,$4,...) RETURNING *`,
    [...]
  );
```

**Attack path:** When the CSV validator classifies a row as `'modify'` (an existing time entry that needs correction), the commit handler skips only `'duplicate'` rows. `'modify'` rows are passed to the INSERT statement, creating a *second* time_entry for the same project+user+date combination rather than updating the existing one. The result is double-counted hours for that period — revenue calculations using `SUM(hours)` for that project will be inflated.

Example: employee worked 8h on 2026-05-01 (already entered). CSV re-import with corrected 7.5h creates a second row for 7.5h. Both rows exist. Project now shows 15.5h billed instead of 7.5h.

**Fix shape:** For `'modify'` rows, the commit handler should UPDATE the existing time_entry identified during validation rather than INSERT. The staging row should carry the `existing_entry_id` from the validation phase so the commit can do:
```js
if (row.csv_classification === 'modify') {
  await pool.query(
    `UPDATE time_entries SET hours=$1, work_date=$2, notes=$3 WHERE id=$4`,
    [hours, work_date, notes, row.existing_entry_id]
  );
  modified++;
  continue;
}
```

---

### M-3 — Raw PostgreSQL error messages exposed to client
**Severity:** MEDIUM  
**File:** `routes/revenue.js:82,171,232,283,393,537` and `routes/invoices.js:45,225`  
**Category:** Information leakage

**Snippet:**
```js
// revenue.js — repeated pattern in all 6 catch blocks
} catch (e) { res.status(500).json({ error: e.message }); }

// invoices.js:45
} catch (e) { res.status(500).json({ error: e.message }); }
// invoices.js:225
} catch (e) { res.status(500).json({ error: e.message }); }
```

**Attack path:** PostgreSQL error messages include table names, column names, constraint names, data type information, and sometimes partial query text. A user who can trigger a 500 error (malformed date, invalid UUID, constraint violation) receives a message like `relation "invoice_items" does not exist`, `column "billed_date" of relation "projects" does not exist`, or `ERROR: invalid input syntax for type uuid: "abc123"`. This reveals the internal schema structure to any authenticated manager — useful for crafting SQL injection probes if any injection surface were found elsewhere.

**Fix shape:** Wrap all catch blocks with sanitized error responses. Log the real error server-side:
```js
} catch (e) {
  console.error('[revenue:monthly-summary]', e && e.message);
  res.status(500).json({ error: 'Internal error.' });
}
```

---

### M-4 — Billing batch ownership not verified on DELETE and confirm
**Severity:** MEDIUM  
**File:** `routes/billing.js:372-477`  
**Category:** Authorization / cross-project leakage

**Snippet:**
```js
// DELETE /api/billing/batches/:id — line 372
app.delete('/api/billing/batches/:id', requireManagerOrAdmin, async (req, res) => {
  const { rows } = await pool.query(
    'SELECT * FROM billing_batches WHERE id=$1', [req.params.id]  // no user filter
  );
  // ...deletes batch if found, no ownership check
});

// POST /api/billing/batches/:id/confirm — line 430
app.post('/api/billing/batches/:id/confirm', requireManagerOrAdmin, async (req, res) => {
  const { rows } = await pool.query(
    'SELECT * FROM billing_batches WHERE id=$1', [req.params.id]  // no user filter
  );
  // ...confirms into invoice, no ownership check
});
```

**Attack path:** Any manager can delete or confirm any other manager's pending billing batch. Scenario: Design Manager A prepares a billing batch for their projects. Permitting Manager B (also `requireManagerOrAdmin`) hits `DELETE /api/billing/batches/{A's batch id}` or `POST .../confirm`. B can destroy A's work or finalize invoices B didn't prepare — potentially billing wrong amounts for projects B isn't responsible for.

**Fix shape:** Add ownership check:
```js
const { rows } = await pool.query(
  'SELECT * FROM billing_batches WHERE id=$1 AND (created_by_user_id=$2 OR $3)',
  [req.params.id, req.user.id, req.user.role === 'admin']
);
```
Or alternatively, admin can act on any batch; managers only on their own.

---

### L-1 — Temp upload file not cleaned on XLSX parse error
**Severity:** LOW  
**File:** `routes/hours_csv.js:263-281`  
**Category:** Resource leak

**Snippet:**
```js
// line 263-281 — parse happens inside withUploadSlot(); unlink is after
await withUploadSlot(async () => {
  workbook = XLSX.readFile(req.file.path);  // ← if this throws, falls out of slot
  // ...processing...
});
// unlink only reached on successful parse:
fs.unlink(req.file.path, () => {});
```

**Attack path:** If the uploaded file has a corrupt XLSX structure that `XLSX.readFile` cannot parse, an exception is thrown inside `withUploadSlot`. The exception propagates out. The `fs.unlink` on line 281 is never reached because it is outside the try/catch and after the `withUploadSlot` await. The temp file persists in the OS temp directory until the system cleans it. On high-volume import usage, failed uploads accumulate disk space.

**Fix shape:**
```js
try {
  await withUploadSlot(async () => { ... });
} finally {
  if (req.file && req.file.path) {
    fs.unlink(req.file.path, () => {});
  }
}
```

---

### L-2 — CSV injection in raw_row storage
**Severity:** LOW  
**File:** `routes/hours_csv.js:1178-1182`  
**Category:** CSV injection

**Snippet:**
```js
// csv-queue-unmatched, stores raw cell values directly
await pool.query(
  `INSERT INTO csv_review_queue (staged_id, raw_row, ...) VALUES ($1,$2,...)`,
  [staged_id, JSON.stringify(row.rawObj), ...]  // rawObj contains raw cell strings
);
```

**Attack path:** If a cell in the uploaded CSV begins with `=`, `+`, `-`, or `@` (e.g., `=HYPERLINK("http://attacker.com","click")`), it is stored verbatim in `csv_review_queue.raw_row` as JSON. If an admin later exports the review queue data to CSV/XLSX (via the billing report or a future export endpoint), that formula cell would execute in Excel/LibreOffice when opened. Current risk is LOW because no export endpoint exists today, but the data is stored in a way that makes future export dangerous by default.

**Fix shape:** Strip leading formula characters when storing in `raw_row`:
```js
const sanitizeCell = (v) => {
  if (typeof v === 'string' && /^[=+\-@]/.test(v)) return "'" + v;
  return v;
};
const safeRawObj = Object.fromEntries(
  Object.entries(row.rawObj).map(([k, v]) => [k, sanitizeCell(v)])
);
```

---

### L-3 — month_year component bypasses filename sanitization
**Severity:** LOW  
**File:** `invoice_generator.js:955-966`  
**Category:** Header injection / filename safety

**Snippet:**
```js
// suggestedFilename() — clean() applied to most fields but not month_year
const clean = (s) => String(s || '').replace(/[\\/:*?"<>|]/g, '').trim();
// ...
const monthPart = m.month_year;           // ← raw, not passed through clean()
return `${clean(clientName)}_${clean(jobName)}_${monthPart}.pdf`;
// → Content-Disposition: inline; filename="Client_Job_2026-05.pdf"
```

**Attack path:** `monthYearLabel(period_start)` formats `period_start` as `"YYYY-MM"`. Since `period_start` comes from user request body (`req.body.period_start`) and is passed through to `buildInvoiceData()` as a date string, crafting `period_start = "2026-05\r\nContent-Type: text/html"` would inject a second header line into the HTTP response if the value were not validated. In practice the date is validated by PostgreSQL (query fails on non-date input) making this VERY LOW exploitability — but the filename is assembled without the same sanitization applied to client/job names, creating an inconsistency.

**Fix shape:** Pass `monthPart` through `clean()`:
```js
const monthPart = clean(m.month_year);
```

---

## Verified Clean

| Item | Verified | Notes |
|---|---|---|
| Currency stored as NUMERIC not FLOAT | CLEAN | All money columns in schema.sql are `numeric(14,2)`, `numeric(12,2)`, `numeric(10,2)` — no `float`, `real`, or `double precision` for any money field |
| Integer-cents accumulation in billing | CLEAN | `bill-multiple` and `batch-save` use `cents += Math.round(x * 100)` accumulator; divide at end |
| `bill-multiple` transaction integrity | CLEAN | Uses `pool.connect()` + BEGIN/COMMIT/ROLLBACK — fully transactional |
| `batch-save` transaction integrity | CLEAN | Same transaction pattern as bill-multiple |
| `batch-confirm` transaction integrity | CLEAN | Wrapped in BEGIN/COMMIT/ROLLBACK |
| PDF generation SSRF risk | CLEAN | `renderInvoicePdf` uses `PDFKit` (streaming Node.js library), not Puppeteer or any browser. No outbound HTTP requests, no file:// loading — zero SSRF surface |
| Authorization gates | CLEAN | All billing routes behind `requireManagerOrAdmin`; `wipe_hours=true` additionally inline-guarded to `role === 'admin'`; all hours_csv routes behind `requireAdmin` |
| RUS-only invoice gate | CLEAN | `invoice_generator.js` throws if `ec.program !== 'rus'`; returns 400 from route |
| Duplicate billing prevention | CLEAN | Unique partial index `idx_invoice_items_project_period` catches duplicate project+period combinations; caught as 409 in `bill-multiple` |
| PDF generate idempotency | CLEAN | `generate-pdf` and `generate-pdf-from-projects` are read-only relative to the invoices table; no invoice rows created on generate. Running twice produces same PDF — idempotent |
| Revenue endpoints read-only | CLEAN | All `/api/revenue/*` routes are SELECT-only; no state mutations; no audit logging needed |
| Revenue rate math | CLEAN | `CASE WHEN billing_type='hourly' THEN hours*billing_rate ELSE 0 END` — properly gates rate application |
| Hours validation (zero/negative/excessive) | CLEAN | `isNaN(hrs) || hrs <= 0` rejects zero/negative; `hrs > 24` rejects excessive |
| `FOR UPDATE` lock on review queue match | CLEAN | `csv-review-queue/:id/match` uses `SELECT ... FOR UPDATE` before update — race condition handled |
| `snapHoursToQuarter()` at INSERT | CLEAN | Applied consistently before time_entry INSERT in csv-commit |
| Recursive CTE depth cap | CLEAN | `project_tree` CTE in revenue routes uses `depth < 10` guard |
| Cross-project leakage in invoice joins | CLEAN | `invoice_items` → `projects` → `clients` chain uses proper FK joins; no cross-client leakage possible through billing rollups |
| `invoices.js` generate-pdf audit call | CLEAN | `logAudit` called at line 77-78 (generate-pdf) and 145-146 (generate-pdf-from-projects) and 222-223 (void) |
| Content-Disposition quote injection (client/job parts) | CLEAN | `clean()` strips `"` characters from client and job name components |

---

## Coverage Gaps

1. **`billing.js` batch-save (POST /api/billing/batches) audit trail** — saving a batch draft is not audited. If a manager creates a batch, deletes it, and creates another, the version history is unrecoverable.

2. **GET /api/billing/report authorization** — the billing report endpoint at line 484 is behind `requireManagerOrAdmin` but returns revenue figures across ALL projects with no scope filter. A design manager could view permitting project billing figures. Not examined for data-scope enforcement beyond role check.

3. **`billing_batch.status` state machine** — no explicit validation that a batch in `'confirmed'` status cannot be re-confirmed. If the confirm handler runs twice (network retry), it may create two invoices from the same batch. The batch `status` is set to `'confirmed'` inside the transaction but there is no `WHERE status='pending'` guard on the SELECT — concurrent confirm calls from same client could both read `'pending'` before either sets `'confirmed'`.

4. **`hours_csv.js` concurrency semaphore scope** — `withUploadSlot()` guards against concurrent file parsing but does not prevent concurrent `csv-commit` calls from the same staged session. Two concurrent commits of the same staged data would double-insert all rows.

---

## Verdict

**RED** — Two HIGH findings block production confidence:

- **H-1** (missing transaction on invoice DELETE) is a data-integrity timebomb: any server restart during void leaves orphaned invoices with inconsistent project state. Easy to fix.
- **H-2** (zero audit trail in billing.js) is a compliance failure for government-program billing. The application's own audit design doc says "Imported wherever state changes." The most consequential state changes in the application have no log. Critical for RUS billing disputes.

Fix H-1 and H-2 before next billing cycle. M-1 (negative amounts) and M-2 (modify-row duplicates) are also correctness bugs that affect financial data accuracy and should be addressed in the same wave.

=== WAVE 102 AUDIT END ===
