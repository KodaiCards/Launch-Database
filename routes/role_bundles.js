// routes/role_bundles.js — System F custom-role BUNDLES (specs/roles-capabilities.md §5.5, #76).
// Registrar wires the mount: require('./routes/role_bundles')(app, pool);
//
// Custom roles = named, editable bundles of EXISTING catalog keys, assignable to
// users. Editing a bundle's keys is a LIVE union — every holder's effective set
// updates on next resolve (the resolver reads role_bundle_keys; no copy). Backend
// only — the bundle UI lives on the Settings page (#74).
//
// Gating: everything is `people.manage` (server-side gate; same as grants). NOBODY
// self-assigns a bundle (the #73 BLOCKER-1 self-escalation class, extended).
// Creating new permission KEYS is deliberately OUT (keys are feature-born); a
// bundle may only compose keys already in the catalog.

const { CATALOG_KEYS, requirePermission, isSelfGrant, mayEditBundleKeys } = require('./_permissions');

module.exports = function (app, pool) {
  const peopleManage = requirePermission(pool, 'people.manage');

  // Keep only real, registered catalog keys (defense-in-depth; a bundle can't
  // smuggle an unknown/typo key that would silently enforce nothing).
  function cleanKeys(keys) {
    if (!Array.isArray(keys)) return [];
    return [...new Set(keys.filter((k) => CATALOG_KEYS.has(k)))];
  }
  function parseId(raw) {
    const n = Number(raw);
    return Number.isInteger(n) && n > 0 ? n : null;
  }

  // List every bundle with its keys + how many users hold it (Settings page #74).
  app.get('/api/role-bundles', peopleManage, async (req, res) => {
    try {
      const { rows } = await pool.query(
        `SELECT b.id, b.name, b.created_at,
                COALESCE(ARRAY_AGG(DISTINCT rbk.permission_key)
                         FILTER (WHERE rbk.permission_key IS NOT NULL), '{}') AS keys,
                COUNT(DISTINCT urb.user_id) AS holder_count
           FROM role_bundles b
           LEFT JOIN role_bundle_keys rbk ON rbk.bundle_id = b.id
           LEFT JOIN user_role_bundles urb ON urb.bundle_id = b.id
          GROUP BY b.id
          ORDER BY b.name`
      );
      res.json({ bundles: rows });
    } catch (e) {
      console.error('[role_bundles:list]', e && e.message);
      res.status(500).json({ error: 'Could not load bundles.' });
    }
  });

  // Create a bundle. name required + unique; keys optional (validated to catalog).
  app.post('/api/role-bundles', peopleManage, async (req, res) => {
    const name = String((req.body && req.body.name) || '').trim();
    if (!name) return res.status(400).json({ error: 'Bundle name required.' });
    const keys = cleanKeys(req.body && req.body.keys);
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const { rows } = await client.query(
        `INSERT INTO role_bundles (name, created_by) VALUES ($1, $2) RETURNING id`,
        [name, String(req.user.id)]
      );
      const id = rows[0].id;
      for (const k of keys) {
        await client.query(
          `INSERT INTO role_bundle_keys (bundle_id, permission_key) VALUES ($1, $2)
           ON CONFLICT DO NOTHING`,
          [id, k]
        );
      }
      await client.query('COMMIT');
      res.json({ ok: true, id });
    } catch (e) {
      await client.query('ROLLBACK').catch(() => {});
      if (e && e.code === '23505') return res.status(409).json({ error: 'A bundle with that name already exists.' });
      console.error('[role_bundles:create]', e && e.message);
      res.status(500).json({ error: 'Could not create bundle.' });
    } finally {
      client.release();
    }
  });

  // Rename and/or REPLACE the key set (live union — every holder updates).
  app.put('/api/role-bundles/:id', peopleManage, async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid bundle id.' });
    const hasName = req.body && typeof req.body.name === 'string';
    const hasKeys = req.body && Array.isArray(req.body.keys);
    if (!hasName && !hasKeys) return res.status(400).json({ error: 'Nothing to update (name and/or keys).' });
    const name = hasName ? req.body.name.trim() : null;
    if (hasName && !name) return res.status(400).json({ error: 'Bundle name cannot be blank.' });
    const keys = hasKeys ? cleanKeys(req.body.keys) : null;

    // Self-escalation guard (#76 / #73 BLOCKER-1 class): a non-admin cannot rewrite
    // the KEYS of a bundle they personally hold (that self-grants those keys).
    // Renaming is fine; admins are unrestricted (they already hold every key).
    if (hasKeys) {
      try {
        const held = await pool.query(
          'SELECT 1 FROM user_role_bundles WHERE user_id = $1::uuid AND bundle_id = $2',
          [String(req.user.id), id]
        );
        if (!mayEditBundleKeys({ role: req.user.role, holdsBundle: held.rowCount > 0 })) {
          return res.status(403).json({ error: 'You cannot change the permissions of a bundle you are assigned — ask an admin.' });
        }
      } catch (e) {
        // Fail closed on the security guard: if we can't verify membership, deny the key edit.
        console.error('[role_bundles:holder-check]', e && e.message);
        return res.status(500).json({ error: 'Could not verify bundle membership.' });
      }
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const { rowCount } = await client.query('SELECT 1 FROM role_bundles WHERE id = $1', [id]);
      if (!rowCount) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'No such bundle.' }); }
      if (hasName) {
        await client.query('UPDATE role_bundles SET name = $1, updated_at = NOW() WHERE id = $2', [name, id]);
      }
      if (hasKeys) {
        // Replace the whole set → the live union every holder resolves against.
        await client.query('DELETE FROM role_bundle_keys WHERE bundle_id = $1', [id]);
        for (const k of keys) {
          await client.query(
            'INSERT INTO role_bundle_keys (bundle_id, permission_key) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [id, k]
          );
        }
        await client.query('UPDATE role_bundles SET updated_at = NOW() WHERE id = $1', [id]);
      }
      await client.query('COMMIT');
      res.json({ ok: true });
    } catch (e) {
      await client.query('ROLLBACK').catch(() => {});
      if (e && e.code === '23505') return res.status(409).json({ error: 'A bundle with that name already exists.' });
      console.error('[role_bundles:update]', e && e.message);
      res.status(500).json({ error: 'Could not update bundle.' });
    } finally {
      client.release();
    }
  });

  // Delete a bundle (cascade drops its keys + all assignments).
  app.delete('/api/role-bundles/:id', peopleManage, async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid bundle id.' });
    try {
      const { rowCount } = await pool.query('DELETE FROM role_bundles WHERE id = $1', [id]);
      res.json({ ok: true, deleted: rowCount });
    } catch (e) {
      console.error('[role_bundles:delete]', e && e.message);
      res.status(500).json({ error: 'Could not delete bundle.' });
    }
  });

  // Assign a bundle to a user. people.manage only; NOBODY self-assigns.
  app.post('/api/role-bundles/:id/assign', peopleManage, async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid bundle id.' });
    const userId = String((req.body && req.body.user_id) || '').trim();
    if (!userId) return res.status(400).json({ error: 'user_id required.' });
    // No self-assignment (self-escalation — the #73 BLOCKER-1 class).
    if (isSelfGrant(req.user, 'user', userId)) {
      return res.status(403).json({ error: 'You cannot assign a bundle to yourself.' });
    }
    try {
      const u = await pool.query('SELECT 1 FROM users WHERE id::text = $1', [userId]);
      if (!u.rowCount) return res.status(400).json({ error: 'No such user.' });
      const b = await pool.query('SELECT 1 FROM role_bundles WHERE id = $1', [id]);
      if (!b.rowCount) return res.status(404).json({ error: 'No such bundle.' });
      await pool.query(
        `INSERT INTO user_role_bundles (user_id, bundle_id, assigned_by)
         VALUES ($1::uuid, $2, $3) ON CONFLICT DO NOTHING`,
        [userId, id, String(req.user.id)]
      );
      res.json({ ok: true });
    } catch (e) {
      console.error('[role_bundles:assign]', e && e.message);
      res.status(500).json({ error: 'Could not assign bundle.' });
    }
  });

  // Unassign a bundle from a user.
  app.post('/api/role-bundles/:id/unassign', peopleManage, async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid bundle id.' });
    const userId = String((req.body && req.body.user_id) || '').trim();
    if (!userId) return res.status(400).json({ error: 'user_id required.' });
    try {
      const { rowCount } = await pool.query(
        'DELETE FROM user_role_bundles WHERE user_id = $1::uuid AND bundle_id = $2',
        [userId, id]
      );
      res.json({ ok: true, removed: rowCount });
    } catch (e) {
      console.error('[role_bundles:unassign]', e && e.message);
      res.status(500).json({ error: 'Could not unassign bundle.' });
    }
  });
};
