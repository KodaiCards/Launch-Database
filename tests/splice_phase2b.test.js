// Smoke tests for the Splice Matrix Phase 2B endpoints:
//
//   #5 — closure templates + project clone
//   #6 — version snapshots + diff JSON
//   #7 — public field-markup tokens + upload + image fetch
//
// Mirrors tests/splice.test.js shape (boot the server once, lean on
// the admin token, clean up by splice_projects.id with CASCADE).
// Splice tables are NOT in cleanupAll() so this file does its own
// best-effort sweep in `after`.

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const {
  bootTestServer, close, adminLogin, requestJson, request, pool, baseUrl,
} = require('./_helpers');

let token;
const createdSpliceProjectIds = [];
const createdTemplateIds = [];

before(async () => {
  await bootTestServer();
  token = await adminLogin();
});

after(async () => {
  if (createdSpliceProjectIds.length) {
    try {
      await pool.query(
        `DELETE FROM splice_projects WHERE id = ANY($1::uuid[])`,
        [createdSpliceProjectIds]
      );
    } catch (e) { console.warn('[splice2b-cleanup-projects]', e.message); }
  }
  if (createdTemplateIds.length) {
    try {
      await pool.query(
        `DELETE FROM splice_closure_templates WHERE id = ANY($1::uuid[])`,
        [createdTemplateIds]
      );
    } catch (e) { console.warn('[splice2b-cleanup-templates]', e.message); }
  }
  await close();
});

async function makeProject(name) {
  const proj = await requestJson('POST', '/api/splice/projects', {
    token, body: { name }, expectStatus: 200,
  });
  createdSpliceProjectIds.push(proj.id);
  return proj;
}

async function seedSmallProject(label) {
  // 24-fiber ribbon cable A, 24-fiber ribbon cable B, one closure with
  // 6 trays of 12, two single splices in tray 1. Enough surface area
  // to verify clone + diff exercise every entity type.
  const proj = await makeProject(label);
  const loc = await requestJson('POST', `/api/splice/projects/${proj.id}/locations`, {
    token, body: { name: 'Loc-1' },
  });
  const cableA = await requestJson('POST', `/api/splice/projects/${proj.id}/cables`, {
    token, body: { name: 'A', fiber_count: 24, construction_type: 'ribbon' },
  });
  const cableB = await requestJson('POST', `/api/splice/projects/${proj.id}/cables`, {
    token, body: { name: 'B', fiber_count: 24, construction_type: 'ribbon' },
  });
  const closure = await requestJson('POST', `/api/splice/locations/${loc.id}/closures`, {
    token, body: { model: 'FOSC-450', tray_count: 6, tray_capacity: 12 },
  });
  const tray1 = closure.trays.find(t => t.position === 1);
  const hydrate = await requestJson('GET', `/api/splice/projects/${proj.id}`, { token });
  const aFibers = hydrate.fibers
    .filter(f => hydrate.buffer_tubes.find(t => t.id === f.buffer_tube_id && t.cable_id === cableA.cable.id))
    .sort((a, b) => a.position - b.position);
  const bFibers = hydrate.fibers
    .filter(f => hydrate.buffer_tubes.find(t => t.id === f.buffer_tube_id && t.cable_id === cableB.cable.id))
    .sort((a, b) => a.position - b.position);
  await requestJson('POST', `/api/splice/trays/${tray1.id}/splices`, {
    token, body: { fiber_a_id: aFibers[0].id, fiber_b_id: bFibers[0].id },
  });
  await requestJson('POST', `/api/splice/trays/${tray1.id}/splices`, {
    token, body: { fiber_a_id: aFibers[1].id, fiber_b_id: bFibers[1].id },
  });
  return { proj, locId: loc.id, closureId: closure.closure.id, tray1Id: tray1.id };
}

// ─── Phase 2B #5 — templates + clone ────────────────────────────────────

test('closure templates: create / list / delete', async () => {
  const tpl = await requestJson('POST', '/api/splice/closure-templates', {
    token,
    body: { name: 'test-tpl-' + Date.now(), model: 'FOSC-450', tray_count: 4, tray_capacity: 12 },
  });
  createdTemplateIds.push(tpl.id);
  assert.ok(tpl.id);
  assert.equal(tpl.tray_count, 4);

  const list = await requestJson('GET', '/api/splice/closure-templates', { token });
  assert.ok(list.find(t => t.id === tpl.id), 'template should appear in list');

  const del = await request('DELETE', '/api/splice/closure-templates/' + tpl.id, { token });
  assert.equal(del.status, 200);
  // Drop from the cleanup list since we already removed it.
  const idx = createdTemplateIds.indexOf(tpl.id);
  if (idx >= 0) createdTemplateIds.splice(idx, 1);
});

test('apply template materializes closure + trays, bumps closure_models picklist', async () => {
  const proj = await makeProject('test-apply-tpl-' + Date.now());
  const loc = await requestJson('POST', `/api/splice/projects/${proj.id}/locations`, {
    token, body: { name: 'L' },
  });
  const tpl = await requestJson('POST', '/api/splice/closure-templates', {
    token,
    body: { name: 'apply-tpl-' + Date.now(), model: 'TestModel-' + Date.now(), tray_count: 3, tray_capacity: 12 },
  });
  createdTemplateIds.push(tpl.id);

  const applied = await requestJson('POST',
    `/api/splice/locations/${loc.id}/closures/from-template/${tpl.id}`,
    { token, body: {} });
  assert.ok(applied.closure?.id);
  assert.equal(applied.trays.length, 3);
  for (let i = 0; i < 3; i++) {
    assert.equal(applied.trays[i].position, i + 1);
  }
  // closure_models picklist should now contain the template's model name.
  const models = await requestJson('GET', '/api/splice/closure-models', { token });
  assert.ok(models.find(m => m.model === tpl.model), 'closure_models should record the template model');
});

test('project clone deep-copies locations, cables, fibers, closures, trays, splices', async () => {
  const { proj } = await seedSmallProject('test-clone-src-' + Date.now());
  const cloned = await requestJson('POST', `/api/splice/projects/${proj.id}/clone`, {
    token, body: { name: 'cloned-' + Date.now() },
  });
  createdSpliceProjectIds.push(cloned.project.id);
  assert.ok(cloned.project.id);
  assert.notEqual(cloned.project.id, proj.id, 'clone must be a new project');
  // Counts mirror the source.
  assert.equal(cloned.counts.locations, 1);
  assert.equal(cloned.counts.cables, 2);
  assert.equal(cloned.counts.fibers, 48);     // 24 + 24
  assert.equal(cloned.counts.closures, 1);
  assert.equal(cloned.counts.trays, 6);
  assert.equal(cloned.counts.splices, 2);
  // Hydrate the clone and verify shape.
  const h = await requestJson('GET', `/api/splice/projects/${cloned.project.id}`, { token });
  assert.equal(h.cables.length, 2);
  assert.equal(h.fibers.length, 48);
  assert.equal(h.splices.length, 2);
  // FK remap sanity: the clone's splices reference the clone's fibers,
  // not the source's.
  const cloneFiberIds = new Set(h.fibers.map(f => f.id));
  for (const s of h.splices) {
    assert.ok(cloneFiberIds.has(s.fiber_a_id), 'splice a-fiber must belong to clone');
    assert.ok(cloneFiberIds.has(s.fiber_b_id), 'splice b-fiber must belong to clone');
  }
});

// ─── Phase 2B #6 — version snapshots + diff ─────────────────────────────

test('version manual save records, then identical state skips on auto', async () => {
  const { proj } = await seedSmallProject('test-versions-' + Date.now());
  const v1 = await requestJson('POST', `/api/splice/projects/${proj.id}/versions`, {
    token, body: { label: 'rev-A' },
  });
  assert.ok(v1.id);
  assert.equal(v1.version_number, 1);
  assert.equal(v1.label, 'rev-A');

  // Auto-snapshot with no changes: server skips because (a) <10min
  // since v1 and (b) generation hash unchanged anyway.
  const auto = await requestJson('POST', `/api/splice/projects/${proj.id}/versions/auto`, {
    token, body: {},
  });
  assert.equal(auto.skipped, true);

  const list = await requestJson('GET', `/api/splice/projects/${proj.id}/versions`, { token });
  assert.equal(list.length, 1);
  assert.equal(list[0].version_number, 1);
});

test('diff vs current detects added splice', async () => {
  const { proj, tray1Id } = await seedSmallProject('test-diff-' + Date.now());
  // Snapshot at the seeded baseline.
  const v1 = await requestJson('POST', `/api/splice/projects/${proj.id}/versions`, {
    token, body: { label: 'baseline' },
  });
  // Add another splice so v1 ⇢ current shows one addition.
  const h = await requestJson('GET', `/api/splice/projects/${proj.id}`, { token });
  const aFiber = h.fibers.find(f => f.position === 3 &&
    h.buffer_tubes.find(t => t.id === f.buffer_tube_id && h.cables.find(c => c.id === t.cable_id && c.name === 'A')));
  const bFiber = h.fibers.find(f => f.position === 3 &&
    h.buffer_tubes.find(t => t.id === f.buffer_tube_id && h.cables.find(c => c.id === t.cable_id && c.name === 'B')));
  assert.ok(aFiber && bFiber, 'must locate fiber #3 on each cable');
  await requestJson('POST', `/api/splice/trays/${tray1Id}/splices`, {
    token, body: { fiber_a_id: aFiber.id, fiber_b_id: bFiber.id },
  });
  const diff = await requestJson('GET',
    `/api/splice/projects/${proj.id}/diff/${v1.version_number}/current`, { token });
  assert.equal(diff.diff.splices.added.length, 1, 'one added splice');
  assert.equal(diff.diff.splices.removed.length, 0);
});

// ─── Phase 2B #7 — field-markup tokens + upload ─────────────────────────

test('public token mint, public field page renders, upload + list', async () => {
  const { proj, closureId } = await seedSmallProject('test-field-' + Date.now());

  // Engineer mints a public token for the closure.
  const tok = await requestJson('POST',
    `/api/splice/closures/${closureId}/public-tokens`,
    { token, body: {} });
  assert.ok(tok.token);
  assert.equal(tok.closure_id, closureId);

  // Public GET (no auth) returns HTML with the closure metadata.
  const pageRes = await request('GET', `/splice/field/${tok.token}`);
  assert.equal(pageRes.status, 200);
  assert.match(pageRes.headers.get('content-type') || '', /text\/html/);
  const pageHtml = await pageRes.text();
  assert.match(pageHtml, /Splicer field markup/);
  assert.match(pageHtml, /FOSC-450/);

  // Public upload: tiny inline PNG via FormData.
  const PNG_1x1 = Buffer.from(
    '89504e470d0a1a0a0000000d4948445200000001000000010806000000' +
    '1f15c4890000000d49444154789c63f8cf00000003000100ed0bd2540000000049454e44ae426082',
    'hex'
  );
  const fd = new FormData();
  fd.set('splicer_name', 'Test Splicer');
  fd.set('notes', 'hello');
  fd.set('photo', new Blob([PNG_1x1], { type: 'image/png' }), 'tiny.png');
  // request() helper JSON-stringifies the body if it's a plain object,
  // so call fetch directly here for multipart.
  const upRes = await fetch(`${baseUrl()}/splice/field/${tok.token}/markup`, {
    method: 'POST',
    body: fd,
  });
  const upJson = await upRes.json();
  assert.equal(upRes.status, 200, 'upload: ' + JSON.stringify(upJson));
  assert.ok(upJson.markup_id);

  // Engineer-side list endpoint (auth) returns the markup metadata.
  const list = await requestJson('GET', `/api/splice/closures/${closureId}/markups`, { token });
  assert.equal(list.length, 1);
  assert.equal(list[0].splicer_name, 'Test Splicer');
  assert.equal(list[0].mime_type, 'image/png');
  assert.ok(list[0].byte_size > 0);

  // Engineer-side image-fetch endpoint returns the bytes.
  const imgRes = await request('GET', `/api/splice/markups/${list[0].id}/image`, { token });
  assert.equal(imgRes.status, 200);
  assert.equal(imgRes.headers.get('content-type'), 'image/png');
  const imgBytes = Buffer.from(await imgRes.arrayBuffer());
  assert.equal(imgBytes.length, PNG_1x1.length);

  // Public token-scoped image endpoint also serves it.
  const pubImgRes = await fetch(`${baseUrl()}/splice/field/${tok.token}/markups/${list[0].id}/image`);
  assert.equal(pubImgRes.status, 200);

  // Engineer can delete the markup.
  const del = await request('DELETE', `/api/splice/markups/${list[0].id}`, { token });
  assert.equal(del.status, 200);
  const after = await requestJson('GET', `/api/splice/closures/${closureId}/markups`, { token });
  assert.equal(after.length, 0);
});

test('public field link 404s on bogus token', async () => {
  const r = await request('GET', '/splice/field/this-token-does-not-exist');
  assert.equal(r.status, 404);
});

test('public upload rejects non-image MIME', async () => {
  const { closureId } = await seedSmallProject('test-field-mime-' + Date.now());
  const tok = await requestJson('POST',
    `/api/splice/closures/${closureId}/public-tokens`,
    { token, body: {} });
  const fd = new FormData();
  fd.set('photo', new Blob(['not-an-image'], { type: 'text/plain' }), 'evil.txt');
  const r = await fetch(`${baseUrl()}/splice/field/${tok.token}/markup`, {
    method: 'POST', body: fd,
  });
  // multer's fileFilter throws → caught by Express error handler → 4xx/5xx.
  // The exact status depends on the global error middleware; we only need
  // to confirm it didn't 200.
  assert.notEqual(r.status, 200);
});
