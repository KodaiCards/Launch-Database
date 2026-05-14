// tests/oauth2.test.js
//
// Integration tests for the OAuth2 SSO bridge (routes/oauth2.js).
// Covers the three endpoints end-to-end against the live test server:
//
//   GET  /oauth2/authorize  — client_id/redirect_uri validation, code issuance,
//                             login redirect for unauthenticated users
//   POST /oauth2/token      — client secret validation, code exchange, token shape
//   GET  /oauth2/userinfo   — Bearer validation, profile return, 401 paths
//
// These tests set the required env vars before booting the server so the
// bridge is active for the full suite.

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { bootTestServer, close, adminLogin, pool } = require('./_helpers');

// ─── Env vars for this suite ──────────────────────────────────────────────────
// Set before server boot — auth.js + oauth2.js read process.env at require time.
const TEST_CLIENT_ID     = 'test-moodle-client';
const TEST_CLIENT_SECRET = 'test-moodle-secret-abc123';
const TEST_REDIRECT_URI  = 'https://training.example.com/admin/oauth2callback.php';

process.env.OAUTH2_CLIENT_ID             = TEST_CLIENT_ID;
process.env.OAUTH2_CLIENT_SECRET         = TEST_CLIENT_SECRET;
process.env.OAUTH2_ALLOWED_REDIRECT_URIS = TEST_REDIRECT_URI;
process.env.LFS_DISABLE_RATELIMIT_FOR_TESTS = '1';

let baseUrl;

before(async () => {
  const srv = await bootTestServer();
  baseUrl = srv.baseUrl;
});

after(async () => {
  await close();
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Returns { status, headers, body } for any HTTP request.
async function req(method, path, opts = {}) {
  const headers = { ...(opts.headers || {}) };
  let body = opts.body;
  if (body && typeof body === 'object') {
    // Use URLSearchParams for form-encoded bodies (token endpoint).
    if (opts.formEncoded) {
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
      body = new URLSearchParams(body).toString();
    } else {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(body);
    }
  }
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body,
    redirect: 'manual',  // we inspect 302s ourselves
  });
  let responseBody = null;
  try { responseBody = await res.json(); } catch { /* non-JSON */ }
  return { status: res.status, headers: res.headers, body: responseBody, raw: res };
}

// Build a cookie jar for a logged-in session. Returns the raw Set-Cookie
// value to forward in subsequent requests.
async function loginCookie() {
  const res = await fetch(`${baseUrl}/api/auth/login`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ username: 'admin', password: process.env.ADMIN_PASSWORD }),
    redirect: 'manual',
  });
  assert.equal(res.status, 200, 'Admin login must succeed');
  const cookie = res.headers.get('set-cookie');
  assert.ok(cookie, 'Login must set a session cookie');
  return cookie;
}

// Full authorize URL helper.
function authorizeUrl(overrides = {}) {
  const params = new URLSearchParams({
    client_id:     TEST_CLIENT_ID,
    redirect_uri:  TEST_REDIRECT_URI,
    response_type: 'code',
    state:         'test-state-xyz',
    ...overrides,
  });
  return `/oauth2/authorize?${params}`;
}

// ─── GET /oauth2/authorize ────────────────────────────────────────────────────

test('authorize: returns 400 on invalid client_id', async () => {
  const { status, body } = await req('GET', authorizeUrl({ client_id: 'wrong-client' }));
  assert.equal(status, 400);
  assert.ok(body && body.error, 'Should return an error field');
  assert.match(body.error, /client_id/i);
});

test('authorize: returns 400 on disallowed redirect_uri', async () => {
  const { status, body } = await req('GET', authorizeUrl({ redirect_uri: 'https://evil.example.com/callback' }));
  assert.equal(status, 400);
  assert.ok(body && body.error);
  assert.match(body.error, /redirect_uri/i);
});

test('authorize: returns 400 on wrong response_type', async () => {
  const { status, body } = await req('GET', authorizeUrl({ response_type: 'token' }));
  assert.equal(status, 400);
  assert.ok(body && body.error);
});

test('authorize: redirects unauthenticated user to /login with next param', async () => {
  const { status, headers } = await req('GET', authorizeUrl());
  // No session cookie — should redirect to login.
  assert.equal(status, 302);
  const location = headers.get('location') || '';
  assert.ok(location.startsWith('/login'), `Expected /login redirect, got: ${location}`);
  assert.ok(location.includes('next='), 'Should include next= param so user returns after login');
  assert.ok(location.includes(encodeURIComponent('/oauth2/authorize')), 'next= should point back to /oauth2/authorize');
});

test('authorize: issues code and redirects to redirect_uri when user is authenticated', async () => {
  const cookie = await loginCookie();
  const { status, headers } = await req('GET', authorizeUrl(), {
    headers: { Cookie: cookie },
  });
  assert.equal(status, 302, 'Should 302 to redirect_uri');
  const location = headers.get('location') || '';
  assert.ok(location.startsWith(TEST_REDIRECT_URI), `Location should start with redirect_uri, got: ${location}`);
  const locationUrl = new URL(location);
  assert.ok(locationUrl.searchParams.get('code'), 'Should include a code parameter');
  assert.equal(locationUrl.searchParams.get('state'), 'test-state-xyz', 'Should pass state through');
  assert.ok(locationUrl.searchParams.get('code').length >= 64, 'Code should be 32-byte hex (64 chars)');
});

// ─── POST /oauth2/token ───────────────────────────────────────────────────────

// Helper: get a fresh code via the authorize endpoint (authed).
async function getFreshCode() {
  const cookie = await loginCookie();
  const { headers } = await req('GET', authorizeUrl(), {
    headers: { Cookie: cookie },
  });
  const location = headers.get('location') || '';
  const locationUrl = new URL(location);
  return locationUrl.searchParams.get('code');
}

function tokenBody(overrides = {}) {
  return {
    grant_type:    'authorization_code',
    code:          'placeholder',
    client_id:     TEST_CLIENT_ID,
    client_secret: TEST_CLIENT_SECRET,
    redirect_uri:  TEST_REDIRECT_URI,
    ...overrides,
  };
}

test('token: returns 400 on wrong client_secret', async () => {
  const code = await getFreshCode();
  const { status, body } = await req('POST', '/oauth2/token', {
    body:        tokenBody({ code, client_secret: 'wrong-secret' }),
    formEncoded: true,
  });
  assert.equal(status, 400);
  assert.ok(body && body.error);
  assert.match(body.error, /client credentials/i);
});

test('token: returns 400 on wrong client_id', async () => {
  const code = await getFreshCode();
  const { status, body } = await req('POST', '/oauth2/token', {
    body:        tokenBody({ code, client_id: 'wrong-id' }),
    formEncoded: true,
  });
  assert.equal(status, 400);
  assert.ok(body && body.error);
});

test('token: returns 400 on invalid/expired code', async () => {
  const { status, body } = await req('POST', '/oauth2/token', {
    body:        tokenBody({ code: 'aabbccdd' + '00'.repeat(28) }),
    formEncoded: true,
  });
  assert.equal(status, 400);
  assert.ok(body && body.error);
  assert.match(body.error, /invalid or has expired/i);
});

test('token: returns 400 on redirect_uri mismatch', async () => {
  const code = await getFreshCode();
  const { status, body } = await req('POST', '/oauth2/token', {
    body:        tokenBody({ code, redirect_uri: 'https://other.example.com/callback' }),
    formEncoded: true,
  });
  assert.equal(status, 400);
  assert.ok(body && body.error);
  assert.match(body.error, /redirect_uri/i);
});

test('token: returns 400 on wrong grant_type', async () => {
  const code = await getFreshCode();
  const { status, body } = await req('POST', '/oauth2/token', {
    body:        tokenBody({ code, grant_type: 'client_credentials' }),
    formEncoded: true,
  });
  assert.equal(status, 400);
  assert.ok(body && body.error);
});

test('token: returns access_token on valid code exchange', async () => {
  const code = await getFreshCode();
  const { status, body } = await req('POST', '/oauth2/token', {
    body:        tokenBody({ code }),
    formEncoded: true,
  });
  assert.equal(status, 200);
  assert.ok(body && body.access_token, 'Should return access_token');
  assert.equal(body.token_type, 'Bearer', 'token_type should be Bearer');
  assert.equal(body.expires_in, 900, 'expires_in should be 900 seconds (15 min)');
});

test('token: code is single-use — second exchange with same code returns 400', async () => {
  const code = await getFreshCode();
  // First use — should succeed.
  const first = await req('POST', '/oauth2/token', {
    body:        tokenBody({ code }),
    formEncoded: true,
  });
  assert.equal(first.status, 200, 'First exchange should succeed');
  // Second use — code is gone.
  const second = await req('POST', '/oauth2/token', {
    body:        tokenBody({ code }),
    formEncoded: true,
  });
  assert.equal(second.status, 400, 'Second exchange with same code should fail');
});

// ─── GET /oauth2/userinfo ─────────────────────────────────────────────────────

// Helper: full authorize → token → access_token chain.
async function getAccessToken() {
  const code = await getFreshCode();
  const { body } = await req('POST', '/oauth2/token', {
    body:        tokenBody({ code }),
    formEncoded: true,
  });
  return body.access_token;
}

test('userinfo: returns 401 on missing Authorization header', async () => {
  const { status, body } = await req('GET', '/oauth2/userinfo');
  assert.equal(status, 401);
  assert.ok(body && body.error);
  assert.match(body.error, /Bearer/i);
});

test('userinfo: returns 401 on garbage Bearer token', async () => {
  const { status, body } = await req('GET', '/oauth2/userinfo', {
    headers: { Authorization: 'Bearer notavalidtoken' },
  });
  assert.equal(status, 401);
  assert.ok(body && body.error);
});

test('userinfo: returns 401 on main session JWT (wrong audience)', async () => {
  // The main session token has audience 'lfs', not 'moodle-sso'.
  // Using it on /userinfo should be rejected even though it's a valid JWT.
  const mainToken = await adminLogin();
  const { status, body } = await req('GET', '/oauth2/userinfo', {
    headers: { Authorization: `Bearer ${mainToken}` },
  });
  assert.equal(status, 401);
  assert.ok(body && body.error);
});

test('userinfo: returns user profile on valid Bearer access token', async () => {
  const accessToken = await getAccessToken();
  const { status, body } = await req('GET', '/oauth2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  assert.equal(status, 200);
  assert.ok(body, 'Should return a body');
  // OIDC required fields
  assert.ok(body.sub,                'Should include sub (user id)');
  assert.ok(body.name,               'Should include name');
  assert.ok(body.preferred_username, 'Should include preferred_username');
  // Admin user was seeded with username 'admin'
  assert.equal(body.preferred_username, 'admin');
  assert.equal(body.lfs_role, 'admin', 'Should include lfs_role');
});
