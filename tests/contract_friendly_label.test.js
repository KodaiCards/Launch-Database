// Smoke test #4 — contract create → assign → bill, asserting friendly_label
// flows through every layer (Track 0 step 5).
//
// Regression target: commit 1319d37 fixed POST/PUT /api/contracts silently
// dropping the friendly_label field. The bug was visible in the UI as
// "Contract 3" being submitted but the saved row coming back with
// friendly_label = NULL — invoices then printed the bare contract_number
// instead of the loan-friendly label.
//
// We exercise:
//   - POST /api/contracts with friendly_label → response includes it
//   - PUT  /api/contracts/:id changing friendly_label → response includes it
//   - GET  /api/invoices/generate-pdf/preview-data → assembled invoice
//     data has the friendly_label on its contract scope
//
// Last assertion is the real end-to-end gate: the bug only mattered because
// it broke invoice rendering. If friendly_label survives the round-trip
// into invoice data, the user-visible flow is healthy.

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const {
  bootTestServer, close, adminLogin, requestJson,
  fixtures, cleanupAll, uniqueTag,
} = require('./_helpers');

let token;
const cleanup = {
  clients: [], jobs: [], projects: [],
  contracts: [], engineering_contracts: [],
};

before(async () => {
  await bootTestServer();
  token = await adminLogin();
});
after(async () => {
  await cleanupAll(cleanup);
  await close();
});

test('POST /api/contracts persists friendly_label', async () => {
  const client = await fixtures.client();           cleanup.clients.push(client.id);
  const ec = await fixtures.engineeringContract({ client_id: client.id });
  cleanup.engineering_contracts.push(ec.id);

  const body = {
    client_id: client.id,
    contract_number: uniqueTag('515'),
    name: 'Test contract',
    engineering_contract_id: ec.id,
    friendly_label: 'Contract 3',
  };
  const created = await requestJson('POST', '/api/contracts', { token, body });
  cleanup.contracts.push(created.id);
  assert.equal(created.friendly_label, 'Contract 3',
    'POST should round-trip friendly_label');
  assert.equal(created.engineering_contract_id, ec.id);
});

test('PUT /api/contracts/:id updates friendly_label', async () => {
  const client = await fixtures.client();           cleanup.clients.push(client.id);
  const ec = await fixtures.engineeringContract({ client_id: client.id });
  cleanup.engineering_contracts.push(ec.id);
  const contract = await fixtures.contract({
    client_id: client.id,
    engineering_contract_id: ec.id,
    friendly_label: 'Contract 1',
  });
  cleanup.contracts.push(contract.id);

  const updated = await requestJson('PUT', `/api/contracts/${contract.id}`, {
    token,
    body: { friendly_label: 'Contract 7' },
  });
  assert.equal(updated.friendly_label, 'Contract 7',
    'PUT should update friendly_label');
});

test('friendly_label appears in invoice preview data for an assigned project', async () => {
  // Full chain: RUS client → EC → contract (with friendly_label) → permitting
  // job → project with footage. Preview endpoint runs buildInvoiceData and
  // returns JSON; we assert friendly_label survives into the contract scope.
  const client = await fixtures.client({ is_rus: true });
  cleanup.clients.push(client.id);
  const ec = await fixtures.engineeringContract({
    client_id: client.id,
    name: uniqueTag('EC-217'),
    program: 'rus',
  });
  cleanup.engineering_contracts.push(ec.id);
  const contract = await fixtures.contract({
    client_id: client.id,
    engineering_contract_id: ec.id,
    contract_number: uniqueTag('515'),
    friendly_label: 'Contract 3',
  });
  cleanup.contracts.push(contract.id);
  const job = await fixtures.job({
    name: uniqueTag('Permitting'),
    default_billing_type: 'footage',
    is_permitting: true,
    default_rate: 90,
  });
  cleanup.jobs.push(job.id);
  const project = await fixtures.project({
    client_id: client.id,
    contract_id: contract.id,
    job_id: job.id,
    project_type: 'permitting',
    billing_type: 'footage',
    footage: 5280,
    work_order_number: 'WO-FL-100',
  });
  cleanup.projects.push(project.id);

  // Preview endpoint expects the period as query params. Wide window so
  // the footage project is included regardless of when the test runs.
  const qs = new URLSearchParams({
    engineering_contract_id: ec.id,
    job_id: job.id,
    period_start: '1970-01-01',
    period_end: '2099-12-31',
  });
  const data = await requestJson('GET', `/api/invoices/generate-pdf/preview-data?${qs}`, { token });

  assert.ok(Array.isArray(data.contracts), 'response should have contracts[]');
  assert.equal(data.contracts.length, 1, 'expected one contract in scope');
  assert.equal(data.contracts[0].friendly_label, 'Contract 3',
    'invoice data must carry the friendly_label end-to-end');
  assert.ok(data.contracts[0].wos.length >= 1, 'expected at least one WO row');
});
