// Integration test for the Projects-tab rollup (routes/projects_tree.js):
// Client → EC → CC → SA → Route → project(permit/design job) nests correctly,
// and a contract-less SA sits directly under the client. Skips with no
// DATABASE_URL. Requires migrations 0073 (budget_code_id n/a here) + 0074.

const { test } = require('node:test');
const assert = require('node:assert');
const express = require('express');
const { Pool } = require('pg');

const DB = process.env.DATABASE_URL;

test('projects-tree: client → EC → CC → SA → route → project nests; contract-less SA under client', { skip: DB ? false : 'no DATABASE_URL' }, async () => {
  const pool = new Pool({ connectionString: DB, ssl: false });
  const app = express();
  const setUser = (req, _res, next) => { req.user = { id: null, role: 'admin' }; next(); };
  require('../routes/projects_tree')(app, pool, { requireManagerOrAdmin: setUser });
  const server = app.listen(0);
  await new Promise((r) => server.on('listening', r));
  const base = `http://127.0.0.1:${server.address().port}`;

  let clientId, ecId, ccId, saId, sa2Id, routeId, permitJob, designJob;
  try {
    clientId = (await pool.query(`INSERT INTO clients (name) VALUES ($1) RETURNING id`, ['ZZ_TREE'])).rows[0].id;
    ecId = (await pool.query(`INSERT INTO engineering_contracts (client_id,name,program) VALUES ($1,'ZZ Tree EC','rus') RETURNING id`, [clientId])).rows[0].id;
    ccId = (await pool.query(`INSERT INTO construction_contracts (client_id,engineering_contract_id,name) VALUES ($1,$2,'ZZ Tree CC') RETURNING id`, [clientId, ecId])).rows[0].id;
    saId = (await pool.query(`INSERT INTO service_areas (client_id,engineering_contract_id,construction_contract_id,name,program,status) VALUES ($1,$2,$3,'Tree SA','rus','active') RETURNING id`, [clientId, ecId, ccId])).rows[0].id;
    routeId = (await pool.query(`INSERT INTO service_area_routes (service_area_id,name) VALUES ($1,'Tree Route') RETURNING id`, [saId])).rows[0].id;
    permitJob = (await pool.query(`INSERT INTO service_area_jobs (service_area_id,route_id,team,billing_type,status) VALUES ($1,$2,'permitting','footage','started') RETURNING id`, [saId, routeId])).rows[0].id;
    designJob = (await pool.query(`INSERT INTO service_area_jobs (service_area_id,team,billing_type,status) VALUES ($1,'design','footage','started') RETURNING id`, [saId])).rows[0].id;
    // contract-less SA (the "town") directly under the client
    sa2Id = (await pool.query(`INSERT INTO service_areas (client_id,name,program,status) VALUES ($1,'Town SA','bau','active') RETURNING id`, [clientId])).rows[0].id;

    const tree = await (await fetch(base + '/api/projects-tree')).json();
    const client = tree.find((c) => c.id === clientId);
    assert.ok(client, 'client present');
    const ec = client.children.find((n) => n.id === ecId && n.type === 'ec');
    assert.ok(ec, 'EC under client');
    const cc = ec.children.find((n) => n.id === ccId && n.type === 'cc');
    assert.ok(cc, 'CC under EC');
    const sa = cc.children.find((n) => n.id === saId && n.type === 'sa');
    assert.ok(sa, 'SA under CC');
    const route = sa.children.find((n) => n.id === routeId && n.type === 'route');
    assert.ok(route, 'route under SA');
    assert.ok(route.children.find((n) => n.id === permitJob && n.type === 'project'), 'permit project under route');
    assert.ok(sa.children.find((n) => n.id === designJob && n.type === 'project'), 'SA-level design project under SA');
    // contract-less SA sits directly under the client
    assert.ok(client.children.find((n) => n.id === sa2Id && n.type === 'sa'), 'contract-less SA directly under client');
  } finally {
    if (saId) await pool.query(`DELETE FROM service_area_jobs WHERE service_area_id=$1`, [saId]).catch(() => {});
    if (routeId) await pool.query(`DELETE FROM service_area_routes WHERE id=$1`, [routeId]).catch(() => {});
    if (saId) await pool.query(`DELETE FROM service_areas WHERE id=$1`, [saId]).catch(() => {});
    if (sa2Id) await pool.query(`DELETE FROM service_areas WHERE id=$1`, [sa2Id]).catch(() => {});
    if (ccId) await pool.query(`DELETE FROM construction_contracts WHERE id=$1`, [ccId]).catch(() => {});
    if (ecId) await pool.query(`DELETE FROM engineering_contracts WHERE id=$1`, [ecId]).catch(() => {});
    if (clientId) await pool.query(`DELETE FROM clients WHERE id=$1`, [clientId]).catch(() => {});
    server.close();
    await pool.end();
  }
});
