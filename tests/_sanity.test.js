// Sanity check: the test scaffolding boots, the server starts on an
// ephemeral port, and admin login works. If this fails, every other smoke
// test will too — fix this first. Filename starts with `_` so it sorts
// before the feature smoke tests when node --test alphabetizes the files.

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { bootTestServer, close, adminLogin, requestJson } = require('./_helpers');

before(async () => { await bootTestServer(); });
after(async () => { await close(); });

test('GET /api/auth/me without token returns 401', async () => {
  const json = await requestJson('GET', '/api/auth/me', { expectStatus: 401 });
  assert.equal(json.error, 'Not logged in');
});

test('POST /api/auth/login as admin returns a token', async () => {
  const token = await adminLogin();
  assert.ok(typeof token === 'string' && token.length > 20, 'token should be a non-trivial string');
});

test('GET /api/auth/me with token returns the admin user', async () => {
  const token = await adminLogin();
  const json = await requestJson('GET', '/api/auth/me', { token });
  assert.equal(json.username, 'admin');
  assert.equal(json.role, 'admin');
});
