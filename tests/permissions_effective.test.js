// Pure-function tests for the System F effective-permission resolver
// (routes/_permissions.js computeEffective). No DB, no network — this proves
// the base ∪ role-grant ∪ personal-grant math + the admin-holds-everything rule
// before we trust it on every gated route (spec: roles-capabilities.md).

const { test } = require('node:test');
const assert = require('node:assert/strict');
const {
  capabilityGrantsTimeEdit,
  computeEffective,
  isSelfGrant,
  mayEditBundleKeys,
  omitUnless,
  ALL_KEYS,
  CATALOG,
  CATALOG_KEYS,
} = require('../routes/_permissions');

test('admin holds every catalog key, regardless of grants', () => {
  const eff = computeEffective({ role: 'admin' });
  assert.equal(eff.size, ALL_KEYS.length);
  for (const k of ALL_KEYS) assert.ok(eff.has(k), `admin missing ${k}`);
});

test('a base engineer with no grants has nothing', () => {
  const eff = computeEffective({ role: 'design_engineer' });
  assert.equal(eff.size, 0);
});

test('managers base-hold minijobs.add and nothing else by default', () => {
  for (const role of ['design_manager', 'permitting_manager']) {
    const eff = computeEffective({ role });
    assert.deepEqual([...eff].sort(), ['minijobs.add']);
  }
});

test('role grants union onto the base seed', () => {
  const eff = computeEffective({
    role: 'design_manager',
    roleGrants: ['hours.edit_subordinates'],
  });
  assert.ok(eff.has('minijobs.add'));        // base
  assert.ok(eff.has('hours.edit_subordinates')); // role grant
  assert.equal(eff.size, 2);
});

test('personal grants union in (Carter’s one-person mini-jobs case)', () => {
  const eff = computeEffective({
    role: 'design_engineer',
    userGrants: ['minijobs.add'],
  });
  assert.deepEqual([...eff], ['minijobs.add']);
});

test('role + personal grants both apply and de-dupe', () => {
  const eff = computeEffective({
    role: 'permitting_engineer',
    roleGrants: ['projects.view_all'],
    userGrants: ['projects.view_all', 'cockpit.view'],
  });
  assert.deepEqual([...eff].sort(), ['cockpit.view', 'projects.view_all']);
});

test('unknown / stale keys not in the catalog are ignored (defense-in-depth)', () => {
  const eff = computeEffective({
    role: 'design_engineer',
    roleGrants: ['money.view', 'not.a.real.key'],
    userGrants: ['also.bogus'],
  });
  assert.deepEqual([...eff], ['money.view']);
});

test('Rudy Douglas (Director) personal-grant shape: oversight, NOT billing', () => {
  // Rudy is a person (no "director" role), so his grants are personal.
  const eff = computeEffective({
    role: 'permitting_engineer', // whatever base account role he holds
    userGrants: ['cockpit.view', 'hours.view_all', 'projects.view_all'],
  });
  assert.ok(eff.has('cockpit.view'));
  assert.ok(eff.has('hours.view_all'));
  assert.ok(eff.has('projects.view_all'));
  assert.ok(!eff.has('money.manage_billing'), 'Rudy must NOT hold billing');
});

// ── bundle keys union onto the effective set (#76 custom-role bundles) ───────
test('bundle keys union onto base + grants (the "Director" bundle case)', () => {
  const eff = computeEffective({
    role: 'permitting_engineer',
    bundleKeys: ['cockpit.view', 'hours.view_all', 'projects.view_all'],
  });
  assert.deepEqual([...eff].sort(), ['cockpit.view', 'hours.view_all', 'projects.view_all']);
});

test('bundle keys de-dupe with role/personal grants and honor base seed', () => {
  const eff = computeEffective({
    role: 'design_manager',                 // base: minijobs.add
    roleGrants: ['projects.view_all'],
    userGrants: ['cockpit.view'],
    bundleKeys: ['cockpit.view', 'files.browse_all'],
  });
  assert.deepEqual([...eff].sort(), ['cockpit.view', 'files.browse_all', 'minijobs.add', 'projects.view_all']);
});

test('unknown bundle keys are filtered (bundles compose catalog keys only)', () => {
  const eff = computeEffective({ role: 'design_engineer', bundleKeys: ['money.view', 'not.a.key'] });
  assert.deepEqual([...eff], ['money.view']);
});

test('admin ignores bundles too — still holds exactly the catalog', () => {
  const eff = computeEffective({ role: 'admin', bundleKeys: ['money.view'] });
  assert.equal(eff.size, ALL_KEYS.length);
});

// ── isSelfGrant: "nobody grants themselves" on BOTH paths (red-team BLOCKER 1) ──
test('self-grant BLOCKED on the user path (own id, string or number)', () => {
  const user = { id: 'uuid-abc', role: 'design_manager' };
  assert.equal(isSelfGrant(user, 'user', 'uuid-abc'), true);
  assert.equal(isSelfGrant({ id: 5, role: 'x' }, 'user', '5'), true); // normalized
});

test('self-grant BLOCKED on the ROLE path (own role) — the escalation the user-only guard missed', () => {
  const user = { id: 'uuid-abc', role: 'design_manager' };
  assert.equal(isSelfGrant(user, 'role', 'design_manager'), true);
});

test('granting to ANOTHER user or a role you do NOT hold is allowed (legit delegation)', () => {
  const user = { id: 'uuid-abc', role: 'design_manager' };
  assert.equal(isSelfGrant(user, 'user', 'uuid-other'), false);
  assert.equal(isSelfGrant(user, 'role', 'permitting_manager'), false);
  assert.equal(isSelfGrant(user, 'role', 'admin'), false);
});

test('isSelfGrant is safe on missing user / unknown subject_type', () => {
  assert.equal(isSelfGrant(null, 'user', 'x'), false);
  assert.equal(isSelfGrant({ id: 1, role: 'admin' }, 'bogus', '1'), false);
});

// ── omitUnless: the money.view field-strip (hard rule 8) ─────────────────────
const MONEY = ['billing_rate', 'expected_revenue', 'actual_revenue', 'projected_revenue', 'manual_invoice_amount', 'ytd_revenue'];

test('allowed=true returns the row untouched ($ visible to money.view holders)', () => {
  const row = { id: 'p1', name: 'Job', billing_rate: 90, ytd_revenue: 1200 };
  assert.equal(omitUnless(row, MONEY, true), row); // same ref, nothing stripped
});

test('allowed=false OMITS every money field ENTIRELY (absent, not nulled)', () => {
  const row = { id: 'p1', name: 'Job', billing_rate: 90, expected_revenue: 5, actual_revenue: 3, projected_revenue: 7, manual_invoice_amount: 2, ytd_revenue: 1200, status: 'active' };
  const out = omitUnless(row, MONEY, false);
  for (const k of MONEY) assert.ok(!(k in out), `${k} must be absent from the wire`);
  // non-money fields survive
  assert.deepEqual({ id: out.id, name: out.name, status: out.status }, { id: 'p1', name: 'Job', status: 'active' });
});

test('omitUnless never mutates the input row', () => {
  const row = { id: 'p1', billing_rate: 90 };
  omitUnless(row, MONEY, false);
  assert.equal(row.billing_rate, 90, 'original row must be unchanged');
});

test('omitUnless is null-safe', () => {
  assert.equal(omitUnless(null, MONEY, false), null);
  assert.equal(omitUnless(undefined, MONEY, true), undefined);
});

// ── mayEditBundleKeys: no self-escalation via editing a bundle you hold (#76) ──
test('non-admin who HOLDS the bundle cannot rewrite its keys', () => {
  assert.equal(mayEditBundleKeys({ role: 'design_manager', holdsBundle: true }), false);
});

test('non-admin who does NOT hold the bundle may edit its keys (normal delegation)', () => {
  assert.equal(mayEditBundleKeys({ role: 'design_manager', holdsBundle: false }), true);
});

test('admin may edit any bundle keys — already holds every key, cannot escalate', () => {
  assert.equal(mayEditBundleKeys({ role: 'admin', holdsBundle: true }), true);
  assert.equal(mayEditBundleKeys({ role: 'admin', holdsBundle: false }), true);
});

// ── capabilityGrantsTimeEdit: hours-override layers ON TOP (#75 Flag-B) ───────
test('hours.edit_all grants the edit regardless of direct-report status', () => {
  assert.equal(capabilityGrantsTimeEdit({ editAll: true, editSubordinates: false, isDirectReport: false }), true);
});

test('hours.edit_subordinates grants ONLY for a direct report', () => {
  assert.equal(capabilityGrantsTimeEdit({ editAll: false, editSubordinates: true, isDirectReport: true }), true);
  assert.equal(capabilityGrantsTimeEdit({ editAll: false, editSubordinates: true, isDirectReport: false }), false);
});

test('no hours capability → no bypass (existing team/ownership scope still runs)', () => {
  assert.equal(capabilityGrantsTimeEdit({ editAll: false, editSubordinates: false, isDirectReport: true }), false);
  assert.equal(capabilityGrantsTimeEdit({}), false);
});

test('catalog is internally consistent: 16 unique keys, all grouped', () => {
  assert.equal(CATALOG.length, 16);
  assert.equal(CATALOG_KEYS.size, 16); // no dupes
  for (const c of CATALOG) {
    assert.ok(c.key && c.area && c.label, `catalog row incomplete: ${JSON.stringify(c)}`);
  }
});
