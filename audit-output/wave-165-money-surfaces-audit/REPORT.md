# Wave 165 — Security Audit: time_entries.js + project_billing.js + invoice_templates.js

**Write-path constraints acknowledged: only `audit-output/wave-165-money-surfaces-audit/REPORT.md` written.**

Audit framing: adversarial, authorization-first, money-touching surfaces.
Files audited:
- `routes/time_entries.js` (lines 1–453)
- `routes/project_billing.js` (lines 1–140)
- `routes/invoice_templates.js` (lines 1–485) + `invoice_template_engine.js` (render/sanitize paths)

---

## FILE 1: routes/time_entries.js

### VERIFIED CLEAN

| # | Check | Result |
|---|---|---|
| SQL injection | All parameterized. No string interpolation in query bodies. | ✓ CLEAN |
| GET auth gate | `requireAuth()` on all GET /api/time-entries (line 22). | ✓ CLEAN |
| POST/PUT auth gates | `requireAuth()` on single POST (118), bulk POST (200), PUT (262). All previously unguarded per Item 7 fix note. | ✓ CLEAN |
| DELETE single auth gate | `requireAuth()` (line 340). | ✓ CLEAN |
| Engineer staff_id coercion POST | Lines 131–141: body staff_id coerced to req.user.staff_id; mismatch rejected 403. | ✓ CLEAN |
| Engineer staff_id coercion bulk POST | Lines 213–220: same per-entry invariant; rolls back on mismatch. | ✓ CLEAN |
| Engineer staff_id coercion PUT | Lines 287–293: same invariant on update path. | ✓ CLEAN |
| Negative hours | snapHoursToQuarter() _helpers.js:214: `if (n <= 0) return 0` — negative clamped to zero. | ✓ CLEAN |
| Hours non-finite guard | snapHoursToQuarter() line 213: `!Number.isFinite(n) return null`. | ✓ CLEAN |
| Pagination limit cap | Lines 91–92: min(rawLimit, 5000), default 1000. | ✓ CLEAN |
| Single-DELETE audit log | Lines 383–392: `auditTimeEntry({action:'deleted', before, after:null})`. | ✓ CLEAN |
| Single-DELETE ownership (engineer) | Lines 351–354: engineer scoped to own user_id. | ✓ CLEAN |
| Single-PUT ownership (engineer) | Lines 273–275: same user_id check. | ✓ CLEAN |
| Error messages | All 500s use hardcoded strings. No raw e.message to client. | ✓ CLEAN |
| pending_project_request_id validation | Lines 148–157: existence + pending-status checked before insert. | ✓ CLEAN |
| Bulk DELETE role gate | Line 412: `requireAuth(['admin', 'design_manager', 'permitting_manager'])` — not bare requireAuth(). | ✓ CLEAN |

---

### FINDINGS

---

**FINDING TE-1 — HIGH: Manager PUT/DELETE (single) has no team-scope ownership check — any authenticated manager can edit/delete any team's time entries.**

Verified by reading: `routes/time_entries.js:262–356`

```js
app.put('/api/time-entries/:id', requireAuth(), async (req, res) => {
  // Ownership check for engineers only:
  if (req.user?.role === 'design_engineer' || req.user?.role === 'permitting_engineer') {
    if (String(before.user_id) !== String(req.user.id)) {
      return res.status(403).json({ error: 'You can only edit your own time entries' });
    }
  }
  // No manager team-scope check follows. design_manager falls through and
  // can update ANY time entry including permitting team entries.
```

Same pattern in DELETE single (lines 351–353). The GET endpoint (line 73–81) correctly scopes managers via `jobs.team` JOIN. The write paths do not. A `design_manager` can `PUT /api/time-entries/<permitting-team-entry-id>` and change hours, dates, project_id, or staff_id for entries outside their team. Since time entries drive billing and payroll this is HIGH.

Fix shape: after the engineer check, add:
```js
if (req.user?.role === 'design_manager' || req.user?.role === 'permitting_manager') {
  const team = req.user.role === 'design_manager' ? 'design' : 'permitting';
  const { rows: check } = await pool.query(
    `SELECT 1 FROM time_entries te
     JOIN projects p ON p.id = te.project_id
     LEFT JOIN jobs j ON j.id = p.job_id
     WHERE te.id = $1 AND (j.team = $2 OR j.team = 'both' OR j.team IS NULL)`,
    [req.params.id, team]
  );
  if (!check[0]) return res.status(403).json({ error: 'Entry not on your team.' });
}
```

---

**FINDING TE-2 — HIGH: `DELETE /api/time-entries/by-staff/:staffId` has no cross-team IDOR check — design_manager can bulk-delete all permitting staff entries.**

Verified by reading: `routes/time_entries.js:412–452`

```js
app.delete('/api/time-entries/by-staff/:staffId',
  requireAuth(['admin', 'design_manager', 'permitting_manager']), async (req, res) => {
  const params = [req.params.staffId];
  let where = 'staff_id = $1';
  // ...date filters only, no team-membership join
  const result = await pool.query(`DELETE FROM time_entries WHERE ${where}`, params);
```

`req.params.staffId` is used directly with no check that the staff member belongs to the requesting manager's team. A `design_manager` can call `DELETE /api/time-entries/by-staff/<permitting-staff-id>` and bulk-erase all entries for a permitting employee. The undo bucket provides a TTL window but the deletion is unscoped.

Fix shape: add a team-membership check before the snapshot query:
```js
if (req.user.role !== 'admin') {
  const team = req.user.role === 'design_manager' ? 'design' : 'permitting';
  // Verify staffId belongs to manager's team via staff.job_id → jobs.team
}
```

---

**FINDING TE-3 — MEDIUM: `DELETE /api/time-entries/by-staff/:staffId` emits zero audit log entries — mass hour deletion leaves no forensic trail.**

Verified by reading: `routes/time_entries.js:412–452` — no `auditTimeEntry` call in the entire handler.

Single-row DELETE (lines 383–392) correctly calls `auditTimeEntry({action:'deleted',...})`. The bulk-delete-by-staff handler snapshots rows for undo (line 426) but writes nothing to `time_entry_audit`. A manager who bulk-deletes hundreds of hours for a staff member leaves no record in the audit table. The undo_bucket expires; the audit trail does not.

Fix shape: after `saveUndoBucket`, loop `auditTimeEntry` over `snapshot.rows` (or insert a single bulk-audit summary row).

---

**FINDING TE-4 — MEDIUM: `POST /api/time-entries/bulk` emits zero audit log entries.**

Verified by reading: `routes/time_entries.js:200–248` — no `auditTimeEntry` call anywhere in this handler.

Single-entry POST (lines 182–188) correctly calls `auditTimeEntry({action:'created',...})`. The bulk path inserts N rows in a transaction and broadcasts SSE but never logs to `time_entry_audit`. CSV-imported hours for government billing have zero forensic trail.

Fix shape: after COMMIT, loop `auditTimeEntry` over `inserted` array, or write one batch-audit row per `importBatch` value.

---

**FINDING TE-5 — LOW: `entry_date` accepts arbitrary date strings with no future-date or far-backdate guard.**

Verified by reading: `routes/time_entries.js:169, 297`

`entry_date` is passed directly to Postgres with no range validation. Engineers can create entries with `entry_date: "2099-01-01"` or `"1900-01-01"`. No business rule is enforced server-side. Future-dated hours could roll into next-month billing silently.

---

**FINDING TE-6 — LOW: Engineer ownership check uses `user_id` match, not `staff_id` match — admin-created entries for an engineer (where `user_id` = admin's id) are uneditable by that engineer.**

Verified by reading: `routes/time_entries.js:273–275, 351–353` and comment lines 46–52.

The code is correctly documented (the comment at line 46–52 explains this). Low severity — it's more restrictive than permissive. Flagged for awareness since it means re-keyed engineers can't edit prior entries created by admin CSV import.

---

## FILE 2: routes/project_billing.js

### VERIFIED CLEAN

| # | Check | Result |
|---|---|---|
| Auth gate on all 3 endpoints | `requireManagerOrAdmin` (lines 20, 33, 49). | ✓ CLEAN |
| SQL injection | All parameterized. | ✓ CLEAN |
| bill-and-clone transaction integrity | Lines 53–130: explicit BEGIN/ROLLBACK/COMMIT wraps all mutations. | ✓ CLEAN |
| billed_amount negative guard | Line 76: `parseFloat(billed_amount) > 0` — zero and negative skip invoice creation. | ✓ CLEAN |
| Project not-found check | Lines 26, 36, 57–60: 404 before mutation. | ✓ CLEAN |
| follow-on inherits cadence + job_id | Lines 103–116: confirmed present. | ✓ CLEAN |

---

### FINDINGS

---

**FINDING PB-1 — HIGH: All three billing endpoints expose raw `e.message` in 500 responses.**

Verified by reading: `routes/project_billing.js:30, 42, 135`

```js
// unbill (line 30)
} catch (e) { res.status(500).json({ error: e.message }); }

// mark-billed (line 42)
} catch (e) { res.status(500).json({ error: e.message }); }

// bill-and-clone (line 135)
res.status(500).json({ error: e.message });
```

A Postgres constraint violation returns messages like `'insert or update on table "invoices" violates foreign key constraint "invoices_client_id_fkey"'` — exposing table names, column names, and constraint identifiers. Same class as GAP-1 (fixed in invoice_templates.js but missed here).

Fix shape: replace all three with hardcoded strings and log `e` via `console.error`:
```js
} catch (e) {
  console.error('[project-billing:unbill]', e);
  res.status(500).json({ error: 'Failed to reverse billing.' });
}
```

---

**FINDING PB-2 — HIGH: No audit log on any billing state change — `unbill`, `mark-billed`, and `bill-and-clone` are completely unlogged.**

Verified by reading: `routes/project_billing.js:1–140` — no INSERT to any audit table, no call to any logAudit/auditLog helper.

These are the highest-value state-change endpoints in the system. They change `projects.status` to 'billed', stamp `billed_date`, create `invoices` rows, create `invoice_items` rows, and clone projects. A manager can mark-bill, unbill, and re-bill with a different amount with zero record. On a government project tracking system this is a serious compliance gap.

Fix shape: use/extend existing `logAudit(pool, {...})` pattern with `entity_type: 'project_billing'`, `action: 'billed'/'unbilled'/'billed_and_cloned'`, before/after snapshots of the project row.

---

**FINDING PB-3 — MEDIUM: No project-level team ownership check on billing mutations — design_manager can mark-billed a permitting team project.**

Verified by reading: `routes/project_billing.js:20, 33, 49, 56`

`requireManagerOrAdmin` is a flat role check (auth.js:406: `requireAuth(['admin', 'design_manager', 'permitting_manager'])`). It does not scope to team. The project is loaded (line 56) and acted on without verifying the requesting manager's team matches the project's `jobs.team`. A `design_manager` can `POST /api/projects/<permitting-project-id>/bill-and-clone` and create an invoice for a project outside their purview.

Fix shape: after loading `orig`, verify `orig.job_id`'s team matches the requesting manager's team (same JOIN pattern as GET /api/time-entries uses at line 75–80).

---

**FINDING PB-4 — LOW: `billed_amount` stored as raw body string without numeric coercion.**

Verified by reading: `routes/project_billing.js:76–90`

```js
if (billed_amount && parseFloat(billed_amount) > 0) {
  // ...billed_amount passed directly as $4 in INSERT
```

`parseFloat > 0` guards against negative/zero but `billed_amount` itself goes to Postgres as a raw string. Postgres NUMERIC will coerce `"12345.67"` but `"12345.67abc"` will throw a type error (caught and currently returns `e.message` per PB-1). Safe pattern: `String(parseFloat(billed_amount).toFixed(2))`.

---

## FILE 3: routes/invoice_templates.js + invoice_template_engine.js

### VERIFIED CLEAN

| # | Check | Result |
|---|---|---|
| Auth on all endpoints | `requireManagerOrAdmin` on all 10+ routes. | ✓ CLEAN |
| SQL injection | All parameterized. No dynamic SQL. | ✓ CLEAN |
| PDF magic-byte check | `_verifyPdfMagic()` reads first 5 bytes for `%PDF-` before trusting upload (lines 72–82, called line 168). | ✓ CLEAN |
| Filename sanitization | Multer storage cb (line 43–46): `replace(/[^A-Za-z0-9._-]/g, '_').slice(0, 200)`. | ✓ CLEAN |
| File size cap | 50 MB (line 54). | ✓ CLEAN |
| GAP-1 e.message leaks — VERIFIED FIXED | All catch blocks use hardcoded error strings. `e.message` only in console.error or `analysis_error` column (capped at 1000 chars, line 109). | ✓ VERIFIED FIXED |
| Path-traversal guard on reference download | Lines 319–323: `path.resolve()` + `path.relative()` vs TEMPLATE_DIR; rejects `..` prefix and absolute paths. | ✓ CLEAN |
| SSRF in Puppeteer | `setRequestInterception(true)` (lines 486–491): aborts all requests except `data:` and `about:blank`. | ✓ CLEAN |
| sanitizeTemplateHtml on Claude output | Line 276: applied before DB storage. | ✓ CLEAN |
| sanitizeTemplateHtml on renderHtmlToPdf | Line 471: applied before Puppeteer receives HTML. | ✓ CLEAN |
| `{{{company_logo}}}` raw path | `_logoImgTag()` is server-side hardcoded from LOGO_PATH file. Not user-supplied. No injection path. | ✓ CLEAN |
| `{{val}}` HTML escaping | `_esc()` at lines 312–319 encodes `&`, `<`, `>`, `"`, `'`. Applied to all double-brace substitutions. | ✓ CLEAN |

---

### FINDINGS

---

**FINDING IT-1 — MEDIUM: `PUT /api/invoice-templates/:id` stores `generated_html` from caller WITHOUT sanitization — stored XSS via preview endpoints.**

Verified by reading: `routes/invoice_templates.js:235–254`

```js
app.put('/api/invoice-templates/:id', requireManagerOrAdmin, async (req, res) => {
  const { name, notes, generated_html } = req.body || {};
  // ...
  `UPDATE invoice_templates SET
    generated_html = COALESCE($4, generated_html), ...`,
  [req.params.id, name || null, notes || null, generated_html || null]
  // No call to sanitizeTemplateHtml before storage.
```

Sanitization runs in exactly two places: (1) `analyzeInvoicePdf()` on Claude's output (line 276) and (2) `renderHtmlToPdf()` before Puppeteer (line 471). The PUT path bypasses both.

Exploit chain: manager calls `PUT /api/invoice-templates/<id>` with `generated_html` containing `<script>...</script>` or `<img onerror="...">`. That HTML is stored unsanitized. `POST /api/invoices/preview-template` (line 388) and `POST /api/invoices/preview-from-projects` (line 452) call `substituteTemplate()` on the stored HTML and return `{ html }` via `res.json()` — neither route calls `sanitizeTemplateHtml` on the outgoing `html`. If the frontend renders this `html` in `innerHTML` or a non-sandboxed iframe, the script executes. The PDF render path is safe but the preview path is not.

Fix shape: sanitize on write in the PUT handler:
```js
const { tplEngine } = require('../invoice_template_engine');
const safeHtml = generated_html ? tplEngine.sanitizeTemplateHtml(generated_html) : null;
// use safeHtml instead of generated_html || null in the query
```
(Or export `sanitizeTemplateHtml` from the engine and call it in the route.)

---

**FINDING IT-2 — LOW: No audit log on template CRUD — an admin replacing a production invoice template leaves no forensic trail.**

Verified by reading: `routes/invoice_templates.js:1–485` — no audit INSERT found.

Template `generated_html` drives what gets billed on government projects. Replacing or deleting a template has no record.

---

**FINDING IT-3 — LOW: `preview-from-projects` resolves template by case-insensitive `job_name` LIMIT 1 — ambiguous job names silently return the wrong template.**

Verified by reading: `routes/invoice_templates.js:432–442`

```js
WHERE LOWER(j.name) = LOWER($1) AND it.client_id = $2
LIMIT 1
```

If two jobs share the same name, the first heap-order match is returned with no warning. Billing accuracy risk for multi-program setups.

---

## Aggregate Summary

| File | HIGH | MED | LOW | VERDICT |
|---|---|---|---|---|
| routes/time_entries.js | 2 | 2 | 2 | YELLOW |
| routes/project_billing.js | 2 | 1 | 1 | YELLOW |
| routes/invoice_templates.js | 0 | 1 | 2 | YELLOW |
| **Total** | **4** | **4** | **5** | |

### Finding Index

| ID | Sev | File | Issue |
|---|---|---|---|
| TE-1 | HIGH | time_entries.js | Manager PUT/DELETE single — no team-scope check; cross-team IDOR on writes |
| TE-2 | HIGH | time_entries.js | Bulk-delete-by-staff — no cross-team staffId validation |
| TE-3 | MED | time_entries.js | Bulk-delete-by-staff — zero audit log |
| TE-4 | MED | time_entries.js | Bulk-insert — zero audit log |
| TE-5 | LOW | time_entries.js | user_id vs staff_id ownership on admin-created entries |
| TE-6 | LOW | time_entries.js | entry_date no future/backdate guard |
| PB-1 | HIGH | project_billing.js | Raw e.message in all 3 billing 500 responses |
| PB-2 | HIGH | project_billing.js | Zero audit log on unbill/mark-billed/bill-and-clone |
| PB-3 | MED | project_billing.js | No project team ownership check on billing mutations |
| PB-4 | LOW | project_billing.js | billed_amount stored as raw string without coercion |
| IT-1 | MED | invoice_templates.js | PUT stores unsanitized HTML — stored XSS via preview path |
| IT-2 | LOW | invoice_templates.js | No audit log on template CRUD |
| IT-3 | LOW | invoice_templates.js | preview-from-projects job_name LIMIT 1 ambiguity |

### Prior fix verified

**GAP-1 (CLAUDE.md) — 4 Puppeteer/Claude e.message leaks in invoice_templates.js: CONFIRMED FIXED.** Every HTTP response uses hardcoded error strings. `e.message` appears only in `console.error` calls (lines 102, 132, 228, 252, 283, 302) or `analysis_error` DB column (line 109, capped at 1000 chars). The SSRF+interception fix is confirmed live (lines 468–491).

### Coverage gaps

- `_helpers.js` (updateProjectHours, saveUndoBucket) — called from time_entries.js; spot-checked parameterization, not fully audited.
- `invoice_generator.js` (buildInvoiceData, buildInvoiceDataFromProjects) — data-fetching path; query parameterization spot-checked, not line-by-line.
- Concurrent recompute on same project — `updateProjectHours` called after each mutation; no row-level lock on `actual_hours`. Likely acceptable frequency, not flagged.
- Approval workflow — no submitter-approves-own pattern found in these files; `pending_project_request_id` validation (lines 148–157) requires `status='pending'` correctly.

=== WAVE 165 REPORT END ===
