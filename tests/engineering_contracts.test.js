// tests/engineering_contracts.test.js
//
// Tests for Wave 2A backend additions:
//   EC job visibility endpoints (GET /jobs, GET /job-visibility,
//   POST /job-visibility, DELETE /job-visibility/:jobId, PUT /job-visibility)
//   EC construction contract endpoints (GET /construction-contracts,
//   POST /construction-contracts, DELETE /construction-contracts/:contractId)
//
// NOTE: DATABASE_URL must be set. Tests skip gracefully via _helpers.js if not.

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
  contracts: [],
};
const extraCleanup = {
  jobs: [],
  ec_job_visibility: [],
};

before(async () => {
  await bootTestServer();
  token = await adminLogin();
});

after(async () => {
  if (extraCleanup.ec_job_visibility.length) {
    try {
      await pool.query(
        `DELETE FROM ec_job_visibility WHERE id = ANY($1::uuid[])`,
        [extraCleanup.ec_job_visibility]
      );
    } catch (e) {
      console.warn('[cleanup] ec_job_visibility DELETE failed:', e.message);
    }
  }
  if (extraCleanup.jobs.length) {
    try {
      await pool.query(
        `DELETE FROM jobs WHERE id = ANY($1::uuid[])`,
        [extraCleanup.jobs]
      );
    } catch (e) {
      console.warn('[cleanup] jobs DELETE failed:', e.message);
    }
  }
  // Detach test contracts before deleting them so FK on engineering_contract_id
  // doesn't block the EC deletion.
  if (cleanup.contracts.length) {
    try {
      await pool.query(
        `UPDATE contracts SET engineering_contract_id = NULL WHERE id = ANY($1::uuid[])`,
        [cleanup.contracts]
      );
    } catch (e) {
      console.warn('[cleanup] contracts detach failed:', e.message);
    }
  }
  await cleanupAll(cleanup);
  await close();
});

// ─── Shared fixtures ─────────────────────────────────────────────────────────

let sharedClient;
let sharedEc;
let rusJob;
let genericJob;

before(async () => {
  sharedClient = await fixtures.client({ name: uniqueTag('ec-test-client') });
  cleanup.clients.push(sharedClient.id);

  sharedEc = await fixtures.engineeringContract({
    client_id: sharedClient.id,
    program: 'rus',
    name: uniqueTag('ec-test-ec'),
    contract_number: uniqueTag('EC-TEST'),
  });
  cleanup.engineering_contracts.push(sharedEc.id);

  // Two jobs: one RUS-scoped, one non-RUS.
  const { rows: jRows1 } = await pool.query(
    `INSERT INTO jobs (name, default_billing_type, default_rate, team, active,
                       for_psc_client, for_generic_client, program_scope)
       VALUES ($1, 'hourly', 90, 'construction', TRUE, TRUE, FALSE, 'rus')
       RETURNING *`,
    [uniqueTag('job-rus')]
  );
  rusJob = jRows1[0];
  extraCleanup.jobs.push(rusJob.id);

  const { rows: jRows2 } = await pool.query(
    `INSERT INTO jobs (name, default_billing_type, default_rate, team, active,
                       for_psc_client, for_generic_client, program_scope)
       VALUES ($1, 'hourly', 80, 'construction', TRUE, FALSE, TRUE, 'non_rus')
       RETURNING *`,
    [uniqueTag('job-generic')]
  );
  genericJob = jRows2[0];
  extraCleanup.jobs.push(genericJob.id);
});

// ─── GET /api/engineering-contracts/:ecId/jobs (3-tier precedence) ────────────

test('GET /jobs — job_assignments tier: client-scoped assignment matches EC', async () => {
  // Directly insert a client-scoped job_assignment (engineering_contract_id = NULL).
  // This tests the F1 fix: Tier 1 should match rows where
  // engineering_contract_id IS NULL if the client matches.
  const jaRes = await pool.query(
    `INSERT INTO job_assignments (client_id, engineering_contract_id, team, job_id)
     VALUES ($1, NULL, NULL, $2)
     RETURNING id`,
    [sharedClient.id, genericJob.id]
  );
  const jaId = jaRes.rows[0].id;

  try {
    const list = await requestJson('GET', `/api/engineering-contracts/${sharedEc.id}/jobs`, { token });
    assert.ok(Array.isArray(list), 'must return array');

    const foundGeneric = list.find(j => j.id === genericJob.id);
    assert.ok(foundGeneric, 'client-scoped job_assignment must activate Tier 1');
    assert.equal(
      foundGeneric.is_visible_via,
      'job_assignments',
      'must report is_visible_via = job_assignments'
    );
  } finally {
    // Cleanup: delete the job_assignment
    try {
      await pool.query(`DELETE FROM job_assignments WHERE id = $1`, [jaId]);
    } catch (e) {
      console.warn('[cleanup] failed to delete job_assignment:', e.message);
    }
  }
});

test('GET /jobs — legacy_filter tier: RUS EC returns only rus/shared program_scope jobs', async () => {
  // No job_assignments, no ec_job_visibility rows for this EC → legacy tier.
  const list = await requestJson('GET', `/api/engineering-contracts/${sharedEc.id}/jobs`, { token });
  assert.ok(Array.isArray(list), 'must return array');

  const foundRus     = list.find(j => j.id === rusJob.id);
  const foundGeneric = list.find(j => j.id === genericJob.id);

  assert.ok(foundRus, 'rus job must be in legacy-tier response for RUS EC');
  assert.equal(foundRus.is_visible_via, 'legacy_filter', 'must report is_visible_via = legacy_filter');

  // non_rus job must NOT be visible for a RUS EC under legacy filter.
  assert.ok(!foundGeneric, 'non_rus job must not appear for RUS EC in legacy tier');
});

test('GET /jobs — ec_job_visibility tier overrides legacy when rows exist', async () => {
  // Add genericJob to the explicit visibility list.
  const visRow = await requestJson(
    'POST',
    `/api/engineering-contracts/${sharedEc.id}/job-visibility`,
    { token, body: { job_id: genericJob.id }, expectStatus: 201 }
  );
  assert.ok(visRow.id, 'visibility row must be created');
  extraCleanup.ec_job_visibility.push(visRow.id);

  const list = await requestJson('GET', `/api/engineering-contracts/${sharedEc.id}/jobs`, { token });
  assert.ok(Array.isArray(list), 'must return array');

  const foundGeneric = list.find(j => j.id === genericJob.id);
  const foundRus     = list.find(j => j.id === rusJob.id);

  assert.ok(foundGeneric, 'explicitly added job must appear');
  assert.equal(foundGeneric.is_visible_via, 'ec_job_visibility', 'must report ec_job_visibility tier');
  assert.ok(!foundRus, 'legacy-tier job must NOT appear when ec_job_visibility rows exist');

  // Cleanup visibility row.
  await requestJson(
    'DELETE',
    `/api/engineering-contracts/${sharedEc.id}/job-visibility/${genericJob.id}`,
    { token }
  );
  extraCleanup.ec_job_visibility = extraCleanup.ec_job_visibility.filter(id => id !== visRow.id);
});

test('GET /jobs — 404 for invalid ecId', async () => {
  const res = await request('GET', `/api/engineering-contracts/00000000-0000-0000-0000-000000000000/jobs`, { token });
  assert.equal(res.status, 404, 'must return 404 for non-existent EC');
});

// ─── GET /api/engineering-contracts/:ecId/job-visibility ──────────────────────

test('GET /job-visibility — returns empty array when no rows exist', async () => {
  const list = await requestJson('GET', `/api/engineering-contracts/${sharedEc.id}/job-visibility`, { token });
  const relevant = list.filter(r => r.job_id === genericJob.id || r.job_id === rusJob.id);
  assert.equal(relevant.length, 0, 'must return no relevant rows when none added');
});

test('GET /job-visibility — 404 for invalid ecId', async () => {
  const res = await request('GET', `/api/engineering-contracts/00000000-0000-0000-0000-000000000000/job-visibility`, { token });
  assert.equal(res.status, 404);
});

// ─── POST /api/engineering-contracts/:ecId/job-visibility ─────────────────────

test('POST /job-visibility — adds job and returns 201', async () => {
  const res = await requestJson(
    'POST',
    `/api/engineering-contracts/${sharedEc.id}/job-visibility`,
    { token, body: { job_id: rusJob.id }, expectStatus: 201 }
  );
  assert.ok(res.id, 'must return row id');
  assert.equal(res.engineering_contract_id, sharedEc.id);
  assert.equal(res.job_id, rusJob.id);
  extraCleanup.ec_job_visibility.push(res.id);

  // Verify in db.
  const { rows } = await pool.query(
    `SELECT id FROM ec_job_visibility WHERE engineering_contract_id = $1 AND job_id = $2`,
    [sharedEc.id, rusJob.id]
  );
  assert.ok(rows.length, 'row must exist in DB');

  // Cleanup.
  await requestJson('DELETE', `/api/engineering-contracts/${sharedEc.id}/job-visibility/${rusJob.id}`, { token });
  extraCleanup.ec_job_visibility = extraCleanup.ec_job_visibility.filter(id => id !== res.id);
});

test('POST /job-visibility — 409 on duplicate', async () => {
  const first = await requestJson(
    'POST',
    `/api/engineering-contracts/${sharedEc.id}/job-visibility`,
    { token, body: { job_id: rusJob.id }, expectStatus: 201 }
  );
  extraCleanup.ec_job_visibility.push(first.id);

  const dupRes = await request(
    'POST',
    `/api/engineering-contracts/${sharedEc.id}/job-visibility`,
    { token, body: { job_id: rusJob.id } }
  );
  assert.equal(dupRes.status, 409, 'duplicate must return 409');

  // Cleanup.
  await requestJson('DELETE', `/api/engineering-contracts/${sharedEc.id}/job-visibility/${rusJob.id}`, { token });
  extraCleanup.ec_job_visibility = extraCleanup.ec_job_visibility.filter(id => id !== first.id);
});

test('POST /job-visibility — 400 when job_id missing', async () => {
  const res = await request(
    'POST',
    `/api/engineering-contracts/${sharedEc.id}/job-visibility`,
    { token, body: {} }
  );
  assert.equal(res.status, 400);
});

test('POST /job-visibility — 404 when job_id does not exist', async () => {
  const res = await request(
    'POST',
    `/api/engineering-contracts/${sharedEc.id}/job-visibility`,
    { token, body: { job_id: '00000000-0000-0000-0000-000000000000' } }
  );
  assert.equal(res.status, 404);
});

test('POST /job-visibility — 404 when ecId invalid', async () => {
  const res = await request(
    'POST',
    `/api/engineering-contracts/00000000-0000-0000-0000-000000000000/job-visibility`,
    { token, body: { job_id: rusJob.id } }
  );
  assert.equal(res.status, 404);
});

// ─── DELETE /api/engineering-contracts/:ecId/job-visibility/:jobId ────────────

test('DELETE /job-visibility/:jobId — removes row, returns { ok: true }', async () => {
  const posted = await requestJson(
    'POST',
    `/api/engineering-contracts/${sharedEc.id}/job-visibility`,
    { token, body: { job_id: rusJob.id }, expectStatus: 201 }
  );
  extraCleanup.ec_job_visibility.push(posted.id);

  const del = await requestJson(
    'DELETE',
    `/api/engineering-contracts/${sharedEc.id}/job-visibility/${rusJob.id}`,
    { token }
  );
  assert.equal(del.ok, true, 'DELETE must return { ok: true }');
  extraCleanup.ec_job_visibility = extraCleanup.ec_job_visibility.filter(id => id !== posted.id);

  // Confirm gone.
  const list = await requestJson('GET', `/api/engineering-contracts/${sharedEc.id}/job-visibility`, { token });
  const stillThere = list.find(r => r.job_id === rusJob.id);
  assert.ok(!stillThere, 'row must be gone after DELETE');
});

test('DELETE /job-visibility/:jobId — 404 when row does not exist', async () => {
  const res = await request(
    'DELETE',
    `/api/engineering-contracts/${sharedEc.id}/job-visibility/${rusJob.id}`,
    { token }
  );
  assert.equal(res.status, 404);
});

// ─── PUT /api/engineering-contracts/:ecId/job-visibility ──────────────────────

test('PUT /job-visibility — bulk replaces the full list', async () => {
  // Pre-seed rusJob.
  const seed = await requestJson(
    'POST',
    `/api/engineering-contracts/${sharedEc.id}/job-visibility`,
    { token, body: { job_id: rusJob.id }, expectStatus: 201 }
  );
  extraCleanup.ec_job_visibility.push(seed.id);

  // Replace with only genericJob.
  const newList = await requestJson(
    'PUT',
    `/api/engineering-contracts/${sharedEc.id}/job-visibility`,
    { token, body: { job_ids: [genericJob.id] } }
  );
  assert.ok(Array.isArray(newList), 'PUT must return array');
  assert.equal(newList.length, 1, 'must contain exactly 1 row');
  assert.equal(newList[0].job_id, genericJob.id, 'must reference new job');

  extraCleanup.ec_job_visibility = extraCleanup.ec_job_visibility.filter(id => id !== seed.id);
  if (newList[0]) extraCleanup.ec_job_visibility.push(newList[0].id);

  // Confirm via GET.
  const getList = await requestJson('GET', `/api/engineering-contracts/${sharedEc.id}/job-visibility`, { token });
  assert.ok(!getList.find(r => r.job_id === rusJob.id), 'old job must be gone');
  assert.ok(getList.find(r => r.job_id === genericJob.id), 'new job must be present');

  // Clear list for next tests.
  await requestJson('PUT', `/api/engineering-contracts/${sharedEc.id}/job-visibility`, { token, body: { job_ids: [] } });
  if (newList[0]) extraCleanup.ec_job_visibility = extraCleanup.ec_job_visibility.filter(id => id !== newList[0].id);
});

test('PUT /job-visibility — empty job_ids clears the list', async () => {
  const seed = await requestJson(
    'POST',
    `/api/engineering-contracts/${sharedEc.id}/job-visibility`,
    { token, body: { job_id: rusJob.id }, expectStatus: 201 }
  );
  extraCleanup.ec_job_visibility.push(seed.id);

  const result = await requestJson(
    'PUT',
    `/api/engineering-contracts/${sharedEc.id}/job-visibility`,
    { token, body: { job_ids: [] } }
  );
  assert.ok(Array.isArray(result), 'must return array');
  assert.equal(result.length, 0, 'empty job_ids must clear the list');
  extraCleanup.ec_job_visibility = extraCleanup.ec_job_visibility.filter(id => id !== seed.id);

  const getList = await requestJson('GET', `/api/engineering-contracts/${sharedEc.id}/job-visibility`, { token });
  assert.ok(!getList.find(r => r.job_id === rusJob.id), 'row must be gone');
});

test('PUT /job-visibility — 400 when job_ids is not an array', async () => {
  const res = await request(
    'PUT',
    `/api/engineering-contracts/${sharedEc.id}/job-visibility`,
    { token, body: { job_ids: 'not-an-array' } }
  );
  assert.equal(res.status, 400);
});

test('PUT /job-visibility — 404 for invalid ecId', async () => {
  const res = await request(
    'PUT',
    `/api/engineering-contracts/00000000-0000-0000-0000-000000000000/job-visibility`,
    { token, body: { job_ids: [] } }
  );
  assert.equal(res.status, 404);
});

// ─── GET /api/engineering-contracts/:ecId/construction-contracts ──────────────

test('GET /construction-contracts — returns explicit and legacy_fallback contracts', async () => {
  // Explicitly attached contract.
  const explicitContract = await fixtures.contract({
    client_id: sharedClient.id,
    contract_number: uniqueTag('CN-EXPLICIT'),
    engineering_contract_id: sharedEc.id,
  });
  cleanup.contracts.push(explicitContract.id);

  // Unscoped contract at same client (legacy_fallback).
  const fallbackContract = await fixtures.contract({
    client_id: sharedClient.id,
    contract_number: uniqueTag('CN-FALLBACK'),
    engineering_contract_id: null,
  });
  cleanup.contracts.push(fallbackContract.id);

  const list = await requestJson(
    'GET',
    `/api/engineering-contracts/${sharedEc.id}/construction-contracts`,
    { token }
  );
  assert.ok(Array.isArray(list), 'must return array');

  const foundExplicit = list.find(c => c.id === explicitContract.id);
  const foundFallback = list.find(c => c.id === fallbackContract.id);

  assert.ok(foundExplicit, 'explicitly attached contract must appear');
  assert.equal(foundExplicit.scope, 'explicit', 'must be marked explicit');

  assert.ok(foundFallback, 'unscoped same-client contract must appear as legacy_fallback');
  assert.equal(foundFallback.scope, 'legacy_fallback', 'must be marked legacy_fallback');
});

test('GET /construction-contracts — 404 for invalid ecId', async () => {
  const res = await request(
    'GET',
    `/api/engineering-contracts/00000000-0000-0000-0000-000000000000/construction-contracts`,
    { token }
  );
  assert.equal(res.status, 404);
});

// ─── POST /api/engineering-contracts/:ecId/construction-contracts ─────────────

test('POST /construction-contracts — attaches a contract to the EC', async () => {
  const contract = await fixtures.contract({
    client_id: sharedClient.id,
    contract_number: uniqueTag('CN-ATTACH'),
    engineering_contract_id: null,
  });
  cleanup.contracts.push(contract.id);

  const res = await requestJson(
    'POST',
    `/api/engineering-contracts/${sharedEc.id}/construction-contracts`,
    { token, body: { contract_id: contract.id } }
  );
  assert.ok(res.id, 'must return the updated contract row');
  assert.equal(res.engineering_contract_id, sharedEc.id, 'engineering_contract_id must be set');

  // Verify in DB.
  const { rows } = await pool.query(
    `SELECT engineering_contract_id FROM contracts WHERE id = $1`,
    [contract.id]
  );
  assert.equal(rows[0].engineering_contract_id, sharedEc.id, 'DB must have updated engineering_contract_id');
});

test('POST /construction-contracts — idempotent: re-attaching same EC is OK', async () => {
  const contract = await fixtures.contract({
    client_id: sharedClient.id,
    contract_number: uniqueTag('CN-REATTACH'),
    engineering_contract_id: sharedEc.id,
  });
  cleanup.contracts.push(contract.id);

  // Re-attach to the same EC should succeed (not a different EC).
  const res = await requestJson(
    'POST',
    `/api/engineering-contracts/${sharedEc.id}/construction-contracts`,
    { token, body: { contract_id: contract.id } }
  );
  assert.equal(res.engineering_contract_id, sharedEc.id, 'must remain attached to same EC');
});

test('POST /construction-contracts — 400 when contract_id missing', async () => {
  const res = await request(
    'POST',
    `/api/engineering-contracts/${sharedEc.id}/construction-contracts`,
    { token, body: {} }
  );
  assert.equal(res.status, 400);
});

test('POST /construction-contracts — 404 when contract_id invalid', async () => {
  const res = await request(
    'POST',
    `/api/engineering-contracts/${sharedEc.id}/construction-contracts`,
    { token, body: { contract_id: '00000000-0000-0000-0000-000000000000' } }
  );
  assert.equal(res.status, 404);
});

test('POST /construction-contracts — 404 for invalid ecId', async () => {
  const contract = await fixtures.contract({
    client_id: sharedClient.id,
    contract_number: uniqueTag('CN-BAD-EC'),
    engineering_contract_id: null,
  });
  cleanup.contracts.push(contract.id);

  const res = await request(
    'POST',
    `/api/engineering-contracts/00000000-0000-0000-0000-000000000000/construction-contracts`,
    { token, body: { contract_id: contract.id } }
  );
  assert.equal(res.status, 404);
});

test('POST /construction-contracts — 409 when contract belongs to different client', async () => {
  const otherClient = await fixtures.client({ name: uniqueTag('other-client') });
  cleanup.clients.push(otherClient.id);

  const otherContract = await fixtures.contract({
    client_id: otherClient.id,
    contract_number: uniqueTag('CN-OTHERCLIENT'),
  });
  cleanup.contracts.push(otherContract.id);

  const res = await request(
    'POST',
    `/api/engineering-contracts/${sharedEc.id}/construction-contracts`,
    { token, body: { contract_id: otherContract.id } }
  );
  assert.equal(res.status, 409, 'must reject cross-client attachment');
});

test('POST /construction-contracts — 409 when contract already attached to different EC', async () => {
  const otherEc = await fixtures.engineeringContract({
    client_id: sharedClient.id,
    program: 'bau',
    name: uniqueTag('other-ec'),
    contract_number: uniqueTag('EC-OTHER'),
  });
  cleanup.engineering_contracts.push(otherEc.id);

  const contract = await fixtures.contract({
    client_id: sharedClient.id,
    contract_number: uniqueTag('CN-ALREADY-ATTACHED'),
    engineering_contract_id: otherEc.id,
  });
  cleanup.contracts.push(contract.id);

  const res = await request(
    'POST',
    `/api/engineering-contracts/${sharedEc.id}/construction-contracts`,
    { token, body: { contract_id: contract.id } }
  );
  assert.equal(res.status, 409, 'must reject re-attachment to different EC');
});

// ─── DELETE /api/engineering-contracts/:ecId/construction-contracts/:contractId

test('DELETE /construction-contracts/:contractId — detaches contract (sets null)', async () => {
  const contract = await fixtures.contract({
    client_id: sharedClient.id,
    contract_number: uniqueTag('CN-DETACH'),
    engineering_contract_id: sharedEc.id,
  });
  cleanup.contracts.push(contract.id);

  const res = await requestJson(
    'DELETE',
    `/api/engineering-contracts/${sharedEc.id}/construction-contracts/${contract.id}`,
    { token }
  );
  assert.equal(res.ok, true, 'DELETE must return { ok: true }');

  // Verify detached in DB.
  const { rows } = await pool.query(
    `SELECT engineering_contract_id FROM contracts WHERE id = $1`,
    [contract.id]
  );
  assert.equal(rows[0].engineering_contract_id, null, 'DB must have null engineering_contract_id');
});

test('DELETE /construction-contracts/:contractId — 404 when not attached to this EC', async () => {
  const contract = await fixtures.contract({
    client_id: sharedClient.id,
    contract_number: uniqueTag('CN-NOT-ATTACHED'),
    engineering_contract_id: null,
  });
  cleanup.contracts.push(contract.id);

  const res = await request(
    'DELETE',
    `/api/engineering-contracts/${sharedEc.id}/construction-contracts/${contract.id}`,
    { token }
  );
  assert.equal(res.status, 404);
});
