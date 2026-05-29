// tests/time_entries.test.js
//
// Test suite for Wave 170 security fixes in routes/time_entries.js:
//   TE-1 HIGH  — manager team-scope on PUT + DELETE single (IDOR)
//   TE-2 HIGH  — manager team-scope on bulk-delete-by-staff (IDOR)
//   TE-3 MED   — auditTimeEntry called per row in bulk-delete-by-staff
//   TE-4 MED   — auditTimeEntry called per row in bulk POST
//   TE-5 LOW   — documentation comment on user_id vs staff_id edge case
//   TE-6 LOW   — entry_date range guard (POST single + bulk + PUT)

const test = require('node:test');
const assert = require('node:assert/strict');
const bcrypt = require('bcryptjs');
const {
  bootTestServer, close, adminLogin, requestJson,
  fixtures, cleanupAll, pool, baseUrl,
} = require('./_helpers');

// Track created IDs for cleanup
const trash = {
  time_entries: [],
  projects: [],
  jobs: [],
  clients: [],
  staff: [],
  users: [],
  undo_buckets: [],
};

// ─── Helper: create a user with a specific role, optional team, linked staff ──
async function createUserWithRole(role, { team, staffId } = {}) {
  const uname = `te_test_${role}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const hash = await bcrypt.hash('TestPass123!', 10);

  // Build INSERT with optional team + staff_id columns
  let cols = 'username, password_hash, role, full_name, active';
  let vals = '$1, $2, $3, $4, TRUE';
  const params = [uname, hash, role, `Test ${role}`];
  if (team) {
    cols += ', team';
    vals += `, $${params.length + 1}`;
    params.push(team);
  }
  if (staffId) {
    cols += ', staff_id';
    vals += `, $${params.length + 1}`;
    params.push(staffId);
  }

  const { rows } = await pool.query(
    `INSERT INTO users (${cols}) VALUES (${vals}) RETURNING id`,
    params
  );
  const userId = rows[0].id;
  trash.users.push(userId);

  // Log in to get a JWT token
  const res = await fetch(`${baseUrl()}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: uname, password: 'TestPass123!' }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Login failed for ${uname} (${res.status}): ${body}`);
  }
  const json = await res.json();
  return { id: userId, token: json.token };
}

// Helper: get today's date as YYYY-MM-DD
function today() {
  return new Date().toISOString().slice(0, 10);
}

// Helper: date N days ago as YYYY-MM-DD
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

// Helper: date N days in future as YYYY-MM-DD
function daysAhead(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

test.before(async () => {
  await bootTestServer();
  await adminLogin(); // warm up admin token
});

test.after(async () => {
  // Delete time_entries first (FK to projects)
  if (trash.time_entries.length) {
    try {
      await pool.query(`DELETE FROM time_entries WHERE id = ANY($1::uuid[])`, [trash.time_entries]);
    } catch (e) { console.warn('[cleanup] time_entries:', e.message); }
  }
  await cleanupAll({
    projects: trash.projects,
    jobs: trash.jobs,
    clients: trash.clients,
    staff: trash.staff,
    undo_buckets: trash.undo_buckets,
  });
  if (trash.users.length) {
    try {
      await pool.query(`DELETE FROM users WHERE id = ANY($1::uuid[])`, [trash.users]);
    } catch (e) { console.warn('[cleanup] users:', e.message); }
  }
  await close();
});

// ─── TE-1: Manager team-scope on PUT (cross-team → 404) ───────────────────
test('TE-1: design_manager cannot PUT entry on permitting project', async () => {
  // Set up a permitting-team project + entry
  const client = await fixtures.client();
  trash.clients.push(client.id);
  const job = await fixtures.job({ team: 'permitting' });
  trash.jobs.push(job.id);
  const project = await fixtures.project({ client_id: client.id, job_id: job.id });
  trash.projects.push(project.id);
  const staffMember = await fixtures.staff();
  trash.staff.push(staffMember.id);
  const entry = await fixtures.timeEntry({ project_id: project.id, staff_id: staffMember.id, entry_date: daysAgo(1) });
  trash.time_entries.push(entry.id);

  // design_manager tries to edit it
  const manager = await createUserWithRole('design_manager', { team: 'design' });
  const res = await requestJson('PUT', `/api/time-entries/${entry.id}`, {
    token: manager.token,
    body: { notes: 'hack' },
    expectStatus: 404,
  });
  assert.ok(res.error, 'should return error message');
});

// ─── TE-1: Manager team-scope on PUT (same-team → 200) ────────────────────
test('TE-1: design_manager can PUT entry on design project', async () => {
  const client = await fixtures.client();
  trash.clients.push(client.id);
  const job = await fixtures.job({ team: 'design' });
  trash.jobs.push(job.id);
  const project = await fixtures.project({ client_id: client.id, job_id: job.id });
  trash.projects.push(project.id);
  const staffMember = await fixtures.staff();
  trash.staff.push(staffMember.id);
  const entry = await fixtures.timeEntry({ project_id: project.id, staff_id: staffMember.id, entry_date: daysAgo(1) });
  trash.time_entries.push(entry.id);

  const manager = await createUserWithRole('design_manager', { team: 'design' });
  const res = await requestJson('PUT', `/api/time-entries/${entry.id}`, {
    token: manager.token,
    body: { notes: 'updated by manager' },
    expectStatus: 200,
  });
  assert.equal(res.notes, 'updated by manager');
});

// ─── TE-1: Manager team-scope on DELETE single (cross-team → 404) ─────────
test('TE-1: permitting_manager cannot DELETE entry on design project', async () => {
  const client = await fixtures.client();
  trash.clients.push(client.id);
  const job = await fixtures.job({ team: 'design' });
  trash.jobs.push(job.id);
  const project = await fixtures.project({ client_id: client.id, job_id: job.id });
  trash.projects.push(project.id);
  const staffMember = await fixtures.staff();
  trash.staff.push(staffMember.id);
  const entry = await fixtures.timeEntry({ project_id: project.id, staff_id: staffMember.id, entry_date: daysAgo(1) });
  trash.time_entries.push(entry.id);

  const manager = await createUserWithRole('permitting_manager', { team: 'permitting' });
  const res = await requestJson('DELETE', `/api/time-entries/${entry.id}`, {
    token: manager.token,
    expectStatus: 404,
  });
  assert.ok(res.error);

  // Entry should still exist (not deleted)
  const { rows } = await pool.query('SELECT id FROM time_entries WHERE id=$1', [entry.id]);
  assert.equal(rows.length, 1, 'entry should still exist after rejected delete');
});

// ─── TE-1: design_manager CAN delete entry on 'both' team project ─────────
test('TE-1: design_manager can DELETE entry on shared (both) project', async () => {
  const client = await fixtures.client();
  trash.clients.push(client.id);
  const job = await fixtures.job({ team: 'both' });
  trash.jobs.push(job.id);
  const project = await fixtures.project({ client_id: client.id, job_id: job.id });
  trash.projects.push(project.id);
  const staffMember = await fixtures.staff();
  trash.staff.push(staffMember.id);
  const entry = await fixtures.timeEntry({ project_id: project.id, staff_id: staffMember.id, entry_date: daysAgo(1) });
  // Don't push to trash — will be deleted by API call

  const manager = await createUserWithRole('design_manager', { team: 'design' });
  const res = await requestJson('DELETE', `/api/time-entries/${entry.id}`, {
    token: manager.token,
    expectStatus: 200,
  });
  assert.ok(res.ok);
});

// ─── TE-2: Manager team-scope on bulk-delete-by-staff (cross-team → 404) ──
test('TE-2: design_manager cannot bulk-delete entries for permitting staff', async () => {
  // Create a staff member linked to a permitting-team user
  const staffMember = await fixtures.staff();
  trash.staff.push(staffMember.id);

  // Create a user with team=permitting linked to this staff
  const permUser = await createUserWithRole('permitting_engineer', {
    team: 'permitting',
    staffId: staffMember.id,
  });

  // Create a design_manager (different team)
  const designMgr = await createUserWithRole('design_manager', { team: 'design' });

  // design_manager tries to bulk-delete the permitting user's entries
  const res = await requestJson('DELETE', `/api/time-entries/by-staff/${staffMember.id}`, {
    token: designMgr.token,
    expectStatus: 404,
  });
  assert.ok(res.error);
});

// ─── TE-2: Manager can bulk-delete entries for staff on their own team ─────
test('TE-2: design_manager can bulk-delete entries for design staff', async () => {
  const client = await fixtures.client();
  trash.clients.push(client.id);
  const job = await fixtures.job({ team: 'design' });
  trash.jobs.push(job.id);
  const project = await fixtures.project({ client_id: client.id, job_id: job.id });
  trash.projects.push(project.id);

  const staffMember = await fixtures.staff();
  trash.staff.push(staffMember.id);
  const entry = await fixtures.timeEntry({ project_id: project.id, staff_id: staffMember.id, entry_date: daysAgo(1) });
  // Don't push entry to trash — will be deleted by API

  // Link staff to a design-team user
  await createUserWithRole('design_engineer', { team: 'design', staffId: staffMember.id });

  const designMgr = await createUserWithRole('design_manager', { team: 'design' });
  const res = await requestJson('DELETE', `/api/time-entries/by-staff/${staffMember.id}`, {
    token: designMgr.token,
    expectStatus: 200,
  });
  assert.ok(res.ok);
  assert.ok(typeof res.deleted === 'number');
});

// ─── TE-3: audit rows written for each deleted entry in bulk-delete-by-staff
test('TE-3: bulk-delete-by-staff writes audit log for each deleted entry', async () => {
  const client = await fixtures.client();
  trash.clients.push(client.id);
  const job = await fixtures.job({ team: 'design' });
  trash.jobs.push(job.id);
  const project = await fixtures.project({ client_id: client.id, job_id: job.id });
  trash.projects.push(project.id);

  const staffMember = await fixtures.staff();
  trash.staff.push(staffMember.id);

  // Create two entries for this staff member
  const e1 = await fixtures.timeEntry({ project_id: project.id, staff_id: staffMember.id, entry_date: daysAgo(1) });
  const e2 = await fixtures.timeEntry({ project_id: project.id, staff_id: staffMember.id, entry_date: daysAgo(2) });
  const entryIds = [e1.id, e2.id];
  // Don't push to trash — will be deleted by API

  // Link staff to design-team user so manager team-scope passes
  await createUserWithRole('design_engineer', { team: 'design', staffId: staffMember.id });

  // Get the audit log count before the delete
  const { rows: before } = await pool.query(
    `SELECT COUNT(*)::int as cnt FROM audit_log WHERE entity_type='time_entry' AND action='deleted' AND entity_id = ANY($1::uuid[])`,
    [entryIds]
  );
  const countBefore = before[0].cnt;

  const adminToken = await adminLogin();
  await requestJson('DELETE', `/api/time-entries/by-staff/${staffMember.id}`, {
    token: adminToken,
    expectStatus: 200,
  });

  // Audit rows should have been created for each deleted entry
  const { rows: after } = await pool.query(
    `SELECT COUNT(*)::int as cnt FROM audit_log WHERE entity_type='time_entry' AND action='deleted' AND entity_id = ANY($1::uuid[])`,
    [entryIds]
  );
  assert.equal(after[0].cnt - countBefore, 2, 'should have 2 new audit rows (one per deleted entry)');
});

// ─── TE-4: audit rows written for each entry in bulk POST ─────────────────
test('TE-4: bulk POST writes audit log for each inserted entry', async () => {
  const client = await fixtures.client();
  trash.clients.push(client.id);
  const job = await fixtures.job({ team: 'design' });
  trash.jobs.push(job.id);
  const project = await fixtures.project({ client_id: client.id, job_id: job.id });
  trash.projects.push(project.id);

  const staffMember = await fixtures.staff();
  trash.staff.push(staffMember.id);

  const entries = [
    { project_id: project.id, staff_id: staffMember.id, entry_date: daysAgo(1), hours: 4, job_title: 'Engineer' },
    { project_id: project.id, staff_id: staffMember.id, entry_date: daysAgo(2), hours: 8, job_title: 'Engineer' },
  ];

  const { rows: before } = await pool.query(
    `SELECT COUNT(*)::int as cnt FROM audit_log WHERE entity_type='time_entry' AND action='created'`
  );
  const countBefore = before[0].cnt;

  const adminToken = await adminLogin();
  const res = await requestJson('POST', '/api/time-entries/bulk', {
    token: adminToken,
    body: { entries },
    expectStatus: 200,
  });
  assert.equal(res.inserted, 2);

  // Get the inserted IDs from DB via batch
  const { rows: inserted } = await pool.query(
    `SELECT id FROM time_entries WHERE import_batch = $1`,
    [res.batch]
  );
  for (const row of inserted) trash.time_entries.push(row.id);

  const { rows: after } = await pool.query(
    `SELECT COUNT(*)::int as cnt FROM audit_log WHERE entity_type='time_entry' AND action='created'`
  );
  assert.ok(after[0].cnt - countBefore >= 2, 'should have at least 2 new audit rows for bulk insert');
});

// ─── TE-6: future date rejected on POST single ────────────────────────────
test('TE-6: POST single rejects future entry_date', async () => {
  const client = await fixtures.client();
  trash.clients.push(client.id);
  const job = await fixtures.job({ team: 'design' });
  trash.jobs.push(job.id);
  const project = await fixtures.project({ client_id: client.id, job_id: job.id });
  trash.projects.push(project.id);
  const staffMember = await fixtures.staff();
  trash.staff.push(staffMember.id);

  const adminToken = await adminLogin();
  const res = await requestJson('POST', '/api/time-entries', {
    token: adminToken,
    body: { project_id: project.id, staff_id: staffMember.id, entry_date: daysAhead(1), hours: 8 },
    expectStatus: 400,
  });
  assert.match(res.error, /future/i);
});

// ─── TE-6: past-365-days date rejected on POST single ─────────────────────
test('TE-6: POST single rejects entry_date older than 365 days', async () => {
  const client = await fixtures.client();
  trash.clients.push(client.id);
  const job = await fixtures.job({ team: 'design' });
  trash.jobs.push(job.id);
  const project = await fixtures.project({ client_id: client.id, job_id: job.id });
  trash.projects.push(project.id);
  const staffMember = await fixtures.staff();
  trash.staff.push(staffMember.id);

  const adminToken = await adminLogin();
  const res = await requestJson('POST', '/api/time-entries', {
    token: adminToken,
    body: { project_id: project.id, staff_id: staffMember.id, entry_date: daysAgo(400), hours: 8 },
    expectStatus: 400,
  });
  assert.match(res.error, /365 days/i);
});

// ─── TE-6: valid today date accepted on POST single ───────────────────────
test('TE-6: POST single accepts entry_date of today', async () => {
  const client = await fixtures.client();
  trash.clients.push(client.id);
  const job = await fixtures.job({ team: 'design' });
  trash.jobs.push(job.id);
  const project = await fixtures.project({ client_id: client.id, job_id: job.id });
  trash.projects.push(project.id);
  const staffMember = await fixtures.staff();
  trash.staff.push(staffMember.id);

  const adminToken = await adminLogin();
  const res = await requestJson('POST', '/api/time-entries', {
    token: adminToken,
    body: { project_id: project.id, staff_id: staffMember.id, entry_date: today(), hours: 4 },
    expectStatus: 200,
  });
  assert.ok(res.id, 'should return inserted entry with id');
  trash.time_entries.push(res.id);
});

// ─── TE-6: future date rejected on bulk POST ──────────────────────────────
test('TE-6: bulk POST rejects batch with future entry_date', async () => {
  const client = await fixtures.client();
  trash.clients.push(client.id);
  const job = await fixtures.job({ team: 'design' });
  trash.jobs.push(job.id);
  const project = await fixtures.project({ client_id: client.id, job_id: job.id });
  trash.projects.push(project.id);
  const staffMember = await fixtures.staff();
  trash.staff.push(staffMember.id);

  const adminToken = await adminLogin();
  const res = await requestJson('POST', '/api/time-entries/bulk', {
    token: adminToken,
    body: {
      entries: [
        { project_id: project.id, staff_id: staffMember.id, entry_date: today(), hours: 4, job_title: 'Eng' },
        { project_id: project.id, staff_id: staffMember.id, entry_date: daysAhead(1), hours: 4, job_title: 'Eng' },
      ],
    },
    expectStatus: 400,
  });
  assert.match(res.error, /future/i);
});

// ─── TE-6: future date rejected on PUT ────────────────────────────────────
test('TE-6: PUT rejects future entry_date', async () => {
  const client = await fixtures.client();
  trash.clients.push(client.id);
  const job = await fixtures.job({ team: 'design' });
  trash.jobs.push(job.id);
  const project = await fixtures.project({ client_id: client.id, job_id: job.id });
  trash.projects.push(project.id);
  const staffMember = await fixtures.staff();
  trash.staff.push(staffMember.id);
  const entry = await fixtures.timeEntry({ project_id: project.id, staff_id: staffMember.id, entry_date: daysAgo(1) });
  trash.time_entries.push(entry.id);

  const adminToken = await adminLogin();
  const res = await requestJson('PUT', `/api/time-entries/${entry.id}`, {
    token: adminToken,
    body: { entry_date: daysAhead(1) },
    expectStatus: 400,
  });
  assert.match(res.error, /future/i);
});
