# Schema Auto-Sync Tooling — Fix Report

**Wave:** schema-sync tooling  
**Date:** 2026-05-14  
**Scope:** Zero-maintenance schema.sql ↔ migrations parity automation

---

## Deliverables

### Deliverable 1 — `npm run schema:sync`

**File:** `scripts/sync_schema.js`  
**Entry in package.json:** `"schema:sync": "node scripts/sync_schema.js"`

The script:
1. Creates a uniquely-named temp Postgres DB (`schema_sync_<ts>_<rand>`)
2. Applies the core bootstrap in order:
   - pgcrypto extension
   - `scripts/schema_core.sql` — original hand-authored CREATE TABLE bootstrap (never regenerated)
   - `AUTH_DDL` — users table + user-FK columns (inlined from auth.js)
   - `V3_DDL` — v3 ALTERs + new tables (inlined from server.js bootstrapV3Schema)
   - `TIMECLOCK_DDL` — time_clock_sessions + time_entry_audit (inlined from timeclock_module.js)
3. Runs all 34 migrations via the existing `runMigrations()` runner
4. Runs `pg_dump --schema-only --no-owner --no-privileges --no-tablespaces --no-comments`
5. Post-processes the dump:
   - Strips `\restrict` / `\unrestrict` security markers (non-deterministic per-run random hash)
   - Strips `SET` statements and pg_dump header comments
   - Normalises blank lines (3+ → 2)
   - Sorts `CREATE [UNIQUE] INDEX` lines alphabetically within each paragraph block
6. Writes `schema.sql`
7. Terminates lingering connections, drops the temp DB
8. Reports line delta and elapsed time

**Required env:** `DATABASE_URL` or `TEST_DATABASE_URL` — parent connection string; role needs `CREATEDB` privilege.

### Deliverable 2 — CI gate

**File:** `.github/workflows/test.yml`  
**Step name:** "Schema sync check"

- Runs `npm run schema:sync` against the existing Postgres service container (`TEST_DATABASE_URL` already wired)
- Runs `git diff --exit-code schema.sql`
- On diff: fails with message "schema.sql is out of sync with migrations. Run `npm run schema:sync` locally and commit the result."
- Positioned AFTER `npm test` so migration failures surface in the test step first

---

## Verification

### Determinism

Two consecutive runs against the same migration set:

```
[sync_schema] schema.sql was 2950 lines, now 2950 lines (Δ +0)
[sync_schema] Done in 1.6s
diff → (empty)  →  DETERMINISTIC — confirmed
```

### Fresh DB boot

`psql fresh_db < schema.sql` on a newly created empty database:

```
0 errors
```

All tables, functions, triggers, indexes, and constraints applied cleanly.

### End-to-end sample output

```
[sync_schema] Creating temp database: schema_sync_1778718850904_5ecf4c56
[sync_schema] Temp database created.
[sync_schema] Installing pgcrypto...
[sync_schema] Applying core tables from scripts/schema_core.sql...
[sync_schema] Core schema applied (100 stmts)
[sync_schema] Applying auth DDL (users table)...
[sync_schema] Applying v3 bootstrap DDL...
[sync_schema] Applying timeclock DDL...
[sync_schema] Running versioned migrations...
[sync_schema] Migrations: 34 applied, 0 skipped
[sync_schema] Running pg_dump...
[sync_schema] Post-processing dump...
[sync_schema] schema.sql was 1280 lines, now 2950 lines (Δ +1670)
[sync_schema] Wrote /path/to/schema.sql
[sync_schema] Temp database dropped.
[sync_schema] Done in 1.4s
```

---

## Commits

| SHA | Description |
|---|---|
| `3064612` | feat: schema:sync script — auto-regenerate schema.sql from migrations |
| `003031e` | chore: regenerate schema.sql — auto-generated baseline from migrations |
| `1c155ed` | fix: use schema_core.sql as stable bootstrap input; add CI schema sync gate |
| (this commit) | docs: FIX_REPORT_SCHEMA_SYNC.md |

---

## Design decisions

**Why `scripts/schema_core.sql` instead of reading the committed `schema.sql`?**  
`schema.sql` is the OUTPUT of the sync script. Once it is in pg_dump format, re-applying it to a temp DB introduces post-migration constraints that conflict with migrations trying to apply them again. `schema_core.sql` holds only the original pre-migration CREATE TABLE statements and is never regenerated — it is a stable, human-maintained bootstrap layer.

**When does `schema_core.sql` need updating?**  
Only when a new core table is added that doesn't fit into the migrations pattern (rare). Normal schema evolution goes through `/migrations/*.sql` exclusively.

**Non-deterministic pg_dump elements stripped:**  
`\restrict` / `\unrestrict` lines — per-run random hash security markers added by pg_dump 16.x. Stripped globally across all lines (not just the header block) for robustness.

---

## Standing maintenance rule

Schema changes → add a migration in `/migrations/`. After merging, run `npm run schema:sync` locally and commit the updated `schema.sql`. CI will catch any PR where this is forgotten.

=== SCHEMA SYNC TOOLING REPORT END ===
