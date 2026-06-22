-- ============================================================================
-- wipe_test_data.sql  —  CLEAN-SLATE WIPE of all business/test data
-- ----------------------------------------------------------------------------
-- KEEPS:  users (logins)  +  schema_migrations (migration history)
-- WIPES:  everything else, including the staff directory (data only — table kept)
--
-- WHY THE staff DANCE: users.staff_id has an FK to staff, so TRUNCATE staff
-- CASCADE would pull users (logins) in. So we keep staff OUT of the cascade,
-- then NULL the users->staff link and DELETE staff rows (FK + table stay intact).
--
-- SAFETY: single transaction; if users ends up empty it RAISES and rolls back.
-- ============================================================================

BEGIN;

-- 1) Truncate every public table except users, schema_migrations, staff.
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename NOT IN ('users', 'schema_migrations', 'staff')
  LOOP
    EXECUTE format('TRUNCATE TABLE public.%I RESTART IDENTITY CASCADE', r.tablename);
  END LOOP;
END $$;

-- 2) Break the users->staff link, then clear the staff directory.
UPDATE public.users SET staff_id = NULL WHERE staff_id IS NOT NULL;
DELETE FROM public.staff;

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
