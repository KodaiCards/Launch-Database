// tests/impersonation.test.js — Wave 166 security fixes
// HIGH-1 revocation bypass | MED-1 rate-limit | MED-2 end-auth+audit | LOW-1 customer-block

const test = require('node:test');
const assert = require('node:assert/strict');
const { bootTestServer, close, adminLogin, request, uniqueTag, pool } = require('./_helpers');

let baseUrl, adminToken, adminUserId, designerUserId, customerUserId;

function extractCookie(res, name) {
  const raw = res.headers.get('set-cookie') || '';
  for (const part of raw.split(/,(?=[^;]+=)/)) {
    const [pair] = part.trim().split(';');
    const eqIdx = pair.indexOf('=');
    if (eqIdx === -1) continue;
    if (pair.slice(0, eqIdx).trim() === name) return pair.slice(eqIdx + 1).trim();
  }
  return null;
}

test.before(async () => {
  ({ baseUrl } = await bootTestServer());
  adminToken = await adminLogin();
  const meRes = await request('GET', '/api/auth/me', { token: adminToken });
  assert.equal(meRes.status, 200);
  adminUserId = (await meRes.json()).id;

  const bcrypt = require('bcryptjs');
  const hash = await bcrypt.hash('TestPass123!', 10);
  const tag = uniqueTag();

  const d = await pool.query(
    `INSERT INTO users (username, password_hash, role, full_name, active)
     VALUES ($1,$2,'designer',$3,TRUE) RETURNING id`,
    [`imp_d_${tag}`, hash, `Imp Designer ${tag}`]
  );
  designerUserId = d.rows[0].id;

  const c = await pool.query(
    `INSERT INTO users (username, password_hash, role, full_name, active)
     VALUES ($1,$2,'customer',$3,TRUE) RETURNING id`,
    [`imp_c_${tag}`, hash, `Imp Customer ${tag}`]
  );
  customerUserId = c.rows[0].id;
});

test.after(async () => {
  if (adminUserId) await pool.query('UPDATE users SET tokens_invalid_after=NULL WHERE id=$1',[adminUserId]).catch(()=>{});
  if (designerUserId) await pool.query('DELETE FROM users WHERE id=$1',[designerUserId]).catch(()=>{});
  if (customerUserId) await pool.query('DELETE FROM users WHERE id=$1',[customerUserId]).catch(()=>{});
  await close();
});

test('HIGH-1: revoking admin session invalidates active impersonation JWT', async () => {
  const startRes = await request('POST', `/api/admin/impersonate/${designerUserId}`, { token: adminToken });
  assert.equal(startRes.status, 200, `start failed: ${startRes.status}: ${await startRes.clone().text()}`);
  const impCookie = extractCookie(startRes, 'lfs_impersonation');
  assert.ok(impCookie, 'impersonation cookie must be set');

  await pool.query('UPDATE users SET tokens_invalid_after=NOW() WHERE id=$1', [adminUserId]);

  const afterRes = await fetch(`${baseUrl}/api/auth/me`, {
    headers: { cookie: `lfs_impersonation=${impCookie}` },
  });
  assert.equal(afterRes.status, 401, 'revoked admin: impersonation cookie must return 401');

  await pool.query('UPDATE users SET tokens_invalid_after=NULL WHERE id=$1', [adminUserId]);
});

test('MED-1: impersonation start rate-limited to 20/hr', async () => {
  if (process.env.LFS_DISABLE_RATELIMIT_FOR_TESTS === '1') return;
  for (let i = 0; i < 20; i++) {
    const r = await request('POST', `/api/admin/impersonate/${designerUserId}`, { token: adminToken });
    assert.notEqual(r.status, 429, `request ${i+1} should not be rate-limited`);
  }
  const r = await request('POST', `/api/admin/impersonate/${designerUserId}`, { token: adminToken });
  assert.equal(r.status, 429, '21st must be rate-limited');
});

test('MED-2a: end-impersonation without auth returns 401', async () => {
  const r = await fetch(`${baseUrl}/api/admin/end-impersonation`, { method: 'POST' });
  assert.equal(r.status, 401, `expected 401, got ${r.status}`);
});

test('MED-2b: end-impersonation writes audit_log row', async () => {
  const startRes = await request('POST', `/api/admin/impersonate/${designerUserId}`, { token: adminToken });
  assert.equal(startRes.status, 200, `start failed: ${startRes.status}`);
  const before = new Date();
  const endRes = await request('POST', '/api/admin/end-impersonation', { token: adminToken });
  assert.equal(endRes.status, 200);
  assert.equal((await endRes.json()).ok, true);
  const log = await pool.query(
    `SELECT * FROM audit_log WHERE action='impersonation.stop' AND created_at>=$1 ORDER BY created_at DESC LIMIT 1`,
    [before]
  );
  assert.equal(log.rows.length, 1, 'must have 1 impersonation.stop audit row');
  assert.equal(log.rows[0].entity_type, 'user');
  assert.equal(log.rows[0].source, 'admin');
});

test('LOW-1: impersonating customer account returns 403', async () => {
  const r = await request('POST', `/api/admin/impersonate/${customerUserId}`, { token: adminToken });
  assert.equal(r.status, 403, `expected 403, got ${r.status}`);
  const body = await r.json();
  assert.ok(body.error && body.error.toLowerCase().includes('customer'), `error: ${body.error}`);
});
