# AUDIT A — Timeclock Picker Scope Reconciliation

> Framing: scope reconciliation + canonical plan.
> READ-ONLY except this report. Date: 2026-05-14.

---

## 1. Where REPROs Agree

Both REPROs confirm:

- **Primary symptom surface:** `public/timeclock.html` only. The pre-clock-in card `#ci-project` and the Switch Project modal both show an unfiltered flat list.
- **Root picker code:** `populateProjectSelect()` at `timeclock.html:684–705`, filter `projectsCache.filter(p => !p.is_rollup)` at line 689.
- **API source:** `GET /api/projects?status=active` — no `is_rollup` filter at the SQL layer (`routes/projects.js:63–105`).
- **12 repetitions of "Inspection"** are present in the picker.
- **Cascade is the correct long-term fix.** Both REPROs endorse the spec at `audit-output/future/timeclock-picker-spec.md`.
- **`child_count` is available** in the API response but NOT used by `populateProjectSelect` (it only checks `!p.is_rollup`).
- **No race condition** in picker initialization — `loadProjects()` is awaited before `renderClockCard()`.

---

## 2. Where REPROs Disagree

| Claim | Agent A | Agent B |
|---|---|---|
| **Why 12 "Inspections" appear** | Correct leaf projects all named "Inspection" — one per service area WO#. Filter is working correctly. | Rollup rows may be leaking via `is_rollup=NULL` treated as falsy by JS `!p.is_rollup`. |
| **Does surgical SQL fix change what user sees?** | No — 12 real leaves exist; fix wouldn't help. | Yes — possibly filtering rollup-NULLs would reduce count. |
| **Is surgical fix necessary?** | Only as defensive hardening; not symptom-addressing. | Yes — a real SQL-level leak exists at `routes/projects.js:63`. |

The crux: **does `is_rollup=NULL` exist in production for rollup rows?**

---

## 3. DB Rollup-NULL Investigation

**Schema evidence (schema_core.sql:825):**
```sql
ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_rollup BOOLEAN DEFAULT FALSE;
```

**Critical finding: `DEFAULT FALSE`, no `NOT NULL` constraint.** The column IS nullable at the schema level. However:

1. **`findOrCreateRollup` (portal_module.js:196)** always inserts rollup rows with `is_rollup = TRUE` (literal `TRUE` in the INSERT VALUES). No path through this function produces `is_rollup=NULL` for a rollup row.
2. **Schema bootstrap (schema_core.sql:964, 978, 1012)** — the one-time backfill explicitly sets `is_rollup=TRUE` on all rollup inserts.
3. **Migration 0023** uses `is_rollup=TRUE` and `is_rollup=FALSE` exclusively, never inserting NULL.
4. **No `INSERT INTO projects` in any other file omits `is_rollup`** in any path that creates a rollup-purpose row — confirmed by grepping all INSERT sites.

**Verdict: `is_rollup=NULL` is theoretically possible (column lacks NOT NULL) but has no known code path that would produce it for rollup rows in normal operation.** A direct admin DB INSERT or a pre-rollup-feature legacy row could hypothetically produce it. The JS `!p.is_rollup` filter treats `NULL` as falsy and would pass such rows through.

**Defensive risk:** while `NULL` rollups are unlikely in production, they're not structurally impossible. The surgical fix (`AND p.is_rollup IS NOT TRUE`) costs one line and eliminates the theoretical exposure entirely.

---

## 4. Leaf-Name-Collision Investigation

**Unique constraint (schema_core.sql:757–758):**
```sql
CREATE UNIQUE INDEX IF NOT EXISTS uniq_project_name_per_parent
  ON projects (COALESCE(parent_id::text, 'ROOT'), LOWER(name));
```

This constraint enforces name uniqueness **within the same parent only.** Two leaf projects under **different** service area rollup parents CAN legally share the name `"Inspection"`.

**How 12 "Inspection" leaves are created:** Each PSC/RUS work order has a service area rollup parent. Each service area rollup gets a leaf child with `project_type='inspection'` and `name='Inspection'` (the name is derived from `project_type` via the project-create flow). The unique index allows this because each leaf has a different `parent_id`.

**Verified by reading:**
- `scripts/schema_core.sql:757-758` — unique index scope
- `portal_module.js:72-170` — `ensureRollupChain` creates Client → Team → Service Area rollup parents; leaf projects created under each SA parent can share the name "Inspection"
- `timeclock.html:689-703` — `!p.is_rollup` filter correctly excludes rollups but passes all 12 leaves, all labeled `"PSC — Inspection [WO#XXXX]"`

**Agent A's claim is empirically correct.** The 12 items are real leaves, not leaking rollups. The filter is not broken — the data is structurally correct but visually ambiguous.

---

## 5. Canonical Symptom Diagnosis

**Agent A is correct on the primary symptom cause.** The 12 "Inspection" repetitions are real leaf projects (one per service area), correctly filtered to leaves. `is_rollup` is reliably `TRUE` on rollup rows in production.

**Agent B's NULL-leak claim** is theoretically valid as a latent defect but is NOT the cause of the reported symptom. No production code path creates `is_rollup=NULL` rollup rows.

**What Agent B gets right:**
- The SQL endpoint genuinely has no server-side `is_rollup` filter — that's a real hardening gap.
- The `child_count` vs `!p.is_rollup` divergence is a real secondary latent bug (a leaf with `is_rollup=FALSE` but `child_count > 0` would slip through).
- The LIMIT 1000 truncation risk is real.

**Canonical diagnosis:** The user's symptom is caused by **12 legitimately distinct leaf projects all sharing the name "Inspection"** — one per PSC/RUS work order / service area. The picker renders them with only the WO# suffix to distinguish them (`PSC — Inspection [WO#XXXX]`). The fix is the cascade UX, not filtering. The surgical SQL fix is warranted as hardening but does not change the user-visible symptom.

---

## 6. Spec Review

**`audit-output/future/timeclock-picker-spec.md` — 274 lines. Assessment: Excellent coverage.**

Strengths:
- Full Area A/B/C/D/E structure: current state → target → gap analysis → scope decomposition → open questions.
- Four batches with acceptance criteria, risk ratings, auditor counts, and commit estimates.
- Area E Q4 (concentrators → client_id join path) fully resolved with verified JOIN SQL.
- Pre-build schema verification checklist with all columns confirmed.
- PSC-only concentrators issue identified and recommendation documented (hide WO# for non-PSC clients; use `ec_work_orders` first, fall back to `concentrators`).

Gaps / open questions still open in spec:
1. **E Q1:** WO# dropdown behavior for non-PSC clients — partially resolved (hide it) but the `ec_work_orders` vs `concentrators` precedence logic needs implementation confirmation.
2. **E Q2:** Default-select stickiness (localStorage) — unanswered.
3. **E Q3:** Auto-create authorization — unanswered. Can any logged-in user auto-create projects via timeclock? This is a security/workflow question that needs Carter's call before Batch 1 ships.
4. **E Q4:** `status='completed'` match behavior on resolve-or-create — unanswered.
5. **E Q5:** Backward-compat cutover for quick-clock `project_id` path — marked as confirm-required.

**Spec adequacy verdict: ADEQUATE for Batch 2 (frontend picker rebuild). Batch 1 (backend resolve-or-create + new clock-in path) has 3 open questions (E Q2, Q3, Q4) that need answers before that batch ships.** The spec is a build-ready foundation; Carter needs to answer the 3 gating questions before Batch 1.

---

## 7. Canonical Fix-Plan Recommendation

**Recommendation: Option 3 — Surgical hardening first, cascade second (sequenced).**

**Rationale:**

Option 1 alone (surgical SQL fix only) would NOT resolve the user's reported symptom. The 12 items are real leaves; filtering nulls/rollups changes nothing visible to the user. Shipping only Option 1 would leave the user with the same broken UX and erode trust.

Option 2 alone (cascade only, skip surgical) is the right user-facing fix but leaves a latent hardening gap in `routes/projects.js` that any non-timeclock consumer of that endpoint also inherits. Easy to include in the same PR at zero marginal cost.

Option 3 sequences correctly:
1. **Surgical fix (commit 1):** Add `AND p.is_rollup IS NOT TRUE` to `routes/projects.js:61` WHERE clause AND update `timeclock.html:656` to call `GET /api/projects?status=active&limit=all` (eliminates LIMIT 1000 truncation risk for the picker cache). Also update `populateProjectSelect` to use `child_count === 0` as a secondary guard alongside `!p.is_rollup` (closes the `child_count > 0` latent bug). These are pure hardening — no regression risk, no UX change. **Estimated commits: 1**.
2. **Cascade rebuild (commits 2–5):** Implement spec Batches 1–3 per the existing spec: `picker-data` endpoint + `resolveOrCreateProject` + clock-in/switch body change + frontend picker UI rebuild + auto-create rollup smoke tests. **Estimated commits: 3–4** (one per batch, keeping each pushable independently).
3. **Polish (commit 6):** Batch 4 a11y + mobile polish. **Estimated commits: 1**.

**Total estimated commits: 5–6.**

**Acceptance criteria:**
- Clock-in card shows Client → Job → WO# cascade (or Client → Job if no WO#s for that client).
- "Will clock into: PSC / Construction Team / [Area Name] / PSC Inspection — 16300" preview renders before clock-in.
- Quick-clock buttons unchanged and functional.
- Switch Project modal uses same cascade.
- `POST /api/timeclock/clock-in` with `{project_id}` still works (backward compat).
- `GET /api/projects?status=active` no longer returns rollup rows (SQL hardening).

---

## 8. Pre-Fix Dependencies

1. **Carter answers spec open questions E Q2, Q3, Q4** before Batch 1 (backend) ships. Q3 (auto-create auth) is a security decision — cannot default.
2. **No schema migration required.** All columns exist (`projects.is_rollup`, `projects.work_order_number`, `jobs.team`, `concentrators.*`, `ec_work_orders.*`). Confirmed via spec pre-build checklist.
3. **Confirm `uniq_project_name_per_parent` index applied in production.** The schema creates it conditionally (skips if duplicates exist). If not applied, `resolveOrCreateProject` could create duplicate leaves on concurrent clock-ins. Pre-fix data audit recommended: `SELECT parent_id, LOWER(name), COUNT(*) FROM projects GROUP BY parent_id, LOWER(name) HAVING COUNT(*) > 1`.

---

## 9. Top 5 Risks of Option 3

1. **Auto-create authorization gap (HIGH):** `resolveOrCreateProject` can create projects without admin approval. If any logged-in user can trigger it, a typo in the picker creates phantom projects in the billing tree. Carter must decide: approval-queued or free-create for timeclock context.
2. **Backward-compat cutover complexity (MEDIUM):** `POST /api/timeclock/clock-in` needs to support both `{project_id}` and `{client_id, job_id, work_order_number}` simultaneously. A code branch bug on this path could cause silent clock-in failures with no UX feedback.
3. **`ec_work_orders` vs `concentrators` dual-path in picker-data endpoint (MEDIUM):** The two WO# sources (modern FK path vs legacy string-match path) have different data shapes. If the precedence logic has an edge case, the WO# dropdown silently returns nothing for a client that has data in one but not the other.
4. **LIMIT-all performance on large project tables (LOW-MEDIUM):** Switching `loadProjects()` to `?limit=all` removes the LIMIT 1000 safeguard. If the project table grows beyond ~5K rows, the timeclock page-load network payload could balloon. Mitigated long-term by moving to the `picker-data` endpoint (Batch 1) which only returns jobs + WOs, not the full project tree.
5. **Switch Project modal divergence (LOW):** Both `#ci-project` (clock-in card) and `#switch-project` (Switch modal) must be rebuilt. If Batch 2 updates only one, users who switch projects mid-shift still see the flat broken list. Easy to catch in testing, but the spec explicitly notes both surfaces must be updated.

---

=== TIMECLOCK AUDIT A SCOPE END ===
