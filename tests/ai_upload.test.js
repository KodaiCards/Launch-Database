// tests/ai_upload.test.js
//
// Minimal smoke test for the AI tools surface — covers the upload +
// upload-fetch path which is the easiest piece to test without
// stubbing the Anthropic client. Doesn't exercise /api/ai/chat
// (would need to mock the model call), but establishes that the
// route registration + multer wiring + uploadStore behaviour are
// intact.
//
// Why this exists: Track 1.3 plans to extract the AI block (~1200
// lines) from server.js into routes/ai.js. This test is the
// safety net for that move — if the upload-store wiring drifts
// during extraction, this catches it.

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  bootTestServer, close, adminLogin, baseUrl,
} = require('./_helpers');

test.before(async () => { await bootTestServer(); });
test.after(async () => { await close(); });

test('POST /api/ai/upload stages a CSV; GET /api/ai/upload/:id returns it', async () => {
  const token = await adminLogin();

  const csvText = 'name,date,hours\nAlice,2026-04-01,8\nBob,2026-04-02,7\n';
  const fd = new FormData();
  fd.set('file', new Blob([csvText], { type: 'text/csv' }), 'tiny.csv');

  // Upload — multer accepts the file, parses to rows, stages in
  // uploadStore keyed by id, returns { id, ... }.
  const upRes = await fetch(`${baseUrl()}/api/ai/upload`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: fd,
  });
  const upText = await upRes.text();
  assert.equal(upRes.status, 200, `upload failed ${upRes.status}: ${upText}`);
  const up = JSON.parse(upText);
  // Route returns `upload_id`, not `id` — the frontend chat surface in
  // public/index.html keys off pendingFileData.upload_id, so this is the
  // canonical field. (Earlier draft of this test asserted `up.id`.)
  assert.ok(up.upload_id, 'response should carry an upload_id');
  assert.equal(up.filename, 'tiny.csv');
  // The upload stages parsed rows; assert a sane shape so a future
  // refactor that drops one of these fields surfaces here.
  assert.ok(up.row_count != null || Array.isArray(up.preview),
    'response should include row_count or preview rows');

  // Fetch back: the GET endpoint reads from uploadStore by id and
  // returns the parsed rows. A miss (404) here means the in-memory
  // store didn't actually retain the upload.
  const getRes = await fetch(`${baseUrl()}/api/ai/upload/${up.upload_id}`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  assert.equal(getRes.status, 200, `upload fetch failed ${getRes.status}`);
  const got = await getRes.json();
  assert.ok(Array.isArray(got.rows), 'GET should return rows array');
  assert.ok(got.rows.length >= 2, 'should retain at least the 2 data rows');
});

test('AI endpoints reject unauthenticated callers', async () => {
  const fd = new FormData();
  fd.set('file', new Blob(['name,date,hours\nA,2026-04-01,8\n'], { type: 'text/csv' }), 'x.csv');
  const r = await fetch(`${baseUrl()}/api/ai/upload`, { method: 'POST', body: fd });
  assert.ok(r.status === 401 || r.status === 403,
    `expected 401/403 without auth, got ${r.status}`);
});
