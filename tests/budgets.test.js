// tests/budgets.test.js
//
// Wave 176 security fix verification for routes/budgets.js:
//   F1 HIGH  — logAudit fire-and-forget on POST/PUT/DELETE budget + budget_code
//   F2 HIGH  — IDOR ownership check: design_manager cannot touch permitting-team budget
//   F3 HIGH  — GET /by-area elevated to requireManagerOrAdmin (designer-role gets 403)
//   F4 MED   — GET /api/budgets elevated to requireManagerOrAdmin
//   F5 MED   — GET /api/budget-codes elevated to requireManagerOrAdmin
//   F6 MED   — PUT non-existent id → 404 (not silent 200)
//   F7 MED   — total_amount=-100 → 400 non-negative validation

const test  = require('node:test');
const assert = require('node:assert/strict');
const bcrypt = require('bcryptjs');
const {
  bootTestServer, close, adminLogin, requestJson,
  fixtures, cleanupAll, pool, baseUrl,
} = require('./_helpers');

// ─── Cleanup tracking ─────────────────────────────────────────────────────
const trash = {
  budgets:      [],
  budget_codes: [],
  projects:     [],
  jobs:         [],
  clients:      [],
  engineering_contracts: [],
  users:        [],
};

// ─── Helpers ──────────────────────────────────────────────────────────────

async function createUserWithRole(role) {
  const uname = `bgt_${role}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const hash  = await bcrypt.hash('TestPass123!', 10);
  const { rows } = await pool.query(
    `INSERT INTO users (username, password_hash, role, full_name, active)
     VALUES ($1,$2,$3,$4,TRUE) RETURNING id`,
    [uname, hash, role, `Test ${role}`]
  );
  trash.users.push(rows[0].id);

  const res = await fetch(`${baseUrl()}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: uname, password: 'TestPass123!' }),
  });
  if (!res.ok) throw new Error(`Login failed for ${uname}: ${res.status}`);
  const json = await res.json();
  return { id: rows[0].id, token: json.token };
}

// Seed a budget scoped to an EC — no project FK needed, avoids constraint issues.
async function seedEcBudget({ name } = {}) {
  const client = await fixtures.client();
  trash.clients.push(client.id);
  const ec = await pool.query(
    `INSERT INTO engineering_contracts (client_id, name, contract_number, program)
     VALUES ($1,$2,$3,'rus') RETURNING id`,
    [client.id, `EC-${Date.now()}`, `EC-${Date.now()}`]
  );
  const ecId = ec.rows[0].id;
  trash.engineering_contracts.push(ecId);

  const { rows } = await pool.query(
    `INSERT INTO budgets (engineering_contract_id, name, total_amount)
     VALUES ($1,$2,$3) RETURNING *`,
    [ecId, name || `Budget-${Date.now()}`, 50000]
  );
  trash.budgets.push(rows[0].id);
  return rows[0];
}

// Seed a budget scoped to a project with a specific team.
async function seedProjectBudget({ team }) {
  const client = await fixtures.client();
  trash.clients.push(client.id);
  const job = await fixtures.job({ team });
  trash.jobs.push(job.id);
  const project = await fixtures.project({ client_id: client.id, job_id: job.id });
  trash.projects.push(project.id);

  const { rows } = await pool.query(
    `INSERT INTO budgets (project_id, name, total_amount)
     VALUES ($1,$2,$3) RETURNING *`,
    [project.id, `Budget-${Date.now()}`, 10000]
  );
  trash.budgets.push(rows[0].id);
  return { budget: rows[0], project };
}

// ─── Lifecycle ────────────────────────────────────────────────────────────
test.before(async () => {
  await bootTestServer();
  await adminLogin();
});

test.after(async () => {
  // budget_codes first (FK → budgets)
  if (trash.budget_codes.length) {
    await pool.query(`DELETE FROM budget_codes WHERE id = ANY($1::uuid[])`, [trash.budget_codes])
      .catch(e => console.warn('[cleanup] budget_codes:', e.message));
  }
  // budgets before projects + ECs
  if (trash.budgets.length) {
    await pool.query(`DELETE FROM budgets WHERE id = ANY($1::uuid[])`, [trash.budgets])
      .catch(e => console.warn('[cleanup] budgets:', e.message));
  }
  if (trash.engineering_contracts.length) {
    await pool.query(`DELETE FROM engineering_contracts WHERE id = ANY($1::uuid[])`, [trash.engineering_contracts])
      .catch(e => console.warn('[cleanup] engineering_contracts:', e.message));
  }
  await cleanupAll({
    projects: trash.projects,
    jobs:     trash.jobs,
    clients:  trash.clients,
  });
  if (trash.users.length) {
    await pool.query(`DELETE FROM users WHERE id = ANY($1::uuid[])`, [trash.users])
      .catch(e => console.warn('[cleanup] users:', e.message));
  }
  await close();
});

// ─── F1: audit log row on budget.create ───────────────────────────────────
test('F1: POST /api/budgets creates an audit_log row with action=budget.create', async () => {
  const token = await adminLogin();
  const client = await fixtures.client();
  trash.clients.push(client.id);

  const ec = await pool.query(
    `INSERT INTO engineering_contracts (client_id, name, contract_number, program)
     VALUES ($1,$2,$3,'rus') RETURNING id`,
    [client.id, `EC-F1-${Date.now()}`, `EC-F1-${Date.now()}`]
  );
  const ecId = ec.rows[0].id;
  trash.engineering_contracts.push(ecId);

  const created = await requestJson('POST', '/api/budgets', {
    token,
    body: { engineering_contract_id: ecId, name: 'F1 Budget', total_amount: 5000 },
    expectStatus: 200,
  });
  assert.ok(created.id, 'POST must return the new budget row with an id');
  trash.budgets.push(created.id);

  // Allow the fire-and-forget promise a tick to settle
  await new Promise(r => setImmediate(r));

  const { rows } = await pool.query(
    `SELECT action, entity_type, entity_id
       FROM audit_log
      WHERE entity_type = 'budget' AND entity_id = $1 AND action = 'budget.create'
      ORDER BY at DESC LIMIT 1`,
    [created.id]
  );
  assert.equal(rows.length, 1, 'audit_log must have exactly one budget.create row');
  assert.equal(rows[0].action, 'budget.create');
  assert.equal(rows[0].entity_type, 'budget');
});

// ─── F2: design_manager cannot PUT on a permitting-team budget ─────────────
test('F2: design_manager PUT on permitting-team budget returns 404', async () => {
  const { budget } = await seedProjectBudget({ team: 'permitting' });
  const manager = await createUserWithRole('design_manager');

  const res = await requestJson('PUT', `/api/budgets/${budget.id}`, {
    token: manager.token,
    body: { name: 'hijacked', total_amount: 99999 },
    expectStatus: 404,
  });
  assert.ok(res.error, 'must return error message');
});

// ─── F2: design_manager cannot DELETE a permitting-team budget ─────────────
test('F2: design_manager DELETE on permitting-team budget returns 404', async () => {
  const { budget } = await seedProjectBudget({ team: 'permitting' });
  const manager = await createUserWithRole('design_manager');

  const res = await requestJson('DELETE', `/api/budgets/${budget.id}`, {
    token: manager.token,
    expectStatus: 404,
  });
  assert.ok(res.error, 'must return error message');
});

// ─── F3: designer-role (non-manager) GET /by-area returns 403 ────────────
test('F3: designer GET /api/budgets/:id/by-area returns 403 (requireManagerOrAdmin)', async () => {
  const budget = await seedEcBudget();
  const designer = await createUserWithRole('designer');

  // requireManagerOrAdmin rejects non-admin/manager roles with 403
  const res = await requestJson('GET', `/api/budgets/${budget.id}/by-area`, {
    token: designer.token,
    expectStatus: 403,
  });
  // 403 JSON body from the middleware may be { error: '...' } or just status code
  assert.ok(res !== null);
});

// ─── F4: designer GET /api/budgets returns 403 ────────────────────────────
test('F4: designer GET /api/budgets returns 403', async () => {
  const designer = await createUserWithRole('designer');
  await requestJson('GET', '/api/budgets', {
    token: designer.token,
    expectStatus: 403,
  });
});

// ─── F5: designer GET /api/budget-codes returns 403 ──────────────────────
test('F5: designer GET /api/budget-codes returns 403', async () => {
  const designer = await createUserWithRole('designer');
  await requestJson('GET', '/api/budget-codes', {
    token: designer.token,
    expectStatus: 403,
  });
});

// ─── F6: PUT non-existent budget id returns 404 ───────────────────────────
test('F6: PUT /api/budgets/:id with nonexistent UUID returns 404', async () => {
  const token = await adminLogin();
  const fakeId = '00000000-0000-0000-0000-000000000001';
  const res = await requestJson('PUT', `/api/budgets/${fakeId}`, {
    token,
    body: { name: 'ghost', total_amount: 1000 },
    expectStatus: 404,
  });
  assert.equal(res.error, 'Budget not found');
});

// ─── F7: POST with negative total_amount returns 400 ─────────────────────
test('F7: POST /api/budgets with total_amount=-100 returns 400', async () => {
  const token = await adminLogin();
  const client = await fixtures.client();
  trash.clients.push(client.id);
  const ec = await pool.query(
    `INSERT INTO engineering_contracts (client_id, name, contract_number, program)
     VALUES ($1,$2,$3,'rus') RETURNING id`,
    [client.id, `EC-F7-${Date.now()}`, `EC-F7-${Date.now()}`]
  );
  const ecId = ec.rows[0].id;
  trash.engineering_contracts.push(ecId);

  const res = await requestJson('POST', '/api/budgets', {
    token,
    body: { engineering_contract_id: ecId, name: 'Neg Budget', total_amount: -100 },
    expectStatus: 400,
  });
  assert.match(res.error, /non-negative/i, 'error must mention non-negative');
});
