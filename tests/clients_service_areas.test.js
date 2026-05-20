// tests/clients_service_areas.test.js
//
// Unit tests for GET /api/clients/:client_id/service-areas?program=<X>
//
// Endpoint purpose: cascade picker support — timeclock, design, and permitting
// portals know (client_id + program) but not the engineering contract UUID.
// This endpoint bridges that gap and returns [{id, name, ec_id, program}].
//
// Coverage:
//   1. Lists SAs for a known (client, program) pair.
//   2. Empty array when active EC exists but has no SAs.
//   3. SAs from a different program under same client do NOT appear.
//   4. Empty array when no active EC exists for the program at all.
//   5. 404 when client_id is unknown UUID.
//   6. 400 when program param is absent.
//   7. 400 when program param is not an allowed value.
//   8. 401 when unauthenticated.
//   9. 403 when authenticated as customer role.

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const {
  bootTestServer, close, adminLogin, request, requestJson,
  fixtures, cleanupAll, uniqueTag, pool,
} = require('./_helpers');

let token;
const cleanup = {
  clients: [],
  engineering_contracts: [],
};

before(async () => {
  await bootTestServer();
  token = await adminLogin();
});

after(async () => {
  await cleanupAll(cleanup);
  // ec_service_areas cascade-delete from engineering_contracts; no separate cleanup needed.
  await close();
});

let sharedClient;
let rusEC;
let bauEC;
let saRow1;
let saRow2;

before(async () => {
  sharedClient = await fixtures.client({ name: uniqueTag('sa-test-client') });
  cleanup.clients.push(sharedClient.id);

  rusEC = await fixtures.engineeringContract({
    client_id: sharedClient.id,
    name: uniqueTag('sa-test-ec-rus'),
    program: 'rus',
  });
  cleanup.engineering_contracts.push(rusEC.id);

  bauEC = await fixtures.engineeringContract({
    client_id: sharedClient.id,
    name: uniqueTag('sa-test-ec-bau'),
    program: 'bau',
  });
  cleanup.engineering_contracts.push(bauEC.id);

  const { rows: [r1] } = await pool.query(
    `INSERT INTO ec_service_areas (engineering_contract_id, name)
       VALUES ($1, $2) RETURNING *`,
    [rusEC.id, uniqueTag('Alpha-SA')]
  );
  saRow1 = r1;

  const { rows: [r2] } = await pool.query(
    `INSERT INTO ec_service_areas (engineering_contract_id, name)
       VALUES ($1, $2) RETURNING *`,
    [rusEC.id, uniqueTag('Beta-SA')]
  );
  saRow2 = r2;
});

test('GET /api/clients/:id/service-areas?program=rus lists both SAs for the active RUS EC', async () => {
  const rows = await requestJson(
    'GET',
    `/api/clients/${sharedClient.id}/service-areas?program=rus`,
    { token }
  );
  assert.ok(Array.isArray(rows), 'response must be an array');
  const ids = rows.map(r => r.id);
  assert.ok(ids.includes(saRow1.id), 'SA1 must appear');
  assert.ok(ids.includes(saRow2.id), 'SA2 must appear');
  const row = rows.find(r => r.id === saRow1.id);
  assert.ok(row.name, 'row must have name');
  assert.equal(row.ec_id, rusEC.id, 'ec_id must reference the RUS EC');
  assert.equal(row.program, 'rus', 'program field must be rus');
});

test('GET /api/clients/:id/service-areas?program=bau returns [] when BAU EC has no SAs', async () => {
  const rows = await requestJson(
    'GET',
    `/api/clients/${sharedClient.id}/service-areas?program=bau`,
    { token }
  );
  assert.ok(Array.isArray(rows), 'response must be an array');
  assert.equal(rows.length, 0, 'BAU EC has no SAs — must return empty array');
});

test('RUS SAs do NOT appear when querying program=bau', async () => {
  const rows = await requestJson(
    'GET',
    `/api/clients/${sharedClient.id}/service-areas?program=bau`,
    { token }
  );
  const ids = rows.map(r => r.id);
  assert.ok(!ids.includes(saRow1.id), 'RUS SA1 must NOT appear in BAU query');
  assert.ok(!ids.includes(saRow2.id), 'RUS SA2 must NOT appear in BAU query');
});

test('GET /api/clients/:id/service-areas?program=gfr returns [] when no GFR EC exists', async () => {
  const rows = await requestJson(
    'GET',
    `/api/clients/${sharedClient.id}/service-areas?program=gfr`,
    { token }
  );
  assert.ok(Array.isArray(rows), 'response must be an array');
  assert.equal(rows.length, 0, 'no GFR EC for this client — must return empty array');
});

test('GET /api/clients/<unknown-uuid>/service-areas returns 404', async () => {
  const res = await request(
    'GET',
    '/api/clients/00000000-0000-0000-0000-000000000000/service-areas?program=rus',
    { token }
  );
  assert.equal(res.status, 404, 'unknown client must return 404');
});

test('GET /api/clients/:id/service-areas with no ?program returns 400', async () => {
  const res = await request(
    'GET',
    `/api/clients/${sharedClient.id}/service-areas`,
    { token }
  );
  assert.equal(res.status, 400, 'missing program must return 400');
});

test('GET /api/clients/:id/service-areas?program=invalid returns 400', async () => {
  const res = await request(
    'GET',
    `/api/clients/${sharedClient.id}/service-areas?program=invalid`,
    { token }
  );
  assert.equal(res.status, 400, 'invalid program value must return 400');
});

test('GET /api/clients/:id/service-areas returns 401 when unauthenticated', async () => {
  const res = await request(
    'GET',
    `/api/clients/${sharedClient.id}/service-areas?program=rus`
  );
  assert.equal(res.status, 401, 'unauthenticated request must return 401');
});

test('GET /api/clients/:id/service-areas returns 403 for customer role', async () => {
  const username = uniqueTag('sa-customer');
  const password = 'test_customer_pw_123';
  const bcrypt = require('bcryptjs');
  const hash = await bcrypt.hash(password, 10);

  let customerId;
  try {
    const { rows } = await pool.query(
      `INSERT INTO users (username, password_hash, role, active, full_name)
         VALUES ($1, $2, 'customer', TRUE, 'SA Test Customer') RETURNING id`,
      [username, hash]
    );
    customerId = rows[0].id;

    const loginRes = await request('POST', '/api/auth/login', {
      body: { username, password },
    });
    assert.equal(loginRes.status, 200, 'customer login must succeed');
    const { token: customerToken } = await loginRes.json();

    const res = await request(
      'GET',
      `/api/clients/${sharedClient.id}/service-areas?program=rus`,
      { token: customerToken }
    );
    assert.equal(res.status, 403, 'customer role must be blocked with 403');
  } finally {
    if (customerId) {
      await pool.query('DELETE FROM users WHERE id = $1', [customerId]);
    }
  }
});
