// tests/inspection_attribution.test.js
//
// Unit-style integration tests for the RUS tab hours-attribution CTE
// in routes/inspection.js. Each scenario seeds a minimal project tree
// and a time entry, then calls GET /api/inspection and asserts that
// hours_in_period matches the expected value.
//
// Attribution rules under test:
//   1. Entry directly on the leaf               → attributed (existing)
//   2. Ancestor entry with matching job_title    → attributed (existing)
//   3. Ancestor entry, mismatched job_title BUT sole leaf under rollup
//                                               → attributed (sole-leaf fallback, NEW)
//   4. Ancestor entry, multi-leaf rollup, ambiguous job_title
//                                               → attributed ONCE (no double-count, NEW)

const test  = require('node:test');
const assert = require('node:assert/strict');
const {
  bootTestServer, close, adminLogin, requestJson,
  fixtures, uniqueTag, cleanupAll, pool,
} = require('./_helpers');

const trash = { clients: [], engineering_contracts: [], contracts: [], jobs: [], projects: [], staff: [], time_entries: [] };

test.before(async () => { await bootTestServer(); });
test.after(async () => {
  await cleanupAll(trash);
  await close();
});

// ─── Shared setup helpers ─────────────────────────────────────────────────

// Build the minimal wiring needed for a project to appear in /api/inspection:
//   client → engineering_contract(program='rus') → contract → project
// Returns { client, ec, contract }.
async function rusWiring(tag) {
  const client = await fixtures.client({ name: uniqueTag(`attr-client-${tag}`) });
  trash.clients.push(client.id);
  const ec = await fixtures.engineeringContract({
    client_id: client.id,
    name: uniqueTag(`ec-${tag}`),
    program: 'rus',
  });
  trash.engineering_contracts.push(ec.id);
  const contract = await fixtures.contract({
    client_id: client.id,
    engineering_contract_id: ec.id,
    friendly_label: uniqueTag(`ctr-${tag}`),
  });
  trash.contracts.push(contract.id);
  return { client, ec, contract };
}

// Create a leaf project with a job_id wired up.
async function leafProject(opts) {
  const p = await fixtures.project(opts);
  trash.projects.push(p.id);
  return p;
}

// Create a rollup project (is_rollup=TRUE, no job_id) as the parent.
// project_type is NOT NULL in the schema with no default — stamp 'other'
// since rollups carry no meaningful type.
async function rollupProject({ name, client_id, contract_id }) {
  const { rows } = await pool.query(
    `INSERT INTO projects (name, client_id, contract_id, is_rollup, status, project_type)
       VALUES ($1, $2, $3, TRUE, 'active', 'other') RETURNING *`,
    [name || uniqueTag('rollup'), client_id, contract_id]
  );
  const p = rows[0];
  trash.projects.push(p.id);
  return p;
}

async function staffMember(tag) {
  const s = await fixtures.staff({ name: uniqueTag(`staff-${tag}`) });
  trash.staff.push(s.id);
  return s;
}

async function timeEntry(opts) {
  const te = await fixtures.timeEntry(opts);
  trash.time_entries.push(te.id);
  return te;
}

// Fetch inspection for a specific set of project ids (YTD, current year).
// Returns a Map<project_id, hours_in_period>.
async function fetchInspectionHours(token) {
  const data = await requestJson('GET', '/api/inspection?period=ytd&status=all', { token });
  const map = new Map();
  for (const p of (data.projects || [])) {
    map.set(p.id, p.hours_in_period);
  }
  return map;
}

// ─── Test 1: Entry directly on the leaf → attributed ─────────────────────
test('direct leaf entry → counted in RUS tab', async () => {
  const token = await adminLogin();
  const { client, contract } = await rusWiring('t1');
  const job = await fixtures.job({ name: uniqueTag('Inspection-t1'), team: 'construction' });
  trash.jobs.push(job.id);

  const leaf = await leafProject({
    name: uniqueTag('leaf-t1'),
    client_id: client.id,
    contract_id: contract.id,
    job_id: job.id,
    status: 'active',
  });
  const staff = await staffMember('t1');
  await timeEntry({ project_id: leaf.id, staff_id: staff.id, entry_date: `${new Date().getFullYear()}-03-01`, hours: 8 });

  const map = await fetchInspectionHours(token);
  assert.ok(map.has(leaf.id), 'leaf must appear in RUS tab');
  assert.equal(map.get(leaf.id), 8, 'direct entry hours should be 8');
});

// ─── Test 2: Ancestor entry with matching job_title → attributed ──────────
test('ancestor entry with matching job_title → counted in RUS tab', async () => {
  const token = await adminLogin();
  const { client, contract } = await rusWiring('t2');
  const job = await fixtures.job({ name: uniqueTag('Inspection-t2'), team: 'construction' });
  trash.jobs.push(job.id);

  const rollup = await rollupProject({ client_id: client.id, contract_id: contract.id });
  const leaf = await leafProject({
    name: uniqueTag('leaf-t2'),
    client_id: client.id,
    contract_id: contract.id,
    job_id: job.id,
    parent_id: rollup.id,
    status: 'active',
  });
  const staff = await staffMember('t2');
  // Entry sits on rollup with job_title matching leaf's job name
  await timeEntry({
    project_id: rollup.id,
    staff_id: staff.id,
    entry_date: `${new Date().getFullYear()}-03-02`,
    hours: 6,
    job_title: job.name,  // exact match
  });

  const map = await fetchInspectionHours(token);
  assert.ok(map.has(leaf.id), 'leaf must appear in RUS tab');
  assert.equal(map.get(leaf.id), 6, 'rollup entry with matching job_title should attribute 6h to leaf');
});

// ─── Test 3: Sole-leaf fallback — mismatched job_title, ONE leaf ──────────
test('ancestor entry with mismatched job_title BUT sole leaf → counted via sole-leaf fallback', async () => {
  const token = await adminLogin();
  const { client, contract } = await rusWiring('t3');
  const job = await fixtures.job({ name: uniqueTag('Inspection-t3'), team: 'construction' });
  trash.jobs.push(job.id);

  const rollup = await rollupProject({ client_id: client.id, contract_id: contract.id });
  const leaf = await leafProject({
    name: uniqueTag('leaf-t3'),
    client_id: client.id,
    contract_id: contract.id,
    job_id: job.id,
    parent_id: rollup.id,
    status: 'active',
  });
  const staff = await staffMember('t3');
  // Entry on rollup with job_title='Other' — no exact match.
  // Because there is EXACTLY ONE leaf with a job_id under this rollup,
  // the sole-leaf fallback should attribute the entry to it.
  await timeEntry({
    project_id: rollup.id,
    staff_id: staff.id,
    entry_date: `${new Date().getFullYear()}-03-03`,
    hours: 5,
    job_title: 'Other',
  });

  const map = await fetchInspectionHours(token);
  assert.ok(map.has(leaf.id), 'leaf must appear in RUS tab');
  assert.equal(map.get(leaf.id), 5, 'sole-leaf fallback should attribute 5h to the only leaf');
});

// ─── Test 4: Multi-leaf rollup + ambiguous job_title → no double-count ────
test('ancestor entry on multi-leaf rollup → attributed to at most one leaf (no double-count)', async () => {
  const token = await adminLogin();
  const { client, contract } = await rusWiring('t4');
  const jobA = await fixtures.job({ name: uniqueTag('Inspection-t4'), team: 'construction' });
  const jobB = await fixtures.job({ name: uniqueTag('ResidentEngineer-t4'), team: 'construction' });
  trash.jobs.push(jobA.id, jobB.id);

  const rollup = await rollupProject({ client_id: client.id, contract_id: contract.id });
  const leafA = await leafProject({
    name: uniqueTag('leafA-t4'),
    client_id: client.id,
    contract_id: contract.id,
    job_id: jobA.id,
    parent_id: rollup.id,
    status: 'active',
  });
  const leafB = await leafProject({
    name: uniqueTag('leafB-t4'),
    client_id: client.id,
    contract_id: contract.id,
    job_id: jobB.id,
    parent_id: rollup.id,
    status: 'active',
  });
  const staff = await staffMember('t4');
  // Entry on rollup with job_title that doesn't match either leaf exactly.
  // Multi-leaf rollup → sole-leaf fallback does NOT apply. Substring check
  // also won't match 'Other'. Entry must appear on AT MOST ONE leaf.
  await timeEntry({
    project_id: rollup.id,
    staff_id: staff.id,
    entry_date: `${new Date().getFullYear()}-03-04`,
    hours: 4,
    job_title: 'Other',
  });

  const map = await fetchInspectionHours(token);
  const hoursA = map.get(leafA.id) || 0;
  const hoursB = map.get(leafB.id) || 0;
  // Neither should exceed 4 (the entry's hours) and the sum must not exceed 4.
  assert.ok(hoursA <= 4, `leafA hours (${hoursA}) should not exceed entry hours 4`);
  assert.ok(hoursB <= 4, `leafB hours (${hoursB}) should not exceed entry hours 4`);
  assert.ok(hoursA + hoursB <= 4, `total attributed hours (${hoursA + hoursB}) must not exceed 4 (no double-count)`);
});
