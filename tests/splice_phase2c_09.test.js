// Smoke tests for Splice Matrix Phase 2C #9 — passive optical splitters.
//
// Endpoints under test:
//   POST   /api/splice/closures/:id/splitters
//   GET    /api/splice/projects/:id/splitters
//   PUT    /api/splice/splitters/:id
//   DELETE /api/splice/splitters/:id
//   PUT    /api/splice/splitter-outputs/:id
//
// Plus hydrate inclusion + validation rules.

'use strict';

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const {
  bootTestServer, close, adminLogin, requestJson, request, pool, uniqueTag,
} = require('./_helpers');

let token;
const createdSpliceProjectIds = [];

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
    } catch (e) { console.warn('[phase2c09-cleanup]', e.message); }
  }
  await close();
});

// ─── Fixture helpers ──────────────────────────────────────────────────────

async function makeProjectWithClosure(label, fiberCount = 12) {
  const proj = await requestJson('POST', '/api/splice/projects', {
    token, body: { name: uniqueTag(label || 'phase2c09') },
  });
  createdSpliceProjectIds.push(proj.id);
  const loc = await requestJson('POST', `/api/splice/projects/${proj.id}/locations`, {
    token, body: { name: 'L' },
  });
  const cable = await requestJson('POST', `/api/splice/projects/${proj.id}/cables`, {
    token, body: { name: 'A', fiber_count: fiberCount, construction_type: 'ribbon' },
  });
  const closure = await requestJson('POST', `/api/splice/locations/${loc.id}/closures`, {
    token, body: { model: 'FOSC-PON', tray_count: 6, tray_capacity: 12 },
  });
  return { proj, locId: loc.id, closureId: closure.closure.id, cableId: cable.cable.id };
}

async function fibersOfCable(projId, cableId) {
  const h = await requestJson('GET', `/api/splice/projects/${projId}`, { token });
  return h.fibers
    .filter(f => h.buffer_tubes.find(t => t.id === f.buffer_tube_id && t.cable_id === cableId))
    .sort((a, b) => a.position - b.position);
}

// ─── Tests ────────────────────────────────────────────────────────────────

test('POST /closures/:id/splitters creates splitter + N output rows', async () => {
  const { closureId, proj } = await makeProjectWithClosure('splitter-create');
  const r = await requestJson('POST', `/api/splice/closures/${closureId}/splitters`, {
    token, body: { ratio: '1x4' },
  });
  assert.ok(r.splitter?.id);
  assert.equal(r.splitter.ratio, '1x4');
  assert.equal(r.outputs.length, 4);
  // Output positions are 1..4, in order.
  for (let i = 0; i < 4; i++) {
    assert.equal(r.outputs[i].position, i + 1);
    assert.equal(r.outputs[i].output_fiber_id, null);
  }
  // Hydrate includes the splitter + outputs.
  const h = await requestJson('GET', `/api/splice/projects/${proj.id}`, { token });
  assert.ok(Array.isArray(h.splitters));
  assert.ok(Array.isArray(h.splitter_outputs));
  assert.equal(h.splitters.length, 1);
  assert.equal(h.splitter_outputs.length, 4);
});

test('POST rejects non-canonical ratio values', async () => {
  const { closureId } = await makeProjectWithClosure('splitter-bad-ratio');
  const r = await request('POST', `/api/splice/closures/${closureId}/splitters`, {
    token, body: { ratio: '1x99' },
  });
  assert.notEqual(r.status, 200);
});

test('PUT splitter ratio change regenerates output rows', async () => {
  const { closureId, proj } = await makeProjectWithClosure('splitter-resize');
  const created = await requestJson('POST', `/api/splice/closures/${closureId}/splitters`, {
    token, body: { ratio: '1x2' },
  });
  // Bump to 1x8.
  await requestJson('PUT', `/api/splice/splitters/${created.splitter.id}`, {
    token, body: { ratio: '1x8' },
  });
  const h = await requestJson('GET', `/api/splice/projects/${proj.id}`, { token });
  const outputsForThis = h.splitter_outputs.filter(o => o.splitter_id === created.splitter.id);
  assert.equal(outputsForThis.length, 8);
});

test('PUT splitter shrink with wired outputs returns 409', async () => {
  const { closureId, proj, cableId } = await makeProjectWithClosure('splitter-shrink-blocked');
  const created = await requestJson('POST', `/api/splice/closures/${closureId}/splitters`, {
    token, body: { ratio: '1x4' },
  });
  // Wire the 4th output to a real fiber.
  const fibers = await fibersOfCable(proj.id, cableId);
  const out4 = created.outputs.find(o => o.position === 4);
  await requestJson('PUT', `/api/splice/splitter-outputs/${out4.id}`, {
    token, body: { output_fiber_id: fibers[0].id },
  });
  // Try to shrink to 1x2 — would orphan output #4. Server must refuse.
  const r = await request('PUT', `/api/splice/splitters/${created.splitter.id}`, {
    token, body: { ratio: '1x2' },
  });
  assert.equal(r.status, 409);
});

test('PUT /splitter-outputs/:id wires and unwires an output', async () => {
  const { closureId, proj, cableId } = await makeProjectWithClosure('splitter-wire');
  const created = await requestJson('POST', `/api/splice/closures/${closureId}/splitters`, {
    token, body: { ratio: '1x2' },
  });
  const fibers = await fibersOfCable(proj.id, cableId);
  const o1 = created.outputs[0];
  // Wire.
  const wired = await requestJson('PUT', `/api/splice/splitter-outputs/${o1.id}`, {
    token, body: { output_fiber_id: fibers[0].id },
  });
  assert.equal(wired.output_fiber_id, fibers[0].id);
  // Unwire by setting null.
  const unwired = await requestJson('PUT', `/api/splice/splitter-outputs/${o1.id}`, {
    token, body: { output_fiber_id: null },
  });
  assert.equal(unwired.output_fiber_id, null);
});

test('DELETE splitter cascades to outputs', async () => {
  const { closureId, proj } = await makeProjectWithClosure('splitter-delete');
  const created = await requestJson('POST', `/api/splice/closures/${closureId}/splitters`, {
    token, body: { ratio: '1x4' },
  });
  await requestJson('DELETE', `/api/splice/splitters/${created.splitter.id}`, { token });
  const h = await requestJson('GET', `/api/splice/projects/${proj.id}`, { token });
  // Splitter row gone; output rows cascade-removed by FK.
  assert.equal(h.splitters.find(s => s.id === created.splitter.id), undefined);
  const orphans = h.splitter_outputs.filter(o => o.splitter_id === created.splitter.id);
  assert.equal(orphans.length, 0);
});

test('Validation: splitter input fiber double-driven flags an error', async () => {
  const { closureId, proj, cableId } = await makeProjectWithClosure('splitter-double-drive');
  const fibers = await fibersOfCable(proj.id, cableId);
  // Two splitters, both fed by the same fiber. Second create succeeds
  // (the schema doesn't UNIQUE input_fiber_id) but validation flags it.
  await requestJson('POST', `/api/splice/closures/${closureId}/splitters`, {
    token, body: { ratio: '1x2', input_fiber_id: fibers[0].id },
  });
  await requestJson('POST', `/api/splice/closures/${closureId}/splitters`, {
    token, body: { ratio: '1x4', input_fiber_id: fibers[0].id },
  });
  const h = await requestJson('GET', `/api/splice/projects/${proj.id}`, { token });
  assert.ok(h.validation, 'hydrate should include validation');
  const errs = h.validation.errors || [];
  // Either a dedicated 'splitter input double-driven' rule or a more
  // general 'fiber referenced by multiple splitters' rule is fine —
  // assert at least one error mentions the splitter input.
  assert.ok(
    errs.some(e => /splitter|input/i.test(e.message || e.code || '')),
    `expected a splitter-input error; got: ${JSON.stringify(errs)}`
  );
});

test('Validation: unwired splitter is a warning, not blocking', async () => {
  const { closureId, proj } = await makeProjectWithClosure('splitter-unwired');
  await requestJson('POST', `/api/splice/closures/${closureId}/splitters`, {
    token, body: { ratio: '1x2' }, // no input_fiber_id, no output wires
  });
  const h = await requestJson('GET', `/api/splice/projects/${proj.id}`, { token });
  const warns = h.validation.warnings || [];
  assert.ok(
    warns.some(w => /splitter|unwired|input/i.test(w.message || w.code || '')),
    `expected an unwired-splitter warning; got: ${JSON.stringify(warns)}`
  );
  // Warnings don't block PDF export — `summary.blocked` is the gate.
  assert.equal(h.validation.summary.blocked, false,
    'unwired-splitter warnings should not block export');
});
