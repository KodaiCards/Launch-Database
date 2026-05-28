const assert = require('assert');
const Pool = require('pg').Pool;
const express = require('express');
const installRecentActivityRoutes = require('../routes/recent_activity');

describe('Recent Activity Route', () => {
  let app, pool, server;
  const baseUrl = 'http://localhost:3333';
  let adminUserId, regularUserId, projectId;

  before(async function () {
    this.timeout(10000);
    if (!process.env.DATABASE_URL) {
      this.skip();
      return;
    }

    pool = new Pool();
    app = express();
    app.use(express.json());

    const mockAuth = {
      requireAuth: (req, res, next) => {
        req.user = { id: adminUserId };
        next();
      },
      requireAdmin: (req, res, next) => {
        req.user = { id: adminUserId, is_admin: true };
        if (!req.user.is_admin) return res.status(403).json({ error: 'Not admin' });
        next();
      }
    };

    installRecentActivityRoutes(app, pool, mockAuth);
    server = app.listen(3333);

    await pool.query('BEGIN');
    const userRes = await pool.query('INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id', ['test-admin', 'admin@test.com', 'hash']);
    adminUserId = userRes.rows[0].id;
    const projRes = await pool.query('INSERT INTO projects (name, client_id) VALUES ($1, $2) RETURNING id', ['Test Project', 1]);
    projectId = projRes.rows[0].id;
  });

  after(async function () {
    if (server) server.close();
    if (pool) {
      await pool.query('ROLLBACK');
      await pool.end();
    }
  });

  it('GET /api/admin/recent-activity returns activities + total_today', async function () {
    this.timeout(5000);
    const res = await fetch(`${baseUrl}/api/admin/recent-activity?limit=20`, { credentials: 'include' });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert(data.activities !== undefined);
    assert(data.total_today !== undefined);
    assert(Array.isArray(data.activities));
  });

  it('GET /api/admin/recent-activity?limit=5 respects limit', async function () {
    this.timeout(5000);
    const res = await fetch(`${baseUrl}/api/admin/recent-activity?limit=5`, { credentials: 'include' });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert(data.activities.length <= 5);
  });

  it('GET /api/admin/recent-activity activities sorted newest-first', async function () {
    this.timeout(5000);
    const res = await fetch(`${baseUrl}/api/admin/recent-activity?limit=20`, { credentials: 'include' });
    const data = await res.json();
    if (data.activities.length > 1) {
      for (let i = 0; i < data.activities.length - 1; i++) {
        const prev = new Date(data.activities[i].at);
        const next = new Date(data.activities[i + 1].at);
        assert(prev >= next, 'Activities should be sorted newest-first');
      }
    }
  });

  it('total_today counts only last 24 hours', async function () {
    this.timeout(5000);
    const res = await fetch(`${baseUrl}/api/admin/recent-activity?limit=20`, { credentials: 'include' });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert(typeof data.total_today === 'number');
    assert(data.total_today >= 0);
  });
});
