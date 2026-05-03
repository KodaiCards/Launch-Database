// Smoke test #3 — PSC RUS PDF generation (Track 0 step 4).
//
// Asserts that POST /api/invoices/generate-pdf-from-projects on a fully-
// configured PSC RUS permitting project returns a real PDF (non-trivial
// byte length, application/pdf content-type). This is the make-or-break
// invoice flow — if the renderer crashes, every PSC RUS bill breaks.
//
// We use the FOOTAGE/permitting path because it requires fewer fixtures
// (no time entries needed — permitting bills off project.footage). The
// hourly path is conceptually parallel and gets covered indirectly by the
// contract→bill smoke test.

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const {
  bootTestServer, close, adminLogin, request, requestJson,
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

test('POST /api/invoices/generate-pdf-from-projects returns a real PDF for a permitting project', async () => {
  // Full PSC RUS chain: RUS client → engineering contract → contract → job +
  // project with footage. Footage projects don't need time entries, so this
  // is the leanest end-to-end path through the renderer.
  const client = await fixtures.client({ is_rus: true });
  cleanup.clients.push(client.id);
  const ec = await fixtures.engineeringContract({
    client_id: client.id,
    name: uniqueTag('EC-217'),
    loan_name: 'Reconnect 3',
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
    default_rate: 90,
    is_permitting: true,
    billing_code: '111-A',
  });
  cleanup.jobs.push(job.id);
  const project = await fixtures.project({
    client_id: client.id,
    contract_id: contract.id,
    job_id: job.id,
    project_type: 'permitting',
    billing_type: 'footage',
    footage: 2640,                  // 0.5 mile
    work_order_number: 'WO-001',
    name: 'WO-001 Permitting',
  });
  cleanup.projects.push(project.id);

  const res = await request(
    'POST',
    '/api/invoices/generate-pdf-from-projects',
    { token, body: { project_ids: [project.id] } }
  );
  assert.equal(res.status, 200, `expected 200, got ${res.status}`);
  assert.equal(res.headers.get('content-type'), 'application/pdf');

  const buf = Buffer.from(await res.arrayBuffer());
  assert.ok(buf.length > 5000,
    `PDF should be > 5KB; got ${buf.length} bytes`);
  // PDF magic bytes: %PDF-
  assert.equal(buf.slice(0, 5).toString('ascii'), '%PDF-',
    'response should start with the PDF magic header');
});

test('POST with empty project_ids returns 400', async () => {
  const res = await requestJson(
    'POST',
    '/api/invoices/generate-pdf-from-projects',
    { token, body: { project_ids: [] }, expectStatus: 400 }
  );
  assert.match(res.error || '', /project_ids/i);
});

test('POST for a non-RUS client returns 422 with conflicts', async () => {
  // Regression: invoice template is PSC RUS-exclusive. Trying to bill a
  // non-RUS client should fail loudly with a conflicts payload, not silently
  // generate a malformed PDF (see CLEANUP_PLAN.md Track 3.4 / memory file
  // reference_invoice_non_rus_formats.md).
  const client = await fixtures.client({ is_rus: false });
  cleanup.clients.push(client.id);
  const ec = await fixtures.engineeringContract({ client_id: client.id });
  cleanup.engineering_contracts.push(ec.id);
  const contract = await fixtures.contract({
    client_id: client.id,
    engineering_contract_id: ec.id,
  });
  cleanup.contracts.push(contract.id);
  const job = await fixtures.job({
    default_billing_type: 'footage',
    is_permitting: true,
  });
  cleanup.jobs.push(job.id);
  const project = await fixtures.project({
    client_id: client.id,
    contract_id: contract.id,
    job_id: job.id,
    billing_type: 'footage',
    footage: 1000,
  });
  cleanup.projects.push(project.id);

  const res = await requestJson(
    'POST',
    '/api/invoices/generate-pdf-from-projects',
    { token, body: { project_ids: [project.id] }, expectStatus: 422 }
  );
  assert.ok(Array.isArray(res.conflicts) && res.conflicts.length > 0,
    'response should include a conflicts array');
  assert.ok(
    res.conflicts.some(c => /not RUS/i.test(c)),
    `expected a "not RUS" conflict, got: ${JSON.stringify(res.conflicts)}`
  );
});
