# 14 — Shared infra (db.js · db_migrations.js · _audit.js) — partial

> Mapped 2026-06-29. The DB pool, schema/migration machinery, and the audit logger that every mutation calls. (`_sse.js` + `_helpers.js` still pending → finish on a later wake.)

## ✅ O13 RESOLVED — migrations DO auto-run on every deploy
- `railway.json` `startCommand` = **`node server.js`**; `nixpacks.toml` `[start]` = `node server.js`. (`npm start`'s `prestart`→`scripts/auto_migrate.js` is therefore skipped — that part of the handoff is correct.)
- BUT `server.js start()` calls **`runMigrations(pool)` itself** on every boot (independent of prestart). `node server.js` → `require.main===module` → `start()` → `runMigrations`.
- **∴ Pushing a `migrations/NNNN_*.sql` file makes it auto-apply on the next Railway deploy.** No manual step. The HANDOFF/memory "startCommand skips auto-migrate → apply manually" is **STALE/MISLEADING** — corrected in `reference_deployment` + O13.
- Caveat: a failing migration logs + is NOT recorded (retries next boot); `start()` wraps `runMigrations` in try/catch so a failure logs but doesn't crash boot (the CLI paths `npm run migrate`/`schema:sync`/`auto_migrate` DO exit non-zero on failure).

## `db_migrations.js` (132 ln) — versioned runner
`runMigrations(pool)`: ensure `schema_migrations(filename PK, applied_at, checksum)` → list `/migrations/*.sql` sorted by name → for each not-yet-applied: run the **whole file as one query** inside its own BEGIN/COMMIT (whole-file so dollar-quoted PL/pgSQL bodies aren't split), record filename+fnv1a checksum; on error ROLLBACK + log + continue (unrecorded → retries next boot); throw at end if any failed. Checksum lets tampering with an applied file be detected. This is the **modern schema path**; coexists with the legacy `bootstrapV3Schema` (chunk 01).

## `db.js` (256 ln) — the pool + schema apply
- pg `Pool`; **DATE (oid 1082) returned as `'YYYY-MM-DD'` string** (avoids JS `Date` parsing bugs in the frontend); TIMESTAMPTZ stays a Date.
- `DATABASE_URL` required (FATAL log if missing); SSL in prod. **Battle-scarred timeouts** (comments cite real 502/lock incidents): pool max 20 (`PG_POOL_MAX`), connectionTimeout 10s, statement_timeout 30s, query_timeout 35s, `idle_in_transaction_session_timeout` 60s (per-connection via `connect` listener — catches crashed-mid-BEGIN boots that held locks). Good resilience engineering.
- `splitStatements(sql)` — careful SQL splitter (line/block comments, single/double quotes, **dollar-quoted blocks**) so schema.sql can be applied statement-by-statement.
- `initSchema()` — read schema.sql → split → **two-pass apply** (forward-FK failures retry on pass 2) → **defer user-FK statements** (`billing_batches`/`invoice_templates`/`customer_clients` → `users(id)`) onto `pool._deferredStatements`, applied post-auth by `applyDeferredSchemaStatements()` (server.js step). All idempotent. → So there are effectively **3 overlapping schema layers**: schema.sql (initSchema, 2-pass+deferred) + `bootstrapV3Schema` (legacy idempotent DDL) + `runMigrations` (versioned). A lot of redundancy; the migrations runner is the path forward, the rest is backward-compat (cleanup target post-cutover).

## `_audit.js` (189 ln) — the audit logger (called on ~every mutation)
- `logAudit(pool, {req, action, entity_type, entity_id, before, after, source, meta})` → INSERT into `audit_log` (actor from req.user, ip, ua). Guards wrong-signature callers; **errors swallowed (never breaks the operation)**. Imported by basically every route module on writes.
- `redactPII(obj)` — deep-clone + redact sensitive keys via **precise regex** (password/token/secret/api_key/credential-hash/jwt/session/cookie/authorization/pin/otp/ssn/card/bank/dob) with cycle detection; deliberately does NOT redact emails/names/addresses (operational).
- `archiveOldAuditRows(pool)` — RUS retention: sets `archived_at` for rows older than `hot_retention_days` (min 7, default ~1100 ≈ 3yr); **rows are never deleted** (a DELETE-prevention trigger enforces append-only). Env-gated daily scheduler (chunk 01).
- **⚠ Plan-vs-built:** ROADMAP Phase 0 said "remove the audit-log + retention feature (unnecessary)." It is **NOT removed** — it's active and wired into nearly every mutation, append-only, with archival. For real revenue + government (RUS) data this trail is arguably valuable; the "remove it" decision looks abandoned/should be formally reversed. (→ flag for Carter; don't remove without confirming.)

## `_sse.js` (254 ln) — shared live-updates
`GET /api/events/stream` (requireAuth). Channels: `admin`, `team:design|permitting|construction`, `user:<id>` (reserved). Role→channel: admin → all; **managers → ONLY their team** (Item 15 fix removed managers from `admin` to stop cross-team data leak); customer → none. `broadcast(channel, event, payload)` is called by write handlers (e.g. staff.js). **Heartbeat every 25s RE-VALIDATES the session vs live DB** (role/active/tokens_invalid_after via the JWT `iat`) → closes deactivated/demoted/revoked sessions with a `session_invalid` event (security: revocation takes effect within 25s, not at tab close). Dead-conn purge on failed write.
- ⚠ minor: `construction_manager`/`construction_engineer` roles are referenced here but **don't exist in `VALID_ROLES`** (auth has design/permitting + contractor only). So `team:construction` is broadcast-to (staff.js) but only `admin` subscribes — a latent/no-op path until construction roles exist.

## `_helpers.js` (308 ln) — LEGACY projects-tree math + undo infra
Operates on the legacy `projects` table (NOT the keystone). `updateProjectHours`/`batchUpdateProjectHours` (recompute `projects.actual_hours` from time_entries + children, propagate up; cycle-safe; batch = level-by-level bottom-up perf) · `collectProjectTree` (WITH RECURSIVE descendant walk for tree/cascade delete + undo) · **`saveUndoBucket`/`popUndoBucket`** (the undo infra — `undo_buckets`, 60s TTL, used by destructive legacy endpoints) · `calcProjectFinancials` + `computeTaperedPermittingHours` · `snapHoursToQuarter`.
- **Two embedded BUSINESS RULES worth remembering:** (1) **permitting hours = randomized 25–30 hrs/mile (0.25 steps), then taper −2 hrs/mile after 2 miles, floor 5, min 25 total** (owner spec; the random factor is saved per-project so re-renders are stable). (2) **hours always snap to the 0.25 grid, NEVER lossy-round** (owner "NO ROUNDING EVER" rule). These are real domain rules → relevant to any hours/billing work + D013 (the random factor is a quirk).
- → **Reinforces O14:** the legacy projects delete has undo (saveUndoBucket) + tree-collect; the new keystone SA delete (chunk 03) is a plain DELETE with neither. The undo infra already exists to fix O14.

## `lib/browser_pool.js` (11KB) — puppeteer browser pool for PDF rendering (invoices, splice diagrams). Deep-read deferred (support infra) → revisit at billing/splice PDF chunks.

## `scripts/` (dev/ops tooling — functional summary; deep-read deferred unless relevant)
`auto_migrate.js` (51, the skipped `prestart` hook → wraps runMigrations) · `run_migrations.js` (261, `npm run migrate` CLI) · `sync_schema.js` (566, `npm run schema:sync` — regen schema.sql via pg_dump16) · `validate_schema.js` (310, CI schema-drift check) · `deploy_preflight.js` (295) · `onboard_client.js` (395, client setup script) · `_preview_boot.js` (10, the live-UI preview boot — `claude_ceo` admin login). These are the schema-tooling triad behind O13/schema layers + the preview harness I'll use for user-testing.

## Reapproach-if
- Chunk 18 (migrations/schema): cross-check the 3 schema layers; confirm migration count + that 0079 etc. are recorded; deep-read sync_schema/validate_schema if drift questions arise.
- Chunk 06 (projects): `_helpers` math is consumed there; confirm legacy projects still in use vs keystone.
- Chunk 01 reapproach: ✅ O13 resolved (migrations auto-run) — spine "VERIFY" now confirmed.
