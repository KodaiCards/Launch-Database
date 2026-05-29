# Database Migrations CLI

Idempotent database migrations runner wrapping `db_migrations.js`.

## Usage

```bash
# Apply all pending migrations
node scripts/run_migrations.js

# Or with npm script (if added to package.json):
npm run migrate
npm run migrate:list
npm run migrate:dry-run
npm run migrate:up
npm run migrate:target
```

## Commands

### `apply` (default)

Applies all pending migrations in sequence.

```bash
node scripts/run_migrations.js
```

Output:
```
[migrations] applied 0001_initial_baseline.sql
[migrations] applied 0002_add_widget_table.sql
```

### `--list`

Shows applied vs pending migrations without making changes.

```bash
node scripts/run_migrations.js --list
```

Output:
```
=== Database Migrations Status ===

Total: 45 migrations

APPLIED:
  ✓ 0001_initial_baseline.sql
  ✓ 0002_add_widget_table.sql

PENDING:
  ○ 0003_add_feature_x.sql
  ○ 0004_drop_legacy_column.sql

Status: 2 applied, 2 pending
```

### `--dry-run`

Shows what migrations WOULD apply without executing them.

```bash
node scripts/run_migrations.js --dry-run
```

Output:
```
=== Dry Run (no changes) ===

Would apply 2 migration(s):

  → 0003_add_feature_x.sql
  → 0004_drop_legacy_column.sql
```

### `--up <N>`

Applies the next N pending migrations only.

```bash
node scripts/run_migrations.js --up 3
```

Output:
```
Applying next 3 of 5 pending migration(s)...

✓ 0003_add_feature_x.sql
✓ 0004_drop_legacy_column.sql
✓ 0005_add_index.sql

Applied 3 migration(s).
```

### `--target <filename>`

Applies all migrations up to and including the specified migration file.

```bash
node scripts/run_migrations.js --target 0010_important_schema.sql
```

Output:
```
Applying migrations through '0010_important_schema.sql' (4 pending)...

✓ 0007_intermediate.sql
✓ 0008_another.sql
✓ 0009_penultimate.sql
✓ 0010_important_schema.sql

Applied 4 migration(s) through '0010_important_schema.sql'.
```

## Migration Files

Migrations live in `/migrations/` directory with naming convention:

```
0001_initial_baseline.sql
0002_add_widget_table.sql
0003_drop_legacy_column.sql
```

Filename format: `NNNN_label.sql` where `NNNN` is zero-padded integer.

### Requirements

- Each file is valid PostgreSQL
- Use idempotent constructs: `CREATE TABLE IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS`, etc.
- Re-running a half-applied migration must be safe
- PL/pgSQL functions are safe (dollar-quoted, run as single statement)
- Semicolons separate statements but are handled by the runner

## How It Works

1. **Tracking table:** Maintains `schema_migrations` table with applied filenames, timestamps, and checksums
2. **Idempotent:** Reads applied filenames before running; skips anything already in the table
3. **Atomic:** Each migration runs in its own transaction (BEGIN/COMMIT or ROLLBACK)
4. **Continues on failure:** A broken migration does NOT block subsequent ones; failed migration is re-tried on next run
5. **Checksums:** Stores file hash to detect tampering; if a file is modified after application, reapplying it is unsafe and will fail on mismatch

## Environment

Reads `DATABASE_URL` from environment:

```bash
DATABASE_URL=postgresql://user:pass@localhost:5432/mydb node scripts/run_migrations.js --list
```

Requires `pg` (PostgreSQL client) to be installed.

## Adding to package.json

For convenience, add to `package.json` scripts:

```json
{
  "scripts": {
    "migrate": "node scripts/run_migrations.js",
    "migrate:list": "node scripts/run_migrations.js --list",
    "migrate:dry-run": "node scripts/run_migrations.js --dry-run",
    "migrate:up": "node scripts/run_migrations.js --up",
    "migrate:target": "node scripts/run_migrations.js --target"
  }
}
```

Then use:

```bash
npm run migrate
npm run migrate:list
npm run migrate:dry-run
npm run migrate:up 5
npm run migrate:target 0050_important.sql
```

## Debugging

Enable verbose SQL output with:

```bash
DEBUG=1 node scripts/run_migrations.js
```

Errors include full stack traces with `DEBUG=1`.

## See Also

- `db_migrations.js` — core idempotent runner
- `schema.sql` — generated schema snapshot (read-only, do not edit)
- `/migrations/` — directory containing all .sql files
- `schema_migrations` table — persistent log of applied migrations
