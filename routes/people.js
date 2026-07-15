// routes/people.js — unified People roster for the operations cluster.
//
// WHY THIS EXISTS (Track A / System F first slice): "staff" and "users" were
// two disconnected surfaces. The operations People page read `/api/staff/all`
// (the lean billing-entity `staff` table), so self-signups — which `POST
// /api/auth/register` inserts into `users` only, with no `staff` row — never
// appeared. Admin account management + delete were stranded in legacy
// admin.html. Net: from where Carter works, new people were invisible and
// unmanageable.
//
// This endpoint is the single MERGED source so nobody is invisible regardless
// of which table they live in:
//   • every `users` row (every login, incl. brand-new trainee signups), with
//     its linked `staff` record if any; PLUS
//   • every `staff` row that has no linked user (legacy billing-only people).
//
// Mutations reuse the existing, already-admin-gated CRUD:
//   create/edit/delete login → /api/users (auth.js)
//   create staff record       → /api/staff (routes/staff.js)
//   link login ↔ staff        → PUT /api/users/:id { staff_id }
// so this file stays read-only and carries no auth logic of its own.

module.exports = function installPeopleRoutes(app, pool, mw) {
  const requireAdmin = (mw && mw.requireAdmin) || ((req, res, next) => next());
  // System F (#77): the people directory is delegable via people.manage (admin
  // still passes — requirePermission admits admin by role).
  const { requirePermission } = require('./_permissions');
  const canManagePeople = requirePermission(pool, 'people.manage');

  // GET /api/people — the unified roster. Admin-only (people management).
  app.get('/api/people', canManagePeople, async (req, res) => {
    try {
      const { rows } = await pool.query(`
        SELECT
          'user'                       AS kind,
          u.id                         AS user_id,
          u.staff_id                   AS staff_id,
          u.username                   AS username,
          u.role                       AS role,
          u.team                       AS team,
          COALESCE(u.extra_teams,'{}') AS extra_teams,
          COALESCE(u.full_name, u.username) AS display_name,
          u.full_name                  AS full_name,
          u.email                      AS email,
          u.active                     AS active,
          u.last_login                 AS last_login,
          u.created_at                 AS created_at,
          s.name                       AS staff_name
        FROM users u
        LEFT JOIN staff s ON s.id = u.staff_id

        UNION ALL

        SELECT
          'staff'              AS kind,
          NULL::uuid           AS user_id,
          st.id                AS staff_id,
          NULL                 AS username,
          NULL                 AS role,
          NULL                 AS team,
          '{}'::text[]         AS extra_teams,
          st.name              AS display_name,
          st.name              AS full_name,
          NULL                 AS email,
          st.active            AS active,
          NULL::timestamptz    AS last_login,
          st.created_at        AS created_at,
          st.name              AS staff_name
        FROM staff st
        WHERE NOT EXISTS (SELECT 1 FROM users u2 WHERE u2.staff_id = st.id)
      `);

      // Sort client-side-friendly: active first, then by display name.
      rows.sort((a, b) => {
        if (a.active !== b.active) return a.active ? -1 : 1;
        return String(a.display_name || '').localeCompare(String(b.display_name || ''));
      });

      res.json(rows);
    } catch (e) {
      console.error('[people:list]', e && e.message);
      res.status(500).json({ error: 'Failed to load people.' });
    }
  });
};
