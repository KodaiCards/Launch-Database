// Smoke tests for the Splice Matrix routes (Phase 1).
//
// Covers the non-obvious behaviors that would silently regress if the
// route module gets refactored:
//   - POST cable auto-generates fiber_count/12 buffer tubes + fiber_count
//     fibers, all in TIA-598 color order at the right positions
//   - Lock acquire / heartbeat / unlock / re-lock cycle
//   - Heartbeat refuses when the lock isn't held by the caller
//   - Ribbon splice creates 12 splices linked to one ribbon_group
//   - Tray capacity check refuses an over-capacity ribbon splice
//   - Closure-models picklist grows organically on every POST
//   - Full hydrate returns the assembled bundle (project + locations +
//     cables + tubes + fibers + closures + trays + splices + warnings)
//
// Splice tables are NOT in cleanupAll() so this file does its own
// best-effort sweep in `after` keyed on the splice_projects we created.
// CASCADE on splice_projects.id propagates to every descendant table.

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const {
  bootTestServer, close, adminLogin, requestJson, request, pool,
} = require('./_helpers');

const TIA_598 = ['blue','orange','green','brown','slate','white','red','black','yellow','violet','rose','aqua'];

let token;
const createdSpliceProjectIds = [];
let strangerStaffId = null;

before(async () => {
  await bootTestServer();
  token = await adminLogin();
  // The lock test simulates a second designer holding the lock by
  // shoving a different staff_id into splice_projects. The column is
  // a real FK to staff(id) so we can't fake it with a random UUID —
  // need a real row. Created here, cleaned up in after().
  const { rows } = await pool.query(
    `INSERT INTO staff (name, active) VALUES ($1, TRUE) RETURNING id`,
    ['splice-test-stranger-' + Date.now()]
  );
  strangerStaffId = rows[0].id;
});

after(async () => {
  // CASCADE handles trays, fibers, ribbon_groups, splices, etc. Empty
  // closure_models rows are harmless across runs and would only matter
  // if a future test asserts on the global picklist count.
  if (createdSpliceProjectIds.length) {
    try {
      await pool.query(
        `DELETE FROM splice_projects WHERE id = ANY($1::uuid[])`,
        [createdSpliceProjectIds]
      );
    } catch (e) { console.warn('[splice-cleanup]', e.message); }
  }
  if (strangerStaffId) {
    try { await pool.query(`DELETE FROM staff WHERE id = $1`, [strangerStaffId]); }
    catch (e) { console.warn('[splice-cleanup-staff]', e.message); }
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

test('POST /api/splice/projects creates a project owned by no one', async () => {
  const proj = await makeProject('test-create-' + Date.now());
  assert.ok(proj.id);
  assert.equal(proj.status, 'active');
  assert.equal(proj.locked_by_staff_id, null);
});

test('POST cable generates N/12 buffer tubes + N fibers in TIA-598 order', async () => {
  const proj = await makeProject('test-cable-' + Date.now());
  // 48 fibers → 4 tubes × 12 fibers each.
  const r = await requestJson('POST', `/api/splice/projects/${proj.id}/cables`, {
    token,
    body: {
      name: 'C-test', fiber_count: 48, construction_type: 'ribbon',
    },
  });
  assert.ok(r.cable.id);
  assert.equal(r.tubes.length, 4);
  // Tube colors should follow TIA-598 in order.
  for (let i = 0; i < 4; i++) {
    assert.equal(r.tubes[i].position, i + 1);
    assert.equal(r.tubes[i].color, TIA_598[i]);
  }
  // Fibers: 12 per tube, also in TIA-598 order. Hydrate the project
  // and inspect.
  const hydrate = await requestJson('GET', `/api/splice/projects/${proj.id}`, { token });
  assert.equal(hydrate.fibers.length, 48);
  // Spot-check the first tube's 12 fibers.
  const firstTube = hydrate.buffer_tubes.find(t => t.position === 1);
  const firstTubeFibers = hydrate.fibers
    .filter(f => f.buffer_tube_id === firstTube.id)
    .sort((a, b) => a.position - b.position);
  assert.equal(firstTubeFibers.length, 12);
  for (let i = 0; i < 12; i++) {
    assert.equal(firstTubeFibers[i].position, i + 1);
    assert.equal(firstTubeFibers[i].color, TIA_598[i]);
  }
});

test('POST cable rejects non-canonical fiber_count', async () => {
  const proj = await makeProject('test-bad-fc-' + Date.now());
  const res = await request('POST', `/api/splice/projects/${proj.id}/cables`, {
    token, body: { name: 'C', fiber_count: 100, construction_type: 'ribbon' },
  });
  assert.equal(res.status, 400);
});

test('lock / heartbeat / unlock cycle, plus heartbeat-from-stranger refusal', async () => {
  const proj = await makeProject('test-lock-' + Date.now());
  // Acquire — admin login has a staff_id only if seeded; we just verify
  // the lock endpoint completes and the project reflects ownership.
  const r1 = await requestJson('POST', `/api/splice/projects/${proj.id}/lock`, { token });
  assert.equal(r1.ok, true);
  assert.ok(r1.locked_at);
  // Heartbeat as the same user — allowed.
  const r2 = await requestJson('POST', `/api/splice/projects/${proj.id}/heartbeat`, { token });
  assert.equal(r2.ok, true);
  // Direct DB shove: pretend somebody else owns the lock. Uses the
  // strangerStaffId from before() because locked_by_staff_id is a real
  // FK and a fake UUID would trip the constraint.
  await pool.query(
    `UPDATE splice_projects
       SET locked_by_staff_id = $2,
           locked_by_name = 'someone else',
           locked_at = NOW()
     WHERE id = $1`,
    [proj.id, strangerStaffId]
  );
  // Heartbeat now should 409 (lock no longer held by us).
  const r3 = await request('POST', `/api/splice/projects/${proj.id}/heartbeat`, { token });
  assert.equal(r3.status, 409);
  // Unlock as admin (admin can release anyone's lock per the route logic).
  const r4 = await requestJson('POST', `/api/splice/projects/${proj.id}/unlock`, { token });
  assert.equal(r4.ok, true);
  // Re-acquire after release.
  const r5 = await requestJson('POST', `/api/splice/projects/${proj.id}/lock`, { token });
  assert.equal(r5.ok, true);
});

test('ribbon splice creates 12 splices linked to one ribbon group', async () => {
  const proj = await makeProject('test-ribbon-' + Date.now());
  // Two location anchors so cables route somewhere.
  const locA = await requestJson('POST', `/api/splice/projects/${proj.id}/locations`, {
    token, body: { name: 'A' },
  });
  const locB = await requestJson('POST', `/api/splice/projects/${proj.id}/locations`, {
    token, body: { name: 'B' },
  });
  // Two 12-fiber cables and a closure with one tray.
  const cableA = await requestJson('POST', `/api/splice/projects/${proj.id}/cables`, {
    token, body: { name: 'CA', fiber_count: 12, construction_type: 'ribbon',
                   from_location_id: locA.id, to_location_id: locB.id },
  });
  const cableB = await requestJson('POST', `/api/splice/projects/${proj.id}/cables`, {
    token, body: { name: 'CB', fiber_count: 12, construction_type: 'ribbon',
                   from_location_id: locA.id, to_location_id: locB.id },
  });
  const closure = await requestJson('POST', `/api/splice/locations/${locA.id}/closures`, {
    token, body: { model: 'TEST-MODEL-X', tray_count: 1, tray_capacity: 12 },
  });
  const trayId = closure.trays[0].id;

  // Fetch fibers grouped by cable.
  const hydrate = await requestJson('GET', `/api/splice/projects/${proj.id}`, { token });
  const fibersA = hydrate.fibers
    .filter(f => hydrate.buffer_tubes.find(t => t.id === f.buffer_tube_id && t.cable_id === cableA.cable.id))
    .sort((a, b) => a.position - b.position);
  const fibersB = hydrate.fibers
    .filter(f => hydrate.buffer_tubes.find(t => t.id === f.buffer_tube_id && t.cable_id === cableB.cable.id))
    .sort((a, b) => a.position - b.position);
  assert.equal(fibersA.length, 12);
  assert.equal(fibersB.length, 12);

  const pairs = fibersA.map((fa, i) => ({ fiber_a_id: fa.id, fiber_b_id: fibersB[i].id }));
  const r = await requestJson('POST', `/api/splice/trays/${trayId}/ribbon-splice`, {
    token, body: { pairs },
  });
  assert.ok(r.ribbon_group?.id);
  assert.equal(r.splices.length, 12);
  // Every splice points at the same ribbon_group and the right tray.
  for (const s of r.splices) {
    assert.equal(s.ribbon_group_id, r.ribbon_group.id);
    assert.equal(s.tray_id, trayId);
  }
});

test('single splice respects tray capacity', async () => {
  const proj = await makeProject('test-cap-' + Date.now());
  const loc = await requestJson('POST', `/api/splice/projects/${proj.id}/locations`, {
    token, body: { name: 'L' },
  });
  const cableA = await requestJson('POST', `/api/splice/projects/${proj.id}/cables`, {
    token, body: { name: 'A', fiber_count: 24, construction_type: 'loose_tube' },
  });
  const cableB = await requestJson('POST', `/api/splice/projects/${proj.id}/cables`, {
    token, body: { name: 'B', fiber_count: 24, construction_type: 'loose_tube' },
  });
  // Tiny tray: capacity 2.
  const closure = await requestJson('POST', `/api/splice/locations/${loc.id}/closures`, {
    token, body: { model: 'TEST-CAP', tray_count: 1, tray_capacity: 2 },
  });
  const trayId = closure.trays[0].id;
  const hydrate = await requestJson('GET', `/api/splice/projects/${proj.id}`, { token });
  const aFibers = hydrate.fibers.filter(f =>
    hydrate.buffer_tubes.find(t => t.id === f.buffer_tube_id && t.cable_id === cableA.cable.id)
  );
  const bFibers = hydrate.fibers.filter(f =>
    hydrate.buffer_tubes.find(t => t.id === f.buffer_tube_id && t.cable_id === cableB.cable.id)
  );
  // Two splices fit; third should 409.
  await requestJson('POST', `/api/splice/trays/${trayId}/splices`, {
    token, body: { fiber_a_id: aFibers[0].id, fiber_b_id: bFibers[0].id },
  });
  await requestJson('POST', `/api/splice/trays/${trayId}/splices`, {
    token, body: { fiber_a_id: aFibers[1].id, fiber_b_id: bFibers[1].id },
  });
  const overcap = await request('POST', `/api/splice/trays/${trayId}/splices`, {
    token, body: { fiber_a_id: aFibers[2].id, fiber_b_id: bFibers[2].id },
  });
  assert.equal(overcap.status, 409);
});

test('closure_models picklist grows on every POST', async () => {
  const proj = await makeProject('test-models-' + Date.now());
  const loc = await requestJson('POST', `/api/splice/projects/${proj.id}/locations`, {
    token, body: { name: 'L' },
  });
  const modelName = 'PICKLIST-TEST-' + Math.random().toString(36).slice(2, 8);
  await requestJson('POST', `/api/splice/locations/${loc.id}/closures`, {
    token, body: { model: modelName, tray_count: 6, tray_capacity: 12 },
  });
  await requestJson('POST', `/api/splice/locations/${loc.id}/closures`, {
    token, body: { model: modelName, tray_count: 6, tray_capacity: 12 },
  });
  const list = await requestJson('GET', '/api/splice/closure-models', { token });
  const ours = list.find(m => m.model === modelName);
  assert.ok(ours, 'model name should appear in picklist');
  assert.equal(ours.use_count, 2, 'use_count should bump to 2 after a second POST');
});

test('hydrate returns full bundle including warnings', async () => {
  const proj = await makeProject('test-hydrate-' + Date.now());
  const loc = await requestJson('POST', `/api/splice/projects/${proj.id}/locations`, {
    token, body: { name: 'X' },
  });
  await requestJson('POST', `/api/splice/projects/${proj.id}/cables`, {
    token, body: { name: 'C1', fiber_count: 12, construction_type: 'ribbon' },
  });
  const hydrate = await requestJson('GET', `/api/splice/projects/${proj.id}`, { token });
  assert.equal(hydrate.project.id, proj.id);
  assert.equal(hydrate.locations.length, 1);
  assert.equal(hydrate.cables.length, 1);
  assert.equal(hydrate.buffer_tubes.length, 1);
  assert.equal(hydrate.fibers.length, 12);
  assert.ok(hydrate.warnings);
  assert.equal(hydrate.warnings.unspliced_fiber_count, 12);
  assert.equal(hydrate.warnings.total_fibers, 12);
  assert.equal(hydrate.warnings.total_splices, 0);
});

test('PUT closure refuses shrink when the dropped trays still hold splices', async () => {
  const proj = await makeProject('test-shrink-' + Date.now());
  const loc = await requestJson('POST', `/api/splice/projects/${proj.id}/locations`, {
    token, body: { name: 'L' },
  });
  const cableA = await requestJson('POST', `/api/splice/projects/${proj.id}/cables`, {
    token, body: { name: 'A', fiber_count: 12, construction_type: 'ribbon' },
  });
  const cableB = await requestJson('POST', `/api/splice/projects/${proj.id}/cables`, {
    token, body: { name: 'B', fiber_count: 12, construction_type: 'ribbon' },
  });
  // 2-tray closure; drop a splice into tray 2 and try to shrink to 1 tray.
  const closure = await requestJson('POST', `/api/splice/locations/${loc.id}/closures`, {
    token, body: { tray_count: 2, tray_capacity: 12 },
  });
  const tray2 = closure.trays.find(t => t.position === 2);
  const hydrate = await requestJson('GET', `/api/splice/projects/${proj.id}`, { token });
  const aFiber = hydrate.fibers.find(f =>
    hydrate.buffer_tubes.find(t => t.id === f.buffer_tube_id && t.cable_id === cableA.cable.id)
  );
  const bFiber = hydrate.fibers.find(f =>
    hydrate.buffer_tubes.find(t => t.id === f.buffer_tube_id && t.cable_id === cableB.cable.id)
  );
  await requestJson('POST', `/api/splice/trays/${tray2.id}/splices`, {
    token, body: { fiber_a_id: aFiber.id, fiber_b_id: bFiber.id },
  });
  const shrink = await request('PUT', `/api/splice/closures/${closure.closure.id}`, {
    token, body: { tray_count: 1 },
  });
  assert.equal(shrink.status, 409);
});
