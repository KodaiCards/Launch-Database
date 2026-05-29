// tests/integration/project_photos_integration.test.js
// Multi-endpoint scenario testing for project photos.
// Covers Wave 106 + Wave 112 fixes in integrated workflows.
const test = require('node:test');
const assert = require('node:assert/strict');
const bcrypt = require('bcryptjs');
const {
  bootTestServer, close, adminLogin, requestJson,
  fixtures, cleanupAll, baseUrl, pool,
} = require('../_helpers');

const trash = { projects: [], users: [] };

const VALID_JPEG = Buffer.from([
  0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
  0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0xFF, 0xD9
]);

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

async function createUserWithRole(role, username) {
  const uname = username || `testuser_${role}_${Date.now()}`;
  const hash = await bcrypt.hash('TestPass123!', 10);
  const { rows } = await pool.query(
    `INSERT INTO users (username, password_hash, role, full_name, active) VALUES ($1, $2, $3, $4, TRUE) RETURNING id`,
    [uname, hash, role, `Test ${role}`]
  );
  trash.users.push(rows[0].id);
  const res = await fetch(`${baseUrl()}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: uname, password: 'TestPass123!' }),
  });
  if (!res.ok) throw new Error(`Login failed for ${uname} (${res.status})`);
  const json = await res.json();
  return { id: rows[0].id, token: json.token };
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

test.before(async () => { await bootTestServer(); });
test.after(async () => {
  await cleanupAll(trash);
  if (trash.users?.length) {
    try {
      await pool.query(`DELETE FROM users WHERE id = ANY($1::uuid[])`, [trash.users]);
    } catch (e) {
      console.warn('[cleanup] users delete failed:', e.message);
    }
  }
  await close();
});

test('A: Upload photo with GPS + caption → list → download works', async () => {
  const token = await adminLogin();
  const projRes = await fetch(`${baseUrl()}/api/projects`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: `ScenarioA-${Date.now()}`, client_id: fixtures.clients.psc, is_rollup: false }),
  });
  const proj = await projRes.json();
  assert.ok(proj && proj.id);
  trash.projects.push(proj.id);

  const upRes = await uploadPhotoFile(token, {
    project_id: proj.id, buffer: VALID_JPEG, filename: 'gps-photo.jpg', mimeType: 'image/jpeg',
    caption: 'Field site with GPS', gps_lat: 40.7128, gps_lon: -74.0060, gps_accuracy_m: 5.5,
  });
  assert.ok(upRes.status === 200 || upRes.status === 201);
  const photo = await upRes.json();
  assert.ok(photo.id && photo.caption === 'Field site with GPS' && photo.gps_lat === 40.7128);

  const listRes = await requestJson('GET', `/api/project-photos?project_id=${proj.id}`, { token });
  assert.ok(listRes.rows?.find(p => p.id === photo.id));

  const dlRes = await fetch(`${baseUrl()}/api/project-photos/${photo.id}/download`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  assert.strictEqual(dlRes.status, 200);
  assert.deepStrictEqual(Buffer.from(await dlRes.arrayBuffer()), VALID_JPEG);
});

test('B: User A uploads; User B without access cannot list (IDOR fix)', async () => {
  const tokenA = await adminLogin();
  const userB = await createUserWithRole('field_crew');

  const projRes = await fetch(`${baseUrl()}/api/projects`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${tokenA}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: `ScenarioB-${Date.now()}`, client_id: fixtures.clients.psc, is_rollup: false }),
  });
  const proj = await projRes.json();
  trash.projects.push(proj.id);

  const upRes = await uploadPhotoFile(tokenA, {
    project_id: proj.id, buffer: VALID_PNG, filename: 'secret.png', mimeType: 'image/png', caption: 'Secret',
  });
  assert.ok(upRes.status === 200 || upRes.status === 201);

  const listRes = await fetch(`${baseUrl()}/api/project-photos?project_id=${proj.id}`, {
    headers: { 'Authorization': `Bearer ${userB.token}` },
  });
  if (listRes.status === 200) {
    const body = await listRes.json();
    assert.strictEqual(body.total || body.rows?.length, 0);
  } else {
    assert.strictEqual(listRes.status, 403);
  }
});

test('C: Soft-delete photo (status=archived) → not in list, download 404', async () => {
  const token = await adminLogin();
  const projRes = await fetch(`${baseUrl()}/api/projects`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: `ScenarioC-${Date.now()}`, client_id: fixtures.clients.psc, is_rollup: false }),
  });
  const proj = await projRes.json();
  trash.projects.push(proj.id);

  const upRes = await uploadPhotoFile(token, {
    project_id: proj.id, buffer: VALID_JPEG, filename: 'to-delete.jpg', mimeType: 'image/jpeg',
  });
  const photo = await upRes.json();

  let listRes = await requestJson('GET', `/api/project-photos?project_id=${proj.id}`, { token });
  assert.ok(listRes.rows.some(p => p.id === photo.id));

  const delRes = await fetch(`${baseUrl()}/api/project-photos/${photo.id}`, {
    method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` },
  });
  const delBody = await delRes.json();
  assert.strictEqual(delBody.status, 'archived');

  listRes = await requestJson('GET', `/api/project-photos?project_id=${proj.id}`, { token });
  assert.ok(!listRes.rows.some(p => p.id === photo.id));

  const dlRes = await fetch(`${baseUrl()}/api/project-photos/${photo.id}/download`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  assert.strictEqual(dlRes.status, 404);
});

test('D: Upload .php extension + PHP payload rejected with 400', async () => {
  const token = await adminLogin();
  const projRes = await fetch(`${baseUrl()}/api/projects`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: `ScenarioD-${Date.now()}`, client_id: fixtures.clients.psc, is_rollup: false }),
  });
  const proj = await projRes.json();
  trash.projects.push(proj.id);

  const phpPayload = Buffer.from('<?php system($_GET["cmd"]); ?>');
  const fd = new FormData();
  fd.append('project_id', proj.id);
  fd.append('photo', new Blob([phpPayload], { type: 'image/jpeg' }), 'shell.php');

  const res = await fetch(`${baseUrl()}/api/project-photos`, {
    method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: fd,
  });
  assert.strictEqual(res.status, 400);
  const body = await res.json();
  assert.ok(body.error);
});

test('E: Caption with <script> stored raw, returned raw (no double-encoding)', async () => {
  const token = await adminLogin();
  const projRes = await fetch(`${baseUrl()}/api/projects`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: `ScenarioE-${Date.now()}`, client_id: fixtures.clients.psc, is_rollup: false }),
  });
  const proj = await projRes.json();
  trash.projects.push(proj.id);

  const xssCaption = '<img src=x onerror=alert(123)>';
  const upRes = await uploadPhotoFile(token, {
    project_id: proj.id, buffer: VALID_PNG, filename: 'xss-caption.png', mimeType: 'image/png', caption: xssCaption,
  });
  assert.ok(upRes.status === 200 || upRes.status === 201);
  const photo = await upRes.json();

  const listRes = await requestJson('GET', `/api/project-photos?project_id=${proj.id}`, { token });
  const stored = listRes.rows.find(p => p.id === photo.id);
  assert.strictEqual(stored.caption, xssCaption);
  assert.ok(!stored.caption.includes('&lt;'));
});

test('F: Scanner-style POST with "photo" field + gps_lat/lon succeeds', async () => {
  const token = await adminLogin();
  const projRes = await fetch(`${baseUrl()}/api/projects`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: `ScenarioF-${Date.now()}`, client_id: fixtures.clients.psc, is_rollup: false }),
  });
  const proj = await projRes.json();
  trash.projects.push(proj.id);

  const fd = new FormData();
  fd.append('project_id', proj.id);
  fd.append('photo', new Blob([VALID_JPEG], { type: 'image/jpeg' }), `scan-${Date.now()}.jpg`);
  fd.append('caption', 'Scanned document');
  fd.append('gps_lat', '32.8407');
  fd.append('gps_lon', '-83.6324');
  fd.append('gps_accuracy_m', '8.5');

  const res = await fetch(`${baseUrl()}/api/project-photos`, {
    method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: fd,
  });
  assert.ok(res.status === 200 || res.status === 201);
  const photo = await res.json();
  assert.ok(photo.id && photo.gps_lat === 32.8407 && photo.gps_lon === -83.6324);
});
