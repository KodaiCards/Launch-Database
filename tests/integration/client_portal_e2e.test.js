// tests/integration/client_portal_e2e.test.js
// End-to-end Playwright tests for client portal v1.
// Covers: magic-link auth, token lifecycle, document upload/download, approvals.
//
// Scenarios:
// A — magic-link auth flow: login link → cookie + identity
// B — token revoke: revoked tokens return 401
// C — token expiry: expired tokens return 401
// D — document upload + download: POST → 201 + GET file
// E — IDOR cross-org: client A cannot see client B's docs
// F — approval round-trip: admin creates → client responds → 409 on re-respond
// G — magic-byte bypass: .php file with pdf Content-Type → 400

const { test, expect } = require('@playwright/test');
const { pool, uniqueTag, cleanup, close } = require('./_db');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Direct-DB helpers for client portal tables.
async function insertOrg({ name, status = 'active' } = {}) {
  const n = name || uniqueTag('org');
  const { rows } = await pool.query(
    `INSERT INTO client_organizations (name, status) VALUES ($1, $2) RETURNING *`,
    [n, status]
  );
  return rows[0];
}

async function insertUser(orgId, { status = 'active' } = {}) {
  const { rows } = await pool.query(
    `INSERT INTO client_users (org_id, name, email, status) VALUES ($1, $2, $3, $4) RETURNING *`,
    [orgId, uniqueTag('user'), uniqueTag('user') + '@test.invalid', status]
  );
  return rows[0];
}

async function generateToken(userId, { expiredDaysAgo = null } = {}) {
  const raw = crypto.randomBytes(32).toString('base64url');
  const hash = crypto.createHash('sha256').update(raw).digest('hex');
  let expiresAt = null;
  if (expiredDaysAgo !== null) {
    expiresAt = new Date(Date.now() - expiredDaysAgo * 86400 * 1000).toISOString();
  }
  const { rows } = await pool.query(
    `INSERT INTO client_tokens (client_user_id, token_hash, expires_at) VALUES ($1, $2, $3) RETURNING *`,
    [userId, hash, expiresAt]
  );
  return { raw, token: rows[0] };
}

async function revokeToken(tokenId) {
  await pool.query(
    `UPDATE client_tokens SET revoked_at = NOW() WHERE id = $1`,
    [tokenId]
  );
}

async function insertClient({ name } = {}) {
  const n = name || uniqueTag('client');
  const { rows } = await pool.query(
    `INSERT INTO clients (name) VALUES ($1) RETURNING *`,
    [n]
  );
  return rows[0];
}

async function insertEngineeringContract({ client_id, client_org_id, program = 'rus' } = {}) {
  const { rows } = await pool.query(
    `INSERT INTO engineering_contracts (client_id, client_org_id, program, name)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [client_id, client_org_id, program, uniqueTag('ec')]
  );
  return rows[0];
}

async function insertProject({ ec_id, name } = {}) {
  const { rows } = await pool.query(
    `INSERT INTO projects (engineering_contract_id, name)
     VALUES ($1, $2) RETURNING *`,
    [ec_id, name || uniqueTag('proj')]
  );
  return rows[0];
}

async function insertApproval({ org_id, project_id, title, status = 'pending' } = {}) {
  const { rows } = await pool.query(
    `INSERT INTO client_approvals (client_org_id, project_id, title, status, requested_at)
     VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
    [org_id, project_id, title || 'Approval Request', status]
  );
  return rows[0];
}

let baseURL;

test.beforeAll(async () => {
  baseURL = process.env.TEST_BASE_URL || 'http://localhost:3000';
});

test.beforeEach(async () => {
  // Cleanup before each test.
  await cleanup();
});

test.afterAll(async () => {
  await close();
});

// ══════════════════════════════════════════════════════════════════════
// Scenario A — magic-link auth flow
// ══════════════════════════════════════════════════════════════════════

test('A: client logs in via magic link, gets cookie + identity', async ({ page }) => {
  const org = await insertOrg();
  const user = await insertUser(org.id);
  const { raw } = await generateToken(user.id);

  // Consume the token: GET /client/login/:rawToken
  await page.goto(`${baseURL}/client/login/${raw}`);

  // Should redirect to /client/
  expect(page.url()).toContain('/client/');

  // Cookie should be set with the raw token value.
  const cookies = await page.context().cookies();
  const sessionCookie = cookies.find(c => c.name === 'lfs_client_session');
  expect(sessionCookie).toBeDefined();
  expect(sessionCookie.value).toBe(raw);
  expect(sessionCookie.httpOnly).toBe(true);

  // /api/client/me should return user + org
  const meRes = await page.request.get(`${baseURL}/api/client/me`);
  expect(meRes.status()).toBe(200);
  const meData = await meRes.json();
  expect(meData.client_user.id).toBe(user.id);
  expect(meData.client_org.id).toBe(org.id);
});

// ══════════════════════════════════════════════════════════════════════
// Scenario B — token revoke
// ══════════════════════════════════════════════════════════════════════

test('B: revoked token returns 401 on next request', async ({ page }) => {
  const org = await insertOrg();
  const user = await insertUser(org.id);
  const { raw, token } = await generateToken(user.id);

  // First login succeeds.
  await page.goto(`${baseURL}/client/login/${raw}`);
  expect(page.url()).toContain('/client/');

  // Revoke the token.
  await revokeToken(token.id);

  // Next API call with the cookie should return 401.
  const meRes = await page.request.get(`${baseURL}/api/client/me`);
  expect(meRes.status()).toBe(401);
  const body = await meRes.text();
  expect(body).toContain('invalid or no longer active');
});

// ══════════════════════════════════════════════════════════════════════
// Scenario C — token expiry
// ══════════════════════════════════════════════════════════════════════

test('C: expired token returns 401', async ({ page }) => {
  const org = await insertOrg();
  const user = await insertUser(org.id);
  // Token expired 1 day ago.
  const { raw } = await generateToken(user.id, { expiredDaysAgo: 1 });

  // Try to login.
  await page.goto(`${baseURL}/client/login/${raw}`);

  // Should get 401 (opaque message per W45-MED-1).
  const responsePromise = page.waitForResponse(r => r.url().includes('/client/login'));
  await page.goto(`${baseURL}/client/login/${raw}`, { waitUntil: 'networkidle' });
  const res = await responsePromise;
  expect(res.status()).toBe(401);
});

// ══════════════════════════════════════════════════════════════════════
// Scenario D — document upload + download
// ══════════════════════════════════════════════════════════════════════

test('D: client uploads PDF, lists it, downloads it', async ({ page }) => {
  const org = await insertOrg();
  const user = await insertUser(org.id);
  const { raw } = await generateToken(user.id);

  // Login.
  await page.goto(`${baseURL}/client/login/${raw}`);

  // Create a test PDF file (minimal PDF signature).
  const pdfPath = path.join(__dirname, '..', 'fixtures', 'test.pdf');
  const pdfDir = path.dirname(pdfPath);
  if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });

  // Minimal PDF: %PDF-1.4 signature + minimal structure.
  const pdfContent = Buffer.concat([
    Buffer.from('%PDF-1.4\n%minimal\n', 'utf8'),
    Buffer.from([0x25, 0x50, 0x44, 0x46]), // More PDF magic
  ]);
  fs.writeFileSync(pdfPath, pdfContent);

  // Upload document via multipart form.
  const formData = new FormData();
  const fileBlob = new Blob([pdfContent], { type: 'application/pdf' });
  const file = new File([fileBlob], 'test.pdf', { type: 'application/pdf' });
  formData.append('file', file);
  formData.append('notes', 'Test upload');

  const uploadRes = await page.request.post(
    `${baseURL}/api/client/documents`,
    { data: formData }
  );
  expect(uploadRes.status()).toBe(201);
  const uploaded = await uploadRes.json();
  expect(uploaded.document.filename).toBe('test.pdf');
  expect(uploaded.document.mime_type).toBe('application/pdf');
  const docId = uploaded.document.id;

  // List documents.
  const listRes = await page.request.get(`${baseURL}/api/client/documents`);
  expect(listRes.status()).toBe(200);
  const docs = await listRes.json();
  expect(docs.documents.length).toBeGreaterThan(0);
  const found = docs.documents.find(d => d.id === docId);
  expect(found).toBeDefined();

  // Download document.
  const downloadRes = await page.request.get(
    `${baseURL}/api/client/documents/${docId}/download`
  );
  expect(downloadRes.status()).toBe(200);
  const content = await downloadRes.arrayBuffer();
  expect(content.byteLength).toBeGreaterThan(0);

  // Cleanup.
  if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
});

// ══════════════════════════════════════════════════════════════════════
// Scenario E — IDOR cross-org: client A cannot see client B's docs
// ══════════════════════════════════════════════════════════════════════

test('E: client A cannot download client B\'s document (IDOR)', async ({ page, context }) => {
  // Org A.
  const orgA = await insertOrg();
  const userA = await insertUser(orgA.id);
  const tokenA = await generateToken(userA.id);

  // Org B.
  const orgB = await insertOrg();
  const userB = await insertUser(orgB.id);
  const tokenB = await generateToken(userB.id);

  // Login as B, upload a document.
  const pageB = await context.newPage();
  await pageB.goto(`${baseURL}/client/login/${tokenB.raw}`);

  const pdfPath = path.join(__dirname, '..', 'fixtures', 'test_idor.pdf');
  const pdfDir = path.dirname(pdfPath);
  if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });
  const pdfContent = Buffer.concat([
    Buffer.from('%PDF-1.4\n', 'utf8'),
    Buffer.from([0x25, 0x50, 0x44, 0x46]),
  ]);
  fs.writeFileSync(pdfPath, pdfContent);

  const formData = new FormData();
  const fileBlob = new Blob([pdfContent], { type: 'application/pdf' });
  const file = new File([fileBlob], 'secret.pdf', { type: 'application/pdf' });
  formData.append('file', file);

  const uploadRes = await pageB.request.post(
    `${baseURL}/api/client/documents`,
    { data: formData }
  );
  expect(uploadRes.status()).toBe(201);
  const docB = await uploadRes.json();
  const docIdB = docB.document.id;
  await pageB.close();

  // Login as A, try to download B's document.
  await page.goto(`${baseURL}/client/login/${tokenA.raw}`);
  const downloadRes = await page.request.get(
    `${baseURL}/api/client/documents/${docIdB}/download`
  );
  // Should be 404 (not accessible by A's org).
  expect(downloadRes.status()).toBe(404);

  // Cleanup.
  if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
});

// ══════════════════════════════════════════════════════════════════════
// Scenario F — approval round-trip
// ══════════════════════════════════════════════════════════════════════

test('F: client responds to approval, second respond returns 409', async ({ page }) => {
  const org = await insertOrg();
  const user = await insertUser(org.id);
  const { raw } = await generateToken(user.id);

  // Create a project.
  const client = await insertClient();
  const ec = await insertEngineeringContract({
    client_id: client.id,
    client_org_id: org.id,
  });
  const project = await insertProject({ ec_id: ec.id });

  // Admin creates an approval for the client.
  const approval = await insertApproval({
    org_id: org.id,
    project_id: project.id,
    title: 'Review and sign',
  });

  // Client logs in.
  await page.goto(`${baseURL}/client/login/${raw}`);

  // List approvals — should show as pending.
  let approvalsRes = await page.request.get(`${baseURL}/api/client/approvals`);
  expect(approvalsRes.status()).toBe(200);
  let apprList = await approvalsRes.json();
  const found = apprList.approvals.find(a => a.id === approval.id);
  expect(found).toBeDefined();
  expect(found.status).toBe('pending');

  // Respond to approval.
  const respondRes = await page.request.post(
    `${baseURL}/api/client/approvals/${approval.id}/respond`,
    {
      data: {
        response: 'approved',
        response_notes: 'Looks good',
      },
    }
  );
  expect(respondRes.status()).toBe(200);
  const updated = await respondRes.json();
  expect(updated.approval.status).toBe('responded');
  expect(updated.approval.response).toBe('approved');

  // Try to respond again — should get 409.
  const secondRes = await page.request.post(
    `${baseURL}/api/client/approvals/${approval.id}/respond`,
    {
      data: {
        response: 'rejected',
        response_notes: 'Actually, wait...',
      },
    }
  );
  expect(secondRes.status()).toBe(409);
  const err = await secondRes.json();
  expect(err.error).toContain('already responded');
});

// ══════════════════════════════════════════════════════════════════════
// Scenario G — magic-byte bypass: .php with pdf Content-Type → 400
// ══════════════════════════════════════════════════════════════════════

test('G: PHP file with pdf Content-Type rejected (magic-byte check)', async ({ page }) => {
  const org = await insertOrg();
  const user = await insertUser(org.id);
  const { raw } = await generateToken(user.id);

  // Login.
  await page.goto(`${baseURL}/client/login/${raw}`);

  // Create a file with .php content but pdf extension.
  const phpPath = path.join(__dirname, '..', 'fixtures', 'fake.pdf');
  const phpDir = path.dirname(phpPath);
  if (!fs.existsSync(phpDir)) fs.mkdirSync(phpDir, { recursive: true });

  // PHP code disguised as PDF (missing PDF magic bytes).
  const phpContent = Buffer.from('<?php system($_GET["cmd"]); ?>', 'utf8');
  fs.writeFileSync(phpPath, phpContent);

  // Try to upload with pdf Content-Type.
  const formData = new FormData();
  const fileBlob = new Blob([phpContent], { type: 'application/pdf' });
  const file = new File([fileBlob], 'fake.pdf', { type: 'application/pdf' });
  formData.append('file', file);

  const uploadRes = await page.request.post(
    `${baseURL}/api/client/documents`,
    { data: formData }
  );

  // Should be rejected because magic bytes don't match application/pdf.
  expect(uploadRes.status()).toBe(400);
  const err = await uploadRes.json();
  expect(err.error).toContain('file content does not match');

  // Cleanup.
  if (fs.existsSync(phpPath)) fs.unlinkSync(phpPath);
});
