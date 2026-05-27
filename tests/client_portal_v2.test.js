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

// ── Wave 45 IDOR + security tests ────────────────────────────────────────
// W45-MED-1: opaque login error messages
// W45-MED-2: UUID validation (400 not 500 on malformed IDs)
// W45-MED-3: admin user detail explicit column list (no invited_by leak)
// Plus: role-escalation guards, cross-org denial, rollup exclusion

// Helper: establish a client session cookie for org/user
async function getClientCookie(org, user) {
  const { baseUrl } = require('./_helpers');
  const { raw } = await insertToken(user.id);
  const loginRes = await fetch(`${baseUrl()}/client/login/${raw}`, { redirect: 'manual' });
  const cookie = loginRes.headers.get('set-cookie');
  if (!loginRes.headers.get('set-cookie')) throw new Error('login did not set cookie');
  return cookie;
}

// W45-MED-1: login endpoint returns identical 401 message regardless of token state
test('W45-MED-1: revoked token login returns same opaque 401 as invalid token', async () => {
  const { baseUrl } = require('./_helpers');
  const org = await insertOrg();
  const user = await insertUser(org.id);
  const { raw, token } = await insertToken(user.id, { revoked: true });

  const revokedRes = await fetch(`${baseUrl()}/client/login/${raw}`);
  assert.equal(revokedRes.status, 401);
  const revokedBody = await revokedRes.text();

  const invalidRes = await fetch(`${baseUrl()}/client/login/definitely-not-a-valid-token`);
  assert.equal(invalidRes.status, 401);
  const invalidBody = await invalidRes.text();

  // Both responses must be identical to prevent token-state enumeration.
  assert.equal(revokedBody, invalidBody, 'revoked and invalid token login must return same message');
});

test('W45-MED-1: expired token login returns same opaque 401 as invalid token', async () => {
  const { baseUrl } = require('./_helpers');
  const org = await insertOrg();
  const user = await insertUser(org.id);
  const { raw } = await insertToken(user.id, { expiredDaysAgo: 1 });

  const expiredRes = await fetch(`${baseUrl()}/client/login/${raw}`);
  assert.equal(expiredRes.status, 401);
  const expiredBody = await expiredRes.text();

  const invalidRes = await fetch(`${baseUrl()}/client/login/not-a-token-at-all`);
  const invalidBody = await invalidRes.text();

  assert.equal(expiredBody, invalidBody, 'expired and invalid token login must return same message');
});

test('W45-MED-1: inactive user login returns same opaque 401 as invalid token', async () => {
  const { baseUrl } = require('./_helpers');
  const org = await insertOrg();
  const user = await insertUser(org.id, { status: 'revoked' });
  const { raw } = await insertToken(user.id);

  const inactiveRes = await fetch(`${baseUrl()}/client/login/${raw}`);
  assert.equal(inactiveRes.status, 401);
  const inactiveBody = await inactiveRes.text();

  const invalidRes = await fetch(`${baseUrl()}/client/login/not-a-token-at-all`);
  const invalidBody = await invalidRes.text();

  assert.equal(inactiveBody, invalidBody, 'inactive user and invalid token login must return same message');
});

// W45-MED-2: malformed UUID in path params returns 400, not 500
test('W45-MED-2: GET /api/admin/client-orgs with non-UUID id returns 400', async () => {
  await requestJson('GET', '/api/admin/client-orgs/not-a-uuid', {
    token: adminToken,
    expectStatus: 400,
  });
});

test('W45-MED-2: PUT /api/admin/client-orgs with non-UUID id returns 400', async () => {
  await requestJson('PUT', '/api/admin/client-orgs/not-a-uuid', {
    token: adminToken,
    body: { status: 'active' },
    expectStatus: 400,
  });
});

test('W45-MED-2: POST /api/admin/client-orgs/:id/users with non-UUID id returns 400', async () => {
  await requestJson('POST', '/api/admin/client-orgs/not-a-uuid/users', {
    token: adminToken,
    body: { name: 'test', email: 'test@test.invalid' },
    expectStatus: 400,
  });
});

test('W45-MED-2: POST generate-token with non-UUID :id returns 400', async () => {
  const org = await insertOrg();
  const user = await insertUser(org.id);
  await requestJson('POST', `/api/admin/client-orgs/not-a-uuid/users/${user.id}/tokens`, {
    token: adminToken,
    body: {},
    expectStatus: 400,
  });
});

test('W45-MED-2: POST generate-token with non-UUID :uid returns 400', async () => {
  const org = await insertOrg();
  await requestJson('POST', `/api/admin/client-orgs/${org.id}/users/not-a-uuid/tokens`, {
    token: adminToken,
    body: {},
    expectStatus: 400,
  });
});

test('W45-MED-2: POST /api/admin/client-tokens with non-UUID :tid returns 400', async () => {
  await requestJson('POST', '/api/admin/client-tokens/not-a-uuid/revoke', {
    token: adminToken,
    body: {},
    expectStatus: 400,
  });
});

test('W45-MED-2: GET /api/client/projects/:id with non-UUID returns 400 not 500', async () => {
  const { baseUrl } = require('./_helpers');
  const org = await insertOrg();
  const user = await insertUser(org.id);
  const cookie = await getClientCookie(org, user);

  const res = await fetch(`${baseUrl()}/api/client/projects/not-a-uuid`, {
    headers: { cookie },
  });
  assert.equal(res.status, 400, 'non-UUID project id should return 400 not 500');
});

// W45-MED-3: admin user detail response does not expose invited_by
test('W45-MED-3: GET /api/admin/client-orgs/:id users do not expose invited_by column', async () => {
  const org = await insertOrg();
  await insertUser(org.id);
  const data = await requestJson('GET', `/api/admin/client-orgs/${org.id}`, {
    token: adminToken,
  });
  assert.ok(Array.isArray(data.users));
  assert.ok(data.users.length > 0, 'user was inserted');
  for (const u of data.users) {
    assert.strictEqual(u.invited_by, undefined, 'invited_by must not be in response');
  }
});

// IDOR: cross-org access denial for admin endpoints
test('IDOR: /api/admin/client-orgs/:id returns 404 for nonexistent org (not 500)', async () => {
  // A random UUID that definitely does not exist.
  const fakeId = '00000000-0000-0000-0000-000000000001';
  await requestJson('GET', `/api/admin/client-orgs/${fakeId}`, {
    token: adminToken,
    expectStatus: 404,
  });
});

test('IDOR: generate-token returns 404 when uid does not belong to org', async () => {
  const org1 = await insertOrg();
  const org2 = await insertOrg();
  const user2 = await insertUser(org2.id);

  // Try to generate a token for user2 under org1's path — IDOR attempt.
  await requestJson('POST', `/api/admin/client-orgs/${org1.id}/users/${user2.id}/tokens`, {
    token: adminToken,
    body: {},
    expectStatus: 404,
  });
});

// Role escalation: client cookie cannot hit admin endpoints
test('role escalation: client cookie cannot hit GET /api/admin/client-orgs', async () => {
  const { baseUrl } = require('./_helpers');
  const org = await insertOrg();
  const user = await insertUser(org.id);
  const cookie = await getClientCookie(org, user);

  const res = await fetch(`${baseUrl()}/api/admin/client-orgs`, {
    headers: { cookie },
  });
  // Admin endpoint requires lfs_session JWT. Client session cookie is ignored.
  assert.ok(res.status === 401 || res.status === 403, `expected 401 or 403, got ${res.status}`);
});

// Role escalation: no-auth request to client endpoints returns 401
test('role escalation: no cookie to GET /api/client/projects returns 401', async () => {
  const { baseUrl } = require('./_helpers');
  const res = await fetch(`${baseUrl()}/api/client/projects`);
  assert.equal(res.status, 401);
});

// IDOR: client cannot list projects from another org via query param tampering
test('IDOR: GET /api/client/projects only returns authenticated client\'s org projects', async () => {
  const { baseUrl } = require('./_helpers');
  const org1 = await insertOrg();
  const org2 = await insertOrg();
  const user1 = await insertUser(org1.id);
  const cookie = await getClientCookie(org1, user1);

  // Set up projects for both orgs
  const { projectIds: org1Ids } = await setupProjectsForClient(org1.id);
  const { projectIds: org2Ids } = await setupProjectsForClient(org2.id);

  const res = await fetch(`${baseUrl()}/api/client/projects`, { headers: { cookie } });
  assert.equal(res.status, 200);
  const data = await res.json();

  const returnedIds = data.projects.map(p => p.id);
  // All returned projects must belong to org1 (none from org2)
  for (const id of org2Ids) {
    assert.ok(!returnedIds.includes(id), `org2 project ${id} must not appear in org1 client response`);
  }
  // org1 projects must appear
  for (const id of org1Ids) {
    assert.ok(returnedIds.includes(id), `org1 project ${id} must appear`);
  }
});

// IDOR: rollup projects must not appear in client project list
test('IDOR: GET /api/client/projects excludes rollup rows', async () => {
  const { baseUrl } = require('./_helpers');
  const org = await insertOrg();
  const user = await insertUser(org.id);
  const cookie = await getClientCookie(org, user);

  const { rows: ecRows } = await pool.query(
    `INSERT INTO engineering_contracts (name, program, client_org_id) VALUES ($1, $2, $3) RETURNING id`,
    ['Rollup EC', 'rus', org.id]
  );
  const ecId = ecRows[0].id;

  // Insert one leaf + one rollup
  await pool.query(`
    INSERT INTO projects (name, program, status, engineering_contract_id, is_rollup)
    VALUES
      ($1, $2, $3, $4, false),
      ($5, $6, $7, $8, true)
  `, ['leaf-project', 'rus', 'active', ecId,
      'rollup-folder', 'rus', 'active', ecId]);

  const res = await fetch(`${baseUrl()}/api/client/projects`, { headers: { cookie } });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(data.projects.every(p => !p.is_rollup), 'no rollup rows in client project list');
  const names = data.projects.map(p => p.name);
  assert.ok(!names.includes('rollup-folder'), 'rollup-folder must not appear');
  assert.ok(names.includes('leaf-project'), 'leaf-project must appear');
});
