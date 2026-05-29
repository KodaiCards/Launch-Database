# Wave 173 Security Audit: admin.js + projects.js + project_detail.js

Date: 2026-05-29
Auditor: Sonnet adversarial framing
Branch: agent/wave-173-admin-projects-audit
Scope: routes/admin.js, routes/projects.js, routes/project_detail.js
Framing: adversarial -- assume authenticated attacker at each role boundary

## Aggregate Counts
HIGH: 1 | MED: 5 | LOW: 4 | Total: 10

## routes/admin.js -- VERDICT: YELLOW (1 HIGH + 2 MED)

VERIFIED CLEAN:
- Role gate consistency: All mutating endpoints use requireAdmin (role=admin only). CLEAN.
- SQL injection: No template literal interpolation. Dynamic WHERE uses  slots only. CLEAN.
- staff-with-user response: Users RETURNING uses explicit column list (no password_hash). CLEAN.
- ADMIN_BYPASS_TOKEN: crypto.timingSafeEqual with fixed-length buffers -- no timing oracle. CLEAN.
- Wrong-signature logAudit: 0 occurrences of logAudit({pool in file (moot -- no logAudit calls at all).

HIGH-1: Zero audit logging across ALL mutating admin endpoints
File: routes/admin.js Lines: 1-1418 (entire file)
Verified: grep -c logAudit routes/admin.js = 0. No import of _audit anywhere.
Affected endpoints (all unlogged):
  migrate-nesting (bulk project tree rewrite -- parent_id reassignment + is_rollup resets)
  adopt-orphan (permit_documents insert)
  adopt-orphans-bulk (bulk permit_documents insert)
  hours-backfill (time_entries.user_id mass UPDATE)
  prune-orphan-files (disk file DELETE)
  audit-cleanup (audit_log rows archived -- self-referential: cleanup not logged)
  reattribute-rollup-hours (time_entries.project_id bulk UPDATE)
  uploads-cleanup (disk file DELETE)
  staff-with-user (user + staff INSERT)
Attack: Admin or stolen session performs any of the above with zero forensic record.
For government-contract billing, reconstruction after data-integrity incident impossible.
Fix: Add const { logAudit } = require('./_audit'); at top of admin.js.
Add logAudit(pool, { req, action, entity_type, entity_id, before, after, source: 'admin_ui' })
to each mutating endpoint with descriptive action names.

MED-1: uploaded_by from req.body written unvalidated to permit_documents.uploaded_by
File: routes/admin.js Lines: 216 (adopt-orphan), 251 (adopt-orphans-bulk)
Snippet: const { project_id, file_path, document_type, uploaded_by } = req.body;
  INSERT INTO permit_documents (project_id, file_path, document_type, uploaded_by, ...)
  VALUES (, , , , ...) [project_id, file_path, document_type, uploaded_by]
Attack: Admin sends uploaded_by: <victim_user_id> -- record attributes document to victim.
False attribution in government-contract records context is a records-integrity violation.
Fix: Replace req.body.uploaded_by with req.user.id. If original uploader needed, validate
provided ID against users table before writing to audit-trail column.

MED-2: uploads-cleanup bypass-token path: destructive DELETE without DB session or audit
File: routes/admin.js Lines: 1158-1176
Snippet: if (bypassToken) { if (crypto.timingSafeEqual(...)) { await pruneOrphanFiles(...); return res.json(...); } }
Attack: If ADMIN_BYPASS_TOKEN leaks (Railway env dump, log exposure), attacker triggers bulk
file deletion from any IP with no session, no user record, no audit trail.
Fix: Add logAudit to both bypass path (actor_type: system) and normal path.
Evaluate whether bypass path is necessary; if retained, log hashed token in meta.

COVERAGE GAPS:
- hours-backfill-preview GET not fully audited for data-scope leakage across clients
- rus-hours-debug endpoint only skimmed; confirm no mutation path
- file_path from req.body in adopt-orphan not verified for path-traversal guards

## routes/projects.js -- VERDICT: YELLOW (2 MED + 1 LOW)

VERIFIED CLEAN:
- logAudit signature: Line 21 const { logAudit } = require('./_audit').
  All calls use logAudit(pool, { req, action, entity_type, entity_id, ... }) -- CORRECT.
  NO Wave 86 wrong-signature logAudit({pool,...}) pattern found anywhere in file.
- resolve-or-create EC mode IDOR: Lines 971-979 SELECT id FROM ec_service_areas
  WHERE id= AND engineering_contract_id= -- validates SA belongs to caller EC. CLEAN.
- resolve-or-create no-EC mode: Client existence verified 1082-1087, ensureRollupChain
  scoped by client_id. CLEAN.
- customer-role exclusion: requireProjectCreate blocks customer via canCreateProjects. CLEAN.
- SQL injection: Dynamic WHERE uses  parameterized slots only. CLEAN.
- Mass assignment: Only named columns inserted/updated, no body spread. CLEAN.

MED-3: validateUUID missing on 5 mutating/sensitive endpoints
File: routes/projects.js Lines: PUT/:id(465), POST/:id/recalc-hours(739),
  DELETE/:id/with-hours(791), DELETE/:id/with-tree(1194), GET/:id/monthly-hours-breakdown(1300)
Verified: validateUUID defined line 184 and applied at GET/:id(193), DELETE/:id(690),
POST/:id/generate-monthly-invoice(1327) -- missing on above 5 endpoints.
Attack: Malformed id values reach parameterized queries. Type-cast errors leak query structure.
DELETE/:id/with-tree recurses through tree -- non-UUID silently no-ops vs clear error.
Fix: Add if (!validateUUID(id, res)) return; after const { id } = req.params on all 5.

MED-4: parent_id existence-only check enables cross-client tree re-parenting
File: routes/projects.js Lines: POST/ line 268, PUT/:id line 509
Snippet (line 268): const parentCheck = await pool.query(
  'SELECT id FROM projects WHERE id=', [parent_id]);
  if (!parentCheck.rows.length) { return res.status(400)... }
  // No client_id ownership check
Attack: User provides parent_id from a different client's project tree. New project becomes
child of foreign client's tree, corrupting their hierarchy and potentially exposing their
data via breadcrumbs and rollup aggregations. PUT/:id same gap.
Fix: SELECT id, client_id FROM projects WHERE id=.
If parentCheck.rows[0].client_id !== client_id, return 403.

LOW-1: permit_manager from req.body written unvalidated to permit_stages.updated_by
File: routes/projects.js Lines: ~229
Snippet: const { permit_manager } = req.body;
  INSERT INTO permit_stages (project_id, updated_by, ...) VALUES (, , ...) [project_id, permit_manager]
Attack: Caller sets permit_manager to arbitrary string -- false attribution in audit-trail field.
Parameterized prevents injection. Lower risk (caller authenticated, self-directed).
Fix: Validate permit_manager is UUID matching users table, or replace with req.user.id.

COVERAGE GAPS:
- GET /api/projects client_id filter is caller-supplied from req.query with no
  role-based assertion that caller has access to the requested client
- POST/:id/generate-monthly-invoice invoice idempotency not traced (out of scope)

## routes/project_detail.js -- VERDICT: YELLOW (1 MED + 2 LOW)

VERIFIED CLEAN:
- SQL injection: All queries use  parameterized placeholders. CLEAN.
- logAudit absence: Appropriate for read-only endpoint.
- server.js registration: Line 714 passes { requireAuth } -- fallback no-op NOT triggered. CLEAN.

MED-5: No authorization scope -- any authenticated user reads any project's full financial data
File: routes/project_detail.js Lines: 23-260 (entire file)
Snippet (line 40-47): SELECT p.*, c.name as client_name, ... FROM projects p
  LEFT JOIN clients c ON p.client_id = c.id WHERE p.id = 
  (no req.user.id, req.user.role, or any ownership predicate anywhere in file)
Attack: Any auth user including customer role who knows a project UUID receives:
full project row, all time_entries with employee names/hours, all invoices with amounts,
all permit_documents with file paths, all child projects, monthly hours breakdown,
projected revenue.
Scenario: Customer portal user for client A collects project UUIDs from prior API calls.
Calls /api/projects/<client_B_UUID>/detail -- receives client B's complete billing,
employee hours, permit documents, and invoice history.
Additional: No validateUUID on req.params.id in project_detail.js anywhere.
Fix: After fetching project row, check if user has access. Privileged roles (admin,
design_manager, permitting_manager) see all. Customer role: verify user_client_access
WHERE user_id= AND client_id=project.client_id, return 403 if no match.

LOW-2: requireAuth fallback to no-op if mw undefined (latent, not currently triggered)
File: routes/project_detail.js Line: 21
Snippet: const requireAuth = (mw && mw.requireAuth) || (() => (req, res, next) => next());
Attack: Currently safe (server.js:714 passes {requireAuth}). Future refactor removing third
argument makes all project_detail endpoints unauthenticated with no startup error.
Same class as 2026-05-11 crash (requireManagerOrAdmin undefined, hotfix b8666c8).
Fix: if (!mw || !mw.requireAuth) throw new Error('project_detail: requireAuth not provided');

LOW-3: month/year query params not validated as integers
File: routes/project_detail.js Lines: 70-78
Snippet: const month = req.query.month; ... WHERE EXTRACT(MONTH FROM te.start_time) = 
Attack: Non-numeric values cause Postgres type-cast error (schema disclosure).
Extreme values silently return empty rows. Parameterized prevents injection. Hygiene only.
Fix: parseInt with bounds check (month 1-12, year 2000-2100).

LOW-4: batch_id in admin.js import-trace not validated as UUID
File: routes/admin.js Line: 927
Snippet: const { batch_id } = req.params;
  pool.query('SELECT * FROM csv_review_queue WHERE batch_id=', [batch_id])
Parameterized prevents injection. Maintenance risk -- inconsistent validation.
Fix: Apply validateUUID pattern from projects.js.

COVERAGE GAPS:
- Columns returned from time_entries and invoices joins not exhaustively verified
  for sensitive data beyond hours and amounts
- Child-project recursion depth not verified for unbounded tree fetches

## Cross-File: Wrong-Signature logAudit Search
admin.js: 0 occurrences logAudit({pool -- No logAudit calls at all (HIGH-1)
projects.js: 0 occurrences logAudit({pool -- All calls use correct logAudit(pool,...) CLEAN
project_detail.js: 0 occurrences -- Read-only file, no logAudit expected
Wave 86 silent-no-op pattern NOT FOUND. admin.js situation more severe: complete absence.

## Summary Table
H-1 HIGH  admin.js         1-1418            Zero logAudit on ALL 9 mutating endpoints
M-1 MED   admin.js         216,251           uploaded_by from req.body to permit_documents audit trail
M-2 MED   admin.js         1158-1176         uploads-cleanup bypass-token: DELETE without session/audit
M-3 MED   projects.js      465,739,791,      validateUUID missing on 5 mutating/sensitive endpoints
                           1194,1300
M-4 MED   projects.js      268,509           parent_id existence-only: cross-client tree re-parenting
M-5 MED   project_detail   23-260            No authorization scope: any auth user reads any project data
L-1 LOW   projects.js      ~229              permit_manager from body to permit_stages.updated_by
L-2 LOW   project_detail   21                requireAuth fallback to no-op (latent)
L-3 LOW   project_detail   70-78             month/year params not validated as integers
L-4 LOW   admin.js         927               batch_id in import-trace not validated as UUID

=== WAVE 173 SECURITY AUDIT REPORT END ===
