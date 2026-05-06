// Smoke tests for the map UX additions landed in d13323f / 63695bd.
//
// What's under test:
//   - POST /api/splice/projects/:id/locations now accepts latitude +
//     longitude in the body so the map's place-on-click can create a
//     fully-located row in one round-trip.
//   - splice_locations.type CHECK enum extended with handhole, manhole,
//     pole, pedestal, vault (migration 0018).
//   - GET /api/splice/projects/:id annotates each cable with
//     path_length_feet (haversine over path_geojson coordinates).

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
    } catch (e) { console.warn('[map-ux-cleanup]', e.message); }
  }
  await close();
});

async function makeProject(label) {
  const proj = await requestJson('POST', '/api/splice/projects', {
    token, body: { name: uniqueTag(label || 'map-ux') },
  });
  createdSpliceProjectIds.push(proj.id);
  return proj;
}

// ─── Tests ────────────────────────────────────────────────────────────────

test('POST /locations accepts latitude + longitude inline', async () => {
  const proj = await makeProject('loc-with-coords');
  const r = await requestJson('POST', `/api/splice/projects/${proj.id}/locations`, {
    token, body: { name: 'HH-12', type: 'handhole', latitude: 32.8625, longitude: -83.6736 },
  });
  assert.equal(r.name, 'HH-12');
  assert.equal(r.type, 'handhole');
  assert.equal(Number(r.latitude),  32.8625);
  assert.equal(Number(r.longitude), -83.6736);
});

test('splice_locations.type enum accepts the new OSP types', async () => {
  const proj = await makeProject('loc-types');
  for (const t of ['handhole', 'manhole', 'pole', 'pedestal', 'vault']) {
    const r = await requestJson('POST', `/api/splice/projects/${proj.id}/locations`, {
      token, body: { name: t.toUpperCase(), type: t },
    });
    assert.equal(r.type, t, `should accept type=${t}`);
  }
});

test('Cable hydrate annotates path_length_feet from the haversine over path_geojson', async () => {
  const proj = await makeProject('cable-footage');
  const cable = await requestJson('POST', `/api/splice/projects/${proj.id}/cables`, {
    token, body: { name: 'A', fiber_count: 12, construction_type: 'ribbon' },
  });
  // No path yet → footage should be 0 or null.
  let h = await requestJson('GET', `/api/splice/projects/${proj.id}`, { token });
  let cableRow = h.cables.find(c => c.id === cable.cable.id);
  assert.ok(cableRow.path_length_feet == null || Number(cableRow.path_length_feet) === 0,
    `expected 0/null path_length_feet without a path, got ${cableRow.path_length_feet}`);

  // Set a known path: ~0.01 degree of latitude north = ~3,640 ft. Pick
  // two coordinates straight north so the haversine is simple to reason
  // about: from (lon -83.6, lat 32.86) to (lon -83.6, lat 32.87) is
  // 0.01° of latitude = ~6076 ft × 0.01 / (1/60) = ~3,651 ft per degree
  // for a nautical-mile-derived approximation. Allow a 5% tolerance.
  await requestJson('PUT', `/api/splice/cables/${cable.cable.id}/path`, {
    token,
    body: {
      path_geojson: {
        type: 'LineString',
        coordinates: [[-83.6, 32.86], [-83.6, 32.87]],
      },
    },
  });
  h = await requestJson('GET', `/api/splice/projects/${proj.id}`, { token });
  cableRow = h.cables.find(c => c.id === cable.cable.id);
  const ft = Number(cableRow.path_length_feet);
  assert.ok(Number.isFinite(ft), `path_length_feet should be a number, got ${cableRow.path_length_feet}`);
  // 0.01° latitude ≈ 3,651 ft. Accept 3,400–3,900.
  assert.ok(ft > 3400 && ft < 3900,
    `expected path_length_feet ≈ 3651 for 0.01° latitude span, got ${ft}`);
});

test('Cable hydrate footage is the SUM of segment haversines, not just endpoints', async () => {
  const proj = await makeProject('cable-segments');
  const cable = await requestJson('POST', `/api/splice/projects/${proj.id}/cables`, {
    token, body: { name: 'C', fiber_count: 12, construction_type: 'ribbon' },
  });
  // Three-point zigzag: start → north → east → start (a triangle).
  // Forces the helper to walk every segment, not just first→last.
  await requestJson('PUT', `/api/splice/cables/${cable.cable.id}/path`, {
    token,
    body: {
      path_geojson: {
        type: 'LineString',
        coordinates: [[-83.6, 32.86], [-83.6, 32.87], [-83.59, 32.86]],
      },
    },
  });
  const h = await requestJson('GET', `/api/splice/projects/${proj.id}`, { token });
  const cableRow = h.cables.find(c => c.id === cable.cable.id);
  const ft = Number(cableRow.path_length_feet);
  // Two segments: the 0.01° north (~3651 ft) plus the diagonal
  // (sqrt(0.01² + 0.01°-cos-corrected²) × ft-per-deg). Lower bound: a
  // single straight line from first to last (the diagonal) is ~5161 ft.
  // Properly summed: ~3651 + ~5161 = ~8800 ft. Anything <6000 means
  // the helper used a single-pair haversine instead of summing.
  assert.ok(ft > 6500,
    `expected sum of segment lengths (~8800 ft), got ${ft} — helper may be ignoring intermediate waypoints`);
});

test('POST /locations rejects an invalid type', async () => {
  const proj = await makeProject('loc-bad-type');
  const r = await request('POST', `/api/splice/projects/${proj.id}/locations`, {
    token, body: { name: 'x', type: 'NotARealType' },
  });
  assert.notEqual(r.status, 200);
});
