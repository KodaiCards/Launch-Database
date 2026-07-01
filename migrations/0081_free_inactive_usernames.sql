-- Migration 0081: free usernames held by already-inactive / legacy accounts.
--
-- WP-D (O39). `users.username` is UNIQUE NOT NULL and soft-delete/deactivate KEEPS
-- the row, so a deactivated or legacy-inactive account keeps its username reserved
-- → registration and People "Add person" wrongly report "username taken" for a name
-- whose only holder is inactive.
--
-- Going forward, auth.js releases the name on deactivate/soft-delete by renaming it
-- to a traceable tombstone `<username>__inactive_<shortid>` (original stays visible +
-- recoverable). This one-time migration applies the SAME treatment to every user that
-- is ALREADY inactive so their names free up immediately.
--
-- Idempotent: names already carrying the `__inactive_<hex>` tombstone are skipped, so
-- re-running never double-tombstones. The suffix is clamped so the result fits
-- VARCHAR(60), matching the runtime helper.

UPDATE users
SET username = LEFT(username, GREATEST(1, 60 - LENGTH('__inactive_') - 6))
               || '__inactive_' || SUBSTRING(MD5(random()::text || id::text) FROM 1 FOR 6),
    updated_at = NOW()
WHERE active = FALSE
  AND username !~ '__inactive_[0-9a-f]{6,}$';
