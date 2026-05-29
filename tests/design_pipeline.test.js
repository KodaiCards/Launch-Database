// tests/design_pipeline.test.js — Wave 159 regression tests for design_pipeline.js
//
// DP-H1 HIGH: advance + regress must return 404 for non-design and non-existent projects
// DP-M1 MED:  concurrent advance calls must serialize (one waits, not both succeed racing)
// DP-L1 LOW:  successful advance must create an audit_log row
//
// These tests require a live DATABASE_URL (set in CI via service container or
// locally via TEST_DATABASE_URL). No mocking — we test the real HTTP surface.

'use strict';

const { bootTestServer, close, adminLogin, request, fixtures, cleanupAll, pool } = require('./_helpers');

describe('design_pipeline.js — Wave 159 security fixes', () => {
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
  async function seedDesignProject() {
    const cl = await fixtures.client();
    cleanup.clients.push(cl.id);
    const p = await fixtures.project({ client_id: cl.id, project_type: 'design' });
    cleanup.projects.push(p.id);
    // Seed the initial design stage so advance has something to work with
    await pool.query(
      `INSERT INTO design_stages (project_id, stage, updated_by) VALUES ($1, 'potential', 'test') ON CONFLICT DO NOTHING`,
      [p.id]
    );
    return p;
  }

  async function seedNonDesignProject() {
    const cl = await fixtures.client();
    cleanup.clients.push(cl.id);
    const p = await fixtures.project({ client_id: cl.id, project_type: 'inspection' });
    cleanup.projects.push(p.id);
    return p;
  }

  // ─── DP-H1: advance returns 404 for non-design project ────────────────────
  it('DP-H1: advance returns 404 for a non-design project UUID (cross-project pollution blocked)', async () => {
    const nonDesign = await seedNonDesignProject();
    const res = await request('PUT', `/api/design/${nonDesign.id}/advance`, {
      token,
      body: { notes: 'hack attempt' },
    });
    if (res.status !== 404) {
      const text = await res.text();
      throw new Error(`Expected 404, got ${res.status}: ${text}`);
    }
    const json = await res.json().catch(() => ({}));
    if (!json.error || !json.error.toLowerCase().includes('not found')) {
      throw new Error(`Expected opaque 404 error, got: ${JSON.stringify(json)}`);
    }
  });

  // ─── DP-H1: advance returns 404 for non-existent UUID ─────────────────────
  it('DP-H1: advance returns 404 for a non-existent project UUID', async () => {
    const fakeId = '00000000-0000-0000-0000-000000000011';
    const res = await request('PUT', `/api/design/${fakeId}/advance`, {
      token,
      body: { notes: 'nonexistent' },
    });
    if (res.status !== 404) {
      const text = await res.text();
      throw new Error(`Expected 404, got ${res.status}: ${text}`);
    }
  });

  // ─── DP-H1: regress returns 404 for non-design project ────────────────────
  it('DP-H1: regress returns 404 for a non-design project UUID', async () => {
    const nonDesign = await seedNonDesignProject();
    const res = await request('PUT', `/api/design/${nonDesign.id}/regress`, { token });
    if (res.status !== 404) {
      const text = await res.text();
      throw new Error(`Expected 404, got ${res.status}: ${text}`);
    }
  });

  // ─── DP-H1: regress returns 404 for non-existent UUID ─────────────────────
  it('DP-H1: regress returns 404 for a non-existent project UUID', async () => {
    const fakeId = '00000000-0000-0000-0000-000000000012';
    const res = await request('PUT', `/api/design/${fakeId}/regress`, { token });
    if (res.status !== 404) {
      const text = await res.text();
      throw new Error(`Expected 404, got ${res.status}: ${text}`);
    }
  });

  // ─── DP-H1: advance works for a real design project ───────────────────────
  it('DP-H1: advance succeeds for a real design project', async () => {
    const p = await seedDesignProject();
    const res = await request('PUT', `/api/design/${p.id}/advance`, {
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

  // ─── DP-M1: concurrent advances serialize (no duplicate stages) ───────────
  it('DP-M1: concurrent advance calls on same design project serialize without duplicating stages', async () => {
    const p = await seedDesignProject();

    // Fire two concurrent advance requests against the same project
    const [r1, r2] = await Promise.all([
      request('PUT', `/api/design/${p.id}/advance`, { token, body: { notes: 'concurrent-1' } }),
      request('PUT', `/api/design/${p.id}/advance`, { token, body: { notes: 'concurrent-2' } }),
    ]);

    const status1 = r1.status;
    const status2 = r2.status;
    if (status1 !== 200 && status2 !== 200) {
      // At least one must succeed
      throw new Error(`Both concurrent advances failed: ${status1} / ${status2}`);
    }

    // Check DB: the project should now be at exactly ONE current (incomplete) stage
    const { rows: openStages } = await pool.query(
      `SELECT stage FROM design_stages WHERE project_id = $1 AND completed_at IS NULL`,
      [p.id]
    );

    if (openStages.length > 1) {
      throw new Error(
        `Found ${openStages.length} open stages after concurrent advance — race condition not serialized. ` +
        `Stages: ${openStages.map(r => r.stage).join(', ')}`
      );
    }
  });

  // ─── DP-L1: advance creates an audit_log row ──────────────────────────────
  it('DP-L1: successful advance creates an audit_log entry', async () => {
    const p = await seedDesignProject();

    // Record the audit_log count before
    const { rows: before } = await pool.query(
      `SELECT COUNT(*) AS cnt FROM audit_log WHERE entity_type='project' AND entity_id=$1 AND action='design.advance'`,
      [p.id]
    );
    const countBefore = parseInt(before[0].cnt, 10);

    const res = await request('PUT', `/api/design/${p.id}/advance`, {
      token,
      body: { notes: 'audit trail test' },
    });
    if (res.status !== 200) {
      const text = await res.text();
      throw new Error(`Expected 200, got ${res.status}: ${text}`);
    }

    // Give logAudit (fire-and-forget) a short moment to write
    await new Promise(r => setTimeout(r, 150));

    const { rows: after } = await pool.query(
      `SELECT COUNT(*) AS cnt FROM audit_log WHERE entity_type='project' AND entity_id=$1 AND action='design.advance'`,
      [p.id]
    );
    const countAfter = parseInt(after[0].cnt, 10);

    if (countAfter <= countBefore) {
      throw new Error(
        `Expected audit_log row for design.advance after advance — count before: ${countBefore}, after: ${countAfter}`
      );
    }
  });
});
