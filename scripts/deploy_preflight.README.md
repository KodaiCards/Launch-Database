# deploy_preflight.js

A pre-deployment validation script that checks critical readiness criteria before migrations or production cutover.

## Usage

```bash
node scripts/deploy_preflight.js [--json] [--strict]
```

## Flags

- `--json` — Output machine-readable JSON instead of formatted report
- `--strict` — Treat warnings as blocking errors (exit code 2 instead of 1)

## Checks Performed

### 1. **Environment Variables**
Verifies required env vars are set:
- `JWT_SECRET` — API signing key
- `UPLOAD_DIR` — File upload directory
- `BASE_URL` — Application base URL

**Result:** PASS if all set. FAIL if any missing.

### 2. **UPLOAD_DIR Writability**
- Checks directory exists (creates if missing)
- Tests write + delete permission
- Reports path on success

**Result:** PASS if writable. FAIL if permission denied or inaccessible.

### 3. **Database Migrations**
- Queries `schema_migrations` table for applied migrations
- Lists migration files in `migrations/` directory
- Compares to identify pending migrations

**Result:** PASS if all migrations applied. WARN if pending (safe to deploy and run migrations in order). FAIL if DB unreachable.

### 4. **Critical Tables Existence**
Verifies these tables exist (sanity check that prior migrations ran):
- `workspace_folders`
- `project_photos`
- `audit_log`
- `client_organizations`

**Result:** PASS if all exist. FAIL if any missing.

### 5. **Schema File Consistency**
- Reads `schema.sql`
- Counts `CREATE TABLE` and `CREATE INDEX` statements
- Validates non-empty

**Result:** PASS if schema file is present and well-formed. WARN if file missing or appears empty.

### 6. **Optional Assets**
Checks for optional (non-blocking) files:
- `public/js/vendor/opencv.min.js` — Scanner library (OpenCV)
- `public/js/vendor/jscanify.min.js` — Scanner library (jscanify)
- `public/downloads/installers/` — Desktop installer directory

**Result:** PASS if all present. WARN if any missing (scanner or installer non-functional, but app deployable).

## Exit Codes

| Code | Meaning | Safe to Deploy |
|------|---------|---|
| **0** | GO — all checks pass | ✅ Yes |
| **1** | WARN — non-blocking issues | ⚠️ Yes, with caution |
| **2** | STOP — blocking issues | ❌ No |

With `--strict` flag, warnings also exit with code 2.

## Output Formats

### Human-Readable (default)

```
╭─ Deploy Preflight Check ─────────────────────────────────╮
│
│  ✓  Environment variables
│  ✓  UPLOAD_DIR writability
│  ✓  Database migrations
│     All 42 migrations applied
│  ✓  Critical tables
│  ✓  Schema file
│  ⚠️  Optional assets
│     Missing: Scanner (OpenCV), Desktop installer directory
│
╰─ Verdict: WARN ──────────────────────────────────────────╯

⚠️  Non-blocking issues detected. Deploy with caution.
```

### JSON (`--json`)

```json
{
  "verdict": "WARN",
  "checks": [
    {
      "label": "Environment variables",
      "status": "✓",
      "detail": "All 3 required vars set",
      "severity": "pass"
    },
    {
      "label": "Optional assets",
      "status": "⚠️",
      "detail": "Missing: Scanner (OpenCV), Desktop installer directory",
      "severity": "warn"
    }
  ]
}
```

## Integration Examples

### Railway Pre-Deploy Hook

Add to `railway.json`:

```json
{
  "builder": "heroku.buildpacks",
  "buildCommand": "node scripts/deploy_preflight.js --strict && npm run build"
}
```

If preflight fails, build aborts.

### GitHub Actions Workflow

```yaml
- name: Pre-deploy validation
  run: node scripts/deploy_preflight.js --strict
```

### Local Checklist Before `git push`

```bash
# Before pushing to main:
node scripts/deploy_preflight.js
# If exit code 2: fix issues before push
# If exit code 0 or 1: safe to push
```

## Troubleshooting

### "Could not connect to database"
- Verify `DATABASE_URL` is set
- Check database is running and reachable
- On local dev: `psql postgres://localhost/launch_db` to test

### "Missing: X migration"
- Migrations in `migrations/` directory have not been applied to DB
- Safe to deploy; migration runner will apply them in sequence on the next boot/restart

### "Missing: critical table X"
- A prior migration that creates this table failed or did not run
- **BLOCKING.** Run migrations first: `npm run migrations` or via Railway console
- Do NOT deploy until all critical tables exist

### "Missing: optional assets" (warnings)
- Non-critical. Scanner features will be unavailable until assets are added
- Desktop installer download tile will show "not available"
- Safe to deploy; users can continue without these features

## How to Extend

Add new checks by creating a function and calling it from `main()`:

```javascript
async function checkMyFeature(report, pool) {
  try {
    // Your check logic
    report.pass('Feature X', 'Details...');
  } catch (err) {
    report.fail('Feature X', err.message);
  }
}

// In main():
await checkMyFeature(report, pool);
```

Use `report.pass()`, `report.warn()`, or `report.fail()` to record results.

## See Also

- `scripts/onboard_client.js` — Client organization setup
- `scripts/sync_schema.js` — Sync schema.sql from database
- `npm run migrations` — Apply pending migrations
