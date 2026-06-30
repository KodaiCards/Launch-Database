// O34 regression guard — requireStaff must exclude trainee + customer and
// admit every internal staff role. This is the gate that stops a self-signup
// trainee (or a client-facing customer) from reading business-data GETs
// (clients / pricing / projects / engineering-contracts / contracts / etc.).
// Pure-Node: requireStaff is a role-check middleware, no DB / no signing.
const { test } = require('node:test');
const assert = require('node:assert');
const { requireStaff, STAFF_ROLES, VALID_ROLES } = require('../auth');

// Drive the middleware with a fake (req,res,next) and capture the outcome.
function run(role) {
  let status = 200, nexted = false;
  const req = { user: role ? { role } : null };
  const res = { status(c) { status = c; return this; }, json() { return this; } };
  requireStaff(req, res, () => { nexted = true; });
  return { status, nexted };
}

test('STAFF_ROLES excludes the two external roles', () => {
  assert.ok(!STAFF_ROLES.includes('trainee'), 'trainee must not be staff');
  assert.ok(!STAFF_ROLES.includes('customer'), 'customer must not be staff');
});

test('STAFF_ROLES includes every internal role (derived from VALID_ROLES)', () => {
  const expectedStaff = VALID_ROLES.filter(r => r !== 'trainee' && r !== 'customer');
  assert.deepEqual([...STAFF_ROLES].sort(), expectedStaff.sort());
  for (const r of ['admin', 'design_manager', 'permitting_manager',
                   'design_engineer', 'permitting_engineer', 'contractor']) {
    assert.ok(STAFF_ROLES.includes(r), `${r} should be staff`);
  }
});

test('requireStaff 403s trainee and customer (the O34 leak roles)', () => {
  for (const r of ['trainee', 'customer']) {
    const { status, nexted } = run(r);
    assert.equal(status, 403, `${r} should be 403`);
    assert.equal(nexted, false, `${r} must not reach the handler`);
  }
});

test('requireStaff admits every staff role (portals keep working)', () => {
  for (const r of ['admin', 'design_manager', 'permitting_manager',
                   'design_engineer', 'permitting_engineer', 'contractor']) {
    const { nexted } = run(r);
    assert.ok(nexted, `${r} should pass through`);
  }
});

test('requireStaff 401s an unauthenticated request', () => {
  const { status } = run(null);
  assert.equal(status, 401);
});
