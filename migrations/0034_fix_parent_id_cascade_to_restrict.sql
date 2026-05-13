-- Migration 0034: corrective FK update for projects.parent_id
--
-- Wave 1.5 C-4 follow-up. The previous schema.sql had a contradictory ALTER
-- TABLE statement that, on databases where it ran BEFORE the CREATE TABLE
-- was updated to RESTRICT, left parent_id with ON DELETE CASCADE. That FK
-- action is dangerous: deleting a rollup project would cascade-delete every
-- descendant project AND their time_entries (billing history loss).
--
-- The schema.sql contradiction itself was removed in commit dae8491; fresh
-- DBs now correctly land with RESTRICT from the CREATE TABLE. This migration
-- fixes existing deployments that have CASCADE in place.
--
-- Idempotent: checks the current FK action via pg_constraint and only swaps
-- if CASCADE is currently set. Safe to run on any database state.

DO $$
DECLARE
  current_action CHAR(1);
  fk_name TEXT;
BEGIN
  -- Find the FK on projects.parent_id and read its delete action.
  -- pg_constraint.confdeltype: 'c'=CASCADE, 'r'=RESTRICT, 'n'=SET NULL, 'd'=SET DEFAULT, 'a'=NO ACTION
  SELECT conname, confdeltype INTO fk_name, current_action
  FROM pg_constraint
  WHERE conrelid = 'public.projects'::regclass
    AND contype = 'f'
    AND conkey = ARRAY[(
      SELECT attnum FROM pg_attribute
      WHERE attrelid = 'public.projects'::regclass AND attname = 'parent_id'
    )]
  LIMIT 1;

  IF fk_name IS NULL THEN
    RAISE NOTICE 'No FK found on projects.parent_id — skipping. (Column may not have an FK on this deployment.)';
    RETURN;
  END IF;

  IF current_action = 'r' OR current_action = 'a' THEN
    RAISE NOTICE 'projects.parent_id FK is already % — no change needed.',
      CASE current_action WHEN 'r' THEN 'RESTRICT' ELSE 'NO ACTION' END;
    RETURN;
  END IF;

  RAISE NOTICE 'Migrating projects.parent_id FK from action=% to RESTRICT (FK name: %)',
    current_action, fk_name;

  EXECUTE format('ALTER TABLE projects DROP CONSTRAINT %I', fk_name);

  ALTER TABLE projects
    ADD CONSTRAINT projects_parent_id_fkey
    FOREIGN KEY (parent_id) REFERENCES projects(id) ON DELETE RESTRICT;

  RAISE NOTICE 'projects.parent_id FK swapped to ON DELETE RESTRICT.';
END $$;
