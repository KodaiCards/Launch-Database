// Phase C: keystone project documents (a project = a service_area_job).
// Upload a PDF to an engineering project, list it, retag status, delete it.
// Non-engineering project is rejected. Skips with no DATABASE_URL. Migration 0077.

const { test } = require('node:test');
const assert = require('node:assert');
const express = require('express');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { Pool } = require('pg');

const DB = process.env.DATABASE_URL;

test('keystone documents: upload PDF to engineering project, list, retag, delete; reject construction', { skip: DB ? false : 'no DATABASE_URL' }, async () => {
  const pool = new Pool({ connectionString: DB, ssl: false });
  const uploadDir = fs.mkdtempSync(path.join(os.tmpdir(), 'lfsdocs-'));
  const app = express();
  app.use(express.json());
  const requireAuth = () => (req, _res, next) => { req.user = { id: null, role: 'admin' }; next(); };
  const requireAdmin = (req, _res, next) => { req.user = { id: null, role: 'admin' }; next(); };
  require('../routes/project_documents')(app, pool, { uploadDir, requireAuth, requireAdmin });
  const server = app.listen(0);
  await new Promise((r) => server.on('listening', r));
  const base = `http://127.0.0.1:${server.address().port}`;

  let clientId, saId, engJobId, constrJobId, docId;
  try {
    clientId = (await pool.query(`INSERT INTO clients (name) VALUES ($1) RETURNING id`, ['ZZ_DOCS'])).rows[0].id;
    saId = (await pool.query(`INSERT INTO service_areas (client_id,name,program,status) VALUES ($1,'Docs Area','bau','active') RETURNING id`, [clientId])).rows[0].id;
    engJobId = (await pool.query(`INSERT INTO service_area_jobs (service_area_id,team,billing_type,cost_category) VALUES ($1,'permitting','footage','engineering') RETURNING id`, [saId])).rows[0].id;
    constrJobId = (await pool.query(`INSERT INTO service_area_jobs (service_area_id,team,billing_type,cost_category) VALUES ($1,'construction','fixed','construction') RETURNING id`, [saId])).rows[0].id;

    // Minimal valid PDF (starts with %PDF- magic bytes).
    const pdf = Buffer.from('%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF', 'latin1');

    const upload = async (jobId, docType, status) => {
      const fd = new FormData();
      fd.set('file', new Blob([pdf], { type: 'application/pdf' }), 'final.pdf');
      fd.set('doc_type', docType);
      if (status) fd.set('status', status);
      const r = await fetch(`${base}/api/service-area-jobs/${jobId}/documents`, { method: 'POST', body: fd });
      return { status: r.status, json: await r.json() };
    };

    // engineering job → accepted
    const up = await upload(engJobId, 'final_pdf', 'final');
    assert.equal(up.status, 200, 'upload to engineering project accepted');
    docId = up.json.id;
    assert.equal(up.json.doc_type, 'final_pdf');
    assert.equal(up.json.status, 'final');
    assert.equal(up.json.service_area_job_id, engJobId);
    assert.ok(fs.existsSync(path.join(uploadDir, up.json.file_path)), 'file landed on disk');

    // construction job → rejected (engineering only)
    const upC = await upload(constrJobId, 'final_pdf', null);
    assert.equal(upC.status, 400, 'construction project rejects documents');

    // list
    const list = await (await fetch(`${base}/api/service-area-jobs/${engJobId}/documents`)).json();
    assert.equal(list.length, 1, 'one document listed');
    assert.equal(list[0].id, docId);

    // retag status
    const patch = await fetch(`${base}/api/service-area-job-documents/${docId}`, {
      method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ status: 'approved' }) });
    const patched = await patch.json();
    assert.equal(patched.status, 'approved', 'status retagged');

    // delete → file gone
    const del = await fetch(`${base}/api/service-area-job-documents/${docId}`, { method: 'DELETE' });
    assert.equal(del.status, 200);
    assert.equal(fs.existsSync(path.join(uploadDir, up.json.file_path)), false, 'file removed from disk');
    const list2 = await (await fetch(`${base}/api/service-area-jobs/${engJobId}/documents`)).json();
    assert.equal(list2.length, 0, 'document removed from list');
  } finally {
    if (saId) await pool.query(`DELETE FROM permit_documents WHERE service_area_job_id IN (SELECT id FROM service_area_jobs WHERE service_area_id=$1)`, [saId]).catch(() => {});
    if (saId) await pool.query(`DELETE FROM service_area_jobs WHERE service_area_id=$1`, [saId]).catch(() => {});
    if (saId) await pool.query(`DELETE FROM service_areas WHERE id=$1`, [saId]).catch(() => {});
    if (clientId) await pool.query(`DELETE FROM clients WHERE id=$1`, [clientId]).catch(() => {});
    try { fs.rmSync(uploadDir, { recursive: true, force: true }); } catch (_) {}
    server.close();
    await pool.end();
  }
});
