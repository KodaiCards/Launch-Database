// tests/projects_cascade.test.js
//
// Tests for Phase A cascade-backend additions to routes/projects.js:
//
//   GET  /api/projects?parent_id=<uuid>  — filter by direct parent
//   POST /api/projects/resolve-or-create — find-or-create leaf under SA folder
//
// NOTE: DATABASE_URL must be set. Tests skip gracefully via _helpers.js
// error if it isn't. CI provides a postgres service container.

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

// Extra cleanup tables not in the standard CLEANUP_ORDER helper
const extraCleanup = {
  ec_service_areas: [],
};

before(async () => {
  await bootTestServer();
  token = await adminLogin();
});

after(async () => {
  // Clean up ec_service_areas first (FK → engineering_contracts)
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

// ─── Shared fixtures ─────────────────────────────────────────────────────────

let sharedClient;
let sharedEc;
let saRow;         // ec_service_areas row
let saFolderRow;   // is_rollup=TRUE project row for that SA
let leafUnder;     // existing leaf under saFolderRow

before(async () => {
  sharedClient = await fixtures.client({ name: uniqueTag('casc-client') });
  cleanup.clients.push(sharedClient.id);

  sharedEc = await fixtures.engineeringContract({
    client_id: sharedClient.id,
    program: 'rus',
    name: uniqueTag('casc-ec'),
    contract_number: uniqueTag('EC-CASC'),
  });
  cleanup.engineering_contracts.push(sharedEc.id);

  // Insert an ec_service_areas row under sharedEc
  const { rows: [sa] } = await pool.query(
    `INSERT INTO ec_service_areas (engineering_contract_id, name)
       VALUES ($1, $2) RETURNING *`,
    [sharedEc.id, uniqueTag('casc-sa')]
  );
  saRow = sa;
  extraCleanup.ec_service_areas.push(sa.id);

  // Insert the service-area rollup folder project.
  // rollup_key = sa.id (the UUID), matching what ensureRollupChain produces
  // when concentrator_id is an ec_service_areas UUID.
  const { rows: [folder] } = await pool.query(
    `INSERT INTO projects
       (name, client_id, engineering_contract_id, program,
        status, is_rollup, rollup_level, rollup_key, project_type, billing_type)
     VALUES ($1, $2, $3, $4, 'active', TRUE, 'service_area', $5, 'rollup', 'hourly')
     RETURNING *`,
    [saRow.name, sharedClient.id, sharedEc.id, 'rus', saRow.id]
  );
  saFolderRow = folder;
  cleanup.projects.push(folder.id);

  // Insert an existing leaf under the folder
  const { rows: [leaf] } = await pool.query(
    `INSERT INTO projects
       (name, client_id, parent_id, engineering_contract_id, program,
        status, is_rollup, billing_type, project_type)
     VALUES ($1, $2, $3, $4, 'rus', 'active', FALSE, 'hourly', 'other')
     RETURNING *`,
    [uniqueTag('casc-existing-leaf'), sharedClient.id, saFolderRow.id, sharedEc.id]
  );
  leafUnder = leaf;
  cleanup.projects.push(leaf.id);
});

// ─── GET /api/projects?parent_id ─────────────────────────────────────────────

test('GET /api/projects?parent_id returns only direct children of that folder', async () => {
  const list = await requestJson(
    'GET',
    `/api/projects?parent_id=${saFolderRow.id}`,
    { token }
  );
  assert.ok(Array.isArray(list), 'response must be an array');
  const ids = new Set(list.map(p => p.id));
  assert.ok(ids.has(leafUnder.id),
    'existing leaf under folder must appear in parent_id-filtered results');
  assert.ok(!ids.has(saFolderRow.id),
    'the folder itself must NOT appear (it is not its own child)');
});

test('GET /api/projects?parent_id combined with leaves_only excludes rollups', async () => {
  // Insert a nested rollup-style row under the folder (edge case)
  const { rows: [nested] } = await pool.query(
    `INSERT INTO projects
       (name, client_id, parent_id, status, is_rollup, rollup_level, rollup_key, project_type, billing_type)
     VALUES ($1, $2, $3, 'active', TRUE, 'team', $4, 'rollup', 'hourly')
     RETURNING *`,
    [uniqueTag('casc-nested-rollup'), sharedClient.id, saFolderRow.id, uniqueTag('rk')]
  );
  cleanup.projects.push(nested.id);

  const list = await requestJson(
    'GET',
    `/api/projects?parent_id=${saFolderRow.id}&leaves_only=true`,
    { token }
  );
  const ids = new Set(list.map(p => p.id));
  assert.ok(ids.has(leafUnder.id), 'leaf must appear when leaves_only=true');
  assert.ok(!ids.has(nested.id), 'rollup nested under folder must be excluded by leaves_only');
});

test('GET /api/projects?parent_id with unknown UUID returns empty array', async () => {
  const list = await requestJson(
    'GET',
    `/api/projects?parent_id=00000000-0000-0000-0000-000000000000`,
    { token }
  );
  assert.ok(Array.isArray(list), 'must return array');
  const idsFromFixture = list.filter(p => p.parent_id === '00000000-0000-0000-0000-000000000000');
  assert.equal(idsFromFixture.length, 0, 'unknown parent_id UUID returns no matching children');
});

// ─── POST /api/projects/resolve-or-create ────────────────────────────────────

test('resolve-or-create: unauthenticated request blocked (401)', async () => {
  const res = await request('POST', '/api/projects/resolve-or-create', {
    body: {
      client_id: sharedClient.id,
      program: 'rus',
      service_area_id: saRow.id,
      job_name: 'Test Job',
    },
  });
  assert.equal(res.status, 401, 'unauthenticated request must return 401');
});

test('resolve-or-create: empty job_name returns 400', async () => {
  const res = await request('POST', '/api/projects/resolve-or-create', {
    token,
    body: {
      client_id: sharedClient.id,
      program: 'rus',
      service_area_id: saRow.id,
      job_name: '',
    },
  });
  assert.equal(res.status, 400, 'empty job_name must return 400');
});

test('resolve-or-create: whitespace-only job_name returns 400', async () => {
  const res = await request('POST', '/api/projects/resolve-or-create', {
    token,
    body: {
      client_id: sharedClient.id,
      program: 'rus',
      service_area_id: saRow.id,
      job_name: '   ',
    },
  });
  assert.equal(res.status, 400, 'whitespace-only job_name must return 400');
});

test('resolve-or-create: invalid program returns 400', async () => {
  const res = await request('POST', '/api/projects/resolve-or-create', {
    token,
    body: {
      client_id: sharedClient.id,
      program: 'invalid',
      service_area_id: saRow.id,
      job_name: 'Test Job',
    },
  });
  assert.equal(res.status, 400, 'invalid program must return 400');
});

test('resolve-or-create: missing service_area folder returns 404', async () => {
  // Use a real ec_service_areas row that has no corresponding rollup folder
  const { rows: [orphanSa] } = await pool.query(
    `INSERT INTO ec_service_areas (engineering_contract_id, name)
       VALUES ($1, $2) RETURNING *`,
    [sharedEc.id, uniqueTag('orphan-sa')]
  );
  extraCleanup.ec_service_areas.push(orphanSa.id);

  const res = await request('POST', '/api/projects/resolve-or-create', {
    token,
    body: {
      client_id: sharedClient.id,
      program: 'rus',
      service_area_id: orphanSa.id,
      job_name: 'Some Job',
    },
  });
  assert.equal(res.status, 404, 'missing rollup folder must return 404');
  const body = await res.json();
  assert.ok(body.error, 'error message must be present');
});

test('resolve-or-create: existing leaf returns 200 with created:false', async () => {
  const result = await requestJson('POST', '/api/projects/resolve-or-create', {
    token,
    body: {
      client_id: sharedClient.id,
      program: 'rus',
      service_area_id: saRow.id,
      job_name: leafUnder.name,
    },
  });
  assert.equal(result.id, leafUnder.id, 'must return the existing project_id');
  assert.equal(result.created, false, 'created must be false for existing leaf');
});

test('resolve-or-create: existing leaf matched case-insensitively', async () => {
  const result = await requestJson('POST', '/api/projects/resolve-or-create', {
    token,
    body: {
      client_id: sharedClient.id,
      program: 'rus',
      service_area_id: saRow.id,
      job_name: leafUnder.name.toUpperCase(),
    },
  });
  assert.equal(result.id, leafUnder.id, 'case-insensitive match must find the same project');
  assert.equal(result.created, false, 'created must be false for case-variant of existing name');
});

test('resolve-or-create: new job_name creates leaf, returns 201 with created:true', async () => {
  const newName = uniqueTag('casc-new-leaf');
  const res = await request('POST', '/api/projects/resolve-or-create', {
    token,
    body: {
      client_id: sharedClient.id,
      program: 'rus',
      service_area_id: saRow.id,
      job_name: newName,
    },
  });
  assert.equal(res.status, 201, 'new leaf must return 201');
  const result = await res.json();
  assert.ok(result.id, 'created project must have an id');
  assert.equal(result.created, true, 'created must be true for new leaf');
  assert.equal(result.parent_id, saFolderRow.id, 'new leaf parent_id must be the SA folder');
  assert.equal(result.is_rollup, false, 'new leaf must not be a rollup');
  cleanup.projects.push(result.id);
});

test('resolve-or-create: new leaf parent_id matches the SA folder', async () => {
  const newName = uniqueTag('casc-parent-check');
  const result = await requestJson('POST', '/api/projects/resolve-or-create', {
    token,
    expectStatus: 201,
    body: {
      client_id: sharedClient.id,
      program: 'rus',
      service_area_id: saRow.id,
      job_name: newName,
    },
  });
  assert.equal(result.parent_id, saFolderRow.id,
    'parent_id of created leaf must equal the service-area folder id');
  cleanup.projects.push(result.id);
});

test('resolve-or-create: auto-created leaf appears in parent_id filter query', async () => {
  const newName = uniqueTag('casc-rollup-check');
  const result = await requestJson('POST', '/api/projects/resolve-or-create', {
    token,
    expectStatus: 201,
    body: {
      client_id: sharedClient.id,
      program: 'rus',
      service_area_id: saRow.id,
      job_name: newName,
    },
  });
  cleanup.projects.push(result.id);

  // Verify the new leaf is visible via the parent_id filter
  const list = await requestJson(
    'GET',
    `/api/projects?parent_id=${saFolderRow.id}&leaves_only=true`,
    { token }
  );
  const ids = new Set(list.map(p => p.id));
  assert.ok(ids.has(result.id),
    'auto-created leaf must appear in GET /api/projects?parent_id= results');
});

test('resolve-or-create: no-EC-for-client+program returns 404', async () => {
  const res = await request('POST', '/api/projects/resolve-or-create', {
    token,
    body: {
      client_id: sharedClient.id,
      program: 'bau',  // sharedEc is 'rus', so 'bau' has no EC
      service_area_id: saRow.id,
      job_name: 'Should Fail',
    },
  });
  assert.equal(res.status, 404, 'missing EC for program must return 404');
});
