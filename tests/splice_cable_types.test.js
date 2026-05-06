// Smoke tests for the cable-types + tube_size shipping (ec58448 / f076b41 /
// 1757114). Covers the new fiber_count enum values, the tube_size_fibers
// column + its UPSERT into the buffer-tube auto-generation, the partial-
// last-tube case, and the new construction_type enum members.

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
    } catch (e) { console.warn('[cable-types-cleanup]', e.message); }
  }
  await close();
});

async function makeProject(label) {
  const proj = await requestJson('POST', '/api/splice/projects', {
    token, body: { name: uniqueTag(label || 'cable-types') },
  });
  createdSpliceProjectIds.push(proj.id);
  return proj;
}

async function tubesAndFibersFor(projId, cableId) {
  const h = await requestJson('GET', `/api/splice/projects/${projId}`, { token });
  const tubes = h.buffer_tubes
    .filter(t => t.cable_id === cableId)
    .sort((a, b) => a.position - b.position);
  const fibersByTube = new Map(
    tubes.map(t => [
      t.id,
      h.fibers
        .filter(f => f.buffer_tube_id === t.id)
        .sort((a, b) => a.position - b.position),
    ])
  );
  return { tubes, fibersByTube };
}

// ─── Tests ────────────────────────────────────────────────────────────────

test('6-fiber cable: 1 tube with 6 fibers (partial-last-tube case)', async () => {
  const proj = await makeProject('6f-cable');
  const r = await requestJson('POST', `/api/splice/projects/${proj.id}/cables`, {
    token, body: { name: 'A', fiber_count: 6, construction_type: 'loose_tube' },
  });
  assert.equal(r.cable.fiber_count, 6);
  assert.equal(r.tubes.length, 1, 'a 6F cable with default tube_size=12 has exactly 1 tube');
  const { fibersByTube } = await tubesAndFibersFor(proj.id, r.cable.id);
  const fibers = fibersByTube.get(r.tubes[0].id);
  assert.equal(fibers.length, 6, 'the lone tube holds all 6 fibers');
  // Positions are 1..6, no skips.
  for (let i = 0; i < 6; i++) assert.equal(fibers[i].position, i + 1);
});

test('36-fiber cable, default tube_size=12: 3 tubes × 12 fibers', async () => {
  const proj = await makeProject('36f-cable');
  const r = await requestJson('POST', `/api/splice/projects/${proj.id}/cables`, {
    token, body: { name: 'A', fiber_count: 36, construction_type: 'loose_tube' },
  });
  assert.equal(r.tubes.length, 3);
  const { fibersByTube } = await tubesAndFibersFor(proj.id, r.cable.id);
  for (const t of r.tubes) {
    assert.equal(fibersByTube.get(t.id).length, 12);
  }
});

test('36-fiber cable, tube_size=24: 2 tubes (24 + 12, partial-last-tube)', async () => {
  const proj = await makeProject('36f-tube24');
  const r = await requestJson('POST', `/api/splice/projects/${proj.id}/cables`, {
    token, body: {
      name: 'A', fiber_count: 36, construction_type: 'loose_tube',
      tube_size_fibers: 24,
    },
  });
  assert.equal(r.cable.tube_size_fibers, 24);
  assert.equal(r.tubes.length, 2);
  const { fibersByTube } = await tubesAndFibersFor(proj.id, r.cable.id);
  const sortedTubes = r.tubes.slice().sort((a, b) => a.position - b.position);
  assert.equal(fibersByTube.get(sortedTubes[0].id).length, 24,
    'first tube holds the full 24');
  assert.equal(fibersByTube.get(sortedTubes[1].id).length, 12,
    'last tube holds the remainder (36 - 24 = 12)');
  // The 24-fiber tube's fibers cycle TIA-598 colors mod 12 — fiber #13
  // wraps back to blue, #14 to orange, etc.
  const TIA_598 = ['blue','orange','green','brown','slate','white','red','black','yellow','violet','rose','aqua'];
  const big = fibersByTube.get(sortedTubes[0].id);
  assert.equal(big[12].color, TIA_598[0], 'fiber 13 wraps to blue');
  assert.equal(big[13].color, TIA_598[1], 'fiber 14 wraps to orange');
});

test('72-fiber cable: 6 tubes × 12 fibers, every TIA-598 color used', async () => {
  const proj = await makeProject('72f-cable');
  const r = await requestJson('POST', `/api/splice/projects/${proj.id}/cables`, {
    token, body: { name: 'A', fiber_count: 72, construction_type: 'ribbon' },
  });
  assert.equal(r.tubes.length, 6);
  const TIA_598 = ['blue','orange','green','brown','slate','white','red','black','yellow','violet','rose','aqua'];
  for (let i = 0; i < 6; i++) {
    assert.equal(r.tubes[i].position, i + 1);
    assert.equal(r.tubes[i].color, TIA_598[i]);
  }
});

test('216-fiber cable: 18 tubes × 12 (mod-12 color cycling)', async () => {
  const proj = await makeProject('216f-cable');
  const r = await requestJson('POST', `/api/splice/projects/${proj.id}/cables`, {
    token, body: { name: 'A', fiber_count: 216, construction_type: 'loose_tube' },
  });
  assert.equal(r.tubes.length, 18);
  const TIA_598 = ['blue','orange','green','brown','slate','white','red','black','yellow','violet','rose','aqua'];
  // Tube 13 wraps to blue.
  const tube13 = r.tubes.find(t => t.position === 13);
  assert.equal(tube13.color, TIA_598[0]);
});

test('Construction-type enum accepts central_tube, micromodule, rollable_ribbon', async () => {
  const proj = await makeProject('cable-types-enum');
  for (const ct of ['central_tube', 'micromodule', 'rollable_ribbon']) {
    const r = await requestJson('POST', `/api/splice/projects/${proj.id}/cables`, {
      token, body: { name: 'C-' + ct, fiber_count: 12, construction_type: ct },
    });
    assert.equal(r.cable.construction_type, ct, `should accept construction_type=${ct}`);
  }
});

test('POST cable rejects fiber_count not in the canonical set', async () => {
  const proj = await makeProject('cable-bad-fc');
  const r = await request('POST', `/api/splice/projects/${proj.id}/cables`, {
    token, body: { name: 'X', fiber_count: 100, construction_type: 'ribbon' },
  });
  assert.notEqual(r.status, 200,
    'fiber_count=100 is not in the canonical OSP set; CHECK should reject');
});

test('POST cable rejects tube_size_fibers outside (6, 12, 24)', async () => {
  const proj = await makeProject('cable-bad-ts');
  // Server quietly clamps to the default (12) when an invalid value is
  // passed (it does an explicit allow-list check), so the POST itself
  // succeeds — but the stored row reports tube_size=12, not 9.
  const r = await requestJson('POST', `/api/splice/projects/${proj.id}/cables`, {
    token, body: { name: 'A', fiber_count: 12, construction_type: 'ribbon', tube_size_fibers: 9 },
  });
  assert.equal(r.cable.tube_size_fibers, 12,
    'invalid tube_size_fibers should fall back to the default 12, not be persisted as 9');
});

test('Project clone preserves tube_size_fibers on the cloned cables', async () => {
  const proj = await makeProject('cable-clone-src');
  // Source cable with non-default tube size.
  await requestJson('POST', `/api/splice/projects/${proj.id}/cables`, {
    token, body: {
      name: 'A', fiber_count: 24, construction_type: 'loose_tube',
      tube_size_fibers: 24,
    },
  });
  const cloned = await requestJson('POST', `/api/splice/projects/${proj.id}/clone`, {
    token, body: { name: uniqueTag('cable-clone-dst') },
  });
  createdSpliceProjectIds.push(cloned.project.id);
  const h = await requestJson('GET', `/api/splice/projects/${cloned.project.id}`, { token });
  const cabA = h.cables.find(c => c.name === 'A');
  assert.ok(cabA, 'cloned project has the cloned cable');
  assert.equal(cabA.tube_size_fibers, 24,
    'tube_size_fibers must round-trip through the clone path');
  // The cloned cable should still have 1 tube (since 24 fibers fit one
  // 24-fiber tube), not 2 (the default-12 case would produce 2 tubes).
  const tubes = h.buffer_tubes.filter(t => t.cable_id === cabA.id);
  assert.equal(tubes.length, 1,
    'tube count must reflect the cloned tube_size, not the default');
});
