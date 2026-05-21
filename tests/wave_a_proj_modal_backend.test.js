// tests/wave_a_proj_modal_backend.test.js
//
// Tests for Wave A backend additions:
//  1. POST /api/projects accepts + stores service_area_name
//  2. PUT /api/projects/:id accepts + updates service_area_name
//  3. GET /api/engineering-contracts/:ecId/service-areas returns work_order_number
//  4. POST /api/engineering-contracts/:ecId/service-areas accepts + stores work_order_number
//  5. PUT /api/ec-service-areas/:id accepts + updates work_order_number
//  6. POST /api/projects auto-derives work_order_number from concentrator_id
//
// NOTE: DATABASE_URL must be set. Tests skip gracefully via _helpers.js error if it isn't.

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const {
  bootTestServer, close, adminLogin, requestJson, request,
  fixtures, cleanupAll, uniqueTag, pool,
} = require('./_helpers');

let token;
const cleanup = {
  clients: [],
  engineering_contracts: [],
  projects: [],
};

const extraCleanup = {
  ec_service_areas: [],
};

before(async () => {
  await bootTestServer();
  token = await adminLogin();
});

after(async () => {
  if (extraCleanup.ec_service_areas.length) {
    try {
      await pool.query(
        `DELETE FROM ec_service_areas WHERE id = ANY($1::uuid[])`,
        [extraCleanup.ec_service_areas]
      );
    } catch (e) {
      console.warn('[cleanup] ec_service_areas DELETE failed:', e.message);
    }
  }
  await cleanupAll(cleanup);
  await close();
});

// ─── Fixtures ──────────────────────────────────────────────────────────────────

let sharedClient;
let sharedEc;

before(async () => {
  sharedClient = await fixtures.client({ name: uniqueTag('wave-a-client') });
  cleanup.clients.push(sharedClient.id);

  sharedEc = await fixtures.engineeringContract({
    client_id: sharedClient.id,
    program: 'rus',
    name: uniqueTag('wave-a-ec'),
    contract_number: uniqueTag('EC-WAVEA'),
  });
  cleanup.engineering_contracts.push(sharedEc.id);
});

// ─── Test 1: GET /api/engineering-contracts/:ecId/service-areas returns work_order_number ───

test('GET /api/engineering-contracts/:ecId/service-areas returns work_order_number field', async () => {
  const saName = uniqueTag('test-sa-1');
  const woNum = `WO-${Date.now()}`;

  // Create a service area with work_order_number via API
  const saRes = await requestJson(
    'POST',
    `/api/engineering-contracts/${sharedEc.id}/service-areas`,
    { token },
    {
      name: saName,
      notes: 'Test SA',
      work_order_number: woNum,
    }
  );
  assert.ok(saRes.id, 'SA creation must return id');
  assert.equal(saRes.work_order_number, woNum, 'SA response must include work_order_number');
  extraCleanup.ec_service_areas.push(saRes.id);

  // GET the service areas list and confirm work_order_number is in response
  const list = await requestJson(
    'GET',
    `/api/engineering-contracts/${sharedEc.id}/service-areas`,
    { token }
  );
  assert.ok(Array.isArray(list), 'list must be array');
  const found = list.find(sa => sa.id === saRes.id);
  assert.ok(found, 'newly created SA must appear in list');
  assert.equal(found.work_order_number, woNum, 'list response must include work_order_number');
});

test('GET /api/engineering-contracts/:ecId/service-areas returns null work_order_number when not set', async () => {
  const saName = uniqueTag('test-sa-no-wo');

  // Create a service area WITHOUT work_order_number
  const saRes = await requestJson(
    'POST',
    `/api/engineering-contracts/${sharedEc.id}/service-areas`,
    { token },
    { name: saName }
  );
  assert.ok(saRes.id, 'SA creation must return id');
  assert.ok(saRes.work_order_number === null || saRes.work_order_number === undefined,
    'SA response must have null/undefined work_order_number when not provided');
  extraCleanup.ec_service_areas.push(saRes.id);
});

// ─── Test 2: POST /api/engineering-contracts/:ecId/service-areas accepts work_order_number ───

test('POST /api/engineering-contracts/:ecId/service-areas stores work_order_number', async () => {
  const saName = uniqueTag('test-sa-post');
  const woNum = `WO-POST-${Date.now()}`;

  const saRes = await requestJson(
    'POST',
    `/api/engineering-contracts/${sharedEc.id}/service-areas`,
    { token },
    {
      name: saName,
      notes: 'Test SA for POST',
      work_order_number: woNum,
    }
  );
  assert.equal(saRes.work_order_number, woNum, 'POST response must return work_order_number');
  extraCleanup.ec_service_areas.push(saRes.id);

  // Verify it persisted via direct DB query
  const { rows } = await pool.query(
    'SELECT work_order_number FROM ec_service_areas WHERE id = $1',
    [saRes.id]
  );
  assert.ok(rows.length, 'SA must exist in DB');
  assert.equal(rows[0].work_order_number, woNum, 'DB row must have work_order_number');
});

// ─── Test 3: PUT /api/ec-service-areas/:id accepts + updates work_order_number ───

test('PUT /api/ec-service-areas/:id updates work_order_number', async () => {
  const saName = uniqueTag('test-sa-put');
  const woNum1 = `WO-PUT-1-${Date.now()}`;
  const woNum2 = `WO-PUT-2-${Date.now()}`;

  // Create SA with first WO#
  const saRes = await requestJson(
    'POST',
    `/api/engineering-contracts/${sharedEc.id}/service-areas`,
    { token },
    { name: saName, work_order_number: woNum1 }
  );
  extraCleanup.ec_service_areas.push(saRes.id);

  // Update WO# via PUT
  const updRes = await requestJson(
    'PUT',
    `/api/ec-service-areas/${saRes.id}`,
    { token },
    { work_order_number: woNum2 }
  );
  assert.equal(updRes.work_order_number, woNum2, 'PUT response must reflect new work_order_number');

  // Verify in DB
  const { rows } = await pool.query(
    'SELECT work_order_number FROM ec_service_areas WHERE id = $1',
    [saRes.id]
  );
  assert.equal(rows[0].work_order_number, woNum2, 'DB row must have updated work_order_number');
});

// ─── Test 4: POST /api/projects accepts + stores service_area_name ───

test('POST /api/projects stores service_area_name when provided', async () => {
  const projName = uniqueTag('test-proj-sa-name');
  const saName = uniqueTag('my-service-area');

  const projRes = await requestJson(
    'POST',
    '/api/projects',
    { token },
    {
      name: projName,
      client_id: sharedClient.id,
      service_area_label: saName,
      status: 'active',
    }
  );
  assert.ok(projRes.id, 'project creation must return id');
  assert.equal(projRes.service_area_name, saName, 'project response must include service_area_name');
  cleanup.projects.push(projRes.id);

  // Verify in DB
  const { rows } = await pool.query(
    'SELECT service_area_name FROM projects WHERE id = $1',
    [projRes.id]
  );
  assert.ok(rows.length, 'project must exist in DB');
  assert.equal(rows[0].service_area_name, saName, 'DB row must have service_area_name');
});

// ─── Test 5: PUT /api/projects/:id updates service_area_name ───

test('PUT /api/projects/:id updates service_area_name', async () => {
  const projName = uniqueTag('test-proj-put-sa');
  const saName1 = uniqueTag('sa-name-1');
  const saName2 = uniqueTag('sa-name-2');

  // Create project
  const projRes = await requestJson(
    'POST',
    '/api/projects',
    { token },
    {
      name: projName,
      client_id: sharedClient.id,
      service_area_label: saName1,
      status: 'active',
    }
  );
  cleanup.projects.push(projRes.id);
  assert.equal(projRes.service_area_name, saName1, 'initial service_area_name must be set');

  // Update service_area_name
  const updRes = await requestJson(
    'PUT',
    `/api/projects/${projRes.id}`,
    { token },
    { service_area_name: saName2 }
  );
  assert.equal(updRes.service_area_name, saName2, 'PUT response must have new service_area_name');

  // Verify in DB
  const { rows } = await pool.query(
    'SELECT service_area_name FROM projects WHERE id = $1',
    [projRes.id]
  );
  assert.equal(rows[0].service_area_name, saName2, 'DB must have updated service_area_name');
});

// ─── Test 6: POST /api/projects auto-derives work_order_number from concentrator_id ───

test('POST /api/projects auto-derives work_order_number from concentrator_id (SA)', async () => {
  const projName = uniqueTag('test-proj-auto-wo');
  const saName = uniqueTag('sa-with-wo');
  const woNum = `WO-AUTO-${Date.now()}`;

  // Create a service area with work_order_number
  const saRes = await requestJson(
    'POST',
    `/api/engineering-contracts/${sharedEc.id}/service-areas`,
    { token },
    { name: saName, work_order_number: woNum }
  );
  extraCleanup.ec_service_areas.push(saRes.id);

  // Create project with concentrator_id (SA id) but NO explicit work_order_number
  const projRes = await requestJson(
    'POST',
    '/api/projects',
    { token },
    {
      name: projName,
      client_id: sharedClient.id,
      engineering_contract_id: sharedEc.id,
      concentrator_id: saRes.id,  // This is the SA id
      status: 'active',
    }
  );
  cleanup.projects.push(projRes.id);

  // Verify work_order_number was auto-derived
  assert.equal(projRes.work_order_number, woNum, 'project response must have auto-derived work_order_number');

  // Verify in DB
  const { rows } = await pool.query(
    'SELECT work_order_number FROM projects WHERE id = $1',
    [projRes.id]
  );
  assert.equal(rows[0].work_order_number, woNum, 'DB row must have auto-derived work_order_number');
});

// ─── Test 7: POST /api/projects does NOT auto-derive if work_order_number explicitly provided ───

test('POST /api/projects uses explicit work_order_number over concentrator lookup', async () => {
  const projName = uniqueTag('test-proj-explicit-wo');
  const saName = uniqueTag('sa-with-wo-2');
  const saWoNum = `WO-SA-${Date.now()}`;
  const explicitWoNum = `WO-EXPLICIT-${Date.now()}`;

  // Create SA with work_order_number
  const saRes = await requestJson(
    'POST',
    `/api/engineering-contracts/${sharedEc.id}/service-areas`,
    { token },
    { name: saName, work_order_number: saWoNum }
  );
  extraCleanup.ec_service_areas.push(saRes.id);

  // Create project with BOTH concentrator_id AND explicit work_order_number
  const projRes = await requestJson(
    'POST',
    '/api/projects',
    { token },
    {
      name: projName,
      client_id: sharedClient.id,
      engineering_contract_id: sharedEc.id,
      concentrator_id: saRes.id,
      work_order_number: explicitWoNum,  // Explicit value should win
      status: 'active',
    }
  );
  cleanup.projects.push(projRes.id);

  assert.equal(projRes.work_order_number, explicitWoNum, 'explicit work_order_number must win');
});
