// Sanity check: the test scaffolding boots, the server starts on an
// ephemeral port, and admin login works. If this fails, every other smoke
// test will too — fix this first. Filename starts with `_` so it sorts
// before the feature smoke tests when node --test alphabetizes the files.

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { bootTestServer, close, adminLogin, requestJson, request, baseUrl } = require('./_helpers');

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

// Regression: login-page assets must be reachable without auth. Without the
// allowlist entry the auth middleware redirects to /login (HTML) and the
// browser tries to parse the response as JS — fires "Unexpected token '<'".
// (server.js, pageRequiresAuth)
test('login-page static assets are reachable without auth', async () => {
  for (const path of ['/toast.js', '/keyboard.js', '/app-shell.css']) {
    const r = await fetch(`${baseUrl()}${path}`, { redirect: 'manual' });
    assert.equal(r.status, 200, `${path} should be 200 (got ${r.status} — likely redirected to /login)`);
    const ct = r.headers.get('content-type') || '';
    if (path.endsWith('.js')) {
      assert.ok(ct.includes('javascript'), `${path} content-type should be JS, got "${ct}"`);
    } else if (path.endsWith('.css')) {
      assert.ok(ct.includes('css'), `${path} content-type should be CSS, got "${ct}"`);
    }
  }
});

// Regression: unknown /api/* paths must return JSON 404, not HTML. Without
// this, the SPA catch-all serves index.html and frontends doing r.json()
// throw "Unexpected token '<'". (server.js, /api 404 handler)
test('unknown /api/* path returns JSON 404, not the SPA HTML', async () => {
  const token = await adminLogin();
  const r = await request('GET', '/api/this-route-does-not-exist', { token });
  assert.equal(r.status, 404);
  const ct = r.headers.get('content-type') || '';
  assert.ok(ct.includes('json'), `expected JSON content-type, got "${ct}"`);
  const body = await r.json();
  assert.equal(body.error, 'Not found');
});
