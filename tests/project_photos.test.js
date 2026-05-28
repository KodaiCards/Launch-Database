// tests/project_photos.test.js
//
// Test suite for project photo uploads (Wave 55).
// Covers endpoints: POST /api/project-photos, GET /api/project-photos,
// GET /api/project-photos/:id/download, DELETE /api/project-photos/:id

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  bootTestServer, close, adminLogin, userLogin, requestJson,
  fixtures, cleanupAll, pool,
} = require('./_helpers');
const fs = require('fs');
const path = require('path');

const trash = { staff: [], projects: [] };

test.before(async () => { await bootTestServer(); });
test.after(async () => {
  await cleanupAll(trash);
  await close();
});

test('POST /api/project-photos uploads successfully, returns row with id + metadata', async () => {
  const admin = await adminLogin();

  // Create a test project
  const projRes = await requestJson(admin, 'POST', '/api/projects', {
    method: 'POST',
    body: {
      name: 'Photo Test Project',
      client_id: fixtures.clients.psc,
      is_rollup: false
    }
  });
  assert.ok(projRes.id, 'project created');
  trash.projects.push(projRes.id);

  // Create a minimal PNG (1×1 transparent, 68 bytes)
  const pngBuf = Buffer.from([
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

  // Upload photo via multipart
  const uploadRes = await requestJson(admin, 'POST', '/api/project-photos', {
    method: 'POST',
    multipart: {
      photo: { filename: 'test.png', data: pngBuf, type: 'image/png' },
      project_id: projRes.id,
      caption: 'Test photo',
      taken_at: new Date('2026-05-28T12:00:00Z').toISOString(),
      gps_lat: '40.7128',
      gps_lon: '-74.0060',
      gps_accuracy_m: '5'
    }
  });

  assert.ok(uploadRes.id, 'photo id returned');
  assert.strictEqual(uploadRes.project_id, projRes.id, 'project_id matches');
  assert.strictEqual(uploadRes.mime_type, 'image/png', 'mime_type correct');
  assert.strictEqual(uploadRes.caption, 'Test photo', 'caption stored');
  assert.strictEqual(uploadRes.gps_lat, 40.7128, 'gps_lat parsed');
  assert.strictEqual(uploadRes.gps_lon, -74.0060, 'gps_lon parsed');
  assert.strictEqual(uploadRes.gps_accuracy_m, 5, 'gps_accuracy_m parsed');
  assert.strictEqual(uploadRes.status, 'active', 'status is active');
});

test('POST /api/project-photos rejects 21MB photo with 413', async () => {
  const admin = await adminLogin();

  const projRes = await requestJson(admin, 'POST', '/api/projects', {
    method: 'POST',
    body: { name: 'Large Photo Test', client_id: fixtures.clients.psc, is_rollup: false }
  });
  trash.projects.push(projRes.id);

  // Create a 21MB buffer (exceeds 20MB limit)
  const largeBuffer = Buffer.alloc(21 * 1024 * 1024);

  try {
    await requestJson(admin, 'POST', '/api/project-photos', {
      method: 'POST',
      multipart: {
        photo: { filename: 'large.jpg', data: largeBuffer, type: 'image/jpeg' },
        project_id: projRes.id
      }
    });
    assert.fail('should reject 21MB photo');
  } catch (e) {
    assert.strictEqual(e.statusCode, 413, 'returns 413 Payload Too Large');
  }
});

test('POST /api/project-photos rejects non-image MIME with 400', async () => {
  const admin = await adminLogin();

  const projRes = await requestJson(admin, 'POST', '/api/projects', {
    method: 'POST',
    body: { name: 'MIME Test', client_id: fixtures.clients.psc, is_rollup: false }
  });
  trash.projects.push(projRes.id);

  try {
    await requestJson(admin, 'POST', '/api/project-photos', {
      method: 'POST',
      multipart: {
        photo: { filename: 'test.txt', data: Buffer.from('not an image'), type: 'text/plain' },
        project_id: projRes.id
      }
    });
    assert.fail('should reject text/plain');
  } catch (e) {
    assert.strictEqual(e.statusCode, 400, 'returns 400 Bad Request');
  }
});

test('GET /api/project-photos returns photos for a project (paginated)', async () => {
  const admin = await adminLogin();

  const projRes = await requestJson(admin, 'POST', '/api/projects', {
    method: 'POST',
    body: { name: 'List Test Project', client_id: fixtures.clients.psc, is_rollup: false }
  });
  trash.projects.push(projRes.id);

  // Upload 3 photos
  const pngBuf = Buffer.from([
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

  for (let i = 0; i < 3; i++) {
    await requestJson(admin, 'POST', '/api/project-photos', {
      method: 'POST',
      multipart: {
        photo: { filename: `test${i}.png`, data: pngBuf, type: 'image/png' },
        project_id: projRes.id,
        caption: `Photo ${i}`
      }
    });
  }

  // List with default pagination
  const listRes = await requestJson(admin, 'GET', `/api/project-photos?project_id=${projRes.id}`);

  assert.strictEqual(listRes.rows.length, 3, 'returns 3 photos');
  assert.strictEqual(listRes.total, 3, 'total count is 3');
  assert.ok(listRes.rows[0].uploader_name, 'uploader_name included');
});

test('GET /api/project-photos/:id/download with malformed UUID returns 400', async () => {
  const admin = await adminLogin();

  try {
    await requestJson(admin, 'GET', '/api/project-photos/not-a-uuid/download');
    assert.fail('should reject malformed UUID');
  } catch (e) {
    assert.strictEqual(e.statusCode, 400, 'returns 400 Bad Request');
  }
});

test('DELETE /api/project-photos/:id marks status=archived (soft-archive)', async () => {
  const admin = await adminLogin();

  const projRes = await requestJson(admin, 'POST', '/api/projects', {
    method: 'POST',
    body: { name: 'Delete Test Project', client_id: fixtures.clients.psc, is_rollup: false }
  });
  trash.projects.push(projRes.id);

  const pngBuf = Buffer.from([
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

  const uploadRes = await requestJson(admin, 'POST', '/api/project-photos', {
    method: 'POST',
    multipart: {
      photo: { filename: 'test.png', data: pngBuf, type: 'image/png' },
      project_id: projRes.id
    }
  });

  // Delete photo
  const deleteRes = await requestJson(admin, 'DELETE', `/api/project-photos/${uploadRes.id}`);
  assert.strictEqual(deleteRes.status, 'archived', 'photo archived');

  // Verify list no longer shows it
  const listRes = await requestJson(admin, 'GET', `/api/project-photos?project_id=${projRes.id}`);
  assert.strictEqual(listRes.total, 0, 'archived photo not in list');
});

test('DELETE /api/project-photos/:id by another non-admin user returns 403', async () => {
  const admin = await adminLogin();
  const user2 = await userLogin({ email: 'user2@example.com' });

  const projRes = await requestJson(admin, 'POST', '/api/projects', {
    method: 'POST',
    body: { name: 'Permission Test Project', client_id: fixtures.clients.psc, is_rollup: false }
  });
  trash.projects.push(projRes.id);

  const pngBuf = Buffer.from([
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

  // Admin uploads photo
  const uploadRes = await requestJson(admin, 'POST', '/api/project-photos', {
    method: 'POST',
    multipart: {
      photo: { filename: 'test.png', data: pngBuf, type: 'image/png' },
      project_id: projRes.id
    }
  });

  // user2 tries to delete
  try {
    await requestJson(user2, 'DELETE', `/api/project-photos/${uploadRes.id}`);
    assert.fail('should reject deletion by non-owner non-admin');
  } catch (e) {
    assert.strictEqual(e.statusCode, 403, 'returns 403 Forbidden');
  }
});
