// tests/certificates.test.js
//
// Route-logic tests for the OSP certificate engine (routes/certificates.js,
// specs/certificates.md). Pure-Node, no DB / no node_modules: the real route
// module is mounted on a fake `app` and driven with mock req/res + a mock pg
// pool, so every endpoint's logic and the spec's security invariants are
// exercised without a live database.
//
//   node --test tests/certificates.test.js

const { test } = require('node:test');
const assert = require('node:assert/strict');
const makeCerts = require('../routes/certificates.js');

// ── tiny express-ish harness ─────────────────────────────────────────────────
function mount({ requireAdmin } = {}) {
  const routes = [];
  const app = {
    get: (path, ...handlers) => routes.push({ method: 'GET', path, handlers }),
    post: (path, ...handlers) => routes.push({ method: 'POST', path, handlers }),
  };
  const pool = { calls: [], impl: null, query(sql, params) { this.calls.push({ sql, params }); return this.impl(sql, params); } };
  // default admin gate = authed admin (individual tests can override)
  makeCerts(app, pool, { requireAdmin: requireAdmin || ((req, res, next) => next()) });
  return { routes, pool };
}
function findRoute(routes, method, path) {
  return routes.find(r => r.method === method && matchPath(r.path, path));
}
function matchPath(pattern, actual) {
  const pp = pattern.split('/'), ap = actual.split('/');
  if (pp.length !== ap.length) return null;
  const params = {};
  for (let i = 0; i < pp.length; i++) {
    if (pp[i].startsWith(':')) params[pp[i].slice(1)] = decodeURIComponent(ap[i]);
    else if (pp[i] !== ap[i]) return null;
  }
  return params;
}
async function invoke(routes, method, path, { body = {}, headers = {}, user = { username: 'admin' } } = {}) {
  const route = findRoute(routes, method, path);
  if (!route) throw new Error(`no route for ${method} ${path}`);
  const req = { params: matchPath(route.path, path), body, headers,
                socket: { remoteAddress: headers['x-forwarded-for'] || '10.0.0.1' }, user };
  const res = {
    statusCode: 200, body: undefined, _done: false,
    status(n) { this.statusCode = n; return this; },
    json(o) { this.body = o; this._done = true; return this; },
  };
  let idx = 0;
  function next() {
    const h = route.handlers[idx++];
    if (!h || res._done) return Promise.resolve();
    return Promise.resolve(h(req, res, next));
  }
  await next();
  for (let i = 0; i < 6; i++) await new Promise(r => setImmediate(r)); // flush mocked-async work
  return res;
}

const CERT_ROW = {
  id: 1, cert_no: 'LFS-OSP-2026-0001', user_id: 42, recipient_name: 'Rudy Douglas',
  course_code: 'OSP_DESIGN', course_title: 'Outside Plant (OSP) Fiber Design Course',
  completed_on: '2026-07-13', issued_at: '2026-07-13T00:00:00Z', issued_by: 'admin',
  revoked: false, revoked_reason: null,
};

// ── PUBLIC verify ────────────────────────────────────────────────────────────
test('verify: valid cert returns ONLY the 4 public fields — no PII (security invariant)', async () => {
  const { routes, pool } = mount();
  pool.impl = () => ({ rows: [CERT_ROW] });
  const res = await invoke(routes, 'GET', '/api/certificates/verify/LFS-OSP-2026-0001',
    { headers: { 'x-forwarded-for': '1.1.1.1' } });
  assert.equal(res.body.valid, true);
  assert.deepEqual(Object.keys(res.body).sort(),
    ['cert_no', 'completed_on', 'course_title', 'recipient_name', 'valid']);
  for (const leaked of ['user_id', 'username', 'email', 'score', 'issued_by', 'revoked', 'revoked_reason', 'id'])
    assert.ok(!(leaked in res.body), `public wire must not leak ${leaked}`);
});

test('verify: revoked cert is indistinguishable from nonexistent (valid:false)', async () => {
  const { routes, pool } = mount();
  pool.impl = () => ({ rows: [{ ...CERT_ROW, revoked: true }] });
  const res = await invoke(routes, 'GET', '/api/certificates/verify/LFS-OSP-2026-0001',
    { headers: { 'x-forwarded-for': '1.1.1.2' } });
  assert.deepEqual(res.body, { valid: false });
});

test('verify: nonexistent cert → valid:false', async () => {
  const { routes, pool } = mount();
  pool.impl = () => ({ rows: [] });
  const res = await invoke(routes, 'GET', '/api/certificates/verify/LFS-OSP-2026-9999',
    { headers: { 'x-forwarded-for': '1.1.1.3' } });
  assert.deepEqual(res.body, { valid: false });
});

test('verify: malformed input is rejected by regex WITHOUT touching the DB', async () => {
  const { routes, pool } = mount();
  pool.impl = () => { throw new Error('DB must not be queried for malformed input'); };
  for (const bad of ['abc', 'LFS-OSP-2026-001', "'; DROP TABLE x;--", 'LFS--2026-0001', 'X'.repeat(80)]) {
    const res = await invoke(routes, 'GET', '/api/certificates/verify/' + encodeURIComponent(bad),
      { headers: { 'x-forwarded-for': '1.1.1.4' } });
    assert.deepEqual(res.body, { valid: false }, `"${bad}" should be valid:false`);
  }
  assert.equal(pool.calls.length, 0, 'no DB call for any malformed input');
});

test('verify: input is upper-cased before lookup (case-insensitive certs)', async () => {
  const { routes, pool } = mount();
  pool.impl = () => ({ rows: [CERT_ROW] });
  await invoke(routes, 'GET', '/api/certificates/verify/lfs-osp-2026-0001',
    { headers: { 'x-forwarded-for': '1.1.1.5' } });
  assert.equal(pool.calls[0].params[0], 'LFS-OSP-2026-0001');
});

test('verify: rate limiter allows 30/min/IP then 429s the 31st', async () => {
  const { routes, pool } = mount();
  pool.impl = () => ({ rows: [] });
  const ip = '9.9.9.9';
  let last;
  for (let i = 1; i <= 31; i++) {
    last = await invoke(routes, 'GET', '/api/certificates/verify/LFS-OSP-2026-0001',
      { headers: { 'x-forwarded-for': ip } });
    if (i <= 30) assert.equal(last.statusCode, 200, `req ${i} should pass`);
  }
  assert.equal(last.statusCode, 429, '31st request in the window is rate-limited');
});

// ── ADMIN issue ──────────────────────────────────────────────────────────────
function issuePool({ user = { id: 42, recipient: 'Rudy Douglas' }, existing = [], count = 0, insert } = {}) {
  return (sql) => {
    if (sql.includes('FROM users')) return { rows: user ? [user] : [] };
    if (sql.includes('AND NOT revoked')) return { rows: existing };
    if (sql.includes('COUNT(*)')) return { rows: [{ n: count }] };
    if (sql.includes('INSERT INTO training_certificates')) return insert();
    throw new Error('unexpected sql: ' + sql);
  };
}

test('issue: new cert gets a formatted unique number LFS-OSP-<year>-0001', async () => {
  const { routes, pool } = mount();
  const year = new Date().getFullYear();
  pool.impl = issuePool({ count: 0, insert: () => ({ rows: [{ ...CERT_ROW, cert_no: `LFS-OSP-${year}-0001` }] }) });
  const res = await invoke(routes, 'POST', '/api/certificates/issue', { body: { user_id: 42, completed_on: '2026-07-13' } });
  assert.equal(res.body.certificate.cert_no, `LFS-OSP-${year}-0001`);
  assert.ok(!res.body.existing);
});

test('issue: idempotent — an active cert for the same user is returned, never duplicated', async () => {
  const { routes, pool } = mount();
  pool.impl = issuePool({ existing: [CERT_ROW], insert: () => { throw new Error('must NOT insert when a cert already exists'); } });
  const res = await invoke(routes, 'POST', '/api/certificates/issue', { body: { user_id: 42 } });
  assert.equal(res.body.existing, true);
  assert.equal(res.body.certificate.cert_no, 'LFS-OSP-2026-0001');
  assert.ok(!pool.calls.some(c => c.sql.includes('INSERT')), 'no INSERT on the idempotent path');
});

test('issue: unknown user → 404', async () => {
  const { routes, pool } = mount();
  pool.impl = issuePool({ user: null });
  const res = await invoke(routes, 'POST', '/api/certificates/issue', { body: { user_id: 999 } });
  assert.equal(res.statusCode, 404);
});

test('issue: missing user_id → 400; bad completed_on → 400', async () => {
  const { routes, pool } = mount();
  pool.impl = () => ({ rows: [] });
  assert.equal((await invoke(routes, 'POST', '/api/certificates/issue', { body: {} })).statusCode, 400);
  assert.equal((await invoke(routes, 'POST', '/api/certificates/issue',
    { body: { user_id: 42, completed_on: '07/13/2026' } })).statusCode, 400);
});

test('issue: retries on a 23505 unique collision and still allocates a number', async () => {
  const { routes, pool } = mount();
  const year = new Date().getFullYear();
  let inserts = 0;
  pool.impl = issuePool({
    count: 0,
    insert: () => { inserts++; if (inserts === 1) { const e = new Error('dup'); e.code = '23505'; throw e; } return { rows: [{ ...CERT_ROW, cert_no: `LFS-OSP-${year}-0002` }] }; },
  });
  const res = await invoke(routes, 'POST', '/api/certificates/issue', { body: { user_id: 42 } });
  assert.equal(inserts, 2, 'first INSERT raced (23505), retried once');
  assert.equal(res.body.certificate.cert_no, `LFS-OSP-${year}-0002`);
});

// ── ADMIN list + revoke ──────────────────────────────────────────────────────
test('revoke: existing cert → revoked; unknown id → 404', async () => {
  const { routes, pool } = mount();
  pool.impl = (sql) => sql.includes('UPDATE') ? ({ rows: [{ ...CERT_ROW, revoked: true }] }) : ({ rows: [] });
  const ok = await invoke(routes, 'POST', '/api/certificates/7/revoke', { body: { reason: 'test' } });
  assert.equal(ok.body.certificate.revoked, true);

  const { routes: r2, pool: p2 } = mount();
  p2.impl = () => ({ rows: [] });
  const missing = await invoke(r2, 'POST', '/api/certificates/999/revoke', { body: {} });
  assert.equal(missing.statusCode, 404);
});

// ── auth gating (security invariant) ─────────────────────────────────────────
test('issue/list/revoke are behind requireAdmin; public verify is NOT', async () => {
  let adminCalls = 0;
  const requireAdmin = (req, res, next) => { adminCalls++; return next(); };
  const { routes, pool } = mount({ requireAdmin });
  pool.impl = () => ({ rows: [] });

  // the three write/admin routes must include the requireAdmin middleware
  for (const [m, p] of [['POST', '/api/certificates/issue'], ['GET', '/api/certificates'], ['POST', '/api/certificates/1/revoke']]) {
    const route = findRoute(routes, m, p);
    assert.ok(route.handlers.includes(requireAdmin), `${m} ${p} must be gated by requireAdmin`);
  }
  // public verify must NOT include requireAdmin
  const verify = findRoute(routes, 'GET', '/api/certificates/verify/LFS-OSP-2026-0001');
  assert.ok(!verify.handlers.includes(requireAdmin), 'public verify must not be admin-gated');
});
