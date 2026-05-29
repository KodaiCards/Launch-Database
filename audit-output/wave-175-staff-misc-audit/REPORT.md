# Wave 175 Security Audit — staff + concentrators + pricing + project_documents + project_types

**Framing:** adversarial insider — privilege escalation, IDOR, data leakage, compliance gaps.

## HIGH

### H-1 — project_documents.js: NO file content validation on uploads
`routes/project_documents.js:21-36` + `server.js:36-47`. Uses global `upload` multer instance with no fileFilter, no extension allowlist, no MIME check, no magic-byte verification. Any auth'd user (engineer roles) can upload `.php`/`.exe`/webshell. Other upload surfaces all have hardened validation (project_photos.js:119, dwg_two_way_sync.js:28, invoice_templates.js:56). Files land in UPLOAD_DIR with original extension intact.

**Fix:** per-route multer instance with extension allowlist (pdf, dwg, docx, xlsx, jpg, png, zip) + magic-byte verification. Mirror project_photos.js pattern.

### H-2 — project_documents.js: 3 `e.message` leaks at lines 35, 48, 65
`res.status(500).json({error: e.message})` exposes raw PG error text — table names, constraint names, types. Also `/api/_debug/uploads` returns UPLOAD_DIR path even though admin-gated.

**Fix:** static error strings + console.error for server-side logging.

### H-3 — project_documents.js: IDOR on document DELETE (lines 52-66)
`design_manager` with access only to Client A's projects can delete Client B's docs by guessing UUIDs. The role check enforces "can delete docs" but not "can delete THIS doc from THIS project." Symmetric on GET.

**Fix:** JOIN to projects table; verify document's project is accessible to caller before delete/read.

## MEDIUM

### M-1 — pricing.js: Zero audit logging on POST/PUT/DELETE (lines 81-135)
Billing rates drive PSC RUS invoices. design_manager/permitting_manager who changes rates leaves no audit trail. Compare contracts.js:67/108/204 logs every mutation.

**Fix:** logAudit(pool, {req, action, entity_type:'pricing_entry', ...}) on each mutation.

### M-2 — pricing.js: PUT returns 200 with empty body + DELETE returns ok:true on non-existent ID (lines 110-135)
`res.json(undefined)` = misleading success. DELETE always 200 even on 0 rows.

**Fix:** PUT: 404 if !rows[0]. DELETE: RETURNING id + rowCount check.

### M-3 — pricing.js: `notes` overwritten to null on partial PUT if omitted (line 117)
All other fields use COALESCE; notes is direct assign.

**Fix:** `notes = COALESCE($4, notes)`.

### M-4 — staff.js: Zero audit logging on POST/PUT/DELETE (lines 46-163)
Hard-delete in particular leaves no audit. Staff are referenced in time entries/billing.

**Fix:** logAudit on each mutation.

### M-5 — concentrators.js: No required-field validation on contract_label + area_name (lines 30-43)
NOT NULL columns → POST without them returns 500 instead of 400.

**Fix:** App-layer guards with 400 response.

## LOW

### L-1 — logAudit absent (not wrong-signature) in all 5 files — Wave 86 pattern check clean
### L-2 — staff.js SELECT * (line 25) — future PII auto-exposure
### L-3 — pricing.js GET /api/pricing accessible to all auth'd roles (line 40)
### L-4 — pricing.js job_id not UUID-validated before query (line 58-78)
### L-5 — Systemic degraded-open auth fallback in all 5 files

## Verified Clean

- staff PII: schema only has id/name/active/created_at
- staff role escalation: no role field in PUT mass assignment
- SQL injection: all parameterized in all 5 files
- concentrators IDOR: no client_id FK; global lookup
- pricing program enum: normalizeProgram validates
- project_documents path traversal: storage uses UUID prefix; sanitizeFilename
- project_documents uploaded_by sourced from req.user.id (line 28)
- project_types: all endpoints return 410 Gone (no DB writes)
- Wrong-sig logAudit({pool,...}): none in these 5 files

## Aggregate

- project_documents.js: RED (3 HIGH)
- pricing.js: YELLOW (3 MED + 2 LOW)
- staff.js: YELLOW (1 MED + 1 LOW)
- concentrators.js: YELLOW (1 MED)
- project_types.js: GREEN (no findings — all endpoints 410)

**Verdict: 3 HIGH, 5 MED, 5 LOW**
