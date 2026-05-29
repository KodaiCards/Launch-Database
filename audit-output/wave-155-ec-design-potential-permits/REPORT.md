# Wave 155 — Security Audit Report
## Files: routes/engineering_contracts.js · routes/design_pipeline.js · routes/potential_permits.js
## Framing: adversarial (IDOR, auth, SQL injection, mass assignment, cross-tenant, audit log, state machine, race conditions, cascade, info disclosure)

Write-path constraints acknowledged: only `audit-output/wave-155-ec-design-potential-permits/REPORT.md` written.

---

## logAudit Signature Check (Specific Concern)

Grep result:
  routes/engineering_contracts.js:0 (logAudit({pool pattern)
  routes/design_pipeline.js:0
  routes/potential_permits.js:0

All three files: ZERO occurrences of the broken logAudit({pool,...}) pattern from Wave 86.
engineering_contracts.js uses correct logAudit(pool, { req, ... }) two-argument form at lines 111, 150, 198.

---

## Aggregate Summary

| File | Verdict | HIGH | MED | LOW |
|---|---|---|---|---|
| engineering_contracts.js | YELLOW | 0 | 1 | 1 |
| design_pipeline.js | YELLOW | 1 | 1 | 2 |
| potential_permits.js | YELLOW | 0 | 2 | 2 |
| TOTAL | YELLOW | 1 | 4 | 5 |

---

## engineering_contracts.js — YELLOW

### VERIFIED CLEAN

- SQL injection: all queries fully parameterized. Dynamic SET clauses built from allowlisted key names with counter-incremented placeholders only.
- requireAdmin usage: requireAdmin = requireAuth('admin') — pre-invoked middleware, used bare (no ()) correctly on all write endpoints.
- requireAuth() on GET endpoints: correct (any authenticated user).
- logAudit signature: 3 calls at lines 111, 150, 198 — all correct logAudit(pool, { req, ... }) form.
- Bulk job-visibility replace (PUT /:ecId/job-visibility): wrapped in BEGIN/COMMIT/ROLLBACK with client.release() in finally. EC validated before delete step. Invalid UUIDs in job_ids silently skipped via WHERE j.id = ANY($2::uuid[]) — safe.
- Construction-contract attach: validates EC exists, contract exists, same client_id check, existing-attachment-to-different-EC check. Strong IDOR protection.
- Construction-contract detach: WHERE id = $1 AND engineering_contract_id = $2 — correctly binds both params.
- Delete pre-checks: counts child contracts/budgets/billing_batches before delete; returns 409 rather than silently cascade-deleting.

### EC-M1 — MEDIUM: PUT /api/ec-work-orders/:id accepts cross-EC service_area_id

Verified by reading: routes/engineering_contracts.js:323-344

  app.put('/api/ec-work-orders/:id', requireAdmin, async (req, res) => {
    const { number, description, service_area_id } = req.body || {};
    ...
    if (service_area_id !== undefined) { sets.push(`service_area_id = $${i++}`); params.push(service_area_id || null); }
    const { rows } = await pool.query(
      `UPDATE ec_work_orders SET ${sets.join(', ')} WHERE id = $1 RETURNING *`,
      params
    );

Attack path: Admin calls PUT /api/ec-work-orders/:woId with { service_area_id: "<UUID of SA on EC-B>" } where the WO belongs to EC-A. No validation that service_area_id.engineering_contract_id === wo.engineering_contract_id. Cross-links WOs and SAs across ECs, corrupting the data model downstream queries rely on.

Fix shape: Before building SET clause, fetch SELECT engineering_contract_id FROM ec_work_orders WHERE id = $1. If service_area_id is in update, validate SELECT id FROM ec_service_areas WHERE id = $proposed AND engineering_contract_id = $wo_ec_id; return 409 on mismatch.

Severity: MEDIUM. Admin-only. Data corruption risk on EC data model.

### EC-L1 — LOW: normalizeProgram echoes attacker input in 400 response

Verified by reading: routes/engineering_contracts.js:21-30 + lines 102, 138

  const err = new Error(`Invalid program "${input}" — allowed: ${ALLOWED_PROGRAMS.join(', ')}.`);
  // then:
  return res.status(e.statusCode || 400).json({ error: e.message });

The raw user-supplied input value is reflected in the JSON error response. In JSON context this is not XSS, but raw user input echoed in API responses is a minor information disclosure / input reflection risk.

Fix shape: Use static message: "Invalid program value — allowed: rus, bau, gfr, other." Omit the user value.

Severity: LOW. Admin-only route. Minor input reflection.

---

## design_pipeline.js — YELLOW

### VERIFIED CLEAN

- SQL injection: all queries use parameterized $1/$2/$3 placeholders. No string interpolation of untrusted input.
- Auth gates: requireAuth(['admin','design_manager','design_engineer']) on advance/regress. requireAuth(['admin','design_manager','permitting_manager']) on ongoing toggle.
- Body-actor fix: actor sourced from req.user.full_name || req.user.username — never from body. Wave 1.5 fix intact.
- requireAuth fallback (line 13): server.js line 744 passes { requireAuth } correctly — no no-op risk.
- Stage boundary guards: advance checks nextIdx >= DESIGN_STAGES.length; regress checks currentIdx <= 0.
- Error messages: static strings in JSON responses; e.message only goes to console.log.
- ON CONFLICT DO NOTHING on INSERT — idempotent stage creation.

### DP-H1 — HIGH: advance and regress accept any project UUID — no project_type='design' validation

Verified by reading: routes/design_pipeline.js:54-96 (advance), 99-145 (regress)

  app.put('/api/design/:projectId/advance',
    requireAuth(['admin', 'design_manager', 'design_engineer']),
    async (req, res) => {
    ...
    const { rows: cur } = await pool.query(
      'SELECT stage FROM design_stages WHERE project_id=$1 AND completed_at IS NULL ...',
      [projectId]
    );
    const currentStage = cur[0]?.stage || 'potential';   // if no row: defaults to 'potential'
    ...
    await pool.query(
      'INSERT INTO design_stages (project_id, stage, updated_by) VALUES ($1,$2,$3) ON CONFLICT ...',
      [projectId, nextStage, actor]
    );
    if (nextStage === 'completed') {
      await pool.query(
        `UPDATE projects SET status='completed', completed_date=CURRENT_DATE WHERE id=$1`,
        [projectId]
      );

Attack path: A design_engineer calls PUT /api/design/<permitting-project-id>/advance.
1. No design_stages row exists -> currentStage defaults to 'potential'
2. design_stages row inserted for the permitting project at stage 'started'
3. If advanced twice more: UPDATE projects SET status='completed' fires on the permitting project

Corrupts permitting project's status field and injects spurious design_stages rows for a non-design project. Regress handler has the identical gap.

Reference: Wave 154 applied the exact fix to permits.js lines 72-76 and 145-149:
  const { rows: projRows } = await pool.query(
    'SELECT id, project_type FROM projects WHERE id = $1', [projectId]
  );
  if (!projRows.length || projRows[0].project_type !== 'permitting') {
    return res.status(400).json({ error: 'Project is not a permitting project' });
  }

design_pipeline.js needs the identical pattern with project_type !== 'design'.

Fix shape: At top of both advance and regress handlers:
  const { rows: projRows } = await pool.query(
    'SELECT id, project_type FROM projects WHERE id = $1', [projectId]
  );
  if (!projRows.length || projRows[0].project_type !== 'design') {
    return res.status(400).json({ error: 'Project is not a design project' });
  }

Severity: HIGH. Any design team member (not admin-only) can corrupt permitting or other project states. State corruption in government project tracking is a compliance risk.

### DP-M1 — MEDIUM: advance/regress not transactional — concurrent calls can corrupt stage state

Verified by reading: routes/design_pipeline.js:63-92

    // Step 1: read current stage (no FOR UPDATE)
    const { rows: cur } = await pool.query(
      'SELECT stage FROM design_stages WHERE project_id=$1 AND completed_at IS NULL ...',
      [projectId]
    );
    const currentStage = cur[0]?.stage || 'potential';
    // Step 2: UPDATE completed_at (separate query)
    await pool.query('UPDATE design_stages SET completed_at=NOW() ... WHERE project_id=$3 AND stage=$4', ...);
    // Step 3: INSERT next stage (separate query)
    await pool.query('INSERT INTO design_stages ...', ...);

Race scenario: Two concurrent advance requests for same projectId both read currentStage='started', both compute nextStage='review_process'. Request A UPDATE+INSERT succeeds. Request B's UPDATE finds 0 rows (already completed by A); INSERT hits ON CONFLICT DO NOTHING. Both return success but B's stage close silently did nothing. No transaction boundary means the read-modify-write is not atomic.

Compare: permits.js advance uses FOR UPDATE on the stage select (noted in the file header comment).

Fix shape: Wrap the three-step sequence in BEGIN/COMMIT/ROLLBACK transaction with FOR UPDATE on the SELECT:
  const client = await pool.connect();
  await client.query('BEGIN');
  const { rows: cur } = await client.query(
    'SELECT stage FROM design_stages WHERE project_id=$1 AND completed_at IS NULL ... FOR UPDATE',
    [projectId]
  );
  ...
  await client.query('COMMIT');
  // catch: ROLLBACK; finally: client.release()

Severity: MEDIUM. Race window is narrow but unguarded state machine on government project tracking is a correctness risk.

### DP-L1 — LOW: logAudit imported but never called

Verified by reading: routes/design_pipeline.js:10 (import), grep confirms 0 calls to logAudit(

advance, regress, and is_ongoing toggle leave no audit trail. For RUS project tracking, pipeline state changes should be traceable to actor + timestamp.

Fix shape: logAudit(pool, { req, action: 'advance', entity_type: 'project', entity_id: projectId, after: { stage: nextStage }, source: 'design_portal' }) after successful transition in both handlers; same for ongoing toggle.

Severity: LOW. Traceability gap.

### DP-L2 — LOW: PUT /api/projects/:id/ongoing accepts any project type

Verified by reading: routes/design_pipeline.js:37-50

  app.put('/api/projects/:id/ongoing', requireAuth(['admin', 'design_manager', 'permitting_manager']), async (req, res) => {
    const { is_ongoing } = req.body;
    const { rows } = await pool.query(
      `UPDATE projects SET is_ongoing = $1 WHERE id = $2 RETURNING id, is_ongoing`,
      [!!is_ongoing, req.params.id]
    );

A design_manager can toggle is_ongoing on a billing or AI project. The is_ongoing flag drives monthly invoice generation — incorrectly set on a non-design/permitting project could trigger erroneous monthly invoices.

Fix shape: Add AND project_type IN ('design', 'permitting') to the WHERE clause.

Severity: LOW. Accidental misuse risk rather than malicious.

---

## potential_permits.js — YELLOW

### VERIFIED CLEAN

- SQL injection: all 4 endpoints fully parameterized.
- Auth gates: GET requireAuth() (any authenticated — internal tool, acceptable). POST: design+permitting roles. PUT/DELETE: admin+permitting_manager. Correct privilege ladder.
- Body-actor fix: lines 39, 72 source submitted_by and reviewed_by from req.user — Wave 1.5 fix intact.
- project_id FK: potential_permits.project_id has FOREIGN KEY REFERENCES projects(id) ON DELETE SET NULL — DB enforces referential integrity on the project link.
- SSE broadcast errors: swallowed in inner try/catch so broadcast failure doesn't break POST response. Correct.
- Wave 154 concern (project_type check): NOT APPLICABLE. project_id in potential_permits PUT is a linkage annotation only — not used to advance any pipeline or change project state. FK constraint is sufficient guard.

### PP-M1 — MEDIUM: PUT /:id returns HTTP 200 with null body when row not found

Verified by reading: routes/potential_permits.js:69-83

      const { rows } = await pool.query(
        `UPDATE potential_permits SET ... WHERE id=$5 RETURNING *`,
        [status || 'pending', reviewedBy, project_id || null, notes, req.params.id]
      );
      res.json(rows[0]);    // rows[0] is undefined when no row matched; sends null body with 200

When req.params.id doesn't match any row, rows = [], rows[0] = undefined, res.json(undefined) sends HTTP 200 with body null. Callers cannot distinguish a successful update from a silent no-op. Also enables ID probing: non-existent IDs return null (200) vs populated JSON (200) instead of 404.

Fix shape:
  if (!rows[0]) return res.status(404).json({ error: 'Potential permit not found' });
  res.json(rows[0]);

Severity: MEDIUM. Silent success on non-existent IDs; breaks error handling and enables ID enumeration.

### PP-M2 — MEDIUM: status field accepts arbitrary string — no allowlist, no DB CHECK constraint

Verified by reading: routes/potential_permits.js:70, 77 + schema.sql:364-386

  const { status, project_id, notes } = req.body;
  [status || 'pending', ...]  // only guards null/empty

Schema: status character varying(50) DEFAULT 'pending' — NO CHECK constraint.

A permitting_manager can PUT with { "status": "anything_up_to_50_chars" }. Value persists to DB. Downstream queries filtering status IN ('pending','approved','rejected') will miss rows with custom status values.

Fix shape: Define ALLOWED_STATUSES = ['pending','approved','rejected','withdrawn'] and validate at route layer. Add matching DB CHECK constraint for defense in depth.

Severity: MEDIUM. State machine integrity risk on permit-approval workflow.

### PP-L1 — LOW: logAudit imported but never called

Verified by reading: routes/potential_permits.js:16 (import), grep confirms 0 calls to logAudit(

Status changes, approvals, and deletions produce no audit trail.

Fix shape: logAudit(pool, { req, action: 'update', entity_type: 'potential_permit', entity_id: req.params.id, after: { status }, source: 'permitting_portal' }) in PUT. logAudit with action: 'delete' in DELETE.

Severity: LOW. Traceability gap.

### PP-L2 — LOW: DELETE /:id returns 200 { ok: true } when row not found

Verified by reading: routes/potential_permits.js:86-94

      await pool.query('DELETE FROM potential_permits WHERE id=$1', [req.params.id]);
      res.json({ ok: true });   // no RETURNING, no row-count check

Deleting a non-existent ID returns { ok: true } 200 — identical to successful delete.

Fix shape: Switch to DELETE ... RETURNING id, check if rows[0] exists, return 404 on miss.

Severity: LOW. Admin-only. Breaks idempotency semantics.

---

## Coverage Gaps

- Did not audit routes/_audit.js logAudit internals (out of scope)
- Did not audit routes/_sse.js broadcast internals
- ec_job_visibility PUT bulk-replace: UUID cast $2::uuid[] throws Postgres 22P02 on malformed UUIDs — returns 500 instead of 400, minor UX issue, not a security concern
- Did not verify Railway env variable configuration

=== WAVE-155-ADVERSARIAL REPORT END ===
