// routes/_permissions.js — System F permissions core (specs/roles-capabilities.md).
//
// Provides:
//   - CATALOG            the v1 permission catalog (16 keys, grouped by area).
//                        Standing rule (spec §Model): every new gated feature
//                        registers its key HERE — no hidden hardcoded gates.
//   - computeEffective() PURE resolver: (role, roleGrants, userGrants) → Set.
//                        Effective = base-role seed ∪ role grants ∪ personal
//                        grants. admin holds every key. Unit-tested in isolation
//                        (tests/permissions_effective.test.js).
//   - getEffective()     DB-backed wrapper: reads live (non-revoked) grants from
//                        `permission_grants` for a user's role + user id.
//   - requirePermission('key')  server-side middleware (the API is the gate;
//                        UI hiding is only convenience — hard rule 8 / spec §10).
//
// SECURITY POSTURE — this is an AUTH gate, so it FAILS CLOSED on error (deny),
// the opposite of _event_log.js telemetry (which fails open). admin is resolved
// by ROLE alone (no grant lookup), so a transient DB error still admits admins
// while safely denying everyone else.

// ── Catalog ────────────────────────────────────────────────────────────────
// area = the Settings-page group (Money · Hours · Projects · Mini-jobs ·
// Training · Files · People · System). label = human text for that page (#74).
// The 8 groups are the spec's; cockpit.view / events.manage / certificates.issue
// have no group of their own, so they slot into the closest named group — the
// grouping is cosmetic (drives #74 display only; enforcement keys are unchanged)
// and is easily re-homed if Carter/#74 wants a different bucket.
const CATALOG = [
  { key: 'money.view',               area: 'Money',     label: 'See money on project lists & reports' },
  { key: 'money.manage_billing',     area: 'Money',     label: 'Create & manage billing / invoices' },

  { key: 'hours.view_all',           area: 'Hours',     label: 'View everyone’s hours' },
  { key: 'hours.edit_subordinates',  area: 'Hours',     label: 'Void / change direct reports’ time' },
  { key: 'hours.edit_all',           area: 'Hours',     label: 'Void / change anyone’s time' },

  { key: 'projects.view_all',        area: 'Projects',  label: 'View all projects' },
  { key: 'projects.manage',          area: 'Projects',  label: 'Create & manage projects' },
  { key: 'cockpit.view',             area: 'Projects',  label: 'Open the production cockpit (incl. leaderboard)' },

  { key: 'minijobs.add',             area: 'Mini-jobs', label: 'Add mini-jobs' },
  { key: 'minijobs.template_manage', area: 'Mini-jobs', label: 'Manage mini-job checklist templates' },

  { key: 'training.admin',           area: 'Training',  label: 'Administer training content & visibility' },
  { key: 'certificates.issue',       area: 'Training',  label: 'Issue / revoke completion certificates' },

  { key: 'files.browse_all',         area: 'Files',     label: 'Browse all files (admin file browser)' },

  { key: 'events.manage',            area: 'People',    label: 'Create & manage events / nudges' },
  { key: 'people.manage',            area: 'People',    label: 'Manage people, roles & permission grants' },

  { key: 'system.logger_toggle',     area: 'System',    label: 'Toggle the diagnostics logger' },
];

const ALL_KEYS = CATALOG.map((c) => c.key);
const CATALOG_KEYS = new Set(ALL_KEYS);

// ── Base-role seeds (spec §Model + rulings) ──────────────────────────────────
// Only what the spec says a role holds BY DEFAULT. admin = everything (special-
// cased in computeEffective, not listed here). Managers get minijobs.add "by
// default" (ruling #4). Everything else is granted case-by-case (role or personal
// grants seeded in the migration + editable on the Settings page) — kept minimal
// so capability stays data-driven (D013), not hardcoded.
//   NOTE for VO/Registrar: whether managers should ALSO base-hold
//   hours.edit_subordinates (ruling #3) vs receive it as a seeded ROLE GRANT is
//   flagged on the issue — this file seeds it as a role grant (configurable),
//   NOT a base seed, so it shows on the Settings page and can be revoked.
const BASE_ROLE_SEED = {
  design_manager:     ['minijobs.add'],
  permitting_manager: ['minijobs.add'],
};

/**
 * PURE effective-permission resolver.
 * @param {Object} p
 * @param {string} p.role         the user's base role
 * @param {string[]} [p.roleGrants] permission keys granted to that role (non-revoked)
 * @param {string[]} [p.userGrants] permission keys granted to the user personally (non-revoked)
 * @returns {Set<string>} the effective permission keys
 */
function computeEffective({ role, roleGrants = [], userGrants = [] }) {
  // admin holds every catalog key, unconditionally.
  if (role === 'admin') return new Set(ALL_KEYS);

  const eff = new Set(BASE_ROLE_SEED[role] || []);
  for (const k of roleGrants) if (CATALOG_KEYS.has(k)) eff.add(k);
  for (const k of userGrants) if (CATALOG_KEYS.has(k)) eff.add(k);
  return eff;
}

/**
 * DB-backed effective permissions for a req.user.
 * Reads live, non-revoked grants so a flip on the Settings page takes effect
 * WITHOUT a deploy (spec done-when). Throws on DB error — callers decide the
 * fail-closed response (requirePermission denies; a display caller can catch).
 * @returns {Promise<Set<string>>}
 */
async function getEffective(pool, user) {
  if (!user || !user.role) return new Set();
  if (user.role === 'admin') return new Set(ALL_KEYS); // no lookup needed
  const { rows } = await pool.query(
    `SELECT permission_key, subject_type
       FROM permission_grants
      WHERE revoked_at IS NULL
        AND ( (subject_type = 'role' AND subject_id = $1)
           OR (subject_type = 'user' AND subject_id = $2) )`,
    [user.role, String(user.id)]
  );
  const roleGrants = [];
  const userGrants = [];
  for (const r of rows) {
    (r.subject_type === 'user' ? userGrants : roleGrants).push(r.permission_key);
  }
  return computeEffective({ role: user.role, roleGrants, userGrants });
}

/**
 * Middleware factory: gate a route on a single permission key.
 * The API is the gate (spec §Model). FAILS CLOSED — a DB error denies non-admins.
 */
function requirePermission(pool, key) {
  if (!CATALOG_KEYS.has(key)) {
    // Programmer error — a gate referencing an unregistered key. Fail loudly at
    // wire time rather than silently allowing/denying at request time.
    throw new Error(`requirePermission: unknown permission key "${key}" (register it in CATALOG)`);
  }
  return async (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Login required' });
    if (req.user.role === 'admin') return next(); // admin holds everything
    try {
      const eff = await getEffective(pool, req.user);
      if (!eff.has(key)) {
        return res.status(403).json({ error: 'Insufficient permissions for this action' });
      }
      return next();
    } catch (e) {
      // Fail CLOSED: never grant on error. Log for the operator.
      console.error('[permissions:requirePermission] DB error resolving grants', e && e.message);
      return res.status(403).json({ error: 'Insufficient permissions for this action' });
    }
  };
}

module.exports = {
  CATALOG,
  ALL_KEYS,
  CATALOG_KEYS,
  BASE_ROLE_SEED,
  computeEffective,
  getEffective,
  requirePermission,
};
