// Integration test for the Phase-2 write-path additions (migration 0065):
// routes CRUD, cost_category-by-discipline, material units → completed rollup,
// finalize cascade, and client tile visibility. Mounts routes/service_areas.js
// against the real DB. Skips when DATABASE_URL is unset (e.g. CI) so it never
// blocks the suite — it's an integration check, run locally with the dev DB.

const { test } = require('node:test');
const assert = require('node:assert');
const express = require('express');
const { Pool } = require('pg');

const DB = process.env.DATABASE_URL;

test('service-area routes / materials / finalize write-path', { skip: DB ? false : 'no DATABASE_URL' }, async () => {
  const pool = new Pool({ connectionString: DB });
  const app = express();
  app.use(express.json());
  const USER = { id: null, role: 'admin', staff_id: null }; // id null → created_by stays NULL (no FK row needed)
  const setUser = (req, _res, next) => { req.user = USER; next(); };
  const mw = { requireAuth: () => setUser, requireManagerOrAdmin: setUser, requireAdmin: setUser };
  require('../routes/service_areas')(app, pool, mw);

  const server = app.listen(0);
  await new Promise((r) => server.on('listening', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (method, path, body) => {
    const res = await fetch(base + path, {
      method,
      headers: { 'content-type': 'application/json' },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    let json = null; try { json = await res.json(); } catch {}
    return { status: res.status, json };
  };
  const areaFinalized = async (id) =>
    (await pool.query('SELECT build_finalized_at FROM service_areas WHERE id = $1', [id])).rows[0].build_finalized_at;

  let clientId, saId;
  try {
    clientId = (await pool.query(`INSERT INTO clients (name) VALUES ($1) RETURNING id`, ['ZZ_TEST_SA_WRITEPATH'])).rows[0].id;

    let r = await call('POST', '/api/service-areas', { client_id: clientId, name: 'WP Test Area' });
    assert.equal(r.status, 201, 'create SA');
    saId = r.json.id;
    assert.equal(r.json.client_visible_metrics.construction_cost, false, 'construction-cost tile hidden by default');
    assert.equal(r.json.client_visible_metrics.engineering_cost, true, 'engineering-cost tile visible by default');

    r = await call('POST', `/api/service-areas/${saId}/routes`, { name: 'Route A' });
    assert.equal(r.status, 201, 'create route');
    const routeId = r.json.id;

    r = await call('POST', `/api/service-areas/${saId}/jobs`, { team: 'construction', route_id: routeId, billing_type: 'fixed', estimated_amount: 1000 });
    assert.equal(r.status, 201, 'create construction job');
    assert.equal(r.json.cost_category, 'construction', 'construction discipline → construction cost');
    assert.equal(r.json.route_id, routeId, 'job carries route_id');
    const jobId = r.json.id;

    r = await call('POST', `/api/service-areas/${saId}/jobs`, { team: 'design', rate: 110 });
    assert.equal(r.json.cost_category, 'engineering', 'design discipline → engineering cost');

    // changing discipline re-tags the cost bucket
    r = await call('PUT', `/api/service-area-jobs/${jobId}`, { team: 'design' });
    assert.equal(r.json.cost_category, 'engineering', 'team change re-tags cost_category');

    r = await call('POST', `/api/service-areas/${saId}/materials`, { item: 'Splice closure', quantity: 2, unit: 'ea', unit_cost: 320, route_id: routeId, source: 'map' });
    assert.equal(r.status, 201, 'create material');
    const matId = r.json.id;

    r = await call('POST', `/api/service-area-materials/${matId}/units`, { status: 'installed' });
    assert.equal(r.status, 201, 'add installed unit');
    assert.equal(Number(r.json.material.completed_quantity), 1, 'completed rolls to 1');
    assert.ok(r.json.unit.installed_date, 'installed unit auto-stamps a date');

    r = await call('POST', `/api/service-area-materials/${matId}/units`, { status: 'pending' });
    assert.equal(Number(r.json.material.completed_quantity), 1, 'pending unit does not count');
    const pendingUnitId = r.json.unit.id;

    r = await call('PUT', `/api/service-area-material-units/${pendingUnitId}`, { status: 'installed' });
    assert.equal(Number(r.json.material.completed_quantity), 2, 'installing the unit rolls completed to 2');

    // finalize the only route → area rolls up to finalized
    r = await call('POST', `/api/service-area-routes/${routeId}/finalize`, {});
    assert.equal(r.status, 200, 'finalize route');
    assert.ok(r.json.build_finalized_at, 'route finalized');
    assert.equal(r.json.status, 'complete', 'route status → complete');
    assert.ok(await areaFinalized(saId), 'area finalized once every route is');

    r = await call('POST', `/api/service-area-routes/${routeId}/finalize`, { finalized: false });
    assert.equal(r.json.build_finalized_at, null, 'route reopened');
    assert.equal(await areaFinalized(saId), null, 'area reopened when a route reopens');

    r = await call('PUT', `/api/service-areas/${saId}`, { client_visible_metrics: { progress: true, engineering_cost: true, construction_cost: true, total_cost: false } });
    assert.equal(r.json.client_visible_metrics.construction_cost, true, 'tile visibility updates');
    assert.equal(r.json.client_visible_metrics.total_cost, false, 'tile visibility updates');
  } finally {
    if (clientId) { try { await pool.query('DELETE FROM clients WHERE id = $1', [clientId]); } catch {} }
    await new Promise((r) => server.close(r));
    await pool.end();
  }
});
