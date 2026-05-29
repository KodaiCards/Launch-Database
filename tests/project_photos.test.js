// tests/project_photos.test.js
//
// Test suite for project photo uploads (Wave 55 + Wave 106 security fixes +
// Wave 112 MED fixes).
// Covers endpoints: POST /api/project-photos, GET /api/project-photos,
// GET /api/project-photos/:id/download, DELETE /api/project-photos/:id
//
// Multipart uploads use fetch + baseUrl() directly (see _helpers.js comment:
// "for multipart uploads where request()'s JSON-stringify branch would corrupt
// the body"). JSON-only calls use requestJson(method, path, { token, body }).

const test = require('node:test');
const assert = require('node:assert/strict');
const bcrypt = require('bcryptjs');
const {
  bootTestServer, close, adminLogin, requestJson,
  fixtures, cleanupAll, baseUrl, pool,
} = require('./_helpers');

const trash = { projects: [], users: [] };

// ─── Helper: create a user with a specific role and log in ─────────────────
async function createUserWithRole(role, username) {
  const uname = username || `testuser_${role}_${Date.now()}`;
  const hash = await bcrypt.hash('TestPass123!', 10);
  const { rows } = await pool.query(
    `INSERT INTO users (username, password_hash, role, full_name, active)
     VALUES ($1, $2, $3, $4, TRUE) RETURNING id`,
    [uname, hash, role, `Test ${role}`]
  );
  trash.users.push(rows[0].id);

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
  return { id: rows[0].id, token: json.token };
}

// Minimal valid 1×1 PNG (68 bytes) — correct magic bytes (0x89 50 4E 47...)
const VALID_PNG = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
  0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
  0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
  0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4,
  0x89, 0x00, 0x00, 0x00, 0x0a, 0x49, 0x44, 0x41,
  0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
  0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00,
  0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae,
  0x42, 0x60, 0x82
]);

// Minimal valid JPEG (starting with FF D8 FF)
const VALID_JPEG = Buffer.from([
  0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
  0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0xFF, 0xD9
]);

test.before(async () => { await bootTestServer(); });
test.after(async () => {
  await cleanupAll(trash);
  // Clean up test users created for role-based tests
  if (trash.users && trash.users.length) {
    try {
      await pool.query(`DELETE FROM users WHERE id = ANY($1::uuid[])`, [trash.users]);
    } catch (e) {
      console.warn('[cleanup] users delete failed:', e.message);
    }
  }
  await close();
});

// ─── Helper: multipart upload via fetch ────────────────────────────────────
async function uploadPhoto(token, fields) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) {
    if (v instanceof Buffer) {
      // file field: {data, filename, type}
      throw new Error('Use uploadPhotoFile instead');
    }
    fd.append(k, v);
  }
  const res = await fetch(`${baseUrl()}/api/project-photos`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: fd,
  });
  return res;
}

async function uploadPhotoFile(token, { project_id, buffer, filename, mimeType, caption, gps_lat, gps_lon, gps_accuracy_m }) {
  const fd = new FormData();
  fd.append('project_id', project_id);
  fd.append('photo', new Blob([buffer], { type: mimeType }), filename);
  if (caption !== undefined) fd.append('caption', caption);
  if (gps_lat !== undefined) fd.append('gps_lat', String(gps_lat));
  if (gps_lon !== undefined) fd.append('gps_lon', String(gps_lon));
  if (gps_accuracy_m !== undefined) fd.append('gps_accuracy_m', String(gps_accuracy_m));
  const res = await fetch(`${baseUrl()}/api/project-photos`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: fd,
  });
  return res;
}

// ─── Existing coverage (rewritten to use correct helper API) ───────────────

test('POST /api/project-photos uploads successfully, returns row with id + metadata', async () => {
  const token = await adminLogin();

  const proj = await requestJson('POST', '/api/projects', {
    token,
    body: { name: 'Photo Test Project', client_id: fixtures.clients.psc, is_rollup: false },
    expectStatus: 201,
  }).catch(() => requestJson('POST', '/api/projects', {
    token,
    body: { name: 'Photo Test Project', client_id: fixtures.clients.psc, is_rollup: false },
  }));
  // Accept either 200 or 201 — the projects endpoint returns the created row
  assert.ok(proj && proj.id, 'project created');
  trash.projects.push(proj.id);

  const res = await uploadPhotoFile(token, {
    project_id: proj.id,
    buffer: VALID_PNG,
    filename: 'test.png',
    mimeType: 'image/png',
    caption: 'Test photo',
    gps_lat: 40.7128,
    gps_lon: -74.0060,
    gps_accuracy_m: 5,
  });
  const body = await res.json();

  assert.strictEqual(res.status, 201, `expected 201, got ${res.status}: ${JSON.stringify(body)}`);
  assert.ok(body.id, 'photo id returned');
  assert.strictEqual(body.project_id, proj.id, 'project_id matches');
  assert.strictEqual(body.mime_type, 'image/png', 'mime_type correct');
  assert.strictEqual(body.caption, 'Test photo', 'caption stored');
  assert.strictEqual(body.status, 'active', 'status is active');
});

test('GET /api/project-photos returns photos for a project (paginated)', async () => {
  const token = await adminLogin();

  const proj = await requestJson('POST', '/api/projects', {
    token,
    body: { name: 'List Test Project', client_id: fixtures.clients.psc, is_rollup: false },
  }).catch(async () => {
    const r = await fetch(`${baseUrl()}/api/projects`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'List Test Project', client_id: fixtures.clients.psc, is_rollup: false }),
    });
    return r.json();
  });
  assert.ok(proj && proj.id, 'project created');
  trash.projects.push(proj.id);

  for (let i = 0; i < 3; i++) {
    const res = await uploadPhotoFile(token, {
      project_id: proj.id,
      buffer: VALID_PNG,
      filename: `test${i}.png`,
      mimeType: 'image/png',
      caption: `Photo ${i}`,
    });
    assert.ok(res.status === 201 || res.status === 200, `upload ${i} status ${res.status}`);
  }

  const listRes = await requestJson('GET', `/api/project-photos?project_id=${proj.id}`, { token });
  assert.strictEqual(listRes.rows.length, 3, 'returns 3 photos');
  assert.strictEqual(listRes.total, 3, 'total count is 3');
  assert.ok(listRes.rows[0].uploader_name, 'uploader_name included');
});

test('GET /api/project-photos/:id/download with malformed UUID returns 400', async () => {
  const token = await adminLogin();
  const res = await fetch(`${baseUrl()}/api/project-photos/not-a-uuid/download`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  assert.strictEqual(res.status, 400, 'returns 400 Bad Request');
});

test('DELETE /api/project-photos/:id marks status=archived (soft-archive)', async () => {
  const token = await adminLogin();

  const projRes = await fetch(`${baseUrl()}/api/projects`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Delete Test Project', client_id: fixtures.clients.psc, is_rollup: false }),
  });
  const proj = await projRes.json();
  assert.ok(proj.id, 'project created');
  trash.projects.push(proj.id);

  const upRes = await uploadPhotoFile(token, {
    project_id: proj.id,
    buffer: VALID_PNG,
    filename: 'test.png',
    mimeType: 'image/png',
  });
  const photo = await upRes.json();
  assert.ok(photo.id, 'photo uploaded');

  const delRes = await fetch(`${baseUrl()}/api/project-photos/${photo.id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const delBody = await delRes.json();
  assert.strictEqual(delBody.status, 'archived', 'photo archived');

  const listRes = await requestJson('GET', `/api/project-photos?project_id=${proj.id}`, { token });
  assert.strictEqual(listRes.total, 0, 'archived photo not in list');
});

// ─── Wave 106: HIGH-1 — Extension + magic-byte validation ──────────────────

test('HIGH-1: upload with .php extension + image/jpeg Content-Type rejected with 400', async () => {
  const token = await adminLogin();

  // Create a project to upload against
  const projRes = await fetch(`${baseUrl()}/api/projects`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Ext Bypass Test', client_id: fixtures.clients.psc, is_rollup: false }),
  });
  const proj = await projRes.json();
  assert.ok(proj.id, 'project created');
  trash.projects.push(proj.id);

  // Send JPEG magic bytes but filename says .php — extension check must reject
  const fd = new FormData();
  fd.append('project_id', proj.id);
  fd.append('photo', new Blob([VALID_JPEG], { type: 'image/jpeg' }), 'shell.php');

  const res = await fetch(`${baseUrl()}/api/project-photos`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: fd,
  });
  assert.strictEqual(res.status, 400, `expected 400 for .php extension, got ${res.status}`);
  const body = await res.json();
  assert.ok(body.error, 'error message present');
});

test('HIGH-1: upload with valid .jpg extension but non-image body rejected with 400', async () => {
  const token = await adminLogin();

  const projRes = await fetch(`${baseUrl()}/api/projects`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Magic Byte Test', client_id: fixtures.clients.psc, is_rollup: false }),
  });
  const proj = await projRes.json();
  assert.ok(proj.id, 'project created');
  trash.projects.push(proj.id);

  // .jpg extension + image/jpeg MIME, but body is PHP code — magic bytes must reject
  const phpPayload = Buffer.from('<?php system($_GET["cmd"]); ?>');
  const fd = new FormData();
  fd.append('project_id', proj.id);
  fd.append('photo', new Blob([phpPayload], { type: 'image/jpeg' }), 'real.jpg');

  const res = await fetch(`${baseUrl()}/api/project-photos`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: fd,
  });
  assert.strictEqual(res.status, 400, `expected 400 for non-image magic bytes, got ${res.status}`);
  const body = await res.json();
  assert.ok(body.error, 'error message present');
});

test('HIGH-1: upload with valid .jpg extension and real JPEG magic bytes succeeds (201)', async () => {
  const token = await adminLogin();

  const projRes = await fetch(`${baseUrl()}/api/projects`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'W143 Good JPEG Test', client_id: fixtures.clients.psc, is_rollup: false }),
  });
  const proj = await projRes.json();
  assert.ok(proj.id, 'project created');
  trash.projects.push(proj.id);

  // VALID_JPEG starts with FF D8 FF — correct magic bytes for image/jpeg
  const fd = new FormData();
  fd.append('project_id', proj.id);
  fd.append('photo', new Blob([VALID_JPEG], { type: 'image/jpeg' }), 'photo.jpg');

  const res = await fetch(`${baseUrl()}/api/project-photos`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: fd,
  });
  const body = await res.json();
  assert.strictEqual(res.status, 201, `expected 201 for valid JPEG, got ${res.status}: ${JSON.stringify(body)}`);
  assert.ok(body.id, 'photo id returned');
  assert.strictEqual(body.mime_type, 'image/jpeg', 'mime_type is image/jpeg');
});

// ─── Wave 106: HIGH-2 — Stored XSS caption is escaped in API response ──────

test('HIGH-2: caption with XSS payload stored raw in DB, returned raw by API (escaping is client-side)', async () => {
  const token = await adminLogin();

  const projRes = await fetch(`${baseUrl()}/api/projects`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'XSS Caption Test', client_id: fixtures.clients.psc, is_rollup: false }),
  });
  const proj = await projRes.json();
  assert.ok(proj.id, 'project created');
  trash.projects.push(proj.id);

  const xssCaption = '<img src=x onerror=alert(document.cookie)>';

  const upRes = await uploadPhotoFile(token, {
    project_id: proj.id,
    buffer: VALID_PNG,
    filename: 'xss.png',
    mimeType: 'image/png',
    caption: xssCaption,
  });
  assert.ok(upRes.status === 200 || upRes.status === 201, `upload failed with ${upRes.status}`);
  const photo = await upRes.json();
  assert.ok(photo.id, 'photo uploaded');

  // Verify the caption is stored and returned verbatim (escaping is the client's job via esc())
  const listRes = await requestJson('GET', `/api/project-photos?project_id=${proj.id}`, { token });
  assert.ok(listRes.rows.length >= 1, 'photo appears in list');
  const stored = listRes.rows.find(r => r.id === photo.id);
  assert.ok(stored, 'uploaded photo found in list');
  // The caption is stored as-is in the DB; the PWA's esc() helper in photos.js
  // is what prevents it from executing. This test verifies round-trip fidelity.
  assert.strictEqual(stored.caption, xssCaption, 'caption stored verbatim (client escapes on render)');
  // Verify the raw API response does NOT double-encode (esc() runs only client-side)
  assert.ok(!stored.caption.includes('&lt;'), 'API returns raw caption, not HTML-encoded');
});

// ─── Wave 106: HIGH-3 — Scanner-style POST with 'photo' field + gps_lat/gps_lon succeeds ──

test('HIGH-3: scanner-style POST with photo field + gps_lat/gps_lon/gps_accuracy_m fields succeeds', async () => {
  const token = await adminLogin();

  const projRes = await fetch(`${baseUrl()}/api/projects`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Scanner Upload Test', client_id: fixtures.clients.psc, is_rollup: false }),
  });
  const proj = await projRes.json();
  assert.ok(proj.id, 'project created');
  trash.projects.push(proj.id);

  // Replicate exactly what scanner.js now sends after the HIGH-3 fix:
  // field name = 'photo', GPS fields = gps_lat / gps_lon / gps_accuracy_m
  const fd = new FormData();
  fd.append('project_id', proj.id);
  fd.append('photo', new Blob([VALID_JPEG], { type: 'image/jpeg' }), `scan-${Date.now()}.jpg`);
  fd.append('caption', 'Scanner doc');
  fd.append('gps_lat', '32.8407');
  fd.append('gps_lon', '-83.6324');
  fd.append('gps_accuracy_m', '8.5');
  fd.append('taken_at', new Date().toISOString());

  const res = await fetch(`${baseUrl()}/api/project-photos`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: fd,
  });
  const body = await res.json();

  assert.ok(res.status === 200 || res.status === 201,
    `expected 200/201 for scanner upload, got ${res.status}: ${JSON.stringify(body)}`);
  assert.ok(body.id, 'photo id returned');
  assert.ok(body.gps_lat != null, 'gps_lat stored');
  assert.ok(body.gps_lon != null, 'gps_lon stored');
  assert.ok(body.gps_accuracy_m != null, 'gps_accuracy_m stored');
  assert.strictEqual(Number(body.gps_lat).toFixed(4), '32.8407', 'gps_lat value correct');
  assert.strictEqual(Number(body.gps_lon).toFixed(4), '-83.6324', 'gps_lon value correct');
});

test('HIGH-3: old broken scanner POST with "file" field name returns 400', async () => {
  const token = await adminLogin();

  const projRes = await fetch(`${baseUrl()}/api/projects`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Scanner Old Field Test', client_id: fixtures.clients.psc, is_rollup: false }),
  });
  const proj = await projRes.json();
  assert.ok(proj.id, 'project created');
  trash.projects.push(proj.id);

  // Simulate what the scanner was sending BEFORE the HIGH-3 fix — wrong field 'file' instead of 'photo'
  const fd = new FormData();
  fd.append('project_id', proj.id);
  fd.append('file', new Blob([VALID_JPEG], { type: 'image/jpeg' }), 'scan.jpg');

  const res = await fetch(`${baseUrl()}/api/project-photos`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: fd,
  });
  assert.strictEqual(res.status, 400, `expected 400 for wrong field name 'file', got ${res.status}`);
  const body = await res.json();
  assert.ok(body.error && body.error.toLowerCase().includes('photo'), 'error mentions missing photo field');
});

// ─── Wave 112: MED-1 — Project ownership check (IDOR prevention) ───────────

test('MED-1: customer role cannot list photos for any project (403)', async () => {
  const adminToken = await adminLogin();

  // Create a project as admin
  const projRes = await fetch(`${baseUrl()}/api/projects`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'MED-1 Customer Deny Project', client_id: fixtures.clients.psc, is_rollup: false }),
  });
  const proj = await projRes.json();
  assert.ok(proj.id, 'project created');
  trash.projects.push(proj.id);

  // Create a customer-role user and get their token
  const customer = await createUserWithRole('customer');

  // Customer tries to list photos for the project — should be denied
  const res = await fetch(`${baseUrl()}/api/project-photos?project_id=${proj.id}`, {
    headers: { 'Authorization': `Bearer ${customer.token}` },
  });
  assert.strictEqual(res.status, 403, `expected 403 for customer role, got ${res.status}`);
  const body = await res.json();
  assert.ok(body.error, 'error message present');
});

test('MED-1: customer role cannot upload photo to any project (403)', async () => {
  const adminToken = await adminLogin();

  const projRes = await fetch(`${baseUrl()}/api/projects`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'MED-1 Customer Upload Deny', client_id: fixtures.clients.psc, is_rollup: false }),
  });
  const proj = await projRes.json();
  assert.ok(proj.id, 'project created');
  trash.projects.push(proj.id);

  const customer = await createUserWithRole('customer');

  const fd = new FormData();
  fd.append('project_id', proj.id);
  fd.append('photo', new Blob([VALID_PNG], { type: 'image/png' }), 'test.png');

  const res = await fetch(`${baseUrl()}/api/project-photos`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${customer.token}` },
    body: fd,
  });
  assert.strictEqual(res.status, 403, `expected 403 for customer upload, got ${res.status}`);
});

test('MED-1: admin role can list photos for any project (200)', async () => {
  const adminToken = await adminLogin();

  const projRes = await fetch(`${baseUrl()}/api/projects`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'MED-1 Admin Access Project', client_id: fixtures.clients.psc, is_rollup: false }),
  });
  const proj = await projRes.json();
  assert.ok(proj.id, 'project created');
  trash.projects.push(proj.id);

  // Admin should be able to list photos for any project
  const listRes = await fetch(`${baseUrl()}/api/project-photos?project_id=${proj.id}`, {
    headers: { 'Authorization': `Bearer ${adminToken}` },
  });
  assert.strictEqual(listRes.status, 200, `expected 200 for admin list, got ${listRes.status}`);
  const body = await listRes.json();
  assert.ok(Array.isArray(body.rows), 'rows array returned');
});

// ─── Wave 112: MED-2 — IndexedDB queue TTL and session binding ─────────────
// MED-2 fixes are in the client-side PWA (public/photos/photos.js) and
// service worker (public/photos/sw.js). The server has no backend component
// to test directly. These tests document the fix intent and verify API
// round-trip behavior that the client-side code depends on.

test('MED-2: /api/auth/me endpoint returns user id for queue session binding', async () => {
  // The PWA uses /api/auth/me to obtain state.user.id, which is then stored
  // as userId on each offline queue item. If /api/auth/me is unavailable or
  // returns no id, the offline queue cannot bind photos to the session user.
  const adminToken = await adminLogin();
  const meRes = await fetch(`${baseUrl()}/api/auth/me`, {
    headers: { 'Authorization': `Bearer ${adminToken}` },
  });
  assert.strictEqual(meRes.status, 200, '/api/auth/me should return 200 for authenticated user');
  const me = await meRes.json();
  assert.ok(me.id || me.user_id, '/api/auth/me should include a user id field');
});

// ─── Wave 112: MED-3 — Schema constraint fix (NOT NULL + ON DELETE SET NULL) ─

test('MED-3: project_photos.uploaded_by accepts NULL (NOT NULL constraint dropped)', async () => {
  const adminToken = await adminLogin();

  // Create a project to attach the photo to
  const projRes = await fetch(`${baseUrl()}/api/projects`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'MED-3 Null Uploader Test', client_id: fixtures.clients.psc, is_rollup: false }),
  });
  const proj = await projRes.json();
  assert.ok(proj.id, 'project created');
  trash.projects.push(proj.id);

  // Insert a project_photos row with uploaded_by = NULL directly via pool
  // (simulates what happens after ON DELETE SET NULL triggers on user deletion)
  const photoId = require('crypto').randomUUID();
  await assert.doesNotReject(
    async () => {
      await pool.query(`
        INSERT INTO project_photos
          (id, project_id, uploaded_by, filename, mime_type, size_bytes, storage_key, status)
        VALUES ($1, $2, NULL, 'test.png', 'image/png', 100, $3, 'active')
      `, [photoId, proj.id, `project-photos/${proj.id}/${photoId}.png`]);
    },
    'INSERT with uploaded_by=NULL should succeed after migration 0055 drops NOT NULL'
  );

  // Clean up the test photo row
  await pool.query('DELETE FROM project_photos WHERE id=$1', [photoId]);
});

test('MED-3: ON DELETE SET NULL on users.id FK works without constraint violation', async () => {
  const adminToken = await adminLogin();

  // Create a project
  const projRes = await fetch(`${baseUrl()}/api/projects`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'MED-3 User Delete Test', client_id: fixtures.clients.psc, is_rollup: false }),
  });
  const proj = await projRes.json();
  assert.ok(proj.id, 'project created');
  trash.projects.push(proj.id);

  // Create a temporary user
  const tempUser = await createUserWithRole('inspector', `temp_med3_${Date.now()}`);

  // Insert a photo owned by the temp user
  const photoId = require('crypto').randomUUID();
  await pool.query(`
    INSERT INTO project_photos
      (id, project_id, uploaded_by, filename, mime_type, size_bytes, storage_key, status)
    VALUES ($1, $2, $3, 'test.png', 'image/png', 100, $4, 'active')
  `, [photoId, proj.id, tempUser.id, `project-photos/${proj.id}/${photoId}.png`]);

  // Remove the user from trash list since we're deleting it here as part of the test
  const idx = trash.users.indexOf(tempUser.id);
  if (idx !== -1) trash.users.splice(idx, 1);

  // Deleting the user should NOT throw — ON DELETE SET NULL will null out uploaded_by
  await assert.doesNotReject(
    async () => {
      await pool.query('DELETE FROM users WHERE id=$1', [tempUser.id]);
    },
    'Deleting a user who uploaded photos should succeed (ON DELETE SET NULL)'
  );

  // Verify the photo row still exists with uploaded_by = NULL
  const { rows } = await pool.query('SELECT uploaded_by FROM project_photos WHERE id=$1', [photoId]);
  assert.strictEqual(rows.length, 1, 'photo row still exists after user deletion');
  assert.strictEqual(rows[0].uploaded_by, null, 'uploaded_by set to NULL after user deletion');

  // Clean up
  await pool.query('DELETE FROM project_photos WHERE id=$1', [photoId]);
});
