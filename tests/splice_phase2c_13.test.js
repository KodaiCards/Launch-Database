// Smoke tests for Splice Matrix Phase 2C #13 — CSV / Excel paste import.
//
// Endpoint under test:
//   POST /api/splice/projects/:id/import-paste
//
// Body: { rows: [...], kind: 'cables' | 'locations', column_mapping? }
// The endpoint feeds rows through the same _diffIngestAgainstLive +
// _stageImport pipeline as KMZ/DXF imports. Verifies staged imports
// land in splice_design_imports with source_format='csv', changes
// land as 'add' rows for new entities, and the existing apply path
// commits them to the live tree.

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
    } catch (e) { console.warn('[phase2c13-cleanup]', e.message); }
  }
  await close();
});

async function makeProject(label) {
  const proj = await requestJson('POST', '/api/splice/projects', {
    token, body: { name: uniqueTag(label || 'phase2c13') },
  });
  createdSpliceProjectIds.push(proj.id);
  return proj;
}

// ─── Tests ────────────────────────────────────────────────────────────────

test('POST /import-paste with cables stages adds in splice_design_imports', async () => {
  const proj = await makeProject('paste-cables');
  const r = await requestJson('POST', `/api/splice/projects/${proj.id}/import-paste`, {
    token,
    body: {
      kind: 'cables',
      rows: [
        { name: 'paste-cable-1', fiber_count: 144, construction_type: 'ribbon' },
        { name: 'paste-cable-2', fiber_count: 288, construction_type: 'loose_tube' },
      ],
    },
  });
  assert.ok(r.import?.id, 'returns staged import');
  assert.equal(r.summary.adds.cables, 2);
  assert.equal(r.summary.adds.locations, 0);
  // Verify the import row's source_format is 'csv'.
  const detail = await requestJson('GET', `/api/splice/imports/${r.import.id}`, { token });
  assert.equal(detail.import.source_format, 'csv');
  // Two 'add' change rows for cables.
  const cableAdds = detail.changes.filter(c =>
    c.target_table === 'splice_cables' && c.change_type === 'add'
  );
  assert.equal(cableAdds.length, 2);
});

test('POST /import-paste with locations stages adds with lat/lon', async () => {
  const proj = await makeProject('paste-locations');
  const r = await requestJson('POST', `/api/splice/projects/${proj.id}/import-paste`, {
    token,
    body: {
      kind: 'locations',
      rows: [
        { name: 'paste-loc-A', latitude: 38.9, longitude: -77.0, type: 'splice_point' },
        { name: 'paste-loc-B', latitude: 38.95, longitude: -77.1 },
      ],
    },
  });
  assert.ok(r.import?.id);
  assert.equal(r.summary.adds.locations, 2);
  const detail = await requestJson('GET', `/api/splice/imports/${r.import.id}`, { token });
  const locAdds = detail.changes.filter(c =>
    c.target_table === 'splice_locations' && c.change_type === 'add'
  );
  assert.equal(locAdds.length, 2);
  // Payload preserves coords.
  const a = locAdds.find(c => c.payload_jsonb?.name === 'paste-loc-A');
  assert.ok(a);
  assert.equal(Number(a.payload_jsonb.latitude),  38.9);
  assert.equal(Number(a.payload_jsonb.longitude), -77.0);
});

test('POST /import-paste rejects bad kind', async () => {
  const proj = await makeProject('paste-bad-kind');
  const r = await request('POST', `/api/splice/projects/${proj.id}/import-paste`, {
    token, body: { kind: 'closures', rows: [{ name: 'x' }] },
  });
  assert.equal(r.status, 400);
});

test('POST /import-paste round-trip: name match against existing flips to update', async () => {
  const proj = await makeProject('paste-update');
  // Seed a location.
  const seed = await requestJson('POST', `/api/splice/projects/${proj.id}/locations`, {
    token, body: { name: 'L-existing' },
  });
  // Paste one row matching the seeded name + new coords. Should diff
  // as an update, not an add.
  const r = await requestJson('POST', `/api/splice/projects/${proj.id}/import-paste`, {
    token,
    body: {
      kind: 'locations',
      rows: [{ name: 'L-existing', latitude: 38.5, longitude: -77.5 }],
    },
  });
  assert.equal(r.summary.adds.locations, 0,
    'name match should NOT produce an add');
  assert.equal(r.summary.updates.locations, 1,
    'name match SHOULD produce an update');
  const detail = await requestJson('GET', `/api/splice/imports/${r.import.id}`, { token });
  const upd = detail.changes.find(c =>
    c.target_table === 'splice_locations' && c.change_type === 'update'
  );
  assert.ok(upd);
  assert.equal(upd.target_id, seed.id);
});

test('POST /import-paste cables: unknown from_location/to_location surfaces a warning', async () => {
  const proj = await makeProject('paste-unknown-locs');
  const r = await requestJson('POST', `/api/splice/projects/${proj.id}/import-paste`, {
    token,
    body: {
      kind: 'cables',
      rows: [{
        name: 'paste-cable',
        fiber_count: 144,
        construction_type: 'ribbon',
        from_location: 'NoSuchLoc-A',
        to_location:   'NoSuchLoc-B',
      }],
    },
  });
  // Cable still gets staged as an add (we don't auto-create locations).
  assert.equal(r.summary.adds.cables, 1);
  // Warnings array surfaces the unknown names.
  const warnings = (r.summary.warnings || []).join(' ');
  assert.match(warnings, /NoSuchLoc-A|NoSuchLoc-B|location/i,
    'expected a warning about unknown from/to_location');
});

test('Apply pipeline: pasted cable lands in live tree after approve + apply', async () => {
  const proj = await makeProject('paste-then-apply');
  const r = await requestJson('POST', `/api/splice/projects/${proj.id}/import-paste`, {
    token,
    body: {
      kind: 'cables',
      rows: [{ name: 'pasted-A', fiber_count: 24, construction_type: 'ribbon' }],
    },
  });
  const detail = await requestJson('GET', `/api/splice/imports/${r.import.id}`, { token });
  const add = detail.changes.find(c =>
    c.target_table === 'splice_cables' && c.change_type === 'add'
  );
  // Approve the change, then apply.
  await requestJson('POST',
    `/api/splice/imports/${r.import.id}/changes/${add.id}/decision`,
    { token, body: { decision: 'approved' } });
  const applied = await requestJson('POST',
    `/api/splice/imports/${r.import.id}/apply`, { token, body: {} });
  assert.ok(applied.applied >= 1);
  // Live tree now has the pasted cable + auto-generated buffer tubes
  // and fibers (24 fibers / 12 per tube = 2 tubes).
  const h = await requestJson('GET', `/api/splice/projects/${proj.id}`, { token });
  const cable = h.cables.find(c => c.name === 'pasted-A');
  assert.ok(cable, 'pasted cable should be in the live tree');
  assert.equal(cable.fiber_count, 24);
  const tubesForCable = h.buffer_tubes.filter(t => t.cable_id === cable.id);
  assert.equal(tubesForCable.length, 2);
  const fibersForCable = h.fibers.filter(f =>
    tubesForCable.some(t => t.id === f.buffer_tube_id)
  );
  assert.equal(fibersForCable.length, 24);
});
