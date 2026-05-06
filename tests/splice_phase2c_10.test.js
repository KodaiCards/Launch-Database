// Smoke tests for Splice Matrix Phase 2C #10 — slack / service loop modeling.
//
// Endpoints under test:
//   GET    /api/splice/projects/:id/cable-states
//   PUT    /api/splice/cables/:cableId/locations/:locationId/cable-state
//   DELETE /api/splice/cable-states/:id
//
// Plus hydrate inclusion and the UNIQUE(cable_id, location_id) constraint
// that turns the PUT into an UPSERT.

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
    } catch (e) { console.warn('[phase2c10-cleanup]', e.message); }
  }
  await close();
});

async function makeProjectWithCableAndLoc(label) {
  const proj = await requestJson('POST', '/api/splice/projects', {
    token, body: { name: uniqueTag(label || 'phase2c10') },
  });
  createdSpliceProjectIds.push(proj.id);
  const loc = await requestJson('POST', `/api/splice/projects/${proj.id}/locations`, {
    token, body: { name: 'L' },
  });
  const cable = await requestJson('POST', `/api/splice/projects/${proj.id}/cables`, {
    token, body: { name: 'A', fiber_count: 12, construction_type: 'ribbon' },
  });
  return { proj, locId: loc.id, cableId: cable.cable.id };
}

// ─── Tests ────────────────────────────────────────────────────────────────

test('PUT /cable-state creates a row and round-trips through hydrate', async () => {
  const { proj, locId, cableId } = await makeProjectWithCableAndLoc('slack-create');
  const r = await requestJson('PUT',
    `/api/splice/cables/${cableId}/locations/${locId}/cable-state`,
    { token, body: { slack_length_inches: 36, notes: 'Standard MH coil' } });
  assert.equal(Number(r.slack_length_inches), 36);
  assert.equal(r.notes, 'Standard MH coil');

  const h = await requestJson('GET', `/api/splice/projects/${proj.id}`, { token });
  assert.ok(Array.isArray(h.cable_states), 'hydrate carries cable_states');
  const row = h.cable_states.find(s => s.cable_id === cableId && s.location_id === locId);
  assert.ok(row);
  assert.equal(Number(row.slack_length_inches), 36);
});

test('PUT /cable-state is idempotent — second call updates the same row', async () => {
  const { proj, locId, cableId } = await makeProjectWithCableAndLoc('slack-upsert');
  await requestJson('PUT',
    `/api/splice/cables/${cableId}/locations/${locId}/cable-state`,
    { token, body: { slack_length_inches: 24 } });
  await requestJson('PUT',
    `/api/splice/cables/${cableId}/locations/${locId}/cable-state`,
    { token, body: { slack_length_inches: 48, notes: 'bumped' } });
  const h = await requestJson('GET', `/api/splice/projects/${proj.id}`, { token });
  const matches = h.cable_states.filter(s => s.cable_id === cableId && s.location_id === locId);
  assert.equal(matches.length, 1, 'UPSERT must NOT create a duplicate row');
  assert.equal(Number(matches[0].slack_length_inches), 48);
  assert.equal(matches[0].notes, 'bumped');
});

test('GET /projects/:id/cable-states lists every row', async () => {
  const { proj, locId, cableId } = await makeProjectWithCableAndLoc('slack-list');
  // Add a second cable + location at the same project.
  const loc2 = await requestJson('POST', `/api/splice/projects/${proj.id}/locations`, {
    token, body: { name: 'L2' },
  });
  const cable2 = await requestJson('POST', `/api/splice/projects/${proj.id}/cables`, {
    token, body: { name: 'B', fiber_count: 12, construction_type: 'ribbon' },
  });
  await requestJson('PUT',
    `/api/splice/cables/${cableId}/locations/${locId}/cable-state`,
    { token, body: { slack_length_inches: 12 } });
  await requestJson('PUT',
    `/api/splice/cables/${cable2.cable.id}/locations/${loc2.id}/cable-state`,
    { token, body: { slack_length_inches: 60, notes: 'long pull' } });
  const list = await requestJson('GET',
    `/api/splice/projects/${proj.id}/cable-states`, { token });
  assert.equal(list.length, 2);
});

test('DELETE /cable-states/:id removes the row', async () => {
  const { proj, locId, cableId } = await makeProjectWithCableAndLoc('slack-delete');
  const created = await requestJson('PUT',
    `/api/splice/cables/${cableId}/locations/${locId}/cable-state`,
    { token, body: { slack_length_inches: 24 } });
  await requestJson('DELETE', `/api/splice/cable-states/${created.id}`, { token });
  const h = await requestJson('GET', `/api/splice/projects/${proj.id}`, { token });
  const stillThere = (h.cable_states || []).find(s => s.id === created.id);
  assert.equal(stillThere, undefined);
});

test('PUT /cable-state rejects negative slack_length_inches', async () => {
  const { locId, cableId } = await makeProjectWithCableAndLoc('slack-negative');
  const r = await request('PUT',
    `/api/splice/cables/${cableId}/locations/${locId}/cable-state`,
    { token, body: { slack_length_inches: -5 } });
  assert.notEqual(r.status, 200,
    'CHECK (slack_length_inches >= 0) should reject negatives at write');
});

test('Cable delete CASCADEs cable_state rows', async () => {
  const { proj, locId, cableId } = await makeProjectWithCableAndLoc('slack-cascade');
  await requestJson('PUT',
    `/api/splice/cables/${cableId}/locations/${locId}/cable-state`,
    { token, body: { slack_length_inches: 24 } });
  // Delete the cable.
  await requestJson('DELETE', `/api/splice/cables/${cableId}`, { token });
  const h = await requestJson('GET', `/api/splice/projects/${proj.id}`, { token });
  const orphans = (h.cable_states || []).filter(s => s.cable_id === cableId);
  assert.equal(orphans.length, 0, 'cable_state rows should CASCADE-delete with the cable');
});

test('PUT /cable-state with only notes (no slack_length) still upserts', async () => {
  const { proj, locId, cableId } = await makeProjectWithCableAndLoc('slack-notes-only');
  const r = await requestJson('PUT',
    `/api/splice/cables/${cableId}/locations/${locId}/cable-state`,
    { token, body: { notes: 'designer-only annotation, slack TBD' } });
  assert.equal(r.notes, 'designer-only annotation, slack TBD');
  const h = await requestJson('GET', `/api/splice/projects/${proj.id}`, { token });
  const row = h.cable_states.find(s => s.cable_id === cableId && s.location_id === locId);
  assert.ok(row);
  assert.equal(row.notes, 'designer-only annotation, slack TBD');
  assert.equal(row.slack_length_inches, null);
});
