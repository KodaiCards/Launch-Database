// tests/client_portal_v2.test.js
// Foundation tests for client portal v1 (E2).
// Covers: org CRUD, user creation, token generation, auth middleware,
// revocation, expiry, inactive-user/org blocking, and non-admin 403 gate.
//
// NOTE: No live Postgres in this sandbox — syntax/load check only.
// CI runs these against a real DB via the service-container pattern.

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  bootTestServer, close, adminLogin, requestJson,
  uniqueTag, pool,
} = require('./_helpers');

let adminToken;

// Direct-DB helper for client-portal tables.
async function insertOrg({ name, status = 'active' } = {}) {
  const n = name || uniqueTag('cp-org');
  const { rows } = await pool.query(
    `INSERT INTO client_organizations (name, status) VALUES ($1, $2) RETURNING *`,
    [n, status]
  );
  return rows[0];
}

async function insertUser(orgId, { status = 'active', is_primary = false } = {}) {
  const { rows } = await pool.query(
    `INSERT INTO client_users (org_id, name, email, is_primary, status) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [orgId, uniqueTag('cp-user'), uniqueTag('user') + '@test.invalid', is_primary, status]
  );
  return rows[0];
}

async function insertToken(userId, { revoked = false, expiredDaysAgo = null } = {}) {
  const crypto = require('crypto');
  const raw = crypto.randomBytes(32).toString('base64url');
  const hash = crypto.createHash('sha256').update(raw).digest('hex');
  let expiresAt = null;
  if (expiredDaysAgo !== null) {
    expiresAt = new Date(Date.now() - expiredDaysAgo * 86400 * 1000).toISOString();
  }
  const revokedAt = revoked ? new Date().toISOString() : null;
  const { rows } = await pool.query(
    `INSERT INTO client_tokens (client_user_id, token_hash, expires_at, revoked_at) VALUES ($1, $2, $3, $4) RETURNING *`,
    [userId, hash, expiresAt, revokedAt]
  );
  return { raw, token: rows[0] };
}

test.before(async () => {
  await bootTestServer();
  adminToken = await adminLogin();
});

test.after(async () => {
  // Cleanup: delete all test orgs (cascade deletes users + tokens).
  await pool.query(`DELETE FROM client_organizations WHERE name LIKE 'cp-org-%'`);
  await close();
});

// ── Admin CRUD ────────────────────────────────────────────────────────────

test('POST /api/admin/client-orgs creates org', async () => {
  const name = uniqueTag('cp-org');
  const org = await requestJson('POST', '/api/admin/client-orgs', {
    token: adminToken,
    body: { name, short_name: 'TST', theme_color: '#123456' },
    expectStatus: 201,
  });
  assert.equal(org.name, name);
  assert.equal(org.short_name, 'TST');
  assert.equal(org.status, 'active');
});

test('POST /api/admin/client-orgs rejects missing name', async () => {
  await requestJson('POST', '/api/admin/client-orgs', {
    token: adminToken,
    body: {},
    expectStatus: 400,
  });
});

test('GET /api/admin/client-orgs returns list', async () => {
  const orgs = await requestJson('GET', '/api/admin/client-orgs', {
    token: adminToken,
  });
  assert.ok(Array.isArray(orgs));
});

test('GET /api/admin/client-orgs/:id returns org + users', async () => {
  const org = await insertOrg();
  const data = await requestJson('GET', `/api/admin/client-orgs/${org.id}`, {
    token: adminToken,
  });
  assert.equal(data.org.id, org.id);
  assert.ok(Array.isArray(data.users));
});

test('PUT /api/admin/client-orgs/:id updates status', async () => {
  const org = await insertOrg();
  const updated = await requestJson('PUT', `/api/admin/client-orgs/${org.id}`, {
    token: adminToken,
    body: { status: 'suspended' },
  });
  assert.equal(updated.status, 'suspended');
});

test('PUT /api/admin/client-orgs/:id rejects invalid status', async () => {
  const org = await insertOrg();
  await requestJson('PUT', `/api/admin/client-orgs/${org.id}`, {
    token: adminToken,
    body: { status: 'hacked' },
    expectStatus: 400,
  });
});

test('POST /api/admin/client-orgs/:id/users creates user', async () => {
  const org = await insertOrg();
  const user = await requestJson('POST', `/api/admin/client-orgs/${org.id}/users`, {
    token: adminToken,
    body: { name: 'Test Contact', email: 'tc@test.invalid', is_primary: true },
    expectStatus: 201,
  });
  assert.equal(user.org_id, org.id);
  assert.equal(user.is_primary, true);
});

test('POST generate token returns raw_token once', async () => {
  const org = await insertOrg();
  const user = await insertUser(org.id);
  const result = await requestJson('POST', `/api/admin/client-orgs/${org.id}/users/${user.id}/tokens`, {
    token: adminToken,
    body: {},
    expectStatus: 201,
  });
  assert.ok(result.raw_token, 'raw_token present');
  assert.ok(result.login_url.includes('/client/login/'), 'login_url contains path');
  assert.ok(result.warning, 'warning message present');
});

test('POST /api/admin/client-tokens/:id/revoke marks token revoked', async () => {
  const org = await insertOrg();
  const user = await insertUser(org.id);
  const { raw, token } = await insertToken(user.id);
  const result = await requestJson('POST', `/api/admin/client-tokens/${token.id}/revoke`, {
    token: adminToken,
    body: {},
  });
  assert.ok(result.ok);
  assert.ok(result.revoked_at);
});

// ── Non-admin gets 403 ────────────────────────────────────────────────────

test('unauthenticated request to admin orgs endpoint returns 401', async () => {
  const { baseUrl } = require('./_helpers');
  const r = await fetch(`${baseUrl()}/api/admin/client-orgs`);
  assert.ok(r.status === 401 || r.status === 403, `expected 401 or 403, got ${r.status}`);
});

// ── Token consume flow ────────────────────────────────────────────────────

test('valid token login sets cookie and redirects', async () => {
  const { baseUrl } = require('./_helpers');
  const org = await insertOrg();
  const user = await insertUser(org.id);
  const { raw } = await insertToken(user.id);

  const res = await fetch(`${baseUrl()}/client/login/${raw}`, { redirect: 'manual' });
  assert.ok(res.status === 302 || res.status === 301, `expected redirect, got ${res.status}`);
  const loc = res.headers.get('location');
  assert.ok(loc && loc.includes('/client/'), `redirect to /client/, got: ${loc}`);
  const setCookie = res.headers.get('set-cookie');
  assert.ok(setCookie && setCookie.includes('lfs_client_session'), 'cookie set');
});

test('invalid token login returns 401', async () => {
  const { baseUrl } = require('./_helpers');
  const res = await fetch(`${baseUrl()}/client/login/definitely-not-a-valid-token`);
  assert.equal(res.status, 401);
});

// ── requireClientAuth middleware ──────────────────────────────────────────

test('GET /api/client/me with valid session cookie returns user + org', async () => {
  const { baseUrl } = require('./_helpers');
  const org = await insertOrg();
  const user = await insertUser(org.id);
  const { raw } = await insertToken(user.id);

  // First consume the token to get a cookie.
  const loginRes = await fetch(`${baseUrl()}/client/login/${raw}`, { redirect: 'manual' });
  const cookie = loginRes.headers.get('set-cookie');
  assert.ok(cookie, 'cookie set on login');

  const meRes = await fetch(`${baseUrl()}/api/client/me`, {
    headers: { cookie },
  });
  assert.equal(meRes.status, 200);
  const data = await meRes.json();
  assert.ok(data.client_user);
  assert.ok(data.client_org);
  assert.equal(data.client_org.id, org.id);
});

test('GET /api/client/me with no cookie returns 401', async () => {
  const { baseUrl } = require('./_helpers');
  const res = await fetch(`${baseUrl()}/api/client/me`);
  assert.equal(res.status, 401);
});

test('revoked token returns 401 on /api/client/me', async () => {
  const { baseUrl } = require('./_helpers');
  const org = await insertOrg();
  const user = await insertUser(org.id);
  const { raw, token } = await insertToken(user.id);

  const loginRes = await fetch(`${baseUrl()}/client/login/${raw}`, { redirect: 'manual' });
  const cookie = loginRes.headers.get('set-cookie');

  // Revoke token.
  await pool.query('UPDATE client_tokens SET revoked_at = NOW() WHERE id = $1', [token.id]);

  const meRes = await fetch(`${baseUrl()}/api/client/me`, { headers: { cookie } });
  assert.equal(meRes.status, 401);
});

test('expired token returns 401 on /api/client/me', async () => {
  const { baseUrl } = require('./_helpers');
  const org = await insertOrg();
  const user = await insertUser(org.id);
  const { raw } = await insertToken(user.id, { expiredDaysAgo: 1 });

  // Expired token cannot even be consumed at login.
  const loginRes = await fetch(`${baseUrl()}/client/login/${raw}`);
  assert.equal(loginRes.status, 401);
});

test('inactive user returns 401 on /api/client/me', async () => {
  const { baseUrl } = require('./_helpers');
  const org = await insertOrg();
  const user = await insertUser(org.id);
  const { raw } = await insertToken(user.id);

  const loginRes = await fetch(`${baseUrl()}/client/login/${raw}`, { redirect: 'manual' });
  const cookie = loginRes.headers.get('set-cookie');

  // Deactivate user after login.
  await pool.query(`UPDATE client_users SET status = 'revoked' WHERE id = $1`, [user.id]);

  const meRes = await fetch(`${baseUrl()}/api/client/me`, { headers: { cookie } });
  assert.equal(meRes.status, 401);
});

test('inactive org returns 401 on /api/client/me', async () => {
  const { baseUrl } = require('./_helpers');
  const org = await insertOrg();
  const user = await insertUser(org.id);
  const { raw } = await insertToken(user.id);

  const loginRes = await fetch(`${baseUrl()}/client/login/${raw}`, { redirect: 'manual' });
  const cookie = loginRes.headers.get('set-cookie');

  // Suspend org after login.
  await pool.query(`UPDATE client_organizations SET status = 'suspended' WHERE id = $1`, [org.id]);

  const meRes = await fetch(`${baseUrl()}/api/client/me`, { headers: { cookie } });
  assert.equal(meRes.status, 401);
});

// ── Client projects list & detail endpoints ───────────────────────────────

async function setupProjectsForClient(orgId) {
  // Insert engineering contract tied to the client org
  const { rows: ecRows } = await pool.query(`
    INSERT INTO engineering_contracts (name, program, client_org_id)
    VALUES ($1, $2, $3)
    RETURNING id
  `, ['Test EC', 'rus', orgId]);
  const ecId = ecRows[0].id;

  // Insert leaf projects (is_rollup = false)
  const { rows: projRows } = await pool.query(`
    INSERT INTO projects (name, service_area_name, program, status, engineering_contract_id, is_rollup)
    VALUES
      ($1, $2, $3, $4, $5, false),
      ($6, $7, $8, $9, $10, false)
    RETURNING id
  `, [
    'Project 1', 'Service Area 1', 'rus', 'active', ecId,
    'Project 2', 'Service Area 2', 'bau', 'pending', ecId,
  ]);

  return { ecId, projectIds: projRows.map(r => r.id) };
}

test('GET /api/client/projects returns org\'s leaf projects only', async () => {
  const { baseUrl } = require('./_helpers');
  const org = await insertOrg();
  const user = await insertUser(org.id);
  const { raw } = await insertToken(user.id);
  const { ecId, projectIds } = await setupProjectsForClient(org.id);

  // Log in to get cookie
  const loginRes = await fetch(`${baseUrl()}/client/login/${raw}`, { redirect: 'manual' });
  const cookie = loginRes.headers.get('set-cookie');

  // Fetch projects
  const projRes = await fetch(`${baseUrl()}/api/client/projects`, { headers: { cookie } });
  assert.equal(projRes.status, 200);
  const data = await projRes.json();
  assert.ok(Array.isArray(data.projects));
  assert.equal(data.projects.length, 2, 'returns both projects');
  assert.ok(data.projects.every(p => p.engineering_contract_id === ecId));
  assert.ok(data.projects.every(p => !p.is_rollup));
});

test('GET /api/client/projects/:id returns single project for client\'s org', async () => {
  const { baseUrl } = require('./_helpers');
  const org = await insertOrg();
  const user = await insertUser(org.id);
  const { raw } = await insertToken(user.id);
  const { projectIds } = await setupProjectsForClient(org.id);

  // Log in to get cookie
  const loginRes = await fetch(`${baseUrl()}/client/login/${raw}`, { redirect: 'manual' });
  const cookie = loginRes.headers.get('set-cookie');

  // Fetch single project
  const projRes = await fetch(`${baseUrl()}/api/client/projects/${projectIds[0]}`, { headers: { cookie } });
  assert.equal(projRes.status, 200);
  const data = await projRes.json();
  assert.ok(data.project);
  assert.equal(data.project.id, projectIds[0]);
  assert.equal(data.project.name, 'Project 1');
});

test('GET /api/client/projects/:id returns 404 for other org\'s project (IDOR)', async () => {
  const { baseUrl } = require('./_helpers');
  const org1 = await insertOrg();
  const org2 = await insertOrg();
  const user = await insertUser(org1.id);
  const { raw } = await insertToken(user.id);
  const { projectIds: org2ProjectIds } = await setupProjectsForClient(org2.id);

  // Log in as org1
  const loginRes = await fetch(`${baseUrl()}/client/login/${raw}`, { redirect: 'manual' });
  const cookie = loginRes.headers.get('set-cookie');

  // Try to access org2's project
  const projRes = await fetch(`${baseUrl()}/api/client/projects/${org2ProjectIds[0]}`, { headers: { cookie } });
  assert.equal(projRes.status, 404);
});

test('GET /api/client/projects requires authentication', async () => {
  const { baseUrl } = require('./_helpers');
  const res = await fetch(`${baseUrl()}/api/client/projects`);
  assert.equal(res.status, 401);
});

test('GET /api/client/projects/:id requires authentication', async () => {
  const { baseUrl } = require('./_helpers');
  const res = await fetch(`${baseUrl()}/api/client/projects/some-id`);
  assert.equal(res.status, 401);
});

// ── IDOR placeholder ──────────────────────────────────────────────────────
// E4 scope complete — projects list + detail endpoints working with auth.
// E7 will extend with document upload/download endpoints.
