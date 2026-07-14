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

/**
 * PURE effective-permission resolver.
 *
 * L-016 NO BAKING: the ONLY coded permission behavior is the admin bootstrap
 * (admin implicitly holds everything, so the first grant can be made). NO role
 * defaults are baked here — a role default like "managers get minijobs.add" is
 * DATA (an editable, revocable role-grant ROW in permission_grants), not code,
 * and flows in through `roleGrants`. Effective = role grants ∪ personal grants ∪
 * custom-role bundle keys, filtered to registered catalog keys.
 *
 * @param {Object} p
 * @param {string} p.role         the user's base role (only 'admin' is special)
 * @param {string[]} [p.roleGrants] permission keys granted to that role (non-revoked rows)
 * @param {string[]} [p.userGrants] permission keys granted to the user personally (non-revoked rows)
 * @param {string[]} [p.bundleKeys] permission keys from the user's assigned bundles (#76)
 * @returns {Set<string>} the effective permission keys
 */
function computeEffective({ role, roleGrants = [], userGrants = [], bundleKeys = [] }) {
  // Admin bootstrap — the only coded default (L-016).
  if (role === 'admin') return new Set(ALL_KEYS);

  const eff = new Set();
  for (const list of [roleGrants, userGrants, bundleKeys]) {
    for (const k of list) if (CATALOG_KEYS.has(k)) eff.add(k);
  }
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
  const bundleKeys = await getBundleKeys(pool, user);
  return computeEffective({ role: user.role, roleGrants, userGrants, bundleKeys });
}

/**
 * Permission keys the user gains from every custom-role BUNDLE they're assigned
 * (#76). DEGRADES to [] (never throws) if the bundle tables aren't present yet
 * (migration ordering) or on a transient error — bundles are ADDITIVE, so their
 * absence must never deny a user their base/grant permissions. Errors are logged.
 */
async function getBundleKeys(pool, user) {
  try {
    const { rows } = await pool.query(
      `SELECT rbk.permission_key
         FROM user_role_bundles urb
         JOIN role_bundle_keys rbk ON rbk.bundle_id = urb.bundle_id
        WHERE urb.user_id = $1`,
      [String(user.id)]
    );
    return rows.map((r) => r.permission_key);
  } catch (e) {
    console.error('[permissions:getBundleKeys] (degrading to no-bundles)', e && e.message);
    return [];
  }
}

/**
 * Would granting `key` to (subjectType, subjectId) escalate the CALLER themselves?
 * "Nobody grants themselves" (spec §VO lenses) — enforced on BOTH paths:
 *   - user path: granting to your own user id;
 *   - role path: granting to your OWN role (which unions straight back onto your
 *     effective set via getEffective's role match — the escalation the user-only
 *     guard missed). Granting to a role you DON'T hold, or to another user, is
 *     legitimate delegation and is allowed.
 * PURE + string-normalized so a number/string id can't slip past. Unit-tested.
 */
function isSelfGrant(user, subjectType, subjectId) {
  if (!user) return false;
  if (subjectType === 'user') return String(subjectId) === String(user.id);
  if (subjectType === 'role') return String(subjectId) === String(user.role);
  return false;
}

/**
 * Does the caller's HOURS capability grant them a time edit/void — layered ON TOP
 * of the existing team/ownership scope (#75, Flag-B AUGMENT ruling; never removes
 * existing access)? `hours.edit_all` → anyone; `hours.edit_subordinates` → their
 * `manager_id` direct reports (isDirectReport resolved by the caller). PURE + tested.
 */
function capabilityGrantsTimeEdit({ editAll, editSubordinates, isDirectReport }) {
  return !!editAll || (!!editSubordinates && !!isDirectReport);
}

/**
 * May this caller REWRITE a bundle's key set (#76)? A non-admin who currently
 * HOLDS the bundle must not — editing a bundle you wear to add keys self-grants
 * them (the #73 BLOCKER-1 self-escalation class, via bundle-edit instead of a
 * direct grant). Renaming is unaffected (caller passes holdsBundle only when
 * keys are being changed). admin is unrestricted — it already holds every key,
 * so no edit can escalate it. PURE + unit-tested.
 */
function mayEditBundleKeys({ role, holdsBundle }) {
  if (role === 'admin') return true;
  return !holdsBundle;
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

/**
 * Server-side field-strip (hard rule 8): return `obj` with `fields` OMITTED
 * ENTIRELY unless `allowed` is true. PURE — never mutates the input; returns a
 * shallow copy without the dropped keys (so the value is absent from the JSON
 * wire, not nulled/hidden). Used by the money.view project-list strip; reusable
 * by #75's cross-route application. Callers FAIL CLOSED (allowed=false on error).
 */
function omitUnless(obj, fields, allowed) {
  if (allowed || !obj) return obj;
  const drop = fields instanceof Set ? fields : new Set(fields);
  const out = {};
  for (const k in obj) if (!drop.has(k)) out[k] = obj[k];
  return out;
}

module.exports = {
  CATALOG,
  ALL_KEYS,
  CATALOG_KEYS,
  capabilityGrantsTimeEdit,
  computeEffective,
  getEffective,
  isSelfGrant,
  mayEditBundleKeys,
  omitUnless,
  requirePermission,
};
