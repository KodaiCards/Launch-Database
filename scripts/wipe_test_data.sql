-- ============================================================================
-- wipe_test_data.sql  —  CLEAN-SLATE WIPE of all business/test data
-- ----------------------------------------------------------------------------
-- KEEPS:  users (logins)  +  schema_migrations (migration history)
-- WIPES:  everything else in the public schema (clients, ECs, service areas,
--         projects, jobs, rates, contracts, time entries, invoices, splice,
--         permits, budgets, staff, etc.)
--
-- SAFETY:
--   * Take a Railway Postgres snapshot/backup BEFORE running this.
--   * Runs in a single transaction. If anything would empty the users table,
--     it RAISES and the whole thing ROLLS BACK — you cannot get locked out.
--   * Idempotent: safe to run again; truncated tables just stay empty.
--
-- HOW TO RUN (pick one):
--   A) Railway -> your Postgres service -> "Data" tab -> query box -> paste + run
--   B) Railway CLI:   railway connect postgres   (then paste this file)
--   C) Any client (psql/TablePlus) using DATABASE_URL from Railway -> Postgres -> Variables
-- ============================================================================

BEGIN;

-- 1) Truncate every public table except the keep-list.
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename NOT IN ('users', 'schema_migrations')
  LOOP
    EXECUTE format('TRUNCATE TABLE public.%I RESTART IDENTITY CASCADE', r.tablename);
  END LOOP;
END $$;

-- 2) Clear any now-dangling staff link on the kept user rows.
UPDATE public.users SET staff_id = NULL WHERE staff_id IS NOT NULL;

-- 3) Safety guard: never commit a wipe that emptied the logins.
DO $$
DECLARE user_count int;
BEGIN
  SELECT count(*) INTO user_count FROM public.users;
  IF user_count = 0 THEN
    RAISE EXCEPTION 'SAFETY ABORT: users table is empty after wipe — rolling back the entire transaction';
  END IF;
  RAISE NOTICE 'Wipe complete. Logins preserved: % user row(s).', user_count;
END $$;

COMMIT;
