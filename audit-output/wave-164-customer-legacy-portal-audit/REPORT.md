# Wave 164 — Security Audit: routes/customer_portal.js + routes/client_portal.js (legacy)
**Framing:** adversarial / auth-model / PII / cross-tenant
**Date:** 2026-05-29

---

## Mount Status (CRITICAL baseline)

| File | Mounted in server.js | Line | Notes |
|---|---|---|---|
| `routes/customer_portal.js` | **YES — LIVE** | 781 | External customer-role users + admin link-mgmt |
| `routes/client_portal.js` (legacy) | **YES — LIVE** | 817 | Wave 13 legacy; comment says "stays operational until E6 retires it" |
| `routes/client_portal_v2.js` (new) | **YES — LIVE** | 824 | Both legacy and v2 simultaneously active |

Both audit targets are live in production. They expose distinct URL namespaces so there is no route collision, but both legacy surfaces lack hardening applied to v2.

---

## FILE 1: routes/client_portal.js (legacy Wave 13)

### Purpose
Beta client-facing project status view (Wave 13). Routes:
- GET /api/client-portal/projects
- GET /api/client-portal/clients-with-active-projects

### Auth Model
requireAuth() — no role restriction. Any authenticated user (admin, employee, manager, designer, permitting) can call these endpoints. Customer-role users are blocked from /api/client-portal/* by the global scope guard at server.js:193-202.

Parity gap vs v2: v2 uses requireClientAuth (custom token-based middleware) for client-facing endpoints and requireAuth(['admin']) for admin endpoints. Legacy uses requireAuth() (any employee role) for all endpoints with no admin gate.

---

### Findings — client_portal.js

#### F1 — MEDIUM: Financial data returned to non-admin employee roles
Verified by reading: routes/client_portal.js:61-96

  SELECT
    p.id,
    p.name,
    p.expected_revenue,     -- returned to all authenticated employees
    p.actual_hours,
    p.expected_hours,
    ...

Attack path: A permitting_manager or designer with a valid lfs_session cookie can call GET /api/client-portal/projects and receive expected_revenue, actual_hours, expected_hours for all non-rolled-up projects. The portal tile is restricted to admin (canAccess: u => u.role === 'admin' at server.js:287), but the API endpoint is directly callable without the UI.

v2 comparison: GET /api/client/projects in v2 returns: id, name, service_area_name, program, status, created_at — no financial figures.

Fix shape: Add requireManagerOrAdmin or requireAdmin gate on both endpoints, or strip financial columns from response.

---

#### F2 — MEDIUM: No UUID format guard on ?client_id query param
Verified by reading: routes/client_portal.js:52-55 — no UUID_RE/isValidUUID calls

  } else if (req.query.client_id) {
    clientFilter = `AND p.client_id = $${i++}`;
    params.push(req.query.client_id);
  }

A non-UUID client_id query param causes Postgres to throw "invalid input syntax for type uuid" -> HTTP 500. The error text is not leaked (logged only), but 500 is semantically wrong.

v2 comparison: v2 has UUID_RE at line 21 and calls isValidUUID() before SQL queries.

Fix shape: Validate req.query.client_id with UUID_RE, return 400 if invalid.

---

#### F3 — LOW: No audit logging on any endpoint
Verified by reading: routes/client_portal.js:1-142 — no logAudit import or calls.

v2 comparison: v2 calls logAudit for login, logout, token generation, token revoke, document upload, approvals.

Fix shape: Low priority for read-only GETs. Could add access log on bulk-data endpoints if anomaly detection is desired.

---

### VERIFIED CLEAN — client_portal.js

| Check | Result |
|---|---|
| SQL injection | CLEAN — all query params parameterized ($1, $2). clientFilter string is built from trusted constants only. |
| IDOR | CLEAN — no per-record :id params. Customer scoping in resolveClientIds correct. Admin sees all (intended). |
| Cross-tenant leakage | CLEAN — customers blocked by scope guard; admin all-data access is intentional. |
| Token replay | CLEAN — requireAuth() -> authMiddleware checks tokens_invalid_after vs iat (auth.js:366-370). |
| File upload | CLEAN — no uploads in this file. |
| Error message leakage | CLEAN — e.message to console.error only; client gets "Failed to load projects." |
| Differential errors | CLEAN — no per-record differentiation; empty arrays returned. |

---

## FILE 2: routes/customer_portal.js

### Purpose
External customer-role read-only API + admin customer-client link management. Customer users see projects and invoices scoped to their linked clients only.

Customer endpoints use requireAuth(['customer']) — blocks all non-customer roles.
Admin endpoints use requireAdmin — correct.

---

### Findings — customer_portal.js

#### F4 — HIGH: expected_revenue exposed to customers — contradicts stated design intent
Verified by reading: routes/customer_portal.js:25 (comment) vs lines 88-89, 156

Comment at top of file (line 25):
  // Customers see PROGRESS-shaped data, not internal billing math:
  // Money values (rates, expected revenue, billing amounts) are surfaced
  // only on invoices that are EXPLICITLY billed to them.

Actual code in GET /api/customer/projects (line 88-89):
  p.expected_revenue,  -- returned to customer in list AND detail

Actual code in GET /api/customer/projects/:id (line 156):
  p.actual_hours, p.expected_hours, p.expected_revenue,  -- returned to customer

expected_revenue is the internal billing estimate for a project. A customer can learn Launch Fiber Services' internal revenue target for their project — commercially sensitive information.

Fix shape: Remove p.expected_revenue from both project list and project detail queries.

---

#### F5 — HIGH: Draft invoices visible to customers — no status filter
Verified by reading: routes/customer_portal.js:200-208

  SELECT i.id, i.invoice_number, i.invoice_date, i.invoice_name,
         i.total_amount, i.client_id, cl.name AS client_name,
         i.created_at
    FROM invoices i
   WHERE i.client_id = ANY($1::uuid[])
   -- NO status filter

Invoice status values in use: 'draft' (billing.js:515) and 'sent' (billing.js:172). Draft invoices are internal work-in-progress. Customers seeing drafts can raise premature billing disputes or observe internal revision workflows. Same issue on GET /api/customer/invoices/:id at line 220-239.

Fix shape: Add AND i.status NOT IN ('draft') to both invoice queries (or AND i.status = 'sent').

---

#### F6 — MEDIUM: p.notes returned to customers — internal staff notes exposed
Verified by reading: routes/customer_portal.js:157

  SELECT p.id, p.name, p.work_order_number, p.status, p.project_type,
         p.start_date, p.completed_date, p.billed_date,
         p.actual_hours, p.expected_hours, p.expected_revenue,
         p.footage, p.notes,  -- INTERNAL STAFF FIELD

projects.notes is a free-text internal field that may contain relationship notes, billing disputes, scheduling concerns, or other staff-to-staff communication. The customer-facing project detail endpoint returns this field.

v2 comparison: GET /api/client/projects/:id in v2 does NOT return notes.

Fix shape: Remove p.notes from the customer project detail query.

---

#### F7 — MEDIUM: i.* wildcard in invoice detail — implicit future-column expansion
Verified by reading: routes/customer_portal.js:221

  SELECT i.*, cl.name AS client_name, ...

i.* returns every column on the invoices table. The invoice_name column is referenced in code (line 201) but absent from schema.sql — there is already at least one untracked column. As new columns are added (e.g., internal_notes, pdf_path, processing_status), they will automatically be returned to customers.

v2 comparison: All v2 queries use explicit column lists.

Fix shape: Replace i.* with explicit column list.

---

#### F8 — MEDIUM: No UUID format guard on :id params — 500 instead of 400
Verified by reading: routes/customer_portal.js — no UUID_RE / isValidUUID calls anywhere

Affected endpoints:
- GET /api/customer/projects/:id — req.params.id at line 163
- GET /api/customer/invoices/:id — req.params.id at line 237
- GET /api/customer-clients/:user_id — req.params.user_id at line 342
- DELETE /api/customer-clients/:user_id/:client_id — both params at line 379

Non-UUID string in any position causes Postgres 22P02 error -> HTTP 500. Error text NOT leaked to client (opaque message returned). Not an information disclosure issue but semantically incorrect (400 is right).

v2 comparison: v2 validates UUID before SQL and returns 400 with "invalid project id".

Fix shape: Add UUID_RE guard at top, validate all :id/:user_id/:client_id params.

---

#### F9 — MEDIUM: Admin POST /api/customer-clients and DELETE not audit-logged
Verified by reading: routes/customer_portal.js:350-387

  app.post('/api/customer-clients', requireAdmin, async (req, res) => {
    // ...
    await pool.query(`INSERT INTO customer_clients ...`);
    res.json({ ok: true });
    // NO logAudit call
  });

  app.delete('/api/customer-clients/:user_id/:client_id', requireAdmin, ...
    await pool.query(`DELETE FROM customer_clients ...`);
    res.json({ ok: true });
    // NO logAudit call
  });

These are authorization-control mutations — they grant or revoke a customer's access to view client projects and invoices. A compromised admin account modifying these links leaves no audit trail.

v2 comparison: v2 calls logAudit for all token creation/revocation operations.

Fix shape: Add logAudit call to both POST and DELETE customer-clients endpoints.

---

#### F10 — LOW: DELETE always returns ok:true regardless of rowCount
Verified by reading: routes/customer_portal.js:375-385

  await pool.query(`DELETE FROM customer_clients WHERE user_id = $1 AND client_id = $2`, ...);
  res.json({ ok: true });  // always 200 even if 0 rows deleted

Admin UI cannot detect when a DELETE was a no-op (link never existed). Masks data state inconsistencies.

Fix shape: Check rowCount > 0, return 404 if nothing was deleted.

---

#### F11 — LOW: invoice_items.rate exposed in invoice detail — unit billing rate visible
Verified by reading: routes/customer_portal.js:228

  json_build_object(
    'id', ii.id,
    'description', ii.description,
    'quantity', ii.quantity,
    'unit', ii.unit,
    'rate', ii.rate,   -- internal $/hr or $/ft rate
    'amount', ii.amount,
    ...
  )

Module comment says rates are only on explicitly-billed invoices, implying customers are supposed to see invoice details. However rate exposes the unit billing rate structure, which may be commercially sensitive. If intentional, should be documented. If not, remove 'rate', ii.rate.

NOT a cross-tenant issue — customers are viewing their own invoices.

---

### VERIFIED CLEAN — customer_portal.js

| Check | Result |
|---|---|
| SQL injection | CLEAN — all queries parameterized ($1, $2). No dynamic SQL construction. |
| IDOR (customer projects) | CLEAN — WHERE p.id = $1 AND p.client_id = ANY($2::uuid[]) at line 162. Client ID list derived from authenticated user's own customer_clients rows. |
| IDOR (customer invoices) | CLEAN — WHERE i.id = $1 AND i.client_id = ANY($2::uuid[]) at line 237. Same pattern. |
| Cross-tenant leakage | CLEAN — clientIdsForUser always queries customer_clients WHERE user_id = $1 using authenticated user's JWT ID. No way to pass another user's ID. |
| Token replay | CLEAN — requireAuth(['customer']) uses authMiddleware which checks tokens_invalid_after vs JWT iat. Revoked sessions denied. |
| File upload | CLEAN — no file uploads in customer_portal.js. |
| Error message leakage | CLEAN — e.message to console.error only; opaque client messages throughout. |
| Differential errors | CLEAN — all not-found paths return identical 404 {"error":"Not found"}. |
| Role gate — customer endpoints | CLEAN — requireAuth(['customer']) correctly blocks admin/employee. |
| Role gate — admin endpoints | CLEAN — requireAdmin on all admin write endpoints. |
| POST customer-clients role check | CLEAN — verifies target user has role='customer' before inserting (lines 357-361). |
| admin/client-progress unscoped read | CLEAN — all-client data appropriately gated behind requireAdmin. |
| weekly hours time_entries sub-query | CLEAN — uses p.id derived from authorization-verified project row. Correctly scoped. |

---

## Summary Table

| # | Severity | File | Description |
|---|---|---|---|
| F4 | HIGH | customer_portal.js | expected_revenue returned to customers — contradicts stated design intent |
| F5 | HIGH | customer_portal.js | Draft invoices visible to customers — no status filter |
| F1 | MEDIUM | client_portal.js (legacy) | expected_revenue/actual_hours/expected_hours returned to any employee, no admin gate |
| F6 | MEDIUM | customer_portal.js | p.notes (internal staff field) returned to customers in project detail |
| F7 | MEDIUM | customer_portal.js | i.* wildcard in invoice detail — schema-drift risk |
| F8 | MEDIUM | customer_portal.js | No UUID format guard — invalid :id params cause 500 not 400 |
| F9 | MEDIUM | customer_portal.js | Admin customer-client create/delete not audit-logged |
| F2 | MEDIUM | client_portal.js (legacy) | No UUID format guard on ?client_id query param |
| F10 | LOW | customer_portal.js | DELETE always returns ok:true regardless of rowCount |
| F11 | LOW | customer_portal.js | invoice_items.rate exposed to customers in invoice detail |
| F3 | LOW | client_portal.js (legacy) | No audit logging on any read endpoint |

Aggregate: 2 HIGH, 6 MEDIUM, 3 LOW

---

## Legacy client_portal.js Retirement Recommendation

client_portal.js should be RETIRED (deleted + unmounted from server.js) rather than hardened:
1. It serves overlapping functionality with client_portal_v2.js which has token-based auth, UUID guards, explicit column lists, and audit logging.
2. server.js:821 already says it stays "until E6 retires it" — that retirement is overdue.
3. Its /api/client-portal/* routes are accessible to ANY authenticated employee (not just admin), more permissive than the portal tile suggests.
4. Split-brain auth: portal tile is admin-only (server.js:287) but API endpoint allows all employees.

If NOT retiring immediately: minimum gate both endpoints with requireAdmin to close F1.

---

## Coverage Gaps

- Did not audit public/client-portal.html or frontend JS calling these APIs.
- Did not audit routes/_client_auth.js (referenced by v2 only).
- Did not audit customer_clients schema-level constraints (unique index, FK cascade).
- invoice_name column schema drift not investigated beyond wildcard risk flag.
- No rate-limiting audit on GET /api/customer/projects bulk list.

=== WAVE 164 ADVERSARIAL SECURITY AUDIT REPORT END ===
