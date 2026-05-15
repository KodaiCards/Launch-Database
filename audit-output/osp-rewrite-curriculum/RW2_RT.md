# OSP-RW.2 RT Verification (Postgres + API + Tests + useProgress)

## Stack snapshot (≤80 words)

**YELLOW** — backend is structurally sound with no critical security holes, but 4 specific patches are required before OSP-RW.3 proceeds: (1) missing 401 tests for GET /cert-attempts and POST /capstone-attempt, (2) POST /api/training/progress returns 200 on first insert (should be 201), (3) `domain_scores` accepted without type validation, (4) schema.sql FK constraints use `ADD CONSTRAINT` / `ALTER TABLE` style rather than the inline `REFERENCES` format of the migration — schema-sync CI diff check will flag this.

---

## Axis 1: SQL Safety

**All migration-0023 and 0032 lessons applied correctly.**

- `%%` in RAISE NOTICE: **NONE**. No RAISE NOTICE statements at all in migration 0035. Clean.
- `COALESCE` / expression inside inline `UNIQUE (...)`: **NONE**. No UNIQUE constraints at all — uniqueness is enforced via `PRIMARY KEY (user_id, lesson_id)` on `training_progress` only. The two SERIAL-id tables have single-column PKs. Clean.
- `BEGIN / COMMIT` wrapping: **PRESENT** — lines 16 and 85 of `migrations/0035_training_tables.sql`. Clean.
- Foreign key cascade: All three tables reference `users(id) ON DELETE CASCADE` — confirmed in both the migration and `schema.sql` lines 3064–3079. Correct per spec.
- `users.id` type: confirmed UUID (`schema.sql:984` — `id uuid DEFAULT gen_random_uuid() NOT NULL`). Migration FK references match.
- Index choices: `idx_training_progress_user_course (user_id, course_id)` supports the per-course aggregate query in the admin overview. `idx_training_cert_attempts_user_date (user_id, attempt_date DESC)` supports ordered cert history. `idx_training_capstone_user_course_date` correctly covers all three columns used in future analytics. All three indexes appropriate.
- Status enum + score range constraints: CHECK constraints present and correct in both migration and schema.sql.

**FINDING A1-LOW: schema.sql FK style mismatch.** The migration uses inline `REFERENCES users(id) ON DELETE CASCADE` inside `CREATE TABLE`. The `schema.sql` uses `ALTER TABLE ONLY ... ADD CONSTRAINT ... FOREIGN KEY`. This is the expected `pg_dump` output format — they are semantically equivalent. However, the CI `schema:sync` step diffs the migration-applied DB against `schema.sql`. If the diff check does exact-text comparison rather than semantic comparison, this will produce a false-positive failure on the first deploy to a fresh DB. Recommend verifying the CI diff check handles this pg_dump style difference. Not a boot failure — just a CI noise risk.

---

## Axis 2: API Endpoint Security

- `requireAuth()` on every endpoint: **VERIFIED** — lines 23, 58, 137, 188, 209, 253 of `routes/training.js`. All 6 endpoints gated.
- Admin endpoint role check: **VERIFIED** — `routes/training.js:251-254`. `ADMIN_ROLES = ['admin', 'design_manager', 'permitting_manager']`. Returns 403 for non-matching roles. Role strings match `auth.js:100` and `routes/time_entries.js:73`.
- 403 vs 401 for missing role: **CORRECT** — authenticated user with wrong role gets 403. Unauthenticated gets 401 from `requireAuth()`. Correct semantics.
- Parameterized queries: **ALL CLEAN** — zero `${...}` template literals inside any `pool.query()` string. Every query uses `$1`, `$2`, etc. with parameter arrays. Verified by inspection of all 6 `pool.query` calls.
- DB error message leak: **CLEAN** — all catch blocks log `err.message` server-side only, return generic string to client. Wave 1.6 lesson applied.
- Input validation: Required fields checked with explicit error messages. score, completion_pct, total_items, correct_items all bounds-checked. cert_track validated against allowlist.
- IDOR: **CLEAN** — every query uses `req.user.id` for the `WHERE user_id = $1` clause. No `req.params.user_id` or `req.query.user_id` pattern. Users can only read/write their own rows.
- LIMIT on admin query: **PRESENT** — line 274, `LIMIT 1000`.

**FINDING A2-LOW: `domain_scores` accepted without type validation.** `routes/training.js:138,176` — `domain_scores` is destructured from `req.body` and passed directly to `JSON.stringify(domain_scores)` without checking `typeof domain_scores === 'object'` or that it's not an array or string. A client could send `domain_scores: "DROP TABLE"` which would become the JSON string `'"DROP TABLE"'` stored in the JSONB column — no SQL injection risk (parameterized), but the schema accepts arbitrary JSONB shapes. Low severity because JSONB is schemaless by design, but a basic `typeof domain_scores !== 'object' || Array.isArray(domain_scores)` guard would prevent junk writes. Suggested patch: add guard before line 176.

**FINDING A2-MEDIUM: POST /api/training/progress returns HTTP 200 on first insert, not 201.** `routes/training.js:127` — `res.json({ progress: rows[0] })` with no explicit status code. Default is 200. REST convention: a successful resource creation (first INSERT on a `(user_id, lesson_id)` pair) should return 201. Subsequent upserts (ON CONFLICT) returning 200 is acceptable. The ambiguity is that the same endpoint does both create and update, and the client can't tell which happened. Two remediation options: (a) check if `rows[0].attempts === 1` and return 201 on first insert, else 200; (b) return 200 always and document as "upsert endpoint." Option (b) is simpler and aligns with how `tests/training.test.js` is written (no `expectStatus` on the progress POST create test — defaults to 200). If that's the intent, the comment at the top of the endpoint is misleading ("record" implies create). Low friction fix: either add `expectStatus: 201` + `status(201)` consistently for creates, or document as intentional upsert-always-200.

**FINDING A2-LOW: Auth bypass block in server.js does not expose /api/training/*.** Verified `pageRequiresAuth()` at `server.js:321-355` — the function has no exemption for `/api/training/`. The training routes sit behind `requireAuth()` individually AND the global auth middleware would redirect unauthenticated HTML requests. Double-gated. Clean.

---

## Axis 3: useProgress Hook

- React Query v5 syntax: **CORRECT** — `useQuery({ queryKey, queryFn, staleTime, retry })` and `useMutation({ mutationFn, onMutate, onError, onSettled })` are v5 object-config style. `@tanstack/react-query: ^5.100.10` confirmed in `osp-training/package.json`. Clean.
- `credentials: 'include'`: **PRESENT** on both `fetchProgress` and `postProgress` fetch calls. lfs_session cookie will travel on same-origin `/api/training/*` calls.
- 401 handling: **CORRECT** — both `fetchProgress` and `postProgress` check `res.status === 401` and call `window.location.replace('/login.html?reason=session_expired')`. Uses `replace()` so Back button doesn't loop. Returns `new Map()` or `null` before redirect to prevent React from blowing up mid-render.
- Optimistic update + rollback: **CORRECT** — `onMutate` snapshots previous cache via `qc.getQueryData`, applies optimistic update, returns `{ prev }`. `onError` restores `ctx.prev`. `onSettled` always invalidates.
- Cache key consistency: **CONSISTENT** — `PROGRESS_QUERY_KEY = ['training-progress']` is the single exported constant; both `useProgress` and `useAllProgress` import and use it. Clean.
- Status advancement logic in optimistic update: **VERIFIED** — `STATUS_RANK` map used to prevent regress in the optimistic path, consistent with server-side ON CONFLICT logic.

**FINDING A3-LOW: `getTopicProgress` assumes zero-padded lesson IDs.** `useProgress.js:224` — constructs `${courseId}.L${String(i).padStart(2, '0')}` (e.g. `T02.L01`). Lesson files confirm `meta.id = 'T02.L01'` format (verified in `L01.why-light-travels-in-glass.jsx:11`). Consistent today. If any future lesson is added with a non-padded ID, progress won't count. Not a current bug — just a format convention that must be honored when authoring.

---

## Axis 4: Tests

17 test cases confirmed (grep count verified).

**Sampled 5 tests vs their names:**

1. `'GET /api/training/progress returns 401 without auth'` — sends no token, expects 401, asserts `r.error` truthy. Tests what it says. ✓
2. `'POST /api/training/progress creates a row in training_progress'` — posts valid body, asserts `r.progress` present, then queries pool directly to verify DB row. Tests what it says. ✓
3. `'POST /api/training/progress does not regress completed status'` — seeds completed via API, then sends in_progress, asserts `r.progress.status === 'completed'`. Tests what it says. ✓
4. `'GET /api/training/admin/progress-overview returns 403 for non-admin'` — uses `nonAdminToken` (role=`design_engineer`), expects 403. Tests what it says. ✓
5. `'POST /api/training/cert-attempt records attempt and returns 201'` — sends full valid body including `domain_scores`, expects 201, asserts `id`, `cert_track`, `score`, `passed`. Tests what it says. ✓

Fixture cleanup: `after()` deletes the test user via `DELETE FROM users WHERE id = $1`. ON DELETE CASCADE removes all `training_progress`, `training_cert_attempts`, `training_topic_capstone_attempts` rows for that user. Admin user is cleaned up by `adminLogin()` / `close()` shared helpers. Clean.

**FINDING A4-MEDIUM: Missing 401 tests on GET /api/training/cert-attempts and POST /api/training/capstone-attempt.** These two endpoints have `requireAuth()` applied in the route (lines 188, 209) but the test suite does not verify unauthenticated requests return 401. The 401 path is covered for `GET /progress` (line 56) and `POST /progress` (line 74) and `POST /cert-attempt` (line 156) but not for the other two. The routes DO have `requireAuth()` applied — but test coverage gap means a future accidental removal would not be caught. Patch: add 2 tests (one `GET /cert-attempts` 401, one `POST /capstone-attempt` 401).

**FINDING A4-LOW: `POST /api/training/progress` upsert test does not verify `attempts` increment.** The upsert logic increments `attempts` when `best_score IS NOT NULL OR status = 'completed'`. The test `'upsert advances status to completed'` verifies `status` and `best_score` but not `attempts`. Non-blocking but reduces confidence in the attempt-counting logic.

---

## Axis 5: Server.js Wiring

- Route mounted at `server.js:717`: `require('./routes/training')(app, pool, { requireAuth })` — correct path, correct argument destructuring matching `installTrainingRoutes(app, pool, { requireAuth })` signature.
- Mount placement: **Correct** — placed after `routes/splice` and before the Mapbox token endpoint, well after the auth middleware installation at line 168 and `requireAuth` export at line 321. No auth bypass risk.
- No regression in `requireAuth` import: `requireAuth` is destructured from `require('./auth')` at line 168 — same reference passed to training routes. Clean.
- No tangling with `/training/` static routes (lines 438-441) — those serve SPA assets; the API routes are under `/api/training/*`. No path collision.

**CLEAN on all Axis 5 items.**

---

## Axis 6: Carter's Locks Compliance

- **Three quiz tier levels represented**: (a) per-lesson via `training_progress.best_score` (lesson quiz score), (b) per-topic via `training_topic_capstone_attempts` (end-of-course capstone), (c) per-cert via `training_cert_attempts` (full mock exam). All three tiers present. ✓
- **Cert tracks**: `['OSP-Designer', 'RCDD', 'CFOT', 'CFOS-O']` — matches Carter's locked list verbatim (CLAUDE.md §2, Architecture v2 Postgres schema note). NCATT is absent. ✓
- **Migration reversibility**: Migration 0035 uses `CREATE TABLE IF NOT EXISTS` — idempotent on re-run. No `DROP TABLE`. Safe for production deploy. ✓
- **API endpoints match spec**: All 6 endpoints from the locked spec are present. The admin endpoint shape (`GET /api/training/admin/progress-overview`) matches the spec. ✓
- **No Moodle dependencies introduced**: Training routes have zero imports from or references to `routes/oauth2.js` or Moodle code. ✓

**CLEAN on all Axis 6 items.**

---

## Axis 7: Hallucinations / AI References

- AI attribution comments (`// AI`, `// Claude`, `// LLM`, `// generated by`, `// assistant`): **NONE FOUND** across all 4 commits.
- Fabricated DB column names: All column names (`user_id`, `course_id`, `lesson_id`, `status`, `completion_pct`, `best_score`, `attempts`, `started_at`, `completed_at`, `last_seen_at`, `cert_track`, `attempt_date`, `score`, `passed`, `time_taken_seconds`, `domain_scores`, `total_items`, `correct_items`) exist in the migration and schema.sql. No phantoms.
- Commit SHA verification:
  - `bfe2184`: `git cat-file -t` → `commit`. Real. ✓
  - `1ffab84`: `git cat-file -t` → `commit`. Real. ✓
  - `c02f8ef`: `git cat-file -t` → `commit`. Real. ✓
  - `c3cd770`: `git cat-file -t` → `commit`. Real. ✓

**All 4 SHAs verified. Zero hallucinations detected.**

---

## Findings (severity-ranked)

| # | Severity | Description | File:line | Remediation |
|---|---|---|---|---|
| 1 | MEDIUM | POST /progress returns 200 on first insert — REST convention expects 201 for resource creation. Tests default to 200 so no test failure, but semantically misleading. | `routes/training.js:127` | Either return `status(201)` for first inserts (check `attempts === 1`) and add `expectStatus: 201` to the create test; OR document as intentional upsert-always-200. |
| 2 | MEDIUM | Missing 401 tests on GET /cert-attempts and POST /capstone-attempt. `requireAuth()` is applied in the route, so the gate exists — but coverage gap means future accidental removal won't be caught. | `tests/training.test.js` (absent) | Add 2 unauthenticated 401 test cases. |
| 3 | LOW | `domain_scores` accepted without type validation. Any value accepted, JSON.stringify'd, stored as JSONB. No SQL injection risk (parameterized), but arbitrary shapes accepted. | `routes/training.js:138,176` | Add `if (domain_scores !== undefined && domain_scores !== null && (typeof domain_scores !== 'object' || Array.isArray(domain_scores))) return res.status(400).json({ error: '...' })` |
| 4 | LOW | schema.sql FK constraint style (ADD CONSTRAINT) differs from migration inline REFERENCES style. Semantically equivalent but may cause CI schema-sync diff noise. | `schema.sql:3064-3079` | Verify CI diff check handles pg_dump style; document known diff or regenerate schema.sql from a fresh migration-applied DB. |
| 5 | LOW | `getTopicProgress` zero-pad format (L01) is a hardcoded format convention. No current mismatch — just requires authoring discipline. | `osp-training/src/hooks/useProgress.js:224` | Document the lesson ID format requirement in a comment or README; enforce in lesson file naming convention. |
| 6 | LOW | Attempts increment not tested. The ON CONFLICT logic increments `attempts` when score is provided or status is completed, but no test asserts on `attempts` value. | `tests/training.test.js` | Add assertion on `r.progress.attempts` in upsert test. |

---

## Verdict

**YELLOW** — 4 patches before OSP-RW.3 proceeds:

1. Resolve the HTTP 200 vs 201 ambiguity on POST /progress (document intent or fix status code + test).
2. Add 2 missing 401 tests (cert-attempts GET, capstone-attempt POST).
3. Add type guard for `domain_scores` field.
4. Verify CI schema-sync diff handles the pg_dump FK style difference.

None of these are showstoppers (no SQL injection, no auth bypass, no data loss risk, no IDOR). The backend is fundamentally correct. These are hygiene + coverage gaps that should be patched before the content authoring wave starts adding real user data.

---

## Coverage gaps (≤120 words)

Not reached within scope of this report:
- Railway deploy environment: did not verify that `DATABASE_URL` is actually set in Railway or that the migration runner executes `0035_training_tables.sql` on deploy. The migration file exists and is correctly named — runtime execution depends on the Railway migration hook configuration, not auditable from this repo alone.
- React Query `QueryClientProvider` presence in `App.jsx`: commit message states it's already there — not independently verified. If missing, all hooks will throw at runtime.
- `useAllProgress.store` return type: returns a `Map` now, not the old plain object. Callers of `useAllProgress().store` that assumed object-key access (`store[lessonId]`) will silently fail. Not audited — depends on how Splash/CourseView consume it.

=== RW2 RT REPORT END ===
