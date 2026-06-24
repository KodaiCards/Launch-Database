// Integration test for the map-integration POC (routes/map_integration.js):
// DB-backed window.storage, construction-contract cost catalog, and the estimate
// that prices a stored plan's map units (13 handholes → catalog → $). Skips with
// no DATABASE_URL. Requires migration 0069.

const { test } = require('node:test');
const assert = require('node:assert');
const express = require('express');
const { Pool } = require('pg');

const DB = process.env.DATABASE_URL;

test('map POC: store roundtrip + catalog pricing of map units', { skip: DB ? false : 'no DATABASE_URL' }, async () => {
  const pool = new Pool({ connectionString: DB, ssl: false });
  const app = express();
  app.use(express.json());
  const setUser = (req, _res, next) => { req.user = { id: null, role: 'admin' }; next(); };
  require('../routes/map_integration')(app, pool, { requireManagerOrAdmin: setUser });
  const server = app.listen(0);
  await new Promise((r) => server.on('listening', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (m, p, b) => {
    const r = await fetch(base + p, { method: m, headers: { 'content-type': 'application/json' }, body: b !== undefined ? JSON.stringify(b) : undefined });
    let j = null; try { j = await r.json(); } catch {}
    return { status: r.status, json: j };
  };

  const PLAN = 'pocplan_' + Date.now();
  let ccId;
  try {
    // ── 1. window.storage roundtrip ──
    await call('PUT', '/api/map/store/' + 'frm_map_v1', { value: JSON.stringify({ lat: 32.84, lng: -83.63, zoom: 12 }) });
    let g = await call('GET', '/api/map/store/frm_map_v1');
    assert.equal(g.status, 200);
    assert.ok(g.json && JSON.parse(g.json.value).zoom === 12, 'store roundtrips the value');

    // ── 2. construction contract + catalog (the uploaded Excel, as JSON here) ──
    let r = await call('POST', '/api/construction-contracts', { name: 'ZZ POC Build Contract' });
    assert.equal(r.status, 201); ccId = r.json.id;
    r = await call('POST', `/api/construction-contracts/${ccId}/catalog`, { items: [
      { item_key: 'Handhole', label: 'Handhole', unit: 'ea', unit_price: 200 },
      { item_key: 'pedestal', label: 'Pedestal', unit: 'ea', unit_price: 150 },
      { item_key: 'vault', label: 'Vault', unit: 'ea', unit_price: 500 },
    ] });
    assert.equal(r.json.count, 3, 'catalog stored 3 items');

    // ── 3. store a plan: 13 handholes (5 built) + 2 pedestals + 2 spans ──
    const pts = {};
    for (let i = 0; i < 13; i++) pts['hh_' + i] = { ptype: 'handhole', status: i < 5 ? 'asBuilt' : 'proposed' };
    pts['pd_1'] = { ptype: 'pedestal', status: 'proposed' };
    pts['pd_2'] = { ptype: 'pedestal', status: 'proposed' };
    await call('PUT', '/api/map/store/frm_pts_' + PLAN, { value: JSON.stringify(pts) });
    await call('PUT', '/api/map/store/frm_segs_' + PLAN, { value: JSON.stringify({
      s1: { lengthFt: 1000, status: 'proposed' }, s2: { lengthFt: 500, status: 'asBuilt' } }) });

    // ── 4. estimate: the chain ──
    const e = await call('GET', `/api/map/estimate?plan=${PLAN}&cc=${ccId}`);
    assert.equal(e.status, 200);
    assert.equal(e.json.construction_expected, 2900, '13×200 + 2×150 = 2900');
    assert.equal(e.json.construction_completed, 1000, '5 built handholes × 200 = 1000');
    assert.equal(e.json.construction_remaining, 1900);
    assert.equal(e.json.footage_total, 1500, 'span footage summed');
    const hh = e.json.structures.find((s) => s.item_key === 'handhole');
    assert.equal(hh.count, 13); assert.equal(hh.expected, 2600); assert.equal(hh.priced, true);
    assert.deepEqual(e.json.unpriced, [], 'all ptypes matched the catalog');
  } finally {
    await pool.query(`DELETE FROM map_store WHERE store_key LIKE $1`, ['frm_%' + PLAN]).catch(() => {});
    await pool.query(`DELETE FROM map_store WHERE store_key = 'frm_map_v1'`).catch(() => {});
    if (ccId) await pool.query(`DELETE FROM construction_contracts WHERE id = $1`, [ccId]).catch(() => {}); // cascades catalog
    server.close();
    await pool.end();
  }
});

test('map loop: per-SA rollup derives construction $ from the linked plan + CC', { skip: DB ? false : 'no DATABASE_URL' }, async () => {
  const pool = new Pool({ connectionString: DB, ssl: false });
  const app = express();
  app.use(express.json());
  const setUser = (req, _res, next) => { req.user = { id: null, role: 'admin' }; next(); };
  require('../routes/map_integration')(app, pool, { requireManagerOrAdmin: setUser });
  const server = app.listen(0);
  await new Promise((r) => server.on('listening', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (m, p, b) => {
    const r = await fetch(base + p, { method: m, headers: { 'content-type': 'application/json' }, body: b !== undefined ? JSON.stringify(b) : undefined });
    let j = null; try { j = await r.json(); } catch {}
    return { status: r.status, json: j };
  };

  const PLAN = 'looplan_' + Date.now();
  let clientId, ccId, saId;
  try {
    clientId = (await pool.query(`INSERT INTO clients (name) VALUES ($1) RETURNING id`, ['ZZ_MAP_LOOP'])).rows[0].id;
    ccId = (await call('POST', '/api/construction-contracts', { client_id: clientId, name: 'ZZ Loop CC' })).json.id;
    await call('POST', `/api/construction-contracts/${ccId}/catalog`, { items: [
      { item_key: 'handhole', label: 'Handhole', unit_price: 200 },
      { item_key: 'pedestal', label: 'Pedestal', unit_price: 150 },
    ] });
    saId = (await pool.query(
      `INSERT INTO service_areas (client_id, name, program, status, map_plan_id, construction_contract_id)
       VALUES ($1,'Loop Area','bau','active',$2,$3) RETURNING id`, [clientId, PLAN, ccId])).rows[0].id;

    // store the plan's structures (10 handholes + 4 pedestals)
    const pts = {};
    for (let i = 0; i < 10; i++) pts['hh_' + i] = { ptype: 'handhole', status: i < 3 ? 'asBuilt' : 'proposed' };
    for (let i = 0; i < 4; i++) pts['pd_' + i] = { ptype: 'pedestal', status: 'proposed' };
    await call('PUT', '/api/map/store/frm_pts_' + PLAN, { value: JSON.stringify(pts) });
    await call('PUT', '/api/map/store/frm_segs_' + PLAN, { value: JSON.stringify({ s1: { lengthFt: 2640 } }) });

    const r = await call('GET', `/api/service-areas/${saId}/map-rollup`);
    assert.equal(r.status, 200);
    assert.equal(r.json.linked, true, 'SA is linked to its map plan');
    assert.equal(r.json.construction_expected, 2600, '10×200 + 4×150 = 2600');
    assert.equal(r.json.construction_completed, 600, '3 built handholes × 200');
    assert.equal(r.json.footage_total, 2640);

    // an unlinked SA reports linked:false, not an error
    const sa2 = (await pool.query(`INSERT INTO service_areas (client_id,name,program,status) VALUES ($1,'Unlinked','bau','active') RETURNING id`, [clientId])).rows[0].id;
    const r2 = await call('GET', `/api/service-areas/${sa2}/map-rollup`);
    assert.equal(r2.json.linked, false, 'unlinked SA handled gracefully');
    await pool.query(`DELETE FROM service_areas WHERE id=$1`, [sa2]).catch(() => {});
  } finally {
    await pool.query(`DELETE FROM map_store WHERE store_key LIKE $1`, ['frm_%' + PLAN]).catch(() => {});
    if (saId) await pool.query(`DELETE FROM service_areas WHERE id=$1`, [saId]).catch(() => {});
    if (ccId) await pool.query(`DELETE FROM construction_contracts WHERE id=$1`, [ccId]).catch(() => {});
    if (clientId) await pool.query(`DELETE FROM clients WHERE id=$1`, [clientId]).catch(() => {});
    server.close();
    await pool.end();
  }
});
