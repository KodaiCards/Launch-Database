// Smoke tests for Splice Matrix Phase 3 endpoints:
//
//   Phase 3A — PUT /api/splice/locations/:id/coords
//              PUT /api/splice/cables/:id/path
//   Phase 3B — GET /api/splice/projects/:id/export-kmz
//   Phase 3C — POST /api/splice/projects/:id/imports
//              GET  /api/splice/projects/:id/imports
//              GET  /api/splice/imports/:id
//              POST /api/splice/imports/:id/changes/:cid/decision
//              POST /api/splice/imports/:id/apply
//              DELETE /api/splice/imports/:id
//
// Known issues spotted in route code (not fixed here — surfaced for orchestrator):
//
//   ISSUE-1: export-kmz uses `archiver` (npm) rather than `adm-zip`, which
//   is already a dependency. If `archiver` is not installed the export route
//   throws a lazy-require error at request time, not at boot. Tests that
//   exercise the export on an environment without archiver will 500.
//
//   ISSUE-2: DELETE /api/splice/imports/:id returns 404 for any import
//   whose status is not 'pending' (including 'applied'). The task spec
//   says "DELETE on an already-applied import should 404 or behave per
//   the route handler" — confirmed 404 is the intended behavior, but the
//   error message is "Import not found or not pending" which is ambiguous.
//
//   ISSUE-3: Round-trip diff may produce phantom location-coordinate
//   updates if DECIMAL(10,7) values read back from Postgres differ
//   slightly from the parsed floats (e.g. trailing zeros). The diff
//   uses Number() coercion on both sides, so this should be safe, but
//   the test uses assert.equal(summary.updates.locations, 0) to catch
//   any regression.

'use strict';

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const AdmZip = require('adm-zip');
const {
  bootTestServer, close, adminLogin, requestJson, request, pool, baseUrl, uniqueTag,
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
    } catch (e) { console.warn('[splice-phase3-cleanup]', e.message); }
  }
  await close();
});

// ─── Helpers ────────────────────────────────────────────────────────────────

async function makeProject(label) {
  const name = uniqueTag(label || 'phase3-test');
  const proj = await requestJson('POST', '/api/splice/projects', {
    token, body: { name }, expectStatus: 200,
  });
  createdSpliceProjectIds.push(proj.id);
  return proj;
}

async function addLocation(projId, name) {
  return requestJson('POST', `/api/splice/projects/${projId}/locations`, {
    token, body: { name: name || uniqueTag('loc') },
  });
}

async function addCable(projId, name) {
  return requestJson('POST', `/api/splice/projects/${projId}/cables`, {
    token, body: { name: name || uniqueTag('cable'), fiber_count: 12, construction_type: 'ribbon' },
  });
}

function buildKmz(kml) {
  const z = new AdmZip();
  z.addFile('doc.kml', Buffer.from(kml, 'utf8'));
  return z.toBuffer();
}

function minimalKml(projName) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2"><Document>
<name>${projName || 'test'}</name>
<Placemark><name>test-location</name>
  <Point><coordinates>-77.0,38.9,0</coordinates></Point>
</Placemark>
<Placemark><name>test-cable</name>
  <ExtendedData><Data name="fiber_count"><value>144</value></Data></ExtendedData>
  <LineString><coordinates>-77.0,38.9,0 -77.1,38.95,0</coordinates></LineString>
</Placemark>
</Document></kml>`;
}

async function uploadKmz(projId, kmzBuf, filename) {
  const fd = new FormData();
  fd.set('file', new Blob([kmzBuf], { type: 'application/vnd.google-earth.kmz' }), filename || 'test.kmz');
  const res = await fetch(`${baseUrl()}/api/splice/projects/${projId}/imports`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });
  return res;
}

// ─── Test 1: PUT /coords sets lat/lon ────────────────────────────────────────

test('PUT /coords sets latitude and longitude on a location', async () => {
  const proj = await makeProject('phase3-coords-set');
  const loc = await addLocation(proj.id, 'GeoLoc-1');

  const coordRes = await requestJson('PUT', `/api/splice/locations/${loc.id}/coords`, {
    token,
    body: { latitude: 38.9, longitude: -77.0 },
  });
  assert.ok(coordRes.id, 'response should include location id');
  assert.equal(Number(coordRes.latitude), 38.9);
  assert.equal(Number(coordRes.longitude), -77.0);

  // Verify the value persists via hydrate.
  const hydrate = await requestJson('GET', `/api/splice/projects/${proj.id}`, { token });
  const hydratedLoc = hydrate.locations.find(l => l.id === loc.id);
  assert.ok(hydratedLoc, 'location must appear in hydrate');
  assert.equal(Number(hydratedLoc.latitude), 38.9);
  assert.equal(Number(hydratedLoc.longitude), -77.0);
});

// ─── Test 2: PUT /coords rejects out-of-range ─────────────────────────────

test('PUT /coords rejects latitude out of range', async () => {
  const proj = await makeProject('phase3-coords-reject');
  const loc = await addLocation(proj.id, 'BadLoc');

  const res = await request('PUT', `/api/splice/locations/${loc.id}/coords`, {
    token,
    body: { latitude: 91, longitude: 0 },
  });
  assert.equal(res.status, 400);
});

// ─── Test 3: PUT cable path stores LineString ─────────────────────────────

test('PUT /cables/:id/path stores a 3-point LineString and round-trips via hydrate', async () => {
  const proj = await makeProject('phase3-path-set');
  const cableRes = await addCable(proj.id, 'PathCable');
  const cableId = cableRes.cable.id;

  const lineString = {
    type: 'LineString',
    coordinates: [[-77.0, 38.9], [-77.05, 38.92], [-77.1, 38.95]],
  };
  const pathRes = await requestJson('PUT', `/api/splice/cables/${cableId}/path`, {
    token,
    body: { path_geojson: lineString },
  });
  assert.equal(pathRes.path_geojson.type, 'LineString');
  assert.equal(pathRes.path_geojson.coordinates.length, 3);

  // Verify persistence via hydrate.
  const hydrate = await requestJson('GET', `/api/splice/projects/${proj.id}`, { token });
  const cable = hydrate.cables.find(c => c.id === cableId);
  assert.ok(cable, 'cable must appear in hydrate');
  assert.ok(cable.path_geojson, 'path_geojson should be present');
  assert.equal(cable.path_geojson.type, 'LineString');
  assert.equal(cable.path_geojson.coordinates.length, 3);
  // Spot-check one coordinate [lon, lat].
  assert.equal(Number(cable.path_geojson.coordinates[0][0]), -77.0);
  assert.equal(Number(cable.path_geojson.coordinates[0][1]), 38.9);
});

// ─── Test 4: PUT cable path rejects bad shape ─────────────────────────────

test('PUT /cables/:id/path rejects non-LineString and out-of-range coordinates', async () => {
  const proj = await makeProject('phase3-path-reject');
  const cableRes = await addCable(proj.id, 'BadPathCable');
  const cableId = cableRes.cable.id;

  // Non-LineString type.
  const badType = await request('PUT', `/api/splice/cables/${cableId}/path`, {
    token,
    body: { path_geojson: { type: 'Point', coordinates: [-77.0, 38.9] } },
  });
  assert.equal(badType.status, 400, 'Point geometry should be rejected');

  // Only one coordinate point (< 2 required).
  const tooFew = await request('PUT', `/api/splice/cables/${cableId}/path`, {
    token,
    body: { path_geojson: { type: 'LineString', coordinates: [[-77.0, 38.9]] } },
  });
  assert.equal(tooFew.status, 400, 'single-point LineString should be rejected');

  // Latitude out of range (GeoJSON is [lon, lat], so pt[1] = lat).
  const badLat = await request('PUT', `/api/splice/cables/${cableId}/path`, {
    token,
    body: { path_geojson: { type: 'LineString', coordinates: [[-77.0, 100], [-77.1, 38.95]] } },
  });
  assert.equal(badLat.status, 400, 'lat > 90 should be rejected');
});

// ─── Test 5: GET /export-kmz returns a real KMZ ──────────────────────────

test('GET /export-kmz returns valid KMZ with doc.kml containing project name and Placemarks', async () => {
  const proj = await makeProject('phase3-export-kmz');

  // Add a location with coords.
  const loc = await addLocation(proj.id, 'ExportLoc');
  await requestJson('PUT', `/api/splice/locations/${loc.id}/coords`, {
    token,
    body: { latitude: 38.9, longitude: -77.0 },
  });

  // Add a cable with a path.
  const cableRes = await addCable(proj.id, 'ExportCable');
  await requestJson('PUT', `/api/splice/cables/${cableRes.cable.id}/path`, {
    token,
    body: {
      path_geojson: {
        type: 'LineString',
        coordinates: [[-77.0, 38.9], [-77.1, 38.95]],
      },
    },
  });

  const res = await request('GET', `/api/splice/projects/${proj.id}/export-kmz`, { token });
  assert.equal(res.status, 200, 'export should return 200');
  const ct = res.headers.get('content-type') || '';
  assert.match(ct, /application\/vnd\.google-earth\.kmz/,
    'Content-Type must be application/vnd.google-earth.kmz');

  const buf = Buffer.from(await res.arrayBuffer());
  assert.ok(buf.length > 0, 'response body must be non-empty');

  // Unzip and inspect doc.kml.
  const zip = new AdmZip(buf);
  const entry = zip.getEntry('doc.kml');
  assert.ok(entry, 'KMZ must contain doc.kml at archive root');

  const kml = zip.readAsText(entry);
  assert.match(kml, /<Placemark>/,
    'doc.kml must contain at least one <Placemark>');
  // The project name should appear in the KML document.
  assert.ok(kml.includes(proj.name), 'doc.kml must contain the project name');
});

// ─── Test 6: POST /imports rejects unsupported extension ─────────────────

test('POST /imports rejects upload with unsupported file extension (.txt)', async () => {
  const proj = await makeProject('phase3-import-badext');

  const fd = new FormData();
  fd.set('file', new Blob(['hello world'], { type: 'text/plain' }), 'data.txt');
  const res = await fetch(`${baseUrl()}/api/splice/projects/${proj.id}/imports`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });
  assert.equal(res.status, 400, 'txt upload should be rejected with 400');
  const body = await res.json();
  assert.ok(body.error, 'error message should be present');
});

// ─── Test 7: POST /imports stages a KMZ ──────────────────────────────────

let stagedImportId;   // reused by tests 8, 9, 10
let stagedProjId;

test('POST /imports stages a hand-built KMZ and returns summary with adds', async () => {
  const proj = await makeProject('phase3-import-kmz');
  stagedProjId = proj.id;

  const buf = buildKmz(minimalKml('test'));
  const res = await uploadKmz(proj.id, buf);
  assert.equal(res.status, 200, 'KMZ upload should succeed: ' + (await res.clone().text()));
  const body = await res.json();

  assert.ok(body.import?.id, 'response must have import.id');
  assert.ok(body.summary, 'response must have summary');
  assert.ok(body.summary.adds.locations >= 1,
    `expected >= 1 location add, got ${body.summary.adds.locations}`);
  assert.ok(body.summary.adds.cables >= 1,
    `expected >= 1 cable add, got ${body.summary.adds.cables}`);

  stagedImportId = body.import.id;

  // Nothing should have landed in the live tree yet.
  const hydrate = await requestJson('GET', `/api/splice/projects/${proj.id}`, { token });
  assert.equal(hydrate.locations.length, 0,
    'staging must not mutate live locations');
  assert.equal(hydrate.cables.length, 0,
    'staging must not mutate live cables');
});

// ─── Test 8: GET /imports/:id returns staged changes ─────────────────────

test('GET /imports/:id returns import detail with changes array', async () => {
  assert.ok(stagedImportId, 'depends on test 7 — stagedImportId must be set');

  const detail = await requestJson('GET', `/api/splice/imports/${stagedImportId}`, { token });
  assert.ok(detail.import?.id, 'detail must have import.id');
  assert.equal(detail.import.id, stagedImportId);
  assert.ok(Array.isArray(detail.changes), 'changes must be an array');
  assert.ok(detail.changes.length >= 2,
    `expected >= 2 change rows (1 location + 1 cable), got ${detail.changes.length}`);

  // Every change should have change_type 'add' and decision 'pending'.
  for (const c of detail.changes) {
    assert.equal(c.change_type, 'add', `unexpected change_type: ${c.change_type}`);
    assert.equal(c.decision, 'pending', `unexpected decision: ${c.decision}`);
    assert.ok(
      c.target_table === 'splice_locations' || c.target_table === 'splice_cables',
      `unexpected target_table: ${c.target_table}`
    );
  }
});

// ─── Test 9: POST decision flips a change ────────────────────────────────

let approvedChangeId;

test('POST /imports/:id/changes/:cid/decision flips decision to approved', async () => {
  assert.ok(stagedImportId, 'depends on test 7');

  const detail = await requestJson('GET', `/api/splice/imports/${stagedImportId}`, { token });
  const firstChange = detail.changes[0];
  assert.ok(firstChange, 'need at least one change');

  const decRes = await requestJson(
    'POST',
    `/api/splice/imports/${stagedImportId}/changes/${firstChange.id}/decision`,
    { token, body: { decision: 'approved', comment: 'looks good' } }
  );
  assert.equal(decRes.decision, 'approved');
  assert.equal(decRes.decision_comment, 'looks good');

  // Refetch detail to confirm persistence.
  const detail2 = await requestJson('GET', `/api/splice/imports/${stagedImportId}`, { token });
  const updated = detail2.changes.find(c => c.id === firstChange.id);
  assert.ok(updated, 'changed row must appear in detail');
  assert.equal(updated.decision, 'approved');

  approvedChangeId = firstChange.id;
});

// ─── Test 10: POST /apply commits approved changes ────────────────────────

test('POST /imports/:id/apply commits approved changes to the live tree', async () => {
  assert.ok(stagedImportId, 'depends on test 7');
  assert.ok(stagedProjId, 'depends on test 7');

  // Approve ALL pending changes so apply has something to commit.
  const detail = await requestJson('GET', `/api/splice/imports/${stagedImportId}`, { token });
  for (const c of detail.changes) {
    if (c.decision !== 'approved') {
      await requestJson(
        'POST',
        `/api/splice/imports/${stagedImportId}/changes/${c.id}/decision`,
        { token, body: { decision: 'approved' } }
      );
    }
  }

  const applyRes = await requestJson('POST', `/api/splice/imports/${stagedImportId}/apply`, {
    token, body: {},
  });
  assert.ok(applyRes.ok, 'apply must return ok: true');
  assert.ok(applyRes.applied > 0, `applied count must be > 0, got ${applyRes.applied}`);

  // The live project should now have the imported entities.
  const hydrate = await requestJson('GET', `/api/splice/projects/${stagedProjId}`, { token });
  assert.ok(hydrate.locations.length >= 1,
    'live project must have at least one location after apply');
  assert.ok(hydrate.cables.length >= 1,
    'live project must have at least one cable after apply');
});

// ─── Test 11: DELETE /imports/:id rejects a pending import ───────────────

test('DELETE /imports/:id rejects pending import; DELETE applied import returns 404', async () => {
  // Create a fresh project + fresh pending import.
  const proj = await makeProject('phase3-delete-import');
  const buf = buildKmz(minimalKml('del-test'));
  const upRes = await uploadKmz(proj.id, buf);
  assert.equal(upRes.status, 200);
  const { import: imp } = await upRes.json();

  // DELETE while pending — should succeed and flip status to 'rejected'.
  const delRes = await request('DELETE', `/api/splice/imports/${imp.id}`, { token });
  assert.equal(delRes.status, 200);

  // Verify status is now 'rejected'.
  const detail = await requestJson('GET', `/api/splice/imports/${imp.id}`, { token });
  assert.equal(detail.import.status, 'rejected');

  // DELETE again — route uses WHERE status = 'pending', so 'rejected' row
  // won't match → 404 "Import not found or not pending".
  const del2 = await request('DELETE', `/api/splice/imports/${imp.id}`, { token });
  assert.equal(del2.status, 404);

  // DELETE an already-applied import also returns 404 (not pending).
  // Use the import from test 10 (stagedImportId) which is now 'applied'.
  if (stagedImportId) {
    const del3 = await request('DELETE', `/api/splice/imports/${stagedImportId}`, { token });
    assert.equal(del3.status, 404);
  }
});

// ─── Test 12: Round-trip export → re-import has zero adds ────────────────

test('Round-trip export → re-import produces zero adds (rebind via ExtendedData IDs)', async () => {
  const proj = await makeProject('phase3-roundtrip');

  // Seed a location with coords and a cable with a path.
  const loc = await addLocation(proj.id, 'RT-Loc');
  await requestJson('PUT', `/api/splice/locations/${loc.id}/coords`, {
    token,
    body: { latitude: 39.1, longitude: -77.2 },
  });
  const cableRes = await addCable(proj.id, 'RT-Cable');
  await requestJson('PUT', `/api/splice/cables/${cableRes.cable.id}/path`, {
    token,
    body: {
      path_geojson: {
        type: 'LineString',
        coordinates: [[-77.2, 39.1], [-77.3, 39.15]],
      },
    },
  });

  // Export to KMZ.
  const exportRes = await request('GET', `/api/splice/projects/${proj.id}/export-kmz`, { token });
  assert.equal(exportRes.status, 200, 'export must succeed');
  const kmzBuf = Buffer.from(await exportRes.arrayBuffer());
  assert.ok(kmzBuf.length > 0);

  // Re-import the exported KMZ.
  const reimportRes = await uploadKmz(proj.id, kmzBuf, 'roundtrip.kmz');
  assert.equal(reimportRes.status, 200,
    'round-trip re-import should succeed: ' + (await reimportRes.clone().text()));
  const { import: reimp, summary } = await reimportRes.json();

  // Rebind via splice_location_id / splice_cable_id means NO new entities.
  assert.equal(summary.adds.locations, 0,
    `expected 0 location adds on round-trip, got ${summary.adds.locations}`);
  assert.equal(summary.adds.cables, 0,
    `expected 0 cable adds on round-trip, got ${summary.adds.cables}`);

  // Typically no updates either since the data hasn't changed.
  // We assert this separately so a regression in coordinate serialization
  // is caught without failing the primary adds assertion.
  assert.equal(summary.updates.locations, 0,
    `expected 0 location updates on round-trip, got ${summary.updates.locations}`);
  assert.equal(summary.updates.cables, 0,
    `expected 0 cable updates on round-trip, got ${summary.updates.cables}`);
});
