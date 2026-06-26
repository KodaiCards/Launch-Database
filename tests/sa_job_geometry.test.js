// Phase B backend: a project (service_area_job) can be created with a drawn line
// geometry + footage/miles, and the geometry can be re-drawn (updated). Skips with
// no DATABASE_URL. Requires migration 0075.

const { test } = require('node:test');
const assert = require('node:assert');
const express = require('express');
const { Pool } = require('pg');

const DB = process.env.DATABASE_URL;

test('sa-job: create with geometry + footage/miles, then re-draw (update geometry)', { skip: DB ? false : 'no DATABASE_URL' }, async () => {
  const pool = new Pool({ connectionString: DB, ssl: false });
  const app = express();
  app.use(express.json());
  const setUser = (req, _res, next) => { req.user = { id: null, role: 'admin' }; next(); };
  require('../routes/service_areas')(app, pool, { requireManagerOrAdmin: setUser, requireAdmin: setUser, requireAuth: () => setUser });
  const server = app.listen(0);
  await new Promise((r) => server.on('listening', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (m, p, b) => { const r = await fetch(base + p, { method: m, headers: { 'content-type': 'application/json' }, body: b !== undefined ? JSON.stringify(b) : undefined }); return { status: r.status, json: await r.json() }; };

  let clientId, saId, jobId;
  try {
    clientId = (await pool.query(`INSERT INTO clients (name) VALUES ($1) RETURNING id`, ['ZZ_GEOM'])).rows[0].id;
    saId = (await pool.query(`INSERT INTO service_areas (client_id,name,program,status) VALUES ($1,'Geom Area','bau','active') RETURNING id`, [clientId])).rows[0].id;

    const line = [[32.840, -83.630], [32.845, -83.625], [32.848, -83.620]];
    const r = await call('POST', `/api/service-areas/${saId}/jobs`, {
      team: 'permitting', billing_type: 'footage', footage: 1320, miles: 0.25, geometry: line });
    assert.equal(r.status, 201);
    jobId = r.json.id;
    assert.deepEqual(r.json.geometry, line, 'drawn line stored on the project');
    assert.equal(Number(r.json.footage), 1320, 'footage autofilled');
    assert.equal(Number(r.json.miles), 0.25, 'miles autofilled');

    // re-draw the line
    const line2 = [[32.84, -83.63], [32.86, -83.61]];
    const u = await call('PUT', `/api/service-area-jobs/${jobId}`, { geometry: line2 });
    assert.equal(u.status, 200);
    assert.deepEqual(u.json.geometry, line2, 'geometry re-drawn (updated)');

    // clearing geometry → null ("No location")
    const c = await call('PUT', `/api/service-area-jobs/${jobId}`, { geometry: null });
    assert.equal(c.json.geometry, null, 'geometry cleared to null');
  } finally {
    if (saId) await pool.query(`DELETE FROM service_area_jobs WHERE service_area_id=$1`, [saId]).catch(() => {});
    if (saId) await pool.query(`DELETE FROM service_areas WHERE id=$1`, [saId]).catch(() => {});
    if (clientId) await pool.query(`DELETE FROM clients WHERE id=$1`, [clientId]).catch(() => {});
    server.close();
    await pool.end();
  }
});
