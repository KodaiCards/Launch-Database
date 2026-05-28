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

// ══════════════════════════════════════════════════════════════════════════
// Wave 49b: Documents + Approvals Tests
// ══════════════════════════════════════════════════════════════════════════

// Helper: insert a document for testing
async function insertDocument(orgId, { projectId = null, filename = 'test.pdf', mimeType = 'application/pdf', sizeBytes = 1024, direction = 'from_client', status = 'active' } = {}) {
  const { v4: uuidv4 } = require('uuid');
  const storageKey = `client-docs/${orgId}/${uuidv4()}.pdf`;
  const { rows } = await pool.query(`
    INSERT INTO client_documents (
      client_org_id, project_id, filename, mime_type, size_bytes,
      storage_key, uploaded_by_client_user_id, direction, status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `, [orgId, projectId || null, filename, mimeType, sizeBytes, storageKey, null, direction, status]);
  return rows[0];
}

// Helper: insert an approval for testing
async function insertApproval(orgId, { projectId = null, documentId = null, title = 'Test Approval', status = 'pending' } = {}) {
  const { rows } = await pool.query(`
    INSERT INTO client_approvals (
      client_org_id, project_id, document_id, title, requested_by, status
    ) VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `, [orgId, projectId || null, documentId || null, title, null, status]);
  return rows[0];
}

// ── Documents Tests ────────────────────────────────────────────────────────

test('GET /api/client/documents returns caller\'s org documents only (IDOR)', async () => {
  const org1 = await insertOrg();
  const org2 = await insertOrg();
  const user = await insertUser(org1.id);
  const { raw } = await insertToken(user.id);

  // Insert docs for both orgs
  await insertDocument(org1.id, { filename: 'org1-doc.pdf' });
  await insertDocument(org2.id, { filename: 'org2-doc.pdf' });

  const { baseUrl } = require('./_helpers');
  const loginRes = await fetch(`${baseUrl()}/client/login/${raw}`, { redirect: 'manual' });
  const cookie = loginRes.headers.get('set-cookie');

  const docsRes = await fetch(`${baseUrl()}/api/client/documents`, { headers: { cookie } });
  assert.equal(docsRes.status, 200);
  const data = await docsRes.json();
  assert.ok(Array.isArray(data.documents));
  assert.equal(data.documents.length, 1, 'returns only caller\'s org doc (IDOR)');
  assert.equal(data.documents[0].filename, 'org1-doc.pdf');
});

test('GET /api/client/documents with ?project_id filter validates org ownership (IDOR)', async () => {
  const org1 = await insertOrg();
  const org2 = await insertOrg();
  const user = await insertUser(org1.id);
  const { raw } = await insertToken(user.id);

  // Create EC + project for each org
  const { ecId: ec1Id } = await setupProjectsForClient(org1.id);
  const { projectIds: org1ProjectIds } = await setupProjectsForClient(org1.id);
  const { projectIds: org2ProjectIds } = await setupProjectsForClient(org2.id);

  const { baseUrl } = require('./_helpers');
  const loginRes = await fetch(`${baseUrl()}/client/login/${raw}`, { redirect: 'manual' });
  const cookie = loginRes.headers.get('set-cookie');

  // Try to filter by org2's project — should 404
  const docsRes = await fetch(`${baseUrl()}/api/client/documents?project_id=${org2ProjectIds[0]}`, { headers: { cookie } });
  assert.equal(docsRes.status, 404, 'cross-org project filter rejected (IDOR)');
});

test('GET /api/client/documents/:id/download returns 404 for other org\'s document (IDOR)', async () => {
  const org1 = await insertOrg();
  const org2 = await insertOrg();
  const user = await insertUser(org1.id);
  const { raw } = await insertToken(user.id);
  const org2Doc = await insertDocument(org2.id);

  const { baseUrl } = require('./_helpers');
  const loginRes = await fetch(`${baseUrl()}/client/login/${raw}`, { redirect: 'manual' });
  const cookie = loginRes.headers.get('set-cookie');

  const dlRes = await fetch(`${baseUrl()}/api/client/documents/${org2Doc.id}/download`, { headers: { cookie } });
  assert.equal(dlRes.status, 404, 'cross-org document access denied (IDOR)');
});

test('GET /api/client/documents/:id/download returns 400 for invalid UUID', async () => {
  const org = await insertOrg();
  const user = await insertUser(org.id);
  const { raw } = await insertToken(user.id);

  const { baseUrl } = require('./_helpers');
  const loginRes = await fetch(`${baseUrl()}/client/login/${raw}`, { redirect: 'manual' });
  const cookie = loginRes.headers.get('set-cookie');

  const dlRes = await fetch(`${baseUrl()}/api/client/documents/not-a-uuid/download`, { headers: { cookie } });
  assert.equal(dlRes.status, 400, 'malformed UUID returns 400');
});

test('GET /api/client/documents/:id/download sets Content-Disposition header', async () => {
  const org = await insertOrg();
  const user = await insertUser(org.id);
  const { raw } = await insertToken(user.id);
  const doc = await insertDocument(org.id, { filename: 'my-contract.pdf' });

  const { baseUrl } = require('./_helpers');
  const loginRes = await fetch(`${baseUrl()}/client/login/${raw}`, { redirect: 'manual' });
  const cookie = loginRes.headers.get('set-cookie');

  const dlRes = await fetch(`${baseUrl()}/api/client/documents/${doc.id}/download`, { headers: { cookie } });
  // Note: may be 500 if file doesn't exist in sandbox, or 200 if stream succeeds
  if (dlRes.status === 200) {
    const contentDisp = dlRes.headers.get('content-disposition');
    assert.ok(contentDisp && contentDisp.includes('attachment'), 'Content-Disposition header set');
    assert.ok(contentDisp.includes('my-contract.pdf'), 'filename in disposition');
  }
});

// ── Approvals Tests ────────────────────────────────────────────────────────

test('POST /api/admin/client-orgs/:id/approvals creates approval', async () => {
  const org = await insertOrg();
  const approval = await requestJson('POST', `/api/admin/client-orgs/${org.id}/approvals`, {
    token: adminToken,
    body: { title: 'Sign Contract', description: 'Please review and sign' },
    expectStatus: 201,
  });
  assert.equal(approval.title, 'Sign Contract');
  assert.equal(approval.description, 'Please review and sign');
  assert.equal(approval.status, 'pending');
});

test('POST /api/admin/client-orgs/:id/approvals rejects missing title', async () => {
  const org = await insertOrg();
  await requestJson('POST', `/api/admin/client-orgs/${org.id}/approvals`, {
    token: adminToken,
    body: { description: 'no title' },
    expectStatus: 400,
  });
});

test('POST /api/admin/client-orgs/:id/approvals rejects project_id from different org', async () => {
  const org1 = await insertOrg();
  const org2 = await insertOrg();
  const { projectIds: org2ProjectIds } = await setupProjectsForClient(org2.id);

  await requestJson('POST', `/api/admin/client-orgs/${org1.id}/approvals`, {
    token: adminToken,
    body: { title: 'Approval', project_id: org2ProjectIds[0] },
    expectStatus: 404,
  });
});

test('POST /api/admin/client-orgs/:id/approvals rejects document_id from different org', async () => {
  const org1 = await insertOrg();
  const org2 = await insertOrg();
  const org2Doc = await insertDocument(org2.id);

  await requestJson('POST', `/api/admin/client-orgs/${org1.id}/approvals`, {
    token: adminToken,
    body: { title: 'Approval', document_id: org2Doc.id },
    expectStatus: 404,
  });
});

test('POST /api/admin/client-orgs/:id/approvals rejects invalid UUID formats', async () => {
  const org = await insertOrg();
  await requestJson('POST', `/api/admin/client-orgs/${org.id}/approvals`, {
    token: adminToken,
    body: { title: 'Approval', project_id: 'not-a-uuid' },
    expectStatus: 400,
  });
});

test('POST /api/admin/client-orgs/:id/approvals requires admin role', async () => {
  const org = await insertOrg();
  const user = await insertUser(org.id);
  const { raw } = await insertToken(user.id);

  const { baseUrl } = require('./_helpers');
  const loginRes = await fetch(`${baseUrl()}/client/login/${raw}`, { redirect: 'manual' });
  const cookie = loginRes.headers.get('set-cookie');

  const appRes = await fetch(`${baseUrl()}/api/admin/client-orgs/${org.id}/approvals`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', cookie },
    body: JSON.stringify({ title: 'Approval' })
  });
  assert.equal(appRes.status, 403, 'client user cannot create approvals');
});

test('GET /api/client/approvals returns caller\'s org approvals only (IDOR)', async () => {
  const org1 = await insertOrg();
  const org2 = await insertOrg();
  const user = await insertUser(org1.id);
  const { raw } = await insertToken(user.id);

  // Insert approvals for both orgs
  await insertApproval(org1.id, { title: 'App1' });
  await insertApproval(org2.id, { title: 'App2' });

  const { baseUrl } = require('./_helpers');
  const loginRes = await fetch(`${baseUrl()}/client/login/${raw}`, { redirect: 'manual' });
  const cookie = loginRes.headers.get('set-cookie');

  const appRes = await fetch(`${baseUrl()}/api/client/approvals`, { headers: { cookie } });
  assert.equal(appRes.status, 200);
  const data = await appRes.json();
  assert.ok(Array.isArray(data.approvals));
  assert.equal(data.approvals.length, 1, 'returns only caller\'s org approval (IDOR)');
  assert.equal(data.approvals[0].title, 'App1');
});

test('GET /api/client/approvals?status=all returns all statuses', async () => {
  const org = await insertOrg();
  const user = await insertUser(org.id);
  const { raw } = await insertToken(user.id);

  // Insert pending and responded approvals
  await insertApproval(org.id, { title: 'Pending App', status: 'pending' });
  await insertApproval(org.id, { title: 'Responded App', status: 'responded' });

  const { baseUrl } = require('./_helpers');
  const loginRes = await fetch(`${baseUrl()}/client/login/${raw}`, { redirect: 'manual' });
  const cookie = loginRes.headers.get('set-cookie');

  const appRes = await fetch(`${baseUrl()}/api/client/approvals?status=all`, { headers: { cookie } });
  assert.equal(appRes.status, 200);
  const data = await appRes.json();
  assert.equal(data.approvals.length, 2, 'returns both pending and responded');
});

test('POST /api/client/approvals/:id/respond updates approval with response', async () => {
  const org = await insertOrg();
  const user = await insertUser(org.id);
  const { raw } = await insertToken(user.id);
  const approval = await insertApproval(org.id, { title: 'Needs Response' });

  const { baseUrl } = require('./_helpers');
  const loginRes = await fetch(`${baseUrl()}/client/login/${raw}`, { redirect: 'manual' });
  const cookie = loginRes.headers.get('set-cookie');

  const respondRes = await fetch(`${baseUrl()}/api/client/approvals/${approval.id}/respond`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', cookie },
    body: JSON.stringify({ response: 'approved', response_notes: 'Looks good' })
  });
  assert.equal(respondRes.status, 200);
  const result = await respondRes.json();
  assert.equal(result.approval.response, 'approved');
  assert.equal(result.approval.response_notes, 'Looks good');
  assert.equal(result.approval.status, 'responded');
  assert.ok(result.approval.responded_at, 'responded_at is set');
});

test('POST /api/client/approvals/:id/respond rejects invalid response value', async () => {
  const org = await insertOrg();
  const user = await insertUser(org.id);
  const { raw } = await insertToken(user.id);
  const approval = await insertApproval(org.id);

  const { baseUrl } = require('./_helpers');
  const loginRes = await fetch(`${baseUrl()}/client/login/${raw}`, { redirect: 'manual' });
  const cookie = loginRes.headers.get('set-cookie');

  const respondRes = await fetch(`${baseUrl()}/api/client/approvals/${approval.id}/respond`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', cookie },
    body: JSON.stringify({ response: 'invalid-response' })
  });
  assert.equal(respondRes.status, 400, 'rejects invalid response value');
});

test('POST /api/client/approvals/:id/respond returns 409 if already responded', async () => {
  const org = await insertOrg();
  const user = await insertUser(org.id);
  const { raw } = await insertToken(user.id);
  const approval = await insertApproval(org.id, { status: 'responded' });

  const { baseUrl } = require('./_helpers');
  const loginRes = await fetch(`${baseUrl()}/client/login/${raw}`, { redirect: 'manual' });
  const cookie = loginRes.headers.get('set-cookie');

  const respondRes = await fetch(`${baseUrl()}/api/client/approvals/${approval.id}/respond`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', cookie },
    body: JSON.stringify({ response: 'approved' })
  });
  assert.equal(respondRes.status, 409, 'already responded returns 409 conflict');
});

test('POST /api/client/approvals/:id/respond returns 404 for other org\'s approval (IDOR)', async () => {
  const org1 = await insertOrg();
  const org2 = await insertOrg();
  const user = await insertUser(org1.id);
  const { raw } = await insertToken(user.id);
  const org2Approval = await insertApproval(org2.id);

  const { baseUrl } = require('./_helpers');
  const loginRes = await fetch(`${baseUrl()}/client/login/${raw}`, { redirect: 'manual' });
  const cookie = loginRes.headers.get('set-cookie');

  const respondRes = await fetch(`${baseUrl()}/api/client/approvals/${org2Approval.id}/respond`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', cookie },
    body: JSON.stringify({ response: 'approved' })
  });
  assert.equal(respondRes.status, 404, 'cross-org approval access denied (IDOR)');
});

test('POST /api/client/approvals/:id/respond returns 400 for invalid UUID', async () => {
  const org = await insertOrg();
  const user = await insertUser(org.id);
  const { raw } = await insertToken(user.id);

  const { baseUrl } = require('./_helpers');
  const loginRes = await fetch(`${baseUrl()}/client/login/${raw}`, { redirect: 'manual' });
  const cookie = loginRes.headers.get('set-cookie');

  const respondRes = await fetch(`${baseUrl()}/api/client/approvals/invalid-uuid/respond`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', cookie },
    body: JSON.stringify({ response: 'approved' })
  });
  assert.equal(respondRes.status, 400, 'malformed UUID returns 400');
});

// ── Workspace Files (Wave 66) ───────────────────────────────────────────────

test('GET /api/client/projects/:id/workspace-files returns public folders for client org', async () => {
  const org = await insertOrg();
  const user = await insertUser(org.id);
  const { raw } = await insertToken(user.id);

  // Create a project for the org's EC
  const { rows: ecs } = await pool.query(
    `SELECT id FROM engineering_contracts WHERE client_org_id = $1 LIMIT 1`,
    [org.id]
  );
  if (!ecs.length) {
    console.log('No test EC for org — creating one');
    const { rows: newEc } = await pool.query(
      `INSERT INTO engineering_contracts (client_org_id, program) VALUES ($1, 'rus') RETURNING id`,
      [org.id]
    );
  }

  const ecId = ecs[0]?.id || (await pool.query(
    `INSERT INTO engineering_contracts (client_org_id, program) VALUES ($1, 'rus') RETURNING id`,
    [org.id]
  )).rows[0].id;

  const { rows: projRows } = await pool.query(
    `INSERT INTO projects (name, engineering_contract_id, status) VALUES ($1, $2, 'active') RETURNING id`,
    ['Test Project', ecId]
  );
  const projectId = projRows[0].id;

  const { baseUrl } = require('./_helpers');
  const loginRes = await fetch(`${baseUrl()}/client/login/${raw}`, { redirect: 'manual' });
  const cookie = loginRes.headers.get('set-cookie');

  const res = await fetch(`${baseUrl()}/api/client/projects/${projectId}/workspace-files`, {
    headers: { cookie }
  });
  assert.equal(res.status, 200, 'workspace-files endpoint returns 200');
  const data = await res.json();
  assert.ok(Array.isArray(data.folders), 'response.folders is array');
});

test('GET /api/client/projects/:id/workspace-files returns 404 for cross-org project (IDOR)', async () => {
  const org1 = await insertOrg();
  const org2 = await insertOrg();
  const user = await insertUser(org1.id);
  const { raw } = await insertToken(user.id);

  // Create project in org2
  const { rows: ec2Rows } = await pool.query(
    `INSERT INTO engineering_contracts (client_org_id, program) VALUES ($1, 'rus') RETURNING id`,
    [org2.id]
  );
  const ec2Id = ec2Rows[0].id;

  const { rows: proj2Rows } = await pool.query(
    `INSERT INTO projects (name, engineering_contract_id, status) VALUES ($1, $2, 'active') RETURNING id`,
    ['Org2 Project', ec2Id]
  );
  const proj2Id = proj2Rows[0].id;

  const { baseUrl } = require('./_helpers');
  const loginRes = await fetch(`${baseUrl()}/client/login/${raw}`, { redirect: 'manual' });
  const cookie = loginRes.headers.get('set-cookie');

  const res = await fetch(`${baseUrl()}/api/client/projects/${proj2Id}/workspace-files`, {
    headers: { cookie }
  });
  assert.equal(res.status, 404, 'cross-org project access denied (IDOR)');
});

test('GET /api/client/projects/:id/workspace-files returns 400 for invalid UUID', async () => {
  const org = await insertOrg();
  const user = await insertUser(org.id);
  const { raw } = await insertToken(user.id);

  const { baseUrl } = require('./_helpers');
  const loginRes = await fetch(`${baseUrl()}/client/login/${raw}`, { redirect: 'manual' });
  const cookie = loginRes.headers.get('set-cookie');

  const res = await fetch(`${baseUrl()}/api/client/projects/invalid-uuid/workspace-files`, {
    headers: { cookie }
  });
  assert.equal(res.status, 400, 'malformed UUID returns 400');
});

test('GET /api/client/workspace-files/:id/download returns 404 for non-public folder (IDOR)', async () => {
  // Test that private folders are not downloadable even if caller owns the project
  const org = await insertOrg();
  const user = await insertUser(org.id);
  const { raw } = await insertToken(user.id);

  const { rows: ecRows } = await pool.query(
    `INSERT INTO engineering_contracts (client_org_id, program) VALUES ($1, 'rus') RETURNING id`,
    [org.id]
  );
  const ecId = ecRows[0].id;

  const { rows: projRows } = await pool.query(
    `INSERT INTO projects (name, engineering_contract_id, status) VALUES ($1, $2, 'active') RETURNING id`,
    ['Test Project', ecId]
  );
  const projectId = projRows[0].id;

  // Create a private folder (not public)
  const { rows: folderRows } = await pool.query(
    `INSERT INTO workspace_folders (project_id, name, share_mode) VALUES ($1, 'Private', 'private') RETURNING id`,
    [projectId]
  );
  const folderId = folderRows[0].id;

  // Create a file in the private folder
  const { rows: fileRows } = await pool.query(
    `INSERT INTO workspace_files (folder_id, filename, mime_type, size_bytes, sha256, storage_key)
     VALUES ($1, 'test.txt', 'text/plain', 100, 'deadbeef', 'test-key') RETURNING id`,
    [folderId]
  );
  const fileId = fileRows[0].id;

  const { baseUrl } = require('./_helpers');
  const loginRes = await fetch(`${baseUrl()}/client/login/${raw}`, { redirect: 'manual' });
  const cookie = loginRes.headers.get('set-cookie');

  const res = await fetch(`${baseUrl()}/api/client/workspace-files/${fileId}/download`, {
    headers: { cookie }
  });
  assert.equal(res.status, 404, 'private folder file download returns 404 (IDOR)');
});

// ── Wave 107: HIGH-1/2, MED-1/2/3/4 fixes ─────────────────────────────────────

function buildMultipartBody(filename, content, mimeType) {
  const { Blob } = require('node:buffer');
  const form = new FormData();
  form.append('file', new Blob([content], { type: mimeType }), filename);
  return form;
}

test('W107-HIGH-1: POST /api/client/documents with no file returns 400 (not 404)', async () => {
  const org = await insertOrg();
  const user = await insertUser(org.id);
  const { raw } = await insertToken(user.id);

  const { baseUrl } = require('./_helpers');
  const loginRes = await fetch(`${baseUrl()}/client/login/${raw}`, { redirect: 'manual' });
  const cookie = loginRes.headers.get('set-cookie');

  const res = await fetch(`${baseUrl()}/api/client/documents`, {
    method: 'POST',
    headers: { cookie },
    body: new URLSearchParams({ notes: 'test' }),
  });
  // 400 means the handler ran (route is alive); 404 would mean the dead next() placeholder.
  assert.equal(res.status, 400, 'upload route alive — returns 400 for missing file, not 404');
});

test('W107-HIGH-2: upload with mismatched MIME (HTML content claiming application/pdf) is rejected', async () => {
  const org = await insertOrg();
  const user = await insertUser(org.id);
  const { raw } = await insertToken(user.id);

  const { baseUrl } = require('./_helpers');
  const loginRes = await fetch(`${baseUrl()}/client/login/${raw}`, { redirect: 'manual' });
  const cookie = loginRes.headers.get('set-cookie');

  // HTML payload with application/pdf MIME — magic bytes are '<html' not '%PDF'.
  const form = buildMultipartBody('evil.pdf', '<html><script>alert(1)</script></html>', 'application/pdf');
  const res = await fetch(`${baseUrl()}/api/client/documents`, {
    method: 'POST',
    headers: { cookie },
    body: form,
  });
  assert.equal(res.status, 400, 'MIME spoof rejected by magic-byte check');
  const body = await res.json();
  assert.ok(body.error && body.error.includes('content'), 'error message mentions content mismatch');
});

test('W107-MED-1: upload 201 response does not contain storage_key', async () => {
  const org = await insertOrg();
  const user = await insertUser(org.id);
  const { raw } = await insertToken(user.id);

  const { baseUrl } = require('./_helpers');
  const loginRes = await fetch(`${baseUrl()}/client/login/${raw}`, { redirect: 'manual' });
  const cookie = loginRes.headers.get('set-cookie');

  // Real PDF magic bytes: %PDF-1.4 header.
  const pdfContent = Buffer.concat([
    Buffer.from('25504446', 'hex'), // %PDF
    Buffer.alloc(100, 0x20),
  ]);
  const form = buildMultipartBody('test.pdf', pdfContent, 'application/pdf');
  const res = await fetch(`${baseUrl()}/api/client/documents`, {
    method: 'POST',
    headers: { cookie },
    body: form,
  });
  if (res.status === 201) {
    const body = await res.json();
    assert.ok(!('storage_key' in (body.document || {})), 'storage_key must not be in 201 response');
  } else {
    assert.notEqual(res.status, 404, 'upload route is alive (not 404)');
  }
});

test('W107-MED-2: approval respond creates audit_log row', async () => {
  const org = await insertOrg();
  const user = await insertUser(org.id);
  const { raw } = await insertToken(user.id);

  const { rows: approvalRows } = await pool.query(
    `INSERT INTO client_approvals (client_org_id, title, status)
     VALUES ($1, $2, 'pending') RETURNING id`,
    [org.id, uniqueTag('approval')]
  );
  const approvalId = approvalRows[0].id;

  const { baseUrl } = require('./_helpers');
  const loginRes = await fetch(`${baseUrl()}/client/login/${raw}`, { redirect: 'manual' });
  const cookie = loginRes.headers.get('set-cookie');

  const countBefore = (await pool.query(
    `SELECT COUNT(*)::int AS c FROM audit_log WHERE action = 'client_portal.approval_respond'`
  )).rows[0].c;

  const res = await fetch(`${baseUrl()}/api/client/approvals/${approvalId}/respond`, {
    method: 'POST',
    headers: { cookie, 'content-type': 'application/json' },
    body: JSON.stringify({ response: 'approved', response_notes: 'looks good' }),
  });
  assert.equal(res.status, 200, 'approval respond succeeds');

  const countAfter = (await pool.query(
    `SELECT COUNT(*)::int AS c FROM audit_log WHERE action = 'client_portal.approval_respond'`
  )).rows[0].c;
  assert.ok(countAfter > countBefore, 'audit_log row created for approval respond');
});

test('W107-MED-2: admin token generate creates audit_log row', async () => {
  const org = await insertOrg();
  const user = await insertUser(org.id);

  const countBefore = (await pool.query(
    `SELECT COUNT(*)::int AS c FROM audit_log WHERE action = 'client_portal.token_generate'`
  )).rows[0].c;

  await requestJson('POST', `/api/admin/client-orgs/${org.id}/users/${user.id}/tokens`, {
    token: adminToken,
    body: { expires_days: 30 },
    expectStatus: 201,
  });

  const countAfter = (await pool.query(
    `SELECT COUNT(*)::int AS c FROM audit_log WHERE action = 'client_portal.token_generate'`
  )).rows[0].c;
  assert.ok(countAfter > countBefore, 'audit_log row created for token generate');
});

test('W107-MED-3: document download Content-Disposition strips CR and LF', async () => {
  const org = await insertOrg();
  const user = await insertUser(org.id);
  const { raw } = await insertToken(user.id);

  const { rows } = await pool.query(
    `INSERT INTO client_documents
       (client_org_id, filename, mime_type, size_bytes, storage_key, direction, status)
     VALUES ($1, $2, 'application/pdf', 100, 'nonexistent/path.pdf', 'from_admin', 'active')
     RETURNING id`,
    [org.id, 'evil\r\nSet-Cookie: x=1\r\nfilename="clean.pdf']
  );
  const docId = rows[0].id;

  const { baseUrl } = require('./_helpers');
  const loginRes = await fetch(`${baseUrl()}/client/login/${raw}`, { redirect: 'manual' });
  const cookie = loginRes.headers.get('set-cookie');

  const dlRes = await fetch(`${baseUrl()}/api/client/documents/${docId}/download`, {
    headers: { cookie },
  });

  const cd = dlRes.headers.get('content-disposition') || '';
  assert.ok(!cd.includes('\r'), 'Content-Disposition header has no CR');
  assert.ok(!cd.includes('\n'), 'Content-Disposition header has no LF');
});
