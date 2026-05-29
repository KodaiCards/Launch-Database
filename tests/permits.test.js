// tests/permits.test.js — Wave 154 regression tests for permits.js
//
// P-1 HIGH: advance + regress must return 404 for non-permitting and non-existent projects
// P-2 HIGH: document upload must return 404 for cross-type project
// P-3 MED:  concurrent advance calls must serialize (one waits, not both succeed racing)
//
// These tests require a live DATABASE_URL (set in CI via service container or
// locally via TEST_DATABASE_URL). No mocking — we test the real HTTP surface.

'use strict';

const { bootTestServer, close, adminLogin, request, requestJson, fixtures, cleanupAll, pool } = require('./_helpers');
const path = require('path');
const fs   = require('fs');
const FormData = require('form-data');

describe('permits.js — Wave 154 security fixes', () => {
  let baseUrl, token;
  const cleanup = { projects: [], clients: [] };

  before(async () => {
    ({ baseUrl } = await bootTestServer());
    token = await adminLogin();
  });

  after(async () => {
    await cleanupAll(cleanup);
  });

  // ─── Fixtures ──────────────────────────────────────────────────────────────
  async function seedPermitProject() {
    const cl = await fixtures.client();
    cleanup.clients.push(cl.id);
    const p = await fixtures.project({ client_id: cl.id, project_type: 'permitting' });
    cleanup.projects.push(p.id);
    // Seed the initial permit stage so advance has something to work with
    await pool.query(
      `INSERT INTO permit_stages (project_id, stage, updated_by) VALUES ($1, 'potential', 'test') ON CONFLICT DO NOTHING`,
      [p.id]
    );
    return p;
  }

  async function seedNonPermitProject() {
    const cl = await fixtures.client();
    cleanup.clients.push(cl.id);
    const p = await fixtures.project({ client_id: cl.id, project_type: 'inspection' });
    cleanup.projects.push(p.id);
    return p;
  }

  // ─── P-1: advance returns 404 for non-permitting project ──────────────────
  it('P-1: advance returns 404 for a non-permitting project UUID (cross-project pollution blocked)', async () => {
    const nonPermit = await seedNonPermitProject();
    const res = await request('PUT', `/api/permits/${nonPermit.id}/advance`, {
      token,
      body: { notes: 'hack attempt' },
    });
    if (res.status !== 404) {
      const text = await res.text();
      throw new Error(`Expected 404, got ${res.status}: ${text}`);
    }
    const json = await res.json().catch(() => ({}));
    if (!json.error || !json.error.includes('not found')) {
      throw new Error(`Expected opaque 404 error, got: ${JSON.stringify(json)}`);
    }
  });

  // ─── P-1: advance returns 404 for non-existent UUID ───────────────────────
  it('P-1: advance returns 404 for a non-existent project UUID', async () => {
    const fakeId = '00000000-0000-0000-0000-000000000001';
    const res = await request('PUT', `/api/permits/${fakeId}/advance`, {
      token,
      body: { notes: 'nonexistent' },
    });
    if (res.status !== 404) {
      const text = await res.text();
      throw new Error(`Expected 404, got ${res.status}: ${text}`);
    }
  });

  // ─── P-1: regress returns 404 for non-permitting project ──────────────────
  it('P-1: regress returns 404 for a non-permitting project UUID', async () => {
    const nonPermit = await seedNonPermitProject();
    const res = await request('PUT', `/api/permits/${nonPermit.id}/regress`, {
      token,
    });
    if (res.status !== 404) {
      const text = await res.text();
      throw new Error(`Expected 404, got ${res.status}: ${text}`);
    }
  });

  // ─── P-1: regress returns 404 for non-existent UUID ──────────────────────
  it('P-1: regress returns 404 for a non-existent project UUID', async () => {
    const fakeId = '00000000-0000-0000-0000-000000000002';
    const res = await request('PUT', `/api/permits/${fakeId}/regress`, {
      token,
    });
    if (res.status !== 404) {
      const text = await res.text();
      throw new Error(`Expected 404, got ${res.status}: ${text}`);
    }
  });

  // ─── P-1: advance works for a real permitting project ─────────────────────
  it('P-1: advance succeeds for a real permitting project', async () => {
    const p = await seedPermitProject();
    const res = await request('PUT', `/api/permits/${p.id}/advance`, {
      token,
      body: { notes: 'moving along' },
    });
    if (res.status !== 200) {
      const text = await res.text();
      throw new Error(`Expected 200, got ${res.status}: ${text}`);
    }
    const json = await res.json();
    if (!json.current || !json.previous) {
      throw new Error(`Expected {previous, current} in response, got ${JSON.stringify(json)}`);
    }
  });

  // ─── P-2: document upload returns 404 for cross-type project ─────────────
  it('P-2: document upload returns 404 for a non-permitting project and does not store document', async () => {
    const nonPermit = await seedNonPermitProject();

    // Build a minimal multipart/form-data upload
    const form = new FormData();
    form.append('doc_type', 'permit_application');
    form.append('notes', 'cross-type test');
    // Use a tiny in-memory buffer as the file so we don't need a real file on disk
    form.append('file', Buffer.from('test file content'), {
      filename: 'test.txt',
      contentType: 'text/plain',
    });

    const headers = {
      ...form.getHeaders(),
      Authorization: `Bearer ${token}`,
    };

    const res = await fetch(`${baseUrl}/api/permits/${nonPermit.id}/documents`, {
      method: 'POST',
      headers,
      body: form,
    });

    if (res.status !== 404) {
      const text = await res.text();
      throw new Error(`Expected 404, got ${res.status}: ${text}`);
    }

    // Verify no permit_document row was created for this project
    const { rows } = await pool.query(
      'SELECT id FROM permit_documents WHERE project_id = $1',
      [nonPermit.id]
    );
    if (rows.length > 0) {
      throw new Error(`Document was stored despite 404 response — DB contamination`);
    }
  });

  // ─── P-3: concurrent advances serialize (no duplicate stages) ────────────
  it('P-3: concurrent advance calls on same permit project serialize without duplicating stages', async () => {
    const p = await seedPermitProject();

    // Fire two concurrent advance requests against the same project
    const [r1, r2] = await Promise.all([
      request('PUT', `/api/permits/${p.id}/advance`, { token, body: { notes: 'concurrent-1' } }),
      request('PUT', `/api/permits/${p.id}/advance`, { token, body: { notes: 'concurrent-2' } }),
    ]);

    // Both should succeed (or one gets a harmless "already at final stage"
    // if they truly race past each other), but only one stage transition
    // should have occurred.
    const status1 = r1.status;
    const status2 = r2.status;
    if (status1 !== 200 && status1 !== 200) {
      // At least one must succeed
      throw new Error(`Both concurrent advances failed: ${status1} / ${status2}`);
    }

    // Check DB: the project should now be at exactly ONE current (incomplete) stage
    const { rows: openStages } = await pool.query(
      `SELECT stage FROM permit_stages WHERE project_id = $1 AND completed_at IS NULL`,
      [p.id]
    );

    if (openStages.length > 1) {
      throw new Error(
        `Found ${openStages.length} open stages after concurrent advance — race condition not serialized. ` +
        `Stages: ${openStages.map(r => r.stage).join(', ')}`
      );
    }
  });
});
