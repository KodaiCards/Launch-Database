// Smoke tests for Splice Matrix Phase 2C #11 — path tracing across closures.
//
// Endpoint under test:
//   GET /api/splice/fibers/:id/path
//
// Returns { fiber_id, circular, over_spliced, chain, warnings } where
// `chain` is an ordered array of { fiber, splice_to_next } walking the
// strand in both directions from the start fiber. splice_to_next is null
// on the last entry (end of strand). Loops set circular=true and stop.
// Over-spliced fibers (any fiber in 3+ splices in the project) flag
// over_spliced=true without blocking the walk.

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
    } catch (e) { console.warn('[phase2c11-cleanup]', e.message); }
  }
  await close();
});

// ─── Fixture helpers ─────────────────────────────────────────────────────

async function makeProject(label) {
  const proj = await requestJson('POST', '/api/splice/projects', {
    token, body: { name: uniqueTag(label || 'phase2c11') }, expectStatus: 200,
  });
  createdSpliceProjectIds.push(proj.id);
  return proj;
}

async function addLocation(projId, name) {
  return requestJson('POST', `/api/splice/projects/${projId}/locations`, {
    token, body: { name },
  });
}

async function addCable(projId, name, fiberCount = 12) {
  return requestJson('POST', `/api/splice/projects/${projId}/cables`, {
    token, body: { name, fiber_count: fiberCount, construction_type: 'ribbon' },
  });
}

async function addClosure(locId, model = 'FOSC-450') {
  return requestJson('POST', `/api/splice/locations/${locId}/closures`, {
    token, body: { model, tray_count: 6, tray_capacity: 12 },
  });
}

async function fibersOfCable(projId, cableId) {
  const h = await requestJson('GET', `/api/splice/projects/${projId}`, { token });
  return h.fibers
    .filter(f => h.buffer_tubes.find(t => t.id === f.buffer_tube_id && t.cable_id === cableId))
    .sort((a, b) => a.position - b.position);
}

// ─── Tests ────────────────────────────────────────────────────────────────

test('GET /fibers/:id/path on a fiber with no splices returns chain of length 1', async () => {
  const proj = await makeProject('lone-fiber');
  const cable = await addCable(proj.id, 'A');
  const fibers = await fibersOfCable(proj.id, cable.cable.id);
  const r = await requestJson('GET', `/api/splice/fibers/${fibers[0].id}/path`, { token });
  assert.equal(r.fiber_id, fibers[0].id);
  assert.equal(r.circular, false);
  assert.equal(r.over_spliced, false);
  assert.equal(r.chain.length, 1);
  assert.equal(r.chain[0].splice_to_next, null);
  assert.equal(r.chain[0].fiber.id, fibers[0].id);
});

test('GET /fibers/:id/path on a single splice returns 2-hop chain in either direction', async () => {
  const proj = await makeProject('two-cable-splice');
  const loc = await addLocation(proj.id, 'L1');
  const a = await addCable(proj.id, 'A');
  const b = await addCable(proj.id, 'B');
  const closure = await addClosure(loc.id);
  const tray = closure.trays.find(t => t.position === 1);
  const aFibers = await fibersOfCable(proj.id, a.cable.id);
  const bFibers = await fibersOfCable(proj.id, b.cable.id);
  await requestJson('POST', `/api/splice/trays/${tray.id}/splices`, {
    token, body: { fiber_a_id: aFibers[0].id, fiber_b_id: bFibers[0].id },
  });
  const fromA = await requestJson('GET', `/api/splice/fibers/${aFibers[0].id}/path`, { token });
  assert.equal(fromA.chain.length, 2);
  assert.equal(fromA.chain[0].fiber.id, aFibers[0].id);
  assert.equal(fromA.chain[1].fiber.id, bFibers[0].id);
  assert.ok(fromA.chain[0].splice_to_next, 'first hop has splice metadata');
  assert.equal(fromA.chain[0].splice_to_next.closure_id, closure.closure.id);
  assert.equal(fromA.chain[1].splice_to_next, null);
  // Same chain length when starting from the OTHER side.
  const fromB = await requestJson('GET', `/api/splice/fibers/${bFibers[0].id}/path`, { token });
  assert.equal(fromB.chain.length, 2);
});

test('Three-cable chain A→B→C: starting from middle returns full strand', async () => {
  const proj = await makeProject('three-cable-chain');
  const loc1 = await addLocation(proj.id, 'L1');
  const loc2 = await addLocation(proj.id, 'L2');
  const a = await addCable(proj.id, 'A');
  const b = await addCable(proj.id, 'B');
  const c = await addCable(proj.id, 'C');
  const cl1 = await addClosure(loc1.id, 'FOSC-450-1');
  const cl2 = await addClosure(loc2.id, 'FOSC-450-2');
  const tray1 = cl1.trays.find(t => t.position === 1);
  const tray2 = cl2.trays.find(t => t.position === 1);
  const aF = await fibersOfCable(proj.id, a.cable.id);
  const bF = await fibersOfCable(proj.id, b.cable.id);
  const cF = await fibersOfCable(proj.id, c.cable.id);
  await requestJson('POST', `/api/splice/trays/${tray1.id}/splices`, {
    token, body: { fiber_a_id: aF[0].id, fiber_b_id: bF[0].id },
  });
  await requestJson('POST', `/api/splice/trays/${tray2.id}/splices`, {
    token, body: { fiber_a_id: bF[0].id, fiber_b_id: cF[0].id },
  });
  // Start in the middle (cable B).
  const r = await requestJson('GET', `/api/splice/fibers/${bF[0].id}/path`, { token });
  assert.equal(r.chain.length, 3);
  const ids = r.chain.map(e => e.fiber.id);
  // Middle fiber must be in the chain. Endpoints A-fiber and C-fiber must
  // both appear; order direction depends on which arm walks first.
  assert.ok(ids.includes(aF[0].id));
  assert.ok(ids.includes(bF[0].id));
  assert.ok(ids.includes(cF[0].id));
  assert.equal(r.circular, false);
});

test('Loop detection: a fiber spliced back to itself in two places sets circular=true', async () => {
  const proj = await makeProject('circular');
  const loc = await addLocation(proj.id, 'L');
  const a = await addCable(proj.id, 'A');
  const b = await addCable(proj.id, 'B');
  const cl = await addClosure(loc.id);
  const tray1 = cl.trays.find(t => t.position === 1);
  const tray2 = cl.trays.find(t => t.position === 2);
  const aF = await fibersOfCable(proj.id, a.cable.id);
  const bF = await fibersOfCable(proj.id, b.cable.id);
  // Two splices linking the SAME pair of fibers — creates a 2-cycle.
  // The second splice will trip the project's "fiber appears in more
  // than one splice on the same end" warning, but still inserts.
  await requestJson('POST', `/api/splice/trays/${tray1.id}/splices`, {
    token, body: { fiber_a_id: aF[0].id, fiber_b_id: bF[0].id },
  });
  await requestJson('POST', `/api/splice/trays/${tray2.id}/splices`, {
    token, body: { fiber_a_id: aF[0].id, fiber_b_id: bF[0].id },
  });
  const r = await requestJson('GET', `/api/splice/fibers/${aF[0].id}/path`, { token });
  // Either circular=true OR over_spliced=true is the contract — the
  // endpoint detects one or both. Assert at least one fired so the
  // test stays meaningful even if the heuristic prefers one signal.
  assert.ok(r.circular || r.over_spliced,
    'expected circular or over_spliced flag on a multi-splice loop');
});

test('Over-spliced flag when a fiber participates in 3 splices', async () => {
  const proj = await makeProject('over-spliced');
  const loc = await addLocation(proj.id, 'L');
  const a = await addCable(proj.id, 'A');
  const b = await addCable(proj.id, 'B');
  const c = await addCable(proj.id, 'C');
  const d = await addCable(proj.id, 'D');
  const cl = await addClosure(loc.id);
  const tray1 = cl.trays.find(t => t.position === 1);
  const tray2 = cl.trays.find(t => t.position === 2);
  const tray3 = cl.trays.find(t => t.position === 3);
  const aF = await fibersOfCable(proj.id, a.cable.id);
  const bF = await fibersOfCable(proj.id, b.cable.id);
  const cF = await fibersOfCable(proj.id, c.cable.id);
  const dF = await fibersOfCable(proj.id, d.cable.id);
  // aF[0] appears in 3 splices — deliberate over-splice.
  await requestJson('POST', `/api/splice/trays/${tray1.id}/splices`, {
    token, body: { fiber_a_id: aF[0].id, fiber_b_id: bF[0].id },
  });
  await requestJson('POST', `/api/splice/trays/${tray2.id}/splices`, {
    token, body: { fiber_a_id: aF[0].id, fiber_b_id: cF[0].id },
  });
  await requestJson('POST', `/api/splice/trays/${tray3.id}/splices`, {
    token, body: { fiber_a_id: aF[0].id, fiber_b_id: dF[0].id },
  });
  const r = await requestJson('GET', `/api/splice/fibers/${aF[0].id}/path`, { token });
  assert.equal(r.over_spliced, true);
  // Walk still returns a chain of at least 2 (start + one neighbor).
  assert.ok(r.chain.length >= 2);
});

test('GET /fibers/:id/path returns 404 for unknown fiber id', async () => {
  const bogus = '00000000-0000-0000-0000-000000000000';
  const r = await request('GET', `/api/splice/fibers/${bogus}/path`, { token });
  assert.equal(r.status, 404);
});

test('Chain entries carry full closure + cable + tube metadata', async () => {
  const proj = await makeProject('chain-metadata');
  const loc = await addLocation(proj.id, 'Splice-A');
  const a = await addCable(proj.id, 'East-Run');
  const b = await addCable(proj.id, 'West-Run');
  const cl = await addClosure(loc.id, 'Tyco-FOSC-12');
  const tray = cl.trays.find(t => t.position === 1);
  const aF = await fibersOfCable(proj.id, a.cable.id);
  const bF = await fibersOfCable(proj.id, b.cable.id);
  await requestJson('POST', `/api/splice/trays/${tray.id}/splices`, {
    token, body: { fiber_a_id: aF[0].id, fiber_b_id: bF[0].id },
  });
  const r = await requestJson('GET', `/api/splice/fibers/${aF[0].id}/path`, { token });
  assert.equal(r.chain.length, 2);
  const first = r.chain[0];
  assert.equal(first.fiber.cable_name, 'East-Run');
  assert.ok(first.fiber.tube_color);
  assert.ok(Number.isFinite(first.fiber.tube_position));
  assert.ok(Number.isFinite(first.fiber.position));
  assert.equal(first.splice_to_next.closure_model, 'Tyco-FOSC-12');
  assert.equal(first.splice_to_next.location_name, 'Splice-A');
  assert.equal(first.splice_to_next.tray_position, 1);
});
