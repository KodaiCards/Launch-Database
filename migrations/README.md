# Migrations

Versioned SQL migrations applied at boot via `db_migrations.runMigrations(pool)`.

## Filename convention

```
NNNN_short_label.sql
```

`NNNN` is a zero-padded sequence number (`0001`, `0002`, …). Files are
applied in alphabetical order, so the sequence number defines the apply
order. Use four digits — that's room for ten thousand migrations.

## Authoring rules

- **Make every statement idempotent.** Use `CREATE TABLE IF NOT EXISTS`,
  `ADD COLUMN IF NOT EXISTS`, `CREATE INDEX IF NOT EXISTS`, etc. A
  re-run on a partially-failed migration must not corrupt anything.
- **One concept per file.** Smaller migrations are easier to reason
  about and roll back if needed.
- **No data backfills that can't be re-run safely.** If you need to
  populate a new column, write the UPDATE so it's a no-op the second
  time (e.g. `WHERE col IS NULL`).
- **No DROP TABLE / DROP COLUMN without an explicit owner sign-off.**
  These are irreversible; the migration log doesn't capture pre-state.

## How the runner works

1. `schema_migrations(filename, applied_at, checksum)` is created on
   first run.
2. Files in this directory are sorted by name.
3. Every file not present in `schema_migrations` is read, executed
   inside a single transaction (`BEGIN … COMMIT`), and recorded.
4. Failure aborts the migration AND every later one in the same boot.
   Server boot continues after the failure; the operator sees the
   error in stderr and the rest of the app still runs against the
   pre-migration schema.

## Coexists with `bootstrapV3Schema`

The legacy `bootstrapV3Schema()` in `server.js` runs every boot too. It
contains historical schema work that pre-dates this runner. New schema
changes belong here, in a numbered migration. Over time we can move
chunks out of `bootstrapV3Schema` into discrete migration files.

## Sample migration

```sql
-- migrations/0002_add_widget_kind.sql
ALTER TABLE widgets
  ADD COLUMN IF NOT EXISTS kind VARCHAR(40) DEFAULT 'standard';

CREATE INDEX IF NOT EXISTS idx_widgets_kind ON widgets (kind)
  WHERE kind IS NOT NULL;
```
